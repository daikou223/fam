import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

function TaskMenu(){
    const navigate = useNavigate();
    function prev(){
      setTasks([]);
      setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()-1));
    };
    function next(){
      setTasks([]);
      setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1));
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
            console.log(task);
            if(task.user_id >=1 && task.user_id <= 4){
            for(let i = 0;i<personTask[task.user_id-1].length;i++){
              if(personTask[task.user_id-1][i].start<task.start){
                p += 1;
              }
            }
            personTask[task.user_id-1].splice(p,0,task);
            console.log(personTask,tasks);
          }
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
        <p>読み込み中...</p>
      </div>
        );
    };
    return(
      <div>
      <div className = "center">
        <button onClick = {()=>prev()} className = "midiambutton">&lt;</button><a class = "midiamletter">{date.getMonth()+1}月{date.getDate()}日</a> <button onClick = {()=>next()} className = "midiambutton">&gt;</button>
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
      <div className = "teskName">{task.taskname}</div>
      <div className = "taskcont">
        <div className= "orange">開始時間<br/><a className = "Lmargin">{task.start}</a></div><div className= "orange"> 終了時間<br/><a className = "Lmargin">{task.end}</a></div><div className = "Lmargin">{task.memo}</div>
      </div>
      </div>
    )
}
  
export default TaskMenu;