---
date: 2016-11-5 22:39:00
title: Introduction to Draft.js
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

To understand Draft, one must first understand controlled inputs in React, because Draft is really just a controlled input. The simplest controlled input is a text field; the React way to put a text field on a page is to write the following:

```html
<input
  value={this.state.textValue}
  onChange={(e) => this.setState({ textValue: e.target.value })}
/>
```

We need the onChange because React architecture says your view should always just reflect your state. There isn't 2 way data binding - rather, you need to explicitly manually handle all changes. Without the onChange, eg

```html
<input value={this.state.textValue} />
```

You would have an input with a value that could never be changed. You could put your cursor inside of the input and type in it, but you would never see it change. That is, it will always reflect whatever this.state.textValue is.

In the same way, Draft is a controlled input, except here, Draft is a contenteditable element, and the value is not something as simple as a string (we need more of a vector than a scalar, because contenteditable can be more complex). It is an object that stores the actual content along with metadata (called Entities in Draft).

So Draft gives you a component called Editor, the value is an EntityState object, and there's an onChange function where you can update the EntityState. Anytime you touch the contenteditable basically runs through the onChange - like moving the cursor or selecting some of the contents. An entire app that places a Draft editor on the page looks like this:

```javascript
import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
  }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={(editorState) => this.setState({editorState})}
      />
    );
  }
}
```

This puts a sorta unimpressive contenteditable element on the page. One quick way to augment this is by being able to handle conventional key commands, like being able to make things bold, italicized, or underlined. The Editor component takes in an optional handleKeyCommand, through which all key presses are passed through. We can implement our own handleKeyCommand function, which will receive commands and can return the string 'handled' to prevent default behavior or 'not-handled' to defer to default behavior.

As for handling the actual bold/italicize/underline commands, Draft actually has a module called RichUtils, which can take care of all of this for us and will modify the EditorState appropriately.

```javascript
import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

class App extends Component {
  constructor(props) {
    super(props);

    let editorState = EditorState.createEmpty();
    this.state = {editorState};

    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
      />
    );
  }
}
```
