<template>
  <div id="fabricCanvas">
    <el-dialog
      title="正在识别，请稍后"
      :visible.sync="pregress_dialogVisible"
      width="40%"
    >
      <div>
        <el-progress
          :percentage="percentage"
          :text-inside="true"
          :stroke-width="30"
          :color="customColorMethod"
          :format="progress_format"
        ></el-progress>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pregress_dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pregress_dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <div
      id="pic-label"
      v-loading="cardLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 1)"
    >
      <div class="canvasDraw">
        <input
          id="upload"
          webkitdirectory
          type="file"
          name="file"
          ref="upload_input"
          tabindex="-1"
          style="display: none"
          @change.stop="selectPhoto($event)"
        />
        <div
          class="top"
          style="display: flex; justify-content: space-between; align-items: center"
        >
          <el-button @click="getData" style="float: left">导出文件</el-button>
          <i v-if="this.imgList.length != 0">{{ img_name() }}</i>
          <el-button @click="getAiByRootPath" style="float: right">智能标注</el-button>
        </div>

        <div class="context__x">
          <canvas ref="canvas" id="labelCanvas"> </canvas>
          <!-- 编辑和删除弹窗 -->
          <div
            id="menu"
            class="menu-x"
            v-show="showCon"
            :style="menuPosition"
            @contextmenu.prevent=""
            ref="menu"
          >
            <div>
              <ul>
                <li v-for="(item, index) in tagData" @click="changeTag(item)">
                  {{ item.value }}
                </li>
              </ul>
            </div>
            <div class="del" @click="delEl">删除</div>
          </div>
        </div>
        <div
          class="button"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
          "
        >
          <el-button
            style="float: left; width: 20%"
            :disabled="activeIndex == 0"
            @click="changeimg('pre')"
            type="primary"
            icon="el-icon-arrow-left"
            >上一张</el-button
          >

          <el-progress
            :percentage="percentage_img"
            :stroke-width="20"
            v-if="this.imgList.length != 0"
            :format="setItemText()"
            :text-inside="true"
            :color="customColorMethod"
            style="
              display: inline-block;
              width: 500px;
              margin-left: 1vh;
              border-radius: inherit;
              fontsize: 2px;
            "
          ></el-progress>
          <el-button
            style="float: right; width: 20%"
            :disabled="activeIndex == imgList.length - 1"
            @click="changeimg('next')"
            type="primary"
          >
            下一张<i class="el-icon-arrow-right el-icon--right"></i
          ></el-button>
        </div>
      </div>
      <div class="tagCon">
        <div class="tagTitle" v-show="!isAdd">
          <div>标签栏</div>
          <el-button type="primary" size="small" @click="addTag">添加标签</el-button>
        </div>
        <div class="tagDOM tagItem" v-show="isAdd">
          <el-input
            v-model="tagCon"
            ref="addTask"
            @keyup.enter.native="addNewTag"
          ></el-input>
          <el-button type="text" size="small" @click="addNewTag">确定</el-button>
          <el-button type="text" size="small" @click="cancelAdd">取消</el-button>
        </div>
        <!-- 搜索 -->
        <div style="margin-top: 10px">
          <el-input placeholder="请输入"></el-input>
        </div>
        <ul style="margin-top: 15px">
          <el-scrollbar style="height: 70vh">
            <li v-for="(item, index) in tagData" class="tagItem">
              <div v-show="!item.isEdit" class="tagDOM">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.value"
                  placement="right-end"
                >
                  <span @click="changeTag(item)" class="tagName">
                    {{ item.value }}
                  </span>
                </el-tooltip>
                <div class="iconCon">
                  <i class="el-icon-edit editIcon" @click="changeEdit(item, index)"></i>
                  <i class="el-icon-delete delIcon" @click="delTag(item)"></i>
                </div>
              </div>
              <div class="tagDOM" v-show="item.isEdit">
                <el-input
                  v-model="item.value"
                  ref="editTask"
                  @keyup.enter.native="changeText(item)"
                ></el-input>
                <el-button type="text" size="small" @click="changeText(item)"
                  >确定</el-button
                >
                <el-button type="text" size="small" @click="cancelChange(item)"
                  >取消</el-button
                >
              </div>
            </li>
          </el-scrollbar>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { uuid } from "vue-uuid";
import dao from "@/api/dao";

