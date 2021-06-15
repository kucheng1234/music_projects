<template>
  <div class="navbar">
    <ul>
      <router-link tag="li" to="/recommend">推荐</router-link>
      <router-link tag="li" to="/hot">榜单</router-link>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.navbar {
  background-color: #fdfdfd;
  color: #8a8a8a;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 999;
  ul {
    width: 100%;
    display: flex;
    line-height: 7vh;
    li {
      flex: 1;
      font-size: 2.5vh;
      &.router-link-exact-active {
        color: #22d59c;
        font-weight: bold;
        border-bottom: 1px solid #22d59c;
      }
    }
  }
}
</style>