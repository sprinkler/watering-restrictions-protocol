

#Watering Restrictions Protocol


Authored By: Nicu Pavel Revision 01d 

**Table of Contents** 

- [Revisions Changelog](#Revisions Changelog)
- [Description](#Description)
- [Acknowledgements](#Acknowledgements)
- [Technology](#Technology)
- [Protocol Overview](#Protocol Overview)
- [Protocol Structure Components](#Protocol Structure Components)
- [Example protocol parsing code (client side).](#Example protocol parsing code (client side).)
	- [Python:](#)
	- [Javascript:](#)
- [Protocol JSON Example](#Protocol JSON Example)


## Revisions Changelog


| Date of Change | Version | Changes | Editor|
|----------------|---------|---------|-------|
| 09-14-2016 | 01 | Original document created | Nicu Pavel |
| 09-19-2016 |01a | Revisions for clarity | Andrei B |
| 10-29-2016 |01b | Added javascript example, markdown formatting | Nicu Pavel |
| 10-31-2016 |01c | Added company details, alerts | Nicu Pavel |
| 11-01-2016 |01d | Added recommandations | Nicu Pavel |


## Description
With the advent of smart irrigation controllers a specific M2M data interchange format is needed to standardise the definition of watering restrictions defined by Water Companies, municipalities or other residential area governing committees all over the world. This format can be openly used by smart controllers to automatically create watering restrictions or inform the user about the current restrictions.


## Acknowledgements
This protocol definition is based on an existing definition that was created by *Austin Water Company.* The current definitions only adds more information to this format, leaving full compatibility with original format.


## Technology
The protocol is described using JSON an open-standard format widely used by developers and web service providers.


## Protocol Overview
The protocol specifies a list of rules which define when watering is allowed. Each rule belongs to a certain watering conservation stage and certain customer/property types (**residential**, **commercial**, **school**). Each rule defines a time interval, for a list of week days and the irrigation system type (**sprinkler**, **drip**) that it applies to.
The basic format without any data looks like below:


    {
      "company": {
      	"name": "Water Company",
      	"phone": "+33 22 1234 5678",
      	"country": "US",
      	"state": "CA",
        "city": "San Antonio",
      	"geoarea": [
      	    {lat: 25.774, lng: -80.190},
            {lat: 18.466, lng: -66.118},
            {lat: 32.321, lng: -64.757}
      	],
      },
      “stages": [“1”, “2”, “3”, “4”],
      “effective”: “2016-05-17T00:00:00-06:00”
      “current": 0,
      “types”:[
        “residential”,
        “commercial”,
        “school”
      ],
     “irrigationSystems”: [“sprinkler”, “drip”],
     “statisticsURL”: “http://mywatercompany/stats”,
     “days”:[
        “Sunday”,
        “Monday”,
        “Tuesday”,
        “Wednesday”,
        “Thursday”,
        “Friday”,
        “Saturday”
      ],
      “rules”:[],
      "alerts": [],
      "recommendations":{}
    }
*Basic JSON format without any rules defined*


## Protocol Structure Components

- "**company**" is an OBJECT that describes company details and locations:
   - "**name**" is a STRING representing company name.
   - "**phone**" is a STRING representing company phone number in [E.123] (https://en.wikipedia.org/wiki/E.123) international notation (+COUNTRY_CODE AREA_CODE NUMBER).
   - "**country**" is a STRING representing company country in [ISO 3166-1 Alpha 2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format.
   - "**state**" is a STRING representing company state in abbreviated format
   - "**geoarea**" *(optional)* is an ARRAY of OBJECTS that defines the land area for which the water company provides services. Each OBJECT from ARRAY defines a point of a polygon defining the area by latitude and longitude.
     If defined there should be at least 3 point (OBJECTS) to be considered valid. Smart controllers can automatically enable restrictions if their location is whitin the specified polygon.
      
     
- "**stages**" is an ARRAY of STRINGs which match the water restriction stage names. The order of the STRINGs in the ARRAY is important. See the "rules" definition for usage.
  
- "**types**" is an ARRAY of STRINGs which match the customer / property types distinguished in the restrictions. The order of the STRINGs in the ARRAY is important. See the "rules" definition for usage.

- “**irrigationSystems**” is an ARRAY of STRINGS which match the types of irrigation used by “**rules**” definition

- “**statisticsURL**” specifies a URL on which the smart controller watering statistics can be sent to be analysed. Each smart controller can automatically send this statistics if user chooses so.
  
- "**days**" is an ARRAY of STRINGs containing the days of the week in the required order. The order of the STRINGs in the ARRAY is important.  See the "**rules**" definition for usage.
  
- "**current**" is a NUMBER which specifies the current water restriction stage. The value is the specified index in the "stages" ARRAY.
  
- "**effective**" is a STRING containing the effective start date / time, in ISO 8601 format, of the current water restriction stage.
       
- "**rules**" is an ARRAY containing rules for each possible water restriction stage. Each item in the ARRAY references a particular stage.
    The index of the item (**stage**) in this array corresponds to the index in the "**stages**" ARRAY. Below is a further description of an item in the "**rules**" ARRAY, referenced as *rules[stage index]*.


        {
        "time":[
          {
            "from":"0000",
            "to":"0959"
          },
          {
            "from":"1900",
            "to":"2359"
          }
        ],
        "day":[3 ],
        "interval":7,
        "address":[1,3,5,7,9],
        “irrigation”: [0],
        },

*Rule: Basic JSON format*

    
Each *rules[stage index]* is an ARRAY containing rules for each customer / property type  (residential, commercial, etc) within a **stage**. Each item in the ARRAY references a particular type. The index of the item (type) in this array corresponds to the index in the "**types**" ARRAY. Below is a further description of an item in the *rules[stage index]* ARRAY, referenced as **rules[stage index][type index]**.

Each *rules[stage index][type index]* is an ARRAY of OBJECTs containing rules for specific address ranges within a customer / property **type** and **stage**. The address ranges are specified as street numbers ending in an odd digit, an even digit, or all street numbers. Below is a further description of an item in the *rules[stage index][type index]* ARRAY, referenced as *rules[stage index][type index][rule index*].

Each *rules[stage index][type index][rule index]* OBJECT has the following structure:


- “**irrigation**” is an ARRAY of NUMBERs which specifies the indexes in the irrigationSystems array. It denotes for which category of irrigation system this rule applies. Note that the *sprinkler* category refers to multiple types of sprinkler heads 
like: rotary nozzle, rotors, sprays and *drip* refers to: drip, bubblers, soaker hose etc.

- "**interval**" is a NUMBER which specifies the number of days in the watering interval or period. For example, a value of 7 would mean  that watering is allowed weekly according to the watering rules. A value of 0 (zero) would mean that watering is not allowed. See  the "**day**" definition for a description of what days of the week are valid to water in the interval.

- "**address**" is an ARRAY of NUMBERs which match the last digit of the street number of property addresses encompassed by the rules. For  example, if "**address**" contains *[1,3,5,7,9]*, then the rules would apply to addresses like 123 Main ST or 1005 First ST, but not 120 Main ST.

- "**day**" is an ARRAY of NUMBERs which specifies the valid watering days of the week encompassed by the rules. The values correspond to the indices of the "**days**" ARRAY, which contains the STRING descriptions of the days of the week as reference. If the "**day**" ARRAY has no items, then watering is not allowed.

- "**time**" is an ARRAY of OBJECTs containing daily time periods that watering is allowed according to the watering rules. If the "**time**" ARRAY has  no items, then watering is ***not*** allowed. Each "**time**" OBJECT has the following structure:

  - "**from**" is a STRING which specifies the beginning time of the time period using a 24-hour clock. The format of the STRING is *"HHMM"*, which  is a 2 digit designation for hours and a 2 digit designation for minutes (with leading zero for hours or minutes less than 10).

  - "**to**" is a STRING which specifies the ending time of the time period using a 24-hour clock. The format of the STRING is the same as "**from**".


- "**alerts**" *(optional)* is an ARRAY containing watering conservation alerts or other information to be sent to customers.

    - "**from**" is a NUMBER in unix timestamp format that specifies the starting date/time for alert validity
    - "**to**" is a NUMBER in unix timestamp format that specifies the ending date/time for alert validity
    - "**message**" the alert message to be displayed to customers
         
            [
                { 
                    from: 1477949811,
                    to: 1477954811,
                    message: "alert message"
                    },
            ]
  
*Alerts: Basic JSON format*

- "**recommendations**" *(optional)* is an OBJECT defining soil types, vegetation and emitter type and an ARRAY of recommendations "**list**"
    -  "**recommendations.soils**": is an ARRAY of STRINGS defining soil types. 
    -  "**recommendations.emitters**": is an ARRAY of STRINGS defining emitter types.
    -  "**recommendations.vegetations**": is an ARRAY of STRINGS defining vegetation types.
    -  "**recommendations.list**": Each item in the ARRAY references a particular stage. The index of the item (**stage**) in this array corresponds to the index in the "**stages**" ARRAY. 
        - Each *recommendations.list[stage index]* is an ARRAY containing rules for each customer / property type (residential, commercial, etc) within a **stage**. Each item in the ARRAY references a particular type. The index of the item (type) in this array corresponds to the index in the "**types**" ARRAY.
    
        - Each *recommendations.list[stage index][type index]* is an ARRAY of OBJECTs containing recommendations for specific soil, emitter and vegetation type within a customer / property **type** and **stage**.

        - Each *recommendations.list[stage index][type index][index]* OBJECT has the following structure:
            - "**soil**" is an ARRAY of NUMBERS that specify the valid soil types this recommendation applies to, the NUMBER is an index in the "**recommendations.soils**" ARRAY.
             - "**emitter**" is an ARRAY of NUMBERS that specify the irrigation emitter types this recommendation applies to, the NUMBER is an index in the "**recommendations.emitter**" ARRAY.
             - "**vegetation**" is an ARRAY of NUMBERS that specify the vegetation types this recommendation applies to, the NUMBER is an index in the "**recommendations.vegetations**" ARRAY.
             - "**frequency**" is a NUMBER that specify the days interval for which the irrigation should occur.
             - "**duration**" is a NUMBER that specify the number of seconds that the customer should irrigate the specified vegetation considering the soil and emitter type

                      {
                      soils: [
                          "ClayLoam",
                          "SiltyClay",
                          "Clay",
                          "Loam",
                          "SandyLoam",
                          "LoamySand",
                          "Sand"
                      ],
                      emitters: [
                          "PopupSpray",
                          "Rotors",
                          "SurfaceDrip",
                          "Bubblers"
                      ],
                      vegetations: [
                          "Grass",
                          "FruitTrees",
                          "Flowers",
                          "Vegetables",
                          "Citrus",
                          "Bushes",
                          "Xeriscape"
                      ],
                      list: [
                        [
                          [
                             { 
                                soil: [0, 1],
                                emitter: [0],
                                vegetation: [0],
                                duration: 720,
                                frequency: 7
                              }
                          ],
                          [
                             { 
                                soil: [0, 1],
                                emitter: [0],
                                vegetation: [0],
                                duration: 1440,
                                frequency: 7
                              }
                          ]
                        ]
                      ]            
                   }

*Recommandations: Basic JSON format*

## Example protocol parsing code (client side).
This code resides on the use machine (e.g [Rainmachine](http://www.rainmachine.com)) or cloud side server. 


### Python: 
    
https://raw.githubusercontent.com/sprinkler/watering-restrictions-protocol/master/python/parse.py
    
### Javascript: 

https://github.com/sprinkler/watering-restrictions-protocol/tree/master/js/parser


## Protocol JSON Example  

https://raw.githubusercontent.com/sprinkler/watering-restrictions-protocol/master/restrictions.json

