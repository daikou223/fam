import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"
import Menubar from "./menubar/menubar"
import Time,{timeSubstruct,timeAdd,StoTime,secondToTime} from "./class/Time"
import * as dateUtil from "./class/day"
import * as taskUtil from "./class/TaskClass"

//メインページ
function TaskMenu(){
  //変数群
  const GOOUT = 1
  const INHOME = 0
  const [date,setDate] = useState(dateUtil.getToday());
  const [tasks,setTasks] = useState([[],[],[],[]]);
  const [homeTime,setHomeTime] = useState([[new Time(24,0,0),new Time(-1,0,0)],
                                            [new Time(24,0,0),new Time(-1,0,0)],
                                            [new Time(24,0,0),new Time(-1,0,0)],
                                            [new Time(24,0,0),new Time(-1,0,0)]])
  const [cousion,setCousion] = useState("読み込み中のため、前回読み込んだ情報を表示しています");
  const [cousionClass,setCousionClass] = useState("cousion");
  const [isLoading,setIsLoading] = useState(true);
  const [IsData,setIsData] = useState(false);
  let isNet = false
  const MAXTIME = 24*3600-1
  //画面に入ってきた時、キャッシュを更新
  useEffect(() => {(async()=>{
    //localStrageに入ってるなら取りえずそれを出力
    if(localStorage.getItem("task")){
      tmpdataDisp()
    }
    if(!isNet){
      isNet = true
      const res =  await taskUtil.getTask("force")
      setIsLoading(false)
      setCousion("")
      setCousionClass("")
      isNet = false
    }
    })()
  }, []);
  useEffect(()=>{
    tmpdataDisp()
  },[date,isLoading])
  function tmpdataDisp(){
    //taskリストのフォーマット化(dayjsがうまく行かないはず)
    if(localStorage.getItem("task")){
      disp(taskUtil.formater(JSON.parse(localStorage.getItem("task"))).tasks)
    }
  }
  function disp(Data){
    let parsonTask = [[],[],[],[]]
    let hometime_ = [[new Time(24,0,0),new Time(-1,0,0)],
                    [new Time(24,0,0),new Time(-1,0,0)],
                    [new Time(24,0,0),new Time(-1,0,0)],
                    [new Time(24,0,0),new Time(-1,0,0)]];
    //人ごとに分離
    for(let i = 0; i < Data.length; i++){
      if(Data[i].date.isSame(date,"day")){
        parsonTask[Data[i].user_id-1].push(Data[i])     
      }
    }
    for(let i = 0; i < 4; i++){
      //表示を早い順に
      parsonTask[i].sort((task1,task2)=>task1.start.toSeconds()-task2.start.toSeconds())
      let goOutTime =  new Time(24,0,0).toSeconds()-1
      let goHomeTime = 0
      //帰宅時間を計算
      for(let j = 0; j < parsonTask[i].length; j++){
        //在宅なら更新しない
        if(parsonTask[i][j].isHome == GOOUT){
        goOutTime = Math.min(goOutTime,parsonTask[i][j].start.toSeconds()-parsonTask[i][j].forgoto.toSeconds())
        goHomeTime = Math.max(goHomeTime,parsonTask[i][j].end.toSeconds()+parsonTask[i][j].forgoto.toSeconds())
        }
      }
      hometime_[i][0] = secondToTime(goOutTime)
      hometime_[i][1] = secondToTime(goHomeTime)
    }
    setHomeTime(hometime_)
    setTasks(parsonTask)
    setIsData(true)
  }
    if (!IsData){
      return( 
      <div className = "center">
        <p>読み込み中...</p>
      </div>);
    }else{
      return(
          <div translate="no">
            {<Menubar isActive = {isLoading} setCousion = {setCousion}/>}
          <div className = "center">
            <button onClick = {()=>{setDate((prev)=>dateUtil.getYestaday(prev))}} className = "midiambutton">&lt;</button><a class = "midiamletter">{dateUtil.dateFullDisplay(date)}({dateUtil.getDDDay(date)})</a> <button onClick = {()=>{setDate((prev)=>dateUtil.getTomorrow(prev))}} className = "midiambutton">&gt;</button>
            </div>
            <div>
              {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border">
                  出発時刻:{homeTime[i][0].toSeconds() == MAXTIME?<>未設定</>:<>{homeTime[i][0].disp()}</>} &rarr;&nbsp;帰宅時刻:{homeTime[i][1].toSeconds() <= 0 ? <>未設定</>:homeTime[i][1].toSeconds() === MAXTIME ? <>23:59以降</>:<>{homeTime[i][1].disp()}</>}
              {tasks[i].map((task, index) => (
              <div key={index} className = "topmargin">
                  <OnlyTask task={task} isLoading = {isLoading} setCousion = {setCousion}/>
              </div>
              ))}
          </div>
          ))}
          {localStorage.getItem("debug") && <p className = "cousion" style = {{ whiteSpace: "pre-line" }}> デバッグモードです。</p>}
          <p className = {cousionClass} style = {{ whiteSpace: "pre-line" }}> { isLoading ? cousion:"" }</p>
          </div></div>)
        }}

function OnlyTask({task,isLoading,setCousion}){
  const navigate = useNavigate();
  async function moveEdit(taskid){
    const targetTask = await taskUtil.getTaskDetails(taskid)
    let userId = localStorage.getItem('id');
    if(targetTask.user_id == userId){
      if(isLoading){
        setCousion("読み込み中のため、前回読み込んだ情報を表示しています\n!!!読み込み中は編集できません!!!")
        return null
      }else{
        navigate(`/edit/${taskid}`)
      }
    }
  }
  return(
    <div>
    <div className = "teskName" onClick = {()=>moveEdit(task.id)}><b>{task.name}</b></div>
    <div className = "taskcont">
      <div className= "orange">開始時間<br/><a className = "Lmargin">{task.start.disp()}</a></div><div className= "orange"> 終了時間<br/><a className = "Lmargin">{task.end.disp()}</a></div><div className = "Lmargin-memo">{task.memo}</div>
    </div>
    </div>
  )
}
  
export default TaskMenu;