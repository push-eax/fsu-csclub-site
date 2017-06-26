#!/usr/bin/env python3
#used for sha-256 hashing
import hashlib
#Used for connecting to MySQL
import mysql.connector
#Used for creating random auth strings
import random;
#used for updating the timestamp on those random auth strings
import time;
#used for parsing mode variables and extracting individual booleans from them
from utilparser import *

"""
AUTHENTICATION SCRIPT. WRITTEN MAY-JULY '17 CANNONCONTRAPTION ET. AL.

IMPORTANT DATABASE INFORMATION
This script is designed to work through the "fsucs-auth" user and to interface with the
fsucs_authtables database. This allows for separation of user and post data, so that in
the event of a SQL injection attack, password hashes are still inaccesible. This may not
be a significant improvement on security, but it will nonetheless add to the organization
of serverside information at the very least.

USERS TABLE ##############################################################################
uid -- user id, int not null auto_increment primary key
    The user ID field. Primary identifier of users so that in the event of username error,
    there is still a valid identifier for each user.

uname -- user name, varchar(200)
    Username. Nothing special.

pass -- hashed password, varchar(500)
    Hashed/salted password.

lastip -- last known IP address, varchar(45)
    Last IP of login. The varchar size is 45 since (if memory serves) 45 characters is
    the longest IP possible with IPv6 including the IPv4 extension. Stored as varchar
    because other methods would require more work, and have the potential to mess up
    when they see an address that is not what they expect, e.g. ipv4 instead of 6

lastseen -- last timestamp the user was active, int
    Last time the user logged on, as a UNIX timestamp.

permissions -- User permissions, int
    The fsucs database includes a user table with a few /priv#/ variables. This would
    work for storing privledge information, but it uses a needlessly large amount of
    space to be effective. Storing permissions as a single int and using chmod-style
    numbers for each permission level is a more space-efficient method of doing the
    same thing. It also does not violate any database practices, since the permissions
    level is what is being stored. Storing this as a mode should be no less proper
    than as a bunch of booleans, despite data lumping.
    
    1 = can create/delete users
    2 = can set blog owners
    4 = can set blog perms
    8 = can create/delete blogs
    16= can grant/revoke special user permissions
    32= can post to a blog (if global like in this case, all blogs)
    
    Unless someone adds a permission above and doesn't change this comment, 31 is the
    value for admin, basically granting superuser permissions.

RANDOMSTRING TABLE #######################################################################
rstring -- Random string, varchar(200) primary key not null
    The random string assigned to the client session

uid -- User ID, int not null
    The user the rstring is assigned to.

lasthit -- Last contact time, int
    The time the random string was last used. If blank or a certain amount of time
    in the past, the session will have ended and the random string will be rejected.

registered -- registration time, int
    The timestamp corresponding to login time, or the time when the random string was
    generated.

PROP TABLE ###############################################################################
xkey -- INI style key
    This table is for config properties and security specifics like the salt. This is
    the key for the key/value table.

xvalue -- INI style value
    see xkey for description, this is the value field.

POSTRIGHTS TABLE #########################################################################
blogid -- the blog id
    Which blog we are setting permissions for

uid -- the user id
    Who are we granting access?

specialpermissions -- special permissions field
    There are global permissions defined in the users table, but this field is for
    more fine grained control. If a user should have unlimited access to a blog,
    or needs a set of specific permissions set, this is where to set them. Same
    numbers apply, this is another mode variable.
"""

#TODO: homestuck references aside, this needs to query the database for the salt.
salt = "MmMmM! SoOoO SaLtY! HoNk"

randgen = random.SystemRandom();

connection = None;
cursor = None;

