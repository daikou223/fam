import axios from "axios";
import dayjs from "dayjs";
//タスクのアップデート
export async function update(name,goto,start,end,memo,ids,isHome){
    await axios.put(
        'https://fam-api-psi.vercel.app/api/tasks',
        {
            taskname:name,
            forgoto:goto,
            start:start,
            end:end,
            memo:memo,
            taskids:ids,
            isHome:isHome
        }
    ).then(
        response=>{
            console.log('post成功');
            return response
        }
    )
}
//削除Api
export async function dltApi(ids){
    await axios.delete(
        `https://fam-api-psi.vercel.app/api/tasks/${ids.join(",")}`
    ).then(
        response=>{
            console.log('delete成功');
            localStorage.removeItem("task")
            return response
        }
    )
}
//タスクの取得
export async function getTask(){
    if(localStorage.getItem("task") && localStorage.getItem("date") && dayjs(localStorage.getItem("date")).diff(dayjs(),"hour",true) > -1){
        let result = JSON.parse(localStorage.getItem("task"));
        return result
    }
    const response = await axios
      .get(`https://fam-api-psi.vercel.app/api/tasks`)             //リクエストを飛ばすpath
      .catch((error) => {
        throw new Error('タスク取得エラー',error);
    });  
    localStorage.setItem("date",dayjs().toISOString())
    localStorage.setItem("task",JSON.stringify(response.data))
    return response.data
}
//タスクの登録
export async function postTask(id,name,gototime,date,start,end,memo,home){
    await axios.post(
        'https://fam-api-psi.vercel.app/api/tasks',
        {userid:id,
        taskname:name,
        forgoto:gototime+":00",
        date:date,
        start:start+":00",
        end:end+":00",
        memo:memo,
        isHome:home
        }
    ).catch((error)=>{
        throw new Error('タスク保存エラー',error)
    })
}