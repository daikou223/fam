import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

function TaskMenu(){
    class Time{
        constructor(hour,minute,second){
            this.hour = hour;
            this.minute = minute;
            this.second = second;
        };
        toSeconds() {
            return Number(this.hour) * 3600 + Number(this.minute) * 60 + Number(this.second);
        }
        disp(){
            return `${String(this.hour).padStart(2,'0')}:${String(this.minute).padStart(2,'0')}`
        }
    }
    function timeSubstruct(ourTime,otherTime){
        console.log(ourTime.toSeconds(),otherTime.toSeconds());
        let diffsec = (ourTime.toSeconds()-otherTime.toSeconds())%(24*60*60);
        console.log(diffsec);
        const hour = Math.floor( diffsec/ 3600);
        const minute = Math.floor((diffsec % 3600) / 60);
        const second = diffsec % 60;
        return new Time(hour,minute,second)
    }
    function timeAdd(ourTime,otherTime){
        const diffsec = (ourTime.toSeconds()+otherTime.toSeconds())%84600;
        const hour = Math.floor( diffsec/ 3600);
        const minute = Math.floor((diffsec % 3600) / 60);
        const second = diffsec % 60;
        return new Time(hour,minute,second)
    }
    function prev(){
      setTasks([[],[],[],[]]);
      setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()-1));
    };
    function next(){
      setTasks([[],[],[],[]]);
      setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1));
    };
    function toDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
    const [date,setDate] = useState(new Date())
    const [tasks,setTasks] = useState([[],[],[],[]]);
    const [allTasks,setAllTasks] = useState({});
    const location = useLocation();
    const id = location.state.id;
    const Name = ["こう","だい","はは","ちち"];
    let personTask = [[],[],[],[]];
    useEffect(() => {
      setTasks([[],[],[],[]]);
      axios
      .get(`https://fam-api-psi.vercel.app/api/tasks`)             //リクエストを飛ばすpath
      .then(response => {
          let result = response.data;
          console.log(result);
          let allTask = {};
          result.map((task)=>{
            task.date = toDate(task.date);
            if(!(task.date in allTask)){
              allTask[task.date] = [task]
            }
            else{
              allTask[task.date].push(task)
            }
          })
          setAllTasks(allTask);
      })                               //成功した場合、postsを更新する（then）
      .catch((error) => {
          console.log('通信に失敗しました',error);
      });                             //失敗した場合(catch)
  }, []);
  useEffect(()=>{
    personTask = [[],[],[],[]];
    console.log(date,allTasks);
    if(date in allTasks){
    allTasks[date].map((task)=>{
      let p = 0;
      task.starttime = new Time(...task.start.split(":"));
      task.endtime = new Time(...task.end.split(":"));
      task.gototime = new Time(...task.forgoto.split(":"));
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
  }
    setTasks(personTask);
    console.log(personTask);
},[date])
    if (Object.keys(allTasks).length == 0 || tasks == []){
      return(
      <div className = "center">
        <p>読み込み中...</p>
      </div>
        );
    }else{
    let hometime = [[new Time(0,0,0),new Time(0,0,0)],
                    [new Time(0,0,0),new Time(0,0,0)],
                    [new Time(0,0,0),new Time(0,0,0)],
                    [new Time(0,0,0),new Time(0,0,0)]];
    console.log(tasks);
    for(let i = 0;i<4;i++){
        if(tasks[i].length >= 1){
            hometime[i][0] = timeSubstruct(tasks[i][0].starttime,tasks[i][0].gototime);
            hometime[i][1] = timeAdd(tasks[i][tasks[i].length-1].endtime,tasks[i][tasks[i].length-1].gototime);
        }
    }
    return(
        <div>
        <div className = "center">
          <button onClick = {()=>prev()} className = "midiambutton">&lt;</button><a class = "midiamletter">{date.getMonth()+1}月{date.getDate()}日</a> <button onClick = {()=>next()} className = "midiambutton">&gt;</button>
          </div>
          <div>
            {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border">
                出発時刻:{hometime[i][0].disp()} &rarr;&nbsp;帰宅時刻:{hometime[i][1].disp()}
            {tasks[i].map((task, index) => (
            <div key={index} className = "topmargin">
                <OnlyTask task={task} userId = {i+1} />
            </div>
            ))}
        </div>
        ))}
        <MainMenu/>
        </div></div>)
        }}

function OnlyTask({task,userId}){
    const navigate = useNavigate();
    const location = useLocation();
    function moveEdit(id){
        navigate(`/edit/${id}`)
    }
    return(
      <div>
      <div className = "teskName" onClick = {()=>moveEdit(task.task_id)}><b>{task.taskname}</b></div>
      <div className = "taskcont">
        <div className= "orange">開始時間<br/><a className = "Lmargin">{task.starttime.disp()}</a></div><div className= "orange"> 終了時間<br/><a className = "Lmargin">{task.endtime.disp()}</a></div><div className = "Lmargin-memo">{task.memo}</div>
      </div>
      </div>
    )
}

function MainMenu(){
  const navigate = useNavigate();
  function moveRegist(){
    navigate(`/register`)
  }
  return(
    <div className = "buttons">
      <div className = "Menubutton">
        週間予定確認
      </div>
      <div className = "Menubutton" onClick = {()=>{moveRegist()}}>
        予定登録
      </div>
    </div>
  )
}
  
export default TaskMenu;