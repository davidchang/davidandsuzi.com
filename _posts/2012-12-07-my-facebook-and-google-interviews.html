--- 
title: My Facebook and Google Interviews
tags: []

meta: 
  _edit_last: "1"
status: draft
layout: post
type: post
published: false
---
Note: This is not meant to be published.

Before I forgot everything that happened, I'm going to recap on my experiences for the Facebook and Google interviews I had on 10/19 and 11/2 respectively.

Facebook

I had one onsite interview at Facebook Seattle (a few blocks from Amazon) after meeting a recruiter at a tech talk and going through an initial, nontechnical phone screen. The onsite was an hour long with a Chinese guy who had moved over from Microsoft and had been working on the backend for Messages. He asked two basic questions, and then I heard back about a week later that I wouldn't be moving on.

The first question was, given two sorted arrays of integers, print out all of the duplicates. If there were multiple occurrences of the same duplicate (like 2 2's appeared in both arrays), then print both of them: 2 2''s. After doing this, he changed the problem specification and asked what I could do to print out only each occurrence of the duplicates, regardless of how many times both appeared (so 2 2's would only print out 1 2). For this, I added a variable to keep track of the last duplicate encountered. But I didn't know what to do for the very first element, and the interviewer pointed out that setting the first duplicate encountered to something like x[0] - 1 would throw an error if x[0] was Integer.MIN_VALUE. He suggested that I should have used the index of the last duplicate encountered, and I said that it would complicate the business logic a bit, and he agreed.

The second question he asked was more C++-esque. Even the method signature he gave was using a pointer, and so I knew I was a bit out of my element. He gave me a method signature that read like this: readFile(fh fileHandle, char* buf) that read 4000 bytes from the fileHandle and returned the number of bites that were read. If the file was > 4000, it would only read 4000 bytes and then return the number 4000, and if the file was < 4000, it would only read that much into buf and return the number of bytes read.

The problem was to implement a new function, readFile(fh fileHandle, char* buf, int size) that would allow the user to specify any size, but it would be implemented using the earlier function that could only read 4000 at a time. I implemented using a while loop and switched everything over to Java, but I copied from one buffer to another and the interviewer pointed out that the second buffer might not be able to hold as much as the first buffer. I felt like this was pointing at language specific details that I wasn't very comfortable with.

Afterwards, I felt good, thinking that I hadn't really done anything that would prevent me from moving on. I was told I'd hear back the next Monday or Tuesday (interview was on a Friday), but it actually ended up being the next Monday when I heard back.

As for Google, I had two hour long interviews at their Kirkland offices on 11/2.

My first interviewer, Andrey, was Russian and had a full beard. He had worked on the Webmaster Tools frontend for like 6 years and then had spent the last year working on Google Cloud stuff. He asked me to validate a Sudoku solution, a 9x9 grid, where some of the spaces were filled in and some of the unfilled spaces were represented with 0's. He asked for time and memory complexity. He then asked me how my code would change if the radix was 2 instead of 3, so I was dealing with a 4x4 grid. He then asked how my code would change if the Sudoku grid was 3 dimensional. He then asked how things would change if the Sudoku grid was n dimensional.

Then he asked how I would represent a data structure for that n dimensional Sudoku in Java, and I mentioned that it would do well in a statically typed language like PHP where you can stuff arrays with anything you want, but he asked how I would do it in Java. I stumbled and gave something like this:

<pre>
public class Dimension {
List<Dimension> dimensions;
something to store data here
}
</pre>

Afterwards, he asked me to devise an algorithm (not necessarily write code) that would, given a dictionary and a string, determine if the string could be split into 2 different valid words (as defined in the dictionary). He then asked how things would change if the string could be split into n words, and the algorithm I had come up with was revealed to be exponential. I suggested the dictionary could be stored as a trie and that you would iterate through the string and if you found a word, then you would try the same approach with the "rest of the word," while also branching off in case the "rest of the word" couldn't be resolved into valid dictionary words. He helped me along though, asking if we could do better than exponential and asking what about the problem was causing it to be exponential.

My second interviewer was a guy who had come from Amazon and had been working on Dremel, a system that allows querying of massive log files in real time (like it processes a petabyte worth of logs in a matter of minutes). We talked at length about Amazon and work-life balance and the stuff I've worked on in the past year - we started the first 20 minutes talking about it.

