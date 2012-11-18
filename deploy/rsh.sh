#!/usr/bin/env bash

rsh=`cat deploy/deploy_rsh` # eg. /usr/bin/ssh -i /home/me/.ec2key.pem
target=`cat deploy/deploy_target` # eg. me@instagehrm.com

$rsh $target