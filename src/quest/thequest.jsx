import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./quest.css"

function TheQuest({quest,id,cont,setCont,allTask,setAllTasks}){
    //変数*****************************
    const fulldate = quest.deadline.split("T");
    const [year,month,day] = fulldate[0].split("-");
    const buttonName = ["完了","着手"]
    const [tmp,tmpset] = useState(1)
    //関数********************************
    function taskStateChange(mode){
        if(mode == 0){
            document.getElementById(`button${quest.id}`).disabled = true;
            axios.put(`https://fam-api-psi.vercel.app/api/quest/comp`,{
                id:quest.id
            }).then((res)=>{
                console.log(`${quest.title}完了`)
                let tempcont = [...cont]
                const index = tempcont.indexOf(quest);
                if (index !== -1) {
                    tempcont.splice(index, 1);
                }
                setCont(tempcont)
            }
            )
        }
        else if(mode == 1){
            document.getElementById(`button${quest.id}`).disabled = true;
            axios.put(`https://fam-api-psi.vercel.app/api/quest/cont`,{
                contracter:localStorage.getItem("id"),
                id:quest.id

            }).then((res)=>{
                console.log(`${quest.title}着手`)
                const tempAllTasks = [...allTask]
                const index = tempAllTasks.indexOf(quest);
                if (index !== -1) {
                    tempAllTasks.splice(index, 1);
                }
                setAllTasks(tempAllTasks);
                let tempcont = [...cont]
                tempcont.unshift(quest);
                setCont(tempcont);
            }
            )
        }
    }
    return(
        <div key = {quest.id} className = "questpaper">
            <div class = "thequest_disp">
                <div class = "main">    
               <div>
                    {quest.title}
                </div>
                <div className = "questdeadline">
                    締め切り:{month}/{day}
                </div>
                </div>
                <div className = "comp">
                    <button onClick = {()=>{taskStateChange(id)}} id = {`button${quest.id}`} >{buttonName[id]}</button>
                </div>
            </div>
        </div>
    )
}

export default TheQuest;