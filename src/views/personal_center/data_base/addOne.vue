<template>
  <el-dialog
    v-if="dialogVisible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    title="上传文件"
    :visible.sync="dialogVisible"
    :show-close="false"
    width="60%"
  >
    <div class="hello">
      <uploader
        :key="uploader_key"
        :options="options"
        ref="uploader"
        :autoStart="false"
        @complete="complete"
        @file-complete="rootComplete"
        class="uploader-example"
        :file-status-text="statusText"
        @file-success="onFileSuccess"
        @file-added="filesAdded"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p>点击上传按钮，或者将文件夹拖拽至此处</p>
          <p>注意：仅支持上传单层目录（如上传多级目录，子目录下的文件将会移动至一级目录下。）</p>
          <p></p>
          <uploader-btn :single="true" :directory="true">选择文件/文件夹</uploader-btn>
        </uploader-drop>
        <uploader-list>


        </uploader-list>
      </uploader>
    </div>
    <el-button @click="dialogVisible = false" style="margin-top: 20px">取 消</el-button>
  </el-dialog>
</template>

<script>
import SparkMD5 from "spark-md5";
import dao from "@/api/dao";
export default {
  name: "add",
  data() {
    return {
      dialogVisible: false,
      folder: "",
      statusText: {
        success: "上传成功",
        error: "上传失败",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中",
      },
      folderName: "",
      options: {
        target: "http://192.168.46.143:8003/dlu/file/uploadCategory", //SpringBoot后台接收文件夹数据的接口
        testChunks: false, //是否分片-不分片,
        // chunkSize: 1024 * 1024 * 10,
        withCredentials: true, //携带跨域信息
        simultaneousUploads: 1,
        parseTimeRemaining: function(timeRemaining, parsedTimeRemaining) {
            return parsedTimeRemaining
                .replace(/\syears?/, "年")
                .replace(/\days?/, "天")
                .replace(/\shours?/, "小时")
                .replace(/\sminutes?/, "分钟")
                .replace(/\sseconds?/, "秒");
        },
        query: function (file, res, status) {
          return {
            userName: JSON.parse(sessionStorage.getItem("user")).name,
          };
        },
      },
      //这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值）
      uploader_key: new Date().getTime(),
      fileParameterName: "file", //默认的文件参数名
      // userName:JSON.parse(sessionStorage.getItem("user")).name,
    };
  },
  methods: {
    rootComplete(rootFile) {
      // console.log(rootFile.getSize());
      this.$message({
        type: "success",
        message: "上传成功!",
      });
      dao
        .folderComplete(
          JSON.parse(sessionStorage.getItem("user")).name,
          JSON.parse(sessionStorage.getItem("user")).invite_code,
          rootFile.name,
          rootFile.files.length,
          rootFile.getSize()
        )
        .then((res) => {
          console.log(res);
        });
      this.$parent.list();
    },
    // 上传完成
    complete() {
      console.log("complete", arguments);
    },
    onFileSuccess: function (rootFile, file, response, chunk) {
      // console.log(rootFile)
      // console.log(file)
      // console.log(response)
      // console.log(chunk)
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      // 携带文件夹大小等信息
      // this.options.query.file_size = file.size

      //大文件的md5计算时间比较长，显示个进度条
      const loading = this.$loading({
        lock: true,
        text: "正在计算MD5",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let blobSlice =
        File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 10 * 1024 * 1000;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();
      file.pause();

      loadNext();

      fileReader.onload = (e) => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            console.log("校验MD5 " + ((currentChunk / chunks) * 100).toFixed(0) + "%");
          });
        } else {
          let md5 = spark.end();
          loading.close();
          this.computeMD5Success(md5, file);
          console.log(
            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
              file.size
            } 用时：${new Date().getTime() - time} ms`
          );
        }
      };
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`);
        loading.close();
        file.cancel();
      };
      function loadNext() {
        let start = currentChunk * chunkSize;
        let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },

    computeMD5Success(md5, file) {
      file.uniqueIdentifier = md5; //把md5值作为文件的识别码
      file.resume(); //开始上传
    },
    /**
     * 添加文件后触发
     * @param file
     * @param event
     */
    filesAdded(file, event) {
      // console.log(file);
      this.computeMD5(file);

    },
    open() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
      this.$parent.closeAddOne();
    },
  },
};
</script>

<style lang="scss">
.uploader-example {
  width: 90%;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}


.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}



/* #uploader-upload-btn{
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;
        font-size: 20px;
        // border-radius: 3px;
        padding: 7px 15px;
        outline: 0;
        font-weight: 500;
        width: 200px;
        height: 200px;
        line-height: 200px;
        &:hover{
            background: #66b1ff;
            border-color: #66b1ff;
            color: #FFF;
        }
    } */
</style>
