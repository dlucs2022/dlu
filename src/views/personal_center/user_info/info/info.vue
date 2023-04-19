<template>
  <div>
    <div class="show">
      <p style="margin-left: 6%; margin-top: 5%">邀请码为：{{ user.invite_code }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "spaceinfo",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  },
};
</script>

<style scoped>
.show {
  margin: 100px auto;
  width: 80%;
  height: 450px;
  border: 5px solid lightcyan;
  transition: all 0.9s;
  border-radius: 10px;
}

.show:hover {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
  margin-top: 90px;
}
</style>
