import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { GriseTokenContractService } from 'src/app/services/grise-token-contract.service';
import { LiquidityContractService } from 'src/app/services/liquidity-contract.service';
import { LocalDataUpdateService } from 'src/app/services/local-data-update.service';
import { MinAbiDataContractService } from 'src/app/services/minabi-data-contract.service';
import { SharedService } from 'src/app/services/shared.service';
import Loader from '../../services/nami-loader.service'
import { ToastrService } from "ngx-toastr";
import { environment as env } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GraphDataService } from 'src/app/services/graph-data.service';


@Component({
  selector: 'app-mata-mask-button',
  templateUrl: './mata-mask-button.component.html',
  styleUrls: ['./mata-mask-button.component.scss']
})
export class MataMaskButtonComponent implements OnInit {

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
  coinsData: any;
  coinsDataList = [];
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
    private localDataUpdateService: LocalDataUpdateService,
    private router: Router,
    private minAbiDataContractService: MinAbiDataContractService,
    private liquidityContractService: LiquidityContractService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private graphDataService: GraphDataService
  ) { }

  async ngOnInit() {
    //this.testFunc();
    // this.connectWithCardanoWallet();


    //    cardano.getChangeAddress().then((res: any) => {
    //      console.log("address: ", res);
    //     const balance = cardanoSerialize.Value.from_bytes(Buffer.from(res, 'hex'));
    //     const lovelaces = balance.coin().to_str();

    //     localStorage.setItem("Address", lovelaces);
    //     console.log(balance, "**  Address  ** ",lovelaces);
    //  })

    // const value = cardanoSerialize.Value.from_bytes() // your value
    // const lovelace = value.coin().to_str();
    // if (value.multiasset()) {
    // const multiAssets = value.multiasset().keys();
    // for (let j = 0; j < multiAssets.len(); j++) {
    //   const policy = multiAssets.get(j);
    //   const policyAssets = value.multiasset().get(policy);
    //   const assetNames = policyAssets.keys();
    //   for (let k = 0; k < assetNames.len(); k++) {
    //     const assetPolicy = Buffer.from(policy.to_bytes()).toString("hex"); // hex encoded policy
    //     const assetName = Buffer.from(assetNames.get(k).name(),"hex").toString(); // utf8 encoded asset name
    //     const quantity = policyAssets.get(policyAsset).to_str(); // asset's quantity

    //     // your code here

    //   }
    // }

    //     const value = CSL.Value.from_bytes(...) // your value
    // const lovelace = value.coin().to_str();

    this.showLaunchDialog();
    this.assignContractAccounts();
    this.minAbiDataContractService.setChainId();
    this.sharedService.initPersonalPeriodStakes();
    this.connectToWallet();
    this.getTokenData();
    let header = new HttpHeaders().set("Access-Control-Allow-Origin", "*");
    this.http
      .get("https://api.ethama.finance/get-top-coin-grise")
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



  async connectWithCardanoWallet() {
    try {
      //console.log('=================== ngOnInit')
      await Loader.load()
      const cardanoSerialize = await Loader.Cardano();
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

        localStorage.setItem("lovelaces", lovelaces);
        //console.log("**  lovelaces  ** ", lovelaces);
      })

      const paymentAddr = cardanoSerialize.Address.from_bytes(Buffer.from(await cardano.getChangeAddress(), 'hex')).to_bech32()
      //console.log("paymentAddr :: ", paymentAddr);
      localStorage.setItem("address", paymentAddr);
      this.walletAddr = `${paymentAddr.slice(0, 10)}...${paymentAddr.slice(paymentAddr.length - 5, paymentAddr.length)}`;
      console.log('test nami')

    } catch (error) {
      //console.log('Something went wrong!')
      //console.log(error)
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
    console.log(this.accountNo , '@this.this.accountNo')
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
  handleDelegate() {
    var pool_id = '00c3598b7df81a8c175d67412bf4a20eb76edd62fe47a5b39c08bec6'
    var blockfrost_project_id = 'testnetoDpQfEbg0OWdAWO4NYGbUQiEnSPJl50K'
    var link = 'https://armada-alliance.com/delegation-widget?pool_id=' + pool_id + '&blockfrost_project_id=' + blockfrost_project_id
    var width = 600
    var windowOuterHeight = window.outerHeight;
    var windowOuterWidth = window.outerWidth;
    var height = Math.min(800, windowOuterHeight);
    var left = (windowOuterWidth / 2) - (width / 2);
    var top = (windowOuterHeight - height) / 2;
    window.open(link, 'Delegate', 'width=' + width + ',height=' + height + ',toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1,left=' + left + ',top=' + top);

    // console.log(left, top, height);
    //var left = (parseInt(windowOuterWidth, 10) / 2) - (width / 2)
    //var top = (parseInt(windowOuterHeight, 10) - height) / 2
    //window.open(link, 'Delegate', 'width=' + width + ',height=' + height + ',toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1,left=' + left + ',top=' + top);
    // }
  }


}
