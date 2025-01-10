import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css";

import TaskMenu from './taskdisp';
import Regist from './register';

//ルート定義部分
const routesBasic = createBrowserRouter([
  { path:'/',element:<Login/>},
  { path:'/infom/:id',element:<TaskMenu/>},
  { path: '/register/:id',element:<Regist/>},
  { path: '*', element: <div>404: Page Not Found</div> }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {routesBasic}/>
  </React.StrictMode>
);

//ログイン画面の実装
function Login(){
  //ナビゲートの作成
  const navigate = useNavigate();
  //user=>userIdの保存 pass=>パスワードの保存 couthin=>エラー文の保存
  const [user,setUser] = useState(0);
  const [pass,setPass] = useState("");
  const [couthin,setCouthin] = useState("");
  
  //localStorageにidが保存されているなら，自動ログイン
  useEffect(()=>{
  if(localStorage.getItem('id') <= 4 && localStorage.getItem('id') >= 1 ){
    console.log(localStorage.getItem('id'));
    setUser(localStorage.getItem('id'));
    setCouthin("")
  }},[])
  useEffect(()=>{
    navigate(`/infom/${localStorage.getItem('id')}`,{state:{id:user}});
  },[user])
  //画面遷移のロジック
  function link(user,pass){
    //passがあっているかどうかを判定する
    axios
    .post('https://fam-api-psi.vercel.app/api/login',{"id":user,"pass":pass},
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
      console.log(response);
      if(response.data == true){
        //passが一致した時ローカルストレージに保存し，画面遷移
        setUser(localStorage.getItem('id'));
        navigate(`/infom/${user}`,{state:{id:{user}},});
        setCouthin("")
        localStorage.setItem('id',user)
      }
      else{
        //passが一致しなかった場合エラーを送出
        setCouthin("passが違います")
      }
      console.log('POST成功:', response.data);
    })
    .catch(error => {
      //idが存在しない場合はエラーが起きるので，その旨を報告
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


reportWebVitals();
