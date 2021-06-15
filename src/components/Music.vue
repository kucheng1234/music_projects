<template>
  <div class="Music">
    <li-item
      v-for="(item, index) in singlist"
      :item="item"
      :key="item.id"
      @play="$emit('play', $event)"
    >
      <template v-slot:sortnum>
        <b
          :class="index + 1 <= 3 ? 'active' : ''"
          >{{ (index + 1) &lt; 10 ? '0'+(index+1) : (index+1) }}</b
        >
      </template>
    </li-item>
  </div>
</template>

<script>
import LiItem from "./LiItem";
export default {
  props: ["singlist"],
  components: {
    LiItem,
  },
};
</script>

<style lang="less" scoped>
.Music {
  background: #463c3d;
}
.active {
  color: red;
}
</style>