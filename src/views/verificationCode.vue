<template>
  <div class="BorrowHistory">
    <div class="header box-flex">
      <div class="header-left box-flex">
        <img src="../assets/image/blackIcon.png" class="header-icon" @click="$router.go(-1)" />
      </div>
      <p :class="{titleColor:titleAddress}" class="titleAddress">{{titleAddress}}</p>
      <!-- <language color="rgba(0, 0, 0, 0.85)" :bag="bag" v-if="hidden" /> -->
    </div>
    <div class="VerificationCode">
      <div
        class="VerificationCode-header"
      >{{register?$t("Accountverification"):$t("ResetPassword")}}</div>
      <!-- <div
        class="prompt"
      >{{register?`please enter the 6-digit verification code that was sent to ${email}. The code is valid for 30 minutes.`:`Please enter the 6-digit verification code that was sent to ${email}. The code is valid for 30 minutes.`}}</div>-->

      <div
        class="prompt"
      >{{lang !='en'?`请输入您在邮箱 ${email} 收到的6位验证码，验证码30分钟有效`:`Please enter the 6-digit verification code that was sent to ${email}. The code is valid for 30 minutes.`}}</div>

      <div class="code">{{$t("Newemailverificationcode")}}</div>
      <div class="InputBox">
        <div>
          <div :class="code.length>=1?'borderColor':'' ">{{code.length>=1?code.slice(0,1):""}}</div>
          <div :class="code.length>=2?'borderColor':'' ">{{code.length>=2?code.slice(1,2):""}}</div>
          <div :class="code.length>=3?'borderColor':'' ">{{code.length>=3?code.slice(2,3):""}}</div>
          <div :class="code.length>=4?'borderColor':'' ">{{code.length>=4?code.slice(3,4):""}}</div>
          <div :class="code.length>=5?'borderColor':'' ">{{code.length>=5?code.slice(4,5):""}}</div>
          <div :class="code.length>=6?'borderColor':'' ">{{code.length>=6?code.slice(5,6):""}}</div>
        </div>
        <input type="text" maxlength="6" @input="onCode($event)" v-model="code" />
      </div>
      <div
        class="send"
        :class="{sendColor:countdown!=0}"
        @click="codeReset"
      >{{$t("ResendEmail")+(countdown?'('+countdown+')':'')}}>></div>
      <!-- <div class="send" style="padding-right:5px;" v-else>倒计时{{countdown}}</div> -->
    </div>
  </div>
</template>

