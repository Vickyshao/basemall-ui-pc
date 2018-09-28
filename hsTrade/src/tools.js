import Vue from 'vue'

function addZero(val) {
    if (val < 10) {
        return "0" + val;
    } else {
        return val;
    }
};

const tools = {
    formatDateTime(row){
        let data = new Date();
        data.setTime(row);
        let year = data.getFullYear(),
            month = addZero(data.getMonth() + 1),
            day = addZero(data.getDate()),
            hour = addZero(data.getHours()),
            minute = addZero(data.getMinutes()),
            second = addZero(data.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    formatDate(row) {
        let data = new Date();
        data.setTime(row);
        let year = data.getFullYear(),
            month = addZero(data.getMonth() + 1),
            day = addZero(data.getDate());
        return `${year}-${month}-${day}`
    },
    formatQueryParam(data){
        let arr=[], str='';
        if(data instanceof Object){
            for(let k in data){
                arr.push(`${k}=${data[k]}`)
            };
            str='?'+arr.join('&')
        };
        return str
    }
}

Vue.prototype.tools = tools