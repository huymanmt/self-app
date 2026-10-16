PY?=python3
PELICAN?=.venv/bin/pelican
PELICANOPTS=

BASEDIR=$(CURDIR)
INPUTDIR=$(BASEDIR)/content
OUTPUTDIR=$(BASEDIR)/output
CONFFILE=$(BASEDIR)/pelicanconf.py
PUBLISHCONF=$(BASEDIR)/publishconf.py

PORT ?= 8000
SERVER ?= 127.0.0.1

help:
	@echo 'Makefile for Pelican Static Site                                           '
	@echo '                                                                           '
	@echo 'Usage:                                                                     '
	@echo '   make html                           (re)generate the web site           '
	@echo '   make clean                          remove the generated files          '
	@echo '   make regenerate                     regenerate files upon modification  '
	@echo '   make publish                        generate using production settings  '
	@echo '   make serve [PORT=8000]              serve site at http://localhost:8000 '
	@echo '   make dev [PORT=8000]                regenerate and serve continuously   '
	@echo '                                                                           '

html:
	"$(PELICAN)" "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS)

clean:
	[ ! -d "$(OUTPUTDIR)" ] || rm -rf "$(OUTPUTDIR)"
	[ ! -d "$(BASEDIR)/cache" ] || rm -rf "$(BASEDIR)/cache"

regenerate:
	"$(PELICAN)" -r "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS)

serve:
	"$(PELICAN)" -l "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" -p $(PORT) -b $(SERVER)

dev:
	"$(PELICAN)" -lr "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" -p $(PORT) -b $(SERVER)

publish:
	"$(PELICAN)" "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(PUBLISHCONF)" $(PELICANOPTS)

.PHONY: html help clean regenerate serve dev publish
