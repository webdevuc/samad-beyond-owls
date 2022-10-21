import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../helper/spinner/spinner.service';
import { environment as env } from '../../../environments/environment';
import Loader from '../../services/nami-loader.service';
import CCLoader from '../../services/ccvault-minting.service';
import MintLoader from '../../services/nami-minting-243.service';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';
@Component({
  selector: 'app-nft-collection',
  templateUrl: './nft-collection.component.html',
  styleUrls: ['./nft-collection.component.scss']
})
export class NftCollectionComponent implements OnInit {
  adminNamiWalletAddress = env.adminNamiWalletAddress;
  TRIPPY_OWL_COLLECTION_PRICE = env.TRIPPY_OWL_COLLECTION_PRICE
  ASSET_TRANSFER_PRICE = env.ASSET_TRANSFER_PRICE;
  SERVER_URL = env.SERVER_URL;

  authUser: any = null;
  // authToken: any = null;
  buttondisnft: boolean = false;
  KEY = 'nfttime'
  DEFAULT = 120
  circleLoader: boolean = false;
  selectedCaardanoWallet: any = 'nami';

  config: CountdownConfig = { leftTime: this.DEFAULT, notify: 0, format: 'm:s' }
  constructor(
    private readonly APIServices: NFTsAPIServices,
    private readonly router: Router,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) { }

  async ngOnInit() {

    let exctingValue: any = localStorage.getItem(this.KEY)
    let value = +exctingValue ?? this.DEFAULT;
    if (value <= 0) {
      value = this.DEFAULT
      //localStorage.clear();
    }
    this.config = { ...this.config, leftTime: value }


    this.buttondisnft = Boolean(localStorage.getItem('buttonvaluenft'));

    // Get selected wallet
    this.APIServices.selectedWallet$.subscribe((data) => {
      console.log(data, 'selectedWallet Home component');
      this.selectedCaardanoWallet = data;
    });

    this.APIServices.userLoginData$.subscribe((data) => {
      // console.log(data, '@dadadadad nft collection component');
      this.authUser = data;
    })

    this.APIServices.claimButtonLoading$.subscribe((data) => {
      console.log(data, '@dadadadad nft collection component claimButtonLoading');
      this.circleLoader = data;
    })

    this.handleClaimButton((localStorage.getItem("claimBtnLoading") === "true" ? true : false));
    await this.syncNamiWallet();
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

    } else if (totalNamiAssets <= prevTotalNamiAssets) {
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
          localStorage.removeItem("claimStartTime");
          localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
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
  async handleMintNft(obj: any, action: any) {
    //  if (this.authUser && (this.authUser.type === 'dev' || this.authUser.type === 'admin')) {

    if (this.authUser.type === 'dev') this.toastr.info('Developer mode enabled');

    const checkWallet = await Loader.verifyWallet(this.TRIPPY_OWL_COLLECTION_PRICE, this.authUser.type);
    console.log("Hi verifyWallet => ", checkWallet);
    if (checkWallet !== true) {
      this.toastr.warning(checkWallet)
      return;
    };

    // $('#exampleModaltwo').modal('show');
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
