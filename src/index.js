import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then((res) => setData(res))
      //.then((data) => setData(data));
  }, []);
  console.log(data);
  return <div>{data ? data.url : data}</div>;
}

reportWebVitals();
