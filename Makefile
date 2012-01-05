# Copied over from Jim Smith's copy of MITHGrid  
# based on the Makefile for jquery

SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

BASE_FILES = ${SRC_DIR}/controllers.js \
	${SRC_DIR}/selecttext.js \

MG = ${DIST_DIR}/annoclient.js
MG_MIN = ${DIST_DIR}/annoclient.min.js

MG_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/${MG_VER}/"

DATE=$(shell git log --pretty=format:%ad | head -1)

all: core

core: annoclient min lint
		@@echo "annoclient build complete"

${DIST_DIR}:
		@@mkdir -p ${DIST_DIR}

annoclient: ${MG}

#| \
#sed 's/.function....MITHGrid..{//' | \
#sed 's/}..jQuery..MITHGrid.;//' > ${MG}.tmp;

${MG}: ${DIST_DIR} ${SRC_DIR}/intro.js ${BASE_FILES} ${SRC_DIR}/outro.js
		@@echo "Building" ${MG}
		
		@@cat ${BASE_FILES} > ${MG}.tmp
		
		@@cat ${SRC_DIR}/intro.js ${MG}.tmp ${SRC_DIR}/outro.js | \
			sed 's/@DATE/'"${DATE}"'/' | \
			${VER} > ${MG};
		
		@@rm -f ${MG}.tmp;
		
lint: annoclient
		@@if test ! -z ${JS_ENGINE}; then \
				echo "Checking annoclient code against JSLint..."; \
				${JS_ENGINE} build/jslint-check.js; \
		else \
				echo "You must have NodeJS installed in order to test annoclient against JSLint."; \
		fi

min: annoclient ${MG_MIN}

${MG_MIN}: ${MG}
		@@if test ! -z ${JS_ENGINE}; then \
				echo "Minifying annoclient" ${MG_MIN}; \
				${COMPILER} ${MG} > ${MG_MIN}.tmp; \
				${POST_COMPILER} ${MG_MIN}.tmp > ${MG_MIN}; \
				rm -f ${MG_MIN}.tmp; \
		else \
				echo "You must have NodeJS installed in order to minify OAC VideoAnnotator."; \
		fi

clean:
		@@echo "Removing Distribution directory:" ${DIST_DIR}
		@@rm -rf ${DIST_DIR}

distclean: clean

.PHONY: all annoclient lint min clean distclean core
