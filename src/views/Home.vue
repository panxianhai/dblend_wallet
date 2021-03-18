<template>
  <div class="home">
    <div class="home-top">
      <div class="home-title">
        <div class="home-title-LOG">
          <img src="../assets/image/logohei2x.png" alt />
        </div>
        <div class="home-title-right">
          <p class="home-ma" v-if="address" @click="$router.push({path:'/ma'})">
            <span class="notification" v-if="notificationNumber">{{notificationNumber}}</span>
            {{titleAddress}}
          </p>
          <language color="#bebebe" bag="#0e0e35" :icon="1" />
        </div>
      </div>
    </div>
    <!-- 钱包 -->
    <div class="wallet">
      <div>
        <div class="wallet-top" v-if="address">
          <div
            class="wallet-top-headline wallet_top_box"
            @click="clickSync(1)"
            :class="walletDIBI==1?'top-color':''"
          >
            <div>{{$t('wallet')}}</div>
          </div>

          <div
            class="wallet-user-name wallet_top_box"
            :class="walletDIBI==2?'top-color':''"
            @click="clickSync(2)"
          >
            <div>{{$t("lendwallet")}}</div>
          </div>
        </div>

        <div class="wallet-top" v-if="!address">
          <div
            class="wallet-top-headline wallet_top_box wallet_top_box_bag"
            @click="balance(1)"
            :class="walletDIBI==1?'top-color':''"
          >
            <div>{{$t('wallet')}}</div>
          </div>
        </div>

        <div class="wallet-noneLogin" v-if="!address">
          <div class="lock-div">
            <img class="lock" src="../assets/image/lock.png" alt />
          </div>
          <div class="locked">{{$t("locked")}}</div>
          <div class="connect" @click="loginShow=true">{{$t("connect")}}</div>
        </div>

        <div class="wallet-Login" v-else>
          <div class="wallet-box min-box-height box-flex">
            <div class="wallet-box-headline1">{{$t('asset')}}</div>
            <div class="wallet-box-headline2">{{$t('balance')}}</div>
            <div class="wallet-box-headline3">{{$t('operation')}}</div>
          </div>

          <div class="wallet-box box-flex" v-if="walletDIBI==1">
            <div class="box-flex bat1">
              <img src="../assets/image/ETH@2x.png" />
              <p>ETH</p>
            </div>
            <div class="bat2">{{walletDIBI==1?walletBalance.ETH:lendWallet.ETH.balance}}</div>
            <div
              class="bat3"
              v-if="true"
              @click="walletClick({walletDIBI:walletDIBI,id:lendWallet.ETH.index,key:'ETH',type:'supply', days:90})"
            >{{walletDIBI==1?$t("Transfer"):$t("Supply")}}</div>
            <!-- <div class="bat3" style="border:none;" v-else-if="true"></div> -->
            <!-- {{$t("Borrow")}} -->
            <!-- <div class="bat3" v-else>{{$t("Mint")}}</div> -->
          </div>

          <div class="wallet-box box-flex">
            <div class="box-flex bat1">
              <img src="../assets/image/USDT.png" />
              <p>USDT</p>
            </div>
            <div class="bat2">{{walletDIBI==1?walletBalance.USDT:lendWallet.USDT.balance}}</div>
            <div
              class="bat3"
              v-if="true"
              @click="walletClick({walletDIBI:walletDIBI,id:lendWallet.USDT.index,key:'USDT',type:'supply', days:90})"
            >{{walletDIBI==1?$t("Transfer"):$t("Supply")}}</div>
            <div class="bat3" v-else-if="false">{{$t("Borrow")}}</div>
            <div class="bat3" v-else>{{$t("Mint")}}</div>
          </div>

          <div class="wallet-box box-flex">
            <div class="box-flex bat1">
              <img src="../assets/image/DBL@2x.png" />
              <p>DBL</p>
            </div>
            <div class="bat2">{{walletDIBI==1?walletBalance.DBL:lendWallet.DBL.balance}}</div>
            <div
              class="bat3"
              v-if="true"
              @click="walletClick({walletDIBI:walletDIBI,id:lendWallet.DBL.index,key:'USDT',type:'borrow', days:90,isDBL:true})"
            >{{walletDIBI==1?$t("Transfer"):$t("Borrow")}}</div>
            <div class="bat3" v-else-if="false">{{$t("Borrow")}}</div>
            <div class="bat3" v-else>{{$t("Mint")}}</div>
          </div>

          <div class="wallet-box box-flex">
            <div class="box-flex bat1">
              <img src="../assets/image/DIBI@2x.png" />
              <p>DIBI</p>
            </div>
            <div class="bat2">{{ walletDIBI==1?walletBalance.DIBI:lendWallet.DIBI.balance}}</div>
            <!-- <div class="bat3" @click="$router.push({path:'/tansfer',query:{key:'DIBI'}})" v-if="walletDIBI==1">{{$t("Transfer")}}</div> -->

            <!-- 切换 -->
            <!-- <div class="bat3" v-if="walletDIBI==2" style="border:none;"></div> -->
            <div class="bat3" @click="onMint">{{walletDIBI==1?$t("Mint"):$t("Transfer")}}</div>
            <!-- <div class="bat3" style="border:none;" v-else></div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 利率表 -->
    <div class="home-bottom">
      <div class="home-bottom-bat">
        <div
          class="home-bottom-title"
          :class="[{'bat-color':bat_color , 'left_border':bat_color}]"
          @click="clickSync(1)"
        >
          <div>{{$t("SupplyMarkets")}}</div>

          <!-- <span v-show="bat_color"></span> -->
        </div>

        <div class="home-bottom-title" :class="[{'bat-color':!bat_color}]" @click="clickSync(2)">
          <div>{{$t("BorrowMarkets")}}</div>

          <!-- <span v-show="!bat_color"></span> -->
        </div>
      </div>

      <div class="time">
        <div
          class="days"
          @click="getList({query:90,left:bat_color,daysColor:1})"
          :class="daysColor==1?'pitchOnDays':''"
        >90 {{$t("Days")}}</div>
        <div
          class="days"
          @click="getList({query:30,left:bat_color,daysColor:2})"
          :class="daysColor==2?'pitchOnDays':''"
        >30 {{$t("Days")}}</div>
        <div
          class="days"
          @click="getList({query:14,left:bat_color,daysColor:3})"
          :class="daysColor==3?'pitchOnDays':''"
        >14 {{$t("Days")}}</div>
        <div
          class="days"
          @click="getList({query:7,left:bat_color,daysColor:4})"
          :class="daysColor==4?'pitchOnDays':''"
        >7 {{$t("Days")}}</div>
      </div>
      <div class="bottom-box-top">
        <div class="bottom-box-headline1">{{$t('asset')}}</div>
        <div class="bottom-box-headline2">{{$t('APY')}}</div>
        <div class="bottom-box-headline3">{{$t('balance')}}</div>
      </div>

      <div v-if="bat_color">
        <div
          class="bottom-box"
          v-for="(item,index) in supplyInterest"
          :key="index"
          :id="item.id"
          @click="walletClick({walletDIBI:2,id:item.id,key:item.asset,type:'supply', days:item.apy_days})"
        >
          <div class="box-name">
            <img :src="item.asset_icon" />
            <p>{{item.asset}}</p>
          </div>
          <div class="interestRate">{{item.supply_apy}}</div>
          <div class="box-iconNumber box-icon" v-if="item.quota==-1">∞</div>
          <div class="box-icon" v-else>{{item.quota}}</div>
        </div>
      </div>

      <div v-else>
        <div
          class="bottom-box"
          v-for="(item,index) in borrowInterest"
          :key="index"
          @click="walletClick({walletDIBI:2,id:item.id,key:item.asset,type:'borrow', days:item.apy_days})"
        >
          <div class="box-name">
            <img :src="item.asset_icon" />
            <p>{{item.asset}}</p>
          </div>
          <div class="interestRate">{{item.borrow_apy}}</div>
          <div class="box-icon">{{item.quota}}</div>
        </div>
      </div>
    </div>
    <!-- 币池 -->
    <div class="pool">
      <div class="pool-title">
        <div class="pool-title-text">{{$t("InterestPool")}}</div>
        <img class="pool-title-icon" src="../assets/image/wenicon.png" />
      </div>
      <div class="pool-box">{{poolNumber}} DBL</div>
      <div style="width:100%;padding:0px 10px;">
        <div
          class="pool-hint"
          v-if="address"
          @click="$router.push({path:'/mint'})"
        >{{$t("Provide")}}</div>
      </div>
    </div>

    <!-- login登陆弹框弹框-->
    <van-popup v-model="loginShow" round>
      <div class="suupplsUp">
        <img src="../assets/image/close.png" class="suupplsUp-icon" @click="loginShow=false" />
        <div class="suupplsUp-box">
          <div class="suupplsUp-LOG">
            <img src="../assets/image/DBL@22x.png" />
          </div>
          <div class="suupplsUp-box-hint">{{$t("using")}}</div>
          <div class="login-list" @click="connect(false)">
            <div class="list-left">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAoCAMAAACl6XjsAAABfVBMVEVHcEx/Rh2ARx2ESiLwiCLMu67cfCagZDOddlJ+Rx7pgiPlfyPshSN/Rxx+Rh2CSB6ASB2JTR7gkkl1SCbQciPUwLLMu6+BSB5/Rx2DSR5+RxzefR3ogCPlfiPGuLHhfiP2jCTvhyN/Rx3nfyPfo2/lfCTIuK7kfyP2jCPkfiPuhSTFtKjogSThfCR/Rx5+Rx3lfiPeeiTDs6koIR2DSh/ifCajWx6qYCDckVOBSR7jfiTyiCOYYTXLcCKpXiHEs6fDs6fCsKYjHBwhHx8iHR0iICB1a2ZyaGIiHyCPTx7ogSTlfyTwhyOASB7ziSTngCTrgyT2jCTthCT1iyPuhCX4jSSESh5/Rx6ITR/+kSTYbyDheSLjfSPBaiPacSDdcyCvYSK0ZCGTVSPGcSblhi/ngSPqgSTdu56mXSDaeSP6jiPmfSD5jSQcGhvimFdqUj/TbSJARUsyQE6tbDLOeyzZx7nayr7hsog7Nza/raDjjUF/VTjFtKhKNCB0amRMd0DeAAAASnRSTlMAe/oOkv4TAwgrpnA9n1n9vkYfHPv+xu2r9mgN6uI4Us5ji/n9Ln7G7pO61/K35ZXYiUji5s21zMnb0/r5aMipm2UkYjSGnPy0/l1QcU4AAALOSURBVHhehdJXXxpNFAbwBYIgoICCIKhgi91ETe/9fZ3ZXui92bvp5bPnzCwzK79c+Fxws3/mOXN2BSe+0Tnh1oBKTI7eqvypSUnaHP4XDIVeRn1cucKSJIUj4wMF6cVgYDr2KsrVXE4imUx6mEmHgoH786ZZ3b3H/usZAWW7R3fsAFFNhCrVwmaKdY4ylZdaqEgjI4yxUm7mpAjvjABjbt/QIIZJ1MF+Pu+eY3MMuwEwl2sfEidiBcdaeUl6yrcEkzks38IWMBnG2gUVTrIljSco4LUNGZxRaeZASW4X63Q5hznHyTGqpAfRwU5+WKGtaxC1SQsSKb+tfOyeTHWRDEyuNGhpf7me5EBjoYowFoEZ+gFx7pH+FYaTA0qBfSG6ErI2KcxZJMxVDhSkS1sV4twuNls0wVi4CYpEJ6yHwXEmpHJ5OxJTGNHhMLjH/BP0uQp2GpTwVhHY+orAExLt9ChxWhFWprYcFihaNKLDegZt7U4FuRpbPtbssONgRNECVjm6wYJFrR+5XK/VavVa9byO4L3qpWqMl/qznGlipV46b5xdturYIK//54sND7sAR3SnlfbZxeVFFYkw3MHV9dIQv8CAQ7qlXl+1kUoO78mMsQvwXiRbh8VjEenEqat9NlvUBmLJol2v6jDe89U0Vb7sDQa7k/UjxZSp04mjpw1ewBBRuV6qVbCCRFmzNNE0rOVZP2EZE9F0u10F10qQsr1hVTQ0WTSs7KwP2NA0wjxlUHWCmJRlo5jNELdlYidQaR92RINRp1P4vfPxnSAszis3XLkMD3Gn8+P0dGHh697e3vdvJyf/f4CrLqm8xFx/+IQ+jH/+QgK/wHbek9ZZwhSkq1MbwUW/f+buRJyIfn79+e/TuGBfomfi6UBmjH3NIL19Ffd6J2YEmhX92UqGbpEHzlzzeuNxL6ht9lmG0g5w5PbrtbWJN2/HyGB/AYd1QUewqrrRAAAAAElFTkSuQmCC"
              />
              <p>{{$t("Metamask")}}</p>
            </div>
            <img class="arrowsIcon" src="../assets/image/jiantou.png" />
          </div>
          <div class="login-list" @click="connect(false)">
            <div class="list-left">
              <svg height="25" viewBox="0 0 40 25" width="30" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m8.19180572 4.83416816c6.52149658-6.38508884 17.09493158-6.38508884 23.61642788 0l.7848727.76845565c.3260748.31925442.3260748.83686816 0 1.15612272l-2.6848927 2.62873374c-.1630375.15962734-.4273733.15962734-.5904108 0l-1.0800779-1.05748639c-4.5495589-4.45439756-11.9258514-4.45439756-16.4754105 0l-1.1566741 1.13248068c-.1630376.15962721-.4273735.15962721-.5904108 0l-2.68489263-2.62873375c-.32607483-.31925456-.32607483-.83686829 0-1.15612272zm29.16903948 5.43649934 2.3895596 2.3395862c.3260732.319253.3260751.8368636.0000041 1.1561187l-10.7746894 10.5494845c-.3260726.3192568-.8547443.3192604-1.1808214.0000083-.0000013-.0000013-.0000029-.0000029-.0000042-.0000043l-7.6472191-7.4872762c-.0815187-.0798136-.2136867-.0798136-.2952053 0-.0000006.0000005-.000001.000001-.0000015.0000014l-7.6470562 7.4872708c-.3260715.3192576-.8547434.319263-1.1808215.0000116-.0000019-.0000018-.0000039-.0000037-.0000059-.0000058l-10.7749893-10.5496247c-.32607469-.3192544-.32607469-.8368682 0-1.1561226l2.38956395-2.3395823c.3260747-.31925446.85474652-.31925446 1.18082136 0l7.64733029 7.4873809c.0815188.0798136.2136866.0798136.2952054 0 .0000012-.0000012.0000023-.0000023.0000035-.0000032l7.6469471-7.4873777c.3260673-.31926181.8547392-.31927378 1.1808214-.0000267.0000046.0000045.0000091.000009.0000135.0000135l7.6473203 7.4873909c.0815186.0798135.2136866.0798135.2952053 0l7.6471967-7.4872433c.3260748-.31925458.8547465-.31925458 1.1808213 0z"
                  fill="#3b99fc"
                />
              </svg>
              <p>{{$t("MobileWallet")}}</p>
            </div>
            <img class="arrowsIcon" src="../assets/image/jiantou.png" />
          </div>
          <div class="login-list" v-if="false">
            <div class="list-left">
              <img src="../assets/image/1@2x.png" />
              <p>{{$t("CoinbaseWallet")}}</p>
            </div>
            <img class="arrowsIcon" src="../assets/image/jiantou.png" />
          </div>
          <div class="login-list list-margin" v-if="false">
            <div class="list-left">
              <img src="../assets/image/0@2x.png" />
              <p>{{$t("Ledger")}}</p>
            </div>
            <img class="arrowsIcon" src="../assets/image/jiantou.png" />
          </div>
        </div>
      </div>
    </van-popup>
    <!-- suuppls 弹框-->
    <van-popup v-model="supplyShow">
      <div class="suupplsUp">
        <img src="../assets/image/close.png" @click="onSupplyShow" class="suupplsUp-icon" />
        <div class="suupplsUp-box">
          <div class="supplyUp-title">{{supplyInfo.asset}}-{{supplyInfo.apy_days}}{{$t("Days")}}</div>

          <div class="suupplsUp-LOG LOG-margin">
            <img :src="supplyInfo.asset_icon" />
          </div>

          <div class="text1 supplyUp-linst-text">
            <div>{{$t("APY")}}:</div>
            <div>{{supplyInfo.supply_apy}}</div>
          </div>

          <div class="text2 supplyUp-linst-text">
            <div>{{$t("ProtocolBalance")}}:</div>
            <div class="infinite" v-if="supplyInfo.quota==-1">∞</div>
            <div class="infinite boxNum" v-else>{{supplyInfo.quota}}</div>
          </div>

          <div class="login-list list-margin list-height">
            <input
              type="number"
              class="input-number"
              v-model="supplyMoney"
              @input="onSupplyMoney($event)"
              :placeholder="$t('CollateralAmount')"
            />
            <div class="number-MAX" @click="onMaxNumber">MAX</div>
            <p class="hint-input">{{supplyInfo.asset}}</p>
          </div>

          <div class="login-list conversion list-height list-align">
            <div class="occupied"></div>
            <p>{{supplyInfo.balance}} {{supplyInfo.asset}} {{$t("Available")}}</p>
          </div>
          <div
            class="borrow"
            @click="transferMeney({id :supplyInfo.id,type:'L' ,coinClass :supplyInfo.asset,daysType:supplyInfo.apy_days })"
          >{{$t("Supply")}}</div>
        </div>
      </div>
    </van-popup>
    <!-- Borrow 弹框-->
    <!-- <van-popup v-model="borrowShow">
      <div class="suupplsUp">
        <img src="../assets/image/close.png" @click="onBorderShow" class="suupplsUp-icon" />
        <div class="suupplsUp-box">
          <div class="supplyUp-title">{{borrowInfo.asset}}-{{borrowInfo.apy_days}}{{$t("Days")}}</div>

          <div class="suupplsUp-LOG LOG-margin">
            <img :src="borrowInfo.asset_icon" />
          </div>

          <div class="text1 supplyUp-linst-text">
            <div>{{$t("APY")}}:</div>
            <div>{{borrowInfo.borrow_apy}}</div>
          </div>
          <div class="text2 supplyUp-linst-text">
            <div>{{$t("ProtocolBalance")}}:</div>
            <div>{{borrowInfo.quota==-1?'infinite':borrowInfo.quota}} USDT</div>
          </div>
          <div class="text3 supplyUp-linst-text">
            <div>{{$t("CollateralRate")}}:</div>
            <div>{{borrowInfo.borrow_rate*100}}%</div>
          </div>
          <div class="text3 supplyUp-linst-text">
            <div>{{$t("MAXCR")}}:</div>
            <div>{{borrowInfo.borrow_cr}}</div>
          </div>

          <div class="login-list list-margin list-height">
            <input
              type="number"
              class="input-number"
              @input="onBorrowDBLNumber($event)"
              v-model="borrowDBLNumber"
              :placeholder="$t('CollateralAmount')"
            />
            <p class="hint-input">DBL</p>
          </div>

          <div class="login-list conversion list-height">
            <img src="../assets/image/xianxia.png" class="conversion-icon" />
            <p>{{borrowInfo.balance}} DBL {{$t("Available")}}</p>
          </div>

          <div class="login-list list-height">
            <input
              type="number"
              class="input-number"
              v-model="borrowMoneyNumber"
              @input="onBorrowMoneyNumber($event)"
              :placeholder="$t('BorrowAmount')"
            />
            <p class="hint-input">{{borrowInfo.asset}}</p>
          </div>
          <div
            class="borrow"
            @click="transferMeney({id :borrowInfo.id,type:'B',coinClass :borrowInfo.asset,daysType:borrowInfo.apy_days })"
          >{{$t("borrow")}}</div>
        </div>
      </div>
    </van-popup>-->
  </div>
