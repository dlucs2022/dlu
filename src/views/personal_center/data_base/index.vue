<template>
    <div class="file_container">
        <el-form :model="queryParams" ref="queryParams" size="small" :inline="true" style="margin:20px auto">
            <el-form-item label="文件夹名称">
                <el-input placeholder="文件名称" v-model="queryParams.folderName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="queryFolderByFileName">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="list">重置</el-button>
            </el-form-item>
        </el-form>

        <div style="margin-top: 10px" @click="addFolderShow = false;folderShow = false"
                @contextmenu.prevent.stop="rightClick($event)">
            <el-card class="drawing_card" v-loading="cardLoading" style="height: 600px">
                <template v-if="folderList.length === 0">
                    <el-empty description="暂无文件，请右键创建一个文件夹吧" style="height: 600px"></el-empty>
                </template>
                <div v-for="(item,index) in folderList" :key="item.path">
                    <div class="folderContainer">
                        <div v-if="item.type == 0" class="folderWrapper" @dblclick="ondblclickFile(item.path,item.file_name)"
                            @contextmenu.prevent.stop="rightClickFolder(index,item,$event)">
                        <div class="folder">
                            <div class="front">
                                <div class="bar" v-show="!Math.round((item.progress/item.file_number)*100) == 0">
                                    <el-progress type="circle" :width=70  :stroke-width=8 :percentage="Math.round((item.progress/item.file_number)*100)" 
                                    :color="customColorMethod" ></el-progress>
                                </div>
                            </div>
                            <div class="center"></div>
                            <div class="back"></div>
                        </div>
                        <div class="folderName">
                            <span>{{
                                item.file_name.length > 10 ? item.file_name.substring(0, 6) + '...' : item.file_name
                            }}</span>
                        </div>
                        <div class="folderTime">
                            <span>{{ item.create_time }}</span>
                        </div>
                        <div class="progress">
                            {{item.progress}}/{{item.file_number}}
                        </div>
                        
                        
                        </div>
                        <div v-else class="folderWrapper" @dblclick="down(item.fileUrl)">
                        <img src="@/assets/imgs/file/fileImg.png" style="width: 100px;height: 90px;margin-top: -13px"
                            @contextmenu.prevent.stop="rightClickFolder(index,item,$event)"/>
                        <div class="folderName">
                            <span>{{
                                item.file_name.length > 10 ? item.file_name.substring(0, 6) + '...' : item.file_name
                            }}</span>
                        </div>
                        <div class="folderTime">
                            <span>{{ item.create_time }}</span>
                        </div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        
        <add ref="add"></add>

        <div class="add-folder" :style="addFolderStyle" v-show="addFolderShow">
            <div class="add-folder-1">
                <div class="add-folder-2" style="margin-bottom: 5px" @click="addFolder">
                新建文件夹
                </div>
                <div style="border: 2px solid rgba(18,17,42,.07)"></div>
                <div class="add-folder-2" @click="addFile" style="margin-bottom: 5px">
                上传文件
                </div>
                <div style="border: 2px solid rgba(18,17,42,.07)"></div>
                <div class="add-folder-2" @click="list">
                刷 新
                </div>
            </div>
        </div>

        <div class="add-folder-9" :style="folderStyle" v-show="folderShow">
            <div class="add-folder-1">
                <div class="add-folder-2" @click="openFileList">
                {{ type == 0 ? '标注此数据' : '下载文件' }}
                </div>
                <div style="border: 2px solid rgba(18,17,42,.07)"></div>
                <div class="add-folder-2" @click="updateFloder">
                重命名
                </div>
                <div style="border: 2px solid rgba(18,17,42,.07)"></div>
                <div class="add-folder-2" @click="attribute">
                属 性
                </div>
                <div style="border: 2px solid rgba(18,17,42,.07)"></div>
                <div class="add-folder-6" @click="delFloder" style="margin-bottom: 5px">
                删 除
                </div>
            </div>
        </div>

        <add ref="addOne"/>
        <file-attribute ref="fileAttribute"/>
        <!-- <file-list ref="fileList"></file-list> -->
    </div>
