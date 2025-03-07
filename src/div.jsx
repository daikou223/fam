import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

function Week(){
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
        if(ourTime.toSeconds() === (new Time(0,0,0)).toSeconds()){
            return ourTime;
        }
        let diffsec = (ourTime.toSeconds()-otherTime.toSeconds())%(24*60*60);
        const hour = Math.floor( diffsec/ 3600);
        const minute = Math.floor((diffsec % 3600) / 60);
        const second = diffsec % 60;
        return new Time(hour,minute,second)
    }
    function timeAdd(ourTime,otherTime){
        if(ourTime.toSeconds() === (new Time(23,59,59)).toSeconds() || ourTime.toSeconds() === (new Time(23,59,0)).toSeconds()){
            return ourTime;
        }
        const diffsec = (ourTime.toSeconds()+otherTime.toSeconds())%84600;
        const hour = Math.floor( diffsec/ 3600);
        const minute = Math.floor((diffsec % 3600) / 60);
        const second = diffsec % 60;
        return new Time(hour,minute,second)
    }
    function toDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
    function StoTime(TimeString){
        const [hour,minute,second] = TimeString.split(":");
        return new Time(hour,minute,second);
    }
    const [date,setDate] = useState(new Date());
    const [lastDate,setLastDate] = useState(new Date(date.getFullYear(),date.getMonth(),date.getDate()+6));
    const [tasks,setTasks] = useState([[],[],[],[]]);
    const [allTasks,setAllTasks] = useState({});
    const Name = ["こう","だい","はは","ちち"];
    const dayString = ["日","月","火","水","木","金","土"]
    const id = localStorage.getItem("id");
    let [views,setviews] = useState([]);
    let [dates,setDates] = useState([]);
    //タスクを取得
    useEffect(() => {
        if(localStorage.getItem("task")){
            let result = JSON.parse(localStorage.getItem("task"));
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
          }
      setTasks([[],[],[],[]]);
      axios
      .get(`https://fam-api-psi.vercel.app/api/tasks`)             //リクエストを飛ばすpath
      .then(response => {
          let result = response.data;
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
  //タスクを整理
    useEffect(()=>{
            let targetDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            let view = []
            if(Object.keys(allTasks).length != 0){
                for(let i = 0;i<16;i++){
                    view.push([])
                    if(targetDate in allTasks){
                        allTasks[targetDate].map((task)=>
                        {
                            if(task.user_id == id){
                            view[i].push(task);
                            }
                        }
                    )
                    view[i] = view[i].sort(function (a, b) {
                        return StoTime(a.start).toSeconds() - StoTime(b.start).toSeconds();
                    });
                    }
                    targetDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate()+1)
                }
                console.log(view,allTasks);
                setviews(view);
        }
        }
        ,[allTasks])
    //日付を作る
    useEffect(() => {
        let tempdate = [new Date()];
        let dated = new Date();
        for(let i = 1;i<16;i++){
            let tmpdate = new Date(dated.getFullYear(),dated.getMonth(),dated.getDate()+i);
            tempdate.push(tmpdate);
        }
        setDates(tempdate);
        }
    ,[])
    if (Object.keys(allTasks).length == 0 || tasks == [] || views.length == 0){
      return(
      <div className = "center">
        <p>読み込み中...</p>
      </div>
        );
    }else{
        console.log(views);
    return(
        <div>
            <div>
            {[...Array(4)].map((_, i) => (
            <div className="flats" key={i}>
                {dates.slice(i * 4, (i + 1) * 4).map((date, j) => (
                <div key={j}>
                    <div className = "size">
                    {date.getDate()}日({dayString[date.getDay()]}曜日)<br />
                    <div className="non-color-border">
                    <Task tasks={views[i * 4 + j]} />
                    </div>
                    </div>
                </div>
                ))}
            </div>
            ))}
        </div>
        <MainMenu/>
        </div>)
        }}

function MainMenu(){
  const navigate = useNavigate();
  function moveRegist(){
    navigate(`/register`)
  }
  function moveDate(){
    navigate(`/infom`)
  }
  return(
    <div>
      <div className = "nbsp"></div>
      <div className = "Menubutton" onClick = {()=>{moveDate()}}>
        日間予定確認
      </div>
      <div className = "buttons">
      <div className = "Menubutton" onClick = {()=>{moveRegist()}}>
        予定登録
      </div>
      </div>
    </div>
  )
}

function Task(tasks){
    const [disp,setDisp] = useState([]);
    useEffect(()=>{
        console.log(tasks.tasks)
        if(tasks.tasks.length > 0){
            let dispd = [];
            let T = tasks.tasks;
            dispd.push(<div>{timeSubstruct(StoTime(T[0].start),StoTime(T[0].forgoto)).disp()}</div>)
            for(let i = 0;i<T.length;i++){
                dispd.push(<div>{T[i].taskname}</div>)
            } 
            dispd.push(<div>{timeAdd(StoTime(T[T.length-1].end),StoTime(T[T.length-1].forgoto)).disp()}</div>)
            setDisp(dispd);
        }
    },[])
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
    function StoTime(TimeString){
        const [hour,minute,second] = TimeString.split(":");
        return new Time(hour,minute,second);
    }
    function timeSubstruct(ourTime,otherTime){
        if(ourTime.toSeconds() === (new Time(0,0,0)).toSeconds()){
            return ourTime;
        }
        let diffsec = (ourTime.toSeconds()-otherTime.toSeconds())%(24*60*60);
        const hour = Math.floor( diffsec/ 3600);
        const minute = Math.floor((diffsec % 3600) / 60);
        const second = diffsec % 60;
        return new Time(hour,minute,second)
    }
    function timeAdd(ourTime,otherTime){
        if(ourTime.toSeconds() === (new Time(23,59,59)).toSeconds() || ourTime.toSeconds() === (new Time(23,59,0)).toSeconds()){
            return ourTime;
        }
        const diffsec = (ourTime.toSeconds()+otherTime.toSeconds())%84600;
        const hour = Math.floor( diffsec/ 3600);
        const minute = Math.floor((diffsec % 3600) / 60);
        const second = diffsec % 60;
        return new Time(hour,minute,second)
    }
    if(tasks.tasks.length == 0 || disp.length == 0){
        return(
            <div>タスク無し
            </div>
        )
    }
    else{
        console.log(disp);
        return(
            <div>
                {disp}
            </div>
        )
    }
}
export default Week;