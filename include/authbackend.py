#!/usr/bin/env python3
import hashlib
import mysql.connector


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
    connection = mysql.connector.connect(user="fsuauth", database="fsucs-authtables", pass="imdonew/this")
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
    dbquery = "select pass from auth where user = %s";
    initconnect();
    cursor.execute(dbquery, user); #protects against SQL injection
    for passwd in cursor:
        if passwd == passhash:
	    return get_auth_string();
    return "ENOAUTH";

"""
get_auth_string()

Gets an auth string for temporary signed-in access.

Arguments:
	None.
Returns:
	A valid auth string.
"""
def get_auth_string():
    pass; #TODO: Implement random string store/expire in the database.
