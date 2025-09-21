import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import Time,{timeSubstruct,timeAdd,StoTime} from "../class/Time"
import Menubar from '../menubar/menubar'
import * as TaskUtil from '../class/TaskClass'
import * as dateUtil from '../class/day'

//個人日程
function Week(){
    //変数定義**************************
    let name = ["","弟","兄","母","父"] 
    const[buttonName,setButtonName] = useState("印刷");
    //スタイル定義*************************
    const styles = {
        weekTable:{
            border:"1px solid black",
            borderCollapse:"collapse",
        },
        blueBorder:{
            row:{backgroundColor:"lightblue"},
        },
        botton:{
            display: "flex",
            marginLeft:"20px",
    fontSize:"20px",

     justifyContent: "center",
        }

    }                
        function plt(){
        setButtonName("保存中");
        const printingButton = document.getElementById("print");
        printingButton.disabled = true;
window.print();
        setButtonName("印刷");
        printingButton.disabled = false;
        }
    return(
        <>
            <Menubar/>
            <div style = {{ marginLeft: 30,marginTop:70 }}>
                {[1,2,3,4].map((parson)=>{
                    return(
                        <div>
                            {name[parson]}
                            <table style =  {styles.weekTable}>
                                <tr>
                                    <th className = "nallow-colunm">日</th>
                                    <th className = "nallow-colunm">出発時刻</th>
                                    <th className = "wide-colunm">流れ</th>
                                    <th className = "nallow-colunm">帰宅時刻</th>
                                </tr>
                                {
                                    [1,2,3,4,5,6,7].map((i)=>{
                                        if(i%2 == 1){
                                            return(<OnlyTask personId = {parson} fromToday = {i} style = {styles.blueBorder}/>)
                                        }
                                        else{
                                            return(<OnlyTask personId = {parson} fromToday = {i} style = {{}}/>)
                                        }
                                    }
                                )
                                }
                            </table>
                               </div>

                    )
                })}
                <div style =  {styles.botton}>
                <button  id = "print" onClick={()=>{plt()}}>{buttonName}</button>     
                </div>
            </div>
        </>
        )
    }

function OnlyTask(props){
    //変数定義***************************************************
    const [task,setTask] = useState([])
    const fromToday = props.fromToday
    const date = dateUtil.getToday().add(fromToday,"day");
    const user_id = props.personId
    const styles = {
        row:props.style.row || {},
        widCell:{
            width:300,
        },
        narrowCell:{
            width:70
        }
    };
    //useEffect
    //データ取得
    useEffect(() => {
        const fetchTask = async () => {
            let task_ = await TaskUtil.getTaskWithConditions(user_id, date);
            task_.sort((task1,task2)=>timeSubstruct(task1.goOutTime,task2.goHomeTime).toSeconds() > 0)
            setTask(task_);
        };
        fetchTask();
    }, []); 
    if(task.length == 0){
        return(
            <tr style = {styles.row || {}}>
                <td style = {styles.narrowCell}>{dateUtil.getOnlyDate(date)}</td>
                <td style = {styles.narrowCell}>-</td>
                <td style = {styles.widCell}>-</td>
                <td style = {styles.narrowCell}>-</td>
            </tr>
        )
    }else{
        return(
        <tr style = {styles.row || {}}>
            <td style = {styles.narrowCell}>{dateUtil.getOnlyDate(date)}</td>
            <td style = {styles.narrowCell}>{task[0].goOutTime.disp()}</td>
            <td style = {styles.widCell}>{task.map((t)=>(
            <a>→{t.name}</a>
            ))}→</td>
            <td style = {styles.narrowCell}>{task[task.length-1].goHomeTime.disp()}</td>
        </tr>
        )
    }
}
export default Week;