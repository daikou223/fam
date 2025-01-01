import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useParams} from 'react-router-dom';

const routesBasic = createBrowserRouter([
  { path:'/',element:<Login/>},
  { path:'/infom/:id',element:<App/>},
  { path: '*', element: <div>404: Page Not Found</div> }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {routesBasic}/>
  </React.StrictMode>
);

function Login(){
  const navigate = useNavigate();
  const [user,setUser] = useState("");
  const [pass,setPass] = useState("");
  const [couthin,setCouthin] = useState("");
  function link(user,pass){
    axios
    .post('https://fam-api-psi.vercel.app/api/login',{"id":user,"pass":pass},
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
      console.log(response);
      if(response.data == true){
        navigate(`/infom/${user}`);
        setCouthin("")
      }
      else{
        setCouthin("passが違います")
      }
      console.log('POST成功:', response.data);
    })
    .catch(error => {
      setCouthin("idが存在しません")
      if (error.response) {
        console.error('サーバーエラー:', error.response);
      } else if (error.request) {
        console.error('リクエストエラー:', error.request);
      } else {
        console.error('その他のエラー:', error.message);
      }
    });
  }
  return(
    <div>
      <p id = "couthin">{couthin}</p>
      <form>
      <p>ID:<input name = "id" value = {user} onChange = {(e)=> setUser(e.target.value)}></input></p>
      <p>Pass:<input name = "pass" value = {pass} onChange = {(e)=> setPass(e.target.value)}></input></p>
      <p><button type = "button" onClick ={() => link(user,pass)}>ログイン</button></p>
    </form>
    </div>
  )
}
function App() {
  const [data, setData] = useState([]);
  const params = useParams();
  const userId = params.id
  console.log(params);
  function chasta(sta,id = 1){
    let newData = [...data];
    newData[id -1].state = sta;
    console.log(newData);
    setData(newData);
    console.log(data);
    console.log(sta,id);
    let dict = {
      id: id,
      state: sta,
    };
    console.log(dict);
    axios
    .post('https://fam-api-psi.vercel.app/api/user',dict,
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
      console.log('POST成功:', response.data);
    })
    .catch(error => {
      if (error.response) {
        console.error('サーバーエラー:', error.response.data);
      } else if (error.request) {
        console.error('リクエストエラー:', error.request);
      } else {
        console.error('その他のエラー:', error.message);
      }
    });
  };
  useEffect(() => {
      axios
      .get('https://fam-api-psi.vercel.app/api/user')             //リクエストを飛ばすpath
      .then(response => {
          setData(response.data);
      })                               //成功した場合、postsを更新する（then）
      .catch((error) => {
          console.log('通信に失敗しました',error);
      });                             //失敗した場合(catch)
  }, []);
  if (data.length === 0 || !data) {
    // データがロードされるまで何も表示しないか、ローディング表示
    return <div>Loading...</div>;
  }
  const State = ["外出中","在宅"];
  return( <div>
    <ul>
        {/* dataが存在している場合のみ表示 */}
        {data.map((user) => (
          <li key = {user.id}>{user.name} {State[user.state-1]}</li>
        ))}
      </ul>
      <button onClick = {()=>chasta(2,userId)}>帰宅</button><button onClick = {()=>chasta(1,userId)}>外出</button>
    </div>
  )
}

reportWebVitals();
