import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

    constructor() { }
    dateFormat(d: Date, fmt) {
        if (d instanceof Date) {
            var o = {
                "M+": d.getMonth() + 1, //month
                "d+": d.getDate(), //day
                "h+": d.getHours(), //hour
                "m+": d.getMinutes(), //minute
                "s+": d.getSeconds(), //second
                "q+": Math.floor((d.getMonth() + 3) / 3), //quarter
                "S": d.getMilliseconds() //millisecond 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        } else {
            return null;
        }

    }
}