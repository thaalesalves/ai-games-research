var IMPERIAL = "imperial";
var MERTRIC = "metric";

var ImperialMetric = function(val) {
	this.val = val;
	this.map = {
		inch: {
			belong: IMPERIAL,
			toMain: 1,
			toOthers: (2.54 / 100)
		},
		foot: {
			belong: IMPERIAL,
			toMain: 12,
			toOthers: (2.54 / 100)
		},
		m: {
			belong: MERTRIC,
			toMain: 1,
			toOthers: (1 / 2.54) * 100
		},
		cm: {
			belong: MERTRIC,
			toMain: 1 / 100,
			toOthers: (1 / 2.54) * 100
		},
		mm: {
			belong: MERTRIC,
			toMain: 1 / 1000,
			toOthers: (1 / 2.54) * 100
		},
		km: {
			belong: MERTRIC,
			toMain: 1000,
			toOthers: (1 / 2.54) * 100
		},
		"sqrt-foot": {
			belong: IMPERIAL,
			toMain: 144,
			toOthers: (6.4516 / 10000),
		},
		"sqrt-inch": {
			belong: IMPERIAL,
			toMain: 1,
			toOthers: (6.4516 / 10000)
		},
		"sqrt-m": {
			belong: MERTRIC,
			toMain: 1,
			toOthers: (1 / 6.4516) * 10000
		},
		"sqrt-cm": {
			belong: MERTRIC,
			toMain: 1 / 10000,
			toOthers: (1 / 6.4516) * 10000
		},
		"sqrt-mm": {
			belong: MERTRIC,
			toMain: 1 / 1000000,
			toOthers: (1 / 6.4516) * 10000
		},
		"sqrt-km": {
			belong: MERTRIC,
			toMain: 1000000,
			toOthers: (1 / 6.4516) * 10000
		}
	}
}

/*
	"inch", "cm", "m", "foot", "sqrt-m", "sqrt-km", "sqrt-cm", "sqrt-mm", "sqrt-inch", "sqrt-foot"
*/
ImperialMetric.prototype.from = function(unit) {
	this.unit = this.map[unit];
	return this;
}

ImperialMetric.prototype.to = function(goal) {
	this.goal = this.map[goal];
	if (this.unit.belong !== this.goal.belong) {
		return this.val * this.unit.toMain * this.unit.toOthers / this.goal.toMain;
	}
	else {
		return this.val * this.unit.toMain / this.goal.toMain;
	}
}

module.exports = function (value) {
	return new ImperialMetric(value);
}
