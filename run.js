var reporter = require('nodeunit').reporters.default;

var executeBenchmarks = function() {
	reporter.run(['tests']);
};

executeBenchmarks();
