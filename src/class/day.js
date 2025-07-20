import dayjs from 'dayjs';
//const dayjs = require("dayjs") //テストのときはこっち

//一日前のdayjsオブジェクトを返す
function getYestaday(day){
    return day.add(-1,"day")
};

//一日前のdayjsオブジェクトを返す
function getTomorrow(day){
    return day.add(1,"day")
};

//今日の日付を取得
function getToday(){
    return dayjs()
}

//YYYY-MM-DD(M-D) or MM-DD(M-D) or YYYY-MM-DD T hh:mm:dd Z
function stringToDate(stringDate){
    const dateString = stringDate.split("T")
    const splitedStringDate = dateString[0].split("-")
    if(splitedStringDate.includes("")){
        throw new Error("string日付形式エラー");
    }else if(splitedStringDate.length == 2){
        const year = Number(dayjs().format('YYYY'))
        const month = Number(splitedStringDate[0])
        const day = Number(splitedStringDate[1])
        return dayjs(new Date(year, month - 1, day));
    }else if(splitedStringDate.length == 3){
        const year = Number(splitedStringDate[0])
        const month = Number(splitedStringDate[1])
        const day = Number(splitedStringDate[2])
        return dayjs(new Date(year, month - 1, day));
    }else{
        throw new Error("string日付形式エラー");
    }
}

function dateToString(date){
    return date.format("YYYY-MM-DD")
}

function dateDisplay(date){
    return date.format("MM月DD日")
}

function dateFullDisplay(date){
    return date.format("YYYY年M月D日")
}

function getDay(date){
    const days = ["日","月","火","水","木","金","土"];
    return days[date.format("d")]
}

function getDDDay(date){
    const days = ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"];
    return days[date.format("d")]
}

function testFunc(){
    const testDate = stringToDate("2025-10-16T14:08:00Z")
    console.log(testDate)
    console.log(getTomorrow(testDate))
    console.log(getYestaday(testDate))
    console.log(getToday())
    console.log(dateToString(testDate))
    console.log(dateDisplay(testDate))
    console.log(dateFullDisplay(testDate))
    console.log(getDay(testDate))
    console.log(getDay(getToday()))
    console.log(getDDDay(getToday()))
}

//testFunc()
export {getYestaday,getTomorrow,getToday,stringToDate,dateToString,dateDisplay,dateFullDisplay,getDay,getDDDay}