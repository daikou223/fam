import FormItem from "./FormItem"

export default function Form({renderItems,title,buttonData}){
    return(
        <div>
            <div style = {styles.title}>{title}</div>
            {renderItems.map((item)=>{
                return(<FormItem item = {item}/>)
            }
            )}
            <div style = {styles.buttonWrapper}>
            <button style = {styles.button} onClick = {buttonData.click}>{buttonData.text}</button>
            </div>
        </div>
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