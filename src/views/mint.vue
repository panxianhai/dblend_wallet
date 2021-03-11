<template>
  <div class="BorrowHistory">
    <headers :title="$t('MintDIBI')" align="center" />
    <div class="content">
      <div class="mint">
        <div class="mint-box1 mint-box">
          <div class="balance">
            <div class="balance_title">{{$t("From")}}</div>
            <div class="balance_number">{{$t("balance")+':'+balance}}</div>
          </div>
          <div class="making_money">
            <div style="flex:1;">
              <input
                type="number"
                placeholder="0.0"
                class="made_number"
                @input="DBLinpot($event)"
                v-model="DBLhowMany"
              />
            </div>
            <div class="MAX" @click="onMAX">{{$t("MAX")}}</div>
            <div class="coins">DBL</div>
          </div>
        </div>

        <div class="mint-box2 box-flex">
          <div class="next_step-icon">
            <img src="../assets/image/xianxia.png" />
          </div>
          <div class="Price">{{$t("Price")}}: {{exchangePrice}} DBL ={{1}} DIBI</div>
          <img class="mint-box2_icon" src="../assets/image/turn2.png" />
        </div>
        <div class="mint-box3 mint-box">
          <div class="balance">
            <div class="balance_title">{{$t("To")}}</div>
            <div class="balance_number"></div>
          </div>
          <div class="making_money">
            <div style="flex:1;">
              <input
                type="number"
                placeholder="0.0"
                class="made_number"
                @input="DIBIinpot($event)"
                readonly="readonly"
                v-model="DIBIhowMany"
              />
            </div>

            <div class="coins">DlBl</div>
          </div>
        </div>
        <div class="mint-box4 box-flex">
          <img src="../assets/image/add.png" />
        </div>
        <div class="mint-box5 mint-box">
          <div class="balance">
            <div class="balance_title">{{$t("Reward")}}</div>
            <div class="balance_number"></div>
          </div>
          <div class="making_money">
            <div style="flex:1;">
              <input
                type="number"
                placeholder="0.0"
                class="made_number"
                readonly="readonly"
                v-model="rewardHowMany"
              />
            </div>
            <div class="coins">DlBl</div>
          </div>
        </div>
        <div class="mint-box6" :class="bag?'bag':''" @click="onCasting">{{$t("Enteranamount")}}</div>
      </div>
      <div class="consume">
        <div class="box-flex">
          <div class="box-flex">
            <div class="received">{{$t("totalReceiced") }}</div>
            <img src="../assets/image/problem.png" />
          </div>
          <div class="number_DlBl">{{totalReceive?totalReceive:0.0}} DIBI</div>
        </div>

        <div class="box-flex">
          <div class="box-flex">
            <div class="received">{{$t("Mintfee")}}</div>
            <img src="../assets/image/problem.png" />
          </div>
          <div class="number_DlBl">{{DBLhowMany?DBLhowMany:0.0}} DBL</div>
        </div>

        <div class="box-flex">
          <div class="box-flex">
            <div class="received">{{$t("MaximumMint")}}</div>
            <img src="../assets/image/problem.png" />
          </div>
          <div class="number_DlBl">{{balance}} DBL</div>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import headers from "../components/headers.vue";
import { exchangePrice, mint } from "../api/requestApi";

