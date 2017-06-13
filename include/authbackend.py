#!/usr/bin/env python3
import hashlib

#TODO: homestuck references aside, this needs to query the database for the salt.
salt = "MmMmM! SoOoO SaLtY! HoNk"

def check_password(passstring):
	hlib = hashlib.sha512();
	password = salt + passstring;
	hlib.update(password);
	passhash = hlib.digest();
	print(passhash+" is the pass hash.") #TODO: Remove this print when done
