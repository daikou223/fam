import React,{useEffect,useState,useRef} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from '../reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./../style.css"
import Menubar from "../menubar/menubar"
import TaskList,{getSameTask, getCollapse, getTaskDetails} from "./../class/TaskClass"
import dayjs from 'dayjs';
import Modal from "./../modal/modal"
import Time,{StoTime} from "./../class/Time"
import {update,dltApi} from "./../api/TaskApi"

function Edit(){
    //変数************************************
    const {id} = useParams();
    const [task, setTask] = useState(null);   // タスクデータ
    const [updateState,setUpdate] = useState("更新");
    const [deleteState,setDelete] = useState("削除");
    const [name,setName] = useState(null);
    const [start,setStart] = useState("00:00");
    const [end,setEnd] = useState("00:00");
    const [goto,setGoto] = useState("00:00");
    const [memo,setMemo] = useState("");
    const [isHome,setIsHome] = useState(1);
    const [date,setDate] = useState("");
    const [sameTask,setSameTask] = useState([]);
    const [message,setMessage] = useState("このメッセージが見えたらおかしいよ.見えたらスクショして管理者に送って~");
    const [selection,setSelection] = useState(["選択１","選択2","選択３"]);
    const [modalDisp,setModalDisp] = useState(false);
    const [modalResolve, setModalResolve] = useState(null);
    const putList = useRef([])
    const dltList = useRef([])
    const navigate = useNavigate();
    //スタイル変数
    const styles = {
        warrper:{
            marginTop:60,
            marginLeft:30,
        },
        title:{
            fontSize:22
        },
        nonModal:{
            display:"none"
        }
    }
    //関数*************************************
    //effect関数
    useEffect(()=>{
    axios.get(
        `https://fam-api-psi.vercel.app/api/task/${id}`
    ).then(
        response=>{
            if(response.data.length == 0){
                navigate(`/infom`);
            }
            const data = response.data[0];
            setTask(data);
        }
    ).catch((error) => {
        console.error("データ取得に失敗しました:", error);
        navigate(`/infom`);
    })
    },[]);
    useEffect(()=>{
        if(task){
            setName(task.taskname);
            setStart(task.start);
            setEnd(task.end);
            setGoto(task.forgoto);
            setMemo(task.memo);
            setIsHome(task.isHome);
            setDate(task.date);
        }
    },[task]);
    //通常関数
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
    async function bulkUpdate(){
        setUpdate("更新中");
        const button = document.getElementById("update");
        button.disabled = true;
        const Dbutton = document.getElementById("delete");
        Dbutton.disabled = true;
        const sameTaskid = getSameTask(getTaskDetails(id).name,getTaskDetails(id).date)
        //今更新しようとしているものも含まれる
        let sameIdFlag = false
        if(sameTaskid.length >= 2){
            sameIdFlag = await showModal("今後同名のタスクが存在しますが、同様に更新しますか？",["はい","更新しない"])
        }
        const targetIds = sameIdFlag ? sameTaskid:[id]
        putList.current = targetIds
        for (const targetId of targetIds) {
            await loopcollapseTask(targetId);
        }
        let p = 0
        if(putList.current.length > 0){
            update(name,goto,StoTime(start).disp(),StoTime(end).disp(),memo,putList.current,isHome)
            p = 1
        }
        if(dltList.current.length > 0){
            dltApi(dltList.current)
            p = 1
        }
        //どっちもない場合は独座に戻す
        if(p == 0){
            navigate(`/infom`);
        }
    }
    //各タスクに応じて、衝突タスクを探す
    async function loopcollapseTask(targetid){
        const targetDetail = getTaskDetails(targetid)
        const collapseTasks = getCollapse(targetDetail.date,StoTime(start),StoTime(end),targetDetail.user_id)
        for (const collapseId of collapseTasks) {
            if(collapseId != targetid){
                const collapseDetail = getTaskDetails(collapseId);
                const result = await showModal(`${collapseDetail.date.format("MM/DD")}「${collapseDetail.name}」と時間が重複しています`, [`「${collapseDetail.name}」を削除`,`このタスクを更新しない`,`両方保存する(非推奨)`]);
                switch(result){
                    case 0:
                        dltList.current.push(collapseId)
                        break
                    case 1:
                        putList.current = putList.current.filter((pId)=>pId != targetid)
                        break
                }
                if(result == 1){
                    break
                }
            }
        }
    }
    async function showModal(massage,option){
        setMessage(massage)
        setSelection(option)
        setModalDisp(true)
        
        return new Promise((resolve) => {
            setModalResolve(() => resolve);
        });
    }
    
    async function dlt(id){
        setDelete("削除中");
        const button = document.getElementById("update");
        button.disabled = true;
        const Dbutton = document.getElementById("delete");
        Dbutton.disabled = true;
        const sameTaskid = getSameTask(getTaskDetails(id).name,getTaskDetails(id).date)
        //今削除しようとしているものも含まれる
        let sameIdFlag = false
        if(sameTaskid.length >= 2){
            sameIdFlag = await showModal("今後同名のタスクが存在しますが、同様に削除しますか？",["削除する","しない"])
        }
        if(sameIdFlag == 0){
            await dltApi(sameTaskid)
            navigate("/infom")
        }
        else{
            dltApi([id])
        }
    }
    //リターン文******************************************
    if(!task || !task.task_id){
        return(
            <div class = "center">
                読み込み中
            </div>
        );
    }
    else{
        return (
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
            }}/>
            <div style = {styles.warrper}>
                <h1 style = {styles.title}>編集</h1>
            用事名:<input type="text" id="name" value = {name} onChange = {nameChange}/><br/>
            開始時刻 : <input type="time" id="starttime" value = {start} onChange = {startChange}/><br/>
            終了時刻 : <input type="time" id="endtime" value = {end} onChange = {endChange}/><br/>
            移動時間 : <input type="time" id="gototime" value = {goto} onChange = {gotoChange}/><br/>
            メモ:<input type="text" id="memo" value = {memo} onChange = {memoChange}/><br/>
            <button className = "registWidebutton" id = "update" onClick = {bulkUpdate}>{updateState}</button>
            <button className = "cancelWidebutton" id = "delete" onClick = {()=>dlt(id)}>{deleteState}</button>
          </div>
          </>
        );
    }
  }

export default Edit;