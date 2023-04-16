<template>
    <div class="all">
        <!-- 统计数据得对话框 -->
        <!-- 问题反馈的对话框 -->
        <el-dialog
            title="数据统计"
            :visible.sync="data_statistics_dialogVisible"
            width="60%"
            :before-close="handleClose_data_statistics_dialogVisible"
            >
            <el-card style="border:solid 4px lightblue">
                <data-statistics v-if="dataStatistics.flag" :seriesData="dataStatistics.datas"></data-statistics>
            </el-card>
        </el-dialog>
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
            <el-carousel trigger="click" height="150px" :autoplay="false">
                <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small" style="text-align:center">{{ item }}</h3>
                </el-carousel-item>
            </el-carousel>
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
                <template slot-scope="scope">
                        <el-tag size="medium">{{ scope.row.father }}</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="子标签"
                width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.children }}
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
                    <el-button class="tool_left_button" type="warning" @click="explain_href"><i class="el-icon-mouse"></i> 操作说明</el-button>
                    <input id="upload_csv" accept=".csv" type="file" name="file" ref="upload_csv_input"
                    tabindex="-1" style="display: none;" @change.stop="selectCsv($event)" >
                    <!-- <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose">
                        <el-submenu index="1">
                            <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>本地</span>
                            </template>
                            <el-menu-item-group>
                            <el-menu-item index="1-1" @click="click_upload" >加载</el-menu-item>
                            <el-menu-item index="1-2">导出</el-menu-item>
                            <el-menu-item index="1-3">校验</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>键盘</span>
                            </template>
                            <el-menu-item-group>
                            <el-menu-item index="2-1">键盘监听</el-menu-item>
                            <el-menu-item index="2-2">键盘失效</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>步骤</span>
                            </template>
                            <el-menu-item-group>
                            <el-menu-item index="3-1">操作说明</el-menu-item>
                            <el-menu-item index="3-2">问题反馈</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu> -->
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
                <el-card class="box-card card_right" body-style="padding:5px 10px 10px 10px ">
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
                    <el-card class="box-card" shadow="hover" body-style="padding:10px 10px 0px 10px" style="margin:10px 0px 10px 0px">
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
                        <el-collapse v-model="activeNames_f_and_c_labels" >
                            <el-collapse-item  name="1">
                                <template slot="title">
                                    一级标题 
                                    <div class="el-collapse-item-buttons_f">
                                        <el-button type="text" size="medium" @click.stop.prevent="click_upload_csv"
                                            icon="el-icon-upload2"  class="el-collapse-item-button">
                                        </el-button>
                                        
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
                                <el-scrollbar style="height: 8vh">
                                    <el-radio v-model="current_label.label_f_current" size="small" border @change="radio1Change" style="margin-left:0px;margin-right:0px"
                                        v-for="(item,index) in label_f" :key="index" :label="item"  @click.native.prevent="handleRadioClick_f(item)" >   
                                    </el-radio> 
                                </el-scrollbar>
                                
                                
                            </el-collapse-item>
                            <el-collapse-item  name="2" style="position:relative;">
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
                                     <el-scrollbar style="height: 20vh">
                                        <el-radio v-model="current_label.label_c_current" size="mini" border
                                            style="margin-left:0px;margin-right:0px" v-for="(item,index) in label_c" :key="index" @change="radio_c_change" 
                                            :label="item.children" :disabled="judge_disabled(item)" >
                                        {{item.children}} <span style="color:white;background-color: #409EFF;">{{(item.keyValue.toString()==''||item.keyValue.toString()==null)?'':'['+item.keyValue+']'}}</span>
                                        </el-radio>
                                    </el-scrollbar>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
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
                        <el-button type="success" style="width:76%" id="addDataButton" @click="add_data">保存记录(空格)</el-button>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import index from './index_js.js'
    export default index
</script>

<style>
    @import url("./index_css.css");
</style>