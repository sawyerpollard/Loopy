import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import Controls from './components/controls.jsx';

const App = () => {
    return (
        <div className="w-screen h-screen pt-5 bg-gray-200">
                <div className="container shadow-inner rounded-xl ring-4 shadow-lg mx-auto p-5 bg-gray-100">
                    <h1 className="tracking-wider font-extrabold text-gray-800 text-3xl">loopy</h1>
                    <Controls />
                </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
