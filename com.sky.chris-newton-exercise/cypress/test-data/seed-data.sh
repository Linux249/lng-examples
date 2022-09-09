#!/bin/bash

# cp ../../src/mediaData/media.js ./media-backup.js
# cp ./media.js ../../src/mediaData/media.js


cp ./src/mediaData/media.js ./cypress/test-data/media-backup.js
cp ./cypress/test-data/media.js ./src/mediaData/media.js
