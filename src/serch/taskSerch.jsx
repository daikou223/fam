import style from "../style.css"
import { useState,useEffect,useRef} from "react";

function Serch(){
    //変数定義**********************
    let lowData = JSON.parse(localStorage.getItem("task"));
    const taskName = useRef("");
    const [dispText,setDispText] = useState("");
    const [filterdData,setFilterdData] = useState([]);
    //関数定義************************
    function serchTask(){
        const TaskName_ = taskName.current.value;
        let filterdData_ = [];
        for(let i = 0;i<lowData.length;i++){
            let isPermit = true; 
            if(!(lowData[i].taskname.includes(TaskName_))){
                isPermit = false;
            }
            if(isPermit){
                filterdData_.push(lowData[i]);
            }
        }
        console.log(filterdData_);
        setFilterdData(filterdData_);
    }
    return(
        <div>
        <h1>タスク検索</h1>
        <input 
            type = "text" 
            ref = {taskName} 
            placeholder="タスクの名前(部分一致)"
        />
        <button
            onClick = {()=>serchTask()}>
            検索
            </button>
        </div>
    )
}

export default Serch;