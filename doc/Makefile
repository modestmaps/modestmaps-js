# to install marked: `npm install marked`
MARKED ?= ../node_modules/marked/bin/marked --gfm
VERSION = `cat ../VERSION`

all: index.html

index.html: toc.html api.html
	cat start.html toc.html middle.html api.html end.html \
		| perl -pi -e "s/{VERSION}/$(VERSION)/g" > $@

%.html: %.md
	$(MARKED) $< > $@

clean:
	rm -f index.html toc.html api.html
