(function(_parser) {

	var houseNumber = 33;

	function $(elem, selector) {
		if(arguments.length == 1) {
			selector = elem;
			elem = document;
		}
		if(!elem) {
			elem = document;
		}
		return elem.querySelector(selector);
	}

	function urlopen(url, succesfunc, errorfunc) {
		var r = new XMLHttpRequest();

		r.onload = function() {
			if (r.readyState === 4) {
				if (r.status === 200) {
					console.info("SUCCESS  %s reply: %o", url, r);
					succesfunc(r.responseText);
				} else {
					console.error("REST ASYNC: FAIL reply for %s, ready: %s, status: %s", url, r.readyState, r.status);
					errorfunc(r.status);
				}
			}
		};

		r.open("GET", url, true);
		r.send();

		return r;
	}

	function parseRestrictions(data) {

		console.log(data);
		var stage = data.current;
		var output = $('#content');

		console.log("Current stage: %s", data.stages[stage]);
		output.textContent += "Current stage: " + data.stages[stage] + "\n";
		output.textContent += "Water company URL: " + data.statisticsURL + "\n";

		for (propertyType in data.types) {
			console.log("Rules for %s", propertyType);
			output.textContent += "------------------------------------------------------------------------------\n";
			output.textContent += "Rules for " + data.types[propertyType] + "\n";

			var rules = data.rules[stage][propertyType];
			for (var r in rules) {
				if (rules[r].address[0] % 2 != houseNumber % 2)
					continue;

				var allowedDays = rules[r].day;
				var nrDays = allowedDays.length;
				var interval = rules[r].interval;
				var irrigations = rules[r].irrigation;

				console.log("\tYou can water %d times per week (every %d days).", nrDays, interval);
				output.textContent += "You can water " + nrDays + " times per week (every " + interval +" days).\n";

				output.textContent += "Applies to irrigation types: ";
				for (var i in irrigations) {
					output.textContent += data.irrigationSystems[irrigations[i]];
				}
				output.textContent += "\n";

				console.log("Allowed days:\n");
				output.textContent += "Allowed days:";

				for (var d in allowedDays) {
					console.log("\t %s", data.days[allowedDays[d]]);
					output.textContent += data.days[allowedDays[d]] + "\n";
				}

				console.log("\tAllowed hours: ");
				output.textContent += "Allowed hours: \n";

				var pos = 2;
				for (t in rules[r].time) {
					var time = rules[r].time[t];

					var hStart = time.from.substr(0, 2);
					var hEnd = time.from.substr(2, 4);
					var mStart =  time.to.substr(0, 2);
					var mEnd = time.to.substr(2, 4);

					console.log("\t\t From: %s:%s to %s:%s", hStart, hEnd, mStart, mEnd);
					output.textContent += "From: " + hStart + ":" + hEnd + " to " + mStart + " : " + mEnd + "\n";
				}
			}
		}
	}

	function init() {
		var url = "https://raw.githubusercontent.com/sprinkler/watering-restrictions-protocol/master/restrictions.json";
		urlopen(url, onSuccess, onError);
	}

	function onSuccess(content) {
		var data;
		try {
			data = JSON.parse(content);
			parseRestrictions(data);
		} catch(e) {
			console.error(e);
		}
	}

	function onError(status) {
		console.error(status);
	}


	//-----------------------------------------------------------------------
	//
	_parser.init = init;

}(window.parser = window.parser || {}));

window.addEventListener("load", window.parser.init);
