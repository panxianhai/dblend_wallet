<template>
  <div class="header box-flex" :style="{backgroundColor:bag}">
    <div class="header-left box-flex">
      <img src="../assets/image/whiteIcon.png" class="header-icon" @click="$router.go(-1)" />
      <p :class="{paddingPX:align=='center'}">{{$t(title)}}</p>
    </div>
    <language color="rgba(255, 255, 255, 0.85)" :bag="bag" v-if="hidden" />
  </div>
</template>

<script>
import language from "@/components/language.vue";
export default {
  components: {
    language
  },
  name: "headers",
  props: {
    title: String,
    bag: {
      type: String,
      default: "rgba(27, 33, 33, 1)"
    },
    hidden: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: "center"
    }
  },
  data() {
    return {};
  }
};
</script>


<style scoped lang="less">
.box-flex {
  display: flex;
  align-items: center;
}
.header {
  height: 50px;
  width: 100%;
  background: rgba(27, 33, 33, 1);
  justify-content: space-between;
  padding: 0px 12px;
  color: #ffffff;

}
.header-icon {
  width: 22px;
  height: 22px;
  // transform: rotate(90deg);
}
.header-left {
  padding: 0px 0px 0px 5px;
  flex: 1;
}

.header-left .paddingPX {
  padding: 0px 10px 0px 0px;
  text-align: center;
}

.header-left > p {
  font-size: 18px;
  flex: 1;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  padding-left: 8px;
  text-align: left;
}
</style>
