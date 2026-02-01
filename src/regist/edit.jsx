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
import * as TimeUtil from "./../class/Time"
import {update,dltApi} from "./../api/TaskApi"
import * as TaskUtil from "./../class/TaskClass"
import { ModalSelections,select } from '../modal/modalClass';
import { COLORS } from '../design/constant';

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
    const [modalData,setModaldata] = useState(new ModalSelections("",[]))
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
        (async()=>{
            const gettedTask = await TaskUtil.getTaskWithId(id)
            if(!gettedTask){
                navigate("/infom")
            }
            else{
                setTask(gettedTask)
            }
        })()
    },[])
    useEffect(()=>{
        if(task && !name){
            setName(task.name);
            setStart(task.start.disp());
            setEnd(task.end.disp());
            setGoto(task.forgoto.disp());
            setMemo(task.memo);
            setIsHome(task.isHome);
            setDate(task.date);
        }
    },[task]);
    //通常関数
    function nameChange(e){
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
        const taskDetail = await getTaskDetails(id)
        const sameTaskid = await getSameTask(taskDetail.name,taskDetail.date)
        //今更新しようとしているものも含まれる
        let sameIdFlag = 1
        if(sameTaskid.length >= 2){
            setModaldata(new ModalSelections(
                "今後同名のタスクが存在しますが、同様に更新しますか？", 
                [new select(`すべて更新`,COLORS.ok),new select(`このタスクのみ更新する`)]))
            sameIdFlag = await showModal()
        }
        const targetIds = sameIdFlag === 0 ? sameTaskid:[id]
        putList.current = targetIds
        for (const targetId of targetIds) {
            await loopcollapseTask(targetId);
        }
        if(putList.current.length > 0){
            await update(name,goto+":00",start+":00",end+":00",memo,putList.current,isHome)
        }
        if(dltList.current.length > 0){
            await dltApi(dltList.current)
        }
        localStorage.removeItem("task")
        navigate(`/infom`);
    }
    //各タスクに応じて、衝突タスクを探す
    async function loopcollapseTask(targetid){
        const targetDetail = await getTaskDetails(targetid)
        const collapseTasks = await getCollapse(targetDetail.date,TimeUtil.StoTime(start),TimeUtil.StoTime(end),targetDetail.user_id)
        for (const collapseId of collapseTasks) {
            if(collapseId != targetid){
                const collapseDetail = await getTaskDetails(collapseId);
                setModaldata(new ModalSelections(`${collapseDetail.date.format("MM/DD")}「${collapseDetail.name}」と時間が重複しています`, 
                [new select(`「${collapseDetail.name}」を削除`,COLORS.red),new select(`このタスクを登録しない`,COLORS.cancel),new select(`両方保存する(非推奨)`)]))
                const result = await showModal()
                switch(result){
                    case 0:
                        dltList.current.push(collapseId)
                        break
                    case 1:
                        putList.current = putList.current.filter((pId)=>pId != targetid)
                        break
                }
                if(result === 1){
                    break
                }
            }
        }
    }
    async function showModal(){
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
        const taskDetail = await getTaskDetails(id)
        const sameTaskid = await getSameTask(taskDetail.name,taskDetail.date)
        //今削除しようとしているものも含まれる
        let sameIdFlag = false
        if(sameTaskid.length >= 2){
            setModaldata(new ModalSelections('今後同名のタスクが存在しますが、同様に削除しますか？',[new select("すべて削除する",COLORS.red),new select("このタスクのみ削除")]))
            sameIdFlag = await showModal()
        }
        if(sameIdFlag === 0){
            await dltApi(sameTaskid)
        }
        else{
            await dltApi([id])
        }
        navigate("/infom")
    }
    //リターン文******************************************
    if(!task || !task.id){
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
            modalDisp = {modalDisp}
            modalData = {modalData}
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