export default {
  data() {
    return {
      activeIndex: 0,
      imgList: [],
      canvasInfo: {
        width: "",
        height: "",
      },
      editorCanvas: "",
      fabricJson: [],
      mouseFrom: {},
      mouseTo: {},
      showCon: false,
      drawingObject: null,
      currentTarget: null,
      menuPosition: null,
      rectId: "",
      activeEl: "",
      isDrawing: false,
      currentType: "rect",
      // 标签栏
      isAdd: false,
      tagCon: "",
      tagData: [
        {
          value: "兽",
          id: 1,
          isEdit: false,
        },
      ],
      imgW: 4000,
      imgH: 3000,
      imgWidth: 0,
      imgHeight: 0,
      xml: [],
      zip: "",
      imgURL_root_path: "",
      pageLoading: false,
      pregress_dialogVisible: false,
      percentage: 0,
      detections: [],
      cardLoading: false,
      progress_total: 0,
      progress_over: 0,
      path: "",
      LSM_label: [
        { en: "cow", cn: "牛" },
        { en: "Goat", cn: "山羊" },
        { en: "Human", cn: "人" },
        { en: "Black snub+AC0-nosed monkey", cn: "滇金丝猴" },
        { en: "Horse", cn: "马" },
        { en: "Pallas's squirrel", cn: "赤腹松鼠" },
        { en: "Indian muntjac", cn: "赤麂 " },
        { en: "Yak", cn: "牦牛" },
        { en: "Tufted deer", cn: "毛冠鹿" },
        { en: "tree shrew", cn: "树鼩" },
        { en: "Chestnut thrush", cn: "灰头鹅 " },
        { en: "Sheep", cn: "绵羊" },
        { en: "Black+AC0-faced laughingthrush", cn: "黑顶噪鹛" },
        { en: "Asian black bear", cn: "亚州黑熊 " },
        { en: "Yellow+AC0-throated marten", cn: "黄喉貂" },
        { en: "Yunnan Hare", cn: "西南兔(云南兔)" },
        { en: "Dog", cn: "狗" },
        { en: "Perny's long+AC0-nosed squirrel", cn: "珀氏长吻松鼠" },
        { en: "Lady Amherst's pheasant", cn: "白腹锦鸡" },
        { en: "Elliot's laughingthrush", cn: "橙翅噪鹛" },
        { en: "Koklass pheasant", cn: "勺鸡 " },
        { en: "Leopard cat", cn: "豹猫" },
        { en: "Giant laughingthrush", cn: "大噪鹛" },
        { en: "Masked palm civet", cn: "果子狸" },
        { en: "Crimson+//0Aof/9AKo-bellied Tragopan", cn: "红腹角雉" },
        { en: "Spotted nutcracker", cn: "星鸦" },
        { en: "Chestnut+AC0-crowned laughingthrush", cn: "红头噪鹛" },
        { en: "Squirrel", cn: "松鼠" },
        { en: "White+AC0-browed bush robin", cn: "白眉林鸲" },
        { en: "Alpine thrush", cn: "黄嘴山鸦" },
        { en: "Long+AC0-tailed thrush", cn: "长尾地鸫" },
        { en: "Maroon+AC0-backed accentor", cn: "栗背岩鹨" },
        { en: "Himalayan bluetail", cn: "蓝眉林鸲" },
        { en: "Temminck's tragopan", cn: "红腹角雉" },
        { en: "Hill partridge", cn: "环颈山鹧鸪 " },
        { en: "Red+AC0-billed chough", cn: "红嘴山鸦" },
        { en: "Darjeeling woodpecker", cn: "黄颈啄木鸟" },
        { en: "Rufous+AC0-bellied niltava", cn: "棕腹仙鹟" },
        { en: "Forest musk deer", cn: "林麝" },
        { en: "Grey+AC0-headed woodpecker", cn: "灰头绿啄木鸟" },
        { en: "Siberian weasel", cn: "黄鼠狼" },
        { en: "Mrs. Hume's pheasant", cn: "黑颈长尾雉" },
        { en: "White+AC0-throated redstart", cn: "白喉红尾鸲" },
        { en: "Cat", cn: "猫" },
        { en: "Chestnut+AC0-bellied rock thrush", cn: "栗腹矶鸫" },
        { en: "Great parrotbill", cn: "红嘴鸦雀" },
        { en: "Yellow+AC0-billed blue magpie", cn: "黄嘴蓝喜鹊" },
        { en: "Blue+AC0-fronted redstart", cn: "蓝额红尾鸲" },
        { en: "Great spotted woodpecker", cn: "大斑啄木鸟" },
        { en: "spotted giant flying squirrel+ADw-U+00D//QA+-", cn: "小鼯鼠" },
        { en: "Swinhoe's striped squirrel", cn: "隐纹花松鼠" },
        { en: "Grey+AC0-winged Blackbird", cn: "灰翅鸫" },
        { en: "Alpine chough", cn: "黄嘴山鸦" },
        { en: "Red+AC0-billed leiothrix", cn: "红嘴相思鸟" },
        { en: "Collared grosbeak", cn: "黄颈拟蜡嘴雀" },
        { en: "Bear", cn: "熊" },
        { en: "White+AC0-browed fulvetta", cn: "白眉雀鹛" },
        { en: "Grey+AC0-sided laughingthrush", cn: "灰胁噪鹛" },
        { en: "Golden bush robin", cn: "金色林鸲" },
        { en: "Plumbeous water redstart", cn: "红尾水鸲" },
        { en: "Yellow+AC0-billed Blue Magpie", cn: "黄嘴蓝鹊" },
        { en: "Naumann's thrush", cn: "红尾鸫" },
        { en: "Orange+AC0-bellied Himalayan squirrel", cn: "橙腹长吻松鼠" },
        { en: "Bianchi+//0Aof/9AK8-s warbler", cn: "比氏鹟莺" },
        { en: "Streak+AC0-breasted scimitar babbler", cn: "棕颈钩嘴鹛" },
        { en: "Indian giant flying squirrel", cn: "霜背大鼯鼠" },
        { en: "Yellow+AC0-browed tit", cn: "黄屑林雀" },
        { en: "Ashy drongo", cn: "灰卷尾" },
        { en: "Grey+AC0-hooded fulvetta", cn: "褐头雀鹛" },
        { en: "Yellow+AC0-bellied weasel", cn: "黄腹鼬" },
        { en: "Rhesus macaque", cn: "猕猴" },
        { en: "White+AC0-bellied woodpecker", cn: "白腹黑啄木鸟" },
        { en: "Besra", cn: "松雀鹰" },
        { en: "Common cuckoo", cn: "大杜鹃" },
        { en: "Mountain bamboo partridge", cn: "棕胸竹鸡" },
        { en: "White+AC0-throated laughingthrush", cn: "白喉噪鹛" },
        { en: "Red+AC0-billed blue magpie", cn: "红嘴蓝鹊" },
        { en: "Snowy+AC0-browed flycatcher", cn: "棕胸蓝鹟" },
        { en: "White+AC0-speckled laughingthrush", cn: "白点鹛" },
        { en: "Eyebrowed thrush", cn: "白眉鸫" },
        { en: "Small Indian Civet", cn: "小灵猫" },
        { en: "Blood pheasant", cn: "血雉" },
        { en: "Black+AC0-necklaced scimitar babbler", cn: "斑胸钩嘴鹛" },
        { en: "Large+AC0-billed crow", cn: "大嘴乌鸦" },
        { en: "Chinese babax", cn: "矛纹草鹛" },
        { en: "Spotted laughingthrush", cn: "眼纹噪鹛" },
        { en: "Small niltava", cn: "小仙鹟" },
        { en: "Chinese thrush", cn: "宝兴歌鸫 " },
        { en: "Assam macaque", cn: "熊猴" },
        { en: "Daurian redstart", cn: "北红尾鸲" },
        { en: "Dark+AC0-backed sibia", cn: "黑背奇鹛" },
        { en: "Red panda", cn: "小熊猫" },
      ],
    };
  },
  mounted() {
    this.queryImgList();
    // 后端返回：图片的长宽 2560 1200 ，用于等比例缩放图片

    // 监听键盘时间，按下backspace进行删除
    document.onkeydown = (e) => {
      let key = window.event.keyCode;
      // console.log("key", key);
      const isEdit = this.tagData.every((item) => item.isEdit == false);
      // console.log("isEdit", isEdit);
      if (key == 8 && isEdit) {
        this.backSpaceDel();
      }
    };
  },
  computed: {
    percentage_img() {
      return Math.floor(((this.activeIndex + 1) / this.imgList.length) * 100);
    },
  },
  methods: {
    img_name() {
      if (this.path == undefined) {
        return this.imgList[this.activeIndex].file.name;
      } else {
        return this.imgList[this.activeIndex].name;
      }
    },
    setItemText(row) {
      return () => {
        return this.activeIndex + 1 + "/" + this.imgList.length;
      };
    },
    progress_format(percentage) {
      return `已处理：${this.progress_over}/${this.progress_total}张 , 进度：${percentage}% `;
    },
    getAiByRootPath() {
      dao.getAiByRootPath(this.imgURL_root_path).then((res) => {
        if (res.data.task_id) {
          this.intervalQuery(res.data.task_id);
        }
      });
    },
    intervalQuery(task_id) {
      this.pregress_dialogVisible = true;
      // this.pageLoading = true
      // 设置整点定时发送请求

      var myVar = setInterval(() => {
        if (this.percentage === 100) {
          this.pregress_dialogVisible = false;
          this.$message({
            message: "识别完成！",
            type: "success",
          });
          this.queryRes(task_id);
          clearInterval(myVar);
          return;
        } else {
          this.queryPregress(task_id);
        }
      }, 1000);
    },
    async queryRes(task_id) {
      this.cardLoading = true;
      await dao.queryRes(task_id).then((res) => {
        console.log(res.data);
        for (let k in res.data.detection) {
          this.detections.push(res.data.detection[k].detections);
        }
      });
      this.createFabricByRes();
      setTimeout(() => {
        this.changeimg("next");
        this.changeimg("pre");
        this.cardLoading = false;
      }, 6000);
    },
    //用于在标签对照表中从英文转为中文
    convertEn(en) {
      let obj = this.LSM_label.find((a) => a.en == en);
      //转换一个，就在右侧标签组里加一个
      this.addLabel(obj.cn);
      return obj.cn;
    },
    //右侧标签组里添加标签
    addLabel(cn) {
      let endId = this.tagData[this.tagData.length - 1].id;
      if (this.tagData.filter((o) => o.value == cn).length == 0) {
        //如果现有的父标签数组里不含有这个父标签 则添加
        this.tagData.push({
          value: cn,
          id: endId + 1,
          isEdit: false,
        });
      }
    },
    createFabricByRes() {
      for (let i = 0; i < this.detections.length; i++) {
        //每个i代表每个图像
        if (i == 0) {
          this.editorCanvas.clear().renderAll();
        }
        this.initeditorCanvas(i);
        for (let j = 0; j < this.detections[i].length; j++) {
          //代表每个图像的每个bbox
          let rectId = uuid.v1();
          this.drawingObject = null;
          let left = this.detections[i][j].bbox[0] * this.canvasInfo.width;
          let top = this.detections[i][j].bbox[1] * this.canvasInfo.height;
          let width = this.detections[i][j].bbox[2] * this.canvasInfo.width;
          let height = this.detections[i][j].bbox[3] * this.canvasInfo.height;
          const drawingObject = new fabric.Rect({
            width: width,
            height: height,
            fill: "rgba(255,255,255,0.3)",
            lockRotation: true,
            opacity: 1,
            rectId,
            lockScalingFlip: true, // 禁止负值反转
            originX: "center",
            originY: "center",
            stroke: "#00fdf8",
            strokeWidth: 1,
            strokeLineJoin: "round",
            lockRotation: true,
          });
          const text = new fabric.Textbox("", {
            // width,
            // height,
            text: this.convertEn(this.detections[i][j].category),
            fontFamily: "Helvetica",
            fill: "white", // 设置字体颜色
            fontSize: 14,
            textAlign: "center",
            rectId,
            lockScalingX: true,
            lockScalingY: true,
            lockScalingFlip: true, // 禁止负值反转
            originX: "center",
            originY: "center",
          });
          if (drawingObject) {
            const group = new fabric.Group([drawingObject, text], {
              rectId,
              left: left,
              top: top,
              width: width,
              height: height,
              lockScalingFlip: true,
              lockRotation: true,
            });
            this.editorCanvas.add(group);
            // console.log("this.editorCanvasssssssssss", this.editorCanvas);

            this.drawingObject = drawingObject;
          }
        }
        this.fabricJson[i] = JSON.stringify(
          this.editorCanvas.toJSON(["rectId", "textID", "lockScalingFlip"])
        );
        this.editorCanvas.clear().renderAll();
      }
      if (this.fabricJson[this.activeIndex] !== "") {
        this.editorCanvas.loadFromJSON(
          this.fabricJson[this.activeIndex],
          this.editorCanvas.renderAll.bind(this.editorCanvas),
          function (o, object) {}
        );
      }
      this.fabricJson.forEach((a) => {
        console.log(JSON.parse(a));
      });
    },
    customColorMethod(percentage) {
      if (percentage < 30) {
        return "#909399";
      } else if (percentage < 70) {
        return "#e6a23c";
      } else {
        return "#67c23a";
      }
    },
    queryPregress(task_id) {
      dao.queryPregress(task_id).then((res) => {
        this.percentage = parseInt(res.data.progress * 100);
        this.progress_over = res.data.processed;
        this.progress_total = res.data.total;
        return parseInt(res.data.progress * 100);
      });
    },
    changeimg(change) {
      if (change === "pre") {
        this.fabricJson[this.activeIndex] = JSON.stringify(
          this.editorCanvas.toJSON(["rectId", "textID", "lockScalingFlip"])
        );

        this.activeIndex -= 1;
        // this.fabricJson[i-1] = JSON.stringify(this.fabricObj);
        this.editorCanvas.clear().renderAll();
        this.initeditorCanvas(this.activeIndex);
        let a = this.fabricJson;
        if (this.fabricJson[this.activeIndex] !== "") {
          this.editorCanvas.loadFromJSON(
            this.fabricJson[this.activeIndex],
            this.editorCanvas.renderAll.bind(this.editorCanvas),
            function (o, object) {}
          );
        }
      } else {
        this.fabricJson[this.activeIndex] = JSON.stringify(
          this.editorCanvas.toJSON(["rectId", "textID", "lockScalingFlip"])
        );

        // console.log(JSON.stringify(this.fabricJson));

        this.activeIndex += 1;

        // this.fabricJson[i-1] = JSON.stringify(this.fabricObj);
        this.editorCanvas.clear().renderAll();
        this.initeditorCanvas(this.activeIndex);
        let a = this.fabricJson;
        if (this.fabricJson[this.activeIndex] !== "") {
          this.editorCanvas.loadFromJSON(
            this.fabricJson[this.activeIndex],
            this.editorCanvas.renderAll.bind(this.editorCanvas),
            function (o, object) {}
          );
        }
      }
    },
    //请求图片地址
    async queryImgList() {
      this.path = this.$route.params.path;
      // 本地
      if (this.path == undefined) {
        this.cardLoading = true;
        this.$alert(
          '您进入的标注页面现只支持手动标注本地数据，若要使用智能标注，请从"云数据"页面通过上传文件夹后进行标注。',
          "注意！",
          {
            confirmButtonText: "确定",
            callback: (action) => {
              this.$refs.upload_input.click();
              /* this.$message({
              type: 'info',
              message: `action: ${ action }`
            }); */
            },
          }
        );
      }
      // 云端
      else {
        this.imgURL_root_path = this.path;
        let splitPath = this.path.split("/").slice(-2);
        let ending = splitPath[0] + "/" + splitPath[1] + "/";
        // console.log(splitPath);
        await dao.queryImgList(this.path).then((res) => {
          if (res.data.message == "success") {
            for (let i = 0; i < res.data.data.length; i++) {
              // +"?"+Date.parse(new Date())
              this.imgList.push({
                id: i,
                path:
                  "http://192.168.46.143:8003/dlu/img/" +
                  ending +
                  res.data.data[i] +
                  "?" +
                  Date.parse(new Date()),
                folder: ending,
                name: res.data.data[i],
              });
            }
          }
        });

        this.canvasInfo.width = 1000;
        this.canvasInfo.height = 750;
        this.init();
      }

      // let that = this
      // img.onload( res =>{
      //     that.imgW = img.width
      //     that.imgH = img.height
      // } )
      // 打印

      // alert('width:'+img.width+',height:'+img.height);

      // console.log(this.imgW);
    },
    // 初始化加载图片
    selectPhoto(event) {
      let fileList = event.target.files;
      var tempList = [];
      for (let i = 0; i < fileList.length; i++) {
        if (
          fileList[i].type == "image/gif" ||
          fileList[i].type == "image/png" ||
          fileList[i].type == "image/jpeg" ||
          fileList[i].type == "image/jpg" ||
          fileList[i].type == "image/bmp" ||
          fileList[i].type == "image/png"
        ) {
          let fileUrl = URL.createObjectURL(fileList[i]); // 获取文件url
          tempList.push({ id: i, file: fileList[i], path: fileUrl }); // data中显示的图片url
        }
      }
      this.imgList = tempList;
      event.target.value = ""; // 解决不能选同一个文件

      this.canvasInfo.width = 1000;
      this.canvasInfo.height = 750;
      this.init();
      this.cardLoading = false;
    },
    // 按下backspace进行删除
    backSpaceDel() {
      // console.log("item", this.activeEl);
      // this.activeEl选中的标注内容
      if (this.activeEl) {
        this.editorCanvas.getObjects().forEach((item) => {
          console.log("item", item);
          if (item.rectId == this.activeEl.rectId) {
            this.editorCanvas.remove(item);
          }
        });
        this.editorCanvas.requestRenderAll();
      }
    },
    // 删除标签栏的tag---（实际项目中配合联调接口删除）
    delTag(item) {
      this.$confirm(`此操作将永久删除标签${item.value}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          item.isEdit = false;
          let text = item.value;
          this.editorCanvas.getObjects().forEach((item1) => {
            console.log("item111--delTag", item1.textID, item.id);
            if (item1.textID && item1.textID == item.id) {
              this.editorCanvas.remove(item1);
              this.editorCanvas.requestRenderAll();
            }
          });
          // 删除标签
          this.tagData = this.tagData.filter((el) => el.id != item.id);

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    init() {
      this.initeditorCanvas("init");
      this.initD();
    },
    // 初始化模板编辑画布
    initeditorCanvas(i) {
      // 根据canvas绘制保存的内容
      //   const str = JSON.parse(localStorage.getItem("canvasdata"));
      //   console.log("str", str);

      // this.editorCanvas.preserveObjectStacking = true;
      // this.editorCanvas.selectable = false;
      // this.editorCanvas.selection = false;
      // this.editorCanvas.toJSON(['rectId'])
      // this.editorCanvas.skipTargetFind = true;

      let img = "";
      if (i === "init") {
        // 初始化canvas
        this.editorCanvas = new fabric.Canvas("labelCanvas", {
          // devicePixelRatio: true,
          width: this.canvasInfo.width, // canvas 宽
          height: this.canvasInfo.height,
          backgroundColor: "#ffffff",
          transparentCorners: false,
          fireRightClick: true, // 启用右键，button的数字为3
          stopContextMenu: true, // 禁止默认右键菜单
        });
        img = this.imgList[0].path;
      } else {
        img = this.imgList[i].path;
      }

      // mounted内预设的比例(由于图片太大，展示不下，实际项目中可以根据后端返回的图片大小范围去设置缩放比例)
      const scaleX = 1000 / this.imgW;
      const scaleY = 750 / this.imgH;

      // 将图片设置成背景
      this.editorCanvas.setBackgroundImage(
        img,
        this.editorCanvas.renderAll.bind(this.editorCanvas), // 刷新画布
        {
          scaleX,
          scaleY,
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
        }
      );
      /**
       * 模型返回的绘制：根据拿到的left、top, width, height去绘制新矩形(根据图片与canvas的比例)
         drawRect()
       */
      // 监听鼠标右键的执行
      //   this.editorCanvas.on("mouse:down", this.canvasOnMouseDown);
      // 数据回显
      /* if (str) {
        // this.editorCanvas.loadFromJSON(str)
        this.editorCanvas.loadFromJSON(
          str,
          this.editorCanvas.renderAll.bind(this.editorCanvas),
          function (o, object) {}
        );
      } */
    },
    initD() {
      this.editorCanvas.on("mouse:down", (options) => {
        // console.log("ssssssss");
        // 记录当前鼠标的起点坐标
        if (!this.editorCanvas.getActiveObject()) {
          this.mouseFrom.x = options.pointer.x;
          this.mouseFrom.y = options.pointer.y;
          this.isDrawing = true;
        }
      });
      // 监听鼠标移动
      this.editorCanvas.on("mouse:move", (options) => {
        if (!this.editorCanvas.getActiveObject() && this.isDrawing) {
          // console.log("move");
          this.mouseTo.x =
            options.pointer.x > this.editorCanvas.width
              ? this.editorCanvas.width
              : options.pointer.x;
          this.mouseTo.y =
            options.pointer.y > this.editorCanvas.height
              ? this.editorCanvas.height
              : options.pointer.y;
        }
      });

      this.editorCanvas.on("mouse:up", (options) => {
        this.isDrawing = false;
        // console.log("mouse:up", options);
        if (!this.editorCanvas.getActiveObject() && this.currentType == "rect") {
          // 解决绘制的时候超出边界
          this.mouseTo.x =
            options.pointer.x > this.editorCanvas.width
              ? this.editorCanvas.width
              : options.pointer.x;
          this.mouseTo.y =
            options.pointer.y > this.editorCanvas.height
              ? this.editorCanvas.height
              : options.pointer.y;

          // 宽高为负值或为0
          let width = this.mouseTo.x - this.mouseFrom.x;
          let height = this.mouseTo.y - this.mouseFrom.y;
          // 如果点击和松开鼠标，都是在同一个坐标点或者反向，不绘制矩形
          if (width <= 0 || height <= 0) return;
          this.drawRect();
        }
        this.editorCanvas.renderAll();
      });
      this.editorCanvas.on("object:moving", (e) => {
        // console.log("ssssssssss");
        // 边界处理
        var obj = e.target;
        // if object is too big ignore
        if (
          obj.currentHeight > obj.canvas.height ||
          obj.currentWidth > obj.canvas.width
        ) {
          return;
        }
        obj.setCoords();
        // top-left  corner
        if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
          obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
          obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
        }
        // bot-right corner
        if (
          obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height ||
          obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width
        ) {
          obj.top = Math.min(
            obj.top,
            obj.canvas.height -
              obj.getBoundingRect().height +
              obj.top -
              obj.getBoundingRect().top
          );
          obj.left = Math.min(
            obj.left,
            obj.canvas.width -
              obj.getBoundingRect().width +
              obj.left -
              obj.getBoundingRect().left
          );
        }
      });
      this.editorCanvas.on("object:scaling", (options) => {
        // console.log("scale", options);
        var text = options.target.item(1);
        let group = options.target;
        console.log("text", text.width, group.width, group.getScaledWidth());
        let scaleX = group.width / group.getScaledWidth();
        let scaleY = group.height / group.getScaledHeight();
        text.set({
          fontSize: 14,
          scaleX,
          scaleY,
        });
      });
    },
    // 绘制矩形
    /**
     * 绘制的原理：矩形+文字的组合
     */
    drawRect() {
      // console.log("绘图啦11111", this.mouseFrom, this.mouseTo);
      // 通过UUID拿到唯一的ID
      let rectId = uuid.v1();
      /**
       * 删除之前的this.drawingObject
       */
      if (this.drawingObject) {
        this.editorCanvas.remove(this.drawingObject);
      }
      this.drawingObject = null;
      // 计算矩形长宽
      let left = this.mouseFrom.x;
      let top = this.mouseFrom.y;
      let width = this.mouseTo.x - this.mouseFrom.x;
      let height = this.mouseTo.y - this.mouseFrom.y;
      const drawingObject = new fabric.Rect({
        width: width,
        height: height,
        fill: "rgba(255,255,255,0.3)",
        lockRotation: true,
        opacity: 1,
        rectId,
        lockScalingFlip: true, // 禁止负值反转
        originX: "center",
        originY: "center",
        stroke: "#00fdf8",
        strokeWidth: 1,
        strokeLineJoin: "round",
      });
      const text = new fabric.Textbox("", {
        // width,
        // height,
        fontFamily: "Helvetica",
        fill: "white", // 设置字体颜色
        fontSize: 14,
        textAlign: "center",
        rectId,
        lockScalingX: true,
        lockScalingY: true,
        lockScalingFlip: true, // 禁止负值反转
        originX: "center",
        originY: "center",
      });
      if (drawingObject) {
        const group = new fabric.Group([drawingObject, text], {
          rectId,
          left: left,
          top: top,
          width: width,
          height: height,
          lockScalingFlip: true,
          lockRotation: true,
        });
        this.editorCanvas.add(group);
        console.log("this.editorCanvasssssssssss", this.editorCanvas);
        this.editorCanvas.renderAll();
        this.drawingObject = drawingObject;
        // 绘制完成展示右键菜单栏（因为在鼠标绘制时，通过mouseup拿不到绘制的内容）
        let len = this.editorCanvas._objects.length;
        let curOptions = this.editorCanvas._objects[len - 1];
        this.showMenuCon(curOptions);
      }
    },
    // 绘制时展示右键菜单栏内容
    showMenuCon(options) {
      console.log(options);
      this.activeEl = options;
      // 当前鼠标位置
      let pointX = options.left + options.width * options.scaleX;
      let pointY = options.top;

      this.menuPosition = `
                left: ${pointX}px;
                top: ${pointY}px;
              `;
      this.showCon = true;
    },
    // 编辑
    changeEdit(item, index) {
      item.isEdit = true;
      // focus: 点击编辑聚焦
      this.$nextTick(() => this.$refs.editTask[index].focus());
      // console.log('this.$refs.editTask', this.$refs.editTask)
    },
    // 修改选中的标注内容
    changeText(item) {
      if (item.value == "") {
        this.$message({
          type: "error",
          message: "标签内容不能为空",
          offset: 200,
        });
        return;
      }
      item.isEdit = false;
      let text = item.value;
      this.editorCanvas.getObjects().forEach((item1) => {
        if (item1.textID && item1.textID == item.id) {
          console.log("item111", item1.textID, item.id);
          item1.item(1).set({
            text,
            originX: "center",
            originY: "center",
            textAlign: "center",
          });
          this.editorCanvas.requestRenderAll();
        }
      });
    },
    // 取消修改
    cancelChange(item) {
      item.isEdit = false;
    },
    // 右键菜单
    canvasOnMouseDown(options) {
      if (options.button === 3 && options.target && !options.target.rectId) {
        return;
      }
      this.activeEl = options.target;
      // console.log("opt", options);
      // 判断：右键，且在元素上右键
      // opt.button: 1-左键；2-中键；3-右键
      // 在画布上点击：opt.target 为 null
      if (options.button === 3 && options.target) {
        // 获取当前元素
        // 设置右键菜单位置
        // 右键菜单的位置
        let pointX = options.target.left + options.target.width * options.target.scaleX;
        let pointY = options.target.top;
        // 设置右键菜单定位
        this.menuPosition = `
                left: ${pointX}px;
                top: ${pointY}px;
              `;
        this.showCon = true;
      } else {
        this.showCon = false;
      }
    },
    // 添加标签
    addTag() {
      this.isAdd = true;
      // input鼠标聚焦
      this.$nextTick(() => this.$refs.addTask.focus());
    },
    addNewTag() {
      if (this.tagCon.trim() == "") {
        this.message({
          type: "error",
          message: "内容不能为空",
          offset: 200,
        });
        return;
      }
      // 调接口
      this.tagData.push({
        value: this.tagCon,
        id: uuid.v1(),
        isEdit: false,
      });
      // 置空 关闭
      this.tagCon = "";
      this.isAdd = false;
    },
    // 取消添加
    cancelAdd() {
      this.isAdd = false;
    },
    // 根据选中的TAG进行修改
    changeTag(el) {
      if (this.activeEl) {
        // console.log("item", el.value, this.activeEl.rectId);
        let text = el.value;
        let textID = el.id;
        this.editorCanvas.getObjects().forEach((item) => {
          // console.log("item", item);
          if (item.rectId == this.activeEl.rectId) {
            // console.log("item", item);
            item.set({
              textID,
            });
            item.item(1).set({
              text,
              originX: "center",
              originY: "center",
              textAlign: "center",
            });
          }
        });
        this.editorCanvas.requestRenderAll();
        this.showCon = false;
      }
    },
    // 删除选中的元素
    delEl() {
      this.editorCanvas.getObjects().forEach((item) => {
        console.log("item", item);
        if (item.rectId == this.activeEl.rectId) {
          this.editorCanvas.remove(item);
          // console.log(item.rectId, this.activeEl.rectId)
        }
      });
      this.editorCanvas.requestRenderAll();
      this.showCon = false;
    },
    // 拿到canvas上的所有数据
    /**
     * 最终提交给后端要说明：scaleX,scaleY
     */
    xml_obj({ name, xmin, ymin, xmax, ymax }) {
      const xml = `
  <object>
    <name>${name}</name>
    <pose>Unspecified</pose>
    <truncated>0</truncated>
    <difficult>0</difficult>
    <bndbox>
      <xmin>${xmin}</xmin>
      <ymin>${ymin}</ymin>
      <xmax>${xmax}</xmax>
      <ymax>${ymax}</ymax>
    </bndbox>
  </object>
`;
      return xml;
    },
    //点击保存修改调用的方法
    getData() {
      console.log(this.imgList);
      this.fabricJson[this.activeIndex] = JSON.stringify(
        this.editorCanvas.toJSON({
          exclude: [
            "_controlsVisibility",
            "lockMovementX",
            "lockMovementY",
            "lockScalingX",
            "lockScalingY",
            "hasBorders",
            "hasControls",
            "lockRotation",
            "lockObject",
            "cornerSize",
          ],
        })
      );
      const JSZip = require("jszip");
      // 创建一个JSZip实例
      const zip = new JSZip();
      let that = this;
      let xml = "";
      // console.log(this.fabricJson);
      for (let index = 0; index < this.fabricJson.length; index++) {
        // this.fabricJson.forEach(function (str) {
        // 解析文件
        // const data = JSON.parse(str);
        const data = JSON.parse(this.fabricJson[index]);

        console.log(data);
        // 获取图片宽
        const imgWidth = data.backgroundImage.width;
        // 获取图片高
        const imgHeight = data.backgroundImage.height;

        let folderName = "";
        let fileName = "";

        // 本地读取方法
        if (this.path == undefined) {
          fileName = this.imgList[index].file.name;
          folderName = this.imgList[index].file.webkitRelativePath.split("/")[0];
        }
        // 云端读取方法
        else {
          // 获取图片路径
          const src = data.backgroundImage.src;
          // 获取图片文件夹信息
          folderName = src.split("/").slice(-2, -1)[0];
          // 获取图片名
          fileName = src.split("/").slice(-1)[0].split("?")[0];
        }

        xml = `
    <annotation>
    <folder>${folderName}</folder>
    <filename>${fileName}</filename>
    <path>/${folderName}/${fileName}</path>
    <source>
      <database>Unspecified</database>
    </source>
    <size>
      <width>${imgWidth}</width>
      <height>${imgHeight}</height>
      <depth>3</depth>
    </size>`;
        // 遍历矩形框信息
        data.objects.forEach(function (obj) {
          // 获取矩形框信息
          const { left, top, width, height } = obj;
          // 获取标签名
          const name = obj.objects[1].text;
          xml += that.$options.methods.xml_obj({
            name: name,
            xmin: left * 4,
            ymin: top * 4,
            xmax: (left + width) * 4,
            ymax: (top + height) * 4,
          });
        });
        xml += "</annotation>";
        if (data.objects.length > 0) zip.file(fileName + ".xml", xml);
      }
      // 生成zip并下载
      zip.generateAsync({ type: "blob" }).then(function (content) {
        const downloadUrl = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "annotations.zip";
        a.click();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#fabricCanvas {
  padding: 20px;
  background: #f6f6f6;
  #pic-label {
    width: 100%;
    display: flex;
    justify-content: center;
    background: #f6f6f6;
    .canvasDraw {
      background: #fff;
      padding: 20px;
    }
    #labelCanvas {
      position: relative;
      box-shadow: 0 0 25px #cac6c6;
      width: 1000px;
      display: block;
      // margin: 15px auto;
      height: 750px;

      #editDel {
        position: absolute;
        // top: 50%;
        // left: 50%;
        // transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        line-height: 100px;
        background: red;
        color: white;
        text-align: center;
        margin: auto auto;
        z-index: 99999;
      }
    }
    .tagCon {
      width: 20%;
      margin-left: 20px;
      min-width: 250px;
      background: #fff;
      padding: 10px 20px;

      .tagTitle {
        height: 62px;
        font-size: 18px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // padding: 0 20px;
        box-sizing: border-box;
      }
      .tagItem {
        margin-bottom: 10px;
        border: 1px solid #dcdfe6;
        padding: 10px;
        border-left: 4px solid blue;
      }
      .tagDOM {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .tagName {
          width: 70%;
          height: 40px;
          line-height: 40px;
          margin-right: 10px;
          display: inline-block;
          // width: 100px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          color: #606266;
        }
        .iconCon {
          display: none;
          .editIcon {
            cursor: pointer;
            margin-right: 10px;
          }
          .delIcon {
            cursor: pointer;
          }
        }

        &:hover .iconCon {
          display: block;
        }
      }
    }
  }
}
</style>
<style scoped>
.context__x {
  position: relative;
  margin-top: 15px;
}

.menu-x {
  width: 200px;
  position: absolute;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.menu-x div {
  box-sizing: border-box;
  padding: 4px 8px;
  border-bottom: 1px solid #cccccc;
  cursor: pointer;
}

.menu-x ul > li:hover {
  background-color: antiquewhite;
}

.menu-x .del:hover {
  background-color: antiquewhite;
}

.menu-x div:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.menu-x div:last-child {
  border-bottom: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.tagDOM >>> .el-input__inner {
  border: 0;
  padding: 0;
}
#fabricCanvas >>> .el-card__body,
.el-main {
  padding: 0;
}
</style>
