#!/usr/bin/env bash
current_pid=`ps x | grep node | grep instagehrm_server.js | awk '{print $1}'`
if [ -n "$current_pid" ]; then
    kill $current_pid
fi
nohup node instagehrm_server.js 1>/dev/null 2>/dev/null 3>/dev/null &
sudo cp instagehrm.siteconfig /etc/nginx/sites-enabled/instagehrm
sudo /etc/init.d/nginx reload
echo successfully relaunched
node regenAll.js
