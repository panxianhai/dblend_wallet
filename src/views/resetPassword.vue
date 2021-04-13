<template>
  <div class="BorrowHistory">
    <div class="header box-flex">
      <div class="header-left box-flex">
        <img src="../assets/image/blackIcon.png" class="header-icon" @click="$router.go(-1)" />
      </div>
    </div>
    <div class="login">
      <div class="prompt">{{$t("newPassword")}}</div>
      <div>
        <input type="password" :placeholder="$t('inputPassword')" v-model="password" />
      </div>
      <div class="prompt">{{$t("Confirmpassword")}}</div>
      <div>
        <input type="password" :placeholder="$t('ConfirmPassword')" v-model="Confirmpassword" />
      </div>
      <!-- <div class="Looking_for" v-if="login" @click="onReset">{{$t("ForgotPassword")}}?</div> -->
      <div class="condition" @click="onConfirm">{{$t("Confirm")}}</div>
    </div>
  </div>
</template>



<script>
// import md5 from "md5"
// import headers from "../components/headers.vue";
import { reset } from "../api/requestApi";

export default {
  // components: { headers },
  name: "resetPassword",
  data() {
    return {
      //钱包的地址
      address: "",
      //邮箱
      password: "",
      //密码
      Confirmpassword: "",

      //判断是是否重复点击
      repeatReset: false,
      code: ""
    };
  },
  created() {
    
    let address = sessionStorage.getItem("address") || "";
    if (address) {
      this.address = address;
    }
    let code = sessionStorage.getItem("code");
    if (code) {
      this.code = code;
    }
  },
  mounted() {},
  methods: {
    //重置密码
    async onConfirm() {
      let password = this.password.trim();
      let Confirmpassword = this.Confirmpassword.trim();

      //判断用户输入的数据格式是否正确
      if (password.length < 8) return this.$toast(this.$t("login1"));
      if (
        !this.$judgeRules({
          rules: /^(?![^a-zA-Z]+$)(?!\D+$).{2,30}/,
          value: password
        })
      )
        return this.$toast("login3");

      if (Confirmpassword !== password)
        return this.$toast(this.$t("VerificationCode1"));

      //注册前查看
      if (!this.address) return this.$toast(this.$t("login4"));
      if (!this.code) return this.$toast(this.$t("VerificationCode2"));
      //判断是否重复点击
      if (this.repeatRese) {
        return;
      }
      this.repeatRese = true;

      //发送请求重置密码
      let { status, data } = await reset({
        data: {
          address: this.address,
          password: password,
          password_confirmation: Confirmpassword,
          code: this.code
        }
      });

      if (status === 200) {
        this.$toast(this.$t("VerificationCode3"));
        sessionStorage.removeItem("code");

        setTimeout(() => {
          this.$router.push({ path: "/login", query: { login: 1 } });
        }, 1500);
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

.header {
  height: 50px;
  width: 100%;
  background: #f7f5f5;
  justify-content: space-between;
  padding: 0px 12px;
}
.header-icon {
  width: 22px;
  height: 22px;
  // transform: rotate(90deg);
}
.header-left {
  padding: 0px 0px 0px 5px;
  flex: 1;
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
  padding: 50px 18px 0px 18px;
  width: 100%;
  .prompt {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: #888a8b;
    padding: 8px 0px;
  }

  & > div:nth-child(2) {
    width: 100%;
    margin-bottom: 20px;
  }
  & > div:nth-child(4) {
    width: 100%;

    margin-bottom: 20px;
    // height: 50px;
  }
  input {
    padding-left: 23px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 50px;
    background: #ffffff;
    border-radius: 8px;
  }
  input::placeholder {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.25);
    line-height: 50px;
  }
  // & > div:nth-child(5) {
  //   width: 100%;
  //   border-radius: 8px;
  //   margin-bottom: 78px;
  //   // height: 50px;
  // }
}
// .Looking_for {
//   position: absolute;
//   right: 20px;
//   top: 317px;
//   font-size: 14px;
//   font-weight: 400;
//   color: rgba(0, 0, 0, 0.85);
// }
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
  margin-top: 60px;
}
// .Register {
//   width: 100%;
//   height: 50px;
//   background: #ffffff;
//   border-radius: 10px;
//   line-height: 60px;
//   text-align: center;
//   font-size: 16px;
//   font-weight: 600;
//   color: rgba(0, 0, 0, 0.85);
// }
</style>

