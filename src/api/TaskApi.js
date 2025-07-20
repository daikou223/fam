import axios from "axios";
import dayjs from "dayjs";
//タスクのアップデート
export function update(name,goto,start,end,memo,ids,isHome){
    axios.put(
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
export function dltApi(ids){
    axios.delete(
        `https://fam-api-psi.vercel.app/api/tasks/${ids.join(",")}`
    ).then(
        response=>{
            console.log('delete成功');
            return response
        }
    )
}
//タスクの取得
export async function getTask(){
    if(localStorage.getItem("task") && localStorage.getItem("date") && dayjs(localStorage.getItem("date")).diff(dayjs(),"hour",true) > -1){
        let result = JSON.parse(localStorage.getItem("task"));
        localStorage.setItem("date",dayjs().toISOString())
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