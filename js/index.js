

  // get index.html information
  async function loadPage() {

    var loginAccount = storage.getItem("loginAccount");

    //DBL total supply
    let totalSupply = await MinerContract.methods.totalSupply().call();
    $('#Totalsupply').text(Number(fromWei(totalSupply, "ether")).toFixed(2));

    if (loginAccount != null && loginAccount != "null") {
      $('.mywallet p').text(loginAccount.substr(0, 4) + '...' + loginAccount.substr(-4));

      //get myDBLBalance
      let myDBLBalance = await MinerContract.methods.balanceOf(loginAccount).call();
      $('.myDBLBalance').text(Number(fromWei(myDBLBalance).toFixed(2)));
    }else{
      $('.mywallet p').text('Connect')
    }
  }