</template>
<script>
import fileAttribute from "./fileAttribute";
import add from './addOne'
import dao from '@/api/dao'
import axios from 'axios'
export default {
    components:{
        add,fileAttribute,
    },
    name: 'CompleteMachineDrawing',
    data(){
        return{
            folderList:[        //主要的文件列表

            ],      
            queryParams: {      //查询
                folderName: null,
                consumablesName: null
            },
            addFolderShow : false,
            folderShow : false,
            addFolderStyle: {
                left: '0px',
                top: '0px'
            },
            folderStyle: {
                left: '0px',
                top: '0px'
            },
            cardLoading: false,
            user:JSON.parse(sessionStorage.getItem("user")),
            reName:'',
            type:'',
        }
    },
    created(){
        this.list()
    },
    mounted(){
        
    },
    methods:{
        //查询文件列表
        list() {
            this.cardLoading = true
            setTimeout(() => {
                dao.queryFolderByInviteCode(this.user.invite_code).then(res => {
                    this.folderList = res.data.data
                })
                
                this.cardLoading = false
            }, 500);
            this.addFolderShow = false
        },
        queryFolderByFileName(){
            this.cardLoading = true
            setTimeout(() => {
                dao.queryFolderByFileName(this.user.invite_code,this.queryParams.folderName).then(res => {
                    this.folderList = res.data.data
                })
                this.cardLoading = false
            },1000)
            
        },
        //打开或下载文件
        openFileList() {
            // this.folderShow = false
            // axios.post(this.path).then(res => {
            //     console.log(res);
            // }).catch( e => {

            // })
            if (this.type == 0) {
                this.$router.push({
                    name:  'label_test',
                    params: {
                        path:this.path
                    },

                })
                // this.$refs.fileList.open(this.folderId,this.folderName);
            } else {
                //下载文件
                window.open(this.url, '_blank')
            }
        },
        //上传文件
        addFile() {
            this.addFolderShow = false
            this.$refs.addOne.open();
        },
        //打开文件属性
        attribute() {
            let fileItem = this.folderList.find(a => a.path === this.path)
            
            
            this.$refs.fileAttribute.open(fileItem)
            this.folderShow = false
        },
        
        //重命名
        updateFloder() {
            this.folderShow = false
            this.$prompt('请输入文件夹名称', {
                inputValue: this.reName,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                // this.folderList[this.dataIndex].file_name = value
                dao.fileRename(this.path,value).then(res => {
                    console.log(res);
                    if(res.data.message == 'success'){
                        this.$message({
                        type: 'success',
                        message: '重命名成功!'
                        });
                    }else{
                        this.$message({
                        type: 'error',
                        message: '修改失败请重试!'
                        });
                    }
                })
                this.list()
            }).catch(() => {
                this.folderList[this.dataIndex].folderName = this.folderName
            });
        },
        //删除文件
        delFloder() {
            this.folderShow = false
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                dao.deleteFileByPath(this.path).then(res => {
                    if(res.data.data == 'success'){
                        this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                    }else{
                        this.$message({
                        type: 'error',
                        message: '删除失败请重试!'
                        });
                    }
                })
                this.list()
            }).catch(() => {
            });
        },
        //进度条颜色控制
        customColorMethod(percentage) {
            if (percentage < 25) {
                return '#f56c6c'
            } else if (percentage < 50) {
                return '#e6a23c';
            }else if (percentage < 75) {
                return '#1989fa';
            } else {
                return '#67c23a';
            }
        },
        //文件列表右键
        rightClick(e) {
            this.addFolderStyle.left = e.pageX + 'px'
            this.addFolderStyle.top = e.pageY + 'px'
            this.addFolderShow = true
            this.folderShow = false
        },
        //创建文件夹
        addFolder() {
            this.addFolderShow = false
            let o = {
                folderName: '',
                type: 0,
                createTime: new Date().format('yyyy/MM/dd hh:mm:ss'),
                progress:0,
                total:0,
            }
            this.folderList.push(o);
            this.$prompt('请输入文件夹名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                this.folderList[this.folderList.length - 1].folderName = value;
                /* postData("/folder/add", {folderName: value, type: 0}).then(res => {
                if (res.code == 200) {
                    this.$message({
                    type: 'success',
                    message: '创建成功 '
                    });
                } else {
                    this.$message({
                    type: 'error',
                    message: '创建失败 '
                    });
                    this.folderList.splice(this.folderList.length - 1, 1);
                }
                }) */
            }).catch(() => {
                this.folderList.splice(this.folderList.length - 1, 1);
            });
        },
        //文件夹右键
        rightClickFolder(index, item, e) {
            this.file_name = item.folderName
            this.folderId = item.id
            this.type = item.type
            this.url = item.fileUrl
            this.path = item.path
            this.dataIndex = index
            this.folderStyle.left = e.pageX + 'px'
            this.folderStyle.top = e.pageY + 'px'
            this.folderShow = true
            this.addFolderShow = false
        },
        //双击下载文件
        down(fileUrl){
            window.open(fileUrl, '_blank')
        },
        //双击打卡文件夹
        ondblclickFile(id,folderName) {
            this.$refs.fileList.open(id,folderName);
        },
    }

}

Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
</script>
<style>
    @import url("./css/file_icon.css");
</style>