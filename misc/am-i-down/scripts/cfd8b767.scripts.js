"use strict";angular.module("amIDownOnePageApp",["LocalStorageModule"]).config(["$routeProvider",function(e){e.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("amIDownOnePageApp").controller("MainCtrl",["$scope","localStorageService",function(e,t){function n(t){if(!t||!t.length)return 100;for(var n=(new Date).valueOf(),r=n-e.startTime,i=0,a=!0,o=null,u=0,l=t.length;l>u;++u)a&&!t[u].up?(o=t[u].time,a=!1):(i+=t[u].time-o,a=!0);a||(i+=n-t[t.length-1].time);var m=100*(r-i)/r;return m}t.get("startTime")?e.startTime=t.get("startTime"):(e.startTime=(new Date).valueOf(),t.add("startTime",(new Date).valueOf())),e.text="";try{e.times=JSON.parse(t.get("times"))||[]}catch(r){t.clearAll(),e.times=[]}var i=function(n){e.times.push({text:e.text,time:(new Date).valueOf(),up:n}),t.add("times",JSON.stringify(e.times)),e.text="",e.currentlyDown=!e.currentlyDown};e.moodDown=function(){i(!1)},e.moodUp=function(){i(!0)};try{e.currentlyDown=e.times&&!e.times[e.times.length-1].up}catch(r){e.currentlyDown=!1}e.uptime=n(e.times),setInterval(function(){e.uptime=n(e.times)},5e3),e.isUp=function(e){return e?"up":"down"}}]),angular.module("amIDownOnePageApp").filter("reverseByTime",function(){return function(e){return e.slice().reverse()}});
