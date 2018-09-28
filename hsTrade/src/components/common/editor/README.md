# 富文本编辑器说明

editor.js为js主文件

editor.css为主样式文件

editor.vue为富文本编辑器组件文件

使用方法，例：

```html
<template>
    <div>
        <editor :options="editorOptions" style="width:750px;"></editor>
    </div>
</template>
<script>
    import editor from '@/components/common/editor/editor.vue'
    export default {
        components: {
            editor
        },
        data(){
            return{
                editorOptions:{
                    value:'', //绑定值
                    disabled:false, //是否禁用（不传默认可编辑）
                    config:{
                        type:'default', //simple简单，default默认，full全部功能（type不传默认default）
                        maxSize:2, //图片最大上传尺寸（单位M）（type为simple不需此字段）
                        base64:false //true为base64模式展示图片，false或不传为上传图片（type为simple不需此字段）
                    }
                }
            }
        }
    }
</script>
```