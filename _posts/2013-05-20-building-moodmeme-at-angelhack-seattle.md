--- 
title: Building Moodmeme at Angelhack Seattle
description: What I learned building Moodmeme at Angelhack Seattle
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
This past weekend, I did my first hackathon, put on by Angelhack. I did a bunch of things I had never done before, including this:

- Setting up an EC2 instance on my own and deploying our Github repository
- Getting both Facebook and Twitter authentication working consistently and reliably
- Using MongoDB as a backend database
- Implementing a real RESTful API in Node/Express
- Sending emails in Node with the nodemailer package
- Been a part of a pitch
- Consumed 3 Red Bulls in < 24 hours

Our team consisted of the following:

- Chris, a coworker at Amazon, who came up with the idea about 5 days before the hackathon, did all of the D3 stuff, much of the front end styling, the business research, and made two awesome pitches
- Gary, who goes to church with Chris and works at F5. Gary started from scratch and was solely responsible for developing the working, notification-driven Android app
- Sean, who we picked up at the competition, who was a UX designer. He designed the mocks and functionality and worked on our front end
- I worked on the general web functionality - getting an Angular app running on the front end with Facebook/Twitter authentication and implementing the back end to save data to Mongo
- 
Our idea was to build a site called [MoodMeme](http://moodmeme.com:3000) that does the following:

- Allows you to manage your mood by setting metrics through HTML5 sliders
- Shows you pictures of dogs to cheer you up
- Has some data visualization of your mood over time
- Allows you to invite your friends to be notified if your mood hits a certain threshold

The competition was 24 hours long. We spent about the first 17 hours coding, got some sleep, went to church, then made our pitches. There were around 36 teams, so we were split into 3 groups of 12. Each group of 12 pitched to 2 judges and the top 2 of each group would move on to the finals to pitch before all 6 judges and everyone else. We made the finals and were second to pitch. I really thought we might win, until the last group presented (which ultimately got second). We were the youngest presenters at that point and had shown the most technically complete demo, so I thought they might give it to us. In the end though, we didn't place. I don't think we could have done anything too much better in our development or that Chris could have done anything more in his pitches - I think it just came down to our business idea/model/liability.

Some of my notes from the competition:

- I set up a Github repository for our code and added everyone from our team as contributors: [https://github.com/davidchang/MoodMeme](https://github.com/davidchang/MoodMeme)
- I started from a boilerplate I had made a few months earlier which was a general Express app working with Passport to authenticate Facebook apps and save users to a Redis instance: [https://github.com/davidchang/express-facebook-boilerplate](https://github.com/davidchang/express-facebook-boilerplate)
- I followed the MEAN stack that I saw in an article a few weeks ago: [http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and](http://blog.mongodb.org/post/49262866911/the-mean-stack-mongodb-expressjs-angularjs-and)
- I set up an AngularJS application that didn't use ng-view or Yeoman. Each page imported its own Angular controller file. I didn't exactly follow that MEAN stack in that the same data saved in Mongo wasn't the same model data I used in Angular, which would have made everything a lot easier and seamless. I made a service called REST that was responsible for the $http.post()'s and $http.get()'s
- From the Express Facebook boilerplate I had made, we started saving user data in Redis, but when we needed to save more relational data, I started using Mongodb (and Mongoose to define schemas) because MongoDB is a more relational data store that allows you to just write Javascript objects and Redis is a key-value store, where I think both keys and values are strings (so I was JSON parsing and stringifying JS objects every time I was writing)
- I started off with a lot of momentum and adrenaline, but was pretty much wrecked by 10pm that night. I had 3 Red Bulls throughout the competition and didn't eat much of the catered meals. I'd get into ruts, but it helped a lot to see the other guys in the team press on and make progress
- I attended an informational on AWS (though it was centered more on development for the Kindle) and received $100 in AWS credits. I set up an EC2 instance and took a while to figure everything out. I chose the first AMI I saw when I searched the word Node. I modified the security group so that I could ssh into the box (keeping in mind that I needed a private key: ssh -i privateKey.pem root@hostname). A while later, I realized I needed to modify the security group again so that other main ports could be opened (HTTP, HTTPS). Since Express runs on port 3000 by default, I needed to open port 3000. Since Chris owned moodmeme.com, he went in and modified the domain's CNAME to hit the IP of the EC2 instance we had gotten
- Passport's pretty baller for authentication. Setting up Facebook and Twitter just meant setting up applications to allow signin and plugging in those credentials into a config file. We chose not to allow local signin because I didn't want to save passwords or consider what would happen if someone lost their password. I followed someone's advice in terms of Facebook and making an app for devo and a separate app for prod (so two sets of credentials). Here, the callback does matter - so the devo callback URL is localhost:3000, while the prod callback points back to moodmeme.com
- We didn't get to implement inviting friends. I figured out how to send emails through the nodemailer package, which sent things from my gmail account (I had to set up an application-specific password through Gmail to do so). We just didn't wire everything up to send emails. After that, I didn't have anything in the database to model "friendships", especially after someone followed a link and was prompted to sign in
- Styling was ridiculously difficult at 2 or 3am. I couldn't do anything. Chris eventually stepped in, as he was alert from consuming a Red Bull. To sidestep all of that responsive stuff, we made our main container 400px and centered everything. We used Bootstrap completely uncustomized, but one of the judges said it was well designed.
- We only had 1 git conflict... and it was just styles. That was pretty awesome. It was also nice to use git branching to right way.

In all, it was still a really solid experience. I remarked to the other team members that I don't think I've ever been that productive before. Everything just seemed to work. Now that I've got a bit more confidence with Mongo and social signin and Angular, I'm looking forward to see how this plays out in my other side project apps.
