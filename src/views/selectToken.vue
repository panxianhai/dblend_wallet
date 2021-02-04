<template>
  <div class="BorrowHistory">
    <headers title="selectToken"  align="center"  />

    <!-- <div class="header box-flex">
      <div class="header-left box-flex">
        <img
          src="../assets/image/ss.png"
          class="header-icon"
          @click="$router.push({path:'/tansfer',query:{key:token}})"
        />
        <p :class="{paddingPX:align=='center'}">{{$t('selectToken')}}</p>
      </div>
    </div> -->

    <div class="BorrowHistory-list">
      <div class="Settings-language">
        <div class="box-flex" @click="onlang('USDT')">
          <div class="box-flex">
            <span>USDT</span>
            <span class="flexRight">Tether</span>
          </div>
          <img v-if="token=='USDT'" src="../assets/image/xuan1.png" />
        </div>
        <div class="box-flex" @click="onlang('DIBI')">
          <div class="box-flex">
            <span>DIBI</span>
            <span class="flexRight">DiBi Token</span>
          </div>
          <img v-if="token=='DIBI'" src="../assets/image/xuan1.png" />
        </div>
        <div class="box-flex" @click="onlang('DBL')">
          <div class="box-flex">
            <span>DBL</span>
            <span class="flexRight">DBLend</span>
          </div>
          <img v-if="token=='DBL'" src="../assets/image/xuan1.png" />
        </div>
        <div class="box-flex" @click="onlang('ETH')">
          <div class="box-flex">
            <span>ETH</span>
            <span class="flexRight">ETH</span>
          </div>
          <img v-if="token=='ETH'" src="../assets/image/xuan1.png" />
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
      token: "",
      align: "center"
    };
  },
  created() {
    //用来保存数据
    this.token = this.$route.query.token;
  },
  mounted() {},
  methods: {
    onlang(value) {
      this.token = value;
      this.$router.push({path:"/tansfer",query:{key:value}})
    }
  }
};
</script>


<style lang="less" scoped >
.box-flex {
  display: flex;
  align-items: center;
}
.header {
  height: 50px;
  width: 100%;
  background: rgba(27, 33, 33, 0.3);
  justify-content: space-between;
  padding: 0px 12px;
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
  font-size: 21px;
  flex: 1;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  padding-left: 8px;
  text-align: left;
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
}

.Settings-language {
  width: 100%;
  background: #ffffff;
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
    .flexRight {
      color: rgba(120, 120, 120, 1);
      padding-left:20px ;
    }
    & > img {
      width: 17px;
      height: 17px;
    }
  }
  & > div {
    border-bottom: 2px solid rgba(234, 234, 234, 1);
  }
}
</style>
