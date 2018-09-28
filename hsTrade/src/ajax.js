import axios from 'axios';

// http request 拦截器
axios.interceptors.request.use(
	config => {
		if (localStorage.UD) {
			config.headers.Authorization = `${localStorage.getItem('accessToken')}`;
			config.headers.Authentication = `${localStorage.getItem('refreshToken')}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error.response.data);
	}
);

// http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.headers.refreshauthentication && response.headers.refreshauthorization) {
			localStorage.setItem('accessToken', response.headers.refreshauthorization);
			localStorage.setItem('refreshToken', response.headers.refreshauthentication);
        }
        return response;
    },
    error => {
        return Promise.reject(error.response.data);
    }
);

export default class $ajax{
	constructor(){
		this.V=null
	}

	replaceUrl(url) {
		let localDomain = '';
		let who = localStorage.who || null;

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
			case '184': localDomain = '172.16.1.184'; break;
			case '186': localDomain = '172.16.1.186'; break;
			case '185': localDomain = '172.16.1.185'; break;
			case '7' :localDomain = '172.16.14.101:8507';break;
		}
		return location.host.indexOf('localhost') > -1 ? `http://${localDomain}/api${url}` : `/api${url}`
		// return "http://"+localDomain + url.replace("/basemall-message","")
	}

	jumpFn(jumpPath){
		this.V && this.V.$router.push({ path: jumpPath })
	}

	codeErrJump(code){
		switch(code){
			case '0001':
				localStorage.removeItem('UD');
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				this.V.$store.state.userData={};
				clearTimeout(window.noticeMessage);
                window.noticeMessage=null;
                clearTimeout(window.updateBuyChat);
                window.updateBuyChat = null;
                clearTimeout(window.updateSupplyChat);
                window.updateSupplyChat = null;
				// this.jumpFn('/login');
				this.V.$store.commit('closeChatDialog');
				this.V.$store.commit('showLoginBox');
				break;
		}
	}

	requestSuccess(res,resolve,reject,url){
        let Excepts="'/basemall-account/login/login'";
		if (res.status >= 200 && res.status < 300 || res.status == 304) {
			if (res.data.code == '0000') {
				resolve(res.data.data);
			} else if (res.data.code != '0000') {
                    if((res.data.code != '9999' && res.data.code != '0001') || Excepts.includes(url)) {
                        this.V.$message.error(res.data.msg);
                    } else if(res.data.code == '0001') {
                        localStorage.removeItem('UD');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('UR');
                    }else if (this.V.$route.path!='/finance/detail'&&res.data.code == '0001') {
                        this.V.$store.commit('showLoginBox');
                    } else if (this.V.$route.path == '/finance/detail' && res.data.code!= '0000') {
						this.investInfos.isShowInvestDialog = false;
					}
			} else if (res.headers.refreshAuthentication!=='' && res.headers.refreshAuthorization!=='') {
				localStorage.setItem('accessToken', res.headers.refreshAuthentication);
				localStorage.setItem('refreshToken', res.headers.refreshAuthorization);
            } else {
                this.codeErrJump(res.data.code)
                if(!!res.data.msg) {
                    this.V.$message.error(res.data.msg)
                }
				reject('Error: code error');
				console.error(res)
			}
		} else {
			reject('Error: http error');
            console.error(res)
		}
	}

	post(url,data,config){
        // let rihgtExcepts = "'/basemall-message/discuss/update-discuss-status'";
        let errorExcepts = "'/basemall-message/discuss/unique-discuss','/basemall-message/discuss/update-discuss-status'";
		return new Promise((resolve,reject)=>{
			axios.post(this.replaceUrl(url), data, config)
			.then((res)=>{
                // if (!rihgtExcepts.includes(url)) {
                    this.requestSuccess(res,resolve,reject,url);
                // }
			}).catch((err)=>{
                if (!errorExcepts.includes(url)) {
                    if (!!err.statusText) {
                        this.V.$message.error(err.statusText);
                    }
                }
                reject(err)
			})
		})
	}

	get(url){
		return new Promise((resolve, reject) => {
			axios.get(this.replaceUrl(url))
			.then((res) => {
                this.requestSuccess(res, resolve, reject)
			}).catch((err) => {
                if (!!err.statusText) {
                    this.V.$message.error(err.statusText);
                }
                reject(err)
			})
		})
    }

    uploadImg(url,data) {
        return new Promise((resolve, reject) => {
            axios.post(this.replaceUrl(url), data, {headers:{
                'Content-Type':'multipart/form-data;charset=UTF-8'
            }})
            .then(res => {
                this.requestSuccess(res, resolve, reject);
            })
            .catch(err => {
                if (!!err.statusText) {
                    this.V.$message.error(err.statusText);
                }
                reject(err);
            });
        });
    }

}
