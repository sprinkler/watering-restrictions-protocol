

#Watering Restrictions Protocol


Authored By: Nicu Pavel Revision 01a 


## Revisions Changelog


| Date of Change | Version | Changes | Editor|
|----------------|---------|---------|-------|
| 09-14-2016 | 01 | Original document created | Nicu Pavel |
| 09-19-2016 |01a | Revisions for clarity | Andrei B |
| 10-29-2016 |01b | Added javascript example, markdown formatting | Nicu Pavel |



## Description
With the advent of smart irrigation controllers a specific M2M data interchange format is needed to standardise the definition of watering restrictions defined by Water Companies, municipalities or other residential area governing committees all over the world. This format can be openly used by smart controllers to automatically create watering restrictions or inform the user about the current restrictions.


## Acknowledgements
This protocol definition is based on an existing definition that was created by Austin Water Company. The current definitions only adds more information to this format, leaving full compatibility with original format.


## Technology
The protocol is described using JSON an open-standard format that widely used by developers and web service providers.


## Protocol Overview
The protocol specifies a list of rules which define when watering is allowed. Each rule belongs to a certain watering conservation stage and certain customer/property types (residential, commercial, school). Each rule defines a time interval, for a list of week days and the irrigation system type (sprinkler, drip) that it applies. The basic format without any data looks like below:


    {
      “stages": [“1”, “2”, “3”, “4”],
      “effective”: “2016-05-17T00:00:00-06:00”
      “Current": 0,
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
    }


Basic JSON format without any rules defined


## Protocol Structure Components
 
- "stages" is an ARRAY of STRINGs which match the water restriction stage names. The order of the STRINGs in the ARRAY is important. See the "rules" definition for usage.
  
- "types" is an ARRAY of STRINGs which match the customer / property types distinguished in the restrictions. The order of the STRINGs in the ARRAY is important. See the "rules" definition for usage.


- “irrigationSystems” is an ARRAY of STRINGS which match the types of irrigation used by “rules” definition


- “statisticsURL” specifies a URL on which the smart controller watering statistics can be sent to be analysed. Each smart controller can automatically send this statistics if user chooses so.
  
- "days" is an ARRAY of STRINGs containing the days of the week in the required order. The order of the STRINGs in the ARRAY is important.  See the "rules" definition for usage.
  
- "current" is a NUMBER which specifies the current water restriction stage. The value is the specified index in the "stages" ARRAY.
  
- "effective" is a STRING containing the effective date / time, in ISO 8601 format, of the current water restriction stage.
  
- "rules" is an ARRAY containing rules for each possible water restriction stage. Each item in the ARRAY references a particular stage.
    The index of the item (stage) in this array corresponds to the index in the "stages" ARRAY. Below is a further description of an item in the "rules" ARRAY, referenced as rules[stage index].




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

RULE: Basic JSON format

    
Each rules[stage index] is an ARRAY containing rules for each customer / property type within a stage. Each item in the ARRAY references a particular type. The index of the item (type) in this array corresponds to the index in the "types" ARRAY. Below is a further description of an item in the rules[stage index] ARRAY, referenced as rules[stage index][type index].

Each rules[stage index][type index] is an ARRAY of OBJECTs containing rules for specific address ranges within a customer / property type and stage. The address ranges are specified as street numbers ending in an odd digit, an even digit, or all street numbers. Below is a further description of an item in the rules[stage index][type index] ARRAY, referenced as rules[stage index][type index][rule index].

Each rules[stage index][type index][rule index] OBJECT has the following structure:


- “irrigation” is an ARRAY of NUMBERs which specifies the indexes in the irrigationSystems array. It denotes for which type of irrigation system this rule applies.

- "interval" is a NUMBER which specifies the number of days in the watering interval or period. For example, a value of 7 would mean  that watering is allowed weekly according to the watering rules. A value of 0 (zero) would mean that watering is not allowed. See  the "day" definition for a description of what days of the week are valid to water in the interval.

- "address" is an ARRAY of NUMBERs which match the last digit of the street number of property addresses encompassed by the rules. For  example, if "address" contains [1,3,5,7,9], then the rules would apply to addresses like 123 Main ST or 1005 First ST, but not 120 Main ST.

- "day" is an ARRAY of NUMBERs which specifies the valid watering days of the week encompassed by the rules. The values correspond to the indices of the "days" ARRAY, which contains the STRING descriptions of the days of the week as reference. If the "day" ARRAY has no items, then watering is not allowed.

- "time" is an ARRAY of OBJECTs containing daily time periods that watering is allowed according to the watering rules. If the "time" ARRAY has  no items, then watering is not allowed. Each "time" OBJECT has the following structure:

  - "from" is a STRING which specifies the beginning time of the time period using a 24-hour clock. The format of the STRING is "HHMM", which  is a 2 digit designation for hours and a 2 digit designation for minutes (with leading zero for hours or minutes less than 10).

  - "to" is a STRING which specifies the ending time of the time period using a 24-hour clock. The format of the STRING is the same as "from".




## Example protocol parsing code (client side).
This code resides on the use machine (e.g Rainmachine) or cloud side server. 


### Python: 
    
https://raw.githubusercontent.com/sprinkler/watering-restrictions-protocol/master/python/parse.py
    
### Javascript: 
 
https://raw.githubusercontent.com/sprinkler/watering-restrictions-protocol/master/js/parser/


## Protocol JSON Example  

https://raw.githubusercontent.com/sprinkler/watering-restrictions-protocol/master/restrictions.json