export default {
  components: { headers },
  name: "mint",
  data() {
    return {
      //dbl的余额
      DBL: 0,
      //换算的比例
      exchangePrice: "",
      //换算的酬劳
      rewardHowMany: "",
      //换算的DBL金额
      DBLhowMany: "",
      //换算的DIBI的金额
      DIBIhowMany: "",
      //总共可以获取多少DIBI
      totalReceive: 0.0,
      //判断用户是否可以点击铸币
      bag: false,
      balance: 0,

      //判断用户是否重复点击
      repeat: false,
      //定时器
      setTime: null
    };
  },
  created() {
    if (this.$route.query.balance) {
      this.balance = this.$toFixedNumber({
        num: this.$route.query.balance,
        lengths: 4
      });
    } else {
      this.balance = 0;
    }

    this.querydbl();

    this.getExchangePrice();
  },
  mounted() {},
  methods: {
    //获取用户的交易兑换比例
    async getExchangePrice() {
      let { status, data } = await exchangePrice({
        data: { pair: "DBL_DIBI" }
      });
      if (status === 200) {
        this.exchangePrice = Number(data.price);
      }
    },
    //DIBI用户输入时计算另外一个输入的数据
    DIBIinpot(event) {
      if (!this.exchangePrice) {
        this.$toast(this.$t("mint1"));
        return this.getExchangePrice();
      }

      this.DIBIhowMany = event.target.value;
      this.DBLhowMany = this.DIBIhowMany * this.exchangePrice;
      this.rewardHowMany = this.DIBIhowMany * 0.1;
      this.totalReceive = this.DIBIhowMany + this.rewardHowMany;

      if (
        this.balance &&
        this.DBLhowMany &&
        this.DIBIhowMany &&
        this.totalReceive &&
        this.rewardHowMany
      ) {
        this.bag = true;
      } else {
        this.bag = false;
      }
    },
    //进行设置数据
    // setNumber() {
    //   this.DIBIhowMany = this.DIBIhowMany.toFixed(2);
    //   this.DBLhowMany = this.DIBIhowMany * this.exchangePrice;
    //   this.rewardHowMany = this.DIBIhowMany * 0.1;
    //   this.totalReceive = this.DIBIhowMany + this.rewardHowMany;
    // },

    //DBL用户输入时计算另外一个输入的数据
    DBLinpot(event) {
      if (event.target.value === "") {
        this.DIBIhowMany = "";
        this.rewardHowMany = "";
        this.totalReceive=0
        this.bag = false;
        return;
      }

      let val = this.$toFixedNumber({
        num: event.target.value,
        lengths: 2,
        transition: false
      });
      this.DBLhowMany = val;
      // val.indexOf(".") != -1
      //   ? (this.DBLhowMany = Number(val.slice(0, val.indexOf(".") + 3)))
      //   : (this.DBLhowMany = Number(val));

      this.DIBIhowMany = Math.floor(
        Number(this.DBLhowMany) / this.exchangePrice
      );
      this.rewardHowMany = Math.floor(this.DIBIhowMany * 0.1);
      this.totalReceive = this.DIBIhowMany + this.rewardHowMany;
      if (
        this.balance &&
        this.DBLhowMany &&
        this.DIBIhowMany &&
        this.totalReceive &&
        this.rewardHowMany
      ) {
        this.bag = true;
      } else {
        this.bag = false;
      }
    },
    //计算出所有转换的金额
    onMAX() {
      if (!this.exchangePrice) {
        this.$toast(this.$t("mint1"));
        return this.getExchangePrice();
      }

      let val = this.$toFixedNumber({
        num: this.balance,
        lengths: 2,
        transition: false
      });
      this.DBLhowMany = val;

      this.DIBIhowMany = Math.floor(
        Number(this.DBLhowMany) / this.exchangePrice
      );
      this.rewardHowMany = Math.floor(this.DIBIhowMany * 0.1);
      this.totalReceive = this.DIBIhowMany + this.rewardHowMany;

      if (
        this.balance &&
        this.DBLhowMany &&
        this.DIBIhowMany &&
        this.totalReceive &&
        this.rewardHowMany
      ) {
        this.bag = true;
      } else {
        this.bag = false;
      }
    },
    //用于查询dbl余额
    async querydbl() {
      try {
        let dibiBalance = await dblContract.methods
          .balanceOf(this.$store.state.address)
          .call();
        let value = this.$fromWei(dibiBalance, "Gwei");
        this.balance = this.$toFixedNumber({ num: value, lengths: 4 });
      } catch (error) {
        this.balance = 0;
        this.$toast(this.$t("login4"));
      }
    },
    //用户点击发送请求转账
    onCasting() {
      let DBLhowMany = Number(this.DBLhowMany);

      if (isNaN(DBLhowMany)) {
        return this.$toast(this.$t("home10"));
      } else if (DBLhowMany == 0) {
        return this.$toast(this.$t("home11"));
      } else if (DBLhowMany < 0) {
        return this.$toast(this.$t("home12"));
      }

      if (this.balance == 0 || this.balance < 0) {
        return this.$toast(this.$t("home7"));
      }

      if (!this.bag) return;
      //判断用户是否重复点击
      if (this.repeat) return;
      this.repeat = true;

      // dblContract.methods
      //     .transfer(this.$store.state.address, this.$toWei(DBLhowMany, "Gwei"))
      //     //测试
      //     .send(
      //       { from: this.$store.state.mintTO, gas: 60000 },
      //       (error, transactionHash) => {
      //         if (transactionHash) {
      //           this.mint(DBLhowMany, transactionHash);
      //         }
      //       }
      //     );

      // dblContract.methods
      //   .transfer(this.$store.state.mintTO, this.$toWei(0.1, "Gwei"))
      //   .send(
      //     { from: this.$store.state.address, gas: 60000 },
      //     (error, transactionHash) => {
      //       if (transactionHash) {
      //         this.mint(DBLhowMany, transactionHash);
      //       }
      //     }
      //   );

      try {
        dblContract.methods
          .transfer(this.$store.state.mintTO, this.$toWei(DBLhowMany, "Gwei"))
          //测试
          .send(
            { from: this.$store.state.address, gas: 60000 },
            (error, transactionHash) => {
              if (transactionHash) {
                this.mint(DBLhowMany, transactionHash);
              }
            }
          );
      } catch (error) {
        this.repeat = false;
        this.$toast(this.$t("home3"));
      }
    },

    //转账成功吧交易的值传给后台
    async mint(dbl, txn_hash) {
      try {
        let { status, data } = await mint({ data: { txn_hash, dbl } });
        if (status === 200) {
          this.balance -= dbl;
          this.DIBIhowMany = 0;
          this.DBLhowMany = 0;
          this.rewardHowMany = 0;
          this.totalReceive = 0;
          this.bag = false;
          this.querydbl();
          this.repeat = false;
          this.$toast(this.$t("succeed"));
        }
        this.repeat = false;
        // this.$toast(data.message);
      } catch (error) {
        this.repeat = false;
        this.$toast(this.$t("login6"));
      }
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
.content {
  width: 100%;
  padding: 20px 15px;
}
.mint {
  width: 100%;
  background: #ffffff;
  border-radius: 14px;
  padding: 20px 20px 25px 20px;
  .mint-box {
    width: 100%;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #eaeaea;
    padding: 0px 20px;
    & > div {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  & > .mint-box2 {
    margin: 10px 0px;
    padding: 0px 0px 0px 16px;
    border: none;
    align-items: flex-end;
    .next_step-icon {
      flex: 1;
      height: 32px;
      & > img {
        width: 32px;
        height: 32px;
      }
    }
    .Price {
      padding-right: 8px;

      font-size: 12px;
      font-weight: 400;
      color: rgba(38, 38, 38, 0.5);
    }
    .mint-box2_icon {
      width: 22px;
      height: 22px;
    }
  }
  & > .mint-box4 {
    justify-content: center;
    width: 100%;
    & > img {
      width: 22px;
      height: 22px;
      margin: 18px 0px;
    }
  }
  & > .mint-box6 {
    margin-top: 25px;
    width: 100%;
    height: 50px;
    background: #d7d6d6;
    border-radius: 10px;
    line-height: 50px;
    text-align: center;

    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    &.bag {
      background: rgba(254, 181, 68, 1);
    }
  }
  .balance_title {
    font-size: 16px;
    font-weight: 400;
    color: #262626;
  }
  .balance_number {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }
  .made_number {
    font-size: 18px;
    font-weight: 800;
    color: #262626;
    width: 100%;
    // flex: 1;
  }
  .made_number::placeholder {
    font-size: 18px;
    font-weight: 800;
    color: rgba(38, 38, 38, 0.4);
  }
  .MAX {
    height: 26px;
    background: rgba(254, 181, 68, 0.2);
    border-radius: 4px;
    padding: 0px 9px;
    margin: 0px 10px;
    line-height: 26px;

    font-size: 16px;
    font-weight: 400;
    color: #feb544;
  }
  .coins {
    font-size: 16px;
    font-weight: 400;
    color: #262626;
  }
}

.consume {
  //  width: 100%;
  margin: 0px 10px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0px 0px 14px 14px;
  padding: 16px 10px 15px 20px;
  & > div {
    justify-content: space-between;
  }
  & > div:nth-child(1) {
    padding-bottom: 10px;
  }
  & > div:nth-child(2) {
    padding-bottom: 10px;
  }
  // & > div:nth-child(1) {
  //   padding-bottom: 10px;
  // }
  .received {
    padding-right: 10px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(38, 38, 38, 0.4);
  }
  img {
    width: 16px;
    height: 16px;
  }
  .number_DlBl {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }
}
</style>