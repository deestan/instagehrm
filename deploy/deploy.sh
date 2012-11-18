#!/usr/bin/env bash

rsh=`cat deploy/deploy_rsh` # eg. /usr/bin/ssh -i /home/me/.ec2key.pem
target=`cat deploy/deploy_target` # eg. me@instagehrm.com

rsync --exclude=.git/ -qrv --delete --rsh="$rsh" . $target:instagehrm
$rsh $target "cd instagehrm && deploy/relaunch.sh"
