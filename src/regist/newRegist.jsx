import { useState } from "react";
import { INPUT_TYPE_NAME } from "../const";
import Time from "../class/Time";
import Menubar from "../menubar/menubar";
import Form from "../FormComponent/form";
import { ModalSelections, select } from "../modal/modalClass";
import Modal from "../modal/modal";
import * as dateUtil from "../class/day"
import { COLORS } from "../design/constant";
import { postTask } from "../api/TaskApi";
import { useNavigate } from "react-router-dom";

export default function Regist(){
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

    /* 変数制御 */
    const [taskName,setTaskName] = useState("");
    const [dates,setDates] = useState([]);
    const [isBulk,setIsBulk] = useState(false);
    const [memo,setMemo] = useState("");
    const [startTime,setStartTime] = useState(new Time(9,0,0))
    const [endTime,setEndTime] = useState(new Time(18,0,0))
    const [gotoTime,setGotoTime] = useState(new Time(1,30,0))
    const [isHome,setIsHome] = useState(false)
    const id = localStorage.getItem('id');
    const navigation = useNavigate();

    const renderItems = [
        {
            name:"スケジュール名",
            type:INPUT_TYPE_NAME.TEXT,
            state:taskName,
            setState:setTaskName
        },
        {
            name:"日付",
            type:INPUT_TYPE_NAME.CALENDER,
            state:dates,
            setState:setDates,
            isBulk:isBulk,
            setIsBulk:setIsBulk
        },
        {
            name:"開始時刻",
            type:INPUT_TYPE_NAME.TIME,
            state:startTime,
            setState:setStartTime
        },
        {
            name:"終了時刻",
            type:INPUT_TYPE_NAME.TIME,
            state:endTime,
            setState:setEndTime
        },
        {
            name:"在宅",
            type:INPUT_TYPE_NAME.CHECKBOX,
            state:isHome,
            setState:setIsHome
        },
        {
            name:"移動時刻",
            type:INPUT_TYPE_NAME.TIME,
            state:gotoTime,
            setState:setGotoTime,
            disabled:isHome
        },
        {
            name:"めも",
            type:INPUT_TYPE_NAME.TEXT,
            state:memo,
            setState:setMemo,
        }
    ]

    const buttonClick = async()=>{
        if(!taskName || !dates){
            setModaldata(new ModalSelections('未入力項目があります。',[new select("確認")]))
            await showModal()
            return 
        }
        if(endTime.toSeconds() < startTime.toSeconds()){
            setModaldata(new ModalSelections('開始時刻と終了時刻の関係がおかしいです。',[new select("確認")]))
            await showModal()
            return
        }
        if(!!dates.find((d)=>d.isBefore(dateUtil.getToday()))){
            setModaldata(new ModalSelections('本日以前の日付を含みますがよろしいですか？',[new select("OK",COLORS.ok),new select("キャンセル")]))
            const res = await showModal()
            if(res === 1){
                return
            }
        }
        const params = dates.map((date) => ({
            "user_id":id,
            "taskname":taskName,
            "forgoto":isHome ? "00:00:00" :gotoTime.format(),
            "date":date.format("YYYY-MM-DD"),
            "start":startTime.format(),
            "end":endTime.format(),
            "memo":memo,
            "isHome":isHome ? 0:1 
        }))
        try{
            await postTask(params);
            navigation("/infom")
        }catch(e){
            setModaldata(new ModalSelections('保存に失敗しました。入力欄のスクショを管理者に送ってください',[new select("確認")]))
            await showModal()
        }
    }

    const buttonDatas = [{
        text:"登録",
        click:buttonClick
    }]

    return(
        <div style = {{marginTop:"70px"}}>
            <Menubar/>
            <Modal 
            modalDisp = {modalDisp}
            modalData = {modalData}
            onSelect={(idx) => {
                if (modalResolve) {
                    modalResolve(idx); // ユーザーの選択結果を返す
                    setModalDisp(false); // モーダルを閉じる
                    setModaldata(new ModalSelections("",[]))
                }
            }}
        />
            <Form renderItems = {renderItems} title = {"スケジュール登録"} buttonDatas={buttonDatas}/>
        </div>
    )
}