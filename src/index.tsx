import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Hello from './containers/Hello';
import Auth from './containers/Auth';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { enthusiasm } from './state/reducers';
import { StoreState } from './state/types';

import './styles.global.scss';

const store = createStore<StoreState, any, any, any>(enthusiasm, {
    enthusiasmLevel: 1,
    languageName: 'TypeScript'
});

ReactDOM.render(
  <Provider store={store}> 
    <Auth />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
