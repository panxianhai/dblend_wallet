<template>
  <div class="BorrowHistory">
    <div class="header box-flex">
      <div class="header-left box-flex">
        <img src="../assets/image/blackIcon.png" class="header-icon" @click="onBack" />
      </div>
      <p :class="{titleColor:titleAddress}" class="titleAddress">{{titleAddress}}</p>
      <!-- <language color="rgba(0, 0, 0, 0.85)" :bag="bag" v-if="hidden" /> -->
    </div>
    <div class="login">
      <div>
        <img src="../assets/image/logo_login.png" />
      </div>
      <div class="prompt">
        <span>{{$t("EMAIL")}}</span>
      </div>
      <div>
        <input type="text" :placeholder="$t('e_mail')" v-model="email" />
      </div>
      <div class="prompt">
        <span>{{$t("PASSWORD")}}</span>
      </div>
      <div>
        <input
          type="password"
          :placeholder="login==1?$t('inputPassword'):$t('SetPassword')"
          v-model="password"
        />
      </div>
      <!-- 注册 -->
      <div class="information" v-if="login==0">
        <div class="information_head">{{$t("GetInformation")}}</div>
        <div class="information_box information_text box-flex">
          <img src="../assets/image/xuan1.png" alt />
          <p>{{$t("NewTokens")}}</p>
        </div>
        <div class="information_box information_text box-flex">
          <img src="../assets/image/xuan1.png" alt />
          <p>{{$t("ProductUpdates")}}</p>
        </div>
        <div class="information_box information_text box-flex">
          <img src="../assets/image/xuan1.png" alt />
          <p>{{$t("AccountAlerts")}}</p>
        </div>
        <div class="information_text information-bottom">{{$t("emailPrompt")}}</div>
      </div>
      <!-- 忘记密码 -->
      <div class="Looking_for" v-if="login==1" @click="onReset">{{$t("ForgotPassword")}}?</div>
      <div class="condition" @click="onConfirm" v-if="login==1">{{$t("Logln")}}</div>
      <div class="condition" @click="onConfirm" v-if="login==0">{{$t("Register")}}</div>
    </div>
  </div>
</template>

<script>
import headers from "../components/headers.vue";
// import md5 from "md5"
import { login } from "../api/requestApi";

