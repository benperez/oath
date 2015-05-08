JSCS = node_modules/.bin/jscs --esnext
JSHINT = node_modules/.bin/jshint
MOCHA = node_modules/.bin/mocha --harmony --recursive
XYZ = node_modules/.bin/xyz

SRC = $(shell find . -name '*.js' -not -path './node_modules/*')


.PHONY: lint
lint:
	@$(JSHINT) -- $(SRC)
	@$(JSCS) -- $(SRC)


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)


.PHONY: setup
setup:
	npm install


.PHONY: test
test:
	$(MOCHA)
