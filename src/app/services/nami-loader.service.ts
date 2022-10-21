/**
 * Loads the WASM modules
 */
// import { Component, OnInit } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
import { environment as env } from '../../environments/environment';

class Loader {
    // export default class Loader implements OnInit {
    blockFrostApiKey = env.blockFrostApiKey;
    blockFrostApiKeyMainnet = env.blockFrostApiKeyMainnet;
    production = env.production;

    nami_lib: any;
    wasm_lib: any;
    nami: any;
    cardano: any;
    // toastr: ToastrService
    // constructor(
    //     private toastr: ToastrService
    // ) { }

    // ngOnInit(): void {
    //     this.load();
    // }
    // Setup the wasm lib to get 100x performance
    // https://www.npmjs.com/package/@emurgo/cardano-serialization-lib-browser


    public async load() {
        if (this.cardano && this.nami_lib && this.wasm_lib && this.nami) return;
        /**
         * @private
         */
        this.cardano = (window as any).cardano;
        this.nami_lib = await import('nami-wallet-api-library');
        this.wasm_lib = await import('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib');

        console.log("this.cardano :: ", this.cardano);
        this.nami = await this.nami_lib.NamiWalletApi(
            this.cardano,
            this.production ? this.blockFrostApiKeyMainnet : this.blockFrostApiKey,
            this.wasm_lib
        )
        // if (!await this.cardano.isEnabled()) {
        //     console.log("info is: ", this.nami);
        //     // alert(this.nami.info);
        //     // this.toastr.error(this.nami.info);
        // }
        // this.cardano.onAccountChange((address: any) => {
        //     console.log(address, "namiAddress")
        // }),
        //     this.cardano.onNetworkChange((address: any) => {
        //         console.log(address, "namiAddress")
        //     })
    }


    private async isNamiInstalled() {
        await this.load()
        if (!this.nami || Object.keys(this.nami).length === 0) return false;
        return true;
    }

    public async isWalletConnected() {
        return await this.nami.isEnabled();
    }

    // Get Connected Wallet Address
    public async CardanoWalletAddress() {
        try {
            if (!await this.isNamiInstalled()) return false;

            const addr = await this.nami.getAddress();
            return addr ? addr : false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    public async convertToADA(value: any) {
        return value ? value / 1000000 : 0;
    }

    public async getWalletBalance() {
        try {
            await this.load();
            return await new Promise(async (resolve, reject) => {
                const S = this.wasm_lib;
                if (!S) return reject(false);
                // (window as any).global = window;
                // window.Buffer = window.Buffer || require('buffer').Buffer;

                await this.cardano.getBalance().then(async (res: any) => {
                    const balance = S.Value.from_bytes(Buffer.from(res, 'hex'));
                    const lovelaces = balance.coin().to_str();
                    console.log("**  lovelaces  ** ", lovelaces);
                    return resolve(lovelaces);
                    // return lovelaces;
                    // console.log("**  lovelaces  ** ", this.convertToADA(lovelaces));
                })
                return reject(false);
            });
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    public async verifyWallet(requiredBalance: any = 0, userType: string = '') {
        // is wallet installed
        // is wallet connected
        // is on required network (testnet or mainnet)
        // check wallet balance (amount of available ada is smaller than required amount)
        // testnet network allowed only to developers

        try {
            if (!await this.isNamiInstalled()) return "Nami-wallet not installed yet";
            if (!await this.isWalletConnected()) return "Nami-wallet not connected";

            if (userType !== 'dev') {
                const getNetwork = await this.nami.getNetworkId();
                if (this.production) { // mainnet
                    if (getNetwork.id !== 1 && getNetwork.network !== 'mainnet') return 'Wrong Network';
                } else { // testnet // {id: 0, network: 'testnet'}
                    if (getNetwork.id !== 0 && getNetwork.network !== 'testnet') return 'Wrong Network';
                }
            }
            if (requiredBalance && requiredBalance !== 0) {
                const getBalance = await this.getWalletBalance();
                console.log("Wallet balance is: ", getBalance);
                if (!getBalance) return 'Something went wrong to get wallet balance';
                if (await this.convertToADA(getBalance) < requiredBalance) return 'Insufficient balance';
            }
            return true;
        } catch (err) {
            console.log(err);
            return 'Nami-wallet extension not installed/enabled';  // 'Wrong nami-wallet connection';
        }
    }



    public async Cardano() {
        await this.load();
        return this.nami;
    }

    public async CCVault() {
        await this.load();
        return this.cardano.ccvault;
    }

    public async CardanoSRL() {
        return this.wasm_lib;
    }
}

// class Loader {
//     this.wasm = null;
//     async load() {

//     }


//     get 
// };

export default new Loader();
