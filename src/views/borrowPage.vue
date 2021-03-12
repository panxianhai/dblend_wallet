<template>
  <div class="borrowPage">
    <headers :title="$t('Borrow')+' '+key" align="center" />

    <div class="borrow_box">
      <div class="borrowInfo box-flex">
        <div class="coin">
          <img :src="borrowInfo.asset_icon" />
        </div>
        <div class="coinInfo box-flex">
          <div class="box-flex">
            <div>{{$t('ProtocolBalance')}}:</div>
            <div>{{borrowInfo.quota+" "+borrowInfo.asset}}</div>
          </div>
          <div class="box-flex">
            <span>{{$t('BorrowAPY')}}:</span>
            <div>{{borrowInfo.borrow_apy}}</div>
          </div>
          <div class="box-flex">
            <div>{{$t('Duration')}}:</div>
            <div>{{borrowInfo.apy_days+$t("Days")}}</div>
          </div>
        </div>
      </div>
      <div class="borrow_select">
        <div class="Collateral">
          <p>{{$t('CollateralAmount')}}</p>
          <div>
            <input
              type="number"
              v-model="amountDBL"
              @input="onAmountDBL($event)"
              @blur="onBlurAmount($event)"
              name="DBL"
              placeholder="0.0"
              class="collateralInput"
            />
            <span>DBL</span>
          </div>
        </div>
        <div class="available">{{balanceNumber}} DBL {{$t('Available')}}</div>
        <div class="apy_list">
          <div :class="pledge==10?'bagColor':''" @click="pledge=10">10 %</div>
          <div :class="pledge==30?'bagColor':''" @click="pledge=30">30 %</div>
          <div :class="pledge==50?'bagColor':''" @click="pledge=50">50 %</div>
          <div :class="pledge==70?'bagColor':''" @click="pledge=70">70 %</div>
        </div>
        <div class="Collateral">
          <p>{{$t("BorrowAmount")}}</p>
          <div>
            <input
              type="number"
              v-model="amountKEY"
              @input="onAmountKEY($event)"
              @blur="onBlurAmount($event)"
              name="KEY"
              placeholder="0.0"
              class="collateralInput"
            />
            <span>{{borrowInfo.asset}}</span>
          </div>
        </div>
      </div>
      <div class="box-flex borrowBottom">
        <div class="borrowBottom_box">
          <div>
            <span>{{$t("lnterest")}}</span>
            <span>{{ interest.borrow}} DBL</span>
          </div>
          <div>
            <span>{{$t("BorrowFee")}}</span>
            <span>{{interest.borrow_fee}} DBL</span>
          </div>
          <div>
            <span>{{$t("Pool")}}</span>
            <span>{{interest.mint}} DBL</span>
          </div>
        </div>
      </div>
    </div>
    <div class="page-bottom">
      <div class="borrowPage-botton" @click="transferMeney">{{$t("borrow")}}</div>
    </div>
  </div>
</template>

<script>
import headers from "../components/headers.vue";

import {
  borrowingInfo,
  exchangePrice,
  getInterest,
  borrow_markets,
  borrowMarketsCheck
} from "../api/requestApi.js";