His first question was to implement an iterator given a stream of numbers where the first number would represent the occurrences of the second number. So if the stream was 3 8 2 10 0 9 1 50, then the output expected from the iterator would be 8 8 8 10 10 50. I wrote the next() and hasNext() functions and it went pretty smoothly.

The second question was to design a system and write a function that would take 2 four letter words and return a boolean if they formed a word ladder (meaning 1 letter can be changed to form a valid word multiple times until you arrive at a target word). I spoke about preprocessing and gave a solution where every four letter word is connected to a trie of all possible words it forms a word latter with (not immediate neighbors, but all neighbors), so that latency would be particularly low. I said the database would be something like a key value, NoSQL schemaless solution. I wrote the preprocessing code to fill that database, but wasn't able to do it exhaustively.

12/7 - My second/final interviews with Google - I went back in to the Kirkland office for two more interviews and then an informal, non-feedback-submitted lunch interview. The interviews were supposed to be the final round and yet were surprisingly easier than even the first two. I'm a bit confused and even a little agitated.

My first interview was with a guy named Justin who was working on media elements in Chrome. He had been there for about a year and a half and was from Canada. He asked initially how to find the median of three numbers. I had read the question on Glassdoor, but I couldn't recall the answer. I remembered it as I drove back - I should have only needed 2 comparisons.

(a-b)(c-a) < 0 would mean a is the median. (b-a)(c-b) < 0 would mean b is the median. else, c is the median.

Instead, I said the elementary, brute force solution would take 8 comparisons and mentioned that I knew of some kind of mathematical property that would decrease down to 2 comparisons.

He then asked about finding the median of a list of n integers, at which point I mentioned that one could do a modified quicksort that would take average time of O(n) based on average selected pivots, but could take O(n^2) for poorly chosen pivots. I couldn't figure out how to optimize on that.

Then he asked about how to determine from a String what pages to print for a printer (the user could type in something like 1-5,8-9,10-12 and would want to print those pages, and if they added 2-5, we wouldn't want to print redundant pages again). I talked about using an array or a Long (where you set the bits) and he asked for something that could accommodate more in size. I mentioned lists or hash tables, saying a list would take some retrieval time, then just said I should use a set (and resolved on a tree set, so everything would be sorted). He had me code it up. He then asked to back up and asked for a different way of solving the problem, then we later compared the two. I said we could store the individual intervals in a list, but then it would be more complicated to write/error prone, but it would take less space and be potentially faster in terms of time complexity. He had me write a doesOverlap function between 2 intervals and then asked how that merging would take place if it doesOverlap.

After that, I had another interviewer named Greg who worked in infrastructure and had been doing a PhD in computer languages (he really liked Scheme, was somewhat offended at Go). He only asked me one question, in which he defined an Iterator interface (with hasNext and next functions) and a Predicate interface (with boolean accepts function) and asked me to write a function with this signature: Iterator<T> filter(Iterator<T> in, Predicate<T> p). The trick was to implement a myIterator class that extended Iterator<T> and make in and p fields in that Iterator, then to modify that hasNext and next functionality of myIterator. I mistook it and wanted to pass through everything in "in" and write it to a new Iterator. It took me a while to determine what he was really saying and where he was leading me. I was not upset, but a little taken aback.

That was the only question he asked me :/ We then talked about distributed systems and some of my work at Amazon and some problems regarding availability and replicated data stores, like transactions in databases and sending messages and what would happen if you committed the transaction and your service crashed before sending the message. I said stuff about idempotency and he seemed fine with it. And... that was it. He let me ask him some questions. It was hard to tell how I had done, and his body language somewhat indicated that he wasn't too happy.

Then I had a lunch interview that was pretty standard. The guy talked a lot about the different benefits and bonuses that are available at Google and some of the different teams in Kirkland, then said that the review committee meets every Wednesday and decides whether they're inclined to hire. Also said that every new hire spends a week of orientation down in Mountain View, so that sounded pretty good. At the same time, the cafeteria food was somewhat mediocre and I wondered how good of a fit the Kirkland office would be. Overall, I'm still pretty impressed, with Google being Google, but I'm a bit distraught that I wasn't asked harder questions and that I'll have to wait the next 2 or 3 weeks to hear back from them.
