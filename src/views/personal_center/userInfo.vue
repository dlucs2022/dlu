<template>
  <h1>用户邀请码为{{ user.invite_code }}</h1>
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
<style scoped></style>
