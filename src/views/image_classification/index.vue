<template>
    <div class="all">
        <!-- :before-close="handleClose" -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible_setting"
            width="35%"    
            >
            <el-table
                :data="label_c"
                style="width: 100%"
                max-height="250">
                <el-table-column
                prop="father"
                label="父标签"
                width="120">
                </el-table-column>
                <el-table-column
                prop="children"
                label="子标签"
                width="120">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="绑定按键"
                    width="120"
                    prop="keyValue">
                    <template slot-scope="scope">
                        <input type="text" v-model="keyVl"  @keyup.enter.native="updateKeyCode(scope.$index, label_c)">
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="80">
                    <template slot-scope="scope">
                        <el-button
                        @click.native.prevent="deleteRow(scope.$index, label_c)"
                        type="text"
                        size="small">
                        移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_setting = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible_setting = false">确 定</el-button>
            </span>
        </el-dialog>
        <div class="image_classification">
            <div class="image_classification_left">
                <div class="tool_left">
                    <el-button class="tool_left_button" type="success" @click="click_upload"><i class="el-icon-folder-opened"></i>上传</el-button>
                    <el-button class="tool_left_button" type="success"><i class="el-icon-s-order"></i>导出</el-button>
                    <input id="upload" accept="image/gif,image/png,image/jpeg,image/jpg,image/bmp" multiple type="file" name="file" ref="upload_input"
                    tabindex="-1" style="display: none;" @change="selectPhoto($event)" >
                    <el-button class="tool_left_button" type="info" @click="keyDown"><i class="el-icon-video-play"></i> 键盘监听</el-button>
                    <el-button class="tool_left_button" type="info" @click="keyDownReview"><i class="el-icon-video-pause"></i> 键盘失效</el-button>
                </div>
                <div class="carouse">
                    <el-carousel :initial-index="0" @change="imgChange" 
                    indicator-position="none"  height="600px" :autoplay="false" arrow="always" ref="carousel" :loop="false">
                        <el-carousel-item v-for="(item,index) in imgList" :key="index">
                            <!-- {{index}} -->
                            <!--
                            contain
                            被替换的内容将被缩放，以在填充元素的内容框时保持其宽高比。 
                            整个对象在填充盒子的同时保留其长宽比，因此如果宽高比与框的宽高比不匹配，
                            该对象将被添加“黑边”。
                            cover
                            被替换的内容在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，
                            该对象将被剪裁以适应内容框。
                            fill
                            被替换的内容正好填充元素的内容框。整个对象将完全填充此框。如果对象的宽高比与内容框不相匹配，那么该对象将被拉伸以适应内容框。
                            none
                            被替换的内容将保持其原有的尺寸。
                            scale-down
                            内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。 -->
                            
                            <!-- 使用v-if 使得只有在current等于该图片的索引时 才会渲染这个DOM  注意 不可以使用v-show -->
                            <el-image v-if="index == current-1"  :src="item.src"  style="width:100%" fit="contain"  />
                            
                           
                        </el-carousel-item>
                    </el-carousel>
                    <!-- 底部翻页组件     -->
                    <el-descriptions v-if="imgList[current-1].file != 'empty' " class="margin-top"  :column="3" size="small" border>
                        <el-descriptions-item label="图片名">{{imgList[current-1].file.name}}</el-descriptions-item>
                        <el-descriptions-item label="大小">{{Math.round(imgList[current-1].file.size/1024)+"K"}}</el-descriptions-item>
                        <el-descriptions-item label="最后修改时间">{{(imgList[current-1].file.lastModifiedDate)|formatDate('yyyy-MM-dd HH:mm:ss')}}</el-descriptions-item>
                        <el-descriptions-item label="多目标">
                            <el-tag size="small" v-for="(tag,index2) in imgList[current-1].info" :key="index2">{{tag.fir_label}}({{tag.sec_label}})</el-tag>
                        </el-descriptions-item>
                    </el-descriptions>
                    <div class="image_classification_left_bottom">
                        <el-button type="primary" icon="el-icon-caret-left" size="small" @click="prev"></el-button>
                        <el-progress style="width:50%" :text-inside="true" :stroke-width="24" :percentage="percentage" status="success"></el-progress>
                        <el-tag size="small">{{current+'/'+imgList.length}}</el-tag>
                        <el-input placeholder="Go" v-model="keyUpValue" @focus="keyDownReview()" @blur="keyDown()"
                        @keyup.enter.native="gotoIndex" size="mini" style="width:15%" clearable></el-input>
                        <!-- 提示弹出框 -->
                        <el-popover
                            placement="top-start"
                            title="提示"
                            width="200"
                            trigger="hover"
                            content="默认按A或者←跳转上一张，按D或者→跳转下一张，在跳转框内输入索引后回车跳转指定图片。">
                            <i slot="reference" class="el-icon-warning"></i>
                        </el-popover>
                        <el-button type="primary" icon="el-icon-caret-right" size="small" @click="next"></el-button>
                    </div>       
                </div> 
            </div>
            <div class="image_classification_right">
                <!-- 右边的整体卡片 -->
                <el-card class="box-card card_right">
                    <!-- 非空翻页与空翻页 -->
                    <div class="text item">
                        <div class="handle_not_null">
                            <el-button-group>
                                <el-button type="primary" icon="el-icon-arrow-left" size="mini">上一张非空</el-button>
                                <el-button type="primary" size="mini">下一张非空<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                            </el-button-group>
                        </div>
                    </div>
                    <!-- 两个标题选择卡片 -->
                    <el-card class="box-card" shadow="hover" body-style="padding:0px 10px 0px 10px" style="margin:10px 0px 10px 0px">
                        <el-collapse v-model="activeNames_f_and_c_labels" >
                            <el-collapse-item title="一级标题" name="1">
                               
                                <el-radio v-model="current_label.label_f_current" size="small" border @change="radio1Change" style="margin-left:0px;margin-right:0px"
                                    v-for="(item,index) in label_f" :key="index" :label="item">
                                </el-radio>
                                
                            </el-collapse-item>
                            <el-collapse-item  name="2" style="position:relative">
                                <template slot="title">
                                    二级标签 
                                    <div class="el-collapse-item-buttons">
                                        <el-button type="text" size="medium" @click.stop.prevent=setting_Sec_Label() @click="dialogVisible_setting = true"
                                        icon="el-icon-setting"  class="el-collapse-item-button"> </el-button>
                                        <el-button type="text" size="medium" @click.stop.prevent=setting_Sec_Label()
                                         icon="el-icon-cloudy"  class="el-collapse-item-button">
                                        </el-button>
                                        <el-button type="text" size="medium" @click.stop.prevent=setting_Sec_Label() 
                                        icon="el-icon-delete"  class="el-collapse-item-button"></el-button>
                                    </div>
                                </template>
                                <div>
                                    <el-radio v-model="current_label.label_c_current" size="small" border @change="radio1Change" style="margin-left:0px;margin-right:0px"
                                   v-for="(item,index) in label_c" :key="index" :label="item.children">
                                   {{item.children}}{{(item.keyValue==''||item.keyValue==null)?'':'('+item.keyValue+')'}}
                                </el-radio>
                                </div>
                                
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>
                    <el-card class="box-card" shadow="hover" style="margin:10px 0px 10px 0px" body-style="padding:10px 10px 10px 10px">
                        <el-input placeholder="输入二级标签" v-model="add_label.add_label_c"
                            class="input-with-select add_label_c_input" 
                            size="mini"
                            @focus="keyDownReview()"
                            @blur="keyDown()"
                            ref="add_label_c"
                            >
                            
                            <el-select
                                size="mini"
                                slot="prepend"
                                class="add_label_c_select"
                                clearable
                                v-model="add_label.add_label_f"
                                filterable
                                allow-create
                                default-first-option
                                @focus="keyDownReview()"
                                
                                @keyup.enter.native="add_a_label_f"
                                placeholder="选择一级标签">
                                    <el-option
                                    v-for="item in label_f"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                    </el-option>
                            </el-select>
                            <!-- 提示弹出框 -->
                            <el-popover  
                                placement="top-start"
                                title="提示"
                                width="200"
                                trigger="hover"
                                content="输入一级标签后按回车键添加，添加二级标签时必须保证选择了一级标签。"
                                slot="append">
                                <el-button slot="reference" icon="el-icon-document-add" size="mini" @click="add_a_label_c"></el-button>
                            </el-popover>
                        </el-input>
                    </el-card>
                    <div class="card_right_bottom">
                        <el-card class="box-card" shadow="hover" body-style="padding:0px 10px 0px 10px" style="margin:10px 0px 10px 0px"> 
                            <el-collapse v-model="activeNames_individual_attributes">
                                <el-collapse-item title="个体属性" name="1">
                                    <div style="margin-bottom:8px">
                                        年龄：<el-radio-group v-model="current_label.label_age_current" size="small" >
                                            <el-radio-button v-for="(item,index) in label_age" :key="index" :label="item"></el-radio-button>
                                        </el-radio-group >
                                    </div>
                                    <div style="margin-bottom:8px">
                                        性别：<el-radio-group v-model="current_label.label_sex_current" size="small">
                                            <el-radio-button v-for="(item,index) in label_sex" :key="index" :label="item"></el-radio-button>
                                        </el-radio-group>
                                    </div>
                                    <div style="margin-bottom:8px">
                                        行为：<el-tag
                                                :key="tag"
                                                v-for="tag in current_label.label_action_current"
                                                closable
                                                :disable-transitions="false"
                                                @close="delete_action_tag(tag)">
                                                {{tag}}
                                            </el-tag>
                                        <el-input
                                            class="input-new-tag"
                                            v-if="inputVisible"
                                            v-model="inputValue"
                                            ref="saveTagInput"
                                            size="small"
                                            @keyup.enter.native="handleInputConfirm"
                                            @blur="handleInputConfirm"
                                            >
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                                    </div>
                                </el-collapse-item>      
                            </el-collapse>
                        </el-card>
                        <el-button type="success" style="width:100%">保存记录(空格)</el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            add_label:{
                add_label_f:'',
                add_label_c:'',     // 添加标签时的父子级标签
            },  
            current_label:{
                label_f_current:'',
                label_c_current:'', //当前选中的父 子 级标签
                label_age_current:'',//当前选中得年龄
                label_sex_current:'',//当前选中得性别
                label_action_current:[]//当前的行为列表
            },
            dialogVisible_setting:false,//设置 的对话框
            activeNames_f_and_c_labels: ['1','2'],    //一二级标签得折叠面板的活跃索引
            activeNames_individual_attributes:['1'],//个体行为得折叠面板的活跃索引
            imgList:[{file:"empty",src:require('../../assets/emptyImg.png'),info:[]}],// info:[{一级标签：‘犬类’，二级标签：‘金毛’，行为：‘睡觉’},{一级标签：‘犬类’，二级标签：‘金毛’，行为：‘睡觉’}]
            list:[],
            fileList:[],
            urlList:[],
            current:1,//当前图片索引
            percentage:0,//进度条
            keyUpValue:'',
            keyMap:[],

            
            label_f:['兽类','鸟类','猫类','犬类'],
            label_c:[],
            label_age:['未知','幼年','青年','成年'],
            label_sex:['未知','雄性','雌性'],
            inputVisible: false,//添加新行为时的new tag是否可见
            inputValue: ''//输入的新new tag
            // list:[{'image001':[{'一级标签':'犬类','二级标签':'金毛'}]},{'image002':[{'一级标签':'犬类','二级标签':'金毛'}]}],

        }
    },
    created(){
        this.keyDown();
    },
    beforeDestroy () {
        this.keyDownReview()
    },
    methods: {
        deleteRow(index, rows) {    //删除一个二级标签
            rows.splice(index, 1);
        },
        delete_action_tag(tag) {
            console.log(tag);
            //splice(index,howmany) ——> 删除从index位置开始的数，howmany为删除的个数 若 howmany 小于等于 0，则不删除
            this.current_label.label_action_current.splice(this.current_label.label_action_current.indexOf(tag), 1);
            console.log(this.current_label.label_action_current);
        },

        showInput() {
            this.keyDownReview()
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {

            let inputValue = this.inputValue;
            if (inputValue) {
                this.current_label.label_action_current.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        setting_Sec_Label(){
            console.log('点击了设置按钮');
        },
        handleClose(done) {
            // this.$confirm('确认关闭？').then(_ => {done();}).catch(_ => {});
            // done();
            // this.dialogVisible_setting=false
        },
        //  添加一个二级标签（同时可能添加一级标签）
        add_a_label_c(){
            if(this.add_label.add_label_f=='' || this.add_label.add_label_c==''){
                this.$message({
                    message: '请将一级标签和二级标签信息完善！',
                    type: 'warning'
                });
            }else {
                this.label_c.push({father:this.add_label.add_label_f,children:this.add_label.add_label_c,keyValue:''})
                this.$message({
                    message: '二级标签添加成功！',
                    type: 'success'
                });
            }
        },
        //  添加一个一级标签
        add_a_label_f(){
            if(!this.label_f.includes(this.add_label.add_label_f)){
                this.label_f.unshift(this.add_label.add_label_f)
            }
            this.$refs.add_label_c.focus();
        },
        //监听一级标签变化的方法
        radio1Change(){     
            console.log(this.radio1);
        },
        // 当前展示图片发生变化
        imgChange(index){
            console.log(index);
            this.current= (index==0?1:index+1)
            this.percentage = Math.round((this.current / this.imgList.length) * 100)
            
        },
        // 初始化加载图片
        selectPhoto(event){
                let fileList = event.target.files
                var tempList = []           
                for(let i=0;i<fileList.length;i++){
                    let fileUrl = URL.createObjectURL(fileList[i]);  // 获取文件url
                    tempList.push({file:fileList[i],src:fileUrl}) // data中显示的图片url 
                }
                this.imgList = tempList 
                event.target.value = "" // 解决不能选同一个文件
                this.imgChange(0)
        },
        // 点击了“上传文件”按钮
        click_upload(){
            this.$refs.upload_input.click()
        },
        // 前一张图片（翻页组件中的）
        prev(){
            this.$refs.carousel.prev()
        },
        // 后一张图片（翻页组件中的）
        next(){
            this.$refs.carousel.next()
        },
        // 跳转至指定图片索引
        gotoIndex(){
            this.$refs.carousel.setActiveItem(this.keyUpValue-1)
        },
        // 键盘监听事件失效
        keyDownReview(){
            console.log("取消监听");
            document.onkeydown = function (event) {
                var e = event || window.event;
                e.returnValue = true;
            }
        },
        //按钮监听键盘
        keyDown(){
            console.log("开始监听");
            //监听键盘按钮
            let that = this
            document.onkeydown = function (event) {
                var e = event || window.event;
                var keyCode = e.keyCode || e.which;
                switch (keyCode) {
                case 65:    // A
                    that.prev()
                    break
                case 37:    // <=
                    that.prev()
                    break;
                case 68:    //F6
                    that.next()
                    break;
                case 39:    //F8
                    that.next()
                    break;
                default:
                    break;
                }
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                window.event.returnValue = false;
                }
            }
        },
        
    },
    filters:{           
        // 这是时间戳转换的函数
        formatDate: function(value,args) {
            var dt = new Date(value);
            if(args == 'yyyy-M-d') {// yyyy-M-d
            let year = dt.getFullYear();
            let month = dt.getMonth() + 1;
            let date = dt.getDate();
            return `${year}-${month}-${date}`;
        } else if(args == 'yyyy-M-d H:m:s'){// yyyy-M-d H:m:s
            let year = dt.getFullYear();
            let month = dt.getMonth() + 1;
            let date = dt.getDate();
            let hour = dt.getHours();
            let minute = dt.getMinutes();
            let second = dt.getSeconds();
            return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        } else if(args == 'yyyy-MM-dd') {// yyyy-MM-dd
            let year = dt.getFullYear();
            let month = (dt.getMonth() + 1).toString().padStart(2,'0');
            let date = dt.getDate().toString().padStart(2,'0');
            return `${year}-${month}-${date}`;
        } else {// yyyy-MM-dd HH:mm:ss
            let year = dt.getFullYear();
            let month = (dt.getMonth() + 1).toString().padStart(2,'0');
            let date = dt.getDate().toString().padStart(2,'0');
            let hour = dt.getHours().toString().padStart(2,'0');
            let minute = dt.getMinutes().toString().padStart(2,'0');
            let second = dt.getSeconds().toString().padStart(2,'0');
            return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        }
        }
    }
}
</script>

<style>


    .el-tag + .el-tag { 
        margin-left: 0px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .el-collapse-item-buttons{
        position:absolute;
        right:30px;
    }
    .all{
        height: 100%;
    }
    .image_classification{
        display: flex;
        justify-content: space-between;
        height: 100%;
    }
    .carouse {
        width: 90%;
    }
    .tool_left{
        width: 10%;
        display: flex;
        flex-direction: column;
    }
    
    .tool_left .el-button{
        margin-left: 0px;
        margin-top: 8px;
    }
    .image_classification_left{
        margin-left: 4px;
        display: flex;
        width: 75%;
    }
    .image_classification_right{
        width: 25%;
        margin-right: 5px;
    }
    .el-carousel{
        /* margin-top: 40px; */
        /* background-color: bisque; */
    }
    .el-carousel__item{
        display: flex;
        flex-direction:column;
        justify-content: space-between;
    }
    .margin-top{
        width: 100%;
    }
    .image_classification_left_bottom{
        display: flex;
        justify-content: space-between;
        align-items: center
    }
    .card_right{
        width: 98%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .handle_not_null{
        display: flex;
        justify-content: space-between;
    }
    .el-radio-button{
        background: none;
    }
    .add_label_c_input{
        width: 100%;
    }
    .add_label_c_select{
        width: 120px;
    }
</style>