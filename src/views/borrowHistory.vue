<template>
  <div class="BorrowHistory" ref="boxHeight">
    <headers title="BorrowHistory" />

    <div class="warn">
      <div class="warn1" v-if="notificationNumber.count">
        <img src="../assets/image/warnIcon.png" class="warnIcon" />
        <div
          class="warnText"
        >{{$store.state.lang=="zh"?'您的'+notificationNumber.count+'个借贷合约将要被清算！请尽快添加DBL提高质押率!':notificationNumber.count+'\\Contracts is about to be liquidated! Please add DBL ASAP!'}}</div>
        <img src="../assets/image/closeIcon.png" class="closeIcon" />
      </div>
      <div class="warn2" v-if="notificationNumber.count">
        <img src="../assets/image/warnIcon.png" class="warnIcon" />
        <div
          class="warnText"
        >{{$store.state.lang=="zh"?'您的'+notificationNumber.count+'个借贷合约将要到期！请确保您的借贷钱包内有足够的USDT归还!':notificationNumber.count+'\\Contracts are ablut to expire! Please make sure you have enough USDT in your account!'}}</div>
        <img src="../assets/image/closeIcon.png" class="closeIcon" />
      </div>
    </div>

    <div class="BorrowHistory-list">
      <div class="list-box" v-for="(item,index) in borrowList" :key="index">
        <div class="box-flex Days-time">
          <div class="titleIcon" :class="{iconColor:item.status==1}"></div>
          <div class="titlePrompt box-flex">
            <!-- :class="item.status==2?'overdue':''" -->
            <p class="Days">USDT-{{item.apy_days}}{{$t("Days")}}</p>
            <div>
              <span class="grayText">{{$t("Reward")}}：</span>
              <span class="blackText">{{item.reward_total}}DBL</span>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="Collateral">
            <div>
              <span class="grayText">{{$t("BorrowAmount")}}：</span>
              <span class="blackText">{{item.balance+" "+item.asset}}</span>
            </div>
            <div>
              <span class="grayText">{{$t('APY')}}：</span>
              <span class="blackText">{{item.borrow_apy}}</span>
            </div>
            <!-- {{$t("CollateralAmount")}}:{{item.amount }}DBL -->
          </div>
          <div class="Collateral">
            <div>
              <span class="grayText">{{$t("CollateralAmount")}}：</span>
              <span class="blackText">{{item.amount}}DBL</span>
            </div>
            <div class="add redText" @click="getBorrowingInfo(index)">{{$t('Add')}}</div>
          </div>
          <div class="box-flex">
            <span class="grayText">{{$t("Collateralrate")}}：</span>
            <span :class="item.status==1?'greenText':'redText'">{{item.borrow_rate}}</span>
            <span class="blackText">({{$t('MAXS')+':'+item.borrow_cr}})</span>
            <img src="../assets/image/iconwenhao.png" />
          </div>
          <div>
            <span class="grayText">{{$t("Time")}}：</span>
            <span
              class="blackText"
            >{{item.status==0?$t('PENDING'):`${item.begin_date} 00:00~${item.end_date} 00:00`}}</span>
          </div>
        </div>
      </div>
      <!-- 无数据时显示 -->
      <div class="promptss" v-if="borrowList.length==0">
        <img src="../assets/image/prompt.png" />
        <div>{{$t("prompt")}}</div>
      </div>
    </div>

    <!-- Borrow 弹框-->
    <van-popup v-model="borrowShow">
      <div class="suupplsUp">
        <img src="../assets/image/close.png" class="suupplsUp-icon" @click="onPopUP" />
        <div class="suupplsUp-box">
          <div class="supplyUp-title">USDT-{{showBorrowData.apy_days}}{{$t("Days")}}</div>
          <div class="suupplsUp-LOG LOG-margin">
            <img :src="showBorrowData.asset_icon" />
          </div>

          <div class="text1 supplyUp-linst-text">
            <div>{{$t("CollateralAmount")}}:</div>
            <div>{{showBorrowData.amount}} DBL</div>
          </div>
          <div class="text2 supplyUp-linst-text">
            <div>{{$t("BorrowAmount")}}:</div>
            <div>{{showBorrowData.balance+" "+showBorrowData.asset}}</div>
          </div>
          <div class="text3 supplyUp-linst-text">
            <div>{{$t("Collateralrate")}}:</div>
            <div>{{showBorrowData.borrow_rate}}</div>
          </div>
          <div class="text3 supplyUp-linst-text">
            <div>{{$t("MAXCR")}}:</div>
            <div>{{showBorrowData.borrow_cr}}</div>
          </div>

          <div class="login-list list-margin list-height">
            <input
              type="number"
              class="input-number"
              v-model="borrowDBLNumber"
              @input="onBorrowDBLNumber($event)"
              :placeholder="$t('AddCollateralAmount')"
            />
            <p class="hint-input">DBL</p>
          </div>

          <div class="login-list conversion list-height">
            <img src="../assets/image/xianxia.png" class="conversion-icon" />
            <p>{{balance+" "+"DBL"+" "+$t("Available")}}</p>
          </div>

          <div class="login-list list-height">
            <input
              type="text"
              @input="onBorrowMoneyNumber($event)"
              class="input-number"
              v-model="borrowMoneyNumber"
              readonly="readonly"
              :placeholder="$t('CollateralRate')"
            />
            <p class="hint-input"></p>
          </div>
          <div class="borrow" @click="onAdd">{{$t("Add")}}</div>
        </div>
      </div>
    </van-popup>

 
  </div>
