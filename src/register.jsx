import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

function Regist(){
    const [registState,setRegistState] = useState("登録");
    const navigate = useNavigate();
    const date = new Date();
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
          date:date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate(),
          start:start+":00",
          end:end+":00",
          memo:memo
      }
      ).then(()=>{
      navigate(`/infom/${id}`,{state:{id:id},})
      }
      );
    }
    function back(){
        navigate(`/infom/${id}`,{state:{id:id},})
    }
    if (date == null){
      return(<p>読み込み中...</p>)
    }
    return(
      <div>
        <h2>{date.getMonth()+1}月{date.getDate()}日 </h2>
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