export default {
  components: { headers },
  data() {
    return {
      //用户初始化信息
      key: "",
      type: "",
      id: "",
      days: "",

      //余额
      balanceNumber: 0,
      //质押率
      pledge: 50,
      //兑换率
      conversionRate: "",
      //用户页面数据
      borrowInfo: {},
      //底部的利息数据
      interest: { borrow: 0, borrow_fee: 0, mint: 0 },

      //DBL的借币数量
      amountDBL: "",
      //要借的币数量
      amountKEY: ""
    };
  },
  watch: {
    pledge() {
      if (this.amountDBL) {
        this.onAmountDBL();
        this.getInterest();
      } else if (this.amountKEY) {
        this.onAmountKEY();
        this.getInterest();
      }
    }
  },
  created() {
    try {
      let { key, type, id, days = "" } = this.$route.params;
      if (!id) {
        this.$router.push({ path: "/" });
      }
      this.key = key;
      this.type = type;
      this.id = id;
      this.days = days;
      this.getBorrowingInfo({ id, asset: key, type, days });
      this.getInterest();
    } catch (res) {
      this.$router.push({ path: "/" });
    }
  },
  mounted() {},
  methods: {
    //获取页面基本的借款数据
    async getBorrowingInfo({ id = "", type = "", asset = "", days = "" } = {}) {
      // this.$toast.loading({ message: this.$t("home6"), overlay: true });
      let { status, data } = await borrowingInfo({
        data: { type: type, asset: asset, days: days },
        id: id
      });

      if (type == "borrow") {
        let res = await exchangePrice({ data: { pair: "DBL_" + asset } });
        if (res.status === 200) {
          this.conversionRate = res.data.price;
        } else {
          return this.$router.push({ path: "/" });
        }
      }

      if (status === 200) {
        // data.quota = Number(data.quota);
        data.quota = this.$toFixedNumber({
          num: data.quota,
          lengths: 2
        });
        this.balanceNumber = this.$toFixedNumber({
          num: data.balance,
          lengths: 4
        });
        this.borrowInfo = data;
        return;
      }
      // this.$toast(data.message);
    },

    //获取底部利息数据
    async getInterest() {
      // if(){}else if(){}else if(){}
      try {
        let { status, data } = await getInterest({
          data: { market_id: this.id, amount: this.amountDBL }
        });

        for (let keys in data) {
          data[keys] = this.$toFixedNumber({ num: data[keys], lengths: 4 });
        }

        if (status == 200) {
          this.interest = data;
        }
      } catch {
        this.interest = { borrow: 0, borrow_fee: 0, mint: 0 };
      }
    },

    //用户输入dbl质押数量时计算质押的数据
    onAmountDBL(e) {
      if (event.target.value === "") {
        this.amountKEY = "";
        return;
      }
      if (!Number(e.target.value)) {
        return;
      }

      this.amountDBL = this.$toFixedNumber({
        num: this.amountDBL,
        lengths: 4
      });
      let amountKEY = 0;
      amountKEY = Number(
        (this.amountDBL * this.conversionRate * this.pledge) / 100
      );

      switch (this.key) {
        case "ETH":
          this.amountKEY = this.$toFixedNumber({
            num: amountKEY,
            lengths: 4
          });
          break;
        case "USDT":
          this.amountKEY = this.$toFixedNumber({
            num: amountKEY,
            lengths: 2
          });
          break;
        case "DBL":
          this.amountKEY = this.$toFixedNumber({
            num: amountKEY,
            lengths: 4
          });
          break;
        case "DIBI":
          this.amountKEY = this.$toFixedNumber({
            num: amountKEY,
            lengths: 0
          });
          break;
      }
    },
    //用户输入借款时数量计算质押的数据
    onAmountKEY(e) {
      if (event.target.value === "") {
        this.amountDBL = "";
        return;
      }

      if (!Number(e.target.value)) {
        return;
      }

      switch (this.key) {
        case "ETH":
          this.amountKEY = this.$toFixedNumber({
            num: this.amountKEY,
            lengths: 4
          });
          break;
        case "USDT":
          this.amountKEY = this.$toFixedNumber({
            num: this.amountKEY,
            lengths: 2
          });
          break;
        case "DBL":
          this.amountKEY = this.$toFixedNumber({
            num: this.amountKEY,
            lengths: 4
          });
          break;
        case "DIBI":
          this.amountKEY = this.$toFixedNumber({
            num: this.amountKEY,
            lengths: 0
          });
          break;
      }

      let amountDBL = Number(
        (this.amountKEY / this.pledge / this.conversionRate) * 100
      );

      this.amountDBL = this.$toFixedNumber({
        num: amountDBL,
        lengths: 4
      });
    },
    //获取借款的利率
    onBlurAmount(key) {
      this.getInterest();
    },

    //用户转钱吧数据传到以太坊的数据链上
    async transferMeney({
      from = this.$store.state.address,
      to = this.$store.state.informationTO,
      id = this.id,
      type = "B",
      daysType = this.days,
      coinClass = this.type
    } = {}) {
      if (!this.$store.state.token) {
        return this.$toast(this.$t("home4"));
      }

      try {
        let txdata = "";
        let amount = "";
        let status = "";
        let message = "";

        // 禁止功能
        // return this.$toast(this.$t("home16"));
        this.borrowDBLNumber = Number(this.borrowDBLNumber).toFixed(2);
        this.borrowMoneyNumber = Number(this.borrowMoneyNumber).toFixed(2);

        if (Number(this.borrowInfo.quota) == 0) {
          return this.$toast(this.$t("home13"));
        }

        if (this.amountDBL > this.borrowInfo.balance) {
          return this.$toast(this.$t("home15"));
        }

        if (
          this.amountKEY > this.borrowInfo.quota &&
          this.borrowInfo.quota != -1
        ) {
          return this.$toast(this.$t("home7"));
        }

        txdata = this.$stringToHex(
          type + ":" + daysType + ":" + coinClass + ":" + this.amountKEY
        );

        amount = this.amountDBL;

        if (isNaN(amount)) {
          return this.$toast(this.$t("home10"));
        } else if (amount == 0) {
          return this.$toast(this.$t("home11"));
        } else if (amount < 0) {
          return this.$toast(this.$t("home12"));
        }

        //借款前的检查
        let { status: code } = await borrowMarketsCheck({
          data: { market_id: id, amount, borrow_rate: this.pledge / 100 }
        });

        if (code !== 200) {
          return;
        }

        var transactionData = {
          from: from,
          to: to,
          value: this.$toWei(0, "ether"),
          data: txdata,
          //测试
          gas: "60000"
        };

        let transactionHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionData]
        });

        let resData = await borrow_markets({
          data: {
            market_id: id,
            amount: amount,
            txn_hash: transactionHash,
            borrow_rate: this.pledge / 100
          }
        });
        status = resData.status;
        message = resData.data.message;

        if (status == 200) {
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 2000);
          return this.$toast(this.$t("home8"));
        }

        // web3.eth.sendTransaction(transactionData, async (err, res) => {
        //   if (res) {
        //     let resData = await borrow_markets({
        //       data: { market_id: id, amount: amount, txn_hash: res }
        //     });
        //     status = resData.status;
        //     message = resData.data.message;
        //     if (status == 200) {
        //       setTimeout(() => {
        //         this.$router.push({ path: "/" });
        //       }, 2000);
        //       return this.$toast(this.$t("home8"));
        //     }
        //     // this.$toast(message);
        //   } else {
        //     this.$toast(this.$t("home9"));
        //   }
        // });
      } catch (error) {
        this.$toast(this.$t("home9"));
      }
    }
  }
};
</script>



