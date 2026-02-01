import React,{useState,useEffect} from "react"
import dayjs from "dayjs"
import * as TaskUtil from './../class/TaskClass'
import * as dayUtil from './../class/day'
import * as TimeUtil from './../class/Time'
import Menubar from '../menubar/menubar'
import {COLORS} from "./../design/constant"

export default function PrintDisplay(){
    const [dispDay,setDispDay] = useState(dayjs())
    const [broTask,setBroTask] = useState([])
    const [myTask,setMyTask] = useState([])
    const [days,setDays] = useState([])

    const styles = {
        tableStyle:{
            flex:1,
            marginTop:"50px",
            textAlign:"center",
        },
        tableCell:{
            border:"1px solid black",
            width:"80px",
            height:"25px",
            textAlign:"center"
        },
        sunday:{
            border:"1px solid black",
            width:"80px",
            height:"25px",
            textAlign:"center",
            backgroundColor:COLORS.red
        },
        staday:{
            border:"1px solid black",
            width:"80px",
            height:"25px",
            textAlign:"center",
            backgroundColor:COLORS.blue
        },
        tableCellLeftBorder:{
            borderTop:"1px solid black",
            borderBottom:"1px solid black",
            borderRight:"1px solid black",
            borderLeft:"3px solid black",
            width:"80px",
            height:"25px",
            textAlign:"center"
        },
        tableBody:{
            borderCollapse:"collapse",
        }
    }
    function nextMonth(){
        const month = dispDay.month()
        const year = dispDay.year()
        setDispDay(dayUtil.setDate(year,month+1,1) )
    }
    function prevMonth(){
        const month = dispDay.month()
        const year = dispDay.year()
        setDispDay(dayUtil.setDate(year,month-1,1) )
    }
    function dCss(d){
        if(d.format("d") === 0){
            return styles.sunday
        }
        else if(d.format("d") === 6){
            return styles.staday
        }
        return styles.tableCell
    }
    useEffect(()=>{
        const load = async() =>{
            const _days = []
            const res = await TaskUtil.getMonthTask(dispDay)
            setBroTask(res.filter((t)=>t.user_id === 2))
            setMyTask(res.filter((t)=>t.user_id === 1))
            const startDay = dayUtil.getFirstday(dispDay)
            const endDay = dayUtil.getFinalday(dispDay)
            for(let targetDay = startDay;
                targetDay.isBefore(endDay) || targetDay.isSame(endDay);
                targetDay = dayUtil.getTomorrow(targetDay)){
                    _days.push(targetDay)
                }
            setDays(_days)
            console.log(res)
        }
        load()
    },[dispDay])
    return(
        <div translate="no">
        <Menubar/>
        <div style = {styles.tableStyle}>
        <button onClick = {prevMonth} className = "midiambutton">&lt;</button>
        <a class = "midiamletter">{dispDay.format("YYYY年MM月")}</a>
        <button onClick = {nextMonth} className = "midiambutton">&gt;</button>
        <table style = {styles.tableBody}>
            <tr><th></th>
            <th ></th>
            <th style = {styles.tableCell} colSpan = "2">兄</th>
            <th style = {styles.tableCellLeftBorder} colSpan = "2" >弟</th>
            <th></th><th></th></tr>
            <tr><th style = {styles.tableCell}>日</th>
            <th style = {styles.tableCell}>曜</th>
            <th style = {styles.tableCell}>出発</th>
            <th style = {styles.tableCell}>帰宅</th>
            <th style = {styles.tableCellLeftBorder}>出発</th>
            <th style = {styles.tableCell}>帰宅</th>
            <th style = {styles.tableCell}>日</th>
            <th style = {styles.tableCell}>曜</th>
            </tr>
            {days.map((d)=>{
                const todayBroTask = broTask.filter((t)=>t.date.isSame(d))
                const todayMyTask = myTask.filter((t)=>t.date.isSame(d))
                return(
                <tr>
                    <td style = {styles.tableCell}>{d.format("D")}</td>
                    <td style = {dCss(d)}>{dayUtil.getDay(d)}</td>
                    <td style = {styles.tableCell}>{(todayBroTask.length > 0) ? TimeUtil.timeSubstruct(todayBroTask[0].start,todayBroTask[0].forgoto).disp():""}</td>
                    <td style = {styles.tableCell}>{(todayBroTask.length > 0) ? TimeUtil.timeAdd(todayBroTask[todayBroTask.length-1].end,todayBroTask[todayBroTask.length-1].forgoto).disp():""}</td>
                    <td style = {styles.tableCellLeftBorder}>{(todayMyTask.length > 0) ? TimeUtil.timeSubstruct(todayMyTask[0].start,todayMyTask[0].forgoto).disp():""}</td>
                    <td style = {styles.tableCell}>{(todayMyTask.length > 0) ? TimeUtil.timeAdd(todayMyTask[(todayMyTask.length-1)].end,todayMyTask[(todayMyTask.length-1)].forgoto).disp():""}</td>
                    <td style = {styles.tableCell}>{d.format("D")}</td>
                    <td style = {dCss(d)}>{dayUtil.getDay(d)}</td>
                </tr>)
            })}
        </table>
        </div>
        </div>
    )
}

