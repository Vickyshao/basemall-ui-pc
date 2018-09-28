# 沪深商贸前端项目

## 项目启动
``` bash
git clone http://172.16.1.88/zhangjinguang/basemall-ui-pc.git
cd basemall-ui-pc
cd hsTrade

# 安装开发工具包
npm install

# 启动项目（浏览器打开：localhost:3000）
npm run dev

# 打包项目
npm run build
```

## 项目介绍
### 目录结构
``` bash
|- build/             #打包配置文件目录
|- config/            #打包配置文件目录
|- dist/              #打包后文件目录（不提交，copy到另外仓库）
|- node_modules/ 
|- src/               #项目文件
    |- assets/        #开发资源目录
    |- components/    #vue组件目录
    |- less/          #less文件存放目录
    |- router/        #路由目录
    |- ajax.js        #封装全局$ajax请求方法，基于axios
    |- App.vue        #根组件
    |- directive.js   #封装全局指令
    |- filter.js      #封装全局过滤器
    |- main.js        #入口js
    |- mock.js        #模拟数据js
    |- store.js       #引入Vuex
    |- tools.js       #封装全局工具
    |- ui.js          #引入elementUI及全局样式
|- static/            #静态资源目录（图片文件必须放于此目录下，否则打包后会出现引用错误）
|- test/              #测试打包目录
|- .babelrc           #babel配置文件
|- .editorconfig      #编辑器配置文件
|- .gitignore         #git忽略提交配置文件
|- .postcssrc.js      #postcss配置文件
|- .index.html        #入口html（无需改动）
|- .package.json
|- .package-lock.json
|- .README.md         #说明文件（即本文件）
```

### 说明
#### 入口js
> main.js

``` javascript
import 'babel-polyfill' //解决ie对es6部分语法不兼容
import Vue from 'vue'
import App from './App'
import router from './router/' //引入路由配置
import store from './store' //vuex仓库
import './ui' //elementUI及全局样式

import 'jquery'

import filter from './filter' //引入全局封装过滤器
import directive from './directive' //引入全局封装指令
import tools from './tools' //引入全局封装工具方法
import $ajax from './ajax' //引入全局封装$ajax方法

Vue.prototype.$ajax = new $ajax() //将全局封装$ajax方法挂载到Vue实例下

Vue.config.productionTip = false //关闭生产模式下给出的提示

new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    this.$ajax.V=this //此句为解决ajax中this的指向问题
  }
}).$mount('#app')
```

#### 路由
> router/index.js

``` javascript
//路由配置

import Vue from 'vue'
import VueRouter from 'vue-router'
import alias from './alias'
Vue.use(VueRouter);

export default new VueRouter({ routes:alias })
```

> router/alias.js

``` javascript
//import路由文件，并在export default[]中导出，供同目录下index.js使用

import home from './home'

export default [
	home
];
```

#### 请求
> ajax.js

