<template>
    <div class="all">
        <!-- 问题反馈的对话框 -->
        <el-dialog
            title="问题反馈"
            :visible.sync="feedback_dialogVisible"
            width="30%"
            >
            <h4>系统问题请通过以下邮件地址反馈</h4>
            <span>779093440@qq.com</span><br>
            <span>1454147447@qq.com</span><br>
            <span>1218eye@gmail.com</span><br>
            <br>
            <span>大理大学数学与计算机学院工科楼601</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="feedback_dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="feedback_dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 操作说明的对话框 -->
        <el-dialog
            title="操作说明"
            :visible.sync="explain_dialogVisible"
            width="50%"
            >
            1加载照片：
            <br>
            点击左上角“加载”按钮，在弹出的文件选择窗口中点击选择图片，按ctrl键多选，按ctrl+a键全选
            <br>
            2照片切换：
            <br>
            方式一，点击图片展示区域中，图片两侧的透明按钮;
            <br>
            方式二，点击页面中间的底部区域的两个蓝色翻页按钮;
            <br>
            方式三：在开启了键盘监听功能后，按键盘中的A，D或者左右箭头进行照片的翻页。
            <br>
            方式四：在页面中间的底部区域中标有“Go”的输入框中键入要跳转的图片索引，按下回车。
            <br>
            还可以通过页面左上方的空与非空图片翻页组件按钮进行跳转。
            <br>
            <span slot="footer" class="dialog-footer">
                <el-button @click="explain_dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="explain_dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 设置按钮弹出对话框 -->
        <el-dialog
            title="绑定按键"
            :visible.sync="dialogVisible_setting_bind"
            width="35%"    
            >
            <el-table
                :data="label_c"
                style="width: 100%"
                max-height="250"
                empty-text="还未添加标签，请添加！"
                :stripe=true  :highlight-current-row=true
                size="small">
                <el-table-column
                prop="father"
                label="父标签"
                width="120">
                </el-table-column>
                <el-table-column
                label="子标签"
                width="120"
                >
                    <template slot-scope="scope">
                        <el-tag size="medium">{{ scope.row.children }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="绑定按键"
                    width="120"
                    prop="keyValue">
                    <template slot-scope="scope">
                         <!-- @change="keyValue_change(scope.row.keyValue,scope.$index,$event)" -->
                        <el-select v-model="scope.row.keyValue" placeholder="请选择">
                            <el-option
                                v-for="item in available_key_value" 
                                :disabled="item.val"
                                :key="item.index"
                                :label="item.index"        
                                :value="item.index">
                                <!-- ==''?'清空':item -->
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="释放"
                    width="80"
                    >
                    <template slot-scope="scope">
                        <el-button
                        type="text"
                        size="small"
                        :disabled="scope.row.keyValue.toString()==''?true:false"
                        @click="empty(scope.$index,scope.row.keyValue, label_c)">
                        清空
                        </el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column
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
                </el-table-column> -->
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_setting_bind = false">关 闭</el-button>
                <!-- <el-button type="primary" @click="dialogVisible_setting = false">确 定</el-button> -->
            </span>
        </el-dialog>
        <!-- 删除按钮弹出的对话框 -->
        <el-dialog
            title="删除标签"
            :visible.sync="dialogVisible_setting_del"
            width="22%"    
            >
            <el-tabs v-model="del_tab_activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="一级标题" name="first">
                    <el-table
                    :data="label_f"
                    style="width: 100%"
                    max-height="250"
                    @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                        >
                        </el-table-column>
                        <el-table-column
                        label="父标签"
                        width="80"
                        align="center">
                        <template slot-scope="scope">
                            <el-tag size="medium">{{scope.row}}</el-tag>
                        </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="80">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="delete_f_Row(scope.$index, label_f)"
                                type="text"
                                size="small">
                                移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button 
                        type="danger" 
                        icon="el-icon-delete" style="float:right;margin-top:10px"
                        @click="delAll(label_f)"  
                        :disabled="multipleSelection_f.length === 0"   
                        >
                        删除所选
                    </el-button>
                </el-tab-pane>
                <el-tab-pane label="二级标题" name="second">
                    <el-table
                    :data="label_c"
                    style="width: 100%"
                    max-height="250"
                    @selection-change="handleSelectionChange"
                    >
                        <el-table-column
                            type="selection"
                            width="55"
                        >
                        </el-table-column>
                        <el-table-column
                        label="标签"
                        width="120"
                        align="center"
                        >
                        <template slot-scope="scope">
                            {{scope.row.children}}
                            <el-tag size="mini">{{scope.row.father}}</el-tag>
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
                    <el-button 
                        type="danger" 
                        icon="el-icon-delete" style="float:right;margin-top:10px"
                        @click="delAll(label_c)"  
                        :disabled="multipleSelection_c.length === 0"   
                        >
                        删除所选
                    </el-button>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_setting_del = false">取 消</el-button>                
            </span>
        </el-dialog>
        <div class="image_classification">
            <div class="image_classification_left">
                <div class="tool_left">
                    <el-button class="tool_left_button" type="success" @click="click_upload"><i class="el-icon-folder-opened"></i>加载</el-button>
                    <el-button class="tool_left_button" type="success" @click="export_csv"><i class="el-icon-s-order"></i>导出</el-button>
                    <input id="upload" webkitdirectory type="file" name="file" ref="upload_input"
                    tabindex="-1" style="display: none;" @change.stop="selectPhoto($event)" >
                    <el-button class="tool_left_button" type="info" @click="keyDown"><i class="el-icon-video-play"></i> 键盘监听</el-button>
                    <el-button class="tool_left_button" type="info" @click="keyDownReview"><i class="el-icon-video-pause"></i> 键盘失效</el-button>
                    <el-button class="tool_left_button" type="warning" @click="feedback_dialogVisible = true"><i class="el-icon-s-promotion"></i> 问题反馈</el-button>
                    <el-button class="tool_left_button" type="warning" @click="explain_dialogVisible = true"><i class="el-icon-mouse"></i> 操作说明</el-button>
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
                            <el-image v-if="index <= current && index >= current -2 "  :src="item.src"  style="width:100%" fit="contain"  />
                            
                           
                        </el-carousel-item>
                    </el-carousel>
                   <!-- 描述列表 -->
                    <el-descriptions v-if="imgList[current-1].file != 'empty' " class="margin-top"  :column="3" size="small" border>
                        <el-descriptions-item label="图片名">{{imgList[current-1].file.name}}</el-descriptions-item>
                        <el-descriptions-item label="大小">{{Math.round(imgList[current-1].file.size/1024)+"K"}}</el-descriptions-item>
                        <el-descriptions-item label="最后修改时间">{{(imgList[current-1].file.lastModifiedDate)|formatDate('yyyy-MM-dd HH:mm:ss')}}</el-descriptions-item>
                        <el-descriptions-item label="多目标">
                            <div class="descriptions-div">
                                <el-radio-group v-model="current_data_model" >
                                    <el-radio-button v-for="item in current_data" :key="item.csvId" :label="item.csvId" 
                                    @click.native.prevent="handleRadioClick_current_data_model(item.csvId)"> 
                                        {{item.label_c}}  <el-tag size="mini">{{item.label_f}}</el-tag>
                                    </el-radio-button>
                                </el-radio-group>
                            </div>
                            <!-- <el-tag size="small" v-for="(tag,index2) in imgList[current-1].info" :key="index2">{{tag.fir_label}}({{tag.sec_label}})</el-tag> -->
                        </el-descriptions-item>
                    </el-descriptions>
                     <!-- 底部翻页组件     -->
                    <div class="image_classification_left_bottom">
                        <el-button type="primary" icon="el-icon-caret-left" size="small" @click="prev"></el-button>
                        <el-progress style="width:50%" :text-inside="true" :stroke-width="24" :percentage="percentage" status="success"></el-progress>
                        <el-tag size="small">{{current+'/'+imgList.length}}</el-tag>
                        <el-input placeholder="Go" v-model="keyUpValue" @focus="keyDownReview()" @blur="keyDown()"
                        @keyup.enter.native="gotoIndexByInput" size="mini" style="width:15%" clearable></el-input>
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
                        <div class="handle_no_empty">
                            
                            <el-button type="primary" style="width:50%" plain icon="el-icon-arrow-left" size="small" @click="pre_not_empty">上一张非空</el-button>
                            <el-button type="primary" style="width:50%" plain size="small" @click="next_not_empty">下一张非空<i class="el-icon-arrow-right el-icon--right"></i></el-button>   
                        </div>
                        <hr>
                        <div class="handle_empty">
                            <el-button type="primary" style="width:50%" icon="el-icon-arrow-left" size="small" @click="pre_empty">上一张空</el-button>
                            <el-button type="primary" style="width:50%" size="small" @click="next_empty">下一张空<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                        </div>
                    </div>
                    <!-- 两个标题选择卡片 -->
                    <el-card class="box-card" shadow="hover" body-style="padding:0px 10px 0px 10px" style="margin:10px 0px 10px 0px">
                        <el-collapse v-model="activeNames_f_and_c_labels" >
                            <el-collapse-item  name="1">
                                <template slot="title">
                                    一级标题 
                                    <div class="el-collapse-item-buttons_f">
                                        <el-button type="text" size="medium" @click.stop.prevent=downLoad_Sec_Label() 
                                            icon="el-icon-cloudy"  class="el-collapse-item-button">
                                        </el-button>
                                    </div> 
                                    <el-popover
                                        placement="top-start"
                                        title="提示"
                                        width="200"
                                        trigger="hover"
                                        content="再次点击后取消当前一级标签的选择">
                                        <i slot="reference" class="el-icon-warning"></i>
                                    </el-popover>                               
                                </template>
                                <!-- 一级标题的按钮组-->
                                <el-radio v-model="current_label.label_f_current" size="small" border @change="radio1Change" style="margin-left:0px;margin-right:0px"
                                    v-for="(item,index) in label_f" :key="index" :label="item"  @click.native.prevent="handleRadioClick_f(item)" >   
                                </el-radio> 
                                
                            </el-collapse-item>
                            <el-collapse-item  name="2" style="position:relative">
                                <template slot="title"> 
                                    二级标签 
                                    <!-- 三个小按钮 -->
                                    <div class="el-collapse-item-buttons">
                                        <el-button type="text" size="medium" @click.stop.prevent=setting_Sec_Label() @click="dialogVisible_setting_bind = true"
                                        icon="el-icon-setting"  class="el-collapse-item-button"> </el-button>
                                        <el-button type="text" size="medium" @click.stop.prevent=setting_Sec_Label() @click="dialogVisible_setting_del = true"
                                        icon="el-icon-delete"  class="el-collapse-item-button"></el-button>
                                    </div>
                                    <el-popover
                                        placement="top-start"
                                        title="提示"
                                        width="200"
                                        trigger="hover"
                                        content="选择二级标签后会自动选择一级标签">
                                        <i slot="reference" class="el-icon-warning"></i>
                                    </el-popover> 
                                </template>
                                <div>
                                    <el-radio v-model="current_label.label_c_current" size="small" border 
                                        style="margin-left:0px;margin-right:0px" v-for="(item,index) in label_c" :key="index" @change="radio_c_change" 
                                        :label="item.children" :disabled="judge_disabled(item)" >
                                    {{item.children}} <span style="color:white;background-color: #409EFF;">{{(item.keyValue.toString()==''||item.keyValue.toString()==null)?'':'['+item.keyValue+']'}}</span>
                                    </el-radio>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>
                    <!-- 新增标签的卡片 -->
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
                    <!-- 底部行为等卡片 -->
                    <div class="card_right_bottom">
                        <el-card class="box-card" shadow="hover" body-style="padding:0px 10px 0px 10px" style="margin:10px 0px 10px 0px" > 
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
                                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+新增</el-button>
                                        <br>
                                    </div>
                                    <div style="margin-bottom:8px">
                                        数量：<el-input-number v-model="current_label.current_num" size="small" controls-position="right" :min="1" :max="100"></el-input-number>
                                    </div>
                                </el-collapse-item>      
                            </el-collapse>
                        </el-card>
                        <el-button type="danger" style="width:20%" @click="empty_current_labels">清空</el-button>
                        <el-button type="success" style="width:76%" @click="add_data">保存记录(空格)</el-button>
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
                label_action_current:[],//当前的行为列表
                current_num:1   //当前物种的数量
            },
            multipleSelection_c:'',//多选二级标题时的数组
            multipleSelection_f:'',//多选一级标题时的数组
            del_tab_activeName: 'first', //  删除标题组对话框中tab切换
            explain_dialogVisible:false,//操作说明的对话框
            feedback_dialogVisible:false,//反馈的对话框
            dialogVisible_setting_del:false,// 删除按钮的对话框
            dialogVisible_setting_bind:false,//设置 的对话框
            activeNames_f_and_c_labels: ['1','2'],    //一二级标签得折叠面板的活跃索引
            activeNames_individual_attributes:['1'],//个体行为得折叠面板的活跃索引
            imgList:[{file:"empty",src:require('../../assets/emptyImg.png')}],//    关键的文件数组
            list:[],

            current:1,//当前图片索引
            percentage:0,//进度条
            keyUpValue:'',
            keyMap:[],
            
            // Tip: 按键与键盘对照表数值差96   如 0的keycode=96  2的keycode=98
            available_key_value:[{index:0,val:false},{index:1,val:false},{index:2,val:false},{index:3,val:false},{index:4,val:false},{index:5,val:false},
                                {index:6,val:false},{index:7,val:false},{index:8,val:false},{index:9,val:false}],
            keyArray:[false,false,false,false,false,false,false,false,false,false],        // 表示从0-9的按键是否已被占用
            label_f:['兽类','鸟类','猫类','犬类'],
            label_c:[{father:'鸟类',children:'小小鸟',keyValue:''},{father:'兽类',children:'老虎',keyValue:''}],     // 格式：[{father:‘鸟类’,children:‘小小鸟’,keyValue:''},{},{}...]
            label_age:['未知','幼年','青年','成年'],
            label_sex:['未知','雄性','雌性'],
            inputVisible: false,//添加新行为时的new tag是否可见
            inputValue: '',//输入的新new tag
            
            csv_list:[], //缓存中的csv信息
            csvId:1,//csv中的ID 
            current_data:[],    //当前照片的多记录信息{"img_name": "IMAG0001.JPG","year": 2019,"month": "06",
                        //"date": "15","hour": "05","minute": "52","second": "23","label_f": "兽类","label_c": "老虎",
                        //"age": "未知","gender": "未知","action": "1;","num": 1,"csvId": 2}
            current_data_model:'',//当前照片多记录信息中展示的是哪个
            imgNameAndIndexList:[],//图片名加索引数组[{imageName:oo1.jpg,index:1},{},{}]这样的数组
            empty_label_imgs:[],    //  空标签的照片们
            no_empty_label_imgs:[], //  有标签的照片们  {imgName:item.imgName,imgIndex:item.imgIndex,deleted:true}

        }
    },
    created(){
        this.keyDown();
    },
    beforeDestroy () {
        this.keyDownReview()
    },
    methods: {
        //再次点击一个多信息按钮后取消该按钮的选择
        handleRadioClick_current_data_model(val){
            this.current_data_model=== val ? this.current_data_model = '' : this.current_data_model = val
        },
        //清空属性栏
        empty_current_labels(val){
            //当没有选择多记录时为清空
            if(this.current_data_model == ''){
                this.current_label.label_f_current = ''
                this.current_label.label_c_current = ''
                this.current_label.label_age_current = ''
                this.current_label.label_sex_current = ''
                this.current_label.label_action_current = []
                this.current_label.current_num = 1
                if(val != 'changeIndex'){       //表示 不是在切换图片时执行的此函数
                    this.$message({
                        message: '清空成功！',
                        type: 'success'
                    });
                }
               
            }else if(val != 'changeIndex'){     //表示 不是在切换图片时执行的此函数  且否则为删除该记录
                this.$confirm('您处于选中某记录的状态，您确定删除当前记录吗？', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            var data = this.current_data.find( a => a.csvId == this.current_data_model)
                            var index = this.csv_list.indexOf(data)
                            this.csv_list.splice(index,1)        //删除该记录                      
                        }
                        this.$message({
                                message: '删除成功！',
                                type: 'success'
                        });
                    }
                })
            }
        },
        // 上一张空
        pre_empty(){
            for (let i = this.current-1-1; i >= 0; i--) {
                if(this.empty_label_imgs[i].exist == true ){ //前面的如果有非空的
                    this.gotoIndex(i)
                    return
                }
            }
            this.$message({
                type: 'warning',
                message: '已无空图片！'
            });
        },
        // 下一张空
        next_empty(){
            for (let i = this.current-1+1; i < this.empty_label_imgs.length; i++) {
                if(this.empty_label_imgs[i].exist == true ){ //后面的如果有非空的
                    this.gotoIndex(i)
                    return
                }
            }
            this.$message({
                type: 'warning',
                message: '已无空图片！'
            });
        },
        //上一张非空
        pre_not_empty(){
            for (let i = this.current-1-1; i >= 0; i--) {
                if(this.no_empty_label_imgs[i].exist == true ){ //前面的如果有非空的
                    this.gotoIndex(i)
                    return
                }
            }
            this.$message({
                type: 'warning',
                message: '已无非空图片！'
            });
        },
        // 下一张非空
        next_not_empty(){
            for (let i = this.current-1+1; i < this.no_empty_label_imgs.length; i++) {
                if(this.no_empty_label_imgs[i].exist == true ){ //后面的如果有非空的
                    this.gotoIndex(i)
                    return
                }
            }
            this.$message({
                type: 'warning',
                message: '已无非空图片！'
            });
        },
        //点击导出按钮后
        export_csv(){
            var dirName = this.imgList[0].file.webkitRelativePath.split("/")[0]
            var value = ''
            this.$prompt('请命名该文件(如果不命名，则会使用读取的文件夹名称作为csv文件名)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                if(value == '' || value == 'null' || value == null){
                    this.$message({
                        type: 'success',
                        message: '文件名为: ' + dirName
                    });
                    this.create_csv(this.csv_list,dirName)
                }else{
                    this.$message({
                        type: 'success',
                        message: '文件名为: ' + value
                    });
                    this.create_csv(this.csv_list,value)
                }
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '取消输入'
            });       
            });
            
        },
        //导出csv
        create_csv: function(data, name) {
             // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
            let str = 'index,img_name,Y,M,D,h,m,s,tag1,tag2,age,gender,action,num\n'
            // 增加\t为了不让表格显示科学计数法或者其他格式
            // 需要导出与列对应的字段，因为列标题已固定，若不声明，json数据中的字段位置不固定循环拼接后不是列标题的顺序导致标题与值导出后不对应
            // 并可自定义导出字段
            const needs = ['img_name', 'year', 'month', 'date', 'hour' , 'minute' , 'second' , 
            'label_f','label_c','age','gender','action','num']
            for (let i = 0; i < this.csv_list.length; i++) {
                // jsonData[i]每行数据
                // 根据导出字段循环取得每行数据中值
                str+=`${(i+1)+'\t'},`
                for (let j = 0; j < needs.length; j++) {
                    let field = needs[j];
                    // // 修改字段数据  比如日期转换时间戳转日期
                    // jsonData[i][field] = formatFiled(field, jsonData[i][field]);
                    str += `${this.csv_list[i][field] + '\t'},`;
                }
                str += '\n';
            }
            // “\ufeff” BOM头
            var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
            var downloadLink = document.createElement("a");
            downloadLink.href = uri;
            downloadLink.download = (name+".csv")||"temp.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },
        //生成一条记录  OR   修改一条记录
        add_data(){
            if(this.imgList.length == 1){
                this.$alert('生成记录前请先上传照片', '警告', {
                confirmButtonText: '确定',
                callback: action => {
                    this.click_upload()
                }
                });
            }else{  //已经上传数据集了
                if(this.current_label.label_c_current == '' || this.current_label.label_f_current == '' ){
                this.$message({
                    type: 'danger',
                    message: '请选择标签后进行保存！'
                });
                    return
                }
                if(this.current_data_model == ''){  //如果现在不是对多记录的修改状态
                    var a = {}
                    //索引
                    var img_index = this.current-1
                    //名字
                    a.img_name = this.imgList[img_index].file.name
                    //时间
                    var dt = new Date(this.imgList[img_index].file.lastModifiedDate);
                    a.year = dt.getFullYear();
                    a.month = (dt.getMonth() + 1).toString().padStart(2,'0');
                    a.date = dt.getDate().toString().padStart(2,'0');
                    a.hour = dt.getHours().toString().padStart(2,'0');
                    a.minute = dt.getMinutes().toString().padStart(2,'0');
                    a.second = dt.getSeconds().toString().padStart(2,'0');
                    //父标签
                    a.label_f = this.current_label.label_f_current
                    //子标签
                    a.label_c = this.current_label.label_c_current
                    //年龄
                    a.age = this.current_label.label_age_current
                    //性别
                    a.gender = this.current_label.label_sex_current
                    //行为
                    a.action = ''
                    this.current_label.label_action_current.forEach(item => {
                        if(item != ''){
                            a.action = a.action + item +';'
                        }
                    })
                    if(a.action.length>=1){
                        a.action = a.action.substring(0,a.action.length-1)
                    }
                    //数量
                    a.num = this.current_label.current_num
                    a.csvId = this.csvId
                    this.csv_list.push(a)
                    this.$message({
                        type: 'success',
                        message: '保存成功！'
                    });
                    this.csvId+=1
                }else{  //否则就对该多记录进行修改
                    var csvId = this.current_data_model
                    const data = this.csv_list.find(a => a.csvId==csvId)
                    //父标签
                    data.label_f = this.current_label.label_f_current
                    //子标签
                    data.label_c = this.current_label.label_c_current
                    //年龄
                    data.age = this.current_label.label_age_current
                    //性别
                    data.gender = this.current_label.label_sex_current
                    //行为
                    data.action = ''
                    this.current_label.label_action_current.forEach(item => {
                        data.action = data.action + item +';'
                    })
                    if(data.action.length>=1){
                        data.action = data.action.substring(0,data.action.length-1)
                    }
                    //数量
                    data.num = this.current_label.current_num
                    this.$message({
                        type: 'success',
                        message: '修改成功！'
                    });
                }
            }
            
        },  

        //点击删除标题的复选框触发
        handleSelectionChange(val) {
            if(this.del_tab_activeName == 'first'){
                this.multipleSelection_f = val;
            }else{
                this.multipleSelection_c = val;
            }
            
        },
        // 点击批量删除(标题数组)
        delAll(labels){
            var arr=[]
            //遍历点击选择的对象集合，拿到每一个对象的id添加到新的集合中
            if(this.del_tab_activeName == 'first'){
                arr = this.label_c.filter(a => this.multipleSelection_f.indexOf(a.father)!=-1)
                this.$confirm('确定删除吗？这将会导致删除该标题下的所有子标题！', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            this.multipleSelection_f.forEach(row => {
                                labels.splice(labels.indexOf(row), 1)   //删除父标题
                                arr.forEach(a => {      //遍历的去删除这些子元素  
                                    var index = this.label_c.indexOf(a) 
                                    this.label_c.splice(index,1)        //删除子元素  
                                    // if(a.keyValue != ""){
                                    //     this.empty(index,a.keyValue.toString(),this.label_c)   //清空按键绑定
                                    // }                                       
                                })
                            })
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                        }
                    }
                })
            }
            // 如果是二级标签的批量删除
            else{
                this.$confirm('确定删除这些标签吗？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            this.multipleSelection_c.forEach(a => {
                                var index = this.label_c.indexOf(a)
                                this.label_c.splice(index,1)        //删除子元素  
                                if(a.keyValue != ""){
                                    this.empty(index,a.keyValue.toString(),this.label_c)   //清空按键绑定
                                }                                       
                            })                        
                        }
                    }
                })
            }
            
        } ,
        // 对删除标题组中切换不同的tab事件
        handleClick(tab, event) {
            console.log(tab, event);
            // console.log(this.del_tab_activeName);
        },
        // 清空一个按键绑定
        empty(index,keyValue,rows){
            rows[index].keyValue = ""
            this.available_key_value[keyValue].val = false
            this.$message({
                message: '清空成功！',
                type: 'success'
            });
        },
        //删除一个二级标签
        deleteRow(index, rows) {    
            rows.splice(index, 1);
        },
        //删除一个一级标签
        delete_f_Row(index, rows) { 
            this.$confirm('确定删除吗？这将会导致删除该标题下的所有子标题！', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            var f_label = rows[index]  // 得到要删除的父标签名字
                            rows.splice(index, 1)  // 删除父元素
                            this.label_c.forEach((item,index) => {
                                if(item.father == f_label){
                                    this.label_c.splice(index,1)  
                                    console.log(item,index);   
                                }
                            })
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                        }
                    }
                })   
        },
        // 删除一个行为的活跃标签
        delete_action_tag(tag) {
            //splice(index,howmany) ——> 删除从index位置开始的数，howmany为删除的个数 若 howmany 小于等于 0，则不删除
            this.current_label.label_action_current.splice(this.current_label.label_action_current.indexOf(tag), 1);
        },
        // 显示出输入框
        showInput() {
            this.keyDownReview()
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //输入新的行为
        handleInputConfirm() {

            let inputValue = this.inputValue;
            if (inputValue) {
                this.current_label.label_action_current.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 点击了二级标题的设置按钮后函数 （主要作用是防止向下传播  也就是防止在点击按钮的同时把折叠菜单也展开了）
        setting_Sec_Label(){
            console.log('点击了设置按钮');
        },
        downLoad_Sec_Label(){
            this.$message({
                message: '云端导入功能将在后续版本开放，敬请期待！',
                type: 'warning'
            })
        },
        // 关闭设置的对话框的事件
        handleClose(done) {
            // this.$confirm('确认关闭？').then(_ => {done();}).catch(_ => {});
            // done();
            // this.dialogVisible_setting_bind=false
        },
        //  添加一个二级标签（同时可能添加一级标签）
        add_a_label_c(){
            if(this.add_label.add_label_f=='' || this.add_label.add_label_c==''){
                this.$message({
                    message: '请将一级标签和二级标签信息完善！',
                    type: 'warning'
                });
            }else {
                // 如果新添的二级标签和一级标签都已经存在（注意是正好搭配存在）
                if(this.label_c.find(a => a.children == this.add_label.add_label_c) && this.label_c.find(a => a.father == this.add_label.add_label_f)){
                    this.$message({
                        message: '该二级标签已存在！',
                        type: 'danger'
                    })
                }else{
                    // 如果是新的  则添加
                    this.label_c.push({father:this.add_label.add_label_f,children:this.add_label.add_label_c,keyValue:''})
                    this.$message({
                        message: '二级标签添加成功！',
                        type: 'success'
                    })
                }
            }
        },
        //再次点击一个一级标签后取消一个一级标签的选择
        handleRadioClick_f(val){
            this.current_label.label_f_current === val ? this.current_label.label_f_current = '' : this.current_label.label_f_current = val            
            this.radio1Change()
        },
        //再次点击一个二级标签后取消一个二级标签的选择
        handleRadioClick_c(val){
            this.current_label.label_c_current === val ? this.current_label.label_c_current = '' : this.current_label.label_c_current = val            
        },
        //  添加一个一级标签
        add_a_label_f(){
            if(!this.label_f.includes(this.add_label.add_label_f)){
                this.label_f.unshift(this.add_label.add_label_f)
            }
            this.$refs.add_label_c.focus();
        },
        // 二级标签选中后，自动去选择一级标签
        radio_c_change(){
            var a = this.label_c.find(a => a.children==this.current_label.label_c_current)      //查询当前选中的二级标题
            this.current_label.label_f_current = a.father
        },
        //监听一级标签变化的方法
        //一级标签改变后 去禁用二级标签
        radio1Change(){ 
            this.current_label.label_c_current = ''
        },
        // 判断该二级标签是否禁用
        judge_disabled(value){

            if(this.current_label.label_f_current == ""){
                return false
            }else if(value.father == this.current_label.label_f_current){   //如果当前这个大类的
                return false
            }else{
                return true
            }
        },
        // 当前展示图片发生变化
        imgChange(index){
            this.current= (index==0?1:index+1)
            this.percentage = Math.round((this.current / this.imgList.length) * 100)
            this.changeCurrentData()
        },
        //展示图片发生变化时 更新属于该图片的物种属性
        changeCurrentData(){
            // 过滤出属于该图片的记录
            var img_name = this.imgList[this.current-1].file.name
            this.current_data = this.csv_list.filter(item => item.img_name == img_name)
            if(this.current_data != ''){
                this.current_data_model = this.current_data[0].csvId
            }
            else{   //该图片没有属性记录
                this.current_data_model = ''
                this.empty_current_labels('changeIndex')
            }

        },
        // 初始化加载图片
        selectPhoto(event){
                let fileList = event.target.files
                var tempList = []           
                for(let i=0;i<fileList.length;i++){
                    if(fileList[i].type == 'image/gif' || fileList[i].type == 'image/png' || fileList[i].type == 'image/jpeg' || fileList[i].type == 'image/jpg' || fileList[i].type == 'image/bmp'){
                        let fileUrl = URL.createObjectURL(fileList[i]);  // 获取文件url
                        tempList.push({file:fileList[i],src:fileUrl}) // data中显示的图片url 
                    }
                }
                this.imgList = tempList 
                event.target.value = "" // 解决不能选同一个文件
                this.imgChange(0)
                this.imgNameAndIndexList = []
                //生成一个 [{imageName:oo1.jpg,index:1},{},{}]这样的数组
                tempList.forEach((item,index) => {
                    this.imgNameAndIndexList.push({imgName:item.file.name,imgIndex:index+1})
                })
                //将空标签照片数组初始化
                this.imgNameAndIndexList.forEach((item,index) => {
                    this.empty_label_imgs.push({imgName:item.imgName,imgIndex:item.imgIndex,exist:true})
                    this.no_empty_label_imgs.push({imgName:item.imgName,imgIndex:item.imgIndex,exist:false})
                })
                //清空csv数据列表
                this.csv_list = []
                this.csvId = 1
                console.log(this.imgList);
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
        gotoIndexByInput(){
            this.$refs.carousel.setActiveItem(this.keyUpValue-1)
        },
        gotoIndex(index){
            this.$refs.carousel.setActiveItem(index)
        },
        // 键盘监听事件失效
        keyDownReview(){
            document.onkeydown = function (event) {
                var e = event || window.event;
                e.returnValue = true;
            }
        },
        //按钮监听键盘
        keyDown(){
            // console.log("开始监听");
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
                case 32:
                    that.add_data()
                    break;
                default:
                    break;
                }
                // 监听绑定二级标签的按键
                if(keyCode<=57 && keyCode>=48){
                    that.label_c.forEach(item => {
                        if(item.keyValue == (keyCode-48).toString()){
                            that.current_label.label_c_current = item.children
                            that.radio_c_change()
                        }
                    })
                }
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                window.event.returnValue = false;
                }
            }
        },
        
    },
    watch:{
        
        //多记录中的物种属性变化时的事件
        current_data_model:{
            handler(new_val,old_val){
                if(new_val != ''){
                    var current = this.current_data.find( a => a.csvId==new_val)
                    this.current_label.label_f_current = current.label_f
                    this.current_label.label_c_current = current.label_c
                    this.current_label.label_age_current = current.age
                    this.current_label.label_sex_current = current.gender
                    if(current.action != ''){
                        this.current_label.label_action_current = current.action.split(";")
                    }else{
                        this.current_label.label_action_current = ''
                    }
                    this.current_label.current_num = current.num
                }
            }
        },
        label_c:{
            handler(new_val,old_val){
                var key_vlaues = new_val.map(a => a.keyValue)   //将所有二级标签的keyvalue都赋值给key——values
                key_vlaues = key_vlaues.filter(function (s) {      //过滤器 过滤“” 和 null
                    s = s.toString()
                    return s && s.trim(); 
                });
                // console.log(key_vlaues);

                this.available_key_value.forEach((item) => {
                    if(key_vlaues.indexOf(item.index)!=-1){
                        this.available_key_value[item.index].val = true // 将已赋值过的二级标签按键从选择器的options中删除
                    }else{
                        this.available_key_value[item.index].val = false // 将已赋值过的二级标签按键从选择器的options中添加
                    }
                })
            },
            deep:true
        },
        csv_list:{
            handler(new_val,old_val){
                // 过滤出属于该图片的记录
                this.changeCurrentData()
                //每次生成都去更新 空标签图片 和 非空标签图片 这两个数组
                var no_empty_img_set = new_val.map(a => a.img_name)
                var no_empty_img_names = Array.from(new Set(no_empty_img_set))  //给csvlist里面的名字们去重 这里面都是非空的图片了
                for (let [index1, item1] of no_empty_img_names.entries()){
                    for (let [index2, item2] of this.no_empty_label_imgs.entries()){
                        if(item1 == item2.imgName){
                            item2.exist = true
                            this.empty_label_imgs[index2].exist = false
                            break
                        }
                    }
                }
                
                // console.log(this.empty_label_imgs);
                // console.log(this.no_empty_label_imgs);


                // console.log(this.imgList);
                // console.log(this.csv_list);
                // console.log(this.current_data);
            },
            deep:true
        }
        
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
    .descriptions-div{
        height: 40px;
    }
    .descriptions-div{
        display: flex;
        flex-direction: row;
    }
    .descriptions-card{
        background-color: rgb(142, 142, 142);
        width: 20%;
    }
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
    .el-collapse-item-buttons_f{
        position:absolute;
        right:85px;
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
        width: 89%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .tool_left{
        width: 10%;
        display: flex;
        flex-direction: column;
        margin-right: 5px;
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
    .image_classification_left_bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    .card_right{
        width: 98%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .handle_no_empty{
        width: 100%;
        display: flex;
        justify-content: center;
    }
    .handle_empty{
        width: 100%;
        display: flex;
        justify-content: center;
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
