import { useState } from "react"
import FormItem from "./FormItem"

export default function Form({renderItems,title,buttonDatas}){
    return(
        <div>
            <div style = {styles.title}>{title}</div>
            {renderItems.map((item)=>{
                return(<FormItem item = {item}/>)
            }
            )}
            <div style = {styles.buttonWrapper}>
            {buttonDatas.map((buttonData)=>{
                return(<Button buttonData = {buttonData}/>)
                })}
            </div>
        </div>
    )
}

function Button(
    {buttonData}
){
    const [buttonDisable,setButtonDisable] = useState(false)
    async function buttonClick(){
        setButtonDisable(true)
        await buttonData.click()
        setButtonDisable(false)
    }
    return(
        <button style = {styles.button} onClick = {buttonClick} disabled = {buttonDisable}>
            {buttonData.text}</button>
    )
}

const styles = {
    title:{
        padding:"3px",
        backgroundColor:"gray",
    },
    button:{
        marginTop:"10px", 
        width:"60%",
        height:"45px"
    },
    buttonWrapper:{
        textAlign:"center"
    }
}