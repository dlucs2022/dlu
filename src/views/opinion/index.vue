<template>
    <div class="container_opinion">
        <el-row>
            <el-col :span="5" style="padding-top:20px"><img src="@/assets/imgs/opinion/提交成功.png" alt="" style="margin-left:50px"></el-col>
            <el-col :span="13" style="padding-top:20px">
                <span class="opinion_title">请告知我们您的想法和建议</span>
                <br>
                <span class="opinion_addition">您的建议将会推动我们一起进步！</span>
                <el-col :span="13" offset="2" style="padding-top:50px">
                    <el-form label-width="80px" size="small ">
                        <el-form-item label="反馈主题">
                        <el-input v-model="feedbackTopic" placeholder="请输入反馈主题"></el-input>
                        </el-form-item>

                        <el-form-item label="问题描述">
                        <el-input type="textarea" v-model="problemDescription" placeholder="请输入问题描述"></el-input>
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
                        <el-button native-type="reset">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
        </el-row>

        

    </div>
</template>

<script>
export default {
    data() {
    return {
      feedbackTopic: '',
      problemDescription: '',
      feedbackType: '',
      fullName: '',
      phoneNumber: '',
      email: ''
    }
  }
}
</script>

<style>
    .container_opinion{
        height: 100%;
        width: 100%;
    }
    .opinion_title{
        font-size: 30px;
        padding-top: 20px;
        margin-left: 10px;
        color: rgb(48, 83, 147);
        font-weight: bold  ;
    }
    .opinion_addition{
        font-size: 40px;
        margin-left: 100px;
        color: rgb(48, 121, 147);
        font-weight: 100  ;

    }
</style>