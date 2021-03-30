<template>
  <div class="BorrowHistory">
    <headers title="Tansfer" align="center" pathUrl="/" />
    <div class="content">
      <div class="account box-flex">
        <div class="account-header box-flex">
          <div class="From">{{$t("From")}}</div>
          <img src="../assets/image/from_To.png" class="account-header" />
          <div class="To">{{$t("To")}}</div>
        </div>
        <div class="account-box">
          <div class="address">{{above=="Lend Wallet"?$t("LendWallet"):above}}</div>
          <div class="LendWallet">{{below=="Lend Wallet"?$t("LendWallet"):below}}</div>
        </div>
        <div class="account-icon" @click="turn">
          <img src="../assets/image/turn.png" />
        </div>
      </div>
      <div class="Token box-flex">
        <input type="number" disabled="disabled" :placeholder="$t('Token')" />
        <div
          class="box-flex"
          @click="$router.push({path:'selectToken',query:{token:key,to:positiveSequence?1:2}})"
        >
          <!-- <Select v-model="key" style="width:70px;font-size:16px;" size="small">
            <Option v-for="item in cityList" :value="item.value" :key="item.label">{{ item.label }}</Option>
          </Select>-->
          <div class="coin">{{key}}</div>
          <img src="../assets/image/pathIcon.png" class="Token-icon" />
        </div>
      </div>
      <div class="Token box-flex">
        <input
          type="number"
          v-model="amount"
          @input="setAmountNumber($event)"
          :placeholder="$t('Amount')"
        />
        <div class="box-flex">
          <!-- <div class="number">0.0</div> -->
          <div class="MAX" @click="onMAX">{{$t("MAX")}}</div>
        </div>
      </div>
      <div class="prompt">
        <div>{{$t("MaxTransfer")}} {{balance}} {{key}}</div>
        <div>{{$t("poundage")}} {{fee.poundage}} {{fee.coin_type }}</div>
      </div>
      <div
        class="prompt"
        v-show="!positiveSequence"
      >{{$t("poundage")}} {{fee.poundage}} {{fee.coin_type }}</div>
      <div style="width:100%;padding-top:50px;">
        <div class="Conflrm" @click="onConflrm">{{$t("Conflrm")}}</div>
      </div>
    </div>
    <van-popup v-model="show" round closeable style="width:70%;">
      <div class="selectToken">
        <div class="selectTitle">选择币种</div>
        <div
          class="childer"
          v-for="item in cityList"
          :key="item.value"
          @click="onSetKey(item.value)"
        >{{item.value}}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import headers from "../components/headers.vue";
import { withdraw, balance, setDeposit, getPoundage } from "../api/requestApi";

