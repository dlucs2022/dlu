<template>
  <div class="index">
    <div class="demo-image__placeholder">
      <div class="text">
        <div class="title">
          <p>Making an Impact</p>
        </div>
        <div class="content">
          <p>
            Clemson University's College of Engineering, Computing, and Applied Sciences
            (CECAS) is committed to producing outstanding graduates. With more than 60
            degree and certificate options across all of our campus locations as well as
            extensive research, study abroad, and hands-on work experience opportunities,
            you can get involved, go beyond, and make meaningful connections that last a
            lifetime.
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
