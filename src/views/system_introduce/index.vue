<template>
  <div class="index">
    <div class="demo-image__placeholder">
      <div class="text">
        <div class="title">
          <p>智拣AI</p>
        </div>
        <div class="content">
          <p>
            智拣AI智能标注系统，它可以帮助图像识别研究人员快速、准确、高效地对照片进行标注。
            我们的系统利用了最先进的深度学习技术，可以通过预训练好的模型对照片进行预标注，从而节省用户的时间和精力。
            如果预标注不满足研究人员需要，研究人员可以对标注进行微调，以达到最佳效果。同时，该系统也支持上传自己的模型，
            以适应不同的场景和需求。我们的系统可以极大减少人工标注成本，提高标注质量和效率，为用户提供更好的体验和价值。
          </p>
        </div>
      </div>
      <el-image :src="src">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </div>

    <div class="show">
      <div class="title">
        <p>CECAS IN THE NEWS</p>
      </div>
      <div class="image_holder">
        <div class="container">
          <div class="card">
            <div class="imgBx">
              <img src="../../assets/css/1.jpg" alt="" />
            </div>
            <div class="content">
              <h2>Card One</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente
                recusandae, voluptatibus magnam reprehenderit a numquam. Temporibus esse
                sit provident quaerat quae.
              </p>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="card">
            <div class="imgBx">
              <img src="../../assets/css/1.jpg" alt="" />
            </div>
            <div class="content">
              <h2>Card One</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente
                recusandae, voluptatibus magnam reprehenderit a numquam. Temporibus esse
                sit provident quaerat quae.
              </p>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="card">
            <div class="imgBx">
              <img src="../../assets/css/1.jpg" alt="" />
            </div>
            <div class="content">
              <h2>Card One</h2>
              <p>
                {{ test }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import x from ''
import "../../assets/css/style.css";

export default {
  
  data() {
    return {
      name: "",
	  imgList:[],
      test:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente recusandae, voluptatibus magnam reprehenderit a numquam. Temporibus esse sit provident quaerat quae.",
      activeIndex2: "1",
      src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
    };
  },
  created() {
    this.name = localStorage.getItem("username");
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    
  },
};
</script>
<style lang="scss">
.index {
  .demo-image__placeholder {
    width: 100%;
    background-color: #9370db;
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      // width: 600px;
      position: absolute;

      // left: 120px;
      margin-top: 50px;
      margin-left: 10%;
      margin-right: 50%;
      color: white;
      .title {
        text-align: left;
        font-size: 2.5vw;
        margin-bottom: 20px;
      }
      .content {
        text-align: left;
        font-size: 1vw;
        line-height: 1.2vw;
      }
    }
    .el-image {
      margin-top: 30px;
      margin-bottom: 30px;
      width: 35%;
      left: 55%;
    }
  }
  .show {
    margin-top: 50px;
    width: 100%;
    height: 700px;
    background-color: #d3d3d3;
    .title {
      position: relative;
      text-align: left;
      margin-left: 10%;
      top: 50px;
      font-size: 2.5vw;
    }
    .image_holder {
      display: flex;
      flex-direction: row;
      position: relative;
      justify-content: space-around;
      width: 85%;
      margin-top: 5%;
      height: 350px;
      margin-left: 20%;
      right: 200px;
    }
  }
}
</style>
