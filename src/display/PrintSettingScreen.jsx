import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Menubar from "../menubar/menubar";
import Form from "../FormComponent/form";
import Modal from "../modal/modal";
import { INPUT_TYPE_NAME } from "../const";
import { ModalSelections,select } from '../modal/modalClass';
import * as dateUtil from "../class/day"

export default function PrintSettingScreen(){
    const navigate = useNavigate();
    const [modalData,setModaldata] = useState(new ModalSelections("",[]))
    const [modalDisp,setModalDisp] = useState(false);
    const [modalResolve, setModalResolve] = useState(null);

    useEffect(()=>{
        if(!!modalData.message){
            setModalDisp(true)
            new Promise((resolve) => {
            setModalResolve(() => resolve);
        })}
    },[modalData])

    const [startDate,setStartDate] = useState([dateUtil.getToday()])
    const [endDate,setEndDate] = useState([dateUtil.getToday()])

    const renderItems = [
        {
            name:"開始日付",
            type:INPUT_TYPE_NAME.CALENDER,
            state:startDate,
            setState:setStartDate,
        },
        {
            name:"終了日付",
            type:INPUT_TYPE_NAME.CALENDER,
            state:endDate,
            setState:setEndDate,
        }
    ]
    const buttonClick = async()=>{
        if(startDate.length === 0 || endDate.length === 0){
            setModaldata(new ModalSelections('未入力項目があります。',[new select("確認")]))
        }
        else if(endDate[0].diff(startDate[0],"day") < 0){
            setModaldata(new ModalSelections('開始日付が終了日付を追い越しています',[new select("確認")]))
        }
        else if(endDate[0].diff(startDate[0],"day") > 31){
            setModaldata(new ModalSelections('選択日付が多すぎます。31日以内にしてください',[new select("確認")]))
        }else{
            navigate("/print",{ state:{startDate:startDate[0],endDate:endDate[0]}})
        }
    }
    const buttonData = {
        text:"作成",
        click:buttonClick
    }
    return(<div style = {styles.wrapper}>
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
        <Form 
        title = "印刷設定"
        renderItems = {renderItems} 
        buttonData = {buttonData}/>
        </div>);
}
const styles = {
    wrapper:{
        marginTop:"70px",
    },
}