</template>

<script>
import headers from "../components/headers.vue";
import {
  borrowHistorys,
  balance,
  exchangePrice,
  borrowAdd,
  notification
} from "../api/requestApi.js";

export default {
  components: { headers },
  name: "borrowHistory",
  data() {
    return {
      borrowShow: false,
      //数据列表
      borrowList: [],
      renovateCurrentPage: 0,
      //页数
      page: 1,
      //是否已经获取全部的数据
      hasAll: false,
      //用户每次移动都要计算出是否已经到达底部
      //添加质押的显示数据
      showBorrowData: { asset: "" },
      balance: 0,
      borrowDBLNumber: "",
      borrowMoneyNumber: "",
      conversionRate: "",
      getData: false,
      //用户的提示数据
      notificationNumber: {},
     
    };
  },
  created() {
    this.supplyHistory();
    this.getNotification();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, false);
  },
  methods: {
    //获取借款历史列表的历史列表
    async supplyHistory({
      Initialize = true,
      renovateCurrentData = false,
      currentPage = 1
    } = {}) {
      if (!renovateCurrentData) {
        if (this.hasAll) return;
      }
      let page = 1;

      if (this.getData) return;
      this.getData = true;

      if (Initialize) {
        this.hasAll = false;
        this.page == 1;
        page = 1;
      } else {
        !renovateCurrentData && Initialize == true
          ? (page = this.page += 1)
          : (page = currentPage);
      }

      let {
        status,
        data: { data }
      } = await borrowHistorys({
        data: { page, page_size: 10 }
      });

      this.getData = false;
      if (status === 200) {
        if (!renovateCurrentData) {
          if (data.length < 10) {
            this.hasAll = true;
          }

          if (Initialize) {
            this.borrowList = [];
          }
        }

        data.forEach((value, index) => {
          if (renovateCurrentData) {
            this.borrowList.splice(page * 10 - 10 + index, 1, value);
          } else {
            this.borrowList.push(value);
          }
        });
      }
    },

    //用户滑动页面时触发
    handleScroll(e) {
      let top = document.documentElement.scrollTop; // 获取页面滚动高度
      let wimHeight = window.screen.height; //获取窗口的高度
      let HTMLheight = this.$refs.boxHeight.clientHeight; //获取那个list内容的高度

      if (this.hasAll) {
        return;
      }
      if (HTMLheight - top - wimHeight < 200) {
        this.supplyHistory({ Initialize: false });
      }
    },
    //用户关闭弹框
    onPopUP() {
      this.borrowShow = !this.borrowShow;
      this.borrowDBLNumber = "";
      this.borrowMoneyNumber = "";
    },
    //获取某个币种的详细借贷的详细信息。弹出弹框添加质押dbl
    async getBorrowingInfo(index) {
      this.showBorrowData = this.borrowList[index];

      if (this.showBorrowData.status == 2) {
        return;
      }
      this.$toast.loading({ message: this.$t("home6"), overlay: true });
      let { status, data } = await balance();

      if (status === 200) {
        this.balance = this.$toFixedNumber({
          num: data.DBL.balance,
          lengths: 4
        });
      } else {
        return this.$toast.clear();
      }

      let res = await exchangePrice({
        data: { pair: "DBL_" + this.showBorrowData.asset }
      });
      if (res.status === 200) {
        this.borrowShow = true;
        this.conversionRate = res.data.price;
        let page = index / 10;
        if (page == 0) {
          this.renovateCurrentPage = 1;
        } else {
          this.renovateCurrentPage = Math.ceil(page);
        }
      } else {
        this.$toast(res.data.message);
        return this.$toast.clear();
      }

      this.$toast.clear();
    },
    //弹出弹框添加质押dbl
    // onBorrowMoneyNumber(event) {
    //   let val = String(event.target.value);
    //   val.indexOf(".") != -1
    //     ? (this.borrowMoneyNumber = Number(val.slice(0, val.indexOf(".") + 3)))
    //     : (this.borrowMoneyNumber = Number(val));
    //   console.log(this.conversionRate);
    //   this.borrowMoneyNumber = event.target.value;
    //   this.borrowDBLNumber =
    //     this.borrowDBLNumber /
    //     this.conversionRate /
    //     this.borrowInfo.borrow_rate;
    // },
    //用户输入质押数量
    async onBorrowDBLNumber(event) {
      let borrowNumber = "";

      if (event.target.value === "") {
        borrowNumber = 0;
      } else {
        this.borrowDBLNumber = this.$toFixedNumber({
          num: event.target.value,
          lengths: 2,
          transition: false
        });
        borrowNumber = this.borrowDBLNumber;
      }

      if (this.conversionRate == 0 || !this.conversionRate) {
        let res = await exchangePrice({
          data: { pair: "DBL_" + this.showBorrowData.asset }
        });
        if (res.status === 200) {
          this.borrowShow = true;
          this.conversionRate = res.data.price;
        } else {
          this.$toast(res.data.message);
          return;
        }
      }

      this.borrowMoneyNumber =
        (
          (Number(this.showBorrowData.balance) /
            ((Number(borrowNumber) + Number(this.showBorrowData.amount)) *
              this.conversionRate)) *
          100
        ).toFixed(2) + "%";
    },
    //用户添加质押币
    // async onAdd() {
    //   if (this.borrowDBLNumber > this.balance) {
    //     return this.$toast(this.$t("borrowHistory1"));
    //   }
    //   if (!this.borrowDBLNumber) return;
    //   this.$toast({ message: this.$t("home6"), overlay: true });
    //   let { status } = await borrowAdd({ id });
    //   if (status == 200) {
    //     this.$toast.clear();
    //     this.$toast(this.$t("home8"));
    //   } else {
    //     this.$toast.clear();
    //     this.$toast(data.message);
    //   }
    // },

    //用户转钱吧数据传到以太坊的数据链上
    async onAdd({
      from = this.$store.state.address,
      to = this.$store.state.informationTO,
      type = "P",
      coinClass = "DBL"
    }) {
      try {
        let txdata = "";
        let amount = Number(this.borrowDBLNumber);

        txdata = this.$stringToHex(type + ":" + coinClass + ":" + amount);

        if (amount > this.balance) return this.$toast(this.$t("home5"));
        if (amount <= 0) return this.$toast(this.$t("home12"));
        let transactionData = {
          from: from,
          to: to,
          value: this.$toWei(0, "ether"),
          data: txdata,
          //测试
          gas: "60000"
        };

        let res = await ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionData]
        });

        let { status, data } = await borrowAdd({
          id: this.showBorrowData.id,
          data: { amount, txn_hash: res }
        });
        if (status == 200) {
          this.borrowDBLNumber = "";
          this.borrowMoneyNumber = "";
          this.borrowShow = false;
          this.supplyHistory({
            Initialize: false,
            renovateCurrentData: true,
            currentPage: this.renovateCurrentPage
          });
          return this.$toast(this.$t("home8"));
        }

        // web3.eth.sendTransaction(transactionData, async (err, res) => {
        //   if (res) {
        //     let { status, data } = await borrowAdd({
        //       id: this.showBorrowData.id,
        //       data: { amount, txn_hash: res }
        //     });
        //     if (status == 200) {
        //       this.borrowDBLNumber = "";
        //       this.borrowMoneyNumber = "";
        //       this.borrowShow = false;
        //       return this.$toast(this.$t("home8"));
        //     }
        //     // this.$toast(data.message);
        //   } else {
        //     this.$toast(this.$t("home9"));
        //   }
        //   //获取用户哈希传递到后台
        // });
      } catch (error) {
        this.$toast(this.$t("home9"));
      }
    },
    //获取通知用户的数据数量
    async getNotification() {
      try {
        let { status, data } = await notification();

        if (status == 200) {
          for (let key in data) {
            data[key] = Number(data[key]);
          }
          this.notificationNumber = data;
        } else {
          this.notificationNumber = {};
        }
      } catch {
        this.notificationNumber = {};
      }
    }
  }
};
</script>

