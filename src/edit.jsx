import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

function Edit(){
    const {id} = useParams();
    const [task, setTask] = useState(null);   // タスクデータ
    const [updateState,setUpdate] = useState("更新");
    const [deleteState,setDelete] = useState("削除");
    const [name,setName] = useState(null);
    const [start,setStart] = useState("00:00");
    const [end,setEnd] = useState("00:00");
    const [goto,setGoto] = useState("00:00");
    const [memo,setMemo] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
    axios.get(
        `https://fam-api-psi.vercel.app/api/task/${id}`
    ).then(
        response=>{
            const data = response.data[0];
            setTask(data);
        }
    )
},[]);
    useEffect(()=>{
        if(task){
            setName(task.taskname);
            setStart(task.start);
            setEnd(task.end);
            setGoto(task.forgoto);
            setMemo(task.memo);
        }
    },[task]);
    function nameChange(e){
        console.log(e.target.value);
        setName(e.target.value);
    }
    function startChange(e){
        setStart(e.target.value);
    }
    function endChange(e){
        setEnd(e.target.value);
    }
    function gotoChange(e){
        setGoto(e.target.value);
    }
    function memoChange(e){
        setMemo(e.target.value);
    }
    function update(){
        setUpdate("更新中");
        const button = document.getElementById("update");
        button.disabled = true;
        const Dbutton = document.getElementById("delete");
        Dbutton.disabled = true;
        const formattedDate = new Date(task.date).toISOString().split('T')[0];
        axios.put(
            'https://fam-api-psi.vercel.app/api/tasks',
            {userid:task.user_id,
                taskname:name,
                forgoto:goto,
                date:formattedDate,
                start:start,
                end:end,
                memo:memo,
                taskid:id
            }
        ).then(
            response=>{
                console.log('post成功');
                navigate(`/`);
            }
        )
    }
    function dlt(id){
        setDelete("削除中");
        const button = document.getElementById("update");
        button.disabled = true;
        const Dbutton = document.getElementById("delete");
        Dbutton.disabled = true;
        axios.delete(
            `https://fam-api-psi.vercel.app/api/tasks/${id}`
        ).then(
            response=>{
                console.log('delete成功');
                navigate(`/`);
            }
        )
    }
    if(!task || !task.task_id){
        return(
            <div>
                読み込み中
            </div>
        );
    }
    else{
        return (
            <div>
            用事名:<input type="text" id="name" value = {name} onChange = {nameChange}/><br/>
            開始時刻 : <input type="time" id="starttime" value = {start} onChange = {startChange}/><br/>
            終了時刻 : <input type="time" id="endtime" value = {end} onChange = {endChange}/><br/>
            移動時間 : <input type="time" id="gototime" value = {goto} onChange = {gotoChange}/><br/>
            メモ:<input type="text" id="memo" value = {memo} onChange = {memoChange}/><br/>
            <button className = "widebutton" id = "update" onClick = {update}>{updateState}</button>
            <button className = "widebutton" id = "delete" onClick = {()=>dlt(id)}>{deleteState}</button>
          </div>
        );
    }
  }

export default Edit;