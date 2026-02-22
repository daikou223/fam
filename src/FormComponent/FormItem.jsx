import {useState} from "react";
import { INPUT_TYPE_NAME } from "../const";
import * as dateUtil from "../class/day";
import Time from "../class/Time";

export default function FormItem({item}){
    const type = item.type; 
    const name = item.name;
    const state = item.state;
    const setState = item.setState;
    const disabled = item.disabled
    return(
        <div style = {createItemStyle(type,disabled)}>
        <div style = {styles.label}><div>{name}</div></div>
        {inputSwitcher(item,state,setState,type,disabled)}
        </div>
    )
}

function createItemStyle(type,disabled){
    let styleObj = {}
    if(disabled){
        styleObj = {...styleObj,...styles.indisabled}
    }
    if(type !== INPUT_TYPE_NAME.CALENDER){
        styleObj = {...styleObj,...styles.inputWrapper}
    }else{
        styleObj = {...styleObj,...styles.calenderWrapper}
    }
    return styleObj
}

function dispData(state){
    const displayDate = state.map((date) => dateUtil.dateDisplay(date))
    const displayDateNum = 3
    if(state.length > displayDateNum){
        return `${displayDate.slice(0,displayDateNum).join(",")}等 他${state.length-displayDateNum}日`
    }else if(!!state){
        return displayDate.slice(0,displayDateNum).join(",")
    }else{
        return ""
    }
}

function inputSwitcher(item,state,setState,type,disabled){
    switch(type){
        case INPUT_TYPE_NAME.TEXT:
            return(<TextForm state = {state} setState = {setState} disabled = {disabled}/>)
        case INPUT_TYPE_NAME.CHECKBOX:
            return(<CheckBox state = {state} setState = {setState} disabled = {disabled}/>)
        case INPUT_TYPE_NAME.TIME:
            return(<TimeBox state = {state} setState = {setState} disabled = {disabled}/>)
        case INPUT_TYPE_NAME.CALENDER:
            const isBulk = item?.isBulk
            const setIsBulk = item?.setIsBulk
            return(
            <Calender 
                state = {state} setState = {setState} 
                isBulk = {isBulk} setIsBulk = {setIsBulk} 
                disabled = {disabled}
            />)
    }
}

function TextForm({
    state,
    setState,
    disabled
}){
    return(
            <input 
            value = {state}
            disabled={disabled}
            onChange = {(e)=>setState(e.target.value)}
            style = {styles.inputer}
            />
    )
}

function CheckBox({
    state,
    setState,
    disabled
}){
    return(
            <input 
            type = "checkbox"
            checked = {state}
            disabled={disabled}
            onChange = {(e)=>setState(e.target.checked)}
            style = {styles.inputer}
            />
    )
}

function TimeBox({
    state,
    setState,
    disabled
}){
    const hours = [0,1,2,3,4,5,6,7,8,9,
        10,11,12,13,14,15,16,17,18,19,
        20,21,22,23,24,25,26,27,28,29,30]
     const minutes = [0,5,10,15,20,25,30,35,40,45,50,55]

    function hourDisp(num){
             if(num < 0){
                 return "\u00A0\u00A00時"
             }
             else if(num >= 24){
                 return `翌${num-24}時`
             }
             return `${num}時`
    }
    return(
        <div style = {styles.timeWrapper}>
            <select 
            style = {styles.timeInput}
            value = {state.hour}
            disabled={disabled}
            onChange = {
                (e)=>setState(
                    (prev) =>{
                return(new Time(e.target.value,prev.minute,prev.second))
                })}>
            {hours.map((h) =>{return(<option value = {h}>{hourDisp(h)}</option>)})}
            </select>
             <select
            style = {styles.timeInput}
             value = {state.minute}
             disabled={disabled}
             onChange = {
                (e)=>setState(
                    (prev) =>{
                return(new Time(prev.hour,e.target.value,prev.second))
                })}>
            {minutes.map((m) =>{return(<option value = {m}>{m.toString().padStart(2,'0')}分</option>)})}
            </select>
        </div>
    )
}

