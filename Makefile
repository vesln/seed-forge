UI       = tdd
REPORTER = dot

TESTS = test/*test.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require test/support/autoload.js \
		--reporter $(REPORTER) \
		--ui $(UI) \
		$(TESTS)

.PHONY: test
