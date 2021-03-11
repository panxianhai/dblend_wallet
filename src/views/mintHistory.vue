

<template>
  <div class="BorrowHistory">
    <headers title="MintHistory" />

    <div class="BorrowHistory-list" ref="boxHeight">
      <div class="list-box" v-for="(item,index) in supplyList" :key="index">
        <div class="box-flex Days-time">
          <div class="titleIcon" :class="{iconColor:item.status==3}"></div>

          <div class="titlePrompt box-flex">
            <div class="box-flex Days">
              <div class>{{item.dbl_in}} DBL</div>
              <div class="titlePrompt-icon">Mint</div>
              <div class>{{item.dibi_amount}} DIBI</div>
            </div>
            <div
              class="grayText"
              style="white-space:nowrap;"
            >{{item.status==3?$t("completed"):$t("Matching")}}</div>
          </div>
        </div>

        <div class="box">
          <div class="Collateral grayText" style="word-break:break-all;">
            <P class="box-flex Collateral-p1">
              <span class>{{$t('reward')}}:</span>
              <span class="Collateral-p1-color">{{item.dibi_p10}}DBL</span>
            </P>
            <P>{{item.txn_hash}}</P>
          </div>
          <div class="box-time box-flex">
            <div class="grayText">{{item.created_at}}</div>
            <div class="box-flex">
              <span class="grayText">{{$t("Fee")}}：</span>
              <span class="blackText">{{item.fee}}DBL</span>
            </div>
          </div>
        </div>
      </div>

      <!-- <div>暂无数据</div> -->
    </div>
  </div>
</template>

<script>
import headers from "../components/headers.vue";
import { mintHistory } from "../api/requestApi.js";

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
    //获取铸币的历史列表
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
      } = await mintHistory({
        data: { page: this.page, page_size: 10 }
      });
      this.getData = false;
      if (status === 200) {


        if (data.length < 10) {
          this.hasAll = true;
        }

        if (Initialize) {
          this.supplyList = [];
        }

        data.forEach(value => {
          value.dbl_in = this.$toFixedNumber({
            num: value.dbl_in,
            lengths: 4
          });
          value.dibi_p10 = this.$toFixedNumber({
            num: value.dibi_p10,
            lengths: 4
          });
          value.fee = this.$toFixedNumber({
            num: value.fee,
            lengths: 4
          });
          value.dibi_amount = this.$toFixedNumber({
            num: value.dibi_amount,
            lengths: 0
          });

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

        .titlePrompt-icon {
          width: 46px;
          height: 20px;
          background-image: url("../assets/image/mint.png");
          background-size: 100% 100%;
          line-height: 20px;
          text-align: center;

          font-size: 12px;
          font-weight: 300;
          margin: 0px 5px;
        }
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

.Collateral-p1 {
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 300;
  color: #787878;
}

.Collateral-p1-color {
  padding-left: 10px;
  color: rgba(27, 33, 33, 1);
}

.bag_mint {
  width: 46px;
  line-height: 20px;
  height: 20px;
  background: url("../assets/image/mint.png");
  background-size: 100% auto;
  margin: 0px 5px;
  text-align: center;
  font-size: 12px;
  font-weight: 300;
  color: #1b2121;
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
    width: 100%;
    border-bottom: 1px solid #f5f4f4;
    padding: 13px 0px;
  }
  & > .Collateral > div:nth-child(1) {
    margin-bottom: 8px;
  }
  & > .Collateral > div:nth-child(2) {
    line-height: 20px;
  }
  .box-time {
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
