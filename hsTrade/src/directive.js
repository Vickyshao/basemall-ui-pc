import Vue from 'vue'

const $=el=>document.querySelector(el);

Vue.directive('nodata', {
    update(el, binding) {
        var isIE;
        var ele = $('.nodataDirective');
        //判断是否IE浏览器
        // var navigatorName = "Microsoft Internet Explorer"
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            isIE = true
        } else {
            isIE = false
        };
        if (binding.value) {
            if (ele) {
                if (isIE){
                    ele.parentNode.removeChild(ele)
                }else{
                    ele.remove(ele)
                }
            };
            let d = document.createElement('div');
            d.className = `nodataDirective`;
            d.innerText = `暂无数据`;
            d.style.cssText = `
                width:100%;
                height:50px;
                line-height:50px;
                font-size:14px;
                color:#999;
                text-align:center;
                border:1px solid #ebebeb;
                border-top:none;
                box-sizing:border-box;
            `;
            el.appendChild(d)
        } else {
            if (ele) {
                if (isIE) {
                    ele.parentNode.removeChild(ele)
                } else {
                    ele.remove(ele)
                }
            }
        }
    }
})
