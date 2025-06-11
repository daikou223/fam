import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import Time,{timeSubstruct,timeAdd,StoTime} from "../class/Time"
import Menubar from '../menubar/menubar'

//個人日程
function Week(){
    //変数定義**************************
    let lowData = JSON.parse(localStorage.getItem("task"));
    let [tasksData,setTaskData] = useState({});
    let [sortedTasks,setSortedTask] = useState([{},{},{},{}])
    let [dates,setDates] = useState([]);
    let ID = localStorage.getItem("id");
    let name = ["弟","兄","母","父"] 
    //スタイル定義*************************
    const styles = {
        weekTable:{
            border:"1px solid black",
            borderCollapse:"collapse",
        },
        blueBorder:{
            row:{backgroundColor:"lightblue"},
        },
    }
    //時間クラスを作成***************************
    function StoDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
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
            <>
            <Menubar/>
            <div style = {{ marginLeft: 30,marginTop:70 }}>
            {[0,1,2,3].map((parson)=>{
            return(
                <div>
                    {name[parson]}
            <table style =  {styles.weekTable}>
                <tr>
                    <th className = "nallow-colunm">日</th>
                    <th className = "nallow-colunm">出発時刻</th>
                    <th className = "wide-colunm">流れ</th>
                    <th className = "nallow-colunm">帰宅時刻</th>
                </tr>
                {
                    [0,1,2,3,4,5,6].map((i)=>{
                        if(i%2 == 1){
                            return(<OnlyTask date = {dates[i]} task = {sortedTasks[parson][dates[i]]} style = {styles.blueBorder}/>)
                        }
                        else{
                            return(<OnlyTask date = {dates[i]} task = {sortedTasks[parson][dates[i]]} style = {{}}/>)
                        }
                    }
                )
                }
            </table>
            </div>)
            })}
            <div>
            </div>
            </div>
            </>
            )
        }
    }

function OnlyTask(props){
    if(!props.date || !props.task){
        return(
            <div>読み込み中</div>
        )
    }
    //変数定義***************************************************
    let date = StoDate(props.date? props.date:"2024-01-01");
    let task = props.task? props.task:{};
    let dayToString = ['日','月','火','水','木','金','土'];
    const styles = {
        row:props.style.row || {},
        widCell:{
            width:300,
        },
        narrowCell:{
            width:70
        }
    };
    console.log(props)
    function StoDate(dateString){
        const seprate = dateString.split(/[T-]/);
        return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
    if(task.length == 0){
        return(
            <tr style = {styles.row || {}}>
                <td style = {styles.narrowCell}>{date.getDate()}日({dayToString[date.getDay()]})</td>
                <td style = {styles.narrowCell}>-</td>
                <td style = {styles.widCell}>-</td>
                <td style = {styles.narrowCell}>-</td>
            </tr>
        )
    }else{
        return(
        <tr style = {styles.row || {}}>
            <td style = {styles.narrowCell}>{date.getDate()}日({dayToString[date.getDay()]})</td>
            <td style = {styles.narrowCell}>{timeSubstruct(StoTime(task[0].start),StoTime(task[0].forgoto)).disp()}</td>
            <td style = {styles.widCell}>{task.map((t)=>(
            <a>→{t.taskname}</a>
            ))}→</td>
            <td style = {styles.narrowCell}>{timeAdd(StoTime(task[task.length-1].end),StoTime(task[task.length-1].forgoto)).disp()}</td>
        </tr>
        )
    }
}
export default Week;