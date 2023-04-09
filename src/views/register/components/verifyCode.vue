<template>
    <div>
        <slide-verify 
        style="margin: 0 auto"
        ref="slideblock"
        @again="onAgain"
        @fulfilled="onFulfilled"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
        :accuracy="accuracy"
        :slider-text="text"
        
        ></slide-verify>
        <!-- <div>{{msg}}</div> -->

        <!-- <button @click="handleClick">在父组件可以点我刷新哦</button> -->
    </div>
</template>

<script>
import SlideVerify from 'vue-monoplasty-slide-verify'
export default {
  name: 'App',
  data(){
    return {
      msg: '',
      text: '向右滑',
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 5,
      isVerify:false,//用于像父组件传值，校验是否通过
    }
  },
  methods: {
    onSuccess(){
    //   console.log('验证通过');
      this.msg = 'success'
      this.isVerify = true
      this.$emit('putIsVerify',this.isVerify)
    },
    onFail(){
    //   console.log('验证不通过');
      this.msg = 'fail'
      this.isVerify = false
      this.$emit('putIsVerify',this.isVerify)
    },
    onRefresh(){
    //   console.log('点击了刷新小图标');
      this.msg = ''
    },
    onFulfilled() {
    //   console.log('刷新成功啦！');
    },
    onAgain() {
    //   console.log('检测到非人为操作的哦！');
      this.msg = '请再试一次';
      // 刷新
      this.$refs.slideblock.reset();
    },
    handleClick() {
    	// 父组件直接可以调用刷新方法
      this.$refs.slideblock.reset();
    },
  },
  /* watch:{
    isVerify(newValue,oldValue){
        // this.$emit('putIsVerify',newValue)
    },
    immediate:true
  } */
}
</script>
