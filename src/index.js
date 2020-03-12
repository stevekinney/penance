import React from 'react';

import './index.css';
import Application from './Application';

import NotReactDom from './renderer';

NotReactDom.render(<Application />, document.getElementById('root'));
