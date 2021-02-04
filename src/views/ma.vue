<template>
  <div class="BorrowHistory">
    <headers :title="$t('Me')"  />
    <div class="top_box">
      <div class="total_amount">
        <div class="title">{{$t("TotalLendWalletNet")}}</div>
        <div class="amount">≈$ {{userData.total}}</div>
        <div class="DailyInterest box">
          <div class="DailyInterest-title">{{$t("DailyInterest")}}</div>
          <div class="interest_amount">≈ $ {{userData.daily_income}}</div>
        </div>
        <div class="TotalIncome box">
          <div class="DailyInterest-title">{{$t("TotalIncome")}}</div>
          <div class="interest_amount">≈ $ {{userData.total_income}}</div>
        </div>
      </div>
    </div>
    <div class="BorrowHistory-list">
      <div class="History">
        <div class="History_title box-flex">
          <img src="../assets/image/shuIcon.png" alt />
          <span>{{$t("History")}}</span>
        </div>
        <div class="History-list">
          <div class="navigation_bar box-flex" @click="$router.push({path:'/supplyHistory'})">
            <div>{{$t("SupplyHistory")}}</div>
            <img src="../assets/image/pathIcon.png" alt />
          </div>
          <div class="navigation_bar box-flex" @click="$router.push({path:'/borrowHistory'})">
            <div>{{$t("BorrowHistory")}}</div>
            <img src="../assets/image/pathIcon.png" alt />
          </div>
          <div class="navigation_bar box-flex" @click="$router.push({path:'/transferHistory'})">
            <div>{{$t("TransferHistory")}}</div>
            <img src="../assets/image/pathIcon.png" alt />
          </div>
          <div class="navigation_bar box-flex" @click="$router.push({path:'/MintHistory'})">
            <div>{{$t("MintHistory")}}</div>
            <img src="../assets/image/pathIcon.png" alt />
          </div>
        </div>
      </div>

      <div class="Settings">
        <div class="Settings-title box-flex">
          <img src="../assets/image/Settings.png" />
          <span>{{$t("Settings")}}</span>
        </div>
        <div class="Settings_box">
          <div class="Settings-language box-flex" @click="$router.push({path:'/languagePage'})">
            <div>{{$t("language")}}</div>
            <img src="../assets/image/pathIcon.png" />
          </div>
          <!-- <div class="Settings-language box-flex" @click="$router.push({path:'/languagePage'})">
            <div>{{$t("language")}}</div>
            <img src="../assets/image/pathIcon.png" />
          </div> -->
        </div>
      </div>
      <div class="Sign_out" @click="onSign_out">{{$t("Signout")}}</div>
    </div>
  </div>
</template>

<script>
import headers from "../components/headers.vue";
import { userPage } from "../api/requestApi";

export default {
  components: { headers },
  name: "ma",
  data() {
    return {
      userData: {
        total: 0.0,
        daily_income: 0.0,
        total_income: 0.0
      }
    };
  },
  created() {
    this.userPageData();
  },
  mounted() {},
  methods: {
    //退出登录
    onSign_out() {
      this.$store.commit("amendData", { key: "token", value: "" });
      this.$store.commit("amendData", { key: "address", value: "" });
      this.$store.commit("amendData", { key: "userData", value: "" });
      this.$router.push({ path: "/" });
    },
    //获取用户的数据
    async userPageData() {
      let { status, data } = await userPage();
      if (status === 200) {
        data.total = this.$toFixedNumber({ num: data.total });
        data.daily_income = this.$toFixedNumber({ num: data.daily_income });
        data.total_income = this.$toFixedNumber({ num: data.total_income });
        return (this.userData = data);
      }

      // this.$toast(this.$t("ma1"));
    }
  }
};
</script>

<style lang="less" scoped >
.box-flex {
  display: flex;
  align-items: center;
}
.top_box {
  background: #ffffff;
  padding: 20px 20px 13px 20px;
}
.BorrowHistory {
  width: 100%;
  min-height: 100vh;
  background: #f7f5f5;
}

.total_amount {
  // background: url("../assets/image/background_ma.png") no-repeat 0px 0px;
  background: rgba(13, 174, 106, 1);
  padding: 15px 25px;
  border-radius: 14px;

  .title {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
  }
  .amount {
    font-size: 30px;
    font-weight: 300;
    color: #ffffff;
  }
}
.total_amount > div:nth-child(4) {
  margin: 0px;
}
.DailyInterest-title {
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
}
.interest_amount {
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
}
.BorrowHistory-list {
  width: 100%;
  height: 100%;
  background: #f7f5f5;
  padding: 0px 15px 20px 15px;
}

.box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 24px;
  background: rgba(255, 255, 255, 0.3);
  margin-bottom: 5px;
  padding: 0px 16px 0px 10px;
}

.History {
  width: 100%;

  margin-bottom: 10px;
  .History_title {
    width: 100%;
    height: 50px;

    & > img {
      width: 22px;
      height: 22px;
    }
    & > span {
      font-size: 16px;
      font-weight: 600;
      color: #262626;
      padding-left: 10px;
    }
  }
  .History-list {
    background: #ffffff;
    border-radius: 14px;
    padding: 0px 20px;
    & > div {
      width: 100%;
      height: 50px;
      justify-content: space-between;
      border-bottom: 1px solid rgba(234, 234, 234, 1);
    }
    & > div:nth-child(1) {
      border-bottom: 1px solid rgba(234, 234, 234, 1);
    }
    .navigation_bar > div {
      font-size: 15px;
      font-weight: 400;
      color: #262626;
    }
    .navigation_bar > img {
      width: 30px;
      height: 30px;
      margin-right: -15px;
    }
  }
}
.Settings {
  width: 100%;

  margin-bottom: 60px;
  .Settings-title {
    width: 100%;

    height: 50px;
    width: 100%;
    padding: 0px 20px;
    & > img {
      width: 22px;
      height: 22px;
    }
    & > span {
      font-size: 16px;
      font-weight: 600;
      color: #262626;
      padding-left: 10px;
    }
  }
  .Settings_box {
    width: 100%;
    background: #ffffff;
    border-radius: 14px;
    .Settings-language {
      width: 100%;
      height: 50px;
      padding: 0px 5px 0px 20px;
      justify-content: space-between;
      border-bottom: 1px solid rgba(234, 234, 234, 1);
      & > div {
        font-size: 15px;
        font-weight: 400;
        color: #262626;
      }
      & > img {
        width: 30px;
        height: 30px;
      }
    }
  }
}
.Sign_out {
  width: 100%;
  height: 50px;
  background: #ffffff;
  border-radius: 10px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
</style>
