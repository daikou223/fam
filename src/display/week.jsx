import React,{useEffect,useState} from 'react';
import axios from "axios";
import Menubar from "../menubar/menubar"
import Time,{timeSubstruct,timeAdd,StoTime} from "../class/Time"
//家族の一週間の予定を見るやつ
function Week(){
    function toDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
    //変数定義**************************
    const [date,setDate] = useState(new Date());
    const [lastDate,setLastDate] = useState(new Date(date.getFullYear(),date.getMonth(),date.getDate()+6));
    const [tasks,setTasks] = useState([[],[],[],[]]);
    const [allTasks,setAllTasks] = useState({});
    const Name = ["こう","だい","はは","ちち"];
    const dayString = ["日","月","火","水","木","金","土"]
    let personTask = [[],[],[],[]];
    let [views,setviews] = useState([]);
    //スタイル定義***********************************
    const styles = {
      row:{
        border:"1px dotted black",
      },
      colorRow:{
        border:"1px dotted black",
        backgroundColor:"#DDDDDD",
      },
      weekTable:{
        borderCollapse:"collapse",
        textAlign:"center",
      },
      cell:{
        width:100,
        backgroundColor:"lightblue",
      },
      title:{
        margin:20,
      }
    }
    useEffect(() => {
      if(localStorage.getItem("task")){
        let result = JSON.parse(localStorage.getItem("task"));
        let allTask = {};
          result.map((task)=>{
            task.date = toDate(task.date);
            if(!(allTask[task.date])){
              allTask[task.date] = [task]
            }
            else{
              allTask[task.date].push(task)
            }
          })
        setAllTasks({...allTask});
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
    useEffect(()=>{
      let dateTasks = {}
      Object.values(allTasks).map((tasks) =>{
        let date = tasks[0].date
        if(date >= new Date()){
          dateTasks[date.toDateString()] = [
            [new Time(24,0,0).toSeconds(),new Time(-1,0,0).toSeconds()],
            [new Time(24,0,0).toSeconds(),new Time(-1,0,0).toSeconds()],
            [new Time(24,0,0).toSeconds(),new Time(-1,0,0).toSeconds()],
            [new Time(24,0,0).toSeconds(),new Time(-1,0,0).toSeconds()]
          ]
          
          tasks.map((aTask)=>{
            dateTasks[date.toDateString()][aTask.user_id-1][0] = Math.min(dateTasks[date.toDateString()][aTask.user_id-1][0],timeSubstruct(StoTime(aTask.start),StoTime(aTask.forgoto)).toSeconds())

            dateTasks[date.toDateString()][aTask.user_id-1][1] = Math.max(dateTasks[date.toDateString()][aTask.user_id-1][1],timeAdd(StoTime(aTask.end),StoTime(aTask.forgoto)).toSeconds())
          })
        }
      })
      let viewDay = new Date()
      let view_ = []
      console.log(dateTasks)
      let isColor = false
      for(let day = 0;day < 14;day++){
        //その日に何個タスクがあるのかをはかる
        if(dateTasks[viewDay.toDateString()]){
          let count = 0
          for(let parson = 0;parson < 4;parson++){
            if(dateTasks[viewDay.toDateString()][parson][0] < dateTasks[viewDay.toDateString()][parson][1]){
              count++
            }
          }
          //表の実態を作成
          let first = true
          for(let parson = 0;parson < 4;parson++){
            if(dateTasks[viewDay.toDateString()][parson][0] < dateTasks[viewDay.toDateString()][parson][1]){
              if(first && isColor){
                view_.push(
                  <tr style = {styles.colorRow}>
                    <td rowSpan = {count}>{viewDay.getDate()}({dayString[viewDay.getDay()]})</td>
                    <td>{Name[parson]}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][0]).disp()}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][1]).disp()}</td>
                  </tr>
                )
                first = false
              }
              else if(first){
                view_.push(
                  <tr style = {styles.row}>
                    <td rowSpan = {count}>{viewDay.getDate()}({dayString[viewDay.getDay()]})</td>
                    <td>{Name[parson]}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][0]).disp()}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][1]).disp()}</td>
                  </tr>
                )
                first = false
              }
              else if(isColor){
                view_.push(
                  <tr style = {styles.colorRow}>
                    <td>{Name[parson]}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][0]).disp()}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][1]).disp()}</td>
                  </tr>
                )
              }
              else{
                view_.push(
                  <tr style = {styles.row}>
                    <td>{Name[parson]}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][0]).disp()}</td>
                    <td>{new Time(0,0,dateTasks[viewDay.toDateString()][parson][1]).disp()}</td>
                  </tr>
                )
              }
            }
          }
          isColor = !(isColor)
        }
        viewDay.setDate(viewDay.getDate()+1)
      }
      setviews(view_)
    },[allTasks])
    if (Object.keys(allTasks).length == 0 || tasks == []){
      return(
      <div className = "center">
        <p>読み込み中...</p>
      </div>
        );
    }else{
      return(
          <div translate="no">
            <Menubar/>
          <div className = "center">
            <div style = {styles.title}>{date.getMonth()+1}月{date.getDate()}日~{lastDate.getMonth()+1}月{lastDate.getDate()}日の出発/帰宅時間</div>
            </div>
            <table style = {styles.weekTable}>
              <tr style = {styles.row}><th style = {styles.cell}>日付</th><th style = {styles.cell}>人物</th><th style = {styles.cell}>出発時刻</th><th style = {styles.cell}>帰宅時刻</th></tr>
              {views ?? "読み込み中"}
          </table>
          </div>
        )
      }
}
  
export default Week;