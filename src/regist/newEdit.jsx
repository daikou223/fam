import { useEffect, useState } from "react";
import * as taskUtil from "../class/TaskClass"
import Time,{StoTime} from "../class/Time";
import Form from "../FormComponent/form";
import { INPUT_TYPE_NAME } from "../const";
import { useNavigate, useParams } from "react-router-dom";
import { ModalSelections, select } from "../modal/modalClass";
import Menubar from "../menubar/menubar";
import Modal from "../modal/modal";
import { COLORS } from "../design/constant";
import { dltApi, update } from "../api/TaskApi";
export default function Edit(){
     /* モーダルエリア */
    const [modalData,setModaldata] = useState(new ModalSelections("",[]))
    const [modalDisp,setModalDisp] = useState(false);
    const [modalResolve, setModalResolve] = useState(null);
    async function showModal(){
            setModalDisp(true)
            return new Promise((resolve) => {
                setModalResolve(() => resolve);
            });
    }


    const {id} = useParams();
    const [task,setTask] = useState(null)
    const [taskName,setTaskName] = useState("")
    const [start,setStart] = useState(null)
    const [end,setEnd] = useState(null)
    const [goto,setGoto] = useState(null)
    const [memo,setMemo] = useState("")
    const [isHome,setIsHome] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        taskUtil.getTaskDetails(id).then(data =>{
            console.log(data)
            if(!data){
                navigate("/infom")
            }else{
                setTask(data)
                setTaskName(data.name)
                setStart(data.start)
                setEnd(data.end)
                setGoto(data.forgoto)
                setMemo(data.memo ?? "")
                setIsHome(!data.isHome)
            }
        })
    }, [id])

    const renderItems = [
        {
            name:"スケジュール名",
            type:INPUT_TYPE_NAME.TEXT,
            state:taskName,
            setState:setTaskName
        },
        {
            name:"開始時刻",
            type:INPUT_TYPE_NAME.TIME,
            state:start,
            setState:setStart
        },
        {
            name:"終了時刻",
            type:INPUT_TYPE_NAME.TIME,
            state:end,
            setState:setEnd
        },
        {
            name:"移動時間",
            type:INPUT_TYPE_NAME.TIME,
            state:goto,
            setState:setGoto
        },
        {
            name:"在宅",
            type:INPUT_TYPE_NAME.CHECKBOX,
            state:isHome,
            setState:setIsHome
        },
        {
            name:"メモ",
            type:INPUT_TYPE_NAME.TEXT,
            state:memo,
            setState:setMemo
        },
    ]

    async function updateClick(){
        const sameTasks = await taskUtil.getSameTask(task.name,task.date)
        let flag = 0
        if(sameTasks.length >= 2){
            setModaldata(new ModalSelections(
                "今後同名のタスクが存在しますが、同様に更新しますか？", 
                [new select(`すべて更新`,COLORS.ok),new select(`このタスクのみ更新する`)]))
            flag = await showModal()
        }else{
            flag = 1
        }
        const targetTasks = flag == 0 ? sameTasks : [task]
        await update(
            taskName,
            goto.format(),
            start.format(),
            end.format(),
            memo,
            targetTasks.map(task=>task.id),
            isHome ? 0:1
        )
        navigate("/infom")
    }

    async function deleteClick(){
        const sameTasks = await taskUtil.getSameTask(task.name,task.date)
        let flag = 0
        if(sameTasks.length >= 2){
            setModaldata(new ModalSelections(
                "今後同名のタスクが存在しますが、同様に削除しますか？", 
                [new select(`すべて削除`,COLORS.ok),new select(`このタスクのみ削除する`)]))
            flag = await showModal()
        }else{
            flag = 1
        }
        const targetTasks = flag == 0 ? sameTasks : [task]
        await dltApi(targetTasks.map((task)=>task.id))
        navigate("/infom")
    }

    const buttonDatas = [
        {
            text:"編集",
            click:updateClick
        },
        {
            text:"削除",
            click:deleteClick
        }
    ]

    return(
        <div style ={{ marginTop:"70px"}}>
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
            {task !== null ?
            <Form renderItems = {renderItems} title = {"編集画面"} buttonDatas = {buttonDatas}/>:
            <></>}
        </div>
    )
}
