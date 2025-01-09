import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

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
  if(localStorage.getItem('id')){
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

function TaskMenu(){
  const navigate = useNavigate();
  function prev(){
    setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()-1));
    console.log('yesterday');
  };
  function next(){
    setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1));
    console.log('tommorw');
  };
  function moveRegist(){
    navigate(`/register/${localStorage.getItem('id')}`,{state:{date:date,id:id},})
  }
  const [date,setDate] = useState(new Date())
  const [tasks,setTasks] = useState([[]]);
  const location = useLocation();
  const id = location.state.id;
  console.log(id);
  const Name = ["こう","だい","はは","ちち"]
  useEffect(() => {
    setTasks([]);
    console.log(`https://fam-api-psi.vercel.app/api/tasks/${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    axios
    .get(`https://fam-api-psi.vercel.app/api/tasks/${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`)             //リクエストを飛ばすpath
    .then(response => {
        const result = response.data;
        console.log(result);
        const personTask = [[],[],[],[]];
        result.map((task)=>{
          let p = 0;
          for(let i = 0;i<personTask[task.user_id-1].length;i++){
            if(personTask[task.user_id-1][i].start<task.start){
              p += 1;
            }
          }
          personTask[task.user_id-1].splice(p,0,task);
          setTasks(personTask);
          console.log(personTask,tasks);
        })
        setTasks(personTask);
    })                               //成功した場合、postsを更新する（then）
    .catch((error) => {
        console.log('通信に失敗しました',error);
    });                             //失敗した場合(catch)
}, [date]);
  if (tasks.length === 0){
    return(
    <div className = "center">
      <button onClick = {()=>prev()}>&lt;</button> {date.getMonth()+1}月{date.getDate()}日 <button onClick = {()=>next()}>&gt;</button>
      <p>読み込み中...</p>
    </div>
      );
  };
  return(
    <div>
    <div className = "center">
      <button onClick = {()=>prev()}>&lt;</button> {date.getMonth()+1}月{date.getDate()}日 <button onClick = {()=>next()}>&gt;</button>
      </div>
        {tasks.map((personTask)=>(<div className = "border">{
          personTask.map((task) => (
            <div>
              <OnlyTask task = {task}/>
            </div>
          )
        )}</div>))}
        <div className = "center">
        <button className = "widebutton" onClick = {()=>moveRegist()}>登録</button>
        </div>
    </div>
  )
}
 function OnlyTask({task}){
  return(
    <div>
    <div className = "teskName">{task.taskname}</div><div className = "testContent">開始時間: {task.start} 終了時間: {task.end}</div>
    </div>
  )
 }

function Regist(){
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state.date);
  const date = location.state?.date ? new Date(location.state.date) : null;
  const id = location.state.id;
  console.log(date);
  function taskRegist(){
    const name = document.getElementById("name").value || "名無しの用事";
    const start = document.getElementById("starttime").value || "00:00";
    const end = document.getElementById("endtime").value || "23:59";
    const gototime = document.getElementById("gototime").value || "1:00";
    const memo = document.getElementById("memo").value || "めもなし";
    console.log(id,date,name,start,end,gototime,memo);
    axios.post(
      'https://fam-api-psi.vercel.app/api/tasks',
      {userid:id,
        taskname:name,
        forgoto:gototime+":00",
        date:date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate(),
        start:start+":00",
        end:end+":00",
        memo:memo
    }
    ).then(()=>{
    navigate(`/infom/${id}`,{state:{id:id},})
    }
    );
  }
  if (date == null){
    return(<p>読み込み中...</p>)
  }
  return(
    <div>
      <h2>{date.getMonth()+1}月{date.getDate()}日 </h2>
      用事名:<input type="text" id="name"/><br/>
      開始時刻 : <input type="time" id="starttime"/>
      &nbsp;終了時刻 : <input type="time" id="endtime"/><br/>
      移動時間 : <input type="time" id="gototime"/><br/>
      メモ:<input type="text" id="memo"/><br/>
      <button className = "widebutton" onClick = {()=>taskRegist()}>登録</button>
    </div>
  )
}


reportWebVitals();