<script>
// import md5 from "md5"
import headers from "../components/headers.vue";
import { register, resetCode, registerCode } from "../api/requestApi.js";
export default {
  components: { headers },
  name: "VerificationCode",
  data() {
    return {
      //判断是重置密码还是注册,true是注册
      register: "",
      //验证码
      code: "",

      //判断是否正在请求中
      request: true,
      //倒计时
      countdown: 0,
      codeRequest: false,
      setCountdown: null,
      //注册的数据
      //钱包的地址
      address: "",
      titleAddress: "",
      //邮箱
      email: "",
      //密码
      password: "",
      lang: this.$store.state.lang
    };
  },
  watch: {
    // code() {
    //   if (this.code.length === 6) {
    //     if (this.register == 1) {
    //       return this.onRegister();
    //     }
    //     sessionStorage.setItem("code", this.code);
    //     return this.$router.push({ path: "/resetPassword" });
    //   }
    // }
  },
  created() {
    this.address = sessionStorage.getItem("address");
    this.email = this.$store.state.email;
    this.password = this.$store.state.password;
    this.register = Number(this.$route.query.register);
  },
  mounted() {},
  beforeDestroy() {
    this.$store.commit("modifyData", { key: "email", value: "" });
  },
  methods: {
    //判断验证码到了6位没有
    onCode(event) {
      this.code = event.target.value.trim();

      if (this.code.length === 6) {
        if (this.register == 1) {
          return this.onRegister();
        }

        sessionStorage.setItem("code", this.code);
        return this.$router.push({ path: "/resetPassword" });
      }
    },
    //用户注册
    async onRegister() {
      //判断用户输入的数据格式是否正确
      if (
        !this.$judgeRules({
          rules: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
          value: this.email
        })
      )
        return this.$toast("login2");

      if (this.password.length < 8) return this.$toast("login1");

      //注册前查看
      if (!this.address) return this.$toast("login4");

      //判断用户是否已经在请求中
      if (this.request) {
        this.request = false;
        this.$toast.loading({
          overlay: true,
          message: this.$t("VerificationCode4")
        });
        let { status, data } = await register({
          data: {
            username: this.email,
            password: this.password,
            code: this.code,
            address: this.address
          }
        });

        if (status === 200) {
          this.$toast.clear();
          this.$store.commit("modifyData", { key: "email", value: "" });
          this.$store.commit("modifyData", { key: "password", value: "" });
          sessionStorage.removeItem("code");
          this.$toast(this.$t("VerificationCode5"));
          setTimeout(() => {
            this.$router.push({ path: "/login", query: { login: true } });
          }, 1500);
        }
        this.request = true;
      }
    },
    //用户重新获取验证码，注册和密码都有
    async codeReset() {
      let email = this.email;
      let password = this.password;

      //注册前查看
      if (!this.address) {
        this.codeRequest = false;
        return this.$toast(this.$t("login4"));
      }

      // if (this.codeRequest) return;
      // this.codeRequest = true;

      //true是发送注册验证码
      if (this.register == 1) {
        //判断用户输入的数据格式是否正确
        if (
          !this.$judgeRules({
            rules: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
            value: email
          })
        ) {
          this.codeRequest = false;
          return this.$toast(this.$t("login2"));
        }

        if (password.length < 8) {
          this.codeRequest = false;
          return this.$toast(this.$t("login1"));
        }

        if (this.countdown !== 0) {
          return;
        }

        var { status, data } = await registerCode({
          data: { username: email }
        });
      } else {
        if (this.countdown !== 0) {
          return;
        }
        var { status, data } = await resetCode({
          data: { address: this.address }
        });
      }
      //判断是否发送成功
      if (status === 200) {
        this.$toast(this.$t("VerificationCode6"));
        this.setTimeCountdown();
      } else {
        this.countdown = 0;
        // this.$toast(this.$t("VerificationCode7"));
      }
      // this.codeRequest = false;
    },
    //给用户开启倒计时验证码
    setTimeCountdown() {
      if (this.setCountdown) {
        clearInterval(this.setCountdown);
      }
      this.countdown = 60;
      this.setCountdown = setInterval(() => {
        if (this.countdown !== 0) {
          this.countdown--;
        } else {
          if (this.setCountdown) {
            clearInterval(this.setCountdown);
            this.countdown = 0;
          }
          this.countdown = 0;
        }
      }, 1000);
    }
  },
  watch: {
    register() {
      this.codeReset();
    },
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
.VerificationCode {
  position: relative;
  padding: 30px 15px 0px 15px;
  width: 100%;
}
.VerificationCode-header {
  font-size: 24px;
  font-weight: 800;
  color: rgba(0, 0, 0, 0.85);
  padding-bottom: 5px;
}
.title {
  width: 100%;
}
.prompt {
  font-size: 18px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 25px;
  padding-bottom: 40px;
}
.code {
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  padding-block: 15px;
}
.InputBox {
  width: 100%;
  height: 50px;
  position: relative;
  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div {
      width: 50px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e4e4;
    }
    & > .borderColor {
      border-color: rgba(254, 181, 68, 1);
    }
  }
  & > input {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 50px;
    opacity: 0;
    z-index: 2;
  }
}
.send {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  text-align: right;
  padding-top: 25px;
}
.send.sendColor {
  color: rgba(100, 100, 100, 0.85);
}

.condition {
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
</style>
