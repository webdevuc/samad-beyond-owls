import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
// import Wallet from "@harmonicpool/cardano-wallet-interface";
// import Wallet from "../packages/cardano-wallet-interface-main";
import {ToastrService} from 'ngx-toastr';
import {LiquidityContractService} from 'src/app/services/liquidity-contract.service';
import {SharedService} from 'src/app/services/shared.service';
import {ContractService} from './services/contract.service';
import {GriseTokenContractService} from './services/grise-token-contract.service';
import {LocalDataUpdateService} from './services/local-data-update.service';
import {MinAbiDataContractService} from './services/minabi-data-contract.service';
import {environment as env} from '../environments/environment';
import {GraphDataService} from './services/graph-data.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {any} from 'underscore';
import Loader from './services/nami-loader.service';
import {NFTsAPIServices} from './services/nft.service';
import {ConnectWalletDialogComponent} from "./components/connect-wallet-dialog/connect-wallet-dialog.component";
import {connect, WalletType} from "@horizonx/aptos-wallet-connector";
import { BehaviorSubject } from 'rxjs';

// const CoinSelection = require('./wallet/coinSelection.js');
// import CoinSelectionSL  from './wallet/coinSelectionLatest';
// import CoinSelectionSL  from './wallet/coinSelection';
// import * as CoinSelectionSL  from './wallet/coinSelectionOld.js';
// import { triggerPay } from './wallet/buy.js'

