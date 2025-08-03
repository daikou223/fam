import { useState,useEffect,useRef} from "react";
import dayjs from 'dayjs';
import Menubar from "../menubar/menubar"

function Serch(){
    //変数定義**********************
    let lowData = JSON.parse(localStorage.getItem("task"));
    let id = localStorage.getItem("id");
    const taskName = useRef("");
    const [dispText,setDispText] = useState("");
    const [filterdData,setFilterdData] = useState([]);
    //関数定義************************
    function serchTask(){
        const TaskName_ = taskName.current.value;
        let filterdData_ = [];
        for(let i = 0;i<lowData.length;i++){
            let isPermit = true; 
            if(!(lowData[i].taskname.includes(TaskName_)) || lowData[i].user_id != id){
                isPermit = false;
            }
            if(isPermit){
                filterdData_.push(lowData[i]);
            }
        }
        setFilterdData(filterdData_);
    }
    return(
        <div>
            <Menubar/>
        <h1 style = {styles.mainTitle}>タスク検索</h1>
        <div style = {styles.serchBar}>
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
        <div style = {styles.serResult}>
            <div>検索結果：{filterdData.length}件</div>
        {filterdData.map((task)=>{
            const dispDate = dayjs(task.date.slice(0,11)).format('YYYY/MM/DD');
            return(<div style = {styles.oneResult}>
                <div style = {styles.title}>{task.taskname}</div><>{dispDate}</>
            </div>)
        })}
        </div>
        </div>
    )
}

const styles = {
    serResult:{
        border:"2px solid black",
        borderRadius:"5px" 
    },
    oneResult:{
        borderTop:"1px solid lightgray",
        padding:"5px 10px",
    },
    title:{
        fontSize:"10px",
    },
    mainTitle:{
        marginLeft:70,
        marginTop:30,
    },
    serchBar:{
        margin:10
    }
}

export default Serch;