<style lang="less" scoped >
.warn {
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  // padding: ;
  // justify-items: ;
  // align-content: space-between;
}
.warn > div {
  padding: 14px;
  flex: 1;
  background: rgba(248, 66, 105, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 300;
  color: #f84269;
  text-align: center;
}
.warnText {
  font-size: 14px;
  font-weight: 300;
  color: rgba(248, 66, 105, 0.8);
  padding: 0px 20px 0px 5px;
}
.warnIcon {
  width: 32px;
  height: 32px;
}
.closeIcon {
  width: 25px;
  height: 25px;
}
.warn1 {
  margin: 20px 20px 14px 20px;
}
.warn2 {
  margin: 0px 20px 14px 20px;
}
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
  .list-box {
    width: 100%;
    background: #ffffff;
    border-radius: 14px;

    .Days-time {
      height: 50px;
      width: 100%;
      .titlePrompt {
        flex: 1;
        justify-content: space-between;
        padding-right: 16px;
        border-bottom: 1px solid #f5f4f4;
        line-height: 50px;
      }
      .Days {
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        font-weight: 300;
        color: #262626;
      }
      .titleIcon {
        width: 5px;
        height: 24px;
        border-radius: 3px;
        background: #0dae6a;
        margin-right: 11px;
      }
      .titleIcon.iconColor {
        background: #f84269;
      }
    }
  }
}

