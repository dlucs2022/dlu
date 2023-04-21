<template>
  <div class="content">
    <span>用户邀请码为：</span>
    <span>{{ user.invite_code }}</span>
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  },
};
</script>
<style lang="scss" scoped>
.content {
  background-color: white;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 5%;
  padding: 20px;
  border: 1px solid white;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(128, 127, 127, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: rgb(95, 95, 95);
}
.content:hover {
  box-shadow: 10px 10px 20px rgba(128, 127, 127, 0.4);
}
</style>
