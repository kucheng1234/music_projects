<template>
  <div class="ablum">
    <ul>
      <router-link :to="{path:`/albumlist/${item.id}`}" tag="li" v-for="item in albumlist" :key="item.id">
        <div class="img">
          <img :src="item.blurPicUrl" alt="" />
        </div>
        <div class="span">
          <p>{{ item.name }}</p>
          <span>{{ item.publishTime | formatData("Y-m-d") }}</span>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["albumlist"],
  filters: {
    formatData(value, fstr) {
      let d = new Date(value);
      let format = {
        "Y+": d.getFullYear(),
        "m+": d.getMonth() + 1,
        "d+": d.getDate(),
        "h+": d.getHours(),
        "M+": d.getMinutes(),
        "S+": d.getSeconds(),
      };
      for (let k in format) {
        let reg = new RegExp(k);
        let val = format[k];
        val = val < 10 ? "0" + val : val;
        fstr = fstr.replace(reg, val);
      }
      return fstr;
    },
  },
};
</script>

<style lang="less" scoped>
.ablum {
  background: #463c3d;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      flex: 0 0 50%;
      padding: 20px 20px 0 20px;
      overflow: hidden;
      .img {
        width: 100%;
        height: 40vw;
        overflow: hidden;
        img{
          border-radius: 10px;
          height: 100%;
        }
      }
      .span {
        margin-top: 2vw;
        P {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 3.3vw;
        }
        span {
          font-size: 3vw;
        }
      }
    }
  }
}
</style>