``` javascript
import axios from 'axios'

export default class $ajax{
	constructor(){
		this.V=null //Vue实例，在main.js中重新赋值
	}

	// 根据环境自动填充接口前缀(域名/ip)
	replaceUrl(url){
		let localDomain = '';
		let who=localStorage.who||null; //本地缓存中存放who字段，下面注释中的编号即对应相应的接口环境

		/**
		 * @param who:number
		 * localStorage：设置who的值对应后台开发人员的ip （用意：不必频繁修改ajax.js文件）
		 * 1.朱稳根
		 * 2.任文通
		 * 3.杨洋
		 * 4.卜永兴
		 * 5.纪纵阳:
		 * 6.侯建
		 * 184. 开发服务器
		 * 185. 测试服务器
		*/
		switch(who){
			case '1': localDomain ='172.16.14.89:8001'; break;
			case '2': localDomain = '172.16.14.97:8001'; break;
			case '3': localDomain = '172.16.14.101:8001'; break;
			case '4': localDomain = '172.16.14.90:8001'; break;
			case '5': localDomain = '172.16.14.103:8001'; break;
			case '6': localDomain = '172.16.14.116:8001'; break;
			case '184': localDomain = '172.16.14.184'; break;
			case '185': localDomain = '172.16.14.185'; break;
		}
		return location.host.indexOf('localhost') > -1 ? `http://${localDomain}/api${url}` : `/api${url}`
	}


	// 跳转方法
	jumpFn(jumpPath){
		this.V && this.V.$router.push({ path: jumpPath })
	}

	// 对后台返回异常状态码做跳转处理
	codeErrJump(code){
		switch(code){
			case '0001': //code为0001代表登录异常，清除登录信息并打开登录弹框
			    localStorage.removeItem('UD'); //清除缓存登陆数据
				this.V.$store.state.userData={}; //清除store中登录数据
				clearTimeout(window.noticeMessage); //停止右上角消息通知请求
				window.noticeMessage=null;
				// this.jumpFn('/login');
				this.V.$store.commit('closeChatDialog'); //关闭聊天框
				this.V.$store.commit('showLoginBox'); //弹出登陆框
				break;
		}
	}

	// 请求成功执行方法
	requestSuccess(res,resolve,reject){
		if (res.status >= 200 && res.status < 300 || res.status == 304) {
			if (res.data.code === '0000') {
				resolve(res.data.data)
			} else {
				this.codeErrJump(res.data.code)
				this.V.$message.error(res.data.msg||'网络错误 请重试！')
				reject(res)
			}
		} else {
			reject(res)
		}
	}

	// post方法
	post(url,data,config){
		return new Promise((resolve,reject)=>{
			axios.post(this.replaceUrl(url),data,config).then((res)=>{
				this.requestSuccess(res,resolve,reject)
			}).catch((err)=>{
				this.V.$message.error(err.statusText||'网络错误 请重试！');
				reject(err)
			})
		})
	}

	// get方法
	get(url){
		return new Promise((resolve, reject) => {
			axios.get(this.replaceUrl(url)).then((res) => {
				this.requestSuccess(res, resolve, reject)
			}).catch((err) => {
				this.V.$message.error(err.statusText || '网络错误 请重试！');
				reject(err)
			})
		})
    }
    
    // 上传图片或文件
    uploadImg(url,data) {
        return new Promise((resolve, reject) => {
            axios.post(this.replaceUrl(url), data, {headers:{
                'Content-Type':'multipart/form-data;charset=UTF-8'
            }})
            .then(res => {
                this.requestSuccess(res, resolve, reject);
            })
            .catch(err => {
                this.V.$message.error(err.statusText || "网络错误 请重试！");
                reject(err);
            });
        });
    }

}

```

#### 过滤器
> filter.js

``` javascript
import Vue from 'vue'

// 个位数自动补零方法
function addZero(val) {
    if (val < 10) {
        return "0" + val;
    } else {
        return val;
    }
}

// 格式化日期时间
Vue.filter("formatTime", (value, type) => {
    let dataTime = ""

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

```

#### 指令
> directive.js

``` javascript
import Vue from 'vue'

// directive内部使用的选择器
const $=el=>document.querySelector(el);

Vue.directive('nodata', {
    update(el, binding) {
        var isIE;
        var ele = $('.nodataDirective');
        //判断是否IE浏览器
        if (!-[1,]) {
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
```

#### 工具方法
> tools.js

``` javascript
import Vue from 'vue'

// 个位数自动补零方法
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
```


## 打包发布流程

### 克隆开发环境仓库

``` bash
# 克隆
git clone http://172.16.1.88/zhangjinguang/basemall-ui-pc-dist.git

# 切换至dev_*开发环境分支
git checkout -b dev_分支创建日期 origin/dev_分支创建日期
```

### 发布流程

```bash
# 开发环境打包
npm run build

# 复制dist下文件到开发环境pc目录下
cp ~/dist/* ~/basemall-ui-pc-dist/pc/

# 推送变更到远程
git add .
git commit -m "提交信息"
git push

# 发布
浏览器打开jenkins： http://172.16.1.183:9000/
发布前端项目： basemall-dev-ui-pc
```