<template>
  <div class="root">
    <div class="content">
      <!-- <img src="./daxingxing.jpg" /> -->
      <canvas ref="markCanvas" tabindex="0"></canvas>
    </div>
    <div><button @click="show1" style="float: right">111111</button></div>
  </div>
</template>
<script>
import { draw } from "./draw"; // 矩形绘制方法
export default {
  name: "marks",
  data() {
    return {
      markList: [], // 标记内容数组

      list: [
        {
          fileName: "",
          object: "",
          conf: 0.23,
          box: { xmin: "100", ymin: "100", xmax: "300 ", ymax: "300" },
          attr: {},
        },
      ],
      //   recs: [{ h: 36, w: 58, x: 404, y: 161 }],
    };
  },
  mounted() {
    this.initCanvas(); // 画布初始化
    const recs = this.list.map((item) => {
      const { xmin, ymin, xmax, ymax } = item.box;
      const w = xmax - xmin;
      const h = ymax - ymin;
      return { x: parseInt(xmin), y: parseInt(ymin), w, h };
    });
    this.recs = recs;

    console.log(this.recs[0]);
    this.markList.push({
      x: this.recs[0].x,
      y: this.recs[0].y,
      w: this.recs[0].w,
      h: this.recs[0].h,
    });
  },
  methods: {
    show1() {
      console.log(this.markList);
    },

    /* 画布初始化 */
    initCanvas() {
      let that = this;
      this.$nextTick(() => {
        // 初始化canvas宽高
        let cav = this.$refs.markCanvas;
        cav.width = "800";
        cav.height = "600";
        let ctx = cav.getContext("2d");
        ctx.strokeStyle = "blue";
        cav.style.cursor = "crosshair";

        // 计算使用变量
        let list = this.markList; // 画框数据集合, 用于服务端返回的数据显示和绘制的矩形保存
        // 若服务端保存的为百分比则此处需计算实际座标, 直接使用实际座标可省略
        // list.forEach(function (value, index, array) {
        //   let newValue = {
        //     x: value.x * cav.width,
        //     y: value.y * cav.height,
        //     w: value.w * cav.width,
        //     h: value.h * cav.height,
        //   };
        //   list.splice(index, 1, newValue);
        // });

        // 若list长度不为0, 则显示已标记框
        if (list.length !== 0) {
          list.forEach(function (value, index, array) {
            // 遍历绘制所有标记框
            ctx.rect(value.x, value.y, value.w, value.h);
            ctx.stroke();
          });
        }

        // 调用封装的绘制方法
        draw(cav, list);
        // 备注: js中对象操作指向的是对象的物理地址, 获取绘制完矩形的结果数组直接取用或处理this.markList即可
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  //   position: relative;
  background-color: aquamarine;
  //   top: 50%;
  //   left: 45%;
  //   transform: translateX(-50%) translateX(-50%);
  width: 800px;
  height: 600px;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
  }

  canvas {
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 10;
  }
}
</style>