"""
initconnect()

Initializes database connection if not already done. checks cursor and
connection globals. Sets them if not already done. No args/returns 0 on success
returns 1 on existing connection.
"""
def initconnect():
    #The global keyword means we are editing global vars instead of making local ones
    global connection;
    global cursor;
    #Don't do anything if we have init'ed already
    if connection != None and cursor != None:
        return 1;
    #and open our connection if we haven't.
    connection = mysql.connector.connect(user="fsuauth", database="fsucs_authtables", password="dtapass1")
    #Create a cursor...
    cursor = connection.cursor();
    #and then check our work. Return as appropriate.
    if connection == None:
        return 2;
    if cursor == None:
        return 3;
    return 0;

"""
set_permissions()

Sets the user permissions assuming the provided user and password are correct.
"""
def set_permissions(user, rstring, user_to_mod, mode):
    global cursor;
    global connection;
    #Check to make sure the user authenticating here exists and typed the
    #correct password
    if(check_auth_string(get_uid_from_name(user), rstring) != "ENOAUTH"):
        #set up the two sql queries requred to handle permissions in this context
        usermodquery = "update users set permissions = %s where uname = %s";
        userauthquery = "select permissions from users where uname = %(name)s";
        #then double-check that the logged in user has the permissions to do this
        cursor.execute(userauthquery, { 'name' : user})
        #use this to check that we got a positive match
        auth_good = False;
        for (permissions) in cursor:
            #use parse_exists from utilparser.py to check for mode 16
            #set auth_good if that person has permission 16
            if parse_exists(int(permissions[0]), 16): auth_good = True;
        if(auth_good):
            #If we got the permissions, then run the change permissions query and
            #commit it to the database.
            cursor.execute(usermodquery, (mode, user_to_mod));
            connection.commit();
            return "MODSET_COMPLETE"
        else:
            #If you see this, you're a bad person who should check their permissions
            #before running a privildiged script.
            return "ENOPERMISSION"
    else:
        #Derieved from gnu.org/fun ENOHORSE
        return "ENOLOGIN"

"""
check_password()

Checks the password for the given user against the password database by hashing

Arguments:
    passstring (string)
        The password as sent from the client
    user (string)
        the username to check against

Returns:
    Fail:
        "ENOAUTH"
    Success:
        A random string which the client can use as an auth id for fifteen
        minutes, or however long the check command makes it last.
"""
def check_password(passstring, usern, randid=True):
    global connection;
    global cursor;
    #Our password db uses sha512 for hashing. Change at your own peril. Or just before
    #any accounts are set up, either way.
    hlib = hashlib.sha512();
    #Grab our salt and add it to the password string. Nothing fancy.
    password = salt + passstring;
    #Update the hlib object with the byte string to hash. This requires sending encoded
    #UTF-8 bytes instead of a plain Python string.
    hlib.update(password.encode("utf-8"));
    #Then get the hexidecimal digest, to be stored in the DB and compared against.
    passhash = hlib.hexdigest();
    #Create our database query, so we can actually check against a real users table.
    dbquery = "select pass,uid from users where uname = %(name)s";
    #Make sure we have a connection to the MySQL database
    initresult = initconnect();
    #Check to make sure that connection worked...
    if(initresult != 0 and initresult != 1):
        return 'ENOCONNECTION';
    #If we got a good connection, then execute the SQL. This uses the SQL replace function
    #This means that MySQL will escape anything that could allow for a SQL injection attack,
    #and also it means that the db query requires no crappy string concat black magic
    cursor.execute(dbquery, { 'name' : usern}); #protects against SQL injection
    #Runs through the results
    for (passwd,uid) in cursor:
        #Checks the hashed password, returns according to the randid variable from the function call
        if passwd == passhash:
            if randid: return get_auth_string(uid);
            else: return "SUCCESS"
    #Anyone with this error code is assumed to be a black ops agent, and so they immediately
    #get an informative error message saying their secret service ID is down for maintenence.
    #Either that or the user just entered a wrong password, but these comments don't explore
    #that possibility.
    return "ENOAUTH";

