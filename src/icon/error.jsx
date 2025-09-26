import React,{useEffect,useState} from 'react';

export default function ErrorIcon(props){
    //本来ならここpropsに
    const size = props.size
    //スタイル定義********************************
    const styles = {
        full:{
            width:size,
            height:size/2*Math.sqrt(3)*1.08,
            fill: "none",
            display: "block",
            marginRight:4
        }
    }
    return(
        <svg style = {styles.full}>
        <path d={`M ${size*0.9} ${size/2*Math.sqrt(3)}
          L ${size*0.2} ${size/2*Math.sqrt(3)}
          S 0 ${size/2*Math.sqrt(3)} ${size*0.1} ${size/2*Math.sqrt(3)*0.8}
          L ${size*0.4} ${size/2*Math.sqrt(3)*0.2}
          S ${size*0.5} 0 ${size*0.6} ${size/2*Math.sqrt(3)*0.2}
          L ${size*0.9} ${size/2*Math.sqrt(3)*0.8}
          S ${size} ${size/2*Math.sqrt(3)} ${size*0.8} ${size/2*Math.sqrt(3)}
          `} fill="red"
          stroke="black" 
  stroke-width={size*0.04}   />
  <ellipse cx={size*0.5} cy={size*0.4} rx={size*0.05} ry={size*0.1*Math.sqrt(3)} fill="black"/>
  <circle cx={size*0.5} cy={size/2*Math.sqrt(3)*0.8} r={size*0.05} fill="black" />
        </svg>
    )
}