function Calender({
    state,setState,
    isBulk,setIsBulk,
    disabled
}){
    const [targetDate,setTargetDate] = useState(dateUtil.getToday());
    const calenderData = dateUtil.createCalenderData(targetDate.year(),targetDate.month()+1);
    const dispStr = dispData(state)
    return(
        <div>
            選択済み:{dispStr}
        <div style = {styles.mainCalenderWrapper}>
            {isBulk !== undefined &&
                <div style = {styles.bulkWrapper}>
                <input type ="radio" name = "Bulk" value = {true} checked = {isBulk} onChange = {()=>setIsBulk(true)}/>
                <label>一括登録する</label>
                <input 
                    type ="radio" 
                    name = "Bulk" 
                    value = {false} 
                    checked = {!(isBulk)} 
                    onChange = {()=>{
                        setIsBulk(false)
                        setState((prev) => {
                            if(!!prev){
                                return [prev[0]]
                            }else{
                                return []
                            }
                        })
                    }}
                />
                <label>一括登録しない</label>
                </div>
            }
            <div>
                <button onClick = {()=>{setTargetDate((prev)=>prev.add(-1,"month"))}}>先月 &lt; </button>
                <a className = "yyyy-mm">{targetDate.format("YYYY年M月") }</a>
                <button onClick = {()=>{setTargetDate((prev)=>prev.add(1,"month"))}}>&gt; 翌月</button>
                <table style = {styles.calender}>
                    <tr>
                        <th>月</th>
                        <th>火</th>
                        <th>水</th>
                        <th>木</th>
                        <th>金</th>
                        <th>土</th>
                        <th>日</th>
                    </tr>
                {calenderData.map((weekData) =>{
                    return(<tr>
                        {weekData.map((day)=>{
                            return(<Day day = {day} state = {state} setState = {setState} isBulk = {isBulk}/>)
                        })}
                    </tr>)
                })
                }
                </table>
            </div>
        </div>
        </div>
    )
}

function Day({
    day,state,setState,isBulk = false
}){
    if(day == null) return(<td></td>);
    return(
    <td 
    style = {!!(state.find((date)=>date.isSame(day,"day"))) ? styles.isSelected:styles.nonSelected}
    onClick = {()=>dayClick(state,setState,day,isBulk)}>
    {day.date()}
    </td>)
}

function dayClick(state,setState,day,isBulk){
    if(!!(state.find((d) => d.isSame(day,"day")))){
        setState((prev)=>prev.filter((d)=> !(d.isSame(day,"day"))))
    }else{
        setState((prev)=>{
            const newState = isBulk ? [...prev,day]:[day]
            newState.sort((a,b) => a.diff(b))
            return newState
        })
    }
}

const styles = {
    inputWrapper:{
        width:"100%",
        display:"flex",
        paddingTop:"10px",
        paddingBottom:"10px",
        paddingRight:"5px",
        paddingLeft:"10px",
        borderBottom:"1px gray solid",
        margin:0,
    },
    calenderWrapper:{
        width:"100%",
        paddingTop:"10px",
        paddingBottom:"10px",
        paddingRight:"5px",
        paddingLeft:"10px",
        borderBottom:"1px gray solid",
        margin:0,
    },
    label:{
        width:"50%",
        display:"flex"
    },
    inputer:{
        width:"40%",
        border:"none",
        borderBottom:"2px black solid",
    },
    timeInput:{
        width:"45%",
        height:"20px",
    },
    timeWrapper:{
        width:"50%"
    },
    bulkWrapper:{
    },
    mainCalenderWrapper:{
        textAlign:"center",
    },
    calender:{
        margin:"auto",
        width:"80%",
    },
    dataDisp:{},
    isSelected:{
        height:"26px",
        backgroundColor:"yellow",
        border:"2px solid black",
        boxSizing: "border-box",
    },
    nonSelected:{
        height:"26px",
    },
    indisabled:{
        backgroundColor:"gray"
    }
}