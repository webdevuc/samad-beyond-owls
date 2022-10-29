import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../helper/spinner/spinner.service';
import { environment as env } from "../../../environments/environment";

import Loader from '../../services/nami-loader.service';
import MintLoader from '../../services/nami-minting-243.service';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  adminNamiWalletAddress = env.adminNamiWalletAddress;
  TRIPPY_OWL_COLLECTION_PRICE = env.TRIPPY_OWL_COLLECTION_PRICE
  ASSET_TRANSFER_PRICE = env.ASSET_TRANSFER_PRICE;
  SERVER_URL = env.SERVER_URL;

  authUser: any = null;
  uniswapUrl = env.uniswapUrl;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  timerhide: boolean = true;
  buttondisnft: boolean = false;
  timershow: null;
  circleLoader: boolean = false;
  // myObj = JSON.parse('{"name":"John", "age":31, "city":"New York"}');
  // constructor() { }

  KEY = 'time'
  DEFAULT = 300 // seconds (5 min)

  config: CountdownConfig = { leftTime: this.DEFAULT, notify: 0, format: 'm:s' }

  constructor(
    private readonly APIServices: NFTsAPIServices,
    private readonly router: Router,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) { }

  changeDetection: ChangeDetectionStrategy.OnPush
  public navigateToSection(section: string) {
    window.location.hash = "";
    window.location.hash = section;
  }

  async ngOnInit() {
    localStorage.setItem("isCollectionLaunched", "0");

    let exctingValue: any = localStorage.getItem(this.KEY)
    let value = +exctingValue ?? this.DEFAULT;
    if (value <= 0) {
      value = this.DEFAULT
      //localStorage.clear();
    }
    this.config = { ...this.config, leftTime: value }


    this.buttondisnft = Boolean(localStorage.getItem('buttonvaluenft'));



    // const userApiResp: any = await new Promise(async (resolve, reject) => {
    //   const regUser = await this.APIServices.userRegister({
    //     walletAddr: await Loader.CardanoWalletAddress()
    //   });
    //   resolve(regUser)
    // });
    // if (userApiResp.status) {
    //   localStorage.setItem("token", userApiResp.token);
    //   this.authUser = userApiResp.data.type;
    // }




    this.read();

    // var countDownDate = new Date("March 26, 2022 17:00:00").getTime();
    var countDownDate = new Date(Date.UTC(2022, 2, 29, 14)).getTime();

    var x = setInterval(() => {
      var now = new Date().getTime();

      var distance = countDownDate - now;

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(x);
        localStorage.setItem("isCollectionLaunched", "1");
        this.timerhide = false;
      }
    }, 1000);

    this.APIServices.userLoginData$.subscribe((data) => {
      console.log(data, 'Home component');
      this.authUser = data;
    })

    this.APIServices.claimButtonLoading$.subscribe((data) => {
      console.log(data, '@dadadadad home component claimButtonLoading');
      this.circleLoader = data;
    })

    this.handleClaimButton((localStorage.getItem("claimBtnLoading") === "true" ? true : false));
    await this.syncNamiWallet();
  }

  text: string;
  _CONTENT = ["Secure", "Fair", "Sustainable", " Exponential growth"];
  _PART = 0;
  _PART_INDEX = 0;
  _INTERVAL_VAL: any;

  read() {
    this._INTERVAL_VAL = setInterval(() => this.Type(), 100);
  }

  Type() {
    this.text = this._CONTENT[this._PART].substring(0, this._PART_INDEX + 1);

    //_ELEMENT.innerHTML = text;

    this._PART_INDEX++;
    if (this.text === this._CONTENT[this._PART]) {
      clearInterval(this._INTERVAL_VAL);
      setTimeout(() => {
        this._INTERVAL_VAL = setInterval(() => this.Delete(), 50);
      }, 1000);
    }
  }

  Delete() {
    this.text = this._CONTENT[this._PART].substring(0, this._PART_INDEX - 1);

    this._PART_INDEX--;
    if (this.text === "") {
      clearInterval(this._INTERVAL_VAL);
      if (this._PART == this._CONTENT.length - 1) this._PART = 0;
      else this._PART++;
      this._PART_INDEX = 0;
      setTimeout(() => {
        this._INTERVAL_VAL = setInterval(() => this.Type(), 100);
      }, 200);
    }
  }

  async syncNamiWallet() {
    const Nami = await Loader.Cardano();
    const namiWalletAssetsList = await Nami.getAssets();
    let totalNamiAssets = 0;
    namiWalletAssetsList.map((item: any) => totalNamiAssets += Number(item.quantity));
    console.log("Total Assets: ", totalNamiAssets);

    // this.APIServices.totalNamiWalletNFT$.subscribe((totalNamiAssets) => {
    if (!totalNamiAssets) return;
    console.log(totalNamiAssets, '@dadadadad totalNamiWalletNFT nft collection component');
    // this.authToken = data;
    const prevTotalNamiAssets = localStorage.getItem("namiWalletTotalAssets") ? Number(localStorage.getItem("namiWalletTotalAssets")) : 0;
    console.log("=============== HI ===================", prevTotalNamiAssets)
    if (totalNamiAssets > prevTotalNamiAssets) {
      // console.log("current assets are more than prev");
      // Enable claim button
      this.buttondisnft = false;
      // localStorage.removeItem("buttonvaluenft")
      localStorage.removeItem("claimStartTime");
      localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
      this.handleClaimButton(false);

    } else { // if (totalNamiAssets <= prevTotalNamiAssets) {
      // console.log("current assets are less than prev or equal");

      const claimStartTime: any = localStorage.getItem("claimStartTime");
      if (claimStartTime) {

        const prevTime: any = new Date(claimStartTime)
        const currentTime: any = new Date();

        var diffMs = (currentTime - prevTime);
        var diffDays = Math.floor(diffMs / 86400000); // days
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        console.log("date values: ", diffDays, diffHrs, diffMins);

        // var currentdate: any = new Date("3/8/2022 18:31");
        //     localStorage.setItem("claimStartTime", currentdate);

        // enable claim button if 20 minutes passed
        if (diffDays > 0 || diffHrs > 0 || diffMins > 5) {
          console.log("check data");
          this.buttondisnft = false;
          // localStorage.removeItem("buttonvaluenft")
          localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
          localStorage.removeItem("claimStartTime");
          this.handleClaimButton(false);
        }
      } else {
        this.handleClaimButton(false);
        this.buttondisnft = false;
      }
    }
    // })
  }

  handleClaimButton = (_value: boolean) => {
    // console.log("handleClaimButton func : ", _value);
    localStorage.setItem("claimBtnLoading", `${_value}`);
    this.APIServices.claimButtonLoading$.next(_value);
  }

  // this._INTERVAL_VAL = setInterval(this.Type, 100);
  clickMint = async () => {
    // if (!this.authUser) return;

    // console.log(this.mintNftObj, 'this.mintNftObjakldjfa;lksdjfas')
    // ***
    // verify wallet validations
    // check availbele tokens for minting
    // nami-wallet minting
    // update db records
    // ***
    // this.disablebtn = true;
    // this.circleLoader = true;

    try {

      // const tokenAmmount = Number(this.mintNftObj.amount)
      const MintNami = await MintLoader.Cardano();

      // const userApiResp: any = await new Promise(async (resolve, reject) => {
      //   const regUser = await this.APIServices.userRegister({
      //     walletAddr: await Loader.CardanoWalletAddress()
      //   });
      //   resolve(regUser)
      // });
      // if (userApiResp.status) {
      //   localStorage.setItem("token", userApiResp.token);
      //   this.authUser = userApiResp.data.type;
      // }


      const checkWallet = await Loader.verifyWallet(0, this.authUser.type);
      console.log("clickMint verifyWallet => ", checkWallet);

      if (checkWallet !== true) {
        this.toastr.warning(checkWallet)
        return
      }


      // if ((!localStorage.getItem("isCollectionLaunched") || localStorage.getItem("isCollectionLaunched") !== "1") && this.authUser.type !== "dev") {
      //   if (localStorage.getItem("isCollectionLaunched") || localStorage.getItem("isCollectionLaunched") !== "1") {
      //   this.toastr.info("Comming Soon!")
      //   return
      // }

      const nftResp: any = await new Promise(async (resolve, reject) => {
        const resp = await this.APIServices.verifyClaimedCollection({
          action: 'trippy-owl',
          walletAddress: await Loader.CardanoWalletAddress()
        });
        resolve(resp)
      });
      if (!nftResp.status) {
        this.toastr.error(nftResp.msg);
        // this.circleLoader = false;
        this.handleClaimButton(false);
        return
      }

      const requiredAmount = nftResp.isFreeClaimable ? this.ASSET_TRANSFER_PRICE : this.TRIPPY_OWL_COLLECTION_PRICE + this.ASSET_TRANSFER_PRICE;
      const getBalance = await Loader.getWalletBalance();
      console.log("Wallet balance is: ", getBalance);
      if (!getBalance) { this.toastr.warning('Something went wrong to get wallet balance'); return; }
      if (await Loader.convertToADA(getBalance) < requiredAmount) { this.toastr.warning('Insufficient balance'); return; }

      this.handleClaimButton(true);

      // const newPolicy = await MintLoader.createPolicy();
      // console.log("newPolicy ", JSON.stringify(newPolicy));
      const recipients = [
        // { // mint nft against connected wallet
        //   address: await MintNami.getAddress(),
        //   amount: this.ASSET_TRANSFER_PRICE,
        //   mintedAssets: [{
        //     assetName: this.mintNftObj.assetKey, quantity: "1", policyId: newPolicy.id,
        //     policyScript: newPolicy.script
        //   }]
        // },
        { // send nft amount to admin
          address: this.adminNamiWalletAddress,
          // claim free if exist into airdrop addresses
          amount: requiredAmount
        }
      ];

      // const mintMetadata: any = {
      //   "721": {
      //     [newPolicy.id]: {
      //       [this.mintNftObj.assetKey]: {
      //         name: this.mintNftObj.assetKey,
      //         description: 'GRISE NFT Marketplace.', // `GRISE Metamoonverse NFT Marketplace. https://grisemetamoonverse.io/nft`,
      //         image: this.mintNftObj.imageUrl,
      //         authors: ["GRISE"] // GRISEMETAMOONVERSE
      //       }
      //     }
      //   }
      // };
      // console.log("mintMetadata => ", JSON.stringify(mintMetadata));
      let txHash: any = '';
      try { // T#1
        console.log("======================= Start Tx ==========================")
        txHash = await MintLoader.buildFullTransaction(recipients);
        console.log("======================= End Tx ==========================")

        if (txHash && txHash.error) {
          this.toastr.error("Transaction Failed");
          // this.disablebtn = false;
          // this.circleLoader = false;
          this.handleClaimButton(false);
          return
        }
      } catch (err: any) {
        console.log("err1: ", err);
        this.handleClaimButton(false);
        if (err && err.info) {
          this.toastr.info(err.info);
          // this.circleLoader = false;
          // this.disablebtn = false;
          //console.log(err.info, "error test");
          return

        }
        else if (err.toString().includes("MIN_UTXO_ERROR")) {
          this.toastr.warning("Insufficient balance");
          return;
        }
        // else {

        //   console.log("mintMetadata 1:: ", JSON.stringify(mintMetadata));
        //   try { // T#2
        //     delete mintMetadata["721"][newPolicy.id][this.mintNftObj.assetKey].description;
        //     txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
        //   } catch (err2) {
        //     console.log("err2: ", err2);
        //     try { // T#3
        //       mintMetadata["721"][newPolicy.id][this.mintNftObj.assetKey].image = this.mintNftObj.imageLink;
        //       txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
        //     } catch (err3) {
        //       console.log("err3: ", err3);
        //       try { // T#4
        //         delete mintMetadata["721"][newPolicy.id][this.mintNftObj.assetKey].image;
        //         // mintMetadata["721"][newPolicy.script] = mintMetadata["721"][newPolicy.id];
        //         // delete mintMetadata["721"][newPolicy.id];
        //         // console.log("mintMetadata 3:: ", JSON.stringify(mintMetadata));
        //         txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
        //       } catch (err4) {
        //         console.log("err4: ", err4);
        //         txHash = await MintLoader.buildFullTransaction(recipients);
        //       }
        //     }

        //   }
        // }
      }
      console.log("mintTransaction ", txHash);

      // const txHash = await Nami.send({
      //   address: this.adminNamiWalletAddress, // ADMIN ADDRESS
      //   amount: tokenAmmount
      // })
      if (!txHash) {
        this.toastr.error("Unable to proceed this transaction, Try again!");
        // this.circleLoader = false;
        this.handleClaimButton(false);
      } else {
        // this.toastr.success(`TxHash is: ${txHash}`, "Trippy Owl Collection claimed successfully");
        const data = {
          isFreeClaimable: nftResp.isFreeClaimable,
          walletAddress: await Loader.CardanoWalletAddress() // this.authUser.walletAddr

          // nftId: this.mintNftObj._id,
          // mintToken: `${newPolicy.id}.${this.mintNftObj.assetKey}`,
          // nftQuantity: 1
        }

        this.APIServices.mintTrippyOwl(data)
          .then((res) => {

            // this.btnid = ""
            if (res.status) {
              var currentdate: any = new Date();
              localStorage.setItem("claimStartTime", currentdate);

              // this.disablebtn = false;
              // this.mintNftObj.quantity = String(Number(this.mintNftObj.quantity) - 1);
              this.toastr.success(`TxHash is: ${txHash}`, res.msg);
              this.buttondisnft = true;
              localStorage.setItem("buttonvaluenft", `${this.buttondisnft}`)
              // this.circleLoader = false;
              this.handleClaimButton(false);
              setTimeout(() => {
                this.buttondisnft = false;
                // localStorage.removeItem(`${this.buttondis}`)
              }, 300000);

            } else {
              // this.toastr.success(`TxHash is: ${txHash}`, "Trippy Owl Collection claimed successfully");
              this.toastr.error(res.msg);
              // this.circleLoader = false;
              this.handleClaimButton(false);


            }
          })
          .catch((err) => {
            // this.toastr.success(`TxHash is: ${txHash}`, "Trippy Owl Collection claimed successfully");
            this.toastr.error("Something went wrong");
            console.log("Error is: ", err);
            // this.circleLoader = false;
            this.handleClaimButton(false);

            // this.disablebtn = false;
          });
      }

    } catch (error: any) {
      console.log("Error :: ", error);
      if (error && error.info) {
        this.toastr.info(error.info);
      } else {
        this.toastr.error("Something went wrong");
        // this.circleLoader = false;

      }
      this.handleClaimButton(false);
    }
  }
  // handleEvent(ev: CountdownEvent) {
  //   //console.log(ev, "envkfadfja;lsdjf")
  //   if (ev.action === 'notify') {
  //     // Save current value
  //    localStorage.setItem(this.KEY, `${ev.left / 1000}`);
  //   }
  //   if (ev.action === 'done'){
  //     localStorage.removeItem("buttonvalue")
  //     localStorage.removeItem("time")
  //     //localStorage.clear();
  //     this.buttondis = false;   
  //   }

  // }



}
