---
date: 2016-11-5 22:40:00
title: How to use Draft Plugins
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

On top of Draft is a plugin framework for easy distribution of plugins. There are some useful things here, like support for emojis, hashtags, stickers, mentions, etc. I want to show how simple this integration is. Let's start with the hashtag plugin and then throw a few other plugins in as well.

Following [https://www.draft-js-plugins.com/plugin/hashtag](https://www.draft-js-plugins.com/plugin/hashtag), we have to run

    npm install draft-js-plugins-editor && npm install draft-js-hashtag-plugin

Then, we only need to modify about five different lines! The Draft JS plugins editor exposes an Editor component that is meant to act as a sort of higher order component on top of the normal Draft JS editor. Basically, you can interact with the plugins Editor exactly as you would with the normal Draft JS Editor, but the plugins Editor also gives you some new behavior - it receives plugins and decorators properties.

So instead of:

    import {Editor, EditorState, ...someOtherThings} from 'draft-js';

We will just do

    import Editor from 'draft-js-plugins';
    import {EditorState, ...someOtherThings} from 'draft-js';

Then, per the above plugins documentation, we import the appropriate styles and create an instance of the plugin:

    import 'draft-js-hashtag-plugin/lib/plugin.css';
    const hashtagPlugin = createHashtagPlugin();

The instance of the plugin is something that we'll pass in to the Editor plugins prop:

    <Editor
      ref="editor"
      editorState={this.state.editorState}
      handleKeyCommand={this.handleKeyCommand}
      onChange={this.onChange}
      plugins={[hashtagPlugin]}
    />

With those changes alone, we've augmented our previous Editor which saved into local storage and respected conventional keyboard commands to make things bold or italicized or underlined into also styling hashtags nicely!

I stumbled upon this rich buttons plugin that looks pretty interesting - https://github.com/jasonphillips/draft-js-richbuttons-plugin. Let's try installing that as well!

    npm install draft-js-richbuttons-plugin —save

Just as before, import and create an instance of the plugin:

    import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
    const richButtonsPlugin = createRichButtonsPlugin();

Then, per the documentation for that module, I'm going to access all of the buttons that I want from the plugin (in this case, all of them):

And going to display all of them above the Editor component in my render function:

    <div>
      <BoldButton />
      <ItalicButton />
      <MonospaceButton />
      <UnderlineButton />

      <ParagraphButton />
      <BlockquoteButton />
      <CodeButton />
      <OLButton />
      <ULButton />
      <H1Button />
      <H2Button />
      <H3Button />
      <H4Button />
      <H5Button />
      <H6Button />
    </div>

Finally, as before, I need to specify the new richButtonsPlugin in the plugins prop to the Editor component:

    <Editor
      ref="editor"
      editorState={this.state.editorState}
      handleKeyCommand={this.handleKeyCommand}
      onChange={this.onChange}
      plugins={[hashtagPlugin, richButtonsPlugin]}
    />

Restarting the app shows that I now have a list of buttons at the top of the page, and when I hover over some bolded or monospaced text, the appropriate button changes styling to indicate that it knows that it's already bolded or monospaced. And since all of our other code is untouched, the editor state is still being properly synced to and from localStorage and properly styled upon renders.

This is actually very cool and very easy.
