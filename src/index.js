import React,{useEffect,useState,useRef} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';

import TaskMenu from './taskdisp';
import Regist from './regist/register';
import Edit from './regist/edit';
import Div from './display/div';
import Serch from './serch/taskSerch';
import Select from './work-for-bro/select';


//ルート定義部分
const routesBasic = createBrowserRouter([
  { path:'/',element:<Login/>},
  { path:'/infom',element:<TaskMenu/>},
  { path: '/register',element:<Regist/>},
  { path: '/edit/:id',element:<Edit/>},
  { path: '/div',element:<Div/>},
  { path: '/serch',element:<Serch/>},
  { path: '/bro',element:<Select/>},
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
  const userRef = useRef(0);
  const passRef = useRef("");
  const [couthin,setCouthin] = useState("");
  
  //localStorageにidが保存されているなら，自動ログイン
  // 自動ログインのuseEffect
    useEffect(() => {
      const storedId = localStorage.getItem('id');
      
      // 数値として1〜4の範囲かを確認
      if (storedId && Number(storedId) >= 1 && Number(storedId) <= 4) {
        // 自動ログイン後に遷移
        navigate(`/infom`);
      }
    }, []);
  //画面遷移のロジック
  function link(user,pass){
    //passがあっているかどうかを判定する
    axios
    .post('https://fam-api-psi.vercel.app/api/login',{"id":user,"pass":pass},
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
      if(response.data == true){
        //passが一致した時ローカルストレージに保存し，画面遷移
        localStorage.setItem('id',user)
        navigate(`/infom`);
      }
      else{
        //passが一致しなかった場合エラーを送出
        setCouthin("passが違います")
      }
      return response.data;
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
      <p>ID:<input name = "id" ref = {userRef}></input></p>
      <p>Pass:<input name = "pass" ref = {passRef}></input></p>
      <p><button type = "button" onClick ={() => link(userRef.current.value,passRef.current.value)}>ログイン</button></p>
    </form>
    </div>
  )
}

reportWebVitals();
