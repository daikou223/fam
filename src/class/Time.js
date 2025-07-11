export default class Time{
    hour
    minute
    second
    constructor(hour,minute,second){
        hour = Number(hour)
        minute = Number(minute)
        second = Number(second)
        minute += Math.floor(second/60)
        second = second%60;
        hour += Math.floor(minute/60)
        minute = minute%60
        this.hour = Number(hour);
        this.minute = minute;
        this.second = second
    };
    toSeconds() {
        return Number(this.hour) * 3600 + Number(this.minute) * 60 + Number(this.second);
    }
    disp(){
        return `${String(this.hour).padStart(2,'0')}:${String(this.minute).padStart(2,'0')}`
    }
}
export function timeSubstruct(ourTime,otherTime){
        if(ourTime.toSeconds() === (new Time(0,0,0)).toSeconds()){
            return new Time(0,0,0);
        }
        let diffsec = (ourTime.toSeconds()-otherTime.toSeconds())%(24*60*60);
        const hour = Math.floor( diffsec/ 3600);
        const minute = Math.floor((diffsec % 3600) / 60);
        const second = diffsec % 60;
        return new Time(hour,minute,second)
}
export function timeAdd(ourTime,otherTime){
    if(ourTime.toSeconds() === (new Time(23,59,59)).toSeconds() || ourTime.toSeconds() === (new Time(23,59,0)).toSeconds()){
        return new Time(23,59,59);
    }
    const addsec = (ourTime.toSeconds()+otherTime.toSeconds());
    const hour = Math.floor( addsec/ 3600);
    const minute = Math.floor((addsec % 3600) / 60);
    const second = addsec % 60;
    return new Time(hour,minute,second)
}
export function StoTime(TimeString){
    const [hour,minute,second] = TimeString.split(":");
    return new Time(hour,minute,second);
}