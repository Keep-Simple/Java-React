import React from 'react';
import { render } from 'react-dom';
import Home from './scenes/Home';

import './styles/reset.scss';
import 'semantic-ui-css/semantic.min.css';
import './styles/common.scss';

render(<Home />, document.getElementById('root'));
