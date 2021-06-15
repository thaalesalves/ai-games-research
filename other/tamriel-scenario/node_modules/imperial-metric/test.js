var IM = require("./index.js");
var test = require("tape");

test("1 foot",  function(t) {
	t.equal(IM(1).from("foot").to("inch"), 12, "equal 12 inches");
	t.equal(IM(1).from("foot").to("foot"), 1, "equal 1 foot");
	t.equal(Number(IM(1).from("foot").to("cm").toFixed(2)), 30.48, "equal 30.48 cm");
	t.equal(Number(IM(1).from("foot").to("m").toFixed(4)), 0.3048, "equal 0.3048 m");
	t.end();
});

test("1 inch", function(t) {
	t.equal(IM(1).from("inch").to("inch"), 1, "equal 1 inch");
	t.equal(IM(1).from("inch").to("foot"), 1 / 12, "equal 1 / 12 foot");
	t.equal(IM(1).from("inch").to("cm"), 2.54, "equal 2.54 cm");
	t.equal(IM(1).from("inch").to("m"), 2.54 / 100, "equal 2.54 / 100 m");
	t.end();
});


test("1 cm", function(t) {
	t.equal(IM(1).from("cm").to("inch"), 1 / 2.54, "equal 1 / 2.54 inch");
	t.equal(IM(1).from("cm").to("foot"), 1 / 30.48, "equal 1 / 30.48 foot");
	t.equal(IM(1).from("cm").to("cm"), 1, "equal 1 cm");
	t.equal(IM(1).from("cm").to("m"), 1 / 100, "equal 1 / 100 m");
	t.equal(IM(1).from("cm").to("mm"), 10, "equal 10 mm");
	t.end();
});


test("1 m", function(t) {
	t.equal(IM(1).from("m").to("inch"), (1 / 2.54) * 100, "equal (1 / 2.54) * 100 inch");
	t.equal(IM(1).from("m").to("foot").toFixed(2), ((1 / 30.48) * 100).toFixed(2), "equal (1 / 30.48) * 100 foot");
	t.equal(IM(1).from("m").to("cm"), 100, "equal 100 cm");
	t.equal(IM(1).from("m").to("m"), 1, "equal 1 m");
	t.equal(IM(1000).from("m").to("km"), 1, "equal 1 km");
	t.end();
});


test("1 sqrt foot", function(t) {
	t.equal(IM(1).from("sqrt-foot").to("sqrt-inch"), 144, "equal 144 sqrt inch");
	t.equal(IM(1).from("sqrt-foot").to("sqrt-m"), 144 * (6.4516 / 10000), "equal 0.09290304 sqrt foot");
	t.equal(IM(1).from("sqrt-foot").to("sqrt-cm"), 144 * (6.4516 / 10000) * 10000, "equal 929.0304 sqrt cm");
	t.equal(IM(1).from("sqrt-foot").to("sqrt-km"), 144 * (6.4516 / 10000) / 1000000, "equal 0.00000009290304 sqrt km");
	t.equal(IM(1).from("sqrt-foot").to("sqrt-mm"), 144 * (6.4516 / 10000) * 1000000, "equal 92903.04 sqrt mm");
	t.end();
});
