import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.css"

function Regist(){
    const [registState,setRegistState] = useState("登録");
    const [date,setDate] = useState(new Date());
    const [dateLabel,setDateLabel] = useState("日付");
    const [isBulk,setBulk] = useState(false);
    const [endDate,setEndDate] = useState("");
    const [oziStartDate,setOziStartDate] = useState(null);
    const [views,setViews] = useState([]);
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    console.log(date);
    function toDate(dateString){
      const seprate = dateString.split(/[T-]/);
      return new Date(Number(seprate[0]),Number(seprate[1])-1,Number(seprate[2]));
    }
    function isBigDate(date1,date2){
      var year1 = date1.getFullYear();
      var month1 = date1.getMonth() + 1;
      var day1 = date1.getDate();
      var year2 = date2.getFullYear();
      var month2= date2.getMonth() + 1;
      var day2 = date2.getDate();
      if (year1 == year2) {
          if (month1 == month2) {
              return day1 < day2;
          }
          else {
              return month1 < month2;
          }
      } else {
          return year1 < year2;
      }
    }
    useEffect(()=>{
      document.getElementById("name").value = "用事";
      document.getElementById("starttime").value = "00:00";
      document.getElementById("endtime").value = "23:59";
      document.getElementById("gototime").value = "00:00";
      document.getElementById("memo").value = "";
      axios
      .get(`https://fam-api-psi.vercel.app/api/tasks`)             //リクエストを飛ばすpath
      .then(response => {
        let allTasks = response.data;
        //日付ごとに分配するためのdict
        let oziDate = new Date();
        allTasks.map((task)=>{
         if(task.userid == 4){
          if(isBigDate(oziDate,toDate(task.date))){
            oziDate = toDate(task.date);
          }
        }
        })
        setOziStartDate(oziDate);
      })                               //成功した場合、postsを更新する（then）
      .catch((error) => {
          console.log('通信に失敗しました',error);
      });  
    },[])
    function taskRegist(){
      setRegistState("登録中");
      const button = document.getElementById("regist");
      button.disabled = true;
      const name = document.getElementById("name").value || "用事";
      const start = document.getElementById("starttime").value || "00:00";
      const end = document.getElementById("endtime").value || "23:59";
      const gototime = document.getElementById("gototime").value || "0:00";
      const memo = document.getElementById("memo").value || "めもなし";

      console.log(id,date,name,start,end,gototime,memo);
      if(!(isBulk)){
        axios.post(
          'https://fam-api-psi.vercel.app/api/tasks',
          {userid:id,
            taskname:name,
            forgoto:gototime+":00",
            date:date.getFullYear()+"-"+Number(date.getMonth()+1)+"-"+date.getDate(),
            start:start+":00",
            end:end+":00",
            memo:memo
        }
        ).then(()=>{
        navigate(`/infom`)
        }
        );
      }else{
        let finishDate = new Date(date.getFullYear(),date.getMonth()+3,date.getDate())
        let registDate = new Date(date.getFullYear(),date.getMonth(),date.getDate())
        let querys = [];
        let paramses = [];
        while(registDate < finishDate){
          querys.push("INSERT INTO `task`(`user_id`, `taskname`, `forgoto`, `date`, `start`, `end`, `memo`) VALUES (?,?,?,?,?,?,?)")
          paramses.push([id,name,gototime+":00",`${String(registDate.getFullYear()).padStart(2,'0')}-${String(registDate.getMonth()+1).padStart(2,'0')}-${String(registDate.getDate()).padStart(2,'0')}`,start+":00",end+":00",memo]);  
          registDate = new Date(registDate.getFullYear(),registDate.getMonth(),registDate.getDate()+7)
          console.log(registDate);
        }
        axios.post(`https://fam-api-psi.vercel.app/api/month`,{
          querys:querys,
          paramses:paramses
            }).then(()=>{
                console.log("成功");
                navigate(`/infom`);
            }
            ).catch((err)=>
                {
                  console.log("error",err);
                  alert('予期してないというと\n嘘になるエラーが発生しました\n開発者に問い合わせて下さい')
                }
            );
        }
      }
    function back(){
        navigate(`/infom`)
    }
    function changeDate(e){
      console.log(e.target.value);
      const [yy,mm,dd] = e.target.value.split("-");
      setDate(new Date(yy,mm-1,dd));
      if(isBulk){
      let finishDate = new Date(yy,Number(mm)+3,dd)
      setEndDate(`~終了 ${finishDate.getFullYear()}/${finishDate.getMonth()}/${finishDate.getDate()}`)
      }
    }
    function changeBulk(){
      if(isBulk){
        setBulk(false);
        setDateLabel("日付")
        setEndDate("")
      }else{
        setBulk(true);
        setDateLabel("開始")
        let finishDate = new Date(date.getFullYear(),date.getMonth()+4,date.getDate())
        setEndDate(`~終了 ${finishDate.getFullYear()}/${finishDate.getMonth()}/${finishDate.getDate()}`)
      }
    }
    if (date == null){
      return(<p>読み込み中...</p>)
    }
      return(
        <div>
          3か月一括登録:<input type = "checkbox" checked = {isBulk} onChange = {()=>changeBulk()}/><br/>
          {dateLabel}:<input type="date" id="date" value = {`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`} onChange = {(e)=>changeDate(e)}/>({["日","月","火","水","木","金","土"][date.getDay()]}曜日){endDate}<br/>
          用事名:<input type="text" id="name"/><br/>
          開始時刻 : <input type="time" id="starttime" /><br/>
          終了時刻 : <input type="time" id="endtime" /><br/>
          移動時間 : <input type="time" id="gototime"/><br/>
          メモ:<input type="text" id="memo"/><br/>
          <button className = "registWidebutton" onClick = {()=>taskRegist()} id = "regist">{registState}</button>
          <button className = "cancelWidebutton" onClick = {()=>back()}>キャンセル</button>
        </div>
      )
    }

export default Regist