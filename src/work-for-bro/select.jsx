import React,{useState,useEffect} from "react";
import axios from "axios";
import {update,dltApi,postTask} from "./../api/TaskApi"
import * as dayUtil from "../class/day"
import Menubar from "../menubar/menubar"
import "./forselect.css"
import { COLORS } from "../design/constant";
import dayjs from "dayjs";

//人参とごぼうできんぴら
class Date{
    constructor(date,shift = 7){
        this.date = date
        this.shift = shift
        this.id = date.date()-1
    }
    dayColor(){
        if(this.date.day() == 0){
            return COLORS.red
        }else if(this.date.day() == 6){
            return COLORS.blue
        }else{
            return COLORS.default
        }
    }
    dayMemo(){
        return this.date.day() == 0?"お昼忘れずに":"."
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
                    "end":"23:59:00",
                    "memo":"",
                    "isHome":1});
                paramses.push({
                    "user_id":2,
                    "taskname":"夜勤仕事",
                    "forgoto":"01:15:00",
                    "date":dayUtil.dateToString(dayUtil.getTomorrow(this.date)),
                    "start":"00:00:00",
                    "end":"07:00:00",
                    "memo":"",
                    "isHome":1});
                break
        }
    }
    createTableData(){
        switch(this.shift){
            case(0):
                return(<tr>
                    <td style = {{backgroundColor:this.dayColor()}}>{dayUtil.getOnlyDate(this.date)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    </tr>)
            case(1):
                return(<tr>
                    <td style = {{backgroundColor:this.dayColor()}}>{dayUtil.getOnlyDate(this.date)}</td>
                    <td>5:15</td>
                    <td>6:30</td>
                    <td>15:30</td>
                    <td>16:45</td>
                    <td>{this.dayMemo()}</td>
                    </tr>)
            case(2):
            case(3):
                return(<tr>
                    <td style = {{backgroundColor:this.dayColor()}}>{dayUtil.getOnlyDate(this.date)}</td>
                    <td>5:45</td>
                    <td>7:00</td>
                    <td>16:00</td>
                    <td>17:15</td>
                    <td>{this.dayMemo()}</td>
                    </tr>)
            case(4):
                return(<tr>
                    <td style = {{backgroundColor:this.dayColor()}}>{dayUtil.getOnlyDate(this.date)}</td>
                    <td>9:45</td>
                    <td>11:00</td>
                    <td>20:00</td>
                    <td>21:15</td>
                    <td>{this.dayMemo()}</td>
                    </tr>)
            case(5):
            case(6):
                return(<tr>
                    <td style = {{backgroundColor:this.dayColor()}}>{dayUtil.getOnlyDate(this.date)}</td>
                    <td>10:45</td>
                    <td>12:00</td>
                    <td>21:00</td>
                    <td>22:15</td>
                    <td>{this.dayMemo()}</td>
                    </tr>) 
            case(7):
                return(<tr>
                    <td style = {{backgroundColor:this.dayColor()}}>{dayUtil.getOnlyDate(this.date)}</td>
                    <td>19:15</td>
                    <td>20:30</td>
                    <td>翌7:00</td>
                    <td>翌8:15</td>
                    <td></td>
                    </tr>) 
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
    const[buttonName,setButtonName] = useState("印刷");
    //スタイル定義******************************************
    //関数定義***************************************************
    async function plt(){
        const printingButton = document.getElementById("print");
        printingButton.disabled = true;
        setButtonName("保存中");
        const paramses = []
        selected.forEach((aSelect)=>aSelect.addParam(paramses))
        await postTask(paramses)
        window.print();
        setButtonName("印刷");
        printingButton.disabled = false;
    }
    return(
        <div>
            <Menubar/>
            <div className = "buttonWarpper">
            {selected.map((aSelect)=><OneDay select = {aSelect} setSelected = {setSelected}/>)}
            <button  id = "print" onClick={()=>{plt()}}>{buttonName}</button>  
            </div>
            <div className = "tableWarpper">
            <table>
                <tr><th className = "day">日</th><th>出発</th><th>開始</th><th>終了</th><th>帰宅</th><th className="memo">メモ</th></tr>
                {selected.map((aSelect)=>{
                    return aSelect.createTableData()
                })}
            </table>
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
            <table>
            <div style = {{marginRight: "15px"}}>
            {dayUtil.getOnlyDate(select.date)}
            </div>
            <button className = "broButton" style = {select.shift == 0 ? styles.selected:styles.nonSelected} onClick={()=>update(0)}>なし</button>
            <button className = "broButton" style = {select.shift == 1 ? styles.selected:styles.nonSelected} onClick={()=>update(1)}>A</button>
            <button className = "broButton" style = {select.shift == 2 ? styles.selected:styles.nonSelected} onClick={()=>update(2)}>B</button>
            <button className = "broButton" style = {select.shift == 3 ? styles.selected:styles.nonSelected} onClick={()=>update(3)}>C</button>
            <button className = "broButton" style = {select.shift == 4 ? styles.selected:styles.nonSelected} onClick={()=>update(4)}>D</button>
            <button className = "broButton" style = {select.shift == 5 ? styles.selected:styles.nonSelected} onClick={()=>update(5)}>E</button>
            <button className = "broButton" style = {select.shift == 6 ? styles.selected:styles.nonSelected} onClick={()=>update(6)}>F</button>
            <button className = "broButton" style = {select.shift == 7 ? styles.selected:styles.nonSelected} onClick={()=>update(7)}>夜</button>
            </table>
        </div>
    )
}
export default Select