"""
get_auth_string()

Gets an auth string for temporary signed-in access.

Arguments:
    User's ID
Returns:
    A valid auth string.
"""
def get_auth_string(userid):
    #Creates a two-part random number
    part1 = randgen.random()*300000000;
    part2 = randgen.random()*8123673;
    #Then we convert to binary, concatinate, and turn it into a string. Not a hack at all!
    final = str((str(part1).encode("ascii", "ignore") + str(part2).encode("utf-8")));
    #We then insert that into the database
    rquery = "insert into randomstring(rstring, uid, lasthit, registered) values(%s, %s, %s, %s)";
    cursor.execute(rquery, (final, userid, int(time.time()), int(time.time())));
    connection.commit();
    #and return the hacky string.
    return str(final);

"""
check_auth_string()

Checks the auth string for validity

Arguments:
    User's ID

Returns:
    Result of auth check
"""
def check_auth_string(uid, rstring):
    #For now, assuming that we're dealing with 1 hour timeout.
    #We create a deadline, past which timestamps expire
    deadline = time.time()-3600; #1h*60m*60s = 3600 seconds
    #then we query for the random string
    checkquery = "select rstring,uid,lasthit from randomstring where revoked = false and rstring = %s and uid = %s"
    initconnect()
    cursor.execute(checkquery, (rstring, uid));
    results = cursor.fetchall();
    for(rstring, uid, lasthit) in results:
        #If the timestamp isn't too old, we reset the deadline counter on the
        #random string by setting its last hit time to now, instead of whenever it was
        #hit before now.
        if(int(lasthit) >= int(deadline)):
            updatequery = "update randomstring set lasthit = %(time)s where uid = %(usid)s"
            cursor.execute(updatequery, {'time':int(time.time()),'usid':uid});
            connection.commit();
            return True;
    #But if there isn't a string, or it's expired, we let the eat kek.
    return False;

"""
get_uid_from_name()

Gets the user's ID from the username.
Just for convienience so we can be lazy and not repeatedly write SQL queries everywhere

Arguments:
    uname - the username to check

Retruns: uid - the UID corresponding to the uname
"""
def get_uid_from_name(uname):
    #We set a query
    query = "select uid from users where uname = %(name)s";
    #verify a database connection exists
    istatus = initconnect();
    #and report when it doesn't
    if(istatus > 1):
        return "ENODBCONNECT";
    #then execute the query, passing the username to the SQL where
    cursor.execute(query, {'name':uname});
    #and then scan the results for our answer
    ruid = None;
    for (uid) in cursor:
        ruid = uid;
    #Will return None if there is no user.
    return ruid;

"""
get_permission()

Returns whether the specified user has permission to complete a task. This could be something
like modifying a blog, adding/removing users, etc. This function will look up and verify
user permissions.

arguments:
    uid - the user id to check
    value - the permissions value to check for

returns: "GRANTED" on success
    ENODBCONNECT -- Couldn't connect to the auth DB.
    DENIED -- that user doesn't have permission to do that.
"""
def get_permission(uid, value, blog=None):
    #Standard stuff by now, start with a query
    query = "select permissions from users where uid = %(uid)s";
    #check the DB connection
    istatus = initconnect();
    #report lack of successful DB connection
    if(istatus > 1):
        return "ENODBCONNECT";
    #Execute our query, passing relevant information (UID in this case)
    cursor.execute(query, {'uid': uid});
    #then create a variable to store our result in
    permval = 0;
    #Put our result in there,
    for (permissions) in cursor:
        permval = permissions;
    #and use a parse_exists function to determine whether the permissions number is a component
    #of the mode number. Return appropriately.
    if(parse_exists(permval, value)):
        return "GRANTED";
    #Now we have to check the blog id. If the permission exists for a specific blog, we grant it.
    if blog == None:
        return "DENIED"
    query = "select specialpermissions from postrights where uid = %(uid)s and blogid = %(blog)s";
    cursor.execute(query, {'uid': uid, 'blog': blog});
    for (specialpermissions) in cursor:
        permval = specialpermissions;
    if(parse_exists(permval, value)):
        return "GRANTED"
    return "DENIED"
    
