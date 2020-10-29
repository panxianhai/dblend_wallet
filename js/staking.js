var dibiMax = 0;
var isApprove = true;

var loginAccount = storage.getItem("loginAccount");

async function loadPage() {
  if (typeof window.ethereum !== "undefined") {
    var loginAccount = storage.getItem("loginAccount");
    if (loginAccount != null && loginAccount != "null") {

      $('.mywallet p').text(loginAccount.substr(0, 4) + '...' + loginAccount.substr(-4))
      //get myDBLBalance
      let myDBLBalance = await MinerContract.methods.balanceOf(loginAccount).call();
      $('.myDBLBalance').text(Number(fromWei(myDBLBalance).toFixed(2)));
      //get stakedAmount
      var stakedAmount = await MinerContract.methods.accountStoked(loginAccount).call();
      $('#stakedAmount').text(Number(fromWei(stakedAmount)).toFixed(2));

      $('.content').show();
      $('#unlockDiv').hide();

      //allow
      var dblearn = document.getElementById("dblearn");
      var div = document.getElementById("contBtnApprove"); //withdrow
      var _withdrow = document.getElementById("withdrow"); //harvest
      var _harvest = document.getElementById("harvest");
      var allow = await DiBiTokenContract.methods
        .allowance(loginAccount, MINNER_CONTRACT_ADDR)
        .call();
      if (allow > 0) {
        isApprove = false;
        var earn = await MinerContract.methods.earnedBalance(loginAccount).call();
        dblearn.innerText = Number(fromWei(earn)).toFixed(2);
        if (earn == 0) {
          var stop =
            "pointer-events: none;text-decoration:line-through;opacity:0.5";
          _withdrow.style = stop;
          _harvest.style = stop;
        }
        div.innerHTML = "Stake DIBI";
      }
    }else{
      $('#unlockDiv').show();
      $('.content').hide();

    }
  }
}

async function stakeDIBI() {
  MinerContract.methods
    .stake(toWei($(".stakeAmount").val()))
    .estimateGas({ from: loginAccount }, async function (error, gasAmount) {
      await MinerContract.methods
        .stake(toWei($(".stakeAmount").val()))
        .send({ from: loginAccount, gas: gasAmount }, function (
          error,
          transactionHash
        ) {
          console.log(error, transactionHash);
          hideStakeDiv();
        });
    });
}

async function withdraw() {
  await MinerContract.methods
    .unStake()
    .estimateGas({ from: loginAccount }, async function (error, gasAmount) {
      await MinerContract.methods
        .unStake()
        .send({ from: loginAccount, gas: gasAmount });
    });
}

async function Harvast() {
  await MinerContract.methods
    .hervast()
    .estimateGas({ from: loginAccount }, async function (error, gasAmount) {
      await MinerContract.methods
        .hervast()
        .send({ from: loginAccount, gas: gasAmount }, function (
          error,
          transactionHash
        ) {
          console.log(error, transactionHash);
        });
    });
}


// 授权或质押
async function approveOrStake() {
  if (isApprove) {
    // 执行approve授权
    await DiBiTokenContract.methods
      .approve(
        MINNER_CONTRACT_ADDR,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
      .send({ from: loginAccount }, function (error, transactionHash) {
        console.log(error, transactionHash);
      });
  } else {
    showStakeDiv();
  }
}

// 展示stake弹窗，并显示最大DIBI质押数量
async function showStakeDiv() {
  DIBIAvailable = await DiBiTokenContract.methods.balanceOf(loginAccount).call();
  dibiMax = Number(fromWei(DIBIAvailable)).toFixed(2);
  $('#DIBIAvailable').text(dibiMax);
  $(".stakeDIBI").show();
}

// 隐藏stake弹窗
function hideStakeDiv() {
  $(".stakeDIBI").hide();
}

// 填充最大DIBI质押数量
function setMaxAmount() {
  $(".stakeAmount").val(dibiMax);
}
