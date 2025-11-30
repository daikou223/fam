import React,{useEffect,useState,useRef} from 'react';
import Time from '../class/Time';

export default function timeSelector(props){

    return (
        <div>
            <select name="stg">
            <option value="1">hogehoge</option>
            <option value="2">fugafuga</option>
            <option value="3" selected>piyopiyo</option>
        </select>時
        </div>
    )
}