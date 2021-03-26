<template>
  <div class="BorrowHistory">
    <headers title="SupplyHistory" />

    <div class="BorrowHistory-list" ref="boxHeight">
      <!--  <div class="list-box" v-for="(item,index) in supplyList" :key="index">
        <div class="box-flex Days-time">
          <p class="Days" :class="item.status==2?'overdue':''">{{item.asset}}-{{item.apy_days+$t('Days')}}</p>
          <p class="time" v-if="item.status==0">PENDING</p>
          <p class="time" v-else>{{item.begin_date+"~"+item.end_date}}</p>
        </div>
        <div class="Collateral">{{$t("SupplyAmount")}}: {{item.amount}} {{item.asset}}</div>
        <div class="Collateral">{{$t("APY")}}: {{item.supply_apy}}</div>
        <div class="Collateral">{{$t("Reward")}}: {{item.reward_total}} DBL</div>
      </div>-->

      <!-- <div class="list-box" v-for="(item,index) in supplyList" :key="index">
        <div class="box-flex Days-time">
          <p
            class="Days"
            :class="item.status==2?'overdue':''"
          >{{item.asset}}-{{item.apy_days+$t('Days')}}</p>
          <p class="time" v-if="item.status==0">PENDING</p>
          <p class="time" v-else>{{item.begin_date+"~"+item.end_date}}</p>
        </div>
        <div class="Collateral">{{$t("SupplyAmount")}}: {{item.amount}} {{item.asset}}</div>
        <div class="Collateral">{{$t("APY")}}: {{item.supply_apy}}</div>
        <div class="Collateral">{{$t("Reward")}}: {{item.reward_total}} DBL</div>
      </div>-->

      <div class="list-box" v-for="(item,index) in supplyList" :key="index">
        <div class="box-flex Days-time">
          <div class="titleIcon" :class="{iconColor:item.status==1}"></div>
          <div class="titlePrompt box-flex">
            <p class="Days">USDT-{{item.apy_days}}{{$t("Days")}}</p>
            <div>
              <span class="grayText">{{$t("Reward")}}：</span>
              <span class="blackText">{{item.reward_total}}DBL</span>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="Collateral box-flex">
            <div>
              <span class="grayText">{{$t("SupplyAmount")}}：</span>
              <span class="blackText">{{item.amount+" "+item.asset}}</span>
            </div>
            <div>
              <span class="grayText">{{$t('APY')}}：</span>
              <span class="blackText">{{item.supply_apy}}</span>
            </div>
          </div>
          <div class="box-flex">
            <span class="grayText">{{$t("Time")}}：</span>
            <span
              class="blackText"
            >{{item.status==0?$t('PENDING'):`${item.begin_date} 00:00~${item.end_date} 00:00`}}</span>
          </div>
        </div>
      </div>

      <div class="promptss" v-if="supplyList.length==0">
        <img src="../assets/image/prompt.png" />
        <div>{{$t("prompt")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import headers from "../components/headers.vue";
import { supplyHistorys } from "../api/requestApi.js";

export default {
  components: { headers },
  name: "SupplyHistory",
  data() {
    return {
      //数据列表
      supplyList: [],
      //页数
      page: 1,
      //是否已经获取全部的数据
      hasAll: false,
      //用户每次移动都要计算出是否已经到达底部c

      getData: false //用户是否在继续请求中
    };
  },
  created() {
    this.supplyHistory();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, false);
  },
  methods: {
    //获取Supply的历史列表
    async supplyHistory(Initialize = true) {
      if (this.hasAll) return;
      if (this.getData) return;
      this.getData = true;

      if (Initialize) {
        this.hasAll = false;
        this.page == 1;
      } else {
        this.page += 1;
      }

      let {
        status,
        data: { data }
      } = await supplyHistorys({
        data: { page: this.page, page_size: 10 }
      });
      this.getData = false;
      if (status === 200) {
        if (data.length < 10) {
          this.hasAll = true;
        }

        if (Initialize) {
          this.supplyList = [];
          return data.forEach(value => {
            this.supplyList.push(value);
          });
        }
        data.forEach(value => {
          this.supplyList.push(value);
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
        this.supplyHistory(false);
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
  width: 100%;
  font-size: 14px;
  font-weight: 300;
  color: rgba(38, 38, 38, 0.5);
  padding: 0px 16px;
  & > div {
    height: 45px;
    width: 100%;
    border-bottom: 1px solid #f5f4f4;
  }
  .Collateral {
    justify-content: space-between;
  }
}
// .list-box > div:nth-child(1) {
//   padding: 0px 14px 0px 0px;
// }
// .list-box > div:nth-child(4) > img {
//   margin-left: 10px;
//   height: 17px;
//   width: 17px;
// }
.BorrowHistory-list > div {
  margin-bottom: 10px;
}
.BorrowHistory-list > div:nth-last-child(1) {
  margin-bottom: 10px;
}
</style>
