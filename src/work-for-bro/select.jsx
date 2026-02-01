import React,{useState,useEffect} from "react";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import axios from "axios";
import {update,dltApi,postTask} from "./../api/TaskApi"
import * as dayUtil from "../class/day"
import Menubar from "../menubar/menubar"
import "./forselect.css"
import { COLORS } from "../design/constant";

import Modal from "./../modal/modal"
import { ModalSelections,select } from '../modal/modalClass';

class Date{
    constructor(date,shift = 0){
        this.date = date
        this.shift = shift
        this.id = date.date()-1
    }
    addParam(paramses){
        switch(this.shift){
            case(1):
                paramses.push({
                    "user_id":2,
                    "taskname":"仕事",
                    "forgoto":"01:15:00",
                    "date":dayUtil.dateToString(this.date),
                    "start":"06:30:00",
                    "end":"15:30:00",
                    "memo":"",
                    "isHome":1});
                break
            case(2):
            case(3):
                paramses.push({
                    "user_id":2,
                    "taskname":"仕事",
                    "forgoto":"01:15:00",
                    "date":dayUtil.dateToString(this.date),
                    "start":"07:00:00",
                    "end":"16:00:00",
                    "memo":"",
                    "isHome":1});
                break
            case(4):
                paramses.push({
                    "user_id":2,
                    "taskname":"仕事",
                    "forgoto":"01:15:00",
                    "date":dayUtil.dateToString(this.date),
                    "start":"11:00:00",
                    "end":"20:00:00",
                    "memo":"",
                    "isHome":1});
                break
            case(5):
            case(6):
                paramses.push({
                    "user_id":2,
                    "taskname":"仕事",
                    "forgoto":"01:15:00",
                    "date":dayUtil.dateToString(this.date),
                    "start":"12:00:00",
                    "end":"21:00:00",
                    "memo":"",
                    "isHome":1});
                break
            case(7):
                paramses.push({
                    "user_id":2,
                    "taskname":"夜勤仕事",
                    "forgoto":"01:15:00",
                    "date":dayUtil.dateToString(this.date),
                    "start":"20:30:00",
                    "end":"31:00:00",
                    "memo":"",
                    "isHome":1});
                break
        }
    }
}

function inisyal(){
    const selected = []
    const year = dayUtil.getToday().year()
    const month = dayUtil.getToday().month()+1
    const dayNum = dayUtil.getFinalday(dayUtil.setDate(year,month,1)).date()
    for(let i = 1;i<=dayNum;i++){
        selected.push(new Date(dayUtil.setDate(year,month,i)))
    }
    return selected
}

function Select(){
    //変数定義******************************************************
    const [selected,setSelected] = useState(inisyal())
    const[buttonName,setButtonName] = useState("保存");
    const navigate = useNavigate();
    const [modalData,setModaldata] = useState(new ModalSelections("",[]))
    const [modalDisp,setModalDisp] = useState(false)
    //スタイル定義******************************************
    //関数定義***************************************************
    async function plt(){
        const printingButton = document.getElementById("print");
        printingButton.disabled = true;
        const paramses = []
        selected.forEach((aSelect)=>aSelect.addParam(paramses))
        if(paramses.length === 0){
            setModaldata(new ModalSelections(`なにも選択されていません`, 
            [new select(`OK`)]))
            setModalDisp(true);
        }else{
            setButtonName("保存中");
            await postTask(paramses)
            setButtonName("保存");
            navigate("/infom")
        }
        printingButton.disabled = false;
    }
    return(
        <div>
            <Modal 
            modalDisp = {modalDisp}
            modalData = {modalData}
            onSelect={(idx) => {
                setModalDisp(false); // モーダルを閉じる
            }}/>
            <Menubar/>
            <div className = "buttonWarpper">
            {selected.map((aSelect)=><OneDay select = {aSelect} setSelected = {setSelected}/>)}
            <button  id = "print" onClick={()=>{plt()}}>{buttonName}</button>  
            </div>
        </div>
    )
}

function OneDay(props){
    //引き渡し変数****************************
    const select = props.select
    const setSelected = props.setSelected
    //関数************************************
    //ボタン押したときの処理
    function update(shift){
        setSelected((prev)=>{
            const newSelected = [...prev];
            const updated = new Date(newSelected[select.id].date); // 新しいインスタンスを作り直す
            updated.shift = shift;
            newSelected[select.id] = updated;
            return newSelected;
        })
    }
    //スタイル変数****************************
    const styles = {
        selected:{
            backgroundColor:"yellow",
            border:"0.5px solid black",
            width:"50px",
            height:"35px",
            margin:"1px"
        },
        nonSelected:{
            backgroundColor:"rgb(206, 201, 201)",
            border:"0.5px solid black",
            width:"50px",
            height:"35px",
            margin:"1px"
        }
    }
    return(
        <div style = {{display:"flex"}}>
            <table className="broTable">
            <div style = {{marginRight: "15px"}}>
            {dayUtil.getOnlyDate(select.date)}
            </div>
            <button className = "broButton" style = {select.shift === 0 ? styles.selected:styles.nonSelected} onClick={()=>update(0)}>なし</button>
            <button className = "broButton" style = {select.shift === 1 ? styles.selected:styles.nonSelected} onClick={()=>update(1)}>A</button>
            <button className = "broButton" style = {select.shift === 2 ? styles.selected:styles.nonSelected} onClick={()=>update(2)}>B</button>
            <button className = "broButton" style = {select.shift === 3 ? styles.selected:styles.nonSelected} onClick={()=>update(3)}>C</button>
            <button className = "broButton" style = {select.shift === 4 ? styles.selected:styles.nonSelected} onClick={()=>update(4)}>D</button>
            <button className = "broButton" style = {select.shift === 5 ? styles.selected:styles.nonSelected} onClick={()=>update(5)}>E</button>
            <button className = "broButton" style = {select.shift === 6 ? styles.selected:styles.nonSelected} onClick={()=>update(6)}>F</button>
            <button className = "broButton" style = {select.shift === 7 ? styles.selected:styles.nonSelected} onClick={()=>update(7)}>夜</button>
            </table>
        </div>
    )
}
export default Select