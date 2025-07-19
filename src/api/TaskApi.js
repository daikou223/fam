import axios from "axios";
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