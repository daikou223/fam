import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./../style.css";
import TheQuest from "./thequest";

//メインページ
function QuestMenu(){
    //変数定義*****************
    const [cont,setCont] = useState([]);
    const [allTask,setAllTasks] = useState([]);
    //関数定義***************
    //初期化関数
    useEffect(()=>{
        const id = localStorage.getItem("id")
        axios.get(
            `https://fam-api-psi.vercel.app/api/quest/${id}`
        ).then((responce)=>{
            let tempcont = [];
            let tempallTasks = [];
            for(let i = 0;i<responce.data.length;i++){
                if(responce.data[i].contracter == id && responce.data[i].state == 1){
                    tempcont.push(responce.data[i]);
                }else if(responce.data[i].contracter == 0 && responce.data[i].state == 0){
                    tempallTasks.push(responce.data[i]);
                }else{
                    console.log("あるべきデータではありません。")
                }
            }
            setCont([...tempcont])
            setAllTasks([...tempallTasks])
        }
        ).catch((error)=>{
            console.log("通信エラー",error.data)
        }
        )
    },[])
    //受注中クエストを返すための関数
    function contdiv(){
        return(
            <div className = "board">
                {cont.map((quest,i) =>(<TheQuest quest = {quest} id = "0" cont = {cont} setCont = {setCont} allTask = {allTask} setAllTasks = {setAllTasks}/>))}
            </div>
        )
    }
    //クエスト一覧
    function newdis(){
        let tasks = [...allTask];
        tasks.sort((task1, task2) => new Date(task1.deadline.split("T")[0]) - new Date(task2.deadline.split("T")[0]));
        return(
            <div className = "board">
                {tasks.map((quest,i) =>(<TheQuest quest = {quest} id = "1" cont = {cont} setCont = {setCont} allTask = {allTask} setAllTasks = {setAllTasks}/>))}
            </div>
        )
    }
    //JSXをreturn******************
    return(
        <div>
            <h1>受注中クエスト</h1>
            {contdiv()}
            <h1>クエスト一覧</h1>
            {newdis()}
        </div>
    )
}

  
export default QuestMenu;