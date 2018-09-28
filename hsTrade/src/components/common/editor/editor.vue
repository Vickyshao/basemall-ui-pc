<template>
    <div>
        <div class="editor-wrapper"></div>
    </div>
</template>
<script>
const Editor=require('./editor.js');
/** 
 * @param options   |->  {value, disabled, config}
 * value:string     |->  绑定富文本内容
 * disabled:boolean |->  是否禁用
 * config:object    |->  {type, maxSize, base64}
 * type:string      |->  simple简单，default默认，full全部功能（type不传默认default）
 * maxSize:number   |->  图片最大上传尺寸（单位M）（type为simple不需此字段）
 * base64:boolean   |->  true为base64模式展示图片，false或不传为上传图片（type为simple不需此字段）
*/
export default {
    props:['options'],
    data(){
        return{
            editor:null,
            flag:true
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            setTimeout(()=>{
                this.editor=new Editor['Editor']('.editor-wrapper');
                this.editor.customConfig.onchange = this.sync;
                this.setMenus(this.editor.customConfig);
                if(this.options.config.type!='simple'){
                    this.setUploadConfig(this.editor.customConfig)
                };
                this.editor.create();
                this.editor.$textElem.attr('contenteditable', !this.options.disabled); //禁用/启用编辑器
                // this.editor.txt.html(this.options.value);
                this.editor
            },10)
        },
        sync(html){
            this.options.value=html
        },
        setMenus(cfg){
            /* menus选项说明
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                'video',  // 插入视频
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            */
            let menus=[];
            if(this.options.config.type=='full'){
                menus=['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', 'table', 'video', 'code', 'undo', 'redo']
            }else if(this.options.config.type=='simple'){
                menus=['bold', 'fontSize', 'undo', 'redo']
            }else if(this.options.config.type=='default'){
                menus=[ 'head', 'bold', 'fontSize', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'image', 'undo', 'redo' ]
            }else{
                menus=[ 'head', 'bold', 'fontSize', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'image', 'undo', 'redo' ]
            };
            cfg.menus=menus
        },
        setUploadConfig(cfg){
            cfg.uploadImgHeaders = {
                'Authorization':localStorage.getItem('accessToken'),
                'Authentication':localStorage.getItem('refreshToken')
            }
            
            // console.log(localStorage.getItem('UD'))
            if(this.options.config.base64){
                cfg.uploadImgShowBase64=true;
            }else{
                cfg.uploadImgServer=replaceUrl('/basemall-shop/shopCommon/uploadFiles');
                cfg.uploadFileName='uploadFiles';
                cfg.uploadImgMaxLength=5;
            };
            let maxSize=this.options.config.maxSize||2;
            cfg.uploadImgMaxSize=maxSize*1048576
        }
    },
    watch:{
        'options.value'(v){
            if(this.flag){
                this.editor.txt.html(v);
                this.flag=false
            }
        }
    }
};
function replaceUrl(url){
    let localDomain = '';
    let who=localStorage.who||null;
    switch(who){
        case '1': localDomain ='172.16.14.89:8001'; break;
        case '2': localDomain = '172.16.14.97:8001'; break;
        case '3': localDomain = '172.16.19.211:8001'; break;
        case '4': localDomain = '172.16.14.90:8001'; break;
        case '5': localDomain = '172.16.14.103:8001'; break;
        case '6': localDomain = '172.16.14.116:8001'; break;
        case '184': localDomain = '172.16.1.184'; break;
        case '186': localDomain = '172.16.1.186'; break;
        case '185': localDomain = '172.16.1.185'; break;
    }
    return location.host.indexOf('localhost') > -1 ? `http://${localDomain}/api${url}` : `/api${url}`
}
</script>
<style lang="scss">
    @import './editor.css';
</style>
