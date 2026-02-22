import { INPUT_TYPE_NAME } from "../const";
import { useState } from "react";
import Form from "../FormComponent/form";
import * as dayUtil from './../class/day';
import Time from "../class/Time";
import Regist from "../regist/newRegist";
import Edit from "../regist/newEdit";

export default function Test(){
    const [textInput,setTextInput] = useState(""); 
    const [checkBoxState,setCheckBoxState] = useState(false);
    const [timeState,setTimeState] = useState(new Time(12,12,0));
    const [dateState,setDateState] = useState([
        dayUtil.getToday()
    ]);
    const [isBulk,setIsBulk] = useState(true);
    const inputDatas = [
        {
            name:"テストインプット",
            type:INPUT_TYPE_NAME.TEXT,
            state:textInput,
            setState:setTextInput
        },
        {
            name:"テストチェックボックス",
            type:INPUT_TYPE_NAME.CHECKBOX,
            state:checkBoxState,
            setState:setCheckBoxState
        },
        {
            name:"テスト時間",
            type:INPUT_TYPE_NAME.TIME,
            state:timeState,
            setState:setTimeState
        },
        {
            name:"テストカレンダー",
            type:INPUT_TYPE_NAME.CALENDER,
            state:dateState,
            setState:setDateState,
            isBulk:isBulk,
            setIsBulk:setIsBulk
        },
    ]
    const buttonClick = ()=>{
        console.log("送信")
    }
    const buttonData = {
        text:"送信",
        click:buttonClick
    }
    return(
        // <Form title = "テスト" renderItems = {inputDatas} buttonData = {buttonData}/>
        // <Regist/>
        <Edit/>
    )
}