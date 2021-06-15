<template>
  <div class="loading">
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.loading {
  margin-top: 5px;
  ul {
    display: flex;
    justify-content: center;
    li {
      width: 3px;
      height: 20px;
      background-color: #22d59c;
      margin-left: 3px;
      transform-origin: bottom;
      animation: load 0.5s 0s infinite;
      &:first-child{
          animation-delay: -0.2s;
      }
      &:nth-child(3){
          animation-delay: 0.2s;
      }
      &:nth-child(4){
          animation-delay: 0.4s;
      }
    }
  }
}
@keyframes load {
  from {
    transform: scaleY(0.1);
  }
  to {
    transform: scaleY(1.2);
  }
}
</style>