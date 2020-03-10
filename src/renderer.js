import Reconciler from 'react-reconciler';
import uniq from 'lodash/uniq';

const addEventListener = (element, eventType, listener) => {
  element.__hackyEventCache = element.__hackyEventCache || {};
  element.removeEventListener(eventType, element.__hackyEventCache[eventType]);
  element.addEventListener(eventType, listener);
  element.__hackyEventCache[eventType] = listener;
};

const hostConfig = {
  getRootHostContext: () => {},
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {},
  shouldSetTextContent: () => {},
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
  createTextInstance: text => {
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

  finalizeInitialChildren: () => {},
  supportsMutation: true
};

const reconciler = Reconciler(hostConfig);

const NotReactDOM = {
  render(whatToRender, rootElement, callback) {
    const container = reconciler.createContainer(rootElement, false, false);
    reconciler.updateContainer(whatToRender, container, null, null);
  }
};

export default NotReactDOM;