</template>
   
<script>
import language from "@/components/language.vue";

import {
  balance,
  borrowList,
  supplyList,
  borrowingInfo,
  supply_markets,
  borrow_markets,
  exchangePrice,
  check,
  mintPool,
  notification,
  supplyMarketsCheck,
  borrowMarketsCheck
} from "../api/requestApi.js";

export default {
  name: "Home",
  components: {
    language
  },
  data() {
    return {
      userInfo: {
        name: ""
      },
      //以太坊的钱余额
      walletBalance: {
        DBL: 0,
        DIBI: 0,
        ETH: 0,
        USDT: 0
      },
      //项目的钱包余额
      lendWallet: {
        DBL: { balance: 0, type: "", index: "" },
        DIBI: { balance: 0, type: "", index: "" },
        ETH: { balance: 0, type: "", index: "" },
        USDT: { balance: 0, type: "", index: "" }
      },
      walletDIBI: 1,
      supplyShow: false,
      borrowShow: false,

      loginShow: false,
      address: "",
      suuppls: {},
      borrow: {},

      //弹框的贷款信息
      borrowInfo: {},
      supplyInfo: {},

      //贷款的利率信息
      supplyInterest: "",
      borrowInterest: "",

      //是借还是取
      bat_color: true,
      daysColor: 1,

      //用户输入存款的钱
      supplyMoney: "",
      //usdt的币
      borrowMoneyNumber: "",
      //dbl的币
      borrowDBLNumber: "",
      //获取币种的换算率
      conversionRate: 0,

      supplyMoneyTime: "", //存款定时器标识
      borrowMoneyTime: "", //借款定时器标识

      //头部的地址省略信息
      titleAddress: "",
      //币池的币数量
      poolNumber: 0,

      //用户的提示数量
      notificationNumber: 0
    };
  },
  created() {
    // console.log(usdtContract)
    // let dibiBalance =  usdtContract
    //       .getBalance(this.address)

    // console.log(web3.eth.getBalance(this.address));

    //用来保存数据
    this.address = this.$store.state.address;

    this.hasLogin();

    // this.balance();
    this.getSupplyList();
    this.getPool();
  },
  mounted() {},
  watch: {
    address(value) {
      if (value) {
        this.titleAddress = value.substr(0, 4) + "…" + value.substr(-4);
      } else {
        this.titleAddress = "";
      }
    }
  },
  methods: {
    //唤醒钱包获取地址唤醒的问题。
    getLoginAccount() {
      ethereum.request({ method: "eth_requestAccounts" }).then(async res => {});
    },

    //登陆建立连接
    connect(Initialize) {
      this.loginShow = false;
      if (typeof window.ethereum !== "undefined") {
        ethereum
          .request({ method: "eth_requestAccounts" })
          .then(result => {
            // storage.setItem("loginAccount", loginAccount);
            if (result.length === 0) {
              this.$toast(this.$t("home1"));
              return;
            } else if (this.$store.state.address === result[0]) {
              // this.$toast("The connection is successful");
              //是否登陆了钱包

              this.address = result[0];
              this.balance();
              this.getNotification();

              return;
            } else if (this.$store.state.address !== result[0]) {
              //这次登陆跟上次不一样，清空数据需要手动连接
              this.$store.commit("amendData", { key: "token", value: "" });
              this.$store.commit("amendData", { key: "address", value: "" });
              this.$store.commit("amendData", { key: "userData", value: "" });
              if (Initialize) {
                return;
              } else {
                this.isLogin(result[0]);
              }

              return;
            }
          })
          .catch(error => {
            throw new Error(error);
          });
      } else {
        this.$toast("MetaMask doesnt exist");
      }
    },
    onSupplyShow() {
      this.supplyShow = false;
      this.supplyMoney = "";
    },
    onBorderShow() {
      this.borrowShow = false;
      this.borrowMoneyNumber = "";
      this.borrowDBLNumber = "";
    },

    //判断是去登陆还是去注册
    async isLogin(address) {
      try {
        let { status, data } = await check({ data: { address } });

        if (status === 200) {
          sessionStorage.setItem("address", address);
          if (data.has_bind == 1) {
            return this.$router.push({
              path: "/login",
              query: { login: 1 }
            });
          }
          return this.$router.push({
            path: "/login",
            query: { login: 0 }
          });
        }
        this.$toast(data.message);
      } catch (res) {
        return;
      }
    },

    //查询用于usdt
    async queryusdt() {
      try {
        let tokenBalance = await usdtContract.methods
          .balanceOf(this.address)
          .call();
        let value = this.$fromWei(tokenBalance, "usdt");
        value = this.$toFixedNumber({ num: value });
        this.$set(this.walletBalance, "USDT", value ? value : 0);
      } catch (error) {
        this.$set(this.walletBalance, "USDT", 0);
        this.$toast(this.$t("home3"));
      }
    },

    //用于查询eth
    async queryeth() {
      try {
        let ethBalance = await Web3Provider.eth.getBalance(this.address);
        let value = this.$fromWei(ethBalance, "ether");
        value = this.$toFixedNumber({ num: value, lengths: 4 });
        this.$set(this.walletBalance, "ETH", value ? value : 0);
      } catch (error) {
        this.$set(this.walletBalance, "ETH", 0);
        this.$toast(this.$t("home3"));
      }
    },
    //用于查询dibi余额
    async querydibi() {
      try {
        let dibiBalance = await dibiContract.methods
          .balanceOf(this.address)
          .call();
        let value = this.$fromWei(dibiBalance, "Gwei");
        value = Number(Math.floor(value));
        this.$set(this.walletBalance, "DIBI", value ? value : 0);
      } catch (error) {
        this.$set(this.walletBalance, "DIBI", 0);
        this.$toast(this.$t("home3"));
      }
    },
    //用于查询dbl余额
    async querydbl() {
      //    let dibiBalance = await dblContract.methods
      //     .balanceOf(this.address)
      //     .call();
      // console.log(dibiBalance)
      try {
        let dibiBalance = await dblContract.methods
          .balanceOf(this.address)
          .call();
        let value = this.$fromWei(dibiBalance, "Gwei");
        value = this.$toFixedNumber({ num: value, lengths: 4 });
        this.$set(this.walletBalance, "DBL", value ? value : 0);
      } catch (error) {
        this.$set(this.walletBalance, "DBL", 0);
        this.$toast(this.$t("home3"));
        throw new Error(error);
      }
    },

    //转账usdt
    usdtA({ to, from, amount }) {
      try {
        usdtContract.methods
          .transfer(to, this.$toWei(amount, "usdt"))
          .send({ from: from }, (error, transactionHash) => {
            if (transactionHash) {
              //通知后台存储成功，然后通知eth那边有一笔存款
            }
          });
      } catch (error) {
        this.$toast(this.$t("home3"));
      }
    },

    //转账eth
    async ethA({ from: to, amount, txdata = "" }) {
      let hashValue = "";
      try {
        var transactionData = {
          from: from,
          to: to,
          value: this.$toWei(amount, "ether"),
          data: txdata
          // gas:60000
        };

        // web3.eth.sendTransaction(transactionData, (err, res) => {
        //   if (res) {
        //     hashValue = res;
        //   }
        // });

        this.hashValue = await ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionData]
        });
      } catch (error) {
        this.$toast(this.$t("home3"));
      }
    },
    //dbl转账
    dblA() {
      try {
        dblContract.methods
          .transfer(this.$store.state.to, this.$toWei(0.1, "Gwei"))
          .send(
            { from: this.loginAccount, gas: 60000 },
            (error, transactionHash) => {
              // if (!error) {
              //   console.log("transactionHash is " + transactionHash);
              // } else {
              //   console.log(error);
              // }
            }
          );
      } catch (error) {
        this.$toast(this.$t("home3"));
      }
    },
    //dibi转账
    dibiA() {
      try {
        dibiContract.methods
          .transfer(this.$store.state.to, this.$toWei(0.1, "Gwei"))
          .send(
            { from: this.loginAccount, gas: 60000 },
            (error, transactionHash) => {
              // if (!error) {
              //   console.log("transactionHash is " + transactionHash);
              // } else {
              //   console.log(error);
              // }
            }
          );
      } catch (error) {
        this.$toast(this.$t("home3"));
      }
    },

    //用户用于点击同步页面展示对应的数据
    clickSync(val = 1) {
      if (val == 1) {
        if (this.address) {
          this.balance(1);
        }

        this.getSupplyList({ query: 90 });
      } else {
        if (this.address) {
          this.balance(2);
        }
        this.getBorrowList({ query: 90 });
      }
    },

    //获取用户余额
    async balance(wallet = 1, val = true) {
      // console.log(this.$store.getters.getData("token"))
      if (val) {
        this.walletDIBI = wallet;
      }

      this.queryusdt();
      this.queryeth();
      this.querydibi();
      this.querydbl();

      let { status, data } = await balance();
      if (status === 200) {
        this.$nextTick(() => {
          for (let key in data) {
            if (key === "USDT") {
              data[key].balance = this.$toFixedNumber({
                num: data[key].balance
              });
            } else if (key === "DBL" || key === "ETH") {
              data[key].balance = this.$toFixedNumber({
                num: data[key].balance,
                lengths: 4
              });
            } else if (key === "DIBI") {
              data[key].balance = this.$toFixedNumber({
                num: data[key].balance,
                lengths: 0
              });
            } else {
            }
          }
          this.lendWallet = data;
        });
      }
    },

    //用户铸币或转账
    onMint() {
      if (this.walletDIBI == 2) {
        this.$router.push({ path: "/Tansfer", query: { key: "DIBI" } });
        return;
      }
      this.$router.push({
        path: "/mint",
        query: { balance: this.walletBalance.DBL }
      });
    },

    //用户点击钱包里面的存款和借款和铸币操作。
    walletClick({
      walletDIBI,
      id = "",
      key = "",
      type = "",
      days = "",
      isDBL = false
    } = {}) {
      //第一个操作用于跳转页面转账
      if (walletDIBI == 1) {
        key = isDBL ? "DBL" : key;
        this.$router.push({ path: "/Tansfer", query: { key: key } });
      } else {
        if (type == "borrow") {
          return this.$router.push({
            name: "borrowPage",
            params: { id, key, type, days }
          });
        }

        //弹出弹框用于借贷
        this.getBorrowingInfo({ id, asset: key, type, days });
      }
    },

    //获取Borrow的markets贷款利率列表
    async getBorrowList({ query = 90, daysColor = 1 } = {}) {
      this.$toast.loading({ message: this.$t("home6"), overlay: true });
      this.daysColor = daysColor;
      this.bat_color = false;
      let { status, data } = await borrowList({ data: { query } });
      this.$toast.clear();
      if (status === 200) {
        this.borrowInterest = data;
        // this.supplyInterest = data;
        return;
      }
      // this.$toast("Get loan interest rate information");
    },

    //获取Supply的markets贷款利率列表
    async getSupplyList({ query = 90, daysColor = 1 } = {}) {
      this.$toast.loading({ message: this.$t("home6"), overlay: true });
      this.daysColor = daysColor;
      this.bat_color = true;

      let { status, data } = await supplyList({ data: { query } });

      this.$toast.clear();
      if (status === 200) {
        this.supplyInterest = data;

        return;
      }
      // this.$toast("Get loan interest rate information");
    },

    //获取用户的数据列表
    getList({ query = 90, daysColor = 1, left = true } = {}) {
      if (left) {
        this.getSupplyList({ query, daysColor });
      } else {
        this.getBorrowList({ query, daysColor });
      }
    },

    //获取某个币种的详细借贷的详细信息
    async getBorrowingInfo({ id = "", type = "", asset = "", days = "" } = {}) {
      if (!this.address) {
        return this.$toast(this.$t("home14"));
      }
      this.$toast.loading({ message: this.$t("home6"), overlay: true });
      let { status, data } = await borrowingInfo({
        data: { type: type, asset: asset, days: days },
        id: id
      });

      this.balance(2, false);

      if (type == "borrow") {
        let res = await exchangePrice({ data: { pair: "DBL_" + asset } });
        if (res.status === 200) {
          this.conversionRate = res.data.price;
        } else {
          return this.$toast.clear();
        }
      }

      this.$toast.clear();
      if (status === 200) {
        data.quota = Number(data.quota);
        if (type == "borrow") {
          this.$nextTick(() => {
            this.borrowInfo = data;
            this.borrowShow = true;
          });
        } else {
          this.$nextTick(() => {
            this.supplyInfo = data;
            this.supplyShow = true;
          });
        }
        return;
      }
      // this.$toast(data.message);
    },

    //用户转钱吧数据传到以太坊的数据链上
    async transferMeney({
      from = this.$store.state.address,
      to = this.$store.state.informationTO,
      id,
      type,
      daysType = "",
      coinClass
    }) {
      if (!this.$store.state.token) {
        return this.$toast(this.$t("home4"));
      }

      //判断是否进行保留两位数的运算

      this.supplyMoney = Number(this.supplyMoney);
      this.borrowDBLNumber = Number(this.borrowDBLNumber);
      this.borrowMoneyNumber = Number(this.borrowMoneyNumber);

      try {
        let txdata = "";
        let amount = "";
        let status = "";
        let message = "";

        if (type == "L") {
          if (Number(this.supplyInfo.quota) == 0) {
            return this.$toast(this.$t("home13"));
          }

          if (
            Number(this.supplyInfo.quota) < this.supplyMoney &&
            Number(this.supplyInfo.quota) !== -1
          ) {
            return this.$toast(this.$t("home13"));
          }

          if (this.supplyMoney > this.supplyInfo.balance) {
            return this.$toast(this.$t("home15"));
          }

          txdata = this.$stringToHex(
            type + ":" + daysType + ":" + coinClass + ":" + this.supplyMoney
          );

          amount = Number(this.supplyMoney);

          if (isNaN(amount)) {
            return this.$toast(this.$t("home10"));
          } else if (amount == 0) {
            return this.$toast(this.$t("home11"));
          } else if (amount < 0) {
            return this.$toast(this.$t("home12"));
          }
          //存款前的检查
          let { status } = await supplyMarketsCheck({
            data: { market_id: id, amount }
          });
          if (status !== 200) {
            return;
          }

          // borrowMarketsCheck,
        } else {
          // 禁止功能
          // return this.$toast(this.$t("home16"));
          this.borrowDBLNumber = Number(this.borrowDBLNumber).toFixed(2);
          this.borrowMoneyNumber = Number(this.borrowMoneyNumber).toFixed(2);

          if (Number(this.borrowInfo.quota) == 0) {
            return this.$toast(this.$t("home13"));
          }

          if (this.borrowDBLNumber > this.borrowInfo.balance) {
            return this.$toast(this.$t("home15"));
          }

          if (
            this.borrowMoneyNumber > this.borrowInfo.quota &&
            this.borrowInfo.quota != -1
          ) {
            return this.$toast(this.$t("home7"));
          }

          txdata = this.$stringToHex(
            type +
              ":" +
              daysType +
              ":" +
              coinClass +
              ":" +
              this.borrowMoneyNumber
          );

          amount = this.borrowDBLNumber;

          if (isNaN(amount)) {
            return this.$toast(this.$t("home10"));
          } else if (amount == 0) {
            return this.$toast(this.$t("home11"));
          } else if (amount < 0) {
            return this.$toast(this.$t("home12"));
          }

          //借款前的检查
          let { status } = await borrowMarketsCheck({
            data: { market_id: id, amount, borrow_rate: 0.7 }
          });
          if (status !== 200) {
            return;
          }
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
        if (type === "L") {
          let resData = await supply_markets({
            data: { market_id: id, amount: amount, txn_hash: transactionHash }
          });
          status = resData.status;
          message = resData.data.message;
        } else {
          let resData = await borrow_markets({
            data: { market_id: id, amount: amount, txn_hash: transactionHash }
          });
          status = resData.status;
          message = resData.data.message;
          this.balance(2);
        }
        if (status == 200) {
          if (type == "L") {
            this.supplyMoney = "";
            this.supplyShow = false;
          } else {
            this.borrowMoneyNumber = "";
            this.borrowDBLNumber = "";
            this.borrowShow = false;
          }
          return this.$toast(this.$t("home8"));
        }

        // web3.eth.sendTransaction(transactionData, async (err, res) => {
        //   if (res) {
        //     if (type === "L") {
        //       let resData = await supply_markets({
        //         data: { market_id: id, amount: amount, txn_hash: res }
        //       });
        //       status = resData.status;
        //       message = resData.data.message;
        //     } else {
        //       let resData = await borrow_markets({
        //         data: { market_id: id, amount: amount, txn_hash: res }
        //       });
        //       status = resData.status;
        //       message = resData.data.message;
        //       this.balance(2);
        //     }
        //     if (status == 200) {
        //       if (type == "L") {
        //         this.supplyMoney = "";
        //         this.supplyShow = false;
        //       } else {
        //         this.borrowMoneyNumber = "";
        //         this.borrowDBLNumber = "";
        //         this.borrowShow = false;
        //       }
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
    },

    //用户输入了多少个抵押的数量
    onBorrowDBLNumber(event) {
      this.borrowDBLNumber = this.$toFixedNumber({
        num: event.target.value,
        lengths: 2,
        transition: false
      });

      this.borrowMoneyNumber = this.$toFixedNumber({
        num:
          Number(this.borrowDBLNumber) *
          this.conversionRate *
          this.borrowInfo.borrow_rate,
        lengths: 2
      });

      // this.setBorrowMoneyTime();
    },

    //用户输入了多少个借款的数量
    onBorrowMoneyNumber(onSupplyMoney) {
      this.borrowMoneyNumber = this.$toFixedNumber({
        num: event.target.value,
        lengths: 2,
        transition: false
      });

      this.borrowDBLNumber = this.$toFixedNumber({
        num:
          Number(this.borrowMoneyNumber) /
          this.conversionRate /
          this.borrowInfo.borrow_rate,
        lengths: 2
      });

      // this.setBorrowMoneyTime();
    },

    //获取用户存款输入的数量
    onSupplyMoney(event) {
      if (event.target.value === "") {
        return;
      }
      this.supplyMoney = this.$toFixedNumber({
        num: event.target.value,
        lengths: 2,
        transition: false
      });
      // this.setSupplyMoneyTime();
    },

    //进行存款的输入框进行四舍五入保留2位
    setSupplyMoneyTime() {
      if (this.supplyMoneyTime) {
        clearTimeout(this.supplyMoneyTime);
        this.supplyMoneyTime = setTimeout(() => {
          this.supplyMoney = Number(this.supplyMoney).toFixed(2);
        }, 1000);
      } else {
        this.supplyMoneyTime = setTimeout(() => {
          this.supplyMoney = Number(this.supplyMoney).toFixed(2);
        }, 1000);
      }
    },
    //进行借款的输入框进行四舍五入保留2位
    setBorrowMoneyTime() {
      if (this.borrowMoneyTime) {
        clearTimeout(this.borrowMoneyTime);
        this.borrowMoneyTime = setTimeout(() => {
          this.borrowDBLNumber = Number(this.borrowDBLNumber).toFixed(2);
          this.borrowMoneyNumber = Number(this.borrowMoneyNumber).toFixed(2);
        }, 1000);
      } else {
        this.borrowMoneyTime = setTimeout(() => {
          this.borrowDBLNumber = Number(this.borrowDBLNumber).toFixed(2);
          this.borrowMoneyNumber = Number(this.borrowMoneyNumber).toFixed(2);
        }, 1000);
      }
    },

    //给用户填入最大的的数据能存款的数据
    onMaxNumber() {
      this.supplyMoney = this.supplyInfo.balance;
    },

    //判断用户是否登陆,自动登陆。没用的函数
    hasLogin() {
      //判断是的拥有插件
      if (typeof window.ethereum !== "undefined") {
        try {
          //建立连接
          ethereum.on("accountsChanged", accounts => {
            //判断是否登陆钱包
            if (accounts.length === 0) {
              return;
            } else if (this.$store.state.address === accounts[0]) {
              //是否登陆了钱包
              this.address = accounts[0];

              var balance = Web3Provider.getBalance(this.address);

              this.getNotification();
              this.balance();
              return;
            } else if (this.$store.state.address !== accounts[0]) {
              sessionStorage.setItem("address", accounts[0]);
              //这次登陆跟上次不一样，清空数据需要手动连接
              this.$store.commit("amendData", { key: "token", value: "" });
              this.$store.commit("amendData", { key: "address", value: "" });
              this.$store.commit("amendData", { key: "userData", value: "" });
              return;
            }
          });
        } catch (error) {}
      }
    },

    //获取币池的数量数据
    async getPool() {
      try {
        let { status, data } = await mintPool();
        if (status === 200) {
          this.poolNumber = this.$toFixedNumber({
            num: data.total,
            lengths: 4
          });
        }
      } catch (res) {
        this.poolNumber = 0;
      }
    },

    //获取通知用户的数据数量
    async getNotification() {
      try {
        let { status, data } = await notification();
        if (status == 200) {
          this.notificationNumber = Number(data.count);
        } else {
          this.notificationNumber = 0;
        }
      } catch {
        this.notificationNumber = 0;
      }
    }
  }
};
</script>
<style scoped lang="less">
.home {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 10px;
  margin: 0px;
  background: #f7f5f5;
}

