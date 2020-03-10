import Reconciler from 'react-reconciler';
import uniq from 'lodash/uniq';

const hostConfig = {};

const reconciler = Reconciler(hostConfig);

const NotReactDOM = {
  render(whatToRender, rootElement, callback) {
    const container = reconciler.createContainer(rootElement, false, false);
    reconciler.updateContainer(whatToRender, container, null, null);
  }
};

export default NotReactDOM;
