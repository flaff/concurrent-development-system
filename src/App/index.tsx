import * as React from 'react';
import './styles.css';

const logo = require('./logo.svg');

const App = () => (
    <div className="App">
        <div className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h2>Welcome to React</h2>
        </div>
        {[1,2,3,4].map((no, key) => <div key={key}>{no}</div>)}

        <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
    </div>
);

export default App;

