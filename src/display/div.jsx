import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./../style.css"

//個人日程
function Week(){
    //変数定義**************************
    let lowData = JSON.parse(localStorage.getItem("task"));
    let [tasksData,setTaskData] = useState({});
    let [sortedTasks,setSortedTask] = useState([{},{},{},{}])
    let [dates,setDates] = useState([]);
    let ID = localStorage.getItem("id"); 
    //時間クラスを作成***************************
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
    function StoDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
    function StoTime(TimeString){
        const [hour,minute,second] = TimeString.split(":");
        return new Time(hour,minute,second);
    }
    //関数定義***********************
    //Dateクラスをyyyy-mm-ddに
    function DateTodisp(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので+1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    //一週間分の空辞書を作成
    function generateDate(){
        let tempDate = new Date();
        let tempdates = [];
        let empDict = {};
        //一週間分の日付を作成
        for(let i = 0;i < 7;i++){
            tempDate.setDate(tempDate.getDate()+1);
            empDict[DateTodisp(tempDate)] = [];
            tempdates.push(DateTodisp(tempDate));
        }
        console.log(empDict);
        setTaskData({...empDict});
        setDates(tempdates);
    }
    function selectAndfairing(lowData){

        let temptasks = Array.from({ length: 4 }, () => {
            const newTaskData = {};
            for (const key in tasksData) {
              newTaskData[key] = [...tasksData[key]]; // 配列もコピー
            }
            return newTaskData;
          });          
        //日付が範囲内&&在宅ではない
        lowData.forEach((task)=>{
            if(DateTodisp(StoDate(task.date)) in temptasks[0] && task.isHome == 1){
                temptasks[task.user_id-1][DateTodisp(StoDate(task.date))].push(task);
            }
        })
        //ここのifはエラー対策なので気にするな..問題ない
        if(!(dates.length == 0)){
            //各日付に対して時刻順にする(全員分)
            for(let j = 0;j<3;j++){
                for(let i = 0;i < 7;i++){
                    temptasks[j][dates[i]].sort((task1,task2) => StoTime(task1.start).toSeconds() - StoTime(task2.start).toSeconds()); 
                }
            }
            console.log(temptasks);
            setSortedTask(temptasks);
        }
    }
    //main部分
    useEffect(()=>{
        //表示時したい日付(一週間分)を保存
        generateDate();
    },[])
    useEffect(()=>{
        //生データを日づけごとに選別
        selectAndfairing(lowData);
    },[tasksData])
    if (dates.length == 0){
      return(
      <div className = "center">
        <p>読み込み中...</p>
      </div>
        );
    }else{
        return(
            <div>
                弟
            <table className = "weekTable">
                <tr>
                    <th className = "nallow-colunm">日</th>
                    <th className = "nallow-colunm">曜日</th>
                    <th className = "nallow-colunm">出発時刻</th>
                    <th className = "wide-colunm">流れ</th>
                    <th className = "nallow-colunm">帰宅時刻</th>
                </tr>
                {
                    [0,1,2,3,4,5,6].map((i)=>(
                        <OnlyTask date = {dates[i]} task = {sortedTasks[0][dates[i]]}/>
                    ))
                }
            </table>
            兄
            <table className = "weekTable">
                <tr>
                    <th className = "nallow-colunm">日</th>
                    <th className = "nallow-colunm">曜日</th>
                    <th className = "nallow-colunm">出発時刻</th>
                    <th className = "wide-colunm">流れ</th>
                    <th className = "nallow-colunm">帰宅時刻</th>
                </tr>
                {
                    [0,1,2,3,4,5,6].map((i)=>(
                        <OnlyTask date = {dates[i]} task = {sortedTasks[1][dates[i]]}/>
                    ))
                }
            </table>
            母
            <table className = "weekTable">
                <tr>
                    <th className = "nallow-colunm">日</th>
                    <th className = "nallow-colunm">曜日</th>
                    <th className = "nallow-colunm">出発時刻</th>
                    <th className = "wide-colunm">流れ</th>
                    <th className = "nallow-colunm">帰宅時刻</th>
                </tr>
                {
                    [0,1,2,3,4,5,6].map((i)=>(
                        <OnlyTask date = {dates[i]} task = {sortedTasks[2][dates[i]]}/>
                    ))
                }
            </table>
            父
            <table className = "weekTable">
                <tr>
                    <th className = "nallow-colunm">日</th>
                    <th className = "nallow-colunm">曜日</th>
                    <th className = "nallow-colunm">出発時刻</th>
                    <th className = "wide-colunm">流れ</th>
                    <th className = "nallow-colunm">帰宅時刻</th>
                </tr>
                {
                    [0,1,2,3,4,5,6].map((i)=>(
                        <OnlyTask date = {dates[i]} task = {sortedTasks[3][dates[i]]}/>
                    ))
                }
            </table>
            <div>
            <MainMenu/>
            </div>
            </div>
            )
        }
    }

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

function OnlyTask(props){
    if(!props.date || !props.task){
        return(
            <div>読み込み中</div>
        )
    }
    let date = StoDate(props.date? props.date:"2024-01-01");
    let task = props.task? props.task:{};
    let dayToString = ['日','月','火','水','木','金','土'];
    function StoDate(dateString){
        const seprate = dateString.split(/[T-]/);
        return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
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
    function StoDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
    function StoTime(TimeString){
        const [hour,minute,second] = TimeString.split(":");
        return new Time(hour,minute,second);
    }
    if(task.length == 0){
        return(
            <tr>
                <td>{date.getDate()}日</td>
                <td>{dayToString[date.getDay()]}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
        )
    }else{
        return(
        <tr>
            <td>{date.getDate()}日</td>
            <td>{dayToString[date.getDay()]}</td>
            <td>{timeSubstruct(StoTime(task[0].start),StoTime(task[0].forgoto)).disp()}</td>
            <td>{task.map((t)=>(
            <a>→{t.taskname}</a>
            ))}→</td>
            <td>{timeAdd(StoTime(task[task.length-1].end),StoTime(task[task.length-1].forgoto)).disp()}</td>
        </tr>
        )
    }
}
export default Week;