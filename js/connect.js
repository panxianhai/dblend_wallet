var loginAccount = "";

const DIBI_CONTRACT_ADDR = "0xf2375Ec44934Fe96eE5FFB8eD597c6f9349771Fd";

const MINNER_CONTRACT_ADDR = "0x3800544c0ad45e2222d67151ff08ee0c476f6221";

// MetaMask会向网页注入一个全局的API变量window.ethereum
if (typeof window.ethereum !== "undefined") {
  // 如果已经设置了Provider，则返回当前的Provider。这个方法可以用来检查在使用mist浏览器等情况下已经设置过Provider，避免重复设置的情况。
  let Web3Provider = new Web3(web3.currentProvider);

  var DiBiTokenContract = new Web3Provider.eth.Contract(ABI, DIBI_CONTRACT_ADDR);

  var MinerContract = new Web3Provider.eth.Contract(ABI, MINNER_CONTRACT_ADDR);

}
var storage = window.sessionStorage;

$(document).ready(function () {
  ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else if (loginAccount !== accounts[0]) {
      loginAccount = accounts[0];
      storage.setItem("loginAccount", loginAccount);
      loadPage();
    }
  });
});

// 获取当前登录的去中心化钱包地址（帐号）
async function getLoginAccount() {
  let loginAccount = storage.getItem("loginAccount");
  if (loginAccount == null || loginAccount == "null") {
    await ethereum
      .request({ method: "eth_requestAccounts" })
      .then(async (result) => {
        loginAccount = result[0];
        storage.setItem("loginAccount", loginAccount);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function fromWei(s) {
  return s / 1e8;
}

function toWei(k) {
  return k * 1e8;
}

async function logout() {
  //   ethereum.on("disconnect");
  storage.setItem("loginAccount", null);
  window.location.reload();
}

function goPage(page) {
  window.location.href = page + ".html";
}
