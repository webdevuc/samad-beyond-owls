import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import Wallet from "@harmonicpool/cardano-wallet-interface";
// import Wallet from "../packages/cardano-wallet-interface-main";
import { ToastrService } from "ngx-toastr";
import { LiquidityContractService } from "src/app/services/liquidity-contract.service";
import { RefundContractService } from "src/app/services/refund-contract.service";
import { SharedService } from "src/app/services/shared.service";
import { DialogComponent } from "./components/dialog/dialog.component";
import { ReferralLinkDialogComponent } from "./components/tokeninfo/referral-link-dialog/referral-link-dialog.component";
import { ContractService } from "./services/contract.service";
import { GriseTokenContractService } from "./services/grise-token-contract.service";
import { LocalDataUpdateService } from "./services/local-data-update.service";
import { MinAbiDataContractService } from "./services/minabi-data-contract.service";
import { environment as env } from "../environments/environment";
import { GraphDataService } from "./services/graph-data.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { any } from "underscore";
import Loader from './services/nami-loader.service'
import CCLoader from './services/ccvault-minting.service'
import { NFTsAPIServices } from './services/nft.service'

// const CoinSelection = require('./wallet/coinSelection.js');
// import CoinSelectionSL  from './wallet/coinSelectionLatest';
// import CoinSelectionSL  from './wallet/coinSelection';
// import * as CoinSelectionSL  from './wallet/coinSelectionOld.js';
// import { triggerPay } from './wallet/buy.js'

