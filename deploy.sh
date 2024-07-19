#!/bin/bash

npm run build-staging && \
rsync -avz dist botx.dev.minh:/tmp/ && \
ssh botx.dev.minh 'sudo rm -rf /var/www/html/dist && sudo mv /tmp/dist /var/www/html/'