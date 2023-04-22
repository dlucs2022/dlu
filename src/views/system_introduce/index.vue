<template>
  <div class="index">
    <div class="demo-image__placeholder">
      <div class="text">
        <div class="title">
          <span>智拣AI</span>
        </div>
        <el-divider></el-divider>
        <div class="content">
          <span>
            智拣AI红外照片分拣平台，它可以帮助图像识别研究人员快速、准确、高效地对红外照片进行标注。
            我们的系统利用了最先进的深度学习技术，可以通过预训练好的模型对照片进行预标注，从而节省用户的时间和精力。
            如果预标注不满足研究人员需要，研究人员可以对标注进行微调，以达到最佳效果。同时，该系统也支持上传自己的模型，
            以适应不同的场景和需求。我们的系统可以极大减少人工标注成本，提高标注质量和效率，为用户提供更好的体验和价值。
          </span>
        </div>
      </div>
      <el-image :src="src">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <div class="statistic">
        <el-card class="box-card" shadow="hover">
          <span style="display: block">处理图片数</span>
          <i
            class="el-icon-picture"
            style="color: #9370db; font-size: 20px; margin-right: 10px"
          ></i>
          <count-to
            :start-val="0"
            :end-val="336969"
            :duration="2000"
            class="card-panel-num"
          />
        </el-card>
        <el-card class="box-card" shadow="hover">
          <span style="display: block">使用人数</span>
          <i class="el-icon-user" style="font-size: 20px; margin-right: 10px"></i>
          <count-to
            :start-val="0"
            :end-val="2041"
            :duration="2000"
            class="card-panel-num"
          />
        </el-card>
      </div>
    </div>

    <div class="show">
      <div class="title">
        <p>物种百科</p>
      </div>
      <div class="cards">
        <div class="box">
          <div class="imgBx">
            <img src="@/assets/imgs/introduce/dianjinsihou2.jpg" />
          </div>
          <div class="content">
            <h3>滇金丝猴</h3>
            <el-scrollbar style="height: 350px">
              <p>
                滇金丝猴（学名：Rhinopithecus bieti）
                滇金丝猴的皮毛并不是金黄色的毛，以灰黑、白色为主。
                中文标准名称应为“黑仰鼻猴”。它们的头顶长有尖形黑色冠毛，
                眼周和吻鼻部青灰色或肉粉色，鼻端上翘呈深蓝色。
                身体背侧、手足和尾均为灰黑色， 背后具有灰白色的稀疏长毛。
                滇金丝猴是中国特有的珍稀濒危灵长类动物。仅分布在中国川滇藏三省区交界处，
                喜马拉雅山南缘横断山系的云岭山脉当中，澜沧江和金沙江之间一个狭小地域 。
                <a
                  href="https://baike.baidu.com/item/%E6%BB%87%E9%87%91%E4%B8%9D%E7%8C%B4/373252"
                  target="_blank"
                  style="float: right; color: blue"
                  >学习更多>>
                </a>
              </p>
            </el-scrollbar>
          </div>
        </div>
        <div class="box">
          <div class="imgBx">
            <img src="@/assets/imgs/introduce/houzi.jpg" />
          </div>
          <div class="content">
            <h3>山魈</h3>
            <el-scrollbar style="height: 350px">
              <p>
                山魈（学名:Mandrillus
                sphinx），世界上最大的猴科灵长类动物。头大而长，鼻骨两侧各有1块骨质突起，
                其上有纵向排列的脊状突起，其间为沟，外被绿色皮肤，脊间鲜红色。
                雄性每侧约有6条主要的沟，其红色部分伸延到鼻骨和吻部周围，这种色彩鲜艳的特殊图案形似鬼怪，因而人称山魈。
                山魈为群居动物，小群落生活，嬉戏于丛林及岩石间，主要天敌是花豹，但花豹一般只猎捕雌性山魈和未成年山魈。
                山魈主要产于非洲中西部潮湿的常绿雨林中，从萨纳加河（喀麦隆）以南到赤道几内亚大陆、
                加蓬南部大部分地区、刚果共和国西南部到库伊卢河，一直到刚果河一带。
                山魈在全球主要分布于喀麦隆、刚果、赤道几内亚（大陆）和加蓬。后来在泰国、越南等南亚地区也有发现，原因未知。

                <a
                  href="https://baike.baidu.com/item/%E5%B1%B1%E9%AD%88/813499"
                  target="_blank"
                  style="float: right; color: blue"
                  >学习更多>>
                </a>
              </p>
            </el-scrollbar>
          </div>
        </div>
        <div class="box">
          <div class="imgBx">
            <img src="@/assets/imgs/introduce/maoniu.jpg" />
          </div>
          <div class="content">
            <h3>牦牛</h3>
            <el-scrollbar style="height: 350px">
              <p>
                牦牛（学名：Bos mutus或Bos grunniens，英文名称：wild
                yak），属于哺乳纲、真兽亚纲、偶蹄目、反刍亚目、牛科、牛亚科动物，
                是以中国青藏高原为中心，及其毗邻高山、亚高山高寒地区的特有珍稀牛种之一，草食性反刍家畜。牦牛能适应高寒气候，
                是世界上生活在海拔最高处的（除人类外）哺乳动物，分布于中国青藏高原海拔3000米以上地区。
                牦牛的藏语叫雅客，世界通称为“yak”，即藏语译音。
                西方国家因其主产于中国青藏高原藏族地区，也称西藏牛。牦牛尾如马尾，所以又名马尾牛。
                <a
                  href="https://baike.baidu.com/link?url=VMMufibiDbIg6nwzRu1CUp_XEfgRifbkma3WJS4RdfLFIxPKbEJwUriJf_A9x9Y4gG75gqkTSPNNGNkNzabrL5d-n-FYj-OoEau_7ikN_sO"
                  target="_blank"
                  style="float: right; color: blue"
                  >学习更多>>
                </a>
              </p>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>

    <div class="show_card_f">
      <div
        class="show_card"
        :style="{ backgroundColor: bgColor1, color: textColor1 }"
        @mouseenter="
          bgColor1 = '#fff';
          textColor1 = '#409EFF';
        "
        @mouseleave="
          bgColor1 = '#409EFF';
          textColor1 = '#fff';
        "
      >
        <img src="@/assets/imgs/introduce/icon/sharpicons_Cow.png" alt="" />
        牛
        <br />
        识别率：98.0%
      </div>
      <div
        class="show_card"
        :style="{ backgroundColor: bgColor2, color: textColor2 }"
        @mouseenter="
          bgColor2 = '#fff';
          textColor2 = '#409EFF';
        "
        @mouseleave="
          bgColor2 = '#409EFF';
          textColor2 = '#fff';
        "
      >
        <img src="@/assets/imgs/introduce/icon/sharpicons_Bird.png" alt="" />
        鸟
        <br />
        识别率：97.3%
      </div>
      <div
        class="show_card"
        :style="{ backgroundColor: bgColor3, color: textColor3 }"
        @mouseenter="
          bgColor3 = '#fff';
          textColor3 = '#409EFF';
        "
        @mouseleave="
          bgColor3 = '#409EFF';
          textColor3 = '#fff';
        "
      >
        <img src="@/assets/imgs/introduce/icon/sharpicons_Horse.png" alt="" />
        马
        <br />
        识别率：97.3%
      </div>
      <div
        class="show_card"
        :style="{ backgroundColor: bgColor4, color: textColor4 }"
        @mouseenter="
          bgColor4 = '#fff';
          textColor4 = '#409EFF';
        "
        @mouseleave="
          bgColor4 = '#409EFF';
          textColor4 = '#fff';
        "
      >
        <img src="@/assets/imgs/introduce/icon/sharpicons_Monkey.png" alt="" />
        猴
        <br />
        识别率：97.3%
      </div>
      <div
        class="show_card"
        :style="{ backgroundColor: bgColor5, color: textColor5 }"
        @mouseenter="
          bgColor5 = '#fff';
          textColor5 = '#409EFF';
        "
        @mouseleave="
          bgColor5 = '#409EFF';
          textColor5 = '#fff';
        "
      >
        <img src="@/assets/imgs/introduce/icon/sharpicons_Deer.png" alt="" />
        鹿
        <br />
        识别率：97.3%
      </div>
      <div
        class="show_card"
        :style="{ backgroundColor: bgColor6, color: textColor6 }"
        @mouseenter="
          bgColor6 = '#fff';
          textColor6 = '#409EFF';
        "
        @mouseleave="
          bgColor6 = '#409EFF';
          textColor6 = '#fff';
        "
      >
        <img src="@/assets/imgs/introduce/icon/sharpicons_Sheep.png" alt="" />
        羊
        <br />
        识别率：97.3%
      </div>
      <div
        class="show_card"
        :style="{ backgroundColor: bgColor7, color: textColor7 }"
        @mouseenter="
          bgColor7 = '#fff';
          textColor7 = '#409EFF';
        "
        @mouseleave="
          bgColor7 = '#409EFF';
          textColor7 = '#fff';
        "
      >
        <img src="@/assets/imgs/introduce/icon/sharpicons_Cat.png" alt="" />
        猫
        <br />
        识别率：97.3%
      </div>
    </div>
  </div>