// declare funciton CoinSelectionSL.setProtocolParameters(): any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @Input() dropdownActive: boolean = false;
  @Input() dropdownNotActive: boolean = true;
  isLogin = false;
  accountNo = 0;
  totalBalance = 0;
  refAccountNo = "";
  griseBalance = 0;
  currentLPDay = 0;
  launchOn = env.launchTimeStamp;
  showLaunchTimerDialog = false;
  totalGriseSupply: number;
  priceData: any;
  marketCapValue: number;
  walletAddr: string;
  walletBalance: any;
  coinsData = any;
  coinsDataList = [];
  selectedCardanoWallet: any;
  selectedWalletIcon: any;
  // currency: any;
  public btc: number;
  public ada: number;
  public eth: number;
  public dot: number;

  constructor(
    public dialog: MatDialog,
    private contractService: ContractService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private griseTokenContractService: GriseTokenContractService,
    private APIServices: NFTsAPIServices,
    private localDataUpdateService: LocalDataUpdateService,
    private router: Router,
    private minAbiDataContractService: MinAbiDataContractService,
    private liquidityContractService: LiquidityContractService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private graphDataService: GraphDataService
  ) { }

  async ngOnInit() {

    const defaultWallet = localStorage.getItem("defaultWallet") ? localStorage.getItem("defaultWallet") : 'nami';
    await this.onChangeWallet(defaultWallet);

    // const Nami = await Loader.Cardano();
    // if (await Nami.isEnabled()) {
    //   this.connectWithCardanoWallet();
    // } else {
    //   localStorage.removeItem("namiWalletTotalAssets");
    // }

    // this.connectCCVault();
    // this.getWalletBalance();


    this.showLaunchDialog();
    this.assignContractAccounts();
    this.minAbiDataContractService.setChainId();
    this.sharedService.initPersonalPeriodStakes();
    this.connectToWallet();
    this.getTokenData();
    this.checkLink();
    let header = new HttpHeaders().set("Access-Control-Allow-Origin", "*");
    this.http
      .get("https://etherkat.com/get-top-coin-grise")
      .subscribe((Response) => {
        // console.log(Response);
        let resSTR = JSON.stringify(Response);
        let resJSON = JSON.parse(resSTR);

        this.btc = resJSON.data.BTC;
        this.dot = resJSON.data.DOT;
        this.ada = resJSON.data.ADA;
        this.eth = resJSON.data.ETH;

        // this.coinsDataList = resJSON.data;
        // console.log(this.coinsDataList);
      });

    this.localDataUpdateService.isInitSlotsReservationDataUpdated.subscribe(
      (isUpdated) => {
        if (isUpdated) {
          this.sharedService.initSlots();
          this.localDataUpdateService.forceUpdateSlotsReservationData(true);
        }
      }
    );

    this.localDataUpdateService.isWalletBalanceDataUpdated.subscribe(
      (value) => {
        if (value && this.isLogin) {
          this.refetchBalance();
        }
      }
    );

    this.liquidityContractService.getCurrentLPDay().then((lpDay) => {
      if (lpDay) {
        this.currentLPDay = lpDay;
      }
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.contractService.referralAccountNo = params.referralCode;
      if (this.contractService.referralAccountNo == null) {
        this.contractService.referralAccountNo =
          this.contractService.blankReferralAccountNo;
      }
      this.refAccountNo = this.contractService.referralAccountNo;
    });
  }

  checkLink() {
    let url: string = window.location.href;
    if (url.includes("AI") || url.includes("sentiment-analysis") || url.includes("coin-details")) {
      this.dropdownActive = true
      this.dropdownNotActive = false
    } else {
      this.dropdownActive = false
      this.dropdownNotActive = true
    }
  }

  async onChangeWallet(name: any = 'nami') {
    console.log("Selected Wallet is: ", name);

    localStorage.setItem("defaultWallet", name);
    this.APIServices.selectedWallet$.next(name);
    if (name === "ccvault") {
      this.connectCCVault();
      // this.selectedWalletIcon = "../assets/ccvault.png";
    } else {
      this.connectWithCardanoWallet();
      // this.selectedWalletIcon = "../assets/nami-icon2.svg";
    }
    // this.selectedCardanoWallet = name;
  }
  async connectWithCardanoWallet() {
    // this.walletBalance = localStorage.getItem("lovelaces");
    await Loader.load()
    const Nami = await Loader.Cardano();

    const checkWallet = await Loader.verifyWallet();
    // console.log("Hi verifyWallet => ", checkWallet);
    if (checkWallet !== true) {
      if (checkWallet === "Nami-wallet not connected") {
        await Nami.enable();
      } else {
        this.toastrService.warning(checkWallet)
        return
      }
    }

    console.log("Hi testing...!");

    await Nami.enable()

    // Get Connected Wallet Address
    let paymentAddr = await Nami.getAddress()
    console.log("addr ==> ", paymentAddr)
    // console.log("UTXO: =>> ", await Nami.getUtxos())
    console.log("All Assets: => ", await Nami.getAssets());
    if (localStorage.getItem("walletAddr") !== paymentAddr) {
      localStorage.setItem("walletAddr", paymentAddr);
      localStorage.removeItem("namiWalletTotalAssets");
    }
    this.walletAddr = `${paymentAddr.slice(0, 10)}...${paymentAddr.slice(paymentAddr.length - 5, paymentAddr.length)}`;

    const namiWalletAssetsList = await Nami.getAssets();
    let totalNamiAssets = 0;
    namiWalletAssetsList.map((item) => totalNamiAssets += Number(item.quantity));
    console.log("Total Assets: ", totalNamiAssets);

    this.APIServices.totalNamiWalletNFT$.next(totalNamiAssets);
    if (!localStorage.getItem("namiWalletTotalAssets")) {
      localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
    }

    const userApiResp: any = await new Promise(async (resolve, reject) => {
      const regUser = await this.APIServices.userRegister({
        walletAddr: await Loader.CardanoWalletAddress()
      });
      resolve(regUser)
    });
    if (userApiResp.status) {
      // set token service variable

      this.APIServices.userLoginData$.next(userApiResp.data);
      this.APIServices.userAuthToken$.next(userApiResp.token);
    }

    this.selectedWalletIcon = "../assets/nami-icon2.svg";
    this.selectedCardanoWallet = 'nami';
    try {
      const allAssets = await Nami.getAssets()
      console.log("allAssets :: ", allAssets)
    } catch (error) {
      console.log("Error :: ", error);
    }

  }

  async connectCCVault() {
    try {

      if (Wallet.has(Wallet.Names.CCVault)) {
        if (!await Wallet.isEnabled(Wallet.Names.CCVault)) {
          Wallet.enable(Wallet.Names.CCVault)
            .then(result => {
              console.log("result , ", result)
            });
        }
        else {
          console.log("Connected!");

          await Loader.load()
          const cardanoSerialize = await Loader.CardanoSRL();
          const S = cardanoSerialize;
          const cardano = (window as any).cardano;

          (window as any).global = window;
          // @ts-ignore
          window.Buffer = window.Buffer || require('buffer').Buffer;

          console.log("================ CCVAULT =========================")
          const ccVaultObj = await cardano.eternl.enable();
          console.log(await ccVaultObj.getBalance());
          console.log("================= END CC VAULT ========================")

          ccVaultObj.getBalance().then((res: any) => {
            const balance = cardanoSerialize.Value.from_bytes(Buffer.from(res, 'hex'));
            const lovelaces = balance.coin().to_str();
            this.walletBalance = lovelaces;
            localStorage.setItem("lovelaces", lovelaces);
            console.log("** CCVault  lovelaces  ** ", this.convertToADA(lovelaces));
          })

          // console.log("test data ===>> ", await cardano.eternl.getBalance())
          console.log("hi abaid", await Wallet.CCVault.raw.getChangeAddress())
          console.log("hi abaid balance ", await Wallet.CCVault.raw.getBalance())

          // Get Wallet Address
          const addressHex = Buffer.from(
            (await Wallet.CCVault.raw.getUsedAddresses())[0],
            "hex"
          );

          const paymentAddr = cardanoSerialize.BaseAddress.from_address(
            cardanoSerialize.Address.from_bytes(addressHex)
          )
            .to_address()
            .to_bech32();

          const userApiResp: any = await new Promise(async (resolve, reject) => {
            const regUser = await this.APIServices.userRegister({
              walletAddr: await CCLoader.getAddress()
            });
            resolve(regUser)
          });
          if (userApiResp.status) {
            // set token service variable

            this.APIServices.userLoginData$.next(userApiResp.data);
            this.APIServices.userAuthToken$.next(userApiResp.token);
          }

          console.log("CcVault Address Converted: ", paymentAddr)
          localStorage.setItem("walletAddr", paymentAddr);
          this.walletAddr = `${paymentAddr.slice(0, 10)}...${paymentAddr.slice(paymentAddr.length - 5, paymentAddr.length)}`;
          this.selectedWalletIcon = "../assets/ccvault.png";
          this.selectedCardanoWallet = 'ccvault';
        }
      } else {
        console.log("Wallet Not Found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  convertToADA(value: any) {
    return value ? value / 1000000 : 0;
  }

  async getWalletBalance() {
    //debugger;
    try {
      //console.log('=================== ngOnInit')
      await Loader.load()
      const cardanoSerialize = await Loader.CardanoSRL();
      const S = cardanoSerialize;
      const cardano = (window as any).cardano;

      (window as any).global = window;
      // @ts-ignore
      window.Buffer = window.Buffer || require('buffer').Buffer;


      // const buffer =  (window as any).Buffer;
      //console.log('namiWallet loader', cardanoSerialize);
      //console.log('cardano loader', cardano);
      //console.log('cardano Get Balance :: ', await cardano.getBalance());

      cardano.getBalance().then((res: any) => {
        const balance = cardanoSerialize.Value.from_bytes(Buffer.from(res, 'hex'));
        const lovelaces = balance.coin().to_str();
        this.walletBalance = lovelaces;
        localStorage.setItem("lovelaces", lovelaces);
        console.log("**  lovelaces  ** ", this.convertToADA(lovelaces));
      })

    } catch (error) {
      console.log('Something went wrong!')
      console.log(error)
    }
  }

  openDialog() {
    this.localDataUpdateService.forceUpdateDialogData(true);
    //this.dialog.open(DialogComponent);
  }

  openReferralLinkDialog() {
    this.localDataUpdateService.forceUpdateDialogData(true);

  }

  logout() {
    this.contractService.isLogin = false;
    this.contractService.accountNo = 0;
    this.contractService.totalBalance = 0;
    this.contractService.totalGriseBalance = 0;
    this.contractService.isContractLoadOnNetwork = false;
    this.assignGlobalValues();

    this.toastrService.success("Sucessfully logout.");
    this.router.navigate(["/"]);
  }

  assignGlobalValues() {
    this.isLogin = this.contractService.isLogin;
    //console.log(this.isLogin , '@this.isLoginapp')
    this.accountNo = this.contractService.accountNo;
    //console.log(this.accountNo , '@this.this.accountNo')
    this.totalBalance = this.contractService.totalBalance;
    this.griseBalance = this.contractService.totalGriseBalance;
  }

  async assignContractAccounts() {
    await this.liquidityContractService.assignLiquidityAccountNo();
    await this.griseTokenContractService.assignGriseAccountNo();
  }

  async connectToWallet() {
    await this.refetchBalance();
    await this.afterConnectToWallet();
  }

  async refetchBalance() {
    await this.contractService.connectToWallet();
    await this.griseTokenContractService.getGriseBalance();
    this.assignGlobalValues();
  }

  async afterConnectToWallet() {
    this.localDataUpdateService.forceUpdateStakeTransactionsData(true);
    this.localDataUpdateService.forceUpdateExchangeRateData(true);
  }

  showLaunchDialog() {
    const currentTime = new Date().getTime();
    if (this.launchOn >= currentTime) {
      this.showLaunchTimerDialog = true;
    }
  }

  getTokenData() {
    this.griseTokenContractService.getTotalSupply().then((totalSupply) => {
      this.totalGriseSupply = totalSupply;
      this.calcMarketCap();
    });
    this.graphDataService.getTableData().subscribe((priceData) => {
      this.priceData = priceData;
      this.calcMarketCap();
    });
  }

  calcMarketCap() {
    this.marketCapValue = this.totalGriseSupply * this.priceData?.priceUSD;
  }


}