<style lang="less" scope>
.box-flex {
  display: flex;
  align-items: center;
}

.borrowPage {
  min-height: 100vh;
  width: 100%;
  background: #f7f5f5;
}
.borrow_box {
  padding: 0px 16px;
}

.borrowInfo {
  width: 100%;
  height: 110px;
  border-radius: 10px;
  background: #0dae6a;
  margin: 20px 0px;
  padding-left: 15px;

  .coin {
    & > img {
      width: 56px;
      height: 56px;
      background: #ffffff;
      border-radius: 50%;
    }
  }
  .coinInfo {
    flex: 1;
    height: 80px;

    flex-direction: column;
    justify-content: space-between;
    padding-left: 15px;
    align-items: flex-start;

    & > div {
      width: 100%;
      justify-content: space-between;

      font-size: 14px;
      font-weight: bold;
      color: #ffffff;
      line-height: 16px;

      & > div {
        min-width: 40%;
      }
    }
  }
}
.borrow_select {
  width: 100%;
  border-radius: 14px;
  padding: 20px;
  background: #ffffff;

  .Collateral {
    padding: 10px 20px;
    border-radius: 10px;
    border: 1px solid #eaeaea;
    & > p {
      font-size: 16px;
      font-weight: bold;
      color: #262626;
      line-height: 19px;
      padding-bottom: 5px;
    }
    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .collateralInput {
        font-size: 18px;
        font-weight: bold;
        color: #262626;
        // flex: 1;
        min-width: 200px;
      }
      .collateralInput::-webkit-input-placeholde {
        font-size: 18px;
        font-weight: bold;
        color: #262626;
      }
      & > span {
        font-size: 16px;
        font-weight: bold;
        color: #262626;
      }
    }
  }

  .available {
    width: 100%;
    padding: 6px 0px;
    font-size: 12px;
    font-weight: bold;
    color: #787878;
    text-align: right;
  }
  .apy_list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0px;

    & > div {
      width: 72px;
      height: 34px;
      background: #f8f7f5;
      border-radius: 4px;
      text-align: center;
      line-height: 34px;
      font-size: 14px;
      font-weight: bold;
      color: #1b2121;
    }
    .bagColor {
      background: rgba(255, 202, 98, 1);
    }
  }
}
.borrowBottom {
  padding: 0px 7px;
  width: 100%;
  & > .borrowBottom_box {
    width: 100%;
    height: 115px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 0px 0px 14px 14px;
    opacity: 0.8;
    padding: 15px 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;

    font-size: 14px;
    font-weight: bold;
    color: #787878;
    & > div {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      & > span:nth-child(2) {
        color: rgba(38, 38, 38, 1);
      }
    }
  }
}
.page-bottom {
  padding: 40px 20px;
}
.borrowPage-botton {
  background: #feb544;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}
</style>