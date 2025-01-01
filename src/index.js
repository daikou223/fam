import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useParams} from 'react-router-dom';
import styles from "./style.css"

//ルート定義部分
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

//ログイン画面の実装
function Login(){
  //ナビゲートの作成
  const navigate = useNavigate();
  //user=>userIdの保存 pass=>パスワードの保存 couthin=>エラー文の保存
  const [user,setUser] = useState("");
  const [pass,setPass] = useState("");
  const [couthin,setCouthin] = useState("");
  //localStorageにidが保存されているなら，自動ログイン
  useEffect(()=>{
  if(localStorage.getItem('id')){
    console.log(localStorage.getItem('id'));
    setUser(localStorage.getItem('id'));
    navigate(`/infom/${localStorage.getItem('id')}`);
    setCouthin("")
  }},[])
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
        navigate(`/infom/${user}`);
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
//在宅確認画面部分
function App() {
  //dataは全員の在宅状態を保存する
  const [data, setData] = useState([]);
  //ログイン時からのidを取得し，保存
  const params = useParams();
  const userId = params.id
  //status(在宅状態を保管)を変化させる
  function chasta(sta,id = 1){
    //先に表示を変化
    let newData = [...data];
    newData[id -1].state = sta;
    setData(newData);
    //DBに情報を送る
    let dict = {
      id: id,
      state: sta,
    };
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
  //在宅状態をDBに問い合わせ
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
  //1,2を外出，在宅に変更
  const State = [<a className = "goto">外出中</a>,<a className= "in">在宅</a>];
  return( <div>
    <ul>
        {/* dataが存在している場合のみ表示 */}
        {data.map((user) => (
          <li key = {user.id}><a className = "name">{user.name}</a>{State[user.state-1]}</li>
        ))}
      </ul>
      <div className = "mag"></div>
      <button onClick = {()=>chasta(2,userId)} className = "inbutton">帰宅</button><button onClick = {()=>chasta(1,userId)} className = "gotobutton">外出</button>
    </div>
  )
}

reportWebVitals();
