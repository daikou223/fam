import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

function Regist(){
    const [registState,setRegistState] = useState("登録");
    const [date,setDate] = useState(new Date());
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    console.log(date);
    function taskRegist(){
        setRegistState("登録中");
        const button = document.getElementById("regist");
        button.disabled = true;
      const name = document.getElementById("name").value || "名無しの用事";
      const start = document.getElementById("starttime").value || "00:00";
      const end = document.getElementById("endtime").value || "23:59";
      const gototime = document.getElementById("gototime").value || "1:00";
      const memo = document.getElementById("memo").value || "めもなし";
      console.log(id,date,name,start,end,gototime,memo);
      axios.post(
        'https://fam-api-psi.vercel.app/api/tasks',
        {userid:id,
          taskname:name,
          forgoto:gototime+":00",
          date:date.getFullYear()+"-"+Number(date.getMonth()+1)+"-"+date.getDate(),
          start:start+":00",
          end:end+":00",
          memo:memo
      }
      ).then(()=>{
      navigate(`/infom`)
      }
      );
    }
    function back(){
        navigate(`/infom`)
    }
    function changeDate(e){
      console.log(e.target.value);
      const [yy,mm,dd] = e.target.value.split("-");
      setDate(new Date(yy,mm-1,dd));
    }
    if (date == null){
      return(<p>読み込み中...</p>)
    }
    return(
      <div>
        日付:<input type="date" id="date" value = {`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`} onChange = {(e)=>changeDate(e)}/>({["日","月","火","水","木","金","土"][date.getDay()]}曜日)<br/>
        用事名:<input type="text" id="name"/><br/>
        開始時刻 : <input type="time" id="starttime" /><br/>
        終了時刻 : <input type="time" id="endtime" /><br/>
        移動時間 : <input type="time" id="gototime"/><br/>
        メモ:<input type="text" id="memo"/><br/>
        <button className = "widebutton" onClick = {()=>taskRegist()} id = "regist">{registState}</button>
        <button className = "widebutton" onClick = {()=>back()}>キャンセル</button>
      </div>
    )
  }

export default Regist