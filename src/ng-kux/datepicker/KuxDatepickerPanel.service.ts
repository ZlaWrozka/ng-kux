import { Injectable, EventEmitter } from '@angular/core';
import { UtilService } from '../utils/util';
import { Subject } from 'rxjs/Subject';
declare let navigator: any;
class oneYear {
    public year: number
    public number: number;
    public disable: boolean;
    constructor(year, maxYear, minYear) {
        this.year = year;
        this.number = year;
        this.disable = ((maxYear && this.number > maxYear) || (minYear && this.number < minYear)) ? true : false;
    }
}
class oneDay {
    public day: number;
    public number: number;
    public isCurrMonth: boolean;
    public jump: boolean;
    public disable: boolean;
    constructor(date, old_month, jump, maxDay, minDay) {
        this.day = date.getDate();
        let m = date.getMonth() + 1, d = date.getDate();
        if (m < 10) { m = '0' + m };
        if (d < 10) { d = '0' + d };
        this.number = +`${date.getFullYear()}${m}${d}`
        this.isCurrMonth = date.getMonth() === old_month ? true : false;
        this.jump = jump;
        this.disable = ((maxDay && this.number > maxDay) || (minDay && this.number < minDay)) ? true : false;
    }
}
class oneMonth {
    public month: number;
    public number: number;
    public disable: boolean;
    constructor(date, maxMonth, minMonth) {
        this.month = date.getMonth() + 1;
        let m = date.getMonth() + 1;
        if (m < 10) { m = '0' + m };
        this.number = +`${date.getFullYear()}${m}`;
        this.disable = ((maxMonth && this.number > maxMonth) || (minMonth && this.number < minMonth)) ? true : false;
    }
}