export default {
  components: { headers },
  name: "Tansfer",
  data() {
    return {
      above: "",
      below: "",
      fee: {
        poundage: 0,
        coin_type: ""
      },
      //为true是用户地址在上面，公司账号在下面
      positiveSequence: false,
      key: "",
      //用户需要转账的数量
      amount: "",
      balance: "",
      //判断用户的是否是最后一次赋值异步有延迟所以
      same: 1,
      amountTime: "",

      //控制显示还是隐藏
      show: false,
      //选择币种类型
      cityList: []
    };
  },
  created() {
    if (this.$route.query.to == 1) {
      this.positiveSequence = true;
      this.below = "Lend Wallet";
      this.above =
        this.$store.state.address.substr(0, 4) +
        "……" +
        this.$store.state.address.substr(-4);
    } else {
      this.positiveSequence = false;
      this.below =
        this.$store.state.address.substr(0, 4) +
        "……" +
        this.$store.state.address.substr(-4);
      this.above = "Lend Wallet";
    }
    this.key = this.$route.query.key;

    this.getBalance();
    this.getPoundage();
  },
  methods: {
    //是存钱还是提现
    turn() {
      let storageS = this.above;
      this.above = this.below;
      this.below = storageS;
      this.positiveSequence = !this.positiveSequence;
      this.getBalance();
      this.getPoundage();
    },

    //获取用户最大的转账余额
    onMAX() {
      this.amount = this.balance;

      // let val = String(this.balance);

      // val.indexOf(".") != -1
      //   ? (this.amount = val.slice(0, val.indexOf(".") + 3))
      //   : (this.amount = val);

      // this.amount = this.$toFixedNumber(this.amount);
    },

    async getPoundage() {
      try {
        let { data, status } = await getPoundage({
          data: { symbol: this.key }
        });

        if (status === 200) {
          this.fee = { poundage: data.fee, coin_type: data.coin_type };
        }
      } catch (err) {
        return;
      }
    },
    //吧用户转账的时候变成2位数
    setAmountTime() {
      if (this.amountTime) {
        clearTimeout(this.amountTime);
        this.amountTime = setTimeout(() => {
          this.amount = this.$toFixedNumber({ num: this.amount });
        }, 1000);
      } else {
        this.amountTime = setTimeout(() => {
          this.amount = this.$toFixedNumber({ num: this.amount });
        }, 1000);
      }
    },

    //获取用户的值变成2位数
    setAmountNumber(event) {
      if (event.target.value === "") {
        return;
      }
      let lengths = 2;
      if (this.key === "USDT") {
        lengths = 2;
      } else if (this.key === "ETH") {
        lengths = 4;
      } else {
        lengths = 4;
      }
      let val = this.$toFixedNumber({
        num: event.target.value,
        lengths,
        transition: false
      });
      this.amount = val;
      // val.indexOf(".") != -1
      //   ? (this.amount = val.slice(0, val.indexOf(".") + 3))
      //   : (this.amount = val);

      //  = event.target.value;
      // this.setAmountTime();
    },

    //用户转账
    onConflrm() {
      // if (this.amountTime) {
      //   clearTimeout(this.amountTime);
      // }
      this.amount = Number(this.amount);

      if (!this.amount) {
        this.$toast(this.$t("home11"));
        return;
      }

      if (this.amount > this.balance) {
        this.$toast(this.$t("home5"));
        return;
      }
      // this.amount = this.$toFixedNumber({ num: this.amount });

      switch (this.key) {
        case "USDT":
          if (this.positiveSequence) {
            this.usdtA({
              from: this.$store.state.address,
              to: this.$store.state.saveTO,
              num: Number(this.amount)
            });
          } else {
            this.transferMeney({
              from: this.$store.state.address,
              to: this.$store.state.informationTO,
              coinClassa: this.key
            });
          }
          break;
        case "ETH":
          if (this.positiveSequence) {
            this.ethA({
              from: this.$store.state.address,
              to: this.$store.state.saveTO,
              num: Number(this.amount)
            });
          } else {
            this.transferMeney({
              from: this.$store.state.address,
              to: this.$store.state.informationTO,
              coinClassa: this.key
            });
          }
          break;

        case "DBL":
          if (this.positiveSequence) {
            this.dblA({
              from: this.$store.state.address,
              to: this.$store.state.saveTO,
              num: Number(this.amount)
            });
          } else {
            this.transferMeney({
              from: this.$store.state.address,
              to: this.$store.state.informationTO,
              coinClassa: this.key
            });
          }
          break;
        case "DIBI":
          if (this.positiveSequence) {
            this.dibiA({
              from: this.$store.state.address,
              to: this.$store.state.saveTO,
              num: Number(this.amount)
            });
          } else {
            this.transferMeney({
              from: this.$store.state.address,
              to: this.$store.state.informationTO,
              coinClassa: this.key
            });
          }
          break;
      }
    },
    //转账usdt
    usdtA({ from, to, num }) {
      try {
        usdtContract.methods
          .transfer(to, this.$toWei(num, "usdt"))
          //测试
          .send({ from: from, gas: "60000" }, (error, transactionHash) => {
            // .send({ from: from }, (error, transactionHash) => {
            if (transactionHash) {
              this.setPayRecord({
                amount: num,
                txn_hash: transactionHash,
                coin_type: "USDT"
              });
              this.amount = "";
              this.getBalance();
              this.$toast(this.$t("TransferSuccess"));
            } else {
              this.$toast(this.$t("home9"));
            }
          });
      } catch (error) {
        this.$toast(this.$t("home9"));
      }
    },
    //转账eth
    async ethA({ from, to, num }) {
      try {
        let transactionData = {
          from: from,
          to: to,
          value: this.$toWei(num, "ether"),
          //测试
          gas: "60000"
        };

        // let transactionHash = await ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [transactionData]
        // });

        // var transactionData = { from: loginAccount, to: receiveAddress, value: toWei(0.001, 'ether') };
        //   Web3Provider.eth.sendTransaction(transactionData, (err, res) => {
        //     var output = "";
        //     if (!err) {
        //       output += res;
        //     } else {
        //       output = "Error";
        //     }
        //   });

        //   let transactionData = {
        //   from: from,
        //   to: to,
        //   value: this.$toWei(0, "ether"),
        //   data: txdata,
        //   //测试
        //   gas: "60000"
        // };

        // let transactionHash = await ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [transactionData]
        // });

        // this.amount = "";
        // this.getBalance();
        // this.$toast(this.$t("TransferSuccess"));
        Web3Provider.eth.sendTransaction(transactionData, (err, res) => {
          if (res) {
            this.setPayRecord({ amount: num, txn_hash: res, coin_type: "ETH" });
            this.amount = "";
            this.getBalance();
            this.$toast(this.$t("TransferSuccess"));
          } else {
            this.$toast(this.$t("home9"));
          }
        });
      } catch (error) {
        this.$toast.clear();
        this.$toast(this.$t("home9"));
      }
    },
    //dbl转账
    dblA({ from, to, num, positiveSequence }) {
      try {
        dblContract.methods
          .transfer(to, String(this.$toWei(num, "Gwei")))
          //测试
          .send({ from: from, gas: "60000" }, (error, transactionHash) => {
            // .send({ from: from }, (error, transactionHash) => {
            if (transactionHash) {
              this.setPayRecord({
                amount: num,
                txn_hash: transactionHash,
                coin_type: "DBL"
              });
              this.amount = "";
              this.getBalance();
              this.$toast(this.$t("TransferSuccess"));
            } else {
              this.$toast(this.$t("home9"));
            }
          });
      } catch (error) {
        this.$toast(this.$t("home9"));
      }
    },
    //dibi转账
    dibiA({ from, to, num, positiveSequence }) {
      try {
        dibiContract.methods
          .transfer(to, this.$toWei(num, "Gwei"))
          //测试
          .send({ from: from, gas: "60000" }, (error, transactionHash) => {
            // .send({ from: from,  }, (error, transactionHash) => {
            if (transactionHash) {
              this.setPayRecord({
                amount: num,
                txn_hash: transactionHash,
                coin_type: "DIBI"
              });
              this.amount = "";
              this.getBalance();
              this.$toast(this.$t("TransferSuccess"));
            } else {
              this.$toast(this.$t("home9"));
            }
          });
      } catch (error) {
        this.$toast(this.$t("home9"));
      }
    },

    //通知用于接收到充值通知
    setPayRecord({ amount, txn_hash, coin_type }) {
      setDeposit({ data: { amount, txn_hash, coin_type } });
    },

    //用户转钱吧数据传到以太坊的数据链上
    async transferMeney({ from, to, type = "W", coinClass = this.key }) {
      //禁用功能
      // return this.$toast(this.$t("tansfer2"));
      try {
        let txdata = "";
        let amount = Number(this.amount);

        txdata = this.$stringToHex(type + ":" + coinClass + ":" + amount);

        if (isNaN(amount)) {
          return this.$toast(this.$t("home10"));
        } else if (amount == 0) {
          return this.$toast(this.$t("home11"));
        } else if (amount < 0) {
          return this.$toast(this.$t("home12"));
        }

        if (amount > this.balance) return this.$toast(this.$t("tansfer1"));
        let transactionData = {
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
        let { status, data } = await withdraw({
          data: { amount, asset: this.key, txn_hash: transactionHash }
        });
        if (status == 200) {
          this.amount = "";
          this.getBalance();
          return this.$toast(this.$t("home8"));
        }

        // web3.eth.sendTransaction(transactionData, async (err, res) => {
        //   if (res) {
        //     let { status, data } = await withdraw({
        //       data: { amount, asset: this.key, txn_hash: res }
        //     });
        //     if (status == 200) {
        //       this.amount = "";
        //       this.getBalance();
        //       return this.$toast(this.$t("home8"));
        //     }
        //   } else {
        //     this.$toast(this.$t("home9"));
        //   }
        //   //获取用户哈希传递到后台
        // });
      } catch (error) {
        this.$toast(this.$t("home9"));
      }
    },

    //获取用户的钱包余额
    async getBalance() {
      let getSame = this.same;
      //true时获取用户的线上的钱包余额
      if (this.positiveSequence) {
        switch (this.key) {
          case "ETH":
            this.queryeth(getSame);
            break;
          case "USDT":
            this.queryusdt(getSame);
            break;
          case "DBL":
            this.querydbl(getSame);
            break;
          case "DIBI":
            this.querydibi(getSame);
            break;
        }
      } else {
        let { status, data } = await balance();
        if (status === 200) {
          if (getSame !== this.same) return;
          switch (this.key) {
            case "ETH":
              this.balance = this.$toFixedNumber({
                num: data.ETH.balance,
                lengths: 4
              });
              break;
            case "USDT":
              this.balance = this.$toFixedNumber({
                num: data.USDT.balance,
                lengths: 2
              });
              break;
            case "DBL":
              this.balance = this.$toFixedNumber({
                num: data.DBL.balance,
                lengths: 4
              });
              break;
            case "DIBI":
              this.balance = this.$toFixedNumber({
                num: data.DIBI.balance,
                lengths: 0
              });
          }
        } else {
          this.balance = 0;
        }
      }
    },

    //查询用于usdt
    async queryusdt(getSame) {
      try {
        let tokenBalance = await usdtContract.methods
          .balanceOf(this.$store.state.address)
          .call();
        let value = this.$fromWei(tokenBalance, "usdt");

        this.balance = this.$toFixedNumber({ num: value, lengths: 2 });
      } catch (error) {
        this.$toast(this.$t("login4"));
        this.balance = 0;
      }
    },
    //用于查询eth
    async queryeth(getSame) {
      try {
        let ethBalance = await Web3Provider.eth.getBalance(
          this.$store.state.address
        );
        let value = this.$fromWei(ethBalance, "ether");

        this.balance = this.$toFixedNumber({ num: value, lengths: 4 });
      } catch (error) {
        this.$toast(this.$t("login4"));
        this.balance = 0;
      }
    },
    //用于查询dbl余额
    async querydbl(getSame) {
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
    //用于查询dibi的余额
    async querydibi() {
      try {
        let dibiBalance = await dibiContract.methods
          .balanceOf(this.$store.state.address)
          .call();
        let value = this.$fromWei(dibiBalance, "Gwei");
        this.balance = this.$toFixedNumber({ num: value, lengths: 2 });
      } catch (error) {
        this.balance = 0;
        this.$toast(this.$t("home3"));
      }
    },
    /**
     * @description: 用于选择币种
     * @param {type}
     * @return:
     */
    onSetKey(val) {
      this.show = !this.show;
      this.key = val;
    }
  },
  watch: {
    key() {
      this.getBalance();
      this.getPoundage();
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
  padding: 20px 15px 0px 15px;
}
.account {
  width: 100%;
  height: 110px;
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 15px;
  .account-header {
    width: 75px;
    height: 110px;
    flex-direction: column;
    justify-content: center;
    .From {
      font-size: 15px;
      font-weight: 500;
      color: rgba(109, 114, 120, 0.6);
    }
    .To {
      font-size: 15px;
      font-weight: 500;
      color: rgba(109, 114, 120, 0.6);
    }
    & > img {
      width: 4px;
      height: 36px;
    }
  }
  .account-box {
    height: 110px;
    flex: 1;
    & > div {
      height: 55px;
      width: 100%;
      line-height: 55px;
      font-size: 15px;
      font-weight: 400;
      color: #262626;
    }
    .address {
      border-bottom: 1px solid rgba(234, 234, 234, 1);
    }
    .LendWallet {
    }
  }
  .account-icon {
    width: 80px;
    height: 38px;
    text-align: center;
    & > img {
      width: 38px;
      height: 38px;
    }
  }
}
.Token {
  justify-content: space-between;
  padding: 0px 20px;
  height: 50px;
  width: 100%;
  border-radius: 4px;
  background: #ffffff;
  margin-bottom: 15px;
  & > input {
    flex: 1;
    // width: 100px;
    // max-width: 70%;
    line-height: 50px;
    font-size: 15px;
    font-weight: 400;
    line-height: 50px;
    color: #000000;
  }
  & > input::placeholder {
    font-size: 15px;
    font-weight: 400;
    line-height: 50px;
    color: #6d7278;
  }
  .Token-icon {
    width: 30px;
    height: 30px;
  }
  .coin {
    font-size: 15px;
    font-weight: 400;
    color: #262626;
    // margin-right: 16px;
  }
  .number {
    font-size: 15px;
    font-weight: 500;
    color: rgba(109, 114, 120, 0.6);
  }
  .MAX {
    height: 26px;
    background: rgba(254, 181, 68, 0.3);
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    color: #feb544;
    line-height: 26px;
    padding: 0px 8px;
    margin-left: 10px;
  }
}
.prompt {
  font-size: 12px;
  font-weight: 500;
  color: #6d7278;
  padding-bottom: 5px;
  // padding-bottom: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.Conflrm {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #feb544;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
}
.selectToken {
  text-align: center;
  width: 100%;
  padding: 20px;
}

.selectTitle {
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #000000;
}
.childer {
  font-size: 17px;
  font-weight: 300;
  line-height: 40px;
}
</style>
