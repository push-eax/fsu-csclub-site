#!/usr/bin/env python3
import hashlib
import mysql.connector
import random;
import time;

"""
AUTHENTICATION SCRIPT. WRITTEN MAY-JULY '17 CANNONCONTRAPTION ET. AL.

IMPORTANT DATABASE INFORMATION
This script is designed to work through the "fsucs-auth" user and to interface with the
fsucs_authtables database. This allows for separation of user and post data, so that in
the event of a SQL injection attack, password hashes are still inaccesible. This may not
be a significant improvement on security, but it will nonetheless add to the organization
of serverside information at the very least.

USERS TABLE
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

RANDOMSTRING TABLE
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
    if connection != None and cursor != None:
        return 1;
    connection = mysql.connector.connect(user="fsuauth", database="fsucs-authtables", pass="dtapass1")
    cursor = connection.cursor();
    return 0;

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
def check_password(passstring, user):
    hlib = hashlib.sha512();
    password = salt + passstring;
    hlib.update(password);
    passhash = hlib.digest();
    #print(passhash+" is the pass hash.") #Uncomment only when debugging.
    dbquery = "select pass,uid from auth where user = %s";
    initconnect();
    cursor.execute(dbquery, user); #protects against SQL injection
    for (passwd,uid) in cursor:
        if passwd == passhash:
	    return get_auth_string(uid);
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
    part1 = randgen.random()*3000;
    part2 = randgen.random()*8123673;
    final = int(part1 + part2);
    rquery = "insert into randomstring(rstring, uid, lasthit, registered) values(%s, %s, %s, %s)";
    cursor.execute(rquery, final, userid, int(time.time()), int(time.time()));
    return str(final);

"""
check_auth_string()

Checks the auth string for validity

Arguments:
	User's ID

Returns:
	Result of auth check
"""
def check_auth_string(uid, randstr):
    #For now, assuming that we're dealing with 1 hour timeout.
    deadline = time.time()-3600; #1h*60m*60s = 3600 seconds
    checkquery = "select rstring,uid,lasthit,registered from randomstring where rstring = %s and uid = %s"
    cursor.execute(checkquery, randstr, uid);
    for(rstring, uid, lasthit, registered) in cursor:
        if(rstring >= deadline):
            return true;
    return false;
