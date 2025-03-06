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
        console.log(ourTime.toSeconds(),otherTime.toSeconds());
        let diffsec = (ourTime.toSeconds()-otherTime.toSeconds())%(24*60*60);
        console.log(diffsec);
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
    let personTask = [[],[],[],[]];
    let [views,setviews] = useState([]);
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
        setAllTasks({...allTask});
      }
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
            let targetDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
            console.log(allTasks);
            let view = []
            for(let i = 0;i<7;i++){
                let goHome = [
                    new Time(0,0,0),
                    new Time(0,0,0),
                    new Time(0,0,0),
                    new Time(0,0,0)
                ]
                console.log(targetDate,allTasks)
                if(targetDate in allTasks){
                    allTasks[targetDate].map((task)=>
                    {
                        let homeArrivalTime = timeAdd(StoTime(task.end),StoTime(task.forgoto));
                        if(timeSubstruct(homeArrivalTime,goHome[task.user_id-1]).toSeconds() > 0){
                            goHome[task.user_id-1] = homeArrivalTime;
                        }
                    }
                )
                    view.push(
                    <tr>
                        <td>{targetDate.getDate()}日/{dayString[targetDate.getDay()]}</td>
                        <td>{goHome[0].toSeconds() !== 0 ? goHome[0].disp():""}</td>
                        <td>{goHome[1].toSeconds() !== 0 ? goHome[1].disp():""}</td>
                        <td>{goHome[2].toSeconds() !== 0 ? goHome[2].disp():""}</td>
                        <td>{goHome[3].toSeconds() !== 0 ? goHome[3].disp():""}</td>
                    </tr>)
                }
                else{
                    view.push(<tr><td>{targetDate.getDate()}日/{dayString[targetDate.getDay()]}</td><td></td><td></td><td></td><td></td></tr>)
                }
                targetDate = new Date(targetDate.getFullYear(),targetDate.getMonth(),targetDate.getDate()+1)
            }
            setviews(view);
        }
        ,[allTasks])
    if (Object.keys(allTasks).length == 0 || tasks == []){
      return(
      <div className = "center">
        <p>読み込み中...</p>
      </div>
        );
    }else{
    return(
        <div translate="no">
        <div className = "center">
          <a class = "midiamletter">{date.getMonth()+1}月{date.getDate()}日~{lastDate.getMonth()+1}月{lastDate.getDate()}日の帰宅時間</a>
          </div>
          <table className = "weekTable">
            <tr><th>日付</th><th>こう</th><th>だい</th><th>母</th><th>父</th></tr>
            {views ?? "読み込み中"}
        </table>
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
  function moveRegRegist(){
    navigate(`/register`)
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
  
export default Week;