// declare funciton CoinSelectionSL.setProtocolParameters(): any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    state$ = new BehaviorSubject(false);

    @Input() dropdownActive = false;
    @Input() dropdownNotActive = true;


    connected = false;
    junaid: any;
    disconnect: any;
    isLogin = false;
    accountNo = 0;
    totalBalance = 0;
    refAccountNo = '';
    griseBalance = 0;
    currentLPDay = 0;
    launchOn = env.launchTimeStamp;
    showLaunchTimerDialog = false;
    totalGriseSupply: number;
    priceData: any;
    marketCapValue: number;
    walletAddr = 'JUNAID SIKANDER';
    walletBalance: any;
    coinsData = any;
    coinsDataList = [];
    // currency: any;
    public btc: number;
    public ada: number;
    public eth: number;
    public dot: number;

    constructor(
        public dialog: MatDialog,
        public walletDialog: MatDialog,
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
        private graphDataService: GraphDataService,
    ) {}

    async ngOnInit() {
        if (localStorage.getItem('aptos-wallet-connector#last-connected-wallet-type')){
            // tslint:disable-next-line:variable-name
            const wallet_type = localStorage.getItem('aptos-wallet-connector#last-connected-wallet-type');
            const result = await connect(wallet_type as WalletType);
            // @ts-ignore
            const {account, disconnect} = result;
            this.disconnect = disconnect();
            const address = await account();
            this.state$.next(address);
            console.log(wallet_type, '****');
        }

        const Nami = await Loader.Cardano();
        if (await Nami.isEnabled()) {
            this.connectWithCardanoWallet();
        } else {
            localStorage.removeItem('namiWalletTotalAssets');
        }
        // this.connectCCVault();
        this.getWalletBalance();


        // Sync with Nami Wallet

        // END: Sync with Nami Wallet


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
        this.checkLink();
        const header = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        this.http
            .get('https://api.ethama.finance/get-top-coin-grise')
            .subscribe((Response) => {
                // console.log(Response);
                const resSTR = JSON.stringify(Response);
                const resJSON = JSON.parse(resSTR);

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

    testMultipleWallets() {
        // if (Wallet.has(Wallet.Names.Nami)) {
        //   console.log("Check wallet is connected or not :: => ", await Wallet.isEnabled(Wallet.Names.Nami));
        // if (!await Wallet.isEnabled(Wallet.Names.Nami)) {

        //     console.log("Wallet Disabled!")

        //     Wallet.enable(Wallet.Names.Nami)
        //       .then(
        //         // () => {
        //         //     Wallet.Nami.delegateTo(
        //         //         "<your pool id>",
        //         //         "<your blockforst api key>"
        //         //     );
        //         // }
        //       );
        // }
        //   else {
        //     console.log("Wallet Enabled!")
        //     // Wallet.Nami.delegateTo(
        //     //     "<your pool id>",
        //     //     "<your blockforst api key>"
        //     // );
        //   }
        // } else {
        //   console.log("Required Wallet not Found!");
        // }

    }

    checkLink() {
        const url: string = window.location.href;
        if (url.includes('AI') || url.includes('sentiment-analysis') || url.includes('coin-details')) {
            this.dropdownActive = true;
            this.dropdownNotActive = false;
        } else {
            this.dropdownActive = false;
            this.dropdownNotActive = true;
        }
    }

    async connectWithCardanoWallet() {
        // this.walletBalance = localStorage.getItem("lovelaces");
        await Loader.load();
        const Nami = await Loader.Cardano();

        const checkWallet = await Loader.verifyWallet();
        // console.log("Hi verifyWallet => ", checkWallet);
        if (checkWallet !== true) {
            if (checkWallet === 'Nami-wallet not connected') {
                await Nami.enable();
            } else {
                this.toastrService.warning(checkWallet);
                return;
            }
        }

        console.log('Hi testing...!');

        await Nami.enable();

        // Get Connected Wallet Address
        const paymentAddr = await Nami.getAddress();
        console.log('addr ==> ', paymentAddr);
        // console.log("UTXO: =>> ", await Nami.getUtxos())
        console.log('All Assets: => ', await Nami.getAssets());
        if (localStorage.getItem('walletAddr') !== paymentAddr) {
            localStorage.setItem('walletAddr', paymentAddr);
            localStorage.removeItem('namiWalletTotalAssets');
        }
        this.walletAddr = `${paymentAddr.slice(0, 10)}...${paymentAddr.slice(paymentAddr.length - 5, paymentAddr.length)}`;

        const namiWalletAssetsList = await Nami.getAssets();
        let totalNamiAssets = 0;
        namiWalletAssetsList.map((item) => totalNamiAssets += Number(item.quantity));
        console.log('Total Assets: ', totalNamiAssets);

        this.APIServices.totalNamiWalletNFT$.next(totalNamiAssets);
        if (!localStorage.getItem('namiWalletTotalAssets')) {
            localStorage.setItem('namiWalletTotalAssets', `${totalNamiAssets}`);
        }

        const userApiResp: any = await new Promise(async (resolve, reject) => {
            const regUser = await this.APIServices.userRegister({
                walletAddr: await Loader.CardanoWalletAddress()
            });
            resolve(regUser);
        });
        if (userApiResp.status) {
            // set token service variable

            this.APIServices.userLoginData$.next(userApiResp.data);
            this.APIServices.userAuthToken$.next(userApiResp.token);
        }

        try {
            const allAssets = await Nami.getAssets();
            console.log('allAssets :: ', allAssets);
        } catch (error) {
            console.log('Error :: ', error);
        }


    }

    async connectCCVault() {
        // this.walletBalance = localStorage.getItem("lovelaces");
        // await Loader.load()
        const CCVault = await Loader.CCVault();
        console.log('Hi testing...!');

        const checkEnabled = await CCVault.enable();
        console.log('cc valult ', checkEnabled);


        // // Get Connected Wallet Address
        // let paymentAddr = await Nami.getAddress()
        // console.log("addr ==> ", paymentAddr)
        // // console.log("UTXO: =>> ", await Nami.getUtxos())
        // console.log("All Assets: => ", await Nami.getAssets());
        // localStorage.setItem("walletAddr", paymentAddr);
        // this.walletAddr = `${paymentAddr.slice(0, 10)}...${paymentAddr.slice(paymentAddr.length - 5, paymentAddr.length)}`;

        // const namiWalletAssetsList = await Nami.getAssets();
        // let totalNamiAssets = 0;
        // namiWalletAssetsList.map((item) => totalNamiAssets += Number(item.quantity));
        // console.log("Total Assets: ", totalNamiAssets);

        // this.APIServices.totalNamiWalletNFT$.next(totalNamiAssets);
        // if (!localStorage.getItem("namiWalletTotalAssets")) {
        //   localStorage.setItem("namiWalletTotalAssets", `${totalNamiAssets}`);
        // }

        // const userApiResp: any = await new Promise(async (resolve, reject) => {
        //   const regUser = await this.APIServices.userRegister({
        //     walletAddr: await Loader.CardanoWalletAddress()
        //   });
        //   resolve(regUser)
        // });
        // if (userApiResp.status) {
        //   // set token service variable

        //   this.APIServices.userLoginData$.next(userApiResp.data);
        //   this.APIServices.userAuthToken$.next(userApiResp.token);
        // }

        // try {
        //   const allAssets = await Nami.getAssets()
        //   console.log("allAssets :: ", allAssets)
        // } catch (error) {
        //   console.log("Error :: ", error);
        // }


    }

    convertToADA(value: any) {
        return value ? value / 1000000 : 0;
    }

    async getWalletBalance() {
        // debugger;
        try {
            // console.log('=================== ngOnInit')
            await Loader.load();
            const cardanoSerialize = await Loader.CardanoSRL();
            const S = cardanoSerialize;
            const cardano = (window as any).cardano;

            (window as any).global = window;
            // @ts-ignore
            window.Buffer = window.Buffer || require('buffer').Buffer;


            // const buffer =  (window as any).Buffer;
            // console.log('namiWallet loader', cardanoSerialize);
            // console.log('cardano loader', cardano);
            // console.log('cardano Get Balance :: ', await cardano.getBalance());

            cardano.getBalance().then((res: any) => {
                const balance = cardanoSerialize.Value.from_bytes(Buffer.from(res, 'hex'));
                const lovelaces = balance.coin().to_str();
                this.walletBalance = lovelaces;
                localStorage.setItem('lovelaces', lovelaces);
                console.log('**  lovelaces  ** ', this.convertToADA(lovelaces));
            });


            // const paymentAddr = cardanoSerialize.Address.from_bytes(Buffer.from(await cardano.getChangeAddress(), 'hex')).to_bech32()
            // console.log("paymentAddr :: ", paymentAddr);
            // localStorage.setItem("address", paymentAddr);
            // this.walletAddr = `${paymentAddr.slice(0, 10)}...${paymentAddr.slice(paymentAddr.length - 5, paymentAddr.length)}`;
            // let data = await this.APIServices.namiRegister({
            //   walletAddr: paymentAddr,
            //   name: "test",

            // });
            // console.log(data, "this is nami address");

        } catch (error) {
            console.log('Something went wrong!');
            console.log(error);
        }
    }

    openDialog() {
        this.localDataUpdateService.forceUpdateDialogData(true);
        // this.dialog.open(DialogComponent);
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

        this.toastrService.success('Sucessfully logout.');
        this.router.navigate(['/']);
    }

    assignGlobalValues() {
        this.isLogin = this.contractService.isLogin;
        // console.log(this.isLogin , '@this.isLoginapp')
        this.accountNo = this.contractService.accountNo;
        // console.log(this.accountNo , '@this.this.accountNo')
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

    // tslint:disable-next-line:typedef
    /*async connectWallet(type: string) {
        try {
            console.log(type);
            const result = await connect(type as WalletType);
            // @ts-ignore
            const {account, disconnect} = result;
            const address = await account();
            this.connected = true;
            console.log({address, result});

        } catch (e) {
            switch (e) {
                case 'Petra wallet not installed':
                    window.open('https://petra.app', '_blank');
                    break;
                case 'Martian wallet not installed.':
                    window.open('https://martianwallet.xyz', '_blank');
                    break;
                case 'Pontem wallet not installed.':
                    window.open('https://pontem.network', '_blank');
                    break;
                default:
                    // @ts-ignore
                    console.log('ERROR:', e.message);
            }
            console.log(e);
        }
    }*/


    openWalletDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '30%';
        dialogConfig.data = {disconnect: this.disconnect};
        const modalRef = this.walletDialog.open(ConnectWalletDialogComponent, dialogConfig);

        modalRef.componentInstance.emitData.subscribe(($e) => {
            console.log('EVENT', $e);
            this.state$.next($e);
            console.log($e);
            modalRef.close();
        });
    }

    truncAddress = (str, n = 6) => {
        if (str) {
            return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
        }
        return '';
    }
}
