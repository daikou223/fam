import React,{useEffect,useState,useRef} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from '../reportWebVitals';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import styles from "./../style.css"
import Menubar from "../menubar/menubar"
import Modal from "./../modal/modal"
import TaskList,{getSameTask, getCollapse, getTaskDetails} from "./../class/TaskClass"
import {update,dltApi,postTask} from "./../api/TaskApi"
import Time,{StoTime} from "./../class/Time"
import * as dateUtil from "./../class/day"
import dayjs from "dayjs"

//新規予定を登録するようのページ
function Regist(){
    //変数
    const [registState,setRegistState] = useState("登録");
    const [date,setDate] = useState(dateUtil.getToday());
    const [isBulk,setBulk] = useState(false);
    const [isHome,setIsHome] = useState(false);
    const [isAllDay,setAllDay] = useState(false);
    const [bulkDates,setBulkDates] = useState([]);
    const [message,setMessage] = useState("このメッセージが見えたらおかしいよ.見えたらスクショして管理者に送って~");
    const [selection,setSelection] = useState(["選択１","選択2","選択３"]);
    const [modalDisp,setModalDisp] = useState(false);
    const [modalResolve, setModalResolve] = useState(null);
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    const taskNameRef = useRef("");
    const taskStartRef = useRef("");
    const taskEndRef = useRef("");
    const taskGotoRef = useRef("");
    const taskMemoRef = useRef("");

  
    async function showModal(massage,option){
        setMessage(massage)
        setSelection(option)
        setModalDisp(true)
        
        return new Promise((resolve) => {
            setModalResolve(() => resolve);
        });
    }
    //登録時に実行する関数
    async function taskRegist(){
      let flag = 0;
      //入力バリデーション
      if(taskNameRef.current.value == "" || (!(isAllDay) && (taskStartRef.current.value == "" || taskEndRef.current.value == "")) || (!(isHome) && taskGotoRef.current.value == "")){
        await showModal('未入力項目があります',["確認"])
        flag = 1
      }
      if(date.isBefore(dateUtil.getToday()) && !(isBulk) && flag == 0){
        flag = await showModal('日付が本日かそれ以前ですが\nよろしいですか？',["はい","キャンセル"]);
      } 
      if(isBulk && flag == 0){
        let includeBeforeDateFlag = false;
        for(let i = 0;i<bulkDates.length;i++){
          if(bulkDates[i].isBefore(dateUtil.getToday())){
            includeBeforeDateFlag = true;
          }
        }
        if(includeBeforeDateFlag){
          flag = await showModal('日付が本日かそれ以前が含まれていますが\nよろしいですか？',["はい","キャンセル"]);
        }
      }
      if(flag == 0){
        setRegistState("登録中");
        const button = document.getElementById("regist");
        button.disabled = true;
        let dltList = []
        let postfrags = Array(isBulk ? bulkDates.length:1).fill(true)
        if(!isBulk){
          const collapseTasks = await getCollapse(date,isAllDay ? new Time(0,0,0) :StoTime(taskStartRef.current.value),isAllDay ? new Time(23,59,0) :StoTime(taskEndRef.current.value),id)
          for (const collapseId of collapseTasks) {
            const collapseDetail = await getTaskDetails(collapseId);
            const result = await showModal(`${collapseDetail.date.format("MM/DD")}「${collapseDetail.name}」と時間が重複しています`, [`「${collapseDetail.name}」を削除`,`このタスクを登録しない`,`両方保存する(非推奨)`]);
            switch(result){
                case 0:
                    dltList.push(collapseId)
                    postfrags[0] = true
                    break
                case 1:
                  postfrags[0] = false
                  break
            }
            //あきらめるならこれ以上聞いても意味ない
            if(result == 1){
              break
            }
          }
        } else if (isBulk) {
          for (let bulkIndex = 0;bulkIndex < bulkDates.length;bulkIndex++) {
            const collapseTasks = await getCollapse(
              bulkDates[bulkIndex],
              isAllDay ? new Time(0,0,0) : StoTime(taskStartRef.current.value),
              isAllDay ? new Time(23,59,0) : StoTime(taskEndRef.current.value),
              id
            );
            for (const collapseId of collapseTasks) {
            const collapseDetail = await getTaskDetails(collapseId);
            const result = await showModal(`${collapseDetail.date.format("MM/DD")}「${collapseDetail.name}」と時間が重複しています`, [`「${collapseDetail.name}」を削除`,`このタスクを登録しない`,`両方保存する(非推奨)`]);
            switch(result){
                case 0:
                    dltList.push(collapseId)
                    postfrags[bulkIndex] = true
                    break
                case 1:
                  postfrags[bulkIndex] = false
                  break
            }
            //あきらめるならこれ以上聞いても意味ない
            if(result == 1){
              break
            }
          }
          }
        }

          if(!(isBulk)){
            if(postfrags[0]){
              let paramses = [{"user_id":id,
                  "taskname":taskNameRef.current?.value ?? "",
                "forgoto":taskGotoRef?.current?.value ?? "00:00:00",
                "date":date.format("YYYY-MM-DD"),
                "start":isAllDay ? "00:00:00" : taskStartRef.current.value + ":00",
                "end":isAllDay ? "23:59:00" : taskEndRef.current.value + ":00",
                "memo":taskMemoRef.current?.value ?? "",
                "isHome":isHome ? 0:1}]
              await postTask(paramses)
              if(dltList.length > 0){
                await dltApi(dltList)
              }
              back()
          }}else{
            let paramses = [];
            for(let i = 0;i<bulkDates.length;i++){
              if(postfrags[i]){
                paramses.push({"user_id":id,
                "taskname":taskNameRef.current?.value ?? "",
                "forgoto":taskGotoRef?.current?.value ?? "00:00:00",
                "date":bulkDates[i].format("YYYY-MM-DD"),
                "start":isAllDay ? "00:00:00" : taskStartRef.current.value + ":00",
                "end":isAllDay ? "23:59:00" : taskEndRef.current.value + ":00",
                "memo":taskMemoRef.current?.value ?? "",
                "isHome":isHome ? 0:1}); 
              } 
            }
            await postTask(paramses);
          }
          if(dltList.length > 0){
            await dltApi(dltList)
          }
          localStorage.removeItem("task")
          back()
        }
    }
    //画面遷移戻し
    function back(){
        navigate(`/infom`)
    }
    if (date == null){
      return(<p>読み込み中...</p>)
    }
      return(
        <>
        <Menubar/>
        <Modal 
          message = {message} 
          selection = {selection} 
          modalDisp = {modalDisp}
          onSelect={(idx) => {
              if (modalResolve) {
                  modalResolve(idx); // ユーザーの選択結果を返す
                  setModalDisp(false); // モーダルを閉じる
              }
            }}
        />
        <div class="naka">
          <div className = "multiple">複数日付登録:<input type = "checkbox" checked = {isBulk} onChange = {()=>{setBulk((prev)=>!prev)}} className="ookiku"/></div>
          <div className = "atHome">在宅:<input type = "checkbox" checked = {isHome} onChange = {()=>{setIsHome((prev)=>!prev)}} className="ookiku"/></div>
          <div className = "atAllDay">終日:<input type = "checkbox" checked = {isAllDay} onChange = {()=>{setAllDay((prev)=>!prev)}} className="ookiku"/></div>
          <input type="text" id="name" class="naka" ref = {taskNameRef} placeholder="なにをする？" /><br/>
          {!isBulk &&(
          <div>日付:<input type="date" id="date" value = {dateUtil.dateToString(date)} onChange = {(e)=>setDate(dateUtil.stringToDate(e.target.value))}/>({dateUtil.getDDDay(date)})</div>
          )
        }
        {!isAllDay && (<>
          <input type="time" id="starttime" ref = {taskStartRef}/><a>&rarr;</a>
          <input type="time" id="endtime" ref = {taskEndRef}/><br/></>)}
          {!isHome && (
            <>
              移動時間 : <input type="time" id="gototime" ref = {taskGotoRef}/><br/>
            </>
          )}
          <input type="text" id="memo" class="naka" ref = {taskMemoRef} placeholder="メモ"/><br/>
          {isBulk &&(
          <Calender bulkDates = {bulkDates} setBulkDates = {setBulkDates}/>
          )
          }
          <button className = "registWidebutton" onClick = {()=>taskRegist()} id = "regist">{registState}</button>
          <button className = "cancelWidebutton" onClick = {()=>back()}>キャンセル</button>
        </div>
        </>
      )
    }

