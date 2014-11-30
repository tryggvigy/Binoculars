test:
	./node_modules/.bin/mocha test/**/*-test.js --reporter spec --growl --timeout 2000 --watch

test-single:
	./node_modules/.bin/mocha test/**/*-test.js --reporter spec --growl --timeout 2000
.PHONY: test test-single

test-cov:
	./node_modules/.bin/mocha test/**/*-test.js --reporter html-cov > test/coverage.html --timeout 2000

test-browser:
	./node_modules/.bin/mocha-phantomjs --reporter spec --timeout 2000 test/testrunner.html

.PHONY: test test-single test-cov test-browser