export default {
  components: { headers },
  name: "login",
  data() {
    return {
      //用于判断用于是登陆否从登陆页面换成注册页
      conversion: false,
      //钱包的地址
      address: "",
      //判断是登陆状态还是注册状态
      login: 1,
      //邮箱
      email: "",
      //密码
      password: "",
      //地址的省略地址
      titleAddress: "",

      //判断是是否重复点击
      repeatReset: true,
      //判断是否登陆登陆注册重复点击
      loginRequest: false
    };
  },
  created() {
    let address = sessionStorage.getItem("address") || "";
    if (address) {
      this.address = address;
    }
    this.login = this.$route.query.login;
  },
  mounted() {},
  methods: {
    onBack() {
      //捕获错误跳到首页
      try {
        this.$router.og(-1);
        sessionStorage.removeItem("address");
      } catch (error) {
        this.$router.push({ path: "/" });
        sessionStorage.removeItem("address");
      }
    },

    //用户登录和注册的验证码
    async onConfirm() {
      let email = this.email.trim();
      let password = this.password.trim();

      //判断用户输入的数据格式是否正确
      if (
        !this.$judgeRules({
          rules: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
          value: email
        })
      )
        return this.$toast(this.$t("login2"));

      if (password.length < 8) return this.$toast(this.$t("login1"));

      if (
        !this.$judgeRules({
          rules: /^(?![^a-zA-Z]+$)(?!\D+$).{2,30}/,
          value: password
        })
      )
        return this.$toast(this.$t("login3"));

      //注册前查看
      if (!this.address) return this.$toast(this.$t("login4"));

      if (this.loginRequest) {
        return;
      }
      this.loginRequest = true;

      // 你rinkeby dibi 和dbl 有币么 ，有的话 给0xB22B6e617C7Db1a3b83eb3ddEb0dB8908cbe9cdE 这个地址 每个转 1000个吧。这边好联调。

      //true是登陆，false是注册
      if (this.login == 1) {
        //发送请求登录
        let { status, data } = await login({
          data: { username: email, password: password, address: this.address }
        });

        this.loginRequest = false;

        if (status === 200) {
          //删除用户用户钱包的地址
          sessionStorage.removeItem("address");

          //保存数据到本地
          this.$store.commit("amendData", {
            key: "address",
            value: data.bind_address
          });
          this.$store.commit("amendData", {
            key: "token",
            value: data.api_token
          });

          //添加用户的数据
          this.$store.commit("amendData", {
            key: "userData",
            value: data,
            conversio: true
          });
          this.$router.push({ path: "/" });
        }
      } else {
        this.$store.commit("modifyData", { key: "email", value: email });
        this.$store.commit("modifyData", { key: "password", value: password });

        this.$router.push({
          path: "/VerificationCode",
          query: { register: 1 }
        });

        this.loginRequest = false;

        //   //发送验证注册码
        //   let { status, data } = await registerCode({
        //     data: { username: email }
        //   });
        //   if (status === 200) {
        //     this.$toast(this.$t("login5"));

        //     // sessionStorage.setItem("", );
        //     // sessionStorage.setItem("password", password);
        //     setTimeout(() => {
        //       this.$router.push({
        //         path: "/VerificationCode",
        //         query: { register: 1 }
        //       });
        //     }, 1500);
        //   } else {
        //     this.$toast(data.message);
        //   }
      }
      // this.loginRequest = false;
    },

    //跳转页面到验证码的页面。  密码重置验证码
    async onReset() {
      if (!this.address) return this.$toast(this.$t("login4"));

      this.$router.push({
        path: "/VerificationCode",
        query: { register: 0 }
      });
    }
  },
  watch: {
    address(value) {
      if (value) {
        this.titleAddress = value.substr(0, 4) + "…" + value.substr(-4);
      } else {
        this.titleAddress = "";
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

.titleColor {
  background: #fecb62;
}
.titleAddress {
  padding: 0px 10px;
  height: 35px;

  font-size: 16px;
  font-weight: bold;
  color: #1b2121;
  line-height: 35px;
  border-radius: 5px;
}
.header {
  width: 100%;
  background: #f7f5f5;
  // align-content: center;
  justify-content: space-between;
  padding: 14px 12px 0px 12px;
}
.header-icon {
  width: 22px;
  height: 22px;
  // transform: rotate(90deg);
}
.header-left {
  padding: 0px 0px 0px 5px;
  // flex: 1;
  // justify-content: space-between;
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
.login {
  position: relative;
  padding: 35px 18px 45px 18px;
  width: 100%;
  .prompt {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: #888a8b;
    padding: 8px 0px;
  }

  & > div:nth-child(1) {
    width: 100%;
    padding-bottom: 40px;
    text-align: center;
    & > img {
      width: 158px;
      height: auto;
    }
  }
  & > div:nth-child(3) {
    width: 100%;
    padding: 0px;
    width: 100%;
    margin-bottom: 18px;
  }

  input::placeholder {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25);
    line-height: 50px;
  }
  & > div:nth-child(5) {
    width: 100%;
    // background: #ffffff;

    // margin-bottom: 78px;
    //   height: 50px;
    //   input {
    //     padding-left: 23px;
    //     width: 100%;
    //     height: 50px;
    //     line-height: 50px;
    //     font-size: 16px;
    //     font-weight: 400;
    //     color: rgba(0, 0, 0, 1);

    //   }
  }
  input {
    border-radius: 8px;
    margin: 0px;
    font-size: 16px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #ffffff !important;
    padding-left: 20px;
  }
  input:-internal-autofill-selected {
    background-color: white !important;
    background-image: none !important;
    color: rgb(0, 0, 0) !important;
    box-shadow: inset 0 0 0 1000px white !important;
  }
}
.information {
  padding-top: 20px;
  width: 100%;
  .information_head {
    font-size: 16px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
  }
  .information-bottom {
    padding-top: 20px;
  }
  .information_text {
    font-size: 14px;
    font-weight: bold;
    color: rgba(26, 26, 26, 0.5);
  }
  .information_box {
    padding-top: 10px;
    img {
      width: 17px;
      height: 17px;
    }
    p {
      padding-left: 13px;
    }
  }
}
.Looking_for {
  // position: absolute;
  // right: 20px;
  // top: 330px;
  width: 100%;
  padding-top: 12px;
  text-align: right;
  font-size: 14px;

  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}
.condition {
  width: 100%;
  height: 50px;
  background: #feb544;
  border-radius: 10px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin-top: 55px;
}
</style>


