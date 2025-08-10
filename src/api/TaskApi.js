import axios from "axios";
import dayjs from "dayjs";
//タスクのアップデート
export async function update(name,goto,start,end,memo,ids,isHome){
    if(!localStorage.getItem("debug")){
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
    }else{
        await axios.put(
            'https://fam-api-psi.vercel.app/api/debug/tasks',
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
}
//削除Api
export async function dltApi(ids){
    if(!localStorage.getItem("debug")){
        await axios.delete(
            `https://fam-api-psi.vercel.app/api/tasks/${ids.join(",")}`
        ).then(
            response=>{
                console.log('delete成功');
                localStorage.removeItem("task")
                return response
            }
        )
    }else{
        await axios.delete(
            `https://fam-api-psi.vercel.app/api/debug/tasks/${ids.join(",")}`
        ).then(
            response=>{
                console.log('delete成功');
                localStorage.removeItem("task")
                return response
            }
        )
    }
}
//タスクの取得
export async function getTask(mode = ""){
    if(localStorage.getItem("task") && mode == ""){
        let result = JSON.parse(localStorage.getItem("task"));
        return result
    }
    if(!localStorage.getItem("debug")){
        const response = await axios
        .get(`https://fam-api-psi.vercel.app/api/tasks`)             //リクエストを飛ばすpath
        .catch((error) => {
            throw new Error('タスク取得エラー',error);
        });  
        localStorage.setItem("date",dayjs().toISOString())
        localStorage.setItem("task",JSON.stringify(response.data))
        return response.data
    }else{
        const response = await axios
        .get(`https://fam-api-psi.vercel.app/api/debug/tasks`)             //リクエストを飛ばすpath
        .catch((error) => {
            throw new Error('タスク取得エラー',error);
        });  
        localStorage.setItem("date",dayjs().toISOString())
        localStorage.setItem("task",JSON.stringify(response.data))
        return response.data
    }
}
//タスクの登録
export async function postTask(values){
    if(!localStorage.getItem("debug")){
        await axios.post(
            'https://fam-api-psi.vercel.app/api/month',
            {values:values
            }
        ).catch((error)=>{
            throw new Error('タスク保存エラー',error)
        })
    }else{
        await axios.post(
            'https://fam-api-psi.vercel.app/api/debug/month',
            {values:values
            }
        ).catch((error)=>{
            throw new Error('タスク保存エラー',error)
        })
    }
}