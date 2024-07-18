#!/bin/bash

pn run build-staging && \
rsync -avz dist botx.dev.minh:/tmp/ && \
ssh botx.dev.minh 'sudo mv /tmp/dist /var/www/html/'