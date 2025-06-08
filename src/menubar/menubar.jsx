import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';

//個人日程
export default function Menubar(){
    //クラス変数*******************************
    class menuItem{
        constructor(title,url){
            this.title = title;
            this.url = url;
        }
    }
    //変数**************************************
    const [menuIsOpen,setMenuIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuTable = [
        new menuItem("今日の予定","/infom"),
        new menuItem("予定登録","/register"),
        new menuItem("週間予定","/week"),
        new menuItem("タスク検索","/serch"),
    ]
    //スタイル
    const styles = {
        menuButton:{
            height:35,
            position: "fixed", // ← 画面に固定
            top: 20,           // ← 上からの距離
            left: 20,         // ← 右からの距離
            zIndex: 1000,      // ← 前面に表示
            marginBottom:5,
        },
        menuTable:{
            position: "fixed", 
            zIndex: 1000,   
            backgroundColor: "rgba(255,255,255,0.9)",
            height:window.innerHeight,
            width:window.innerWidth/2,
        },
        menuCell:{
            margin:12,
            borderBottom:"1px solid gray",
            fontsize:"large"
        },
        upline:{
            height:6,
            borderTop:"2px solid black",
            width:25,
        },
        uplineDash:{
            height:6,
            borderTop:"2px solid black",
            width:25,
            marginTop:3,
        }
    }
    //関数定義************************************
    const menuOpen = ()=>{
        setMenuIsOpen(!(menuIsOpen))
    }
    const screenTransition = (url)=>{
        navigate(url)
    }
    //リターン文***************************************
    return(
    <div>
        {!menuIsOpen ? 
        (
            <button style = {styles.menuButton} onClick = {()=>menuOpen()}>
                <div style = {styles.uplineDash}></div>
                <div style = {styles.upline}></div>
                <div style = {styles.upline}></div>
            </button>
        )
        :(
        <div style = {styles.menuTable}>
            <button onClick = {()=>menuOpen()}>menu&lt;</button>
            {menuTable.map((theMenu)=>(
                (<div style = {styles.menuCell} onClick = {()=>screenTransition(theMenu.url)}>{theMenu.title}</div>)
            ))
            }
        </div>
    )
    }</div>
)
}