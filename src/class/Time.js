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
        if(this.hour < 0){
            return "00:00"
        }
        else if(this.hour > 23){
            return "24:00"
        }
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
    const timelist = TimeString.split(":");
    const hour = timelist?.[0] ?? 0
    const minute = timelist?.[1] ?? 0
    const second = timelist?.[2] ?? 0
    return new Time(hour,minute,second);
}
export function timeCollapse(start1,end1,start2,end2){
    const deffs1e2 = timeSubstruct(end1,start2).toSeconds() 
    const deffs2e1 = timeSubstruct(end2,start1).toSeconds() 
    return deffs1e2 * deffs2e1 >= 0
}

export function secondToTime(second){
    const hour = Math.floor(second/3600)
    const minute = Math.floor(second%3600/60)
    const seconds = second%60
    return new Time(hour,minute,seconds)
}