@Injectable()
export class KuxDatepickerPanelService {
    public data: any = {};
    private date: Date;
    private today: number;
    private min: number;
    private max: number;
    private step: number;
    private maxStep: number;
    public height: Subject<number> = new Subject();
    public dateChange: Subject<Date> = new Subject();
    public fn: any = {};
    constructor(
        private util: UtilService
    ) {
        this.data = {
            days: [],
            months: [],
            years: [],
            weeks: [],
            org: null, //初始时间,
            display: null, //显示时间
            step: 0,
            today: 0,  //今天8位数字
            checked: 0 //当前选择的日期 8位数字
        }
        let language = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
        if (language.indexOf('zh') > -1) {
            this.data.weeks = ['一', '二', '三', '四', '五', '六', '日'];
        } else {
            this.data.weeks = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
        }
        this.fn.nextMonth = this.nextMonth.bind(this);
        this.fn.preMonth = this.preMonth.bind(this);
        this.fn.preYear = this.preYear.bind(this);
        this.fn.nextYear = this.nextYear.bind(this);
        this.fn.goStep = this.goStep.bind(this);
        this.fn.selectYear = this.selectYear.bind(this);
        this.fn.selectMonth = this.selectMonth.bind(this);
        this.fn.selectDay = this.selectDay.bind(this);
        this.fn.preManyYear = this.preManyYear.bind(this);
        this.fn.nextManyYear = this.nextManyYear.bind(this);
    }
    init(date, today, min, max, step) {
        this.data.display = this.handleDate(date); //显示的日期
        this.data.today = +this.util.dateFormat(this.handleDate(today), 'yyyyMMdd'); //今天
        this.initMinMax(min, max);
        this.initCheck();
        step = +step;
        switch (step) {
            case 1:
                this.maxStep = 1;
                this.initYears();
                this.setHeight();
                break;
            case 2:
                this.maxStep = 2;
                this.initMonth();
                this.setHeight();
                break;
            default:
                this.maxStep = 3;
                this.initDays(); //默认打开到选日期页
                this.setHeight();
        }
    }
    selectDay(e) {
        let day = e.target.getAttribute('data-day');
        if (day === null) {
            return null;
        }
        let jump = e.target.getAttribute('data-jump');
        if (jump === '0') {
            day = +day;
            if ((this.data.maxCheckDay && day > this.data.maxCheckDay) || (this.data.minCheckDay && day < this.data.minCheckDay)) {
                return null
            }
            let date = new Date(Math.floor(day / 10000), Math.floor(day % 10000 / 100) - 1, day % 100);
            this.data.display = date;
            this.dateChange.next(date);
            this.initCheck();
            return date;

        }
        if (jump === '1') {
            this.nextMonth()
        }
        if (jump === '-1') {
            this.preMonth()
        }
        return null;
    }
    selectMonth(e: any) { //选了月份
        let month = e.target.getAttribute('data-month');
        if (month === null) {
            return;
        }
        month = +month;
        let number
        if ((this.data.maxCheckMonth && month > this.data.maxCheckMonth) || (this.data.minCheckMonth && month < this.data.minCheckMonth)) {
            return null
        }
        month = month % 100;
        let display = this.data.display
        this.data.display = new Date(display.getFullYear(), month - 1, display.getDate());
        if (this.maxStep < 3) {
            this.initCheck();
            this.dateChange.next(this.data.display)
            return this.data.display
        } else {
            this.initDays();
        }

    }
    selectYear(e: any) { //选了年份
        let year = e.target.getAttribute('data-year');
        if (year === null) {
            return;
        }
        if ((this.data.maxCheckYear && year > this.data.maxCheckYear) || (this.data.minCheckYear && year < this.data.minCheckYear)) {
            return null
        }
        year = +year;
        let display = this.data.display
        this.data.display = new Date(year, display.getMonth(), display.getDate());
        if (this.maxStep < 2) {
            this.dateChange.next(this.data.display)
            this.initCheck();
            return this.data.display
        } else {
            this.initMonth();
        }

    }
    goStep(step) { //选 年 月 日切换
        switch (step) {
            case 1:
                this.initYears();
                this.setHeight();
                break;
            case 2:
                this.initMonth();
                this.setHeight();
                break;
            case 3:
                this.initDays();
                this.setHeight();
                break;
        }
    }
    initYears(year?) { //初始化选年份
        if (year === undefined) {
            year = this.data.display.getFullYear();
        }
        this.data.step = 1;
        this.data.years = [];
        year = year - 4;
        let y = 0;
        for (let i = 0; i < 3; i++) {
            let oneLine = []
            for (let j = 0; j < 4; j++) {
                oneLine.push(new oneYear(year + y, this.data.maxCheckYear, this.data.minCheckYear))
                y++
            }
            this.data.years.push(oneLine)
        }
        this.data.yearRange = [year, year + 11];
    }
    preManyYear() { //往前翻好几年
        this.initYears(this.data.yearRange[0] - 8);
    }
    nextManyYear() { //往后翻好几年
        this.initYears(this.data.yearRange[1] + 5);
    }
    preYear() { //往前翻一年
        let display = this.data.display;
        this.data.display = new Date(display.getFullYear() - 1, display.getMonth(), display.getDate())
        this.initMonth()
    }
    nextYear() { //往后翻一年
        let display = this.data.display;
        this.data.display = new Date(display.getFullYear() + 1, display.getMonth(), display.getDate())
        this.initMonth()
    }
    initMonth() { //初始化选月数据
        this.data.step = 2;
        this.data.months = [];
        let m = 0;
        for (let i = 0; i < 3; i++) {
            let oneLine = []
            for (let j = 0; j < 4; j++) {
                oneLine.push(new oneMonth(new Date(this.data.display.getFullYear(), m, 1), this.data.maxCheckMonth, this.data.minCheckMonth))
                m++
            }
            this.data.months.push(oneLine)
        }
    }
    nextMonth() { //上个月
        let display = this.data.display;
        this.data.display = new Date(display.getFullYear(), display.getMonth() + 1, 1);
        this.initDays()
    }
    preMonth() { //下个月
        let display = this.data.display;
        this.data.display = new Date(display.getFullYear(), display.getMonth() - 1, 1);
        this.initDays()
    }
    initDays() { //初始化选日期页
        this.data.step = 3;
        let d = this.data.display;
        let days = [];
        let year = d.getFullYear(),
            month = d.getMonth(), month_back = month,
            day = d.getDate();
        let floatDayIndex = 1, //从一号开始填充
            jumpMonth = 0,
            floatDay = new Date(year, month, floatDayIndex);
        for (let line = 0; line < 6; line++) {
            let oneWeek = new Array(7), week = floatDay.getDay();
            for (let i = 0; i < 7; i++) {
                if (week === 0) { week = 7 }
                if (week - 1 === i) { //看这个这个月第一天跟星期几能对上，对上开始填充
                    oneWeek[i] = new oneDay(floatDay, month_back, jumpMonth, this.data.maxCheckDay, this.data.minCheckDay);
                    floatDayIndex++;
                    floatDay = new Date(floatDay.getFullYear(), floatDay.getMonth(), floatDayIndex)
                    if (floatDay.getMonth() !== month) { //没填慢接着填下个月的
                        floatDayIndex = 1;
                        jumpMonth = 1
                        month = floatDay.getMonth();
                    }
                    week = floatDay.getDay();
                    if (week === 0) { week = 7 }
                }
            }
            days.push(oneWeek);
            oneWeek = new Array(7)
        }
        //填充上月空白
        let preMonthLastDayIndex = 0
        days[0].reverse();
        for (let i = 0; i < 7; i++) {
            if (!days[0][i]) {
                days[0][i] = new oneDay(new Date(year, month_back, preMonthLastDayIndex), month_back, -1, this.data.maxCheckDay, this.data.minCheckDay);
                preMonthLastDayIndex--;
            }
        }
        days[0].reverse();
        this.data.days = days;
    }
    initCheck() {
        this.data.checkedDay = +this.util.dateFormat(this.data.display, 'yyyyMMdd'); //当前选中哪年哪月那日
        this.data.checkedMonth = +this.util.dateFormat(this.data.display, 'yyyyMM'); //当前选中哪年哪月
        this.data.checkedYear = +this.util.dateFormat(this.data.display, 'yyyy'); //当前选中哪年
    }
    initMinMax(min, max) {
        let reset = false;
        if (min) {
            this.data.minCheckDay = +(this.util.dateFormat(this.handleDate(min), 'yyyyMMdd'));
            this.data.minCheckMonth = Math.floor(this.data.minCheckDay / 100);
            this.data.minCheckYear = Math.floor(this.data.minCheckDay / 10000);
            reset = true;
        }
        if (max) {
            this.data.maxCheckDay = +this.util.dateFormat(this.handleDate(max), 'yyyyMMdd');
            this.data.maxCheckMonth = Math.floor(this.data.maxCheckDay / 100);
            this.data.maxCheckYear = Math.floor(this.data.maxCheckDay / 10000);
            reset = true;
        }
        return reset;
    }
    handleDate(date: any) {
        let d;
        if (date instanceof Date) {
            d = date;
        } else if (typeof date === 'number') {
            d = new Date(date)
        } else {
            d = new Date();
        }
        return d;
    }
    setHeight() {
        let h = 151.5;
        if (this.data.step === 3) {
            h = 264;
        }
        this.height.next(h);
    }
}