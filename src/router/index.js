import Vue from "vue";
import VueRouter from "vue-router";

//组件
import home from "../views/home.vue";
import supplyHistory from "../views/supplyHistory.vue";
import borrowHistory from "../views/borrowHistory.vue";
import tansfer from "../views/tansfer.vue";
import mint from "../views/mint.vue";
import ma from "../views/ma.vue";
import login from "../views/login.vue";
import verificationCode from "../views/verificationCode.vue";
import languagePage from "../views/languagePage.vue";
import resetPassword from "../views/resetPassword.vue";
import transferHistory from "../views/transferHistory.vue";
import mintHistory from "../views/mintHistory.vue";
import selectToken from "../views/selectToken.vue";
import borrowPage from "../views/borrowPage.vue";


import store from "../store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: home,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/supplyHistory",
    name: "supplyHistory",
    component: supplyHistory,
    meta: { Title: "", SignIn: true },
  },
  {
    path: "/borrowHistory",
    name: "borrowHistory",
    component: borrowHistory,
    meta: { Title: "", SignIn: true },
  },
  {
    path: "/Tansfer",
    name: "Tansfer",
    component: tansfer,
    meta: { Title: "", SignIn: true },
  },
  {
    path: "/mint",
    name: "mint",
    component: mint,
    meta: { Title: "", SignIn: true },
  },
  {
    path: "/Ma",
    name: "Ma",
    component: ma,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/login",
    name: "login",
    component: login,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/VerificationCode",
    name: "VerificationCode",
    component: verificationCode,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/languagePage",
    name: "languagePage",
    component: languagePage,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/resetPassword",
    name: "resetPassword",
    component: resetPassword,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/transferHistory",
    name: "transferHistory",
    component: transferHistory,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/mintHistory",
    name: "mintHistory",
    component: mintHistory,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/selectToken",
    name: "selectToken",
    component: selectToken,
    meta: { Title: "", SignIn: false },
  },
  {
    path: "/borrowPage",
    name: "borrowPage",
    component: borrowPage,
    meta: { Title: "", SignIn: false },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (!store.state.token) {
    if (to.meta.SignIn) return next("/");
  }

  next();
});

export default router;
