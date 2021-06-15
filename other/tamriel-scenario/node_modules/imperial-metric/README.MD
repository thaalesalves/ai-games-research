# ImperialMetric [![Build Status](https://travis-ci.org/tiansijie/imperial-metric.svg?branch=master)](https://travis-ci.org/tiansijie/imperial-metric)

A module that let you convert imperial to metric and metric to imperial easily

## Usage
```js
	var IM = require("imperial-metric");
	IM(1).from('inch').to("cm"); // 2.54
	IM(1).from('m').to("inch"); // 39.37007874
	IM(1).from('cm').to("foot"); // 0.03280839895
	IM(1).from('foot').to("m"); // 0.3048
```
includes inch, foot, mm, cm, m, km, sqrt-m, sqrt-cm, sqrt-mm, sqrt-km, sqrt-inch, sqrt-foot

## Install
```
	npm install imperial-metric
```