.home-top {
  width: 100%;
  // height: 225px;
  background: #0e0e35;
  padding: 15px 10px 35px 30px;

  .home-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .home-title-LOG {
      display: flex;
      width: 104px;
      height: auto;
    }
    .home-title-LOG > img {
      width: 100%;
      height: 100%;
    }
    .home-title-right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        height: 35px;
        padding: 0px 9px;
        line-height: 35px;
        border-radius: 4px;
        border: 1px solid #feb544;

        font-size: 16px;
        font-weight: bold;
        color: #1b2121;
        background: #feb544;
        margin-right: 13px;
      }
      .home-ma {
        position: relative;
        .notification {
          position: absolute;
          right: 0px;
          top: 0px;
          line-height: 23px;
          font-size: 14px;
          font-weight: bold;
          color: #ffffff;
          border-radius: 12px;
          height: 23px;
          background: rgba(248, 66, 105, 1);
          min-width: 23px;
          text-align: center;
          margin: -13px -13px;
        }
      }
    }
    // .wallet-top-botton {
    //   font-size: 16px;
    //   font-weight: 800;
    //   color: rgba(0, 0, 0, 0.85);
    // }
  }
}
.wallet {
  // position: relative;
  // margin-top: -110px;
  // margin-left: 10px;
  background: #0e0e35;

  margin-bottom: 10px;
  min-height: 210px;
  // background: #ffffff;

  width: 100%;
  & > div {
    width: 100%;
    background: #ffffff;
    padding: 0px 20px;
    border-radius: 25px 25px 0px 0px;
  }
  .wallet-top {
    // position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 55px;
    // border-bottom: 1px solid #f7f5f5;

    .wallet_top_box {
      flex: 1;
      height: 40px;
      background: #edf1f2;
      border-radius: 8px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
    }

    .wallet-top-headline {
      &.top-color {
        color: #fbfcfd;
        background: rgba(27, 33, 33, 1);
      }
      &.wallet_top_box_bag {
        text-align: left;
        background: #ffffff;
        color: rgba(0, 0, 0, 0.85);
        padding-left: 10px;
        border-bottom: 1px solid rgba(247, 245, 245, 1);
      }
      // &.text_color >div{
      //   font-size: 16px;
      //   font-weight: 800;
      // }
    }
    .wallet-user-name {
      &.top-color {
        color: #fbfcfd;
        background: rgba(27, 33, 33, 1);
      }
    }
  }

  .wallet-noneLogin {
    min-height: 220px;
    width: 100%;
    padding: 15px 0px 35px 0px;
    display: flex;
    flex-direction: column;

    align-items: center;
    // justify-content: space-between;

    // > div {
    //   display: inline-block;
    // }
    .lock-div {
      width: 93px;
      height: 93px;
    }
    .lock {
      width: 93px;
      height: 93px;
    }
    .locked {
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.65);
      padding: 8px 0px 15px 0px;
    }
    .connect {
      text-align: center;
      width: 100%;
      height: 50px;
      background: #feb544;
      border-radius: 4px;
      font-size: 18px;
      font-weight: 600;
      color: rgba(27, 33, 33, 1);
      line-height: 50px;
    }
  }
  .box-flex {
    display: flex;
    align-items: center;
  }

  .wallet-Login {
    width: 100%;
    padding: 0px 0px;
    .wallet-box {
      height: 60px;
      border-bottom: 1px solid #f7f5f5;
      justify-content: space-between;

      &.min-box-height {
        height: 40px;
        background: #f6fafb;
      }

      .wallet-box-headline1 {
        flex: 1;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }

      .wallet-box-headline2 {
        text-align: center;
        line-height: 40px;
        height: 40px;
        flex: 2;
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }
      .wallet-box-headline3 {
        flex: 1;
        text-align: center;
        line-height: 40px;
        height: 40px;
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }
      .bat1 {
        // flex: 2;
        min-width: 80px;
      }
      .bat1 > p {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
      }
      .bat1 > img {
        width: 38px;
        height: 38px;
        border: 1px solid #f7f5f5;
        border-radius: 50%;
        margin-right: 7px;
      }
      .bat2 {
        text-align: center;
        flex: 3;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
      }
      .bat3 {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #feb544;
        line-height: 30px;
        font-size: 14px;
        font-weight: 400;
        color: #feb544;
        text-align: center;
      }
      .bat4 {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #feb544;
        line-height: 30px;
        font-size: 14px;
        font-weight: 400;
        color: #feb544;
        text-align: center;
      }
      .bat5 {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #feb544;
        line-height: 30px;
        font-size: 14px;
        font-weight: 400;
        color: #feb544;
        text-align: center;
      }
      .bat6 {
        width: 72px;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #feb544;
        line-height: 30px;
        font-size: 14px;
        font-weight: 400;
        color: #feb544;
        text-align: center;
      }
    }
  }
}
.home-bottom {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  margin-top: 10px;
  padding: 10px 20px 0px 20px;
  // margin-left: 10px;
  // margin-bottom: 10px;
  .home-bottom-bat {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bold;
    color: #fbfcfd;
    width: 100%;
    height: 40px;
    background: #edf1f2;
    border-radius: 8px;
    text-align: center;
  }

  .home-bottom-title.bat-color {
    background: rgba(27, 33, 33, 1);
    color: #fbfcfd;
  }
  .home-bottom-title {
    // position: relative;
    line-height: 40px;
    height: 40px;
    border-radius: 8px;
    color: rgba(0, 0, 0, 0.5);
    flex: 1;
  }

  .time {
    padding: 20px 0px 0px 0px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    .days {
      width: 25%;
      height: 40px;
      border-radius: 8px 8px 0px 0px;
      font-size: 14px;

      font-weight: bold;
      color: #787878;
      line-height: 40px;
    }
    .days.pitchOnDays {
      background: rgba(237, 241, 242, 1);
      color: rgba(27, 33, 33, 1);
    }
  }
  .bottom-box {
    height: 50px;
    border-bottom: 1px solid #f7f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
    // margin: 0px 20px;
  }

  .bottom-box-top {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
    background: #f6fafb;
  }
  .bottom-box-headline1 {
    flex: 1;
  }
  .bottom-box-headline2 {
    flex: 2;
  }
  .bottom-box-headline3 {
    flex: 1;
  }
  .box-name {
    flex: 1;
    display: flex;
    align-items: center;
    padding-right: 20px;
  }
  .box-name > img {
    widows: 38px;
    height: 38px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .box-name > p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
  }
  .interestRate {
    // flex: 2;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
  }
  .box-icon {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    text-align: right;
    padding-right: 20px;
    color: rgba(0, 0, 0, 0.85);
  }
  .box-iconNumber {
    font-size: 25px;
  }
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
  font-weight: 500;
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
  svg {
    // width: 31px;
    // height: 29px;
    margin-right: 16px;
  }
  p {
    font-size: 16px;
    font-weight: 400;
    color: #262626;
  }
}
.arrowsIcon {
  width: 30px;
  height: 30px;
}
.supplyUp-title {
  font-size: 18px;
  font-weight: 800;
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
  font-weight: 400;
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
  font-weight: 400;
  color: #262626;
}
.hint-input {
  font-size: 16px;
  font-weight: 400;
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
  font-weight: 400;
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
  font-weight: 500;
  color: #ffffff;
}
.list-height {
  height: 50px;
}
.occupied {
  height: 0px;
  width: 0px;
}
.number-MAX {
  padding: 0px 9px;
  height: 26px;
  background: rgba(254, 181, 68, 0.2);
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #feb544;
  line-height: 26px;
  margin: 0px 10px;
}
.list-align {
  align-items: flex-start;
  padding: 10px;
}
.text2 > .infinite {
  font-size: 25px;
}

.text2 > .infinite.boxNum {
  font-size: 14px;
}

.pool {
  width: 100%;
  padding: 0px 10px 10px 10px;
  background: #ffffff;
  margin-top: 10px;

  & > .pool-title {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(247, 245, 245, 1);
    padding: 0px 10px;

    font-size: 15px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    & > .pool-title-icon {
      width: 22px;
      height: 22px;
    }
  }
  & > .pool-box {
    text-align: center;
    padding: 20px 0px;
    width: 100%;
    font-size: 17px;
    font-weight: bold;
    color: #262626;
  }
  .pool-hint {
    line-height: 44px;

    background: #fecb62;
    border-radius: 6px;
    // margin-bottom:20px;

    font-size: 17px;
    font-weight: bold;
    color: rgba(27, 33, 33, 1);
    text-align: center;
  }
}
</style>

