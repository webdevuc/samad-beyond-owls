import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../helper/spinner/spinner.service';
import { environment as env } from "../../../environments/environment";

import Loader from '../../services/nami-loader.service';
import MintLoader from '../../services/nami-minting-243.service';
import CCLoader from '../../services/ccvault-minting.service';
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
  selectedCaardanoWallet: any = 'nami';
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

    let exctingValue: any = localStorage.getItem(this.KEY)
    let value = +exctingValue ?? this.DEFAULT;
    if (value <= 0) {
      value = this.DEFAULT
      //localStorage.clear();
    }
    this.config = { ...this.config, leftTime: value }

    this.buttondisnft = Boolean(localStorage.getItem('buttonvaluenft'));

    this.read();

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
        this.timerhide = false;
      }
    }, 1000);


    // Get selected wallet
    this.APIServices.selectedWallet$.subscribe((data) => {
      console.log(data, 'selectedWallet Home component');
      this.selectedCaardanoWallet = data;
    });

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

    if (!totalNamiAssets) return;
    const prevTotalNamiAssets = localStorage.getItem("namiWalletTotalAssets") ? Number(localStorage.getItem("namiWalletTotalAssets")) : 0;
    console.log("=============== HI ===================", prevTotalNamiAssets)
    if (totalNamiAssets > prevTotalNamiAssets) {
      // Enable claim button
      this.buttondisnft = false;
      localStorage.removeItem("claimStartTime");
      localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
      this.handleClaimButton(false);

    } else {
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

        // enable claim button if 20 minutes passed
        if (diffDays > 0 || diffHrs > 0 || diffMins > 5) {
          console.log("check data");
          this.buttondisnft = false;
          localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
          localStorage.removeItem("claimStartTime");
          this.handleClaimButton(false);
        }
      } else {
        this.handleClaimButton(false);
        this.buttondisnft = false;
      }
    }
  }

  async syncCCWallet() {
    const Nami = await CCLoader.Cardano();
    const balanceInfo = await Nami.getBalance();
    const namiWalletAssetsList = balanceInfo.assets;

    // const namiWalletAssetsList = await Nami.getAssets();
    let totalNamiAssets = 0;
    namiWalletAssetsList.map((item: any) => totalNamiAssets += Number(item.quantity));
    console.log("Total Assets: ", totalNamiAssets);

    if (!totalNamiAssets) return;
    const prevTotalNamiAssets = localStorage.getItem("namiWalletTotalAssets") ? Number(localStorage.getItem("namiWalletTotalAssets")) : 0;
    console.log("=============== HI ===================", prevTotalNamiAssets)
    if (totalNamiAssets > prevTotalNamiAssets) {
      // Enable claim button
      this.buttondisnft = false;
      localStorage.removeItem("claimStartTime");
      localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
      this.handleClaimButton(false);

    } else {
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

        // enable claim button if 20 minutes passed
        if (diffDays > 0 || diffHrs > 0 || diffMins > 5) {
          console.log("check data");
          this.buttondisnft = false;
          localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
          localStorage.removeItem("claimStartTime");
          this.handleClaimButton(false);
        }
      } else {
        this.handleClaimButton(false);
        this.buttondisnft = false;
      }
    }
  }

  handleClaimButton = (_value: boolean) => {
    // console.log("handleClaimButton func : ", _value);
    localStorage.setItem("claimBtnLoading", `${_value}`);
    this.APIServices.claimButtonLoading$.next(_value);
  }

  clickMint = async () => {

    try {

      const MintNami = await MintLoader.Cardano();
      let checkWallet: any = false;
      if (this.selectedCaardanoWallet === 'ccvault') {
        checkWallet = await CCLoader.verifyWallet(0, this.authUser.type);
      } else {
        checkWallet = await Loader.verifyWallet(0, this.authUser.type);
      }
      console.log("clickMint verifyWallet => ", checkWallet);

      if (checkWallet !== true) {
        this.toastr.warning(checkWallet)
        return
      }

      const walletAddress = this.selectedCaardanoWallet === 'ccvault' ? await CCLoader.getAddress() : await Loader.CardanoWalletAddress();
      console.log("walletAddress ", walletAddress);

      const nftResp: any = await new Promise(async (resolve, reject) => {
        const resp = await this.APIServices.verifyClaimedCollection({
          action: 'trippy-owl',
          walletAddress
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
      const getBalance = this.selectedCaardanoWallet === 'ccvault' ? await Loader.getWalletBalance() : await CCLoader.getBalance();
      console.log("Wallet balance is: ", getBalance);
      if (!getBalance) { this.toastr.warning('Something went wrong to get wallet balance'); return; }
      if (await Loader.convertToADA(getBalance) < requiredAmount) { this.toastr.warning('Insufficient balance'); return; }

      this.handleClaimButton(true);
      const recipients = [
        { // send nft amount to admin
          address: this.adminNamiWalletAddress,
          // claim free if exist into airdrop addresses
          amount: requiredAmount
        }
      ];

      let txHash: any = '';
      try { // T#1
        console.log("======================= Start Tx ==========================")
        if (this.selectedCaardanoWallet === 'ccvault') {
          txHash = await CCLoader.buildFullTransaction(recipients);
        } else {
          txHash = await MintLoader.buildFullTransaction(recipients);
        }
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
          return

        }
        else if (err.toString().includes("MIN_UTXO_ERROR")) {
          this.toastr.warning("Insufficient balance");
          return;
        }
      }
      console.log("mintTransaction ", txHash);

      if (!txHash) {
        this.toastr.error("Unable to proceed this transaction, Try again!");
        this.handleClaimButton(false);
      } else {
        // this.toastr.success(`TxHash is: ${txHash}`, "Trippy Owl Collection claimed successfully");
        const data = {
          isFreeClaimable: nftResp.isFreeClaimable,
          walletAddress // : await Loader.CardanoWalletAddress() // this.authUser.walletAddr
        }

        this.APIServices.mintTrippyOwl(data)
          .then((res) => {

            if (res.status) {
              var currentdate: any = new Date();
              localStorage.setItem("claimStartTime", currentdate);

              this.toastr.success(`TxHash is: ${txHash}`, res.msg);
              this.buttondisnft = true;
              localStorage.setItem("buttonvaluenft", `${this.buttondisnft}`)
              this.handleClaimButton(false);
              setTimeout(() => {
                this.buttondisnft = false;
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
            this.handleClaimButton(false);
          });
      }

    } catch (error: any) {
      console.log("Error :: ", error);
      if (error && error.info) {
        this.toastr.info(error.info);
      } else {
        this.toastr.error("Something went wrong");
      }
      this.handleClaimButton(false);
    }
  }
}