</template>

<script>
// import x from ''
import "../../assets/css/style.css";
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo,
  },
  data() {
    return {
      name: "",
      imgList: [],
      test:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente recusandae, voluptatibus magnam reprehenderit a numquam. Temporibus esse sit provident quaerat quae.",
      activeIndex2: "1",
      src: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
      bgColor1: "#409EFF",
      textColor1: "#fff",

      bgColor2: "#409EFF",
      textColor2: "#fff",

      bgColor3: "#409EFF",
      textColor3: "#fff",

      bgColor4: "#409EFF",
      textColor4: "#fff",

      bgColor5: "#409EFF",
      textColor5: "#fff",

      bgColor6: "#409EFF",
      textColor6: "#fff",

      bgColor7: "#409EFF",
      textColor7: "#fff",
    };
  },
  created() {
    this.name = sessionStorage.getItem("username");
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    logss() {
      console.log("sssssssss");
    },
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
    height: 20%;
    background-color: #9370db;
    .text {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: center;
      position: absolute;
      margin-left: 10%;
      margin-right: 50%;
      color: white;
      .title {
        margin-top: 7.5%;
        text-align: left;
        font-size: 2.5vw;
      }
      .content {
        text-align: left;
        font-size: 1.2vw;
        line-height: 1.7vw;
        flex: 1;
      }
    }
    .el-image {
      margin-top: 40px;
      margin-bottom: 30px;
      width: 35%;
      left: 55%;
    }
  }
  .statistic {
    position: absolute;
    background-color: white;
    justify-content: center;
    gap: 10px;
    padding: 5px;
    display: flex;
    width: 420px;
    // left: 25%;
    margin-left: 20%;
    margin-top: -25px;
    box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, 0.2);
    .box-card {
      background-color: white;
      width: 200px;
      border-radius: 20px;
      .card-panel-num {
        font-size: 30px;
        font-weight: bold;
      }
      // opacity: 0.5;
    }
  }
  .show {
    margin-top: 50px;
    width: 100%;
    height: 700px;
    background-color: #d3d3d3;
    .title {
      position: relative;
      text-align: right;
      margin-right: 15%;
      top: 50px;
      font-size: 2.5vw;
    }
    /* .image_holder {
      display: flex;
      flex-direction: row;
      position: relative;
      justify-content: space-around;
      width: 85%;
      margin-top: 5%;
      height: 350px;
      margin-left: 20%;
      right: 200px;
    } */
    .cards {
      width: 1000px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 100px auto;
    }
    .box {
      position: relative;
      width: 300px;
      height: 400px;
      background: #000;
      box-shadow: 0 30px 30px rgba(0, 0, 0, 0.5);
    }
    .box .imgBx {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .box .imgBx img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: 0.5s;
    }
    .box:hover .imgBx img {
      opacity: 0;
    }
    .box .content {
      position: absolute;
      bottom: 20px;
      left: 10%;
      width: 80%;
      height: 60px;
      background: #fafafa;
      transition: 0.5s;
      overflow: hidden;

      padding: 15px;
      box-sizing: border-box;
    }
    .box:hover .content {
      width: 100%;
      height: 100%;
      bottom: 0;
      left: 0;
    }
    .box .content h3 {
      margin: 0;
      padding: 0;
      font-size: 20px;
      text-align: center;
    }
    .box .content p {
      margin: 10px 0 0;
      padding: 0;
      opacity: 0;
      line-height: 1.6em;
      transition: 0.5s;
      text-align: justify;
    }
    .box .content p a {
      color: #222;
      text-decoration: none;
    }
    .box .content p :hover {
      color: #00a6bc;
    }
    .box:hover .content p {
      opacity: 1;
      transition-delay: 0.5s;
    }
  }
  .show_card_f {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    margin: 0px auto;
    padding-bottom: 20px;
    background-color: #d3d3d3;

    .show_card {
      height: 180px;
      width: 150px;
      // margin-left: 50px ;
      position: relative;
      border-radius: 10px;
      text-align: center;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
