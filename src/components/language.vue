<template>
  <div class="language">
    <div class="titles" :style="'color:'+color+';'+'background:'+bag+';'" @click="onShow">
      <div class>{{language}}</div>
      <img src="../assets/image/leftIcon.png" class="language-icon" v-if="icon==1" />
      <img src="../assets/image/leftIcon2.png" class="language-icon" v-else />
    </div>
    <div class="drop-down" :style="'color:'+color+';'+'background:'+bag+';'" v-if="show">
      <div @click="onShow('en')">{{$t('en')}}</div>
      <div @click="onShow('zh')">{{$t('zh')}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "language",
  props: {
    color: String,

    bag: String,

    icon: Number
  },
  data() {
    return {
      show: false,
      language: ""
    };
  },
  created() {
    this.hasLanguage();
  },
  methods: {
    onShow(lang) {
      this.show = !this.show;
      if (lang === "en" || lang === "zh") {
        this.$i18n.locale = lang;
        this.$store.commit("amendData", { key: "lang", value: lang });
        this.hasLanguage();
      }
    },
    hasLanguage() {
      if (this.$store.state.lang === "zh") {
        this.language = "中文";
      } else {
        this.language = "En";
      }
    }
  }
};
</script>

<style scoped lang="less">
.language {
  display: inline-block;
  height: 35px;
  min-width: 70px;

  // line-height: 35px;
  // max-height: 63px;
  //   display: flex;
  //   flex-wrap: wrap;
  //   align-items: center;
  
  position: relative;
  z-index: 20;
}
.titles {
  //   position: absolute;
  //   left: 0px;
  //   top: 0px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 5px;
  font-size: 18px;
  font-weight: 400;
  line-height: 33px;
  height: 35px;
  border-radius: 6px;
  border: 1px solid #fecb62;
  //   justify-items: self-end;
  // background: #0e0e35;
}

.language-text {
  //   width: 22px;
  height: 30px;
  margin-right: 5px;
  font-size: 18px;
  font-weight: 400;
  line-height: 30px;
}
.language-icon {
  width: 20px;
  height: 20px;
}
.drop-down {
  position: absolute;
  left: 0px;
  bottom: px;
  width: 100%;

  div {
    border-top: 1px solid #225555;
    text-align: center;
    font-size: 14px;
  }
  div:nth-child(2) {
    border-bottom: 1px solid #225555;
  }
}
</style>