---
date: 2016-11-5 22:41:00
title: How to Use Draft Decorators
description:
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

If we want to move past consuming Draft and plugins into writing our own specific styles and behaviors, there are three main concepts you might want to learn - decorators, custom blocks, and entities. I hope to cover each of those three in individual articles - this one will focus on decorators.

Decorators generally mean additional styles being applied to the text itself (applying a certain transformation to the text every time the ContentBlock is rendered), while entities allow you to attach metadata and specific behavior to the text (adding in information that is stored alongside the text in the ContentBlock).

We've already consumed the HashtagPlugin, which was basically just a decorator. The decorator consists of two main things: a function that runs over text and identifies the text that ought to be decorated (using, for example, a regular expression) and a React component that will be applied to that text.

Let's write a basic decorator that will recognize when you write color hexadecimal codes and will apply that color to it. So if you type `#FF0000`, we will render it in the color red, and `#0000FF` will become blue, and so on.

We start with writing the function that identifies what text should be decorated. The way this works is that we define a function that receives a ContentBlock and a callback function as the arguments. The callback should be invoked on each matching piece of text (you get the text content of the ContentBlock by calling the getText method).

That function looks something like this:

    const COLOR_REGEX = /#[0-9A-Fa-f]{6}/g;
    function colorStrategy(contentBlock, callback) {
      const text = contentBlock.getText();
      let matchArr, start;
      while ((matchArr = COLOR_REGEX.exec(text)) !== null) {
        start = matchArr.index;
        callback(start, start + matchArr[0].length);
      }
    }

If contentBlock.getText() returned this string:

    roses are #FF0000, violets are #0000FF

then callback would be invoked twice, because the color regular expression finds `#FF0000` and `#0000FF`. Callback would then be invoked on the appropriate indices surrounding those color codes - 10 and 17, and 31 and 38.

Callback tells the decorator to insert the defined component in place of the matched text. The markup would end up looking something like this:

    roses are <ColorComponent>#FF0000</ColorComponent>, violets are <ColorComponent>#0000FF</ColorComponent>

where the matching text really is props.children.

ColorComponent will end up being a fairly straightforward component, which can be expressed as a function since it's stateless and requires no lifecycle hooks:

    const ColorComponent = (props) => {
      return (
        <span style={{color: props.decoratedText}}>{props.children}</span>
      );
    };

\[Contrary to my first thought, we can't just do {color: props.children} in the style attribute because props.children is really an array with a single element, which happens to be a DraftEditorLeaf object.\]

Now that we've got our “strategy” function and the corresponding React component, we can create something called a CompositeDecorator and tell our Editor about it. We tell our Editor about it by passing in the decorators to the EditorState object.

This looks something like this:

    const decorators = new CompositeDecorator([{
      strategy: colorStrategy,
      component: ColorComponent,
    }]);

    // then, when creating the EntityState object,
    let editorState = EditorState.createEmpty(decorators);

That's all the wiring up that is necessary. If you run this code, it should work. If it doesn't seem to be working, check that you're using the Editor component from the Draft module and not the Draft Plugins module (this honestly took me like many hours to figure out).

***

You may be thinking - we just started using the Draft JS Plugins architecture in the last article. How do we take what we've done and make it compatible with Draft JS Plugins, where instead of creating a CompositeDecorator and creating the EditorState with it, we can just list off the ColorPlugin with all the other plugins we might want to use?

Plugins are just plain old Javascript objects that can define different its behavior by adding different properties. In this case, we are only using decorator functionality, and the code will look just like this:

    const colorPlugin = {
      decorators: [{
        strategy: colorStrategy,
        component: ColorComponent,
      }],
    };

And consume it as we would consume any other Draft plugin:

    <Editor
      ref="editor"
      editorState={this.state.editorState}
      handleKeyCommand={this.handleKeyCommand}
      onChange={this.onChange}
      plugins={[colorPlugin]}
    />
