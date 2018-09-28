import Vue from 'vue'

function addZero(val) {
    if (val < 10) {
        return "0" + val;
    } else {
        return val;
    }
}

Vue.filter("formatTime", (value, type) => {
    let dataTime = "-"

    if (value) {
        let data = new Date();
        data.setTime(value);

        let year = data.getFullYear(),
            month = addZero(data.getMonth() + 1),
            day = addZero(data.getDate()),
            hour = addZero(data.getHours()),
            minute = addZero(data.getMinutes()),
            second = addZero(data.getSeconds());

        if (type == "YMD") {
            dataTime = `${year}-${month}-${day}`
        } else if (type == "YMDHMS") {
            dataTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
        } else if (type == "HMS") {
            dataTime = `${hour}:${minute}:${second}`;
        } else {
            dataTime = `${year}-${month}-${day}`
        };
    }
    return dataTime;
})

Vue.filter("timeCount", (value, type) => {
    let dataTime = "";

    if (value) {
        let data = new Date(value).getTime();
        let day = Math.floor(data / 86400),
            hour = Math.floor(data % 86400 / 3600),
            fullHour = day * 24 + hour,
            minute = Math.floor(data % 86400 % 3600 / 60),
            second = Math.floor(data % 86400 % 3600 % 60);

        if (type == "HMS") {
            dataTime = `${addZero(fullHour)}:${addZero(minute)}:${addZero(second)}`
        } else {
            if (day > 0) {
                dataTime = `${day}天${hour}小时`
            } else if (day == 0 && hour > 0) {
                dataTime = `${hour}小时${minute}分`
            } else {
                dataTime = `${minute}分${second}秒`
            }
        }
    }

    return dataTime
})

Vue.filter("remainTime", (value, type) => {
    let dataTime = "0";
    if (value && value>0) {
        let data = value/1;
        let day = Math.floor(data / 86400),
        hour = Math.floor(data % 86400 / 3600),
        fullHour = day * 24 + hour,
        minute = Math.floor(data % 86400 % 3600 / 60),
        second = Math.floor(data % 86400 % 3600 % 60);
        if (day > 0) {
            dataTime = `${day}天${hour}小时`
            if(minute>0){
                dataTime = `${day}天${hour}小时${minute}分`
            }
            if (second>0) {
                dataTime = `${day}天${hour}小时${minute}分${second}秒`
            }
        } else if (day == 0 && hour > 0) {
            dataTime = `${hour}小时${minute}分`
        } else {
            dataTime = `${minute}分${second}秒`
        }
    }
    return dataTime
})


Vue.filter("subStrBankNo", (value,noBegin) => {
    let v = '', end='';
    let fillStar=(num)=>{
        let arr=[];
        for(let i=0;i<num;i++){
            if (i % 4 === 0) {arr.push(' ')};
            arr.push('*');
        };
        return arr.join('') + ' '
    };
    if (value) {
        v = value + '';
        let len=v.length;
        end = v.substr(v.length - 4, 4);
        v = `${fillStar(len-4)}${end}`
    };
    return v
})

Vue.filter("subStrMobile", (value) => {
    let v = '';
    if (value) {
        v = value + '';
        let start = v.substr(0, 3);
        let end = v.substr(v.length - 4, 4);
        v = `${start}****${end}`
    };
    return v
})

Vue.filter("keepTwoPoints", (value) => {
    let toFixedNum = Number(value).toFixed(3);
    let num = toFixedNum.substring(0, toFixedNum.toString().length - 1);
    return num;
});

Vue.filter("toDoubleThousands", (value) => {
    if (value=='-'){
        return '-'
    }else{
        let v = '0.00';
        if (value || value == 0) {
            let a = parseFloat(value).toFixed(3);
            v = a.substring(0, a.indexOf('.') + 3);
            v = v.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
                return $1 + ",";
            })
        };
        return v
    }
});

