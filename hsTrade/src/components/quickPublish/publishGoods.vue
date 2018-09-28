<template>
    <div>
        <div class="publishSeekPurchase" v-if="!isShowSucc">
            <div class="release_name" v-if="editMode.status == 'publish'">发布供货信息</div>
            <div class="release_name" v-if="editMode.status == 'edit'">编辑供货信息</div>
            <div class="release_bd">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model.trim="ruleForm.name" style="width:360px;" :maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goodsClassifis">
                        <span class="star">*</span>
                        <div class="goodsClassifis">
                            <ul class="">
                                <li>
                                    <el-select class="" v-model.trim="classifi.firstClassifi" placeholder="选择分类（大分类）" @change="changeClassifi(classifi.firstClassifi, 1)">
                                        <el-option :label="item.name" v-for="item in classifi.firstGoodsClassifis" :key="item.id" :value="item.id"></el-option>
                                    </el-select>
                                </li>
                                <li>
                                    <el-select class="" v-model.trim="classifi.secondClassifi" placeholder="选择分类（二级分类）" @change="changeClassifi(classifi.secondClassifi, 2)">
                                        <el-option :label="item.name" v-for="item in classifi.secondGoodsClassifis" :key="item.id" :value="item.id"></el-option>
                                    </el-select>
                                </li>
                                <li>
                                    <el-select class="" v-model.trim="classifi.thirdClassifi" placeholder="选择分类（三级分类）" @change="changeClassifi(classifi.thirdClassifi, 3)">
                                        <el-option :label="item.name" v-for="item in classifi.thirdGoodsClassifis" :key="item.id" :value="item.id"></el-option>
                                    </el-select>
                                </li>
                            </ul>
                        </div>
                        <div class="el-form-item__error" v-show="!!tips.thirdClassifi">{{tips.thirdClassifi}}</div>
                    </el-form-item>
                    <!-- 分割线 -->
                    <el-form-item v-if="editMode.status == 'publish' && isShowAddItem">
                        <div class="chooseAttrbutes">
                            <div class="chooseType">
                                <div v-for="(item,i) in selectShopModelItems" :key="item.itemId" style="position:relative;" v-if="isShowShopModelItem">
                                    <ul class="SKU_TYPE" style="position:absolute;left:0;top:0;">
                                        <li  :propid="item.itemId" :sku-type-name="item.itemName" :item-seq="item.itemSeq" :isRequired="1">{{item.itemName}}  :</li>
                                    </ul>
                                    <div style="margin-left: 100px;">
                                        <label v-for="(attr,j) in item.attrList" style="margin-right:25px;">
                                            <input type="checkbox" class="sku_value" @change="checkedBox(i,j)" :propvalid="attr.itemDataId" :value="attr.content" :associationUuid="attr.associationUuid" :idIndex="attr.dataSeq"/>
                                            {{attr.content}}
                                        </label>
                                    </div>
                                </div>
                                <!--sku模板,用于克隆,生成自定义sku-->
                                <button class="add_btn"  @click.prevent="addSkuAttr($event)">添加自定义sku属性</button>
                                <div id="skuCloneModel" ref='skuTitle' class="clearfix skumodel">
                                    <ul class="SKU_TYPE float_l">
                                        <li is_required='0' propid='' sku-type-name="">
                                            <button class="delCusSkuType add_btn" id="removeBtn" @click="removeSkuAttr()">移除</button>
                                            <input type="text" class="cusSkuTypeInput" />：
                                        </li>
                                    </ul>
                                    <ul class="SKU_VAL">
                                        <li class="float_l skuVal_t" style="margin-right:10px;">
                                            <input type="checkbox" class="model_sku_val sku_value" propvalid='' value="" />
                                            <input type="text" class="cusSkuValInput" />
                                        </li>
                                        <span class="cloneSkuVal add_btn float_l"  id="addAttrBtn" @click.prevent="cloneSkuVal($event)">添加自定义属性值</span>
                                    </ul>
                                </div>
                                <!--单个sku值克隆模板-->
                                <li style="display: none;margin-right:10px;" id="onlySkuValCloneModel">
                                    <input type="checkbox" class="model_sku_val sku_value" propvalid='' value="" />
                                    <input type="text" class="cusSkuValInput" />
                                    <span class="delCusSkuVal">删除</span>
                                </li>
                                <!-- 生成的sku表格 -->
                                <div id="skuTable"></div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item v-if="(editMode.status == 'edit') && (isShowShopModelItem || !!itemData.length)">
                        <div class="chooseAttrbutes">
                            <div class="chooseType">
                                <div v-for="(item,i) in selectShopModelItems" :key="item.itemId" style="position:relative;">
                                    <ul class="SKU_TYPE" style="position:absolute;left:0;top:0;">
                                        <li  :propid="item.itemId" :sku-type-name="item.itemName" :item-seq="item.itemSeq" :isRequired="1">{{item.itemName}}  :</li>
                                    </ul>
                                    <div style="margin-left: 100px;">
                                        <label v-for="(attr,j) in item.attrList" style="margin-right:25px;">
                                            <input type="checkbox" class="sku_value" @change="checkedBox(i,j)" :propvalid="attr.itemDataId" :value="attr.content" :associationUuid="attr.associationUuid" :idIndex="attr.dataSeq"/>
                                            {{attr.content}}
                                        </label>
                                    </div>
                                </div>
                                <!--sku模板,用于克隆,生成自定义sku-->
                                <button class="add_btn"  @click.prevent="addSkuAttr($event)">添加自定义sku属性</button>
                                <div id="skuCloneModel" ref='skuTitle' class="clearfix skumodel">
                                    <ul class="SKU_TYPE float_l">
                                        <li is_required='0' propid='' sku-type-name="">
                                            <button class="delCusSkuType add_btn" id="removeBtn" @click="removeSkuAttr()">移除</button>
                                            <input type="text" class="cusSkuTypeInput" />：
                                        </li>
                                    </ul>
                                    <ul class="SKU_VAL">
                                        <li class="float_l skuVal_t" style="margin-right:10px;">
                                            <input type="checkbox" class="model_sku_val sku_value" @change="checkedBox()" propvalid='' value="" />
                                            <input type="text" class="cusSkuValInput" />
                                        </li>
                                        <span class="cloneSkuVal add_btn float_l"  id="addAttrBtn" @click.prevent="cloneSkuVal($event)">添加自定义属性值</span>
                                    </ul>
                                </div>
                                <!--单个sku值克隆模板-->
                                <li style="display: none;margin-right:10px;" id="onlySkuValCloneModel">
                                    <input type="checkbox" class="model_sku_val sku_value"  @change="checkedBox()" propvalid='' value="" />
                                    <input type="text" class="cusSkuValInput" />
                                    <span class="delCusSkuVal">删除</span>
                                </li>
                                <div id="skuTable"></div>
                            </div>
                        </div>
                    </el-form-item>
                    <!-- 分割线 -->
                    <el-form-item label="单价">
                        <span class="star" style="left: -50px">*</span>
                        <el-input v-model="ruleForm.minPrice" :disabled="true" type="text" style="width:375px;"></el-input>&nbsp;&nbsp;&nbsp;{{ruleForm.currency=='人民币'?'元':ruleForm.currency}}
                        <el-select v-model.trim="ruleForm.unit" style="margin-left:15px;">
                            <el-option :label="v" v-for="(v,i) in units" :value="v" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="币种" prop="currency">
                        <el-select v-model.trim="ruleForm.currency">
                            <el-option :label="v" v-for="(v,i) in currencies" :value="v" :key="i"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="库存数量" prop="storage">
                        <span class="star" style="left: -80px">*</span>
                        <el-input v-model.trim="ruleForm.storage" :disabled="true" type="text" style="width:375px;"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;{{ruleForm.unit}}
                    </el-form-item>
                    <!-- <el-form-item label="交货地" prop="deliverArea">
                        <span class="star" style="left: -65px">*</span>
                        <div class="goodsClassifis">
                            <ul class="">
                                <li>
                                    <el-select v-model="address.province" placeholder="请选择省" @change="changeProvince">
                                        <el-option :label="v" v-for="(v,k) in address.provinceList" :value="k" :key="k"></el-option>
                                    </el-select> 
                                </li>
                                <li>
                                    <el-select v-model="address.city" placeholder="请选择市" @change="changeCity">
                                        <el-option :label="v" v-for="(v,k) in address.cityList" :value="k" :key="k"></el-option>
                                    </el-select>
                                </li>
                                <li>
                                    <el-select v-model="address.district" placeholder="请选择区">
                                        <el-option :label="v" v-for="(v,k) in address.districtList" :value="k" :key="k"></el-option>
                                    </el-select>
                                </li>
                            </ul>
                        </div>
                        <div class="el-form-item__error" v-show="!!tips.deliverArea">{{tips.deliverArea}}</div>
                    </el-form-item> -->
                    <el-form-item label="信息有效期" prop="overTime2" v-if="editMode.status == 'publish'">
                        <span class="star" style="left:-93px">*</span>
                        <el-date-picker v-model="ruleForm.overTime2" type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="信息有效期" prop="overTime" v-if="editMode.status == 'edit'">
                        <span class="star" style="left:-93px">*</span>
                        <el-date-picker v-if="editMode.status == 'edit'" v-model="ruleForm.overTime" type="datetime" placeholder="选择日期时间"> </el-date-picker>
                        <div class="el-form-item__error" v-show="!!tips.overTime">{{tips.overTime}}</div>
                    </el-form-item>
                    <el-form-item label="承诺发货时间" prop="deliveryDays">
                        <el-input v-model="ruleForm.deliveryDays" style="width:375px;" placeholder="全款支付后发货时间"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;工作日内
                    </el-form-item>
                    <el-form-item label="详细描述">
                        <editor :options="editorOptions" style="width:750px;"></editor>
                    </el-form-item>
                    <el-form-item label="上传图片" prop="titleImage">
                        <span class="star" style="left: -80px">*</span>
                        <div class="upload_img">
                            <div class="imgTitle">点击上传图片</div>
                            <div class="addImg">
                                <div class="titleImage" v-if="ruleForm.titleImage">
                                    <img :src="ruleForm.titleImage">
                                </div>
                                <div class="bgcImg" v-if="!ruleForm.titleImage"></div>
                                <input class="uploadImg" name="file" type="file" @change="uploadImg($event)" accept="image/png,image/gif,image/jpeg"/>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="" type="primary" :disabled="isLogin&&this.$store.state.userData.userType != 1" @click="submitForm('ruleForm')">提交发布</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- <div class="addBox">
            <el-dialog :visible.sync="dialogVisible" :title="'点击上传图片'">
                <input name="file" type="file"  accept="image/png,image/gif,image/jpeg"/>
                <div class="appendix">
                    <span class="explain">附件名称</span>
                    <el-input class="name" v-model="addImg.imgName"></el-input>
                </div>
                <span class="explain">附件简介</span>
                <el-input type="textarea" class="area" v-model="addImg.imgBrief"></el-input>
                <el-button type="primary" style="width:160px;font-size:16px;">上传</el-button>
            </el-dialog>
        </div> -->
        <publish-suc v-if="isShowSucc" :suc-infos="sucInfos" @continue-publish="continuePublish"></publish-suc>
    </div>
