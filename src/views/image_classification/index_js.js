
import axios from 'axios'  // 安装axios后引入
import config_json from '../../../config.json'  // 安装axios后引入
import dao from "@/api/dao";
import Papa from 'papaparse'
import dataStatistics from '@/views/image_classification/components/dataStatistics.vue'
export default {
    components: {
        dataStatistics,
    },
    data() {
        return {
            axios: axios,
            config_json: config_json,
            add_label: {
                add_label_f: '',
                add_label_c: '',     // 添加标签时的父子级标签
            },
            current_label: {
                label_f_current: '',
                label_c_current: '', //当前选中的父 子 级标签
                label_age_current: '',//当前选中得年龄
                label_sex_current: '',//当前选中得性别
                label_action_current: [],//当前的行为列表
                current_num: 1   //当前物种的数量
            },
            multipleSelection_c: '',//多选二级标题时的数组
            multipleSelection_f: '',//多选一级标题时的数组
            del_tab_activeName: 'first', //  删除标题组对话框中tab切换
            explain_dialogVisible: false,//操作说明的对话框
            feedback_dialogVisible: false,//反馈的对话框
            data_statistics_dialogVisible: false,//统计数据的对话框
            cloud_label_dialog: false, //云端标签的对话框
            dataStatistics: {        //统计数据中：加载和其中的数据
                flag: false,
                datas: [],
            },
            dialogVisible_setting_del: false,// 删除按钮的对话框
            dialogVisible_setting_bind: false,//设置 的对话框
            activeNames_f_and_c_labels: ['1', '2'],    //一二级标签得折叠面板的活跃索引
            activeNames_individual_attributes: ['1'],//个体行为得折叠面板的活跃索引
            imgList: [{ file: "empty", src: require('../../assets/emptyImg.png') }],//    关键的文件数组
            list: [],

            current: 1,//当前图片索引
            percentage: 0,//进度条
            keyUpValue: '',
            keyMap: [],

            // Tip: 按键与键盘对照表数值差96   如 0的keycode=96  2的keycode=98
            available_key_value: [{ index: 0, val: false }, { index: 1, val: false }, { index: 2, val: false }, { index: 3, val: false }, { index: 4, val: false }, { index: 5, val: false },
            { index: 6, val: false }, { index: 7, val: false }, { index: 8, val: false }, { index: 9, val: false }],
            keyArray: [false, false, false, false, false, false, false, false, false, false],        // 表示从0-9的按键是否已被占用

            cloudLabel: [],
            label_f: [],
            label_c: [],     // 格式：[{father:‘鸟类’,children:‘小小鸟’,keyValue:''},{},{}...]
            label_age: ['未知', '幼年', '青年', '成年'],
            label_sex: ['未知', '雄性', '雌性'],

            inputVisible: false,//添加新行为时的new tag是否可见
            inputValue: '',//输入的新new tag

            csv_list: [], //缓存中的csv信息
            csvId: 1,//csv中的ID 
            current_data: [],    //当前照片的多记录信息{"img_name": "IMAG0001.JPG","year": 2019,"month": "06",
            //"date": "15","hour": "05","minute": "52","second": "23","label_f": "兽类","label_c": "老虎",
            //"age": "未知","gender": "未知","action": "1;","num": 1,"csvId": 2}
            current_data_model: '',//当前照片多记录信息中展示的是哪个
            imgNameAndIndexList: [],//图片名加索引数组[{imageName:oo1.jpg,index:1},{},{}]这样的数组
            empty_label_imgs: [],    //  空标签的照片们
            no_empty_label_imgs: [], //  有标签的照片们  {imgName:item.imgName,imgIndex:item.imgIndex,deleted:true}
            activeNames: []  //// 折叠面板

        }
    },
    created() {
        this.keyDown();
    },
    beforeDestroy() {
        this.keyDownReview()
    },
    methods: {
        //上传现有的标签组
        upload_now_lebels(){
            let islogin = sessionStorage.getItem("user");
            islogin = JSON.parse(islogin);
            if (!islogin) {
                this.$confirm("请先登录", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                })
                .then(() => {
                    this.$router.push("/login");
                })
                .catch(() => {
                    // vm.$router.push("/home");
                });
            }else{
                // console.log(islogin.name);
                this.$prompt('标题组命名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    if (value == '' || value == 'null' || value == null) {
                        this.$message({
                            type: 'danger',
                            message: '命名失败'
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: '标题组名为: ' + value + '，已上传！'
                        });
                        dao.upload_now_lebels(islogin.name,value,JSON.stringify(this.label_c)).then(res => {
                            console.log(res);
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
                
            }
        },
        handleOpen(key, keyPath) {
            console.log("handleOpen", key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log("handleClose", key, keyPath);
        },
        //获取验证码
        getCode() {
            dao.getCode().then(res => {
                console.log("获取验证码", res);
            })
        },

        //测试登录
        login() {
            dao.login().then(res => {
                console.log("测试登录", res
                );
            })
        },
        //点击操作说明后获取环境变量然后跳转
        explain_href() {
            var address = this.config_json.docs.address
            var port = this.config_json.docs.port
            window.open('http://' + address + ':' + port);
            // this.axios.get('http://'+address+':'+port).then(res => {   
            //     console.log(res)
            //     window.open('http://'+address+':'+port);
            // })
        },
        //再次点击一个多信息按钮后取消该按钮的选择
        handleRadioClick_current_data_model(val) {
            this.current_data_model === val ? this.current_data_model = '' : this.current_data_model = val
            if (this.current_data_model === '') {
                this.empty_current_labels('changeIndex')
            }
        },
        //清空属性栏
        empty_current_labels(val) {
            //当没有选择多记录时为清空
            if (this.current_data_model == '') {
                this.current_label.label_f_current = ''
                this.current_label.label_c_current = ''
                this.current_label.label_age_current = ''
                this.current_label.label_sex_current = ''
                this.current_label.label_action_current = []
                this.current_label.current_num = 1
                if (val != 'changeIndex') {       //表示 不是在切换图片时执行的此函数
                    this.$message({
                        message: '清空成功！',
                        type: 'success'
                    });
                }

            } else if (val != 'changeIndex') {     //表示 不是在切换图片时执行的此函数  且否则为删除该记录
                this.$confirm('您处于选中某记录的状态，您确定删除当前记录吗？', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            var data = this.current_data.find(a => a.csvId == this.current_data_model)
                            var index = this.csv_list.indexOf(data)
                            this.csv_list.splice(index, 1)        //删除该记录    
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                        }

                    }
                })
            }
        },
        // 上一张空
        pre_empty() {
            for (let i = this.current - 1 - 1; i >= 0; i--) {
                if (this.empty_label_imgs[i].exist == true) { //前面的如果有非空的
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
        next_empty() {
            for (let i = this.current - 1 + 1; i < this.empty_label_imgs.length; i++) {
                if (this.empty_label_imgs[i].exist == true) { //后面的如果有非空的
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
        pre_not_empty() {
            for (let i = this.current - 1 - 1; i >= 0; i--) {
                if (this.no_empty_label_imgs[i].exist == true) { //前面的如果有非空的
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
        next_not_empty() {
            for (let i = this.current - 1 + 1; i < this.no_empty_label_imgs.length; i++) {
                if (this.no_empty_label_imgs[i].exist == true) { //后面的如果有非空的
                    this.gotoIndex(i)
                    return
                }
            }
            this.$message({
                type: 'warning',
                message: '已无非空图片！'
            });
        },
        handle(event) {
            let file = event.raw;
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                const jsonDataArray = Papa.parse(result, { header: true }).data;
                for (let i = 0; i < jsonDataArray.length - 1; i++) {
                    const jsonData = jsonDataArray[i];
                    console.log("jsonData", jsonData);
                    if (
                        jsonData.Y === "\t" &&
                        jsonData.M === "\t" &&
                        jsonData.D === "\t" &&
                        jsonData.h === "\t" &&
                        jsonData.m === "\t" &&
                        jsonData.s === "\t" &&
                        jsonData.tag1 === "\t" &&
                        jsonData.tag2 === "\t" &&
                        jsonData.age === "\t" &&
                        jsonData.gender === "\t" &&
                        jsonData.action === "\t" &&
                        jsonData.num === "\t"
                    ) continue
                    const newCsv = {
                        img_name: jsonData.img_name.trim(),
                        year: parseInt(jsonData.Y),
                        month: jsonData.M.trim(),
                        date: jsonData.D.trim(),
                        hour: jsonData.h.trim(),
                        minute: jsonData.m.trim(),
                        second: jsonData.s.trim(),
                        label_f: jsonData.tag1.trim(),
                        label_c: jsonData.tag2.trim(),
                        age: jsonData.age.trim(),
                        gender: jsonData.gender.trim(),
                        action: jsonData.action.trim(),
                        num: parseInt(jsonData.num),
                        csvId: this.csv_list.length + 1
                    };
                    this.csv_list.push(newCsv);
                }
            };
            reader.readAsText(file);
            // console.log(this.csv_list);
        },
        //点击导出按钮后
        export_csv() {
            // this.current_data_model = ''
            var dirName = this.imgList[0].file.webkitRelativePath.split("/")[0]
            var value = ''
            this.$prompt('请命名该文件(如果不命名，则会使用读取的文件夹名称作为csv文件名)', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                if (value == '' || value == 'null' || value == null) {
                    this.$message({
                        type: 'success',
                        message: '文件名为: ' + dirName
                    });
                    this.create_csv(this.csv_list, dirName)
                } else {
                    this.$message({
                        type: 'success',
                        message: '文件名为: ' + value
                    });
                    this.create_csv(this.csv_list, value)
                }
                // console.log(this.csv_list);

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });

        },
        //导出csv
        create_csv: function (data, name) {
            // 列标题，逗号隔开，每一个逗号就是隔开一个单元格
            let str = 'index,img_name,Y,M,D,h,m,s,tag1,tag2,age,gender,action,num\n'
            // 增加\t为了不让表格显示科学计数法或者其他格式
            // 需要导出与列对应的字段，因为列标题已固定，若不声明，json数据中的字段位置不固定循环拼接后不是列标题的顺序导致标题与值导出后不对应
            // 并可自定义导出字段
            const needs = ['img_name', 'year', 'month', 'date', 'hour', 'minute', 'second',
                'label_f', 'label_c', 'age', 'gender', 'action', 'num']

            //根据csv_list,生成一个字典：字典的键为图片名，如果这个图片在csv_list中，就添加他的value，（可能有多个value，value为数组。）图片不在，他的value就为空数组
            console.log(this.empty_label_imgs);
            this.empty_label_imgs.filter(a => a.exist == true).map(a => a.imgName).forEach(empty => {
                var a = {}
                let img = this.imgList.find(a => a.file.name == empty)
                var dt = new Date(img.file.lastModifiedDate);
                a.img_name = empty
                a.year = dt.getFullYear();
                a.month = (dt.getMonth() + 1).toString().padStart(2, '0');
                a.date = dt.getDate().toString().padStart(2, '0');
                a.hour = dt.getHours().toString().padStart(2, '0');
                a.minute = dt.getMinutes().toString().padStart(2, '0');
                a.second = dt.getSeconds().toString().padStart(2, '0');
                //父标签''
                a.label_f = ''
                //子标签''
                a.label_c = ''
                //年龄''
                a.age = ''
                //性别''
                a.gender = ''
                //行为
                a.action = []
                a.num = ''
                //csv中记录的最大csvId+1
                a.csvId = this.csvId
                this.csvId += 1
                this.csv_list.push(a)
            })

            for (let i = 0; i < this.csv_list.length; i++) {
                // jsonData[i]每行数据
                // 根据导出字段循环取得每行数据中值
                str += `${(i + 1) + '\t'},`
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
            downloadLink.download = (name + ".csv") || "temp.csv";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            //弹出数据统计
            this.data_statistics()
        },
        //关闭数据统计对话框前
        handleClose_data_statistics_dialogVisible(done) {
            done()
            this.dataStatistics.flag = false
        },
        //数据统计
        data_statistics() {
            this.$confirm('是否查看数据统计信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success '
            }).then(() => {
                //整理数据
                let data = {}
                data['1'] = this.countlabel_f(this.csv_list, 'label_f') //data['1']=[{"name": "鸟","value": 2},{"name": "人","value": 1},{"name": "空","value": 430}]   
                data['1'].forEach(a => {
                    let f_s = this.csv_list.filter(ele => ele.label_f == (a['name'] == '空' ? '' : a['name']))    //得到全部的一级标题为鸟的数组
                    if (data['2']) {  //如果他b不是空的
                        data['2'].push(...this.countlabel_f(f_s, 'label_c'))     //追加所有元素
                    } else {
                        data['2'] = this.countlabel_f(f_s, 'label_c')
                    }
                })
                //组件传值
                this.dataStatistics.datas = data
                //显示组件
                this.dataStatistics.flag = true
                //显示对话框
                this.data_statistics_dialogVisible = true
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消查看'
                });
            });
        },

        /**
         * 统计对象数组中每个对象的name属性出现的次数
         * @param {Array} arr - 对象数组
         * @returns {Array} - 包含每个name属性及其出现次数的对象数组
         */
        countlabel_f(arr, label) {
            let count = {};
            if (label == 'label_f') {
                for (let i = 0; i < arr.length; i++) {
                    if (count[arr[i][label] == '' ? '空' : arr[i][label]]) {
                        count[arr[i][label] == '' ? '空' : arr[i][label]]++;
                    } else {
                        count[arr[i][label] == '' ? '空' : arr[i][label]] = 1;
                    }
                }
            } else if (label == 'label_c') {
                for (let i = 0; i < arr.length; i++) {
                    if (count[arr[i][label] == '' ? 'null' : arr[i][label]]) {
                        count[arr[i][label] == '' ? 'null' : arr[i][label]]++;
                    } else {
                        count[arr[i][label] == '' ? 'null' : arr[i][label]] = 1;
                    }
                }
            }

            let result = [];
            for (let label_f in count) {
                result.push({ name: label_f, value: count[label_f] });
            }

            // The 'result' array now contains the desired output of [{name='sss',value=30},{name='aaa',value=20}...]
            return result;
        },

        //生成一条记录  OR   修改一条记录
        add_data() {
            // console.log(this.csv_list);
            if (this.imgList.length == 1) {
                this.$alert('生成记录前请先上传照片', '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.click_upload()
                    }
                });
            } else {  //已经上传数据集了
                if (this.current_label.label_c_current == '' || this.current_label.label_f_current == '') {
                    this.$message({
                        type: 'danger',
                        message: '请选择标签后进行保存！'
                    });
                    return
                }
                if (this.current_data_model == '') {  //如果现在不是对多记录的修改状态
                    var a = {}
                    //索引
                    var img_index = this.current - 1
                    //名字
                    a.img_name = this.imgList[img_index].file.name
                    //时间
                    var dt = new Date(this.imgList[img_index].file.lastModifiedDate);
                    a.year = dt.getFullYear();
                    a.month = (dt.getMonth() + 1).toString().padStart(2, '0');
                    a.date = dt.getDate().toString().padStart(2, '0');
                    a.hour = dt.getHours().toString().padStart(2, '0');
                    a.minute = dt.getMinutes().toString().padStart(2, '0');
                    a.second = dt.getSeconds().toString().padStart(2, '0');
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
                    if (this.current_label.label_action_current.length != 0) {
                        this.current_label.label_action_current.forEach(item => {
                            if (item != '') {
                                a.action = a.action + item + ';'
                            }
                        })
                    }

                    if (a.action.length >= 1) {
                        a.action = a.action.substring(0, a.action.length - 1)
                    }
                    //数量
                    a.num = this.current_label.current_num
                    a.csvId = this.csvId
                    this.csv_list.push(a)
                    this.$message({
                        type: 'success',
                        message: '保存成功！'
                    });
                    console.log(a);
                    this.csvId += 1
                } else {  //否则就对该多记录进行修改
                    var csvId = this.current_data_model
                    const data = this.csv_list.find(a => a.csvId == csvId)
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
                        data.action = data.action + item + ';'
                    })
                    if (data.action.length >= 1) {
                        data.action = data.action.substring(0, data.action.length - 1)
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
            if (this.del_tab_activeName == 'first') {
                this.multipleSelection_f = val;
            } else {
                this.multipleSelection_c = val;
            }
        },
        // 点击批量删除(标题数组)
        delAll(labels) {
            var arr = []
            //遍历点击选择的对象集合，拿到每一个对象的id添加到新的集合中
            if (this.del_tab_activeName == 'first') {
                arr = this.label_c.filter(a => this.multipleSelection_f.indexOf(a.father) != -1)
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
                                    this.label_c.splice(index, 1)        //删除子元素  
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
            else {
                this.$confirm('确定删除这些标签吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: action => {
                        if (action === 'confirm') {
                            this.multipleSelection_c.forEach(a => {
                                var index = this.label_c.indexOf(a)
                                this.label_c.splice(index, 1)        //删除子元素  
                                if (a.keyValue != "") {
                                    this.empty(index, a.keyValue.toString(), this.label_c)   //清空按键绑定
                                }
                            })
                        }
                    }
                })
            }

        },
        // 对删除标题组中切换不同的tab事件
        handleClick(tab, event) {
            console.log(tab, event);
            // console.log(this.del_tab_activeName);
        },
        // 清空一个按键绑定
        empty(index, keyValue, rows) {
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
                        this.label_c.forEach((item, index) => {
                            if (item.father == f_label) {
                                this.label_c.splice(index, 1)
                                console.log(item, index);
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
        setting_Sec_Label() {
            console.log('点击了设置按钮');
        },
        downLoad_Sec_Label() {
            this.cloud_label_dialog = true
        },
        // 关闭设置的对话框的事件
        handleClose(done) {
            // this.$confirm('确认关闭？').then(_ => {done();}).catch(_ => {});
            // done();
            // this.dialogVisible_setting_bind=false
        },
        //  添加一个二级标签（同时可能添加一级标签）
        add_a_label_c() {
            if (this.add_label.add_label_f == '' || this.add_label.add_label_c == '') {
                this.$message({
                    message: '请将一级标签和二级标签信息完善！',
                    type: 'warning'
                });
            } else {
                // 如果新添的二级标签和一级标签都已经存在（注意是正好搭配存在）
                if (this.label_c.find(a => a.children == this.add_label.add_label_c) && this.label_c.find(a => a.father == this.add_label.add_label_f)) {
                    this.$message({
                        message: '该二级标签已存在！',
                        type: 'danger'
                    })
                } else {
                    // 如果是新的  则添加
                    this.label_c.push({ father: this.add_label.add_label_f, children: this.add_label.add_label_c, keyValue: '' })
                    this.$message({
                        message: '二级标签添加成功！',
                        type: 'success'
                    })
                }
            }
        },

        //再次点击一个一级标签后取消一个一级标签的选择
        handleRadioClick_f(val) {
            this.current_label.label_f_current === val ? this.current_label.label_f_current = '' : this.current_label.label_f_current = val
            this.radio1Change()
        },
        //再次点击一个二级标签后取消一个二级标签的选择
        handleRadioClick_c(val) {
            this.current_label.label_c_current === val ? this.current_label.label_c_current = '' : this.current_label.label_c_current = val
        },
        //  添加一个一级标签
        add_a_label_f() {
            if (!this.label_f.includes(this.add_label.add_label_f)) {
                this.label_f.unshift(this.add_label.add_label_f)
            }
            this.$refs.add_label_c.focus();
        },
        // 二级标签选中后，自动去选择一级标签
        radio_c_change() {
            var a = this.label_c.find(a => a.children == this.current_label.label_c_current)      //查询当前选中的二级标题
            this.current_label.label_f_current = a.father

            //取消elementui的空格自动选中按钮设置
            this.$nextTick(() => {
                document.getElementById("addDataButton").focus();
            });
        },
        //监听一级标签变化的方法
        //一级标签改变后 去禁用二级标签
        radio1Change() {
            this.current_label.label_c_current = ''
        },
        // 判断该二级标签是否禁用
        judge_disabled(value) {

            if (this.current_label.label_f_current == "") {
                return false
            } else if (value.father == this.current_label.label_f_current) {   //如果当前这个大类的
                return false
            } else {
                return true
            }
        },
        // 当前展示图片发生变化
        imgChange(index) {
            this.current = (index == 0 ? 1 : index + 1)
            this.percentage = Math.round((this.current / this.imgList.length) * 100)
            this.changeCurrentData()
        },
        //展示图片发生变化时 更新属于该图片的物种属性
        changeCurrentData() {
            // 过滤出属于该图片的记录
            var img_name = this.imgList[this.current - 1].file.name
            this.current_data = this.csv_list.filter(item => item.img_name == img_name)
            if (this.current_data != '') {
                this.current_data_model = this.current_data[0].csvId
            }
            else {   //该图片没有属性记录
                this.current_data_model = ''
                this.empty_current_labels('changeIndex')
            }

        },
        cloud_label() {
            this.cloudLabel = dao.cloudLabel()
            // console.log(this.cloudLabel);
        }
        ,
        //上传LabelCSV文件时的方法
        select_LabelCsv(event) {
            //先选择时清空现有的还是新增
            const that = this
            let fileList = event.target.files
            // console.log("fileList", fileList);
            //var input = document.getElementById("fileOutput");
            // var input = document.querySelector('input[type = "file"]')
            var file = fileList[0];
            var reader = new FileReader();
            var output;
            reader.onload = function (e) {
                var csvToText = e.target.result;
                output = that.csvToJSON(csvToText);
                // console.log(output);
            };
            reader.readAsText(file);
            event.preventDefault();
        },
        // 下载LableCSV
        downCsv() {
            const csvContent = [];
            csvContent.push(['tag1', 'tag2']);
            this.label_c.forEach(label => {
                csvContent.push([label.father, label.children]);
            });
            const csvContentStr = csvContent.map(row => row.join(',')).join('\n');
            const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvContentStr);
            const downloadLink = document.createElement('a');
            downloadLink.href = uri;
            downloadLink.download = 'temp.csv';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },
        selectCsv(event) {
            const that = this;
            let fileList = event.target.files;
            if (!fileList || fileList.length === 0) {
                // handle error
                return;
            }
            var file = fileList[0];
            var reader = new FileReader();
            var output;
            reader.onload = function (e) {
                var csvToText = e.target.result;
                output = that.csvToJSON(csvToText);
                console.log(output);
                that.csv_list = output;
            };
            reader.readAsText(file);
            event.preventDefault();
        },
        csvToJSON(csv) {
            var lines = csv.split("\n");
            var result = [];
            var headers;
            headers = lines[0].split(",");
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                if (lines[i] == undefined || lines[i].trim() == "") {
                    continue;
                }
                var words = lines[i].split(",");
                for (var j = 0; j < words.length; j++) {
                    if (words[j].indexOf("\r") != -1) {
                        var reg1 = new RegExp("\r", "g");
                        words[j] = words[j].replace(reg1, "");
                    }
                    obj[headers[j].trim()] = words[j];
                }
                result.push(obj);
            }
            return result;
        },
        //csv文件转为对象数组的方法
        csvToJSON(csv) {
            var lines = csv.split("\n");
            var result = [];
            var headers;
            headers = lines[0].split(",");

            for (var i = 1; i < lines.length; i++) {
                var obj = {};

                if (lines[i] == undefined || lines[i].trim() == "") {
                    continue;
                }

                var words = lines[i].split(",");
                for (var j = 0; j < words.length; j++) {
                    if (words[j].indexOf("\r") != -1) {
                        var reg1 = new RegExp("\r", "g"); // 加'g'，删除字符串里所有的"a"
                        words[j] = words[j].replace(reg1, "");
                    }
                    obj[headers[j].trim()] = words[j];
                }
                result.push(obj);
            }
            result.forEach(a => {
                if (this.label_f.indexOf(a.tag1) == -1) {   //如果现有的父标签数组里不含有这个父标签 则添加
                    this.label_f.push(a.tag1)
                }
                this.label_c.push({ father: a.tag1, children: a.tag2, keyValue: '' })
            })
        },
        // 初始化加载图片
        selectPhoto(event) {
            let fileList = event.target.files
            var tempList = []
            for (let i = 0; i < fileList.length; i++) {
                if (fileList[i].type == 'image/gif' || fileList[i].type == 'image/png' || fileList[i].type == 'image/jpeg' || fileList[i].type == 'image/jpg' || fileList[i].type == 'image/bmp') {
                    let fileUrl = URL.createObjectURL(fileList[i]);  // 获取文件url
                    tempList.push({ file: fileList[i], src: fileUrl }) // data中显示的图片url 
                }
            }
            this.imgList = tempList
            event.target.value = "" // 解决不能选同一个文件
            this.imgChange(0)
            this.imgNameAndIndexList = []
            //生成一个 [{imageName:oo1.jpg,index:1},{},{}]这样的数组
            tempList.forEach((item, index) => {
                this.imgNameAndIndexList.push({
                    imgName: item.file.name,
                    imgIndex: index + 1
                })
            })
            //将空标签照片数组初始化
            this.empty_label_imgs = []
            this.no_empty_label_imgs = []
            this.imgNameAndIndexList.forEach((item, index) => {
                this.empty_label_imgs.push({ imgName: item.imgName, imgIndex: item.imgIndex, exist: true })
                this.no_empty_label_imgs.push({ imgName: item.imgName, imgIndex: item.imgIndex, exist: false })
            })
            //清空csv数据列表
            this.csv_list = []
            this.csvId = 1
            // console.log(this.imgList);
        },
        // 点击了“上传文件”按钮
        click_upload() {
            this.$refs.upload_input.click()
        },
        //点击了上传csv标题组的按钮
        click_upload_csv() {
            this.$refs.upload_csv_input.click()
        },
        // 前一张图片（翻页组件中的）
        prev() {
            this.$refs.carousel.prev()
        },
        // 后一张图片（翻页组件中的）
        next() {
            this.$refs.carousel.next()
        },
        // 跳转至指定图片索引
        gotoIndexByInput() {
            this.$refs.carousel.setActiveItem(this.keyUpValue - 1)
        },
        gotoIndex(index) {
            this.$refs.carousel.setActiveItem(index)
        },
        // 键盘监听事件失效
        keyDownReview() {
            document.onkeydown = function (event) {
                var e = event || window.event;
                e.returnValue = true;
            }
        },
        //按钮监听键盘
        keyDown() {
            // console.log("开始监听");
            //监听键盘按钮
            let that = this
            let spacePressed = false; // 添加一个变量来记录空格键是否被按下
            document.onkeydown = function (event) {
                var e = event || window.event;
                var keyCode = e.keyCode || e.which;
                switch (keyCode) {
                    case 65:    // A
                        that.prev()
                        break
                    case 37:
                        that.prev()
                        break;
                    case 68:
                        that.next()
                        break;
                    case 39:
                        that.next()
                        break;
                    case 32:
                        if (!spacePressed) { // 如果空格键没有被按下
                            that.add_data();
                            spacePressed = true; // 将空格键状态设置为已按下
                        }
                        break;
                    default:
                        break;
                }
                // 监听绑定二级标签的按键
                if (keyCode <= 57 && keyCode >= 48) {
                    that.label_c.forEach(item => {
                        if (item.keyValue == (keyCode - 48).toString()) {
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
            document.onkeyup = function (event) { // 添加一个keyup事件监听器
                var e = event || window.event;
                var keyCode = e.keyCode || e.which;
                if (keyCode === 32) { // 如果松开的是空格键
                    spacePressed = false; // 将空格键状态设置为未按下
                }
            }
        },


    },
    watch: {

        //多记录中的物种属性变化时的事件
        current_data_model: {
            handler(new_val, old_val) {
                if (new_val != '') {
                    var current = this.current_data.find(a => a.csvId == new_val)
                    this.current_label.label_f_current = current.label_f
                    this.current_label.label_c_current = current.label_c
                    this.current_label.label_age_current = current.age
                    this.current_label.label_sex_current = current.gender
                    if (current.action != '') {
                        this.current_label.label_action_current = current.action.split(";")
                    } else {
                        this.current_label.label_action_current = []
                    }
                    this.current_label.current_num = current.num
                }
            }
        },
        label_c: {
            handler(new_val, old_val) {
                var key_vlaues = new_val.map(a => a.keyValue)   //将所有二级标签的keyvalue都赋值给key——values
                key_vlaues = key_vlaues.filter(function (s) {      //过滤器 过滤“” 和 null
                    s = s.toString()
                    return s && s.trim();
                });
                // console.log(key_vlaues);

                this.available_key_value.forEach((item) => {
                    if (key_vlaues.indexOf(item.index) != -1) {
                        this.available_key_value[item.index].val = true // 将已赋值过的二级标签按键从选择器的options中删除
                    } else {
                        this.available_key_value[item.index].val = false // 将已赋值过的二级标签按键从选择器的options中添加
                    }
                })
            },
            deep: true
        },
        csv_list: {
            handler(new_val, old_val) {
                // 过滤出属于该图片的记录
                this.changeCurrentData()
                //每次生成都去更新 空标签图片 和 非空标签图片 这两个数组
                var no_empty_img_set = new_val.map(a => a.img_name)
                var no_empty_img_names = Array.from(new Set(no_empty_img_set))  //给csvlist里面的名字们去重 这里面都是非空的图片了
                for (let [index1, item1] of no_empty_img_names.entries()) {
                    for (let [index2, item2] of this.no_empty_label_imgs.entries()) {
                        if (item1 == item2.imgName) {
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
            deep: true
        }

    },
    filters: {
        // 这是时间戳转换的函数
        formatDate: function (value, args) {
            var dt = new Date(value);
            if (args == 'yyyy-M-d') {// yyyy-M-d
                let year = dt.getFullYear();
                let month = dt.getMonth() + 1;
                let date = dt.getDate();
                return `${year}-${month}-${date}`;
            } else if (args == 'yyyy-M-d H:m:s') {// yyyy-M-d H:m:s
                let year = dt.getFullYear();
                let month = dt.getMonth() + 1;
                let date = dt.getDate();
                let hour = dt.getHours();
                let minute = dt.getMinutes();
                let second = dt.getSeconds();
                return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
            } else if (args == 'yyyy-MM-dd') {// yyyy-MM-dd
                let year = dt.getFullYear();
                let month = (dt.getMonth() + 1).toString().padStart(2, '0');
                let date = dt.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${date}`;
            } else {// yyyy-MM-dd HH:mm:ss
                let year = dt.getFullYear();
                let month = (dt.getMonth() + 1).toString().padStart(2, '0');
                let date = dt.getDate().toString().padStart(2, '0');
                let hour = dt.getHours().toString().padStart(2, '0');
                let minute = dt.getMinutes().toString().padStart(2, '0');
                let second = dt.getSeconds().toString().padStart(2, '0');
                return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
            }
        }
    }
}
