<template>
  <div class="BorrowHistory">
    <headers title="language"  align="center" />
    <div class="BorrowHistory-list">
      <!-- <div class="Settings-title box-flex">
          <img src="../assets/image/Settings.png" />
          <span>{{$t("Settings")}}</span>
      </div>-->
      <div class="Settings-language">
        <div class="box-flex" @click="onlang('en')">
          <div>{{$t("languageEN")}}</div>
          <img v-if="language=='en'" src="../assets/image/xuan1.png" />
        </div>
        <div class="box-flex" @click="onlang('zh')">
          <div>{{$t("languageZH")}}</div>
          <img v-if="language=='zh'" src="../assets/image/xuan1.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headers from "../components/headers.vue";

export default {
  components: { headers },
  name: "languagePage",
  data() {
    return {
      language: ""
    };
  },
  created() {
    //用来保存数据
    this.language = this.$store.state.lang;
  },
  mounted() {},
  methods: {
    onlang(value) {
      this.language = value;
      this.$i18n.locale = value;
      this.$store.commit("amendData", { key: "lang", value: value });
    }
  }
};
</script>


<style lang="less" scoped >
.box-flex {
  display: flex;
  align-items: center;
}
.BorrowHistory {
  width: 100%;
  min-height: 100vh;
  background: #f7f5f5;
}
.BorrowHistory-list {
  width: 100%;
  height: 100%;
  background: #f7f5f5;
  padding: 20px 15px;
}

.Settings-language {
  width: 100%;
  background: #ffffff;
  border-radius: 14px;
  width: 100%;
  padding-left: 20px;

  & > div {
    justify-content: space-between;
    height: 60px;
    padding-right: 30px;
    & > div {
      font-size: 15px;
      font-weight: 400;
      color: #262626;
    }
    & > img {
      width: 17px;
      height: 17px;
    }
  }
  & > div:nth-child(1) {
    border-bottom: 2px solid rgba(234, 234, 234, 1);
  }
}
</style>
