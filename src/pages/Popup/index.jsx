import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';

import makeLogger from '@/lib/makeLogger';
const logger = makeLogger('popup');
logger('listening...');

render(<Popup />, window.document.querySelector('#app-container'));
