import Time,{timeSubstruct,timeAdd,StoTime,timeCollapse} from "./Time"
import dayjs from 'dayjs';

export default class TaskList{
    tasks
    idToTask
    constructor(tasksList){
        this.tasks = []
        this.idToTask = {}
        tasksList.map((atask)=>{
            this.tasks.push(new task(
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
            this.idToTask[atask.task_id] = new task(
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
        this.date = dayjs(date.split("T")[0])
        this.end = StoTime(end)
        this.forgoto = StoTime(forgoto)
        this.isHome = isHome
        this.memo = memo
        this.start = StoTime(start)
        this.id = id
        this.user_id = user_id
        this.name = name
    }
}
/* date:"2025-03-06T00:00:00.000Z"end:"23:59:00"forgoto:"01:15:00"isHome:1
memo:""start:"20:30:00"task_id:811taskname:"夜勤仕事"user_id:2 */
export function getSameTask(name,date){
    const fullTask = new TaskList(JSON.parse(localStorage.getItem("task")))
    const SameTask_ = []
    fullTask.tasks.map((task)=>{
        if(task.name === name && date <= task.date){
            SameTask_.push(task.id)
        }
    })
    return SameTask_
}

export function getCollapse(date,start,end,user_id){
    const fullTask = new TaskList(JSON.parse(localStorage.getItem("task")))
    let CollapseTask_ = []
    fullTask.tasks.map((atask)=>{
        console.log(atask.name,atask.date.isSame(date,"day"), atask.user_id,user_id)
        if(atask.date.isSame(date,"day") && atask.user_id == user_id){
            const isCollapse = timeCollapse(atask.start,atask.end,start,end)
            if(isCollapse){
                CollapseTask_.push(atask.id)
            }
        }
    })
    return CollapseTask_
}

export function getTaskDetails(id){
    const fullTask = new TaskList(JSON.parse(localStorage.getItem("task")))
    return fullTask.idToTask[id]
}