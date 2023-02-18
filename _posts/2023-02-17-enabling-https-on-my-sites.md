---
title: Enabling HTTPS on my sites
description: HTTPS needs to be set up at the server level and hinges on your server having an SSL certificate that it can communicate to clients. Services like Godaddy will charge you anywhere between $70 and $200 every year! So I didn’t really think HTTPS was something I could do myself. But LetsEncrypt has done an amazing job pushing this forward, and I do recommend using them if you’re unsure about how to go about enabling SSL.
tags:
  - david
  - code
meta:
  _edit_last: "1"
status: publish
layout: post
type: post
published: true
category: David
---

While I had nearly 3 months off of work after the birth of our second child, I stumbled upon some cryptography content on Youtube, including some stuff on web encryption and how HTTPS works. HTTPS needs to be set up at the server level and hinges on your server having an SSL certificate that it can communicate to clients. Services like Godaddy will charge you anywhere between $70 and $200 every year! So I didn’t really think HTTPS was something I could do myself - or if it was, that it’d be nontrivial, like managing your own mail servers.

I have two sites - davidandsuzi.com and boba.life. Getting HTTPS enabled for both was relatively easy once I learned about LetsEncrypt. Here’s how I did it, with only minimally working knowledge of things like DNS configurations.

# boba.life

boba.life is a domain I bought off of Namecheap, and it runs on an AWS EC2 server for which I have root access. This was astoundingly easy - I just followed [these steps](https://certbot.eff.org/instructions?ws=nginx&os=ubuntuxenial) I found from LetsEncrypt.org.

I copy/pasted a bunch of shell commands in my terminal and then I hit https://boba.life and saw that it just worked. The instructions were 7 steps and some of them were safeguards (make sure you’re running the latest version of something) and no-ops if you’re starting from fresh (uninstalling some potentially lingering past packages).

It turns out I actually _did_ uncover some problems with my setup due to some specific circumstances. More on that at the end.

# davidandsuzi.com

davidandsuzi.com is a domain I bought off of Godaddy about 10 years ago. It’s a Jekyll site set up/hosted through Github Pages (tangent - that was before I was paying for a server, so maybe I’ll eventually move it over to the aforementioned EC2 server). I followed these [docs](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https#enforcing-https-for-your-github-pages-site). There’s literally a configuration option for the repository under Settings > Code and automation > Pages:

![Github settings page to enable HTTPS]({{ site.url }}/imgs/httpsGithubPagesSettings.png)

It wasn’t exactly as easy as checking the checkbox. I think if you were setting all of this up right now, it would likely be that straightforward, but my checkbox was disabled because I had some legacy DNS settings floating around to make davidandsuzi.com point to Github pages. I had to go to Godaddy and fix some specific CNAME (for www.davidandsuzi.com) and A records (for davidandsuzi.com). I used the dig command in my terminal to check that things were eventually being routed to the correct records in my DNS settings. Here is it in the “after” state:

```
dig WWW.davidandsuzi.COM +nostats +nocomments +nocmd

; <<>> DiG 9.10.6 <<>> WWW.davidandsuzi.COM +nostats +nocomments +nocmd
;; global options: +cmd
;WWW.davidandsuzi.COM.		IN	A
WWW.davidandsuzi.COM.	3600	IN	CNAME	davidchang.github.io.
davidchang.github.io.	3600	IN	A	185.199.111.153
davidchang.github.io.	3600	IN	A	185.199.108.153
davidchang.github.io.	3600	IN	A	185.199.109.153
davidchang.github.io.	3600	IN	A	185.199.110.153

dig davidandsuzi.COM +nostats +nocomments +nocmd

; <<>> DiG 9.10.6 <<>> davidandsuzi.COM +nostats +nocomments +nocmd
;; global options: +cmd
;davidandsuzi.COM.		IN	A
davidandsuzi.COM.	1800	IN	A	185.199.108.153
davidandsuzi.COM.	1800	IN	A	185.199.110.153
davidandsuzi.COM.	1800	IN	A	185.199.109.153
davidandsuzi.COM.	1800	IN	A	185.199.111.153
```

Those CNAME and A record updates seemed to take about 10 minutes to go into effect, though Godaddy said in some cases, it could take more than an hour.

After this, I went back to that Github settings page and, after the DNS configuration was verified by Github (the UI treatment was pretty nice), I checked “Enforce HTTPS”. In the background, Github requests an SSL certification from LetsEncrypt and then also uploads it to the appropriate place. Until all of that was completed, I saw some downtime, where trying to hit davidandsuzi.com would show an error about an untrusted server. But in the time it took to drive to the local coffeeshop (Caffe Vita), it resolved.

Overall, the experience enabling HTTPS/SSL was very easy and I wish I had done it earlier. LetsEncrypt has done an amazing job pushing this forward, I do recommend using them if you’re unsure about how to go about enabling SSL.

# boba.life challenge:

I actually ended up running into some problems after enabling HTTPS on boba.life. I found that when I opened the mobile app, the app would instantly crash, whether you were logged in or out.

I had to run the app in development mode to figure out what was going on - the initial call to see if the user was authenticated was failing. Eventually I discovered that the GraphQL calls were throwing errors because they couldn’t be properly JSON parsed:

```
curl --request POST   --header 'content-type: application/json'   --url 'http://boba.life/graphql'   --data '{"query":"query { __typename }"}'

<html>
<head><title>301 Moved Permanently</title></head>
<body bgcolor="white">
<center><h1>301 Moved Permanently</h1></center>
<hr><center>nginx/1.10.3 (Ubuntu)</center>
</body>
</html>
```

In retrospect, this was due to this nginx config that LetsEncrypt / Certbot added - as long as the host matches, it rewrites everything on port 80 (HTTP) to use HTTPS (which was handled by another server block Certbot added that listens on port 443):

```
server {
  if ($host = boba.life) {
    return 301 https://$host$request_uri;
  } # managed by Certbot

  listen *:80;
  server_name .boba.life;
}
```

The fix took a long time to figure it out because I would rarely stop to try to learn how to use Nginx correctly. I eventually found [this documentation](https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms) from DigitalOcean really helpful.

After a lot of trial and error, the eventual fix was just to move logic into 2 separate location blocks - one that would match some routes that shouldn’t be rerouted to HTTPS, and the catch all that would reroute everything to HTTPS with a 301 redirect.

```
# this is where the pertinent Nginx config was on my setup
vim /etc/nginx/sites-enabled/default

# modified this code in the file
server {
  location /graphql {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-NginX-Proxy true;
    proxy_pass http://localhost:8080;
    proxy_set_header Host $http_host;
  }

  location / {
    if ($host = boba.life) {
      return 301 https://$host$request_uri;
    } # managed by Certbot
  }

  listen *:80;
  server_name .boba.life;
}

# to restart Nginx
systemctl restart nginx
```
