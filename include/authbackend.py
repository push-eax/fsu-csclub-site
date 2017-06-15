#!/usr/bin/env python3
import hashlib
import mysql.connector

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
    connection = mysql.connector.connect(user="fsuauth", database="fsucs", pass="imdonew/this")
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
	for pass in cursor:
		if pass == passhash:
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
