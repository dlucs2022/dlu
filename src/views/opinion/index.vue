<template>
  <div class="container">
    <div class="img_holder">
      <img src="@/assets/imgs/opinion/a.jpg" alt="" style="width: 100%" />
      <div class="text"><span style="font-size: 2em">联系我们</span></div>
    </div>
    <div class="bootom clearfix">
      <div class="left leftfix">
        <span class="opinion_title">请告知我们您的想法和建议</span>
        <br />
        <span class="opinion_addition">您的建议将会推动我们一起进步</span>
        <el-col :span="13" :offset="3" style="padding-top: 30px">
          <el-form label-width="80px" size="small ">
            <el-form-item label="反馈主题">
              <el-input v-model="feedbackTopic" placeholder="请输入反馈主题"></el-input>
            </el-form-item>

            <el-form-item label="问题描述">
              <el-input
                type="textarea"
                v-model="problemDescription"
                placeholder="请输入问题描述"
                :rows="5"
              ></el-input>
            </el-form-item>

            <el-form-item label="反馈类型">
              <el-select v-model="feedbackType" placeholder="请选择反馈类型">
                <el-option label="建议" value="suggestion"></el-option>
                <el-option label="咨询" value="consultation"></el-option>
                <el-option label="投诉" value="complaint"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="姓名">
              <el-input v-model="fullName" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="电话">
              <el-input v-model="phoneNumber" placeholder="请输入电话"></el-input>
            </el-form-item>

            <el-form-item label="电子邮件">
              <el-input v-model="email" placeholder="请输入电子邮件"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" native-type="submit">提交</el-button>
              <el-button native-type="reset" style="margin-bottom: 50px">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
      <div class="right leftfix">
        <div class="right_content">
          <img
            src="@/assets/imgs/opinion/提交成功.png"
            alt=""
            style="margin-left: 25px"
          />
          <span class="addition">系统问题请通过以下地址反馈</span>
          <span class="title">邮箱地址：</span>
          <span>779093440@qq.com</span>
          <span>1454147447@qq.com</span>
          <span>1218eye@gmail.com</span>
          <span class="title">校内地址：</span>
          <span>大理大学数学与计算机学院工科楼601</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedbackTopic: "",
      problemDescription: "",
      feedbackType: "",
      fullName: "",
      phoneNumber: "",
      email: "",
    };
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.leftfix {
  float: left;
}
.rightfix {
  float: right;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.img_holder {
  position: relative;
  margin: 0 auto;
  width: 1200px;
  height: 600px;
  .text {
    position: absolute;
    top: 230px;
    left: 480px;
    font-size: 2rem;
    color: #fff;
  }
}
.bootom {
  margin: 0 auto;
  margin-top: 20px;
  width: 1200px;
  height: 600px;
  overflow: hidden;
  .left {
    margin-left: 50px;
    width: 750px;
    .opinion_title {
      font-size: 30px;
      padding-top: 20px;
      margin-left: 10px;
      color: rgb(48, 83, 147);
      font-weight: bold;
    }
    .opinion_addition {
      font-size: 40px;
      margin-left: 100px;
      color: rgb(48, 121, 147);
      font-weight: 100;
    }
  }
  .right {
    width: 400px;
    .right_content {
      margin-top: 50px;
      margin-left: 50px;
    }
    span {
      display: block;
      line-height: 35px;
      font-style: oblique;
    }
    .addition {
      font-size: 20px;
      color: rgb(48, 121, 147);
      font-weight: bold;
    }
    .title {
      font-size: 20px;
      color: rgb(48, 83, 147);
      font-weight: 500;
    }
  }
  .left,
  .right {
    height: 600px;
  }
}
</style>
