import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"
import Menubar from "./menubar/menubar"
import Time,{timeSubstruct,timeAdd,StoTime} from "./class/Time"

//メインページ
function TaskMenu(){
    //昨日の予定を確認するため
    function prev(){
      setTasks([[],[],[],[]]);
      setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()-1));
    };
    //明日の予定を見る関数
    function next(){
      setTasks([[],[],[],[]]);
      setDate(new Date(date.getFullYear(),date.getMonth(),date.getDate()+1));
    };
    //Dateのみにする関数
    function DateToString(date){
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    }
    //yyyy-mm-ddをDate型にする
    function toDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }

    //変数群
    const [date,setDate] = useState(new Date());
    const [tasks,setTasks] = useState([[],[],[],[]]);
    const [allTasks,setAllTasks] = useState({});
    let personTask = [[],[],[],[]];
    const dayToString = ["日","月","火","水","木","金","土"];
    let result = "";
    let [cousion,setCousion] = useState("読み込み中のため、前回読み込んだ情報を表示しています");
    let [cousionClass,setCousionClass] = useState("cousion");
    let [isLoading,setIsLoading] = useState(true);
    const MAXTIME = 24*3600-1
    //初期化のためのEffect
    useEffect(() => {
      if(localStorage.getItem("task")){
        let result = JSON.parse(localStorage.getItem("task"));
        let allTask = {};
        result.map((task)=>{
            task.date = toDate(task.date);
            if(!(DateToString(task.date) in allTask)){
              allTask[DateToString(task.date)] = [task]
            }
            else{
              allTask[DateToString(task.date)].push(task)
            }
        })
        setAllTasks({...allTask});
      }
      setTasks([[],[],[],[]]);
      axios
      .get(`https://fam-api-psi.vercel.app/api/tasks`)             //リクエストを飛ばすpath
      .then(response => {
          result = response.data;
          localStorage.setItem("task",JSON.stringify(result));
          //日付ごとに分配するためのdict
          let allTask = {};
          result.map((task)=>{
            task.date = toDate(task.date);
            if(!(DateToString(task.date) in allTask)){
              allTask[DateToString(task.date)] = [task]
            }
            else{
              allTask[DateToString(task.date)].push(task)
            }
          })
          setAllTasks({...allTask});
          setCousion("");
          setIsLoading(false);
          setCousionClass("");
      })                               //成功した場合、postsを更新する（then）
      .catch((error) => {
          console.log('通信に失敗しました',error);
      });                             //失敗した場合(catch)
  }, []);
  useEffect(()=>{
    personTask = [[],[],[],[]];
    if(DateToString(date) in allTasks){
      //各日付に対して走査を行う
      allTasks[DateToString(date)].map((task)=>{
        task.starttime = new Time(...task.start.split(":"));
        task.endtime = new Time(...task.end.split(":"));
        task.gototime = new Time(...task.forgoto.split(":"));
        //user_idが1,2,3,4のもののみ
        if(task.user_id >=1 && task.user_id <= 4){
          personTask[task.user_id-1].push(task);
      }
      for(let i=0;i<4;i++){
        personTask[0].sort((task1,task2)=>task1.starttime.toSeconds()-task2.starttime.toSeconds())
      }
      })
  }
    setTasks(personTask);
},[date,allTasks])
    if (Object.keys(allTasks).length == 0 || tasks == []){
      return(isLoading ? 
      <div className = "center">
        <p>読み込み中...</p>
      </div>:<></>);
    }else{
      let hometime = [[new Time(24,0,0),new Time(-1,0,0)],
                      [new Time(24,0,0),new Time(-1,0,0)],
                      [new Time(24,0,0),new Time(-1,0,0)],
                      [new Time(24,0,0),new Time(-1,0,0)]];
      //それぞれの人に対して
      for(let i = 0;i<4;i++){
        //全てのタスクにおいて
        for(let j = 0;j<tasks[i].length;j++){
          //在宅タスクではない場合、出発時間を更新
          if(tasks[i][j].isHome == 1){
            hometime[i][0] = new Time(0,0,Math.min(hometime[i][0].toSeconds(),Math.max(timeSubstruct(tasks[i][j].starttime,tasks[i][j].gototime).toSeconds(),0)));
          }
        }

        for(let j = tasks[i].length-1;j>=0;j--){
          if(tasks[i][j].isHome == 1){
            hometime[i][1] = new Time(0,0,Math.max(hometime[i][1].toSeconds(),Math.min(timeAdd(tasks[i][j].endtime,tasks[i][j].gototime).toSeconds(),MAXTIME)));
          }
        }
      }
      return(
          <div translate="no">
            {<Menubar isActive = {isLoading} setCousion = {setCousion}/>}
          <div className = "center">
            <button onClick = {()=>prev()} className = "midiambutton">&lt;</button><a class = "midiamletter">{date.getMonth()+1}月{date.getDate()}日({dayToString[date.getDay()]}曜日)</a> <button onClick = {()=>next()} className = "midiambutton">&gt;</button>
            </div>
            <div>
              {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border">
                  出発時刻:{hometime[i][0].toSeconds()== MAXTIME+1?<>--:--</>:<>{hometime[i][0].disp()}</>} &rarr;&nbsp;帰宅時刻:{hometime[i][1].toSeconds() < 0 ? <>--:--</>:hometime[i][1].toSeconds() === MAXTIME ? <>23:59以降</>:<>{hometime[i][1].disp()}</>}
              {tasks[i].map((task, index) => (
              <div key={index} className = "topmargin">
                  <OnlyTask task={task} userId = {i+1} isLoading = {isLoading} setCousion={setCousion} />
              </div>
              ))}
          </div>
          ))}
          <p className = {cousionClass} style = {{ whiteSpace: "pre-line" }}> { isLoading ? cousion:"" }</p>
          </div></div>)
        }}

function OnlyTask({task,userId,isLoading,setCousion}){
    const navigate = useNavigate();
    function moveEdit(id,user){
        if(isLoading){
          setCousion("読み込み中のため、前回読み込んだ情報を表示しています\n!!!読み込み中は編集できません!!!")
          return null
        }
        let userId = localStorage.getItem('id');
        if(user == userId){
          navigate(`/edit/${id}`)
        }
    }
    return(
      <div>
      <div className = "teskName" onClick = {()=>moveEdit(task.task_id,task.user_id)}><b>{task.taskname}</b></div>
      <div className = "taskcont">
        <div className= "orange">開始時間<br/><a className = "Lmargin">{task.starttime.disp()}</a></div><div className= "orange"> 終了時間<br/><a className = "Lmargin">{task.endtime.disp()}</a></div><div className = "Lmargin-memo">{task.memo}</div>
      </div>
      </div>
    )
}
  
export default TaskMenu;