--- 
title: Another Site Update
tags: 
- david
meta: 
  _edit_last: "1"
status: publish
layout: post
type: post
published: true
category: David
---
<p>As a follow up to the first site update that took place three months ago (<a href='http://davidandsuzi.com/site-update'>http://davidandsuzi.com/site-update</a>), I mentioned it might be nice to use a tool called Jekyll to convert the blog into static files that could be served faster. At the time, I had gotten about a 28% improvement, down to 1.871s for load time. After moving to Jekyll, which is now being used, here are the differences:</p>
<ul>
<li><a href='http://www.webpagetest.org/result/130220_1R_SNJ/'>Before</a> - first view was 2.014s and repeat view was 0.657s</li>
<li><a href='http://www.webpagetest.org/result/130304_W2_2CF/'>After</a> - first view was 0.6s and repeat view was 0.069s</li>
</ul>
<p>That's a 70% improvement on the first view and a 90% improvement on the repeat (if you were to visit a page you've already loaded). That's pretty nifty! Besides the improvements in latencies, all of my hosting is now done on Github (<a href='https://github.com/davidchang/davidandsuzi.com'>https://github.com/davidchang/davidandsuzi.com</a>) and my domain just redirects there. That means I can stop paying for hosting (which will save some $60 a year, since I don't really need PHP and could just use Heroku should that need arise) and everything is now under version control, so I don't have to freak out about losing all of my content.</p>
<p>I had to piece together my Wordpress theme into static HTML, figure out how to run Jekyll on the laptop, and wrestle with a bunch of Bootstrap style files. I originally thought it would be faster to access the Bootstrap styles via CDN, but then I discovered the Twitter Bootstrap customize page and downloaded only the minimum I needed - only some basic element tags and the responsive stuff. That was mostly everything.</p>
<p>In terms of challenges, I had to rethink of a new home page, then had to surrender my next and previous links on each post page. (I'm sure there's a trivial way of solving the problem, but I didn't look into it). I struggled with figuring out how the different media queries were affecting the page, since I've never had to work on that. I also had to change the A record on my domain to point to Github, and thought it didn't work, but revisited after 2 days and saw that it was working fine!</p>
<p>After spending some time here and there over the past month, it's been a nice project to get it up and running, and it's nice to think that my site is much snappier.</p>
