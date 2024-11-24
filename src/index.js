import React,{useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

const mysql = require('mysql2/promise');
const {NodeSSH}  = require('node-ssh');


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  useEffect(() => {
    async function getAPI(){
      const result  = "SELECT * FROM test";
      console.log(result);
    }
  })
  return (
    <div className="App">
          helop
    </div>
  );
}

reportWebVitals();
