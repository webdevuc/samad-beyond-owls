import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../helper/spinner/spinner.service';
import { environment as env } from '../../../environments/environment';
import Loader from '../../services/nami-loader.service';
import MintLoader from '../../services/nami-minting-243.service';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';

const aptos = require("aptos");
const NODE_URL = "https://fullnode.mainnet.aptoslabs.com";

declare const window: any;
declare const document: any;

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
  config: CountdownConfig = { leftTime: this.DEFAULT, notify: 0, format: 'm:s' }


 // opens date MINT's
 public launches = [
  { name: 'Minting Starts', launchDate: 'Nov 28 2022 17:00:00 UTC' },
  // { name: 'Public minting opens in', launchDate: 'Nov 19 2022 17:00:00 UTC' },
  { name: 'Minting End', launchDate: 'Dec 05 2022 17:00:00 UTC' },
  { name: 'Ai Launch', launchDate: 'Dec 19 2022 17:00:00 UTC' },
];


  public minted: number = 0;
  private account: any;

  constructor(
    private readonly APIServices: NFTsAPIServices,
    private readonly router: Router,
    private toastr: ToastrService,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {

    const collectionAddr = "0x41f9b1bf4a506129eebc10981f2199863ddf442e3f526e18a64b403387c95cc5";

    setInterval(() => {
      (async () => {
        const client = new aptos.AptosClient(NODE_URL);
        let tokenStore: Array<any> = await client.getAccountResources(collectionAddr);
        let length = tokenStore.length;
        console.log(length);
        if (length === 4) {
          this.minted = 0;
          this.cdr.detectChanges();
        } else if (length === 5) {
          this.minted = (tokenStore[3].data.minted - 1);
          this.cdr.detectChanges();
        }
        //here this.minted should be displayed to front end.
      })()
    }, 500)


    // const wallet_type = localStorage.getItem('aptos-wallet-connector#last-connected-wallet-type');

    // if (wallet_type === "aptos") {
    //   this.account = window.aptos.account();
    // } else if (wallet_type === "martian") {
    //   this.account = window.martian.account();
    // } else if (wallet_type === "pontem") {
    //   this.account = window.pontem.account()
    // }

    // console.log(this.account);

    // const collectionName = "Beyond Owls";

    let exctingValue: any = localStorage.getItem(this.KEY)
    let value = +exctingValue ?? this.DEFAULT;
    if (value <= 0) {
      value = this.DEFAULT
      //localStorage.clear();
    }
    this.config = { ...this.config, leftTime: value }


    this.buttondisnft = Boolean(localStorage.getItem('buttonvaluenft'));

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

  async mintNFT() {
    const wallet_type = localStorage.getItem('aptos-wallet-connector#last-connected-wallet-type');

    const moduleAddr = "0x55d3652e628e5cd7947232c4e896f558a88c6d2238f8f6e264fb7c1ada5aa2f9";
    const collectionAddr = "0x41f9b1bf4a506129eebc10981f2199863ddf442e3f526e18a64b403387c95cc5";
    const collectionName = "Beyond Owls";

    let sender;

    function stringToHex(text: string) {
      const encoder = new TextEncoder();
      const encoded = encoder.encode(text);
      return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
    }

    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddr}::owl_nft3::mint_script`,
      arguments: [collectionAddr],
      type_arguments: [],
    };

    try {

      if (wallet_type === "aptos") {

        const transaction = await (
          window as any
        ).aptos.signAndSubmitTransaction(payload);

      } else if (wallet_type === "martian") {

        // try {
        //   const collectionAddr = "0xa9eedec70260ca823c95b7f2ec76de719c04bf810e6bffc6a67eaa17a2340890";
        //   const tokenStore: { data: any } = await window.martian.getAccountResources(
        //     collectionAddr!,
        //     "0x3::token::TokenStore"
        //   );
        //   console.log(tokenStore);
        //   this.minted = (tokenStore[3].data.minted - 1);
        //   console.log(this.minted)
        // } catch (e) {
        //   console.log(e)
        // }

        sender = (await window.martian.account()).address;
        const transaction = await window.martian.generateTransaction(sender, payload);
        const txnHash = await window.martian.signAndSubmitTransaction(transaction);

      } else if (wallet_type === "pontem") {

        const options = {
          max_gas_amount: '1000000',
          gas_unit_price: '100',
          expiration_timestamp_secs: '2646793600',
        }
        window.pontem.signAndSubmit(payload, options).then(tx => {
          console.log('Transaction', tx)
        })
      }

    } catch (e) {
      console.log(e)
    }
    // (async () => {
    //   const client = new aptos.AptosClient(NODE_URL);
    //   let tokenStore: { data: any } = await client.getAccountResources(collectionAddr);
    //   this.minted = (tokenStore[3].data.minted - 1);
    //   this.cdr.detectChanges();
    //   console.log(this.minted);

    //   //here this.minted should be displayed to front end.
    // })()
  }

  clickMint = async () => {
    // if (!this.authUser) return;

    // console.log(this.mintNftObj, 'this.mintNftObjakldjfa;lksdjfas')
    // ***
    // verify wallet validations
    // check availbele tokens for minting
    // nami-wallet minting
    // update db records
    // ***
    //  this.circleLoader = true;

    try {

      // const tokenAmmount = Number(this.mintNftObj.amount)
      const MintNami = await MintLoader.Cardano();

      const checkWallet = await Loader.verifyWallet(0, this.authUser.type);
      console.log("clickMint verifyWallet => ", checkWallet);

      if (checkWallet !== true) {
        this.toastr.warning(checkWallet)
        return
      }

      // if (localStorage.getItem("isCollectionLaunched") || localStorage.getItem("isCollectionLaunched") === "1") {
      // // if (this.authUser.type !== "dev") {
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
        console.log("======================= End Tx ==========================", txHash)

        if (txHash && txHash.error) {
          this.toastr.error("Transaction Failed");
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
          console.log(err.info, "error test");
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
        // this.toastr.error("Failed to claim trippy owl collection");
        this.toastr.error("Unable to proceed this transaction, Try again!");
        // this.circleLoader = false;
        this.handleClaimButton(false);
      } else {
        // this.toastr.success(`TxHash is: ${txHash}`, "Trippy Owl Collection claimed successfully");
        const data = {
          isFreeClaimable: nftResp.isFreeClaimable,
          walletAddress: await Loader.CardanoWalletAddress(), //this.authUser.walletAddr
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
              // this.circleLoader = false;
              this.handleClaimButton(false);
              // this.disablebtn = false;
              // this.mintNftObj.quantity = String(Number(this.mintNftObj.quantity) - 1);
              this.toastr.success(`TxHash is: ${txHash}`, res.msg);
              this.buttondisnft = true;
              localStorage.setItem("buttonvaluenft", `${this.buttondisnft}`)
              setTimeout(() => {
                this.buttondisnft = false;
                localStorage.removeItem(`${this.buttondisnft}`)
              }, 120000);
            } else {
              // this.toastr.error(`TxHash is: ${txHash}`, "Trippy Owl Collection claimed successfully");
              this.toastr.error(res.msg);
              // this.circleLoader = false;
              this.handleClaimButton(false);
            }
          })
          .catch((err) => {
            // this.toastr.error(`TxHash is: ${txHash}`, "Trippy Owl Collection claimed successfully");
            this.toastr.error("Something went wrong");
            console.log("Error is: ", err);
            // this.circleLoader = false;
            this.handleClaimButton(false);
          });
      }

    } catch (error: any) {
      // this.circleLoader = false;
      this.handleClaimButton(false);
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
  //     localStorage.setItem(this.KEY, `${ev.left / 1000}`);
  //   }
  //   if (ev.action === 'done') {
  //     localStorage.removeItem("buttonvaluenft")
  //     localStorage.removeItem("nfttime")
  //     //localStorage.clear();
  //     this.buttondisnft = false;
  //   }

  // }

}
