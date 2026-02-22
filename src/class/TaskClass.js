import * as TimeUtil from "./Time"
import dayjs, { Dayjs } from 'dayjs';
import * as ApiUtil from "./../api/TaskApi"
import * as dayUtil from "./day"

async function initialized(mode = "") {
    const tasksList = await ApiUtil.getTask(mode);
    return formater(tasksList)
}

export function formater(Data){
    const FullTask = new TaskList()
    Data.map((atask)=>{
            FullTask.tasksOnlyId.push(atask.task_id)
            FullTask.tasks.push(new task(
                atask.date,
                atask.end,
                atask.forgoto,
                atask.isHome,
                atask.memo,
                atask.start,
                atask.task_id,
                atask.user_id,
                atask.taskname
            ))
            FullTask.idToTask[atask.task_id] = new task(
                atask.date,
                atask.end,
                atask.forgoto,
                atask.isHome,
                atask.memo,
                atask.start,
                atask.task_id,
                atask.user_id,
                atask.taskname
            )
        })
    return FullTask
}

export default class TaskList{
    tasksOnlyId
    tasks
    idToTask
    constructor(){
        this.tasksOnlyId = []
        this.tasks = []
        this.idToTask = {}
    }
}

class task{
    date
    end
    forgoto
    isHome
    memo
    start
    id
    user_id
    name
    constructor(date,end,forgoto,isHome,memo,start,id,user_id,name){
        this.date = dayUtil.stringToDate(date)
        this.end = TimeUtil.StoTime(end)
        this.forgoto = TimeUtil.StoTime(forgoto)
        this.isHome = isHome
        this.memo = memo
        this.start = TimeUtil.StoTime(start)
        this.id = id
        this.user_id = user_id
        this.name = name
        this.goOutTime = TimeUtil.secondToTime(this.start.toSeconds()-this.forgoto.toSeconds()) 
        this.goHomeTime = TimeUtil.secondToTime(this.end.toSeconds()+this.forgoto.toSeconds()) 
    }
}

export async function getSameTask(name,date){
    const fullTask = await initialized()
    const SameTask_ = []
    fullTask.tasks.map((task)=>{
        if(task.name === name && (date.isBefore(task.date) ||date.isSame(task.date)  )){
            SameTask_.push(task.id)
        }
    })
    return SameTask_
}

export async function getCollapse(date,start,end,user_id){
    const fullTask = await initialized()
    let CollapseTask_ = []
    fullTask.tasks.map((atask)=>{
        if(atask.date.isSame(date,"day") && atask.user_id == user_id){
            const isCollapse = TimeUtil.timeCollapse(atask.start,atask.end,start,end)
            if(isCollapse){
                CollapseTask_.push(atask)
            }
        }
    })
    return CollapseTask_
}

export async function getTaskDetails(id){
    const fullTask =await initialized()
    return fullTask.idToTask[id]
}

export async function getTaskOnlyId(){
    const FullTask = await initialized()
    return FullTask.tasksOnlyId
}

export async function getTask(mode = ""){
    const FullTask = await initialized(mode)
    if(FullTask){
        FullTask.tasks.sort((task1,task2)=>{
            if(task1.date.isAfter(task2.date)){
                return 1
            }else if(task1.date.isBefore(task2.date)){
                return -1
            }else{
                return task1.start.toSeconds()-task2.start.toSeconds()
            }
        })
    }
    return FullTask?.tasks
}

export async function getMonthTask(date = dayjs()){
    const fullTask = await getTask()
    const startDate = dayUtil.getFirstday(date)
    const endDate = dayUtil.getFinalday(date)
    return fullTask.filter((t) => {
        const isAfter = t.date.isAfter(startDate) || t.date.isSame(startDate)
        const isBefore = t.date.isBefore(endDate) || t.date.isSame(endDate)
        return isAfter && isBefore
    })
}

export async function getTaskWithConditions(user,date){
    const FullTask = await initialized()
    if(FullTask){
        FullTask.tasks.sort((task1,task2)=>{
            if(task1.date.isAfter(task2.date)){
                return 1
            }else if(task1.date.isBefore(task2.date)){
                return -1
            }else{
                return task1.start.toSeconds()-task2.start.toSeconds()
            }
        })
    }
    return FullTask.tasks.filter((task)=>{
        return task.user_id === user && task.date.isSame(date,"day") && task.isHome === 1
    })
}

export async function getTaskWithId(id){
    const FullTask = await initialized()
    return FullTask.idToTask?.[id]
}