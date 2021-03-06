# Copyright (c) 2014 RainMachine, Green Electronics LLC
# All rights reserved.
# Authors: Nicu Pavel <npavel@mini-box.com>

import urllib2, urllib, json
from pprint import pprint

#u = urllib2.urlopen(url="https://raw.githubusercontent.com/sprinkler/watering-restrictions-protocol/master/restrictions.json", timeout=10)
#data = json.loads(u.read())

with open("../restrictions.json", "r") as f:
    data = json.loads(f.read())

houseNumber = 33
restrictionsPerDay = {}

stage = data["current"]
print "Current stage: %s" % data["stages"][stage]
print "Water company statistics URL: %s" % data["statisticsURL"]

#propertyType = "residential" # commercial, school
for propertyType in data["types"]:
    propertyTypeIndex = data["types"].index(propertyType)
    print "Rules for %s" % propertyType

    rules = data["rules"][stage][propertyTypeIndex]
    for r in rules:
        if r["address"][0] % 2 != houseNumber % 2:
            continue

        allowedDays = r["day"]
        nrDays = len(allowedDays)
        interval = r["interval"]

        print "\tYou can water %d times per week (every %d days)." % (nrDays, interval)
        print "\tApplies to irrigation types: ",
        print [data["irrigationSystems"][x] for x in r["irrigation"]]
        print "\tAllowed days: %s:" % allowedDays,
        print [data["days"][x] for x in allowedDays]
        print "\tAllowed hours: "

        for t in r["time"]:
            hStart = t["from"][0:2]
            mStart = t["from"][2:4]

            hEnd = t["to"][0:2]
            mEnd = t["to"][2:4]
            print "\t\t From %s:%s to %s:%s" % (hStart, mStart, hEnd, mEnd)
