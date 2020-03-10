# Building Your Own React Renderer

## Preamble

There is a lot to React.

But also: React is a lot of things to a lot of different people, right? Classically, React targets the browser. But, we know that there is React Native as well, right? You can use React to render to PDF.

You can even use React to control hardware.

Let's be real honest with each other. I'd love to tell you that we could write all of ReactDOM in like 20 minutes together.

That's not going to happen. But, in this talk: I'd like to do the following:

- Give you the conceptual framework for showing how this all works. In other words, I'd like to take the mystery out of this.
  - For some of you, this is your first time hearing that this is even a thing.
  - For others, you might have heard about it, but been either meaning to look into it or intimidated.
- Go through the high-level basics: Talks like this are always a tricky balancing act because:
  1. You're never going to _actually_ learn this until you do it.
  2. Watching me get _really_ into the weeds is going to be a nightmare.
- Get a better understanding of how React does it's thing under the hood.

## Background

When I was a kid, React and ReactDOM were one in the same. But, when React Native dropped this distinction became a little fuzzier.

There were core parts of React that were common regardless of what platform you were targeting (e.g. state management).

- Custom components (of the class-based and function-based variety)
- `props` and `state`
- Hooks (e.g. `useState`)
- Context API
- Effects, Lifecycle methods
- `key`, `ref`
- `React.lazy`
- Error boundaries
- Concurrent mode
- Suspense

And there is also a bunch of stuff _directly_ related to what we're going to call the "host environment."

- ReactDOM hosted components (e.g. `div`, `span`, `h1`)
- React Native hosted components (`View`, `Text`, `Image`, etc.)

## Introducing React-Reconciler

### Mutation mode

Stuff changes, so we mutate the DOM. This is mutation mode. It's what we know and love.

```js
const div = document.createElement('div');
div.style.color = 'red'; // mutation
```

This is also the one that we're going to be playing with today.

### Persistent Mode

Create an entire new tree each time.

- You're creating a immutable view.
- You're outright replacing it whenever "stuff" changes.

## Real World Examples

