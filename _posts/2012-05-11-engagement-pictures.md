--- 
title: Engagement Pictures!
tags: 
- Photos
meta: 
  _edit_last: "1"
status: draft
layout: post
type: post
published: false
category: David
---
<div id='myCarousel' class='carousel'>
	<div class='carousel-inner'>
		<div id='item0' data-item='0' class='active item'>
			<img src='http://davidandsuzi.com/wp-content/uploads/2012/05/proposal1.jpg'/>
		</div>
		<div id='item1' data-item='1' class='item'>
			<img src='http://davidandsuzi.com/wp-content/uploads/2012/05/proposal2.jpg'/>
		</div>
		<a id='carouselLeft' class='carousel-control left'>&lsaquo;</a>
		<a id='carouselRight' class='carousel-control right'>&rsaquo;</a>
	</div>
</div>
<script src='//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js'></script>
<script>$(function(){var size=1;function adjust(direction){var $active=$('#myCarousel .active.item');var number=parseInt($active.attr('data-item'))+direction;$active.removeClass('active');if(number<0)number=size;if(number>size)number=0;$('#item'+number).addClass('active');}$('#carouselLeft').click(function(){adjust(-1);});$('#carouselRight').click(function(){adjust(1);});});</script>
