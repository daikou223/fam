import React,{useEffect,useState} from 'react';
import axios from "axios";
import { createBrowserRouter, RouterProvider,useNavigate,useLocation,useParams} from 'react-router-dom';
import styles from "./style.module.css"

//個人日程
export default function Menubar(props){
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
    const isActive = !(props.isActive) ?? true
    const setCousion = props.setCousion ??     function(){}
    const id = localStorage.getItem("id")
    const menuTable = [
        new menuItem("今日の予定","/infom"),
        new menuItem("予定登録","/register"),
        new menuItem("タスク検索","/serch"),
        new menuItem("印刷用メニュー","/div")
    ]
    if(id == 2){
      menuTable.push(new menuItem("仕事登録画面","/bro"))
    }
    //関数定義************************************
    const menuOpen = ()=>{
      setMenuIsOpen(true)
    }
    const menuClose = ()=>{
      setMenuIsOpen(false)
    }
    const screenTransition = (url)=>{
        navigate(url)
    }
    const handleClick = () => {
        if (isActive) {
            menuOpen();
        } else {
            setCousion(
            "読み込み中のため、前回読み込んだ情報を表示しています\n!!!ボタンは読み込み中のため使用できません!!!"
            );
        }
    };
    //リターン文***************************************
    return (
  <div className={styles.menuberWarraper}>
    {!menuIsOpen ? (
      <>
        <button
          className={isActive ? styles.menuButton : styles.menuNonActiveButton}
          onClick={handleClick}
        >
          <div className={styles.uplineDash}></div>
          <div className={styles.upline}></div>
          <div className={styles.upline}></div>
        </button>
      </>
    ) : (<></>)}
    {menuIsOpen && (
      <div
        className={styles.overlay}
          onClick={menuClose}
      ></div>
    )}
    <div className={`${styles.menuTable} ${menuIsOpen ? styles.menuOpen : ""}`}>
    <button onClick={menuClose}>menu&lt;</button>
    {menuTable.map((theMenu) => (
        <div
        key={theMenu.url}
        className={styles.menuCell}
        onClick={() => screenTransition(theMenu.url)}
        >
        {theMenu.title}
        </div>
    ))}
    </div>
  </div>
);

}