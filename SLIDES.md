# Building Your Own Custom Renderer

---

# Hi, I'm Steve

- Senior principal engineer && architect at [Twilio](https://twilio.com/jobs).
- Founder/organizer of [DinosaurJS](https://dinosaurjs.org).
- Author of [Electron in Action](https://bit.ly/electronjs).
- Instructor with [Frontend Masters](https://frontendmasters.com).
- Founder of the front-end program at the [Turing School of Software and Design](https://turing.io).

---

## I'm _real_ bad at social media, these days.

- [@stevekinney on Twitter](https://twitter.com/stevekinney)
- @steve on [Denver Devs](https://denverdevs.org)

---

## Alright. Let's talk about goals.

- Take the mystery out of this.
- Cover the high-level basics.
- Learn a bit more about what ReactDOM is doing under the good.
- Humble myself as I try to live code for a bit.

---

## There is a lot to React these days.

- Custom components
- `props` and `state`
- Hooks (e.g. `useState`)
- Context API
- Effects, Lifecycle methods

---

## Also, also, also!

- `key`, `ref`
- `React.lazy`
- Error boundaries
- Concurrent mode
- Suspense

---

## But, somehow not…

- Some kind of state management that is mildly aware of AJAX.
- A router with an API that doesn't change every six months.

(But, I digress.)

---

But, like React also targets lots of platforms these days.

- ReactDOM
- [React Native](https://github.com/facebook/react-native)
- [React Native DOM](https://github.com/vincentriemer/react-native-dom)
- [React TV](https://github.com/raphamorim/react-tv)
- [React PDF](https://github.com/diegomura/react-pdf)

And [more](https://github.com/chentsulin/awesome-react-renderer)…

---

## All of the good ideas were taken and frankly, the weirder I got with it, the more esoteric knowledge you needed.

So, we're going to implement an overly simple version of ReactDOM.

(Fight me.)

---

```js
import Reconciler from 'react-reconciler';
```

---

There are two reconcilers:

- The Stack Reconciler (React 15 and earlier)
- The Fiber Reconciler (React 16 and greater)

There are two modes for the Fiber reconciler:

- Mutation mode
- Persistent mode

---

## Real World Examples

- [React ART](https://github.com/facebook/react/blob/master/packages/react-art/src/ReactART.js) and its [host config](https://github.com/facebook/react/blob/master/packages/react-art/src/ReactARTHostConfig.js)
- [React DOM](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOM.js) and its [host config](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js)
- [React Native](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeRenderer.js) and its [host config](https://github.com/facebook/react/blob/master/packages/react-native-renderer/src/ReactNativeHostConfig.js)

---

# Live Coding

(Wish me luck.)

https://github.com/stevekinney/penance

😨

---

# Thank you!

- [@stevekinney on Twitter](https://twitter.com/stevekinney)
- @steve on Denver Devs

I don't check either of those these days.