.grayText {
  font-size: 14px;
  font-weight: 300;
  color: #787878;
}
.blackText {
  font-size: 14px;
  font-weight: 300;
  color: rgba(00, 00, 00, 0.8);
}
.redText {
  font-size: 14px;
  font-weight: 300;
  color: #f84269;
}
.greenText {
  font-size: 14px;
  font-weight: 300;
  color: #0dae6a;
}

.box {
  padding: 0px 16px;
}
.box > div {
  width: 100%;
  height: 43px;
  font-size: 14px;
  font-weight: 300;
  color: rgba(38, 38, 38, 0.5);
  border-bottom: 1px solid #f5f4f4;
  display: flex;

  align-items: center;
}
.box > div:nth-child(1) {
  justify-content: space-between;
}
.box > div:nth-child(2) {
  justify-content: space-between;
}
.add {
  width: 53px;
  height: 26px;
  border-radius: 4px;
  background: rgba(248, 66, 105, 0.3);
  text-align: center;
  line-height: 26px;
}

.box > div:nth-child(3) > img {
  margin-left: 10px;
  height: 17px;
  width: 17px;
}
.BorrowHistory-list > div {
  margin-bottom: 10px;
}
.BorrowHistory-list > div:nth-last-child(1) {
  margin-bottom: 10px;
}

.suupplsUp {
  width: 343px;
  background: #ffffff;
  border-radius: 14px;
  position: relative;
}
.suupplsUp-icon {
  position: absolute;
  right: 17px;
  top: 20px;
  width: 30px;
  height: 30px;
}
.suupplsUp-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 26px 20px;
}
.suupplsUp-LOG {
  display: inline-block;
  width: 86px;
  height: 86px;
}
.suupplsUp-LOG > img {
  width: 86px;
  height: 86px;
}
.suupplsUp-box-hint {
  font-size: 16px;
  font-weight: 300;
  color: #262626;
  padding: 16px 0px 28px 0px;
}
.login-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #eaeaea;
  margin-bottom: 15px;
  padding: 0px 20px;
}
.login-list.list-margin {
  margin: 0px;
}
.list-left {
  display: flex;
  align-items: center;
  img {
    width: 31px;
    height: 29px;
    margin-right: 16px;
  }
  p {
    font-size: 16px;
    font-weight: 300;
    color: #262626;
  }
}
.arrowsIcon {
  width: 30px;
  height: 30px;
}
.supplyUp-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
.LOG-margin.suupplsUp-LOG {
  margin: 15px 0px;
}
.supplyUp-linst-text {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;

  font-size: 16px;
  font-weight: 300;
  color: #262626;
}
.supplyUp-linst-text.text3 {
  padding-bottom: 12px;
}

.input-number {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  width: 100%;
}

.input-number::-webkit-input-placeholde {
  font-size: 16px;
  font-weight: 300;
  color: #262626;
}
.hint-input {
  font-size: 16px;
  font-weight: 300;
  color: #262626;
}
.conversion {
  height: 50px;
  padding: 0px 0px 0px 36px;
  border: none;
  margin: 0px;
}
.conversion-icon {
  width: 32px;
  height: 32px;
}
.conversion > p {
  font-size: 16px;
  font-weight: 300;
  color: rgba(38, 38, 38, 0.3);
}
.borrow {
  width: 100%;
  height: 50px;
  background: #feb544;
  border-radius: 10px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: 300;
  color: #ffffff;
}
.list-height {
  height: 50px;
}
</style>