import Reconciler from 'react-reconciler';

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
    console.log({
      type,
      props,
      rootContainerInstance,
      hostContext,
      internalInstanceHandle
    });
    const element = document.createElement(type);

    for (const prop of Object.keys(props)) {
      if (prop !== 'children') {
        element[prop] = props[prop];
      }
    }

    const comment = document.createComment('Some data');

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
