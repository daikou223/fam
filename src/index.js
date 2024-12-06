import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


function App() {
  const [data, setData] = useState(null);
  function chasta(sta){
    axios.post('/api/users',{
      "id":1,
      "state":sta
    })
    axios
      .get('/api/users')             //リクエストを飛ばすpath
      .then(response => {
          setData(response.data);
      })                               //成功した場合、postsを更新する（then）
      .catch((error) => {
          console.log('通信に失敗しました',error);
      }); 
  }
  useEffect(() => {
    /*fetch('http://localhost:4000/api/users')
      .then((res) => res.JSON())
      .then((data) => setData(data));*/
      axios
      .get('/api/users')             //リクエストを飛ばすpath
      .then(response => {
          setData(response.data);
      })                               //成功した場合、postsを更新する（then）
      .catch((error) => {
          console.log('通信に失敗しました',error);
      });                             //失敗した場合(catch)
  }, []);
  console.log(data);
  if (!data) {
    // データがロードされるまで何も表示しないか、ローディング表示
    return <div>Loading...</div>;
  }
  return( <div>
    <ul>
        {/* dataが存在している場合のみ表示 */}
        {data.map((user, index) => (
          <li key={index}>{user.name} {user.state}</li>
        ))}
      </ul>
      <button onClick = {()=>chasta(2)}>帰宅</button><button onClick = {()=>chasta(1)}>外出</button>
    </div>
  )
}

reportWebVitals();