- [React ART](https://github.com/facebook/react/blob/master/packages/react-art/src/ReactART.js) and its [host config](https://github.com/facebook/react/blob/master/packages/react-art/src/ReactARTHostConfig.js)
- [React DOM](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOM.js) and its [host config](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js)
- [React Native](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeRenderer.js) and its [host config](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeHostConfig.js)

## Demonstration

We're going to build a simple version of React DOM.

The most basic shell:

```js
import Reconciler from 'react-reconciler';

const hostConfig = {
  // You'll need to implement some methods here.
  // See below for more information and examples.
};

const reconciler = Reconciler(hostConfig);

const NotReactDOM = {
  render(component, rootElement, callback) {
    const container = reconciler.createContainer(rootElement, false, false);
    reconciler.updateContainer(component, container, null, null);
  }
};

export default NotReactDOM;
```

So, whats the difference between `element` and `container`?
Think about `ReactDOM.render(<App />, document.getElementById('root'))`.

Alternatively, you could think about it something like this:

```js
const RendererPublicAPI = {
  render(whatToRender, whereToRenderIt) {
    // Do stuff
  }
};
```

(Also, just note that we're just not using `callback`. It's cool. You've probably never used it when using `ReactDOM.render` anyway. It's fine.)

### Taking It For Its First Spin

Spoiler alert: It blows up. (But, like did anyone expect it to just work?)

We're going to need the following stubs:

```js
const hostConfig = {
  getRootHostContext: () => {},
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {},
  shouldSetTextContent: () => {},
  createInstance: () => {},
  createTextInstance: () => {},
  appendInitialChild: () => {},
  appendChildToContainer: () => {},
  finalizeInitialChildren: () => {},
  supportsMutation: true
};
```

These are methods that React Reconciler calls internally.

With this implementation, nothing blows up, per se. But also: Like nothing works either. We just get a blank screen. I'm not sure if that's any worse or better.

As you do, let's just start by adding some `console.log` calls to one of the methods. `createInstance` seems like a good first candidate:

```js
createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    console.log({
      type,
      props,
      rootContainerInstance,
      hostContext,
      internalInstanceHandle
    });
  },
```

Alright, well that's interesting, right? Let's start by making elements based on what the types that come in.

```js
createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    console.log({
      type,
      props,
      rootContainerInstance,
      hostContext,
      internalInstanceHandle
    });
    const element = document.createElement('type');
    return element;
  },
```

## Making It Work

```js
createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    console.log({
      type,
      props,
      rootContainerInstance,
      hostContext,
      internalInstanceHandle
    });
    const element = document.createElement(type);
    return element;
  },
```

We should do something similar for text nodes. This will be called whenever we get something that is _not_ a component (hosted or otherwise). Basically, I'm talking about strings and numbers here. Primitives, if you will.

```js
createTextInstance: text => {
  return document.createTextNode(text.toUpperCase());
},
```

Why `toUpperCase()`? Because I'm ridiculous. That's why.

We're making elements and we're returning them so that the renderer can use them internally, but we're never putting them onto the page. Hmm…

```js
appendChildToContainer(container, child) {
  container.appendChild(child);
},
appendChild(parent, child) {
  parent.appendChild(child);
},
appendInitialChild(parent, child) {
  parent.appendChild(child);
},
```

This obviously would change in the event that we were _not_ targeting the DOM, right?

But, we are—so it's fine.

### What about attributes?

Let's say that I am building an HTML Email renderer. I could want to pass through all sorts of deprecated props. React used to not let you do this. How might I do it if wanted to pass through pretty much anything (except `children`, of course).

```js
for (const prop of Object.keys(props)) {
  if (prop !== 'children') {
    element[prop] = props[prop];
  }
}
```

This is probably _way_ too permissive, but it helps to make my point.

Can you get a little bit crazier with the what we do to the element?

```js
const comment = document.createComment('Something Import');
element.appendChild(comment);
```

This will add a comment as the first child to every element. This is helpful to me in the event that I'm working on some HTML Email render and you're regularly see nuts stuff like:

```html
<!-- [if (gte mso 9) | (IE)]>
<style>
     /* Your styles here */
</style>
<![endif] -->
```

So, in this case, I _want_ React to add comments, which is not something is does out of the box.

### What About Events?

Events might have been easier before functional components and definitely easier before Hooks. But here we are. It's 2020 and I have to write a hack to make this both work and be at all readible.

```js
const addEventListener = (element, eventType, listener) => {
  element.__hackyEventCache = element.__hackyEventCache || {};
  element.removeEventListener(eventType, element.__hackyEventCache[eventType]);
  element.addEventListener(eventType, listener);
  element.__hackyEventCache[eventType] = listener;
};
```

Basically, I'm just jamming an object onto the element in order to keep track of which event listeners are on it. I'm adding and replacing the event listeners. Sure, is there something more clever I could do. Yea, but it's besides the point.

```js
const addEventListener = (element, eventType, listener) => {
  element.__hackyEventCache = element.__hackyEventCache || {};
  element.removeEventListener(eventType, element.__hackyEventCache[eventType]);
  element.addEventListener(eventType, listener);
  element.__hackyEventCache[eventType] = listener;
};
```

Now, if it's one of the change handlers that we need, we'll add the event listener.

```js
createInstance: (
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) => {
    const element = document.createElement(type);

    for (const [prop, value] of Object.entries(props)) {
      if (prop === 'children') continue;

      if (typeof value === 'string') {
        element[prop] = value;
        continue;
      }
    }

    if (props.onSubmit) {
      addEventListener(element, 'submit', props.onSubmit);
    }

    if (props.onChange) {
      addEventListener(element, 'keyup', props.onChange);
    }

    const comment = document.createComment('An important insight!');
    element.appendChild(comment);

    return element;
  },
```

### Teaching Our React How to Modify the DOM

```js
{
  //...
  createTextInstance(text) {
    return document.createTextNode(text.toUpperCase());
  },
  appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  appendInitialChild(parent, child) {
    parent.appendChild(child);
  },
  removeChildFromContainer(container, child) {
    container.removeChild(child);
  },
  removeChild(parent, child) {
    parent.removeChild(child);
  },
  insertInContainerBefore(container, child, before) {
    container.insertBefore(child, before);
  },
  insertBefore(parent, child, before) {
    parent.insertBefore(child, before);
  },
  //...
}
```

### Preparing and Committing Updates

The short version here is that this is kind of where the virtual DOM magick happens.

We're going to see what's changed between the old props and the new props to figure out if we need to rerender. If we return a truthy value, then it'll try to make those changes—otherwise, we'll try to skip it.

#### Preparing

```js
prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) {
    const propKeys = uniq(Object.keys(newProps).concat(Object.keys(oldProps)));

    const payload = {};

    for (let key of propKeys) {
      if (key === 'children') continue;
      if (oldProps[key] !== newProps[key]) {
        payload[key] = newProps[key];
      }
    }

    if (Object.keys(payload).length) return payload;
  },
```

#### Committing

```js
commitUpdate(
  instance,
  updatePayload,
  type,
  oldProps,
  newProps,
  finishedWork
) {
  for (const [prop, value] of Object.entries(updatePayload)) {
    if (prop === 'onChange') {
      addEventListener(instance, 'keyup', value);
      continue;
    }

    if (prop === 'onSubmit') {
      addEventListener(instance, 'submit', value);
      continue;
    }

    instance[prop] = value;
  }
},
```

## Further Reading

- [Building a simple custom renderer to DOM](https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc)
- [Building a simple custom renderer to native](https://medium.com/@agent_hunt/introduction-to-react-native-renderers-aka-react-native-is-the-java-and-react-native-renderers-are-828a0022f433)