</template>

<script>
    import publishSuc from './publishSuc.vue';
    import loginVue from '../login.vue';
    import editor from '@/components/common/editor/editor.vue';
    export default {
        components: {
            // pcaSelect,
            publishSuc,
            editor
        },
        data() {
            return {
                dialogVisible:false,
                addImg:{
                    imgSrc:'',
                    imgName:'',
                    imgBrief:''
                },
                AllInput:true,
                showinput:false,
                customPropId:-1,     //自定义属性类型ID
                customPropValId:-1,  //自定义属性值id
                itemSeq:1,    //自定义属性名序号
                idIndex:1, //自定义属性值序号
                UserRoot:false,
                attrList:[],
                skuCustom:false,
                skuValueArr:[],
                alreadySetSkuVals:{},
                address: {
                    provinceList: [],
                    cityList: [],
                    districtList: [],
                    province: '',
                    city: '',
                    district: '',
                },
                attrId:'',
                attrIds:[],
                addr: null,
                units: {},
                currencies: {},
                editorOptions:{
                    value:'',
                    config:{
                        type:'default',
                        maxSize:2
                    }
                },
                ruleForm: {
                    type: 2,
                    name: '',
                    modelId:'',
                    minPrice:'',
                    maxPrice:'',
                    currency: '人民币',
                    unit: '件',
                    storage:'',
                    overTime: '',
                    deliveryDays: null,
                    // corpProvince: '',
                    // corpCity: '',
                    // corpArea: '',
                    itemData: [],
                    shopDetail:'',
                    skuData:[],
                    overTime2: '',
                    itemAndDataArray:[],
                    titleImage:''
                },
                classifi: {
                    firstClassifi: "",
                    secondClassifi: "",
                    thirdClassifi: "",
                    firstGoodsClassifis: [],
                    secondGoodsClassifis: [],
                    thirdGoodsClassifis: [],
                },
                dataList:[],
                dataItemList:[],
                isShowShopModelItem: false,
                isShowAddItem:false,
                isAttrShow: true,
                selectShopModelItems:[],
                itemData:[[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
                isShowSucc: false,
                sucInfos: {},
                editMode: {
                    status: 'publish',
                },
                tips: {
                    thirdClassifi: '',
                    deliverArea: '',
                    overTime: '',
                },
                units: {},
                currencies: {},
                rules: {
                    name: [{
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }],
                    unit: [{
                        required: true,
                        message: "请选择单位",
                        trigger: 'blur'
                    }],
                    currency: [{
                        required: true,
                        message: "请选择币种",
                        trigger: 'blur'
                    }],
                    overTime: [{
                        required: true,
                        message: "请选择信息有效期",
                        trigger: 'blur'
                    }],
                    overTime2: [{
                        required: true,
                        message: "请选择信息有效期",
                        trigger: 'blur'
                    }],
                    deliveryDays: [{
                        required: true,
                        message: "请输入发货时间",
                        trigger: 'blur'
                    }, {
                        required: true,
                        pattern: /^[1-9]\d*$/,
                        message: '请输入大于0的整数',
                        trigger: 'blur'
                    }],
                }
            };
        },

        created() {
            this.getAddr();
            this.getUnits();
            this.getCurrency();
        },
        methods: {
            showAddImg(){
                if(this.dialogVisible==true){
                    this.dialogVisible=false;
                }else{
                    this.dialogVisible=true;
                }
            },
            uploadImg(e) {
                let file = e.target.files[0];
                let param = new FormData();
                param.append('uploadFiles', file);
                if (file.size > (2 * 1024 * 1024)) {
                    this.$message.warning('所添加的图片大小不能超过 2MB!');
                    return false;
                }
                this.$ajax.uploadImg('/basemall-shop/shopCommon/uploadFiles', param)
                    .then(res => {
                        this.ruleForm.titleImage = res[0];
                    });
            },
            checkedBox(i,j){
                this.getAlreadySetSkuVals();
                var b = true;
                var skuTypeArr =  [];//存放SKU类型的数组
                var totalRow = 1;//总行数
                //获取元素类型
                $(".SKU_TYPE").each(function(){
                    //SKU类型节点
                    var skuTypeNode = $(this).children("li");
                    var skuTypeObj = {};//sku类型对象
                    //SKU属性类型标题
                    if($(this).find("input[type='text'][class*='cusSkuTypeInput']").val()){
                        skuTypeObj.skuTypeTitle = $(this).find("input[type='text'][class*='cusSkuTypeInput']").val()
                    }else{
                        skuTypeObj.skuTypeTitle = $(skuTypeNode).attr("sku-type-name");
                    }
                    //SKU属性类型主键
                    var propid = $(skuTypeNode).attr("propid");
                    skuTypeObj.skuTypeKey = propid;
                    //是否是必选SKU 0：不是；1：是；
                    var is_required = $(skuTypeNode).attr("isRequired");
                    var skuValueArr = [];//存放SKU值得数组;
                    //SKU相对应的节点
                    var skuValNode = $(this).next();
                    //获取SKU值
                    var skuValCheckBoxs = $(skuValNode).find("input[type='checkbox'][class*='sku_value']");
                    var checkedNodeLen = 0 ;//选中的SKU节点的个数
                    $(skuValCheckBoxs).each(function(){
                        if($(this).is(":checked")){
                            var skuValObj = {};//SKU值对象
                            skuValObj.skuValueTitle = $(this).val();//SKU值名称
                            skuValObj.skuValueId = $(this).attr("propvalid");//SKU值主键
                            skuValObj.skuPropId = $(this).attr("propid");//SKU类型主键
                            skuValueArr.push(skuValObj);
                            checkedNodeLen ++ ;
                        }
                    });
                    // if(is_required && "1" == is_required){//必选sku
                    //     if(checkedNodeLen <= 0){//有必选的SKU仍然没有选中
                    //         b = false;
                    //         return false;//直接返回
                    //     }
                    // }
                    if(skuValueArr && skuValueArr.length > 0){
                        totalRow = totalRow * skuValueArr.length;
                        skuTypeObj.skuValues = skuValueArr;//sku值数组
                        skuTypeObj.skuValueLen = skuValueArr.length;//sku值长度
                        skuTypeArr.push(skuTypeObj);//保存进数组中
                    }
                    // console.log(skuTypeArr);
                });
                var SKUTableDom = "";//sku表格数据
                if(skuTypeArr.length>0){//必选的SKU属性已经都选中了
                    SKUTableDom += "<table class='skuTable'><tr>";
                    //创建表头
                    for(var t = 0 ; t < skuTypeArr.length ; t ++){
                        SKUTableDom += '<th>'+skuTypeArr[t].skuTypeTitle+'</th>';
                    }
                    SKUTableDom += '<th>价格</th><th>库存</th>';
                    SKUTableDom += "</tr>";
                    //循环处理表体
                    for(var i = 0 ; i < totalRow ; i ++){//总共需要创建多少行
                        var currRowDoms = "";
                        var rowCount = 1;//记录行数
                        var propvalidArr = [];//记录SKU值主键
                        var propIdArr = [];//属性类型主键
                        var propvalnameArr = [];//记录SKU值标题
                        var propNameArr = [];//属性类型标题
                        for(var j = 0 ; j < skuTypeArr.length ; j ++){//sku列
                            var skuValues = skuTypeArr[j].skuValues;//SKU值数组
                            var skuValueLen = skuValues.length;//sku值长度
                            rowCount = (rowCount * skuValueLen);//目前的生成的总行数
                            var anInterBankNum = (totalRow / rowCount);//跨行数
                            var point = ((i / anInterBankNum) % skuValueLen);
                            propIdArr.push(skuTypeArr[j].skuTypeKey);
                            propNameArr.push(skuTypeArr[j].skuTypeTitle);
                            if(0  == (i % anInterBankNum)){//需要创建td
                                currRowDoms += '<td rowspan='+anInterBankNum+'>'+skuValues[point].skuValueTitle+'</td>';
                                propvalidArr.push(skuValues[point].skuValueId);
                                propvalnameArr.push(skuValues[point].skuValueTitle);
                            }else{
                                //当前单元格为跨行
                                propvalidArr.push(skuValues[parseInt(point)].skuValueId);
                                propvalnameArr.push(skuValues[parseInt(point)].skuValueTitle);
                            }
                        }
                        var propvalids = propvalidArr.toString()
                        var alreadySetSkuPrice = "";//已经设置的SKU价格
                        var alreadySetSkuStock = "";//已经设置的SKU库存
                        //赋值
                        if(this.alreadySetSkuVals){
                            var currGroupSkuVal = this.alreadySetSkuVals[propvalids];//当前这组SKU值
                            if(currGroupSkuVal){
                                alreadySetSkuPrice = currGroupSkuVal.skuPrice;
                                alreadySetSkuStock = currGroupSkuVal.skuStock
                            }
                        }
                        SKUTableDom += '<tr propvalids=\''+propvalids+'\' propids=\''+propIdArr.toString()+'\' propvalnames=\''+propvalnameArr.join(";")+'\'  propnames=\''+propNameArr.join(";")+'\' class="sku_table_tr">'+currRowDoms+'<td><input type="text" class="setting_sku_price setting" value="'+alreadySetSkuPrice+'"/></td><td><input type="text" class="setting_sku_stock setting" value="'+alreadySetSkuStock+'"/></td></tr>';
                    }
                    SKUTableDom += "</table>";
                }
                $("#skuTable").html(SKUTableDom);

                /* 动态监测sku输入框的值获取最小值和数量和数值校验 */
                var self = this;
                $("#skuTable").on("blur", ".setting_sku_price", function () {
                    var num = $(this).val();
                    if(num<=0){
                        self.$message.error('请输入大于0的数');
                        $(this).val('');
                        return
                    }else{
                        $(this).val(parseFloat($(this).val()).toFixed(2));
                    }
                }).on("blur", ".setting_sku_stock", function () {
                    var num = $(this).val();
                    var re = /^([1-9]\d*|[0]{1,1})$/;
                    if(!re.test(num)){
                        self.$message.error('请输入不小于0的正整数');
                        $(this).val('');
                        return
                    }
                }).on("blur", ".setting", function () {
                    self.getPriceRange();
                })
                if(this.dataItemList!=""&&SKUTableDom!==''){
                    var skuList = this.dataItemList;
                    var tb = document.querySelector('#skuTable .skuTable');
                    var rows = tb.rows;
                    for(var s=0;s<skuList.length;s++){
                        var properties = skuList[s].properties;
                        var quantity = skuList[s].quantity;
                        var price = skuList[s].price;
                        for(var i = 0; i<rows.length; i++ ){
                            var propvalnames = $(rows[i]).attr("propvalnames");
                            if(propvalnames!==undefined){
                                if(properties == $(rows[i]).attr("propvalnames")){
                                    for(var j = 0; j<rows[i].cells.length; j++ ){
                                        var cells = rows[i].cells[j].getElementsByTagName("input");
                                        if(cells != 0){
                                            if($(cells).attr("class") == "setting_sku_price setting"){
                                                $(cells).val(price);
                                            }
                                            if($(cells).attr("class") == "setting_sku_stock setting"){
                                                $(cells).val(quantity);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
             /* 增加自定义属性名 */
            addSkuAttr(event){

                var cloneSource = $("#skuCloneModel");//要克隆的sku模板
                var cloneNode = $(this.$refs.skuTitle.cloneNode(true));
                var cloneAttrSource = $("#onlySkuValCloneModel");
                var that = this
                cloneNode.css("display","block");//显示元素
                cloneNode.removeAttr("id");
                this.customPropId -- ;
                this.itemSeq ++ ;
                var associationUuid = that.getUuid();
                cloneNode.find(".cusSkuTypeInput").parent().attr("propid",this.customPropId);
                cloneNode.find(".cusSkuTypeInput").parent().attr("itemSeq",this.itemSeq);
                cloneNode.find(".cusSkuValInput").prev().attr("propvalid",this.customPropValId);
                cloneNode.find(".cusSkuValInput").prev().attr("idIndex",this.idIndex);
                cloneNode.find(".cusSkuValInput").prev().attr("associationUuid",associationUuid);
                cloneNode.find('.model_sku_val').change(function(){
                    if($('.cusSkuTypeInput').val()!='' && $('.cusSkuValInput').val()!=''){
                        that.checkedBox()
                    }
                })
                $(event.target).before(cloneNode);//添加到该按钮的前面
                 /* 移除自定义sku类型模块 */
                cloneNode.find('#removeBtn').click(function(event) {
                    $(this).parent().parent().parent().remove();
                    //触发change事件,重绘表格
                     that.checkedBox();
                })
                 /* 添加自定义属性值 */
                cloneNode.find('#addAttrBtn').click(function(event) {
                    var cloneSource = $("#onlySkuValCloneModel");
                    var cloneNode = cloneSource.clone(true);
                    cloneNode.removeAttr("id");
                    that.customPropValId -- ;
                    that.idIndex ++ ;
                    console.log(that.customPropValId);
                    var associationUuid = that.getUuid();
                    $(cloneNode).find(".cusSkuValInput").prev().attr("propvalid",that.customPropValId);
                    $(cloneNode).find(".cusSkuValInput").prev().attr("idIndex",that.idIndex);
                    $(cloneNode).find(".cusSkuValInput").prev().attr("associationUuid",associationUuid);
                    cloneNode.css("display","block");
                    $(this).before(cloneNode)
                    //添加到该按钮的前面
                })
                 /* 添加自定义属性值 绘画表格*/
                cloneAttrSource.find('.model_sku_val').change(function(){
                    if($('.cusSkuTypeInput').val()!='' && $('.cusSkuValInput').val()!=''){
                        that.checkedBox()
                    }
                })
                /* 删除自定义属性值 */
                cloneAttrSource.find('.delCusSkuVal').click(function(event) {
                    $(this).parent().remove();
                    //触发change事件,重绘表格
                    $(".model_sku_val").trigger("change");
                })

                //SKU类型改变
                $(document).on("change", ".cusSkuTypeInput", function(){
                    //判断当前的SKU类型是否已经存在
                    var isHaveThisSkuType = false;
                    var customSkuTypeName = $(this).val();
                    if(customSkuTypeName){
                        $("div[class*='SKU_TYPE']").find("span").each(function(){
                            var currSkuTypeName = $(this).attr("sku-type-name");//当前SKU类型名称
                            console.log(currSkuTypeName);
                            console.log(customSkuTypeName);
                            if(currSkuTypeName == customSkuTypeName){//该SKU类型已经存在
                                isHaveThisSkuType = true;
                            }
                        });
                    }
                    if(isHaveThisSkuType){
                        that.$message.error('该SKU类型名已经存在');
                        $(this).val("");
                    }
                    //赋值类型属性
                    $(this).parent().attr("sku-type-name",$(this).val());
                    if(!$(this).val() || isHaveThisSkuType){
                        $(this).parent().parent().next().find("input[type='checkbox'][class*='sku_value']").each(function(){
                            //取消选中
                            $(this).attr("checked",false)
                            //移除class
                            $(this).removeClass("sku_value");
                        });
                    }
                    //触发change事件,重绘表格
                    $(".model_sku_val").trigger("change");
                });
                
                //SKU值改变
                $(document).on("change", ".cusSkuValInput", function(){
                    var isHaveSkuVal = false;//是否已经存在当前的SKU值
                    var thisSkuVal = $(this).val();
                    var customSkuVal = $(this).parent().siblings().find("input[type='text']").val();
                    if(thisSkuVal == customSkuVal){
                        that.$message.error('该SKU类型值已经存在');
                        $(this).val("");
                    }
                    $("input[type*='checkbox'][class*='']")
                    var cusSkuVal = $(this).val();
                    if(!cusSkuVal || isHaveSkuVal){
                        //移除class
                        $(this).prev().removeClass("sku_value");
                        if($(this).prev().is(":checked")){
                            //移除选中
                            $(this).prev().attr("checked",false);
                        }
                    }
                    //赋值类型属性
                    $(this).prev().val(cusSkuVal);
                    //触发change事件
                    $(".model_sku_val").trigger("change");
                });

                //未设置sku值和属性的sku选择框改变事件
                $(document).on("change",".model_sku_val",function(){
                    //SKU类型
                    var skuTypeVal = $(this).parent().parent().prev().find("li").attr("sku-type-name");
                    //是否设置了sku类型及sku值
                    if(skuTypeVal && $(this).val()){
                        //添加class
                        $(this).addClass("sku_value");
                         //触发change事件,重绘表格
                        that.checkedBox();
                    }
                });
               
            },
            getUuid() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random()*16)%16 | 0;
                    d = Math.floor(d/16);
                    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                });
                return uuid;
            },
            getNewSkuData(){
                    //获取新增的数据
                    var itemDataList = [];
                    var skuNewList = [];
                    var that = this;
                    $("div[class*='clearfix skumodel'][style='display: block;']").each(function(v){
                        itemDataList = [];
                        var itemName = $(this).find("ul[class*='float_l']").find('li').attr("sku-type-name");
                        var itemSeq = $(this).find("ul[class*='float_l']").find('li').attr("itemSeq");
                        if(itemName==''){
                            that.$message.error('属性名不能为空');
                            that.AllInput = false;
                            return
                        }else{
                            if(itemName){
                                var lis = $(this).find("ul[class*='SKU_VAL']").find('li')
                                lis.each(function(val,index){
                                    var checkedBox = $(this).find("input[type='checkbox'][class*='model_sku_val sku_value']");
                                    var checkedBoxVal = $(this).find("input[type='text'][class*='cusSkuValInput']").val();
                                    if(checkedBoxVal==''){
                                        that.$message.error('属性值不能为空');
                                        that.AllInput = false;
                                        return
                                    }else{
                                        if(checkedBox){
                                            that.AllInput = true;
                                            var itemDataName = checkedBox.attr("value");
                                            var dataSeq = checkedBox.attr("idIndex");
                                            var associationUuid =  checkedBox.attr("associationUuid");
                                            var item={
                                                "itemDataName":itemDataName,
                                                "dataSeq":dataSeq,
                                                "associationUuid":associationUuid
                                            };
                                            itemDataList.push(item);

                                        }
                                    }
                                });
                                var itemNew = {
                                    "itemName":itemName,
                                    "itemSeq":itemSeq,
                                    "itemDataList":itemDataList
                                };
                                skuNewList.push(itemNew);
                            }
                        }

                    });
                    that.ruleForm.itemAndDataArray = skuNewList;
            },
            getAlreadySetSkuVals(){
                var alreadySetSkuVals = this.alreadySetSkuVals;
                //获取设置的SKU属性值
                $("tr[class*='sku_table_tr']").each(function(){
                    var skuPrice = $(this).find("input[type='text'][class*='setting_sku_price']").val();//SKU价格
                    var skuStock = $(this).find("input[type='text'][class*='setting_sku_stock']").val();//SKU库存
                    if(skuPrice || skuStock){//已经设置了全部或部分值 
                        var propvalids = $(this).attr("propvalids");//SKU值主键集合
                        alreadySetSkuVals[propvalids] = {
                            "skuPrice" : skuPrice,
                            "skuStock" : skuStock
                        }
                    }
                });
            },
            /* 获取勾选的SKU属性 */
            getSkuItem(){
                var skuItemList = [];
                $("input[type='checkbox'][class*='sku_value']").each(function(){
                    if($(this).is(":checked")){
                        var dataSeq = $(this).attr("idIndex");
                        var itemDataId = $(this).attr("propvalid");
                        var content = $(this).attr("value");
                        var associationUuid = $(this).attr("associationUuid")
                        var item={
                                    "dataSeq":dataSeq,
                                    "itemDataId":itemDataId,
                                    "content":content,
                                    "associationUuid":associationUuid
                                };
                        skuItemList.push(item);
                    }
                });
                this.ruleForm.itemData = skuItemList;
            },
            /***获取已经设置的SKU值 */
            getSkuData(){
                var setSkuVals = [];
                $("tr[class*='sku_table_tr']").each(function(){
                    var skuPrice = $(this).find("input[type='text'][class*='setting_sku_price']").val();//SKU价格
                    var skuStock = $(this).find("input[type='text'][class*='setting_sku_stock']").val();//SKU库存
                    var propvalids = $(this).attr("propvalids");//商品属性值主键集合
                    var propvalnames = $(this).attr("propvalnames");//SKU名称集合
                    var propids = $(this).attr("propids");//商品属性名主键集合
                    var item={
                                "propids":propids,
                                "propvalids":propvalids,
                                "propvalnames":propvalnames,
                                "skuPrice":skuPrice,
                                "skuQuantity":skuStock
                            };
                    setSkuVals.push(item);
                });
                this.ruleForm.skuData=setSkuVals;
            },
            /*** 根据sku的价格和数量计算商品数量和价格*/
            getPriceRange(){
                var price = [];
                var shopStore = [];
                var storageSum = 0;
                $("tr[class*='sku_table_tr']").each(function(){
                    var skuPrice = $(this).find("input[type='text'][class*='setting_sku_price']").val()*1;//SKU价格
                    var skuStock = $(this).find("input[type='text'][class*='setting_sku_stock']").val()*1;//SKU库存
                    price.push(skuPrice);
                    shopStore.push(skuStock);
                });
                var minPrice = Math.min.apply(Math,price);
                var maxPrice = Math.max.apply(Math,price);
                // 最高价若不为两位小数时，保持为两位小数
                if(minPrice != 0 && maxPrice != 0){
                    this.ruleForm.minPrice=minPrice.toFixed(2);
                    this.ruleForm.maxPrice=maxPrice.toFixed(2);
                    for (let index = 0; index < shopStore.length; index++) {
                        storageSum = storageSum + shopStore[index]*1;
                    }
                    this.ruleForm.storage=storageSum;
                }
            },
            selectShopModelItem(modelId,callback) {
                this.$ajax.post('/basemall-shop/shop-goods/select-goods-model-item', {
                    modelId: modelId,
                    shopId: !!this.$route.query.shopId ? this.$route.query.shopId : '',
                }).then((res) => {
                    this.isShowShopModelItem=!!res.length;
                    this.isShowAddItem = true;
                    if (!!res.length) {
                        this.selectShopModelItems = res;
                        var maxItemSeq=0;
                        let attrs
                        this.selectShopModelItems.forEach((x, i) => {
                            attrs = [];
                            x.dataName.split(",").forEach((dataNameItem, dataNameItemIndex) => {
                                attrs.push({
                                    dataSeq:dataNameItem.split("|")[0],
                                    itemDataId: dataNameItem.split("|")[1],
                                    content: dataNameItem.split("|")[2],
                                    associationUuid: dataNameItem.split("|")[3]
                                });
                            });
                            if(x.itemSeq>maxItemSeq){
                               maxItemSeq = x.itemSeq;
                            }
                            x.attrList = attrs;
                        })
                        this.itemSeq = maxItemSeq;
                        callback&&callback()
                    }
                })
            },
            shopModelList() {
                // let modelInterface = !!this.$route.query.shopId ? '/basemall-shop/shopGoods/selectShopItem' : '/basemall-shop/shop-model/select-goods-model-list';
                let modelInterface = '/basemall-shop/shop-model/select-goods-model-list';
                this.$ajax.post(modelInterface, {
                    shopId: this.$route.query.shopId || '',
                }).then((res) => {
                    this.classifi.firstGoodsClassifis = [...res];
                })
            },
            getAddr() {
                this.addr = JSON.parse(localStorage.getItem('addrData'));
                this.address.provinceList = this.addr[0];
                if (!!this.$route.query.shopId) {
                    this.editMode.status = 'edit';
                    this.updateShopGoodsEchoData();
                } else {
                    this.shopModelList();
                }
            },
            getUnits() {
                this.$ajax.post('/basemall-shop/shop-goods/select-goods-unit', {
                    code: 'unit',
                }).then((res) => {
                    this.units = res.content;
                });
            },
            getCurrency() {
                this.$ajax.post('/basemall-shop/shop-goods/select-goods-unit', {
                    code: 'currency',
                }).then((res) => {
                    this.currencies = res.content;
                });
            },
            changeProvince() {
                this.address.cityList = this.addr[`0,${this.address.province}`];
                this.address.city = this.address.district = '';
            },
            changeCity() {
                this.address.districtList = this.addr[`0,${this.address.province},${this.address.city}`];
                this.address.district = '';
            },
            changeClassifi(value, classifi) {
                this.ruleForm.minPrice = '';
                this.ruleForm.maxPrice = '';
                this.ruleForm.storage = '';
                $(".skumodel").remove();
                $("#skuTable").html('');
                this.tips.thirdClassifi = '';
                this.itemData = [[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
                this.isShowShopModelItem = false;
                if (classifi == 1) {
                    this.classifi.secondClassifi = this.classifi.thirdClassifi = '';
                } else if (classifi == 2) {
                    this.classifi.thirdClassifi = '';
                } else if (classifi == 3) {
                    this.ruleForm.modelId = value;
                    this.selectShopModelItem(value);
                }
                this.$ajax.post('/basemall-shop/shop-model/select-goods-model-list', {
                    parentId: value,
                }).then((res) => {
                    if (classifi == 1) {
                        this.classifi.secondGoodsClassifis = res;
                    } else if (classifi == 2) {
                        this.classifi.thirdGoodsClassifis = res;
                    }
                })
            },
            getUserRoot(formName){
                this.$ajax.post('/basemall-shop/shop-goods/select-user-authentication-status').then(res=>{
                  if(true){
                    console.log(111);
                    //认证通过
                    this.submitForm(formName)
                  }else{
                    //认证不通过
                    this.$message({
                      message: '用户认证未通过,不可发布',
                      type: 'warning'
                    });
                  }
                })
            },
            submitForm(formName) {
                console.log(1);
                this.getSkuData();
                this.getSkuItem();
                this.getNewSkuData();
                if(this.AllInput==true){
                    if (!!this.$store.state.userData.username) {
                    this.$refs[formName].validate((valid) => {
                        let errorNum = 0;
                        this.ruleForm.overTime = this.editMode.status != 'edit' ? this.ruleForm.overTime2 : this.ruleForm.overTime;
                        var skuDataArry = this.ruleForm.skuData;
                        var num;
                        var price
                        skuDataArry.forEach((x)=>{
                            num = x.skuPrice;
                            price = x.skuQuantity;
                        });
                        if(this.ruleForm.skuData.length<=0){
                            this.$message.error('请勾选商品属性');
                            return false;
                        }else if(num==''||price ==''){
                            this.$message.error('请输入商品价格和数量');
                            return false;
                        }else if (!this.classifi.thirdClassifi) {
                            this.tips.thirdClassifi = "请选择商品分类";
                            ++errorNum;
                        }
                        // else if (!this.address.district) {
                        //     this.tips.deliverArea = "请选择交货地";
                        //     ++errorNum;
                        // }
                        else if (!!this.ruleForm.overTime && (this.ruleForm.overTime < new Date().getTime())) {
                            this.$message.error('信息有效期不可早于当前时间');
                            return false;
                        }else if (this.ruleForm.titleImage=='') {
                            this.$message.error('请添加商品图片');
                            return false;
                        }else if (errorNum > 0) {
                            return false;
                        }else if (valid) {
                            // this.ruleForm.corpProvince = this.address.province;
                            // this.ruleForm.corpCity = this.address.city;
                            // this.ruleForm.corpArea = this.address.district;
                            // this.ruleForm.overTime = new Date(this.ruleForm.overTime2).getTime();
                            let interfaceName = this.editMode.status == 'edit' ? '/basemall-shop/shop-goods/update-goods' : '/basemall-shop/shop-goods/insert-goods';
                            if (!!this.classifi.thirdClassifi) {
                                    this.ruleForm.shopDetail=this.editorOptions.value;
                                    this.$ajax.post(interfaceName, this.ruleForm).then((res) => {
                                        this.sucInfos = res;
                                        this.sucInfos.type = 'goods';
                                        this.isShowSucc = true;
                                    })
                            }
                        } else {
                            this.$message.error('请正确填写必填项');
                            return false;
                        }
                    });
                } else {
                    this.$store.commit('showLoginBox')
                }
                console.log(JSON.stringify(this.ruleForm));
                }
            },
            continuePublish() {
                this.isShowSucc = false;
                this.ruleForm = {};
                this.selectShopModelItems = [];
                this.address = {};
                this.isShowShopModelItem = false;
                this.$router.push({
                    path: '/publish/goods',
                    query: {
                        t: new Date().getTime() / 1000
                    }
                });
                this.$router.go(0);
            },
            // 拆分商品参数
            filterShopItemData(list){
                let itemData=[];
                let arr=[];
                list.forEach((x,i)=>{
                    x.dataName.forEach(d=>{
                        let item=d.split('|');
                        arr.push({
                            dictId:x.dictId,
                            content:item[2],
                            dataPrice:item[1]
                        })
                    })
                });
                this.selectShopModelItems.forEach((x,i)=>{
                    let a=arr.filter(a=>a.dictId==x.itemId)
                    a.forEach(_=>{
                        this.itemData[i].push(_)
                    })
                });
            },
            // 编辑状态
            updateShopGoodsEchoData() {
                this.$ajax.post('/basemall-shop/shop-goods/update-goods-echo-data', {
                    shopId: this.$route.query.shopId*1,
                }).then((res) => {
                    console.log(res);
                    for (let k in res.shopGoods) {
                        if (res.shopGoods.hasOwnProperty(k)) {
                            this.ruleForm[k] = res.shopGoods[k]
                        }
                    };
                    this.editorOptions.value=res.shopGoods.shopDetail;
                    res.itemList.forEach((v, i) => {
                        v.dataName = v.dataName.split(',');
                    });
                    this.dataList = res.dataList;
                    this.dataItemList = res.shopSkuList;
                    this.classifi.firstClassifi = res.modelMap.oneLevelName;
                    this.classifi.secondClassifi = res.modelMap.twoLevelname;
                    this.classifi.thirdClassifi = res.modelMap.modelName;
                    this.classifi.overTime2 = res.shopGoods.overTime;
                    // let address = res.shopGoods.supplyAddress.split('-');
                    // this.address.province = address[0];
                    // this.address.city = address[1];
                    // this.address.district = address[2];
                    // this.address.provinceList = this.addr[0];
                    // this.address.cityList = this.addr[`0,${this.address.province}`];
                    // this.address.districtList = this.addr[`0,${this.address.province},${this.address.city}`];
                    this.selectShopModelItem(res.modelMap.modelId,()=>{
                        this.filterShopItemData(res.itemList);
                    });
                    this.shopModelList();
                    var itemData = this.dataList;
                    setTimeout(() => {
                        for(var g=0;g<itemData.length;g++){
                        var itemId = itemData[g].itemDataId;
                        $("input.sku_value").each(function() {
                            var propvalids = $(this).attr("propvalid");//SKU值主键集合
                            if(itemId == propvalids){
                                $(this).prop("checked",true);
                            }
                        });
                        this.checkedBox();
                    }
                    }, 1000);
                })
            },
        },
        computed: {
            isLogin() {
                return !!this.$store.state.userData.username;
            },
            userType() {
                return this.$store.state.userData.userType
            },
        },
        watch: {
            "address.province" (v) {
                this.tips.deliverArea = "";
            },
            "ruleForm.overTime" (v) {
                this.tips.overTime = "";
            },
            "ruleForm.overTime2" (v) {
                this.tips.overTime = "";
            },
            "classifi.thirdClassifi" (v) {
                this.tips.thirdClassifi = "";
            }
        }
    };
</script>

<style lang="less">
    @import "../../less/quickRelease.less";
</style>