function Calender(props){
  //変数定義********************************
  const [dispDay,setDispDay] = useState(dateUtil.getToday());
  const [firstDay,setFirstDay] = useState(dateUtil.getFirstday(dispDay));
  const [lastDay,setLastDay] = useState(dateUtil.getFinalday(dispDay));
  const [cells,setCells] = useState([]);
  const [bulkDates,setBulkDates] = [props.bulkDates,props.setBulkDates];
  //関数定義****************************
  //日付をクリックしたときの処理
  function selectDate(dayNum){
    let date = dateUtil.stringToDate(dispDay.format("YYYY-MM-")+String(dayNum));
    let bulkDates_ = [...bulkDates];
    if(dateUtil.dateIncludes(bulkDates_,date)){
      bulkDates_ = bulkDates_.filter(theDate => !(theDate.isSame(date)));
    }
    else{
      bulkDates_.push(date)
    }
    setBulkDates(bulkDates_)
  }
  //曜日をクリック時に一斉二選択
  function clarenderDay(day){
    let bulkDates_ = [...bulkDates];
    let firstIsInclude = null
    for(let i = 1;i<= Number(lastDay.format("DD"));i++){
      let serDate = dateUtil.stringToDate(dispDay.format("YYYY-MM-")+String(i));
      if(day == serDate.format("d")){
        if(firstIsInclude == null){
          firstIsInclude = dateUtil.dateIncludes(bulkDates,serDate)
        }
        if(firstIsInclude){
          bulkDates_ = bulkDates_.filter(theDate => !(theDate.isSame(serDate)));
        }
        else{
          bulkDates_.push(serDate)
        }
      }
    }
    setBulkDates(bulkDates_)
  }
  //月の移動を実装
  function MoveMonth(mode){
    setDispDay((prev)=> prev.add(mode,"month"))
    setFirstDay((prev)=> prev.add(mode,"month"))
    setLastDay((prev)=> prev.add(mode,"month"))
  }
  //レンダリング関数*************************
  //列を作成する
  function createRow(){
    let createRow_ = [];
    for(let i = 0;i<cells.length/7;i++){
      createRow_.push(<tr>{cells.slice(i*7,(i+1)*7)}</tr>);
    }
    return createRow_
  }
  //表に色をつける
  useEffect(()=>{
    const numToDay =  [6,0,1,2,3,4,5];
    let cells_ = [];
    for(let i = -numToDay[firstDay.format("d")]+1;i<= Number(lastDay.format("DD")) + 6-numToDay[Number(lastDay.format("d"))];i++){
      if(i <= 0){
        cells_.push(<td></td>)
      }
      else if(i <= Number(lastDay.format("DD"))){
        if(dateUtil.dateIncludes(bulkDates,(dateUtil.stringToDate(dispDay.format("YYYY-MM-")+String(i))))){
          cells_.push(<td className = "selection" onClick = {()=>selectDate(i)}>{i}</td>)
        }
        else{
          cells_.push(<td onClick = {()=>selectDate(i)}>{i}</td>)
        }
      }
      else{
        cells_.push(<td></td>)
      }
    }
    setCells(cells_)
  },[bulkDates,dispDay])
  //画面構成**********************
  return(
    <div>
      <button onClick = {()=>MoveMonth(-1)}>先月 &lt; </button><a className = "yyyy-mm">{dispDay.format("YYYY年M月") }</a><button onClick = {()=>MoveMonth(1)}>&gt; 翌月</button>
      <table  className = "calender">
        <thead>
          <tr>
            <th onClick = {()=>clarenderDay(1)}>月</th>
            <th onClick = {()=>clarenderDay(2)}>火</th>
            <th onClick = {()=>clarenderDay(3)}>水</th>
            <th onClick = {()=>clarenderDay(4)}>木</th>
            <th onClick = {()=>clarenderDay(5)}>金</th>
            <th onClick = {()=>clarenderDay(6)}>土</th>
            <th onClick = {()=>clarenderDay(0)}>日</th>
          </tr>
        </thead>
        <tbody>
          { createRow() }
        </tbody>
      </table>
    </div>
  )
}
export default Regist