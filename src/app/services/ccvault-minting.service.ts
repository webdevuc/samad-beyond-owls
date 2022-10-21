import { environment as env } from '../../environments/environment';
import NamiWalletApi, { Cardano } from '../../packages/nami-js/nami';
import Wallet from "@harmonicpool/cardano-wallet-interface";

class NamiMintLoader {
    blockFrostApiKey = env.blockFrostApiKey;
    blockFrostApiKeyMainnet = env.blockFrostApiKeyMainnet;
    production = env.production;

    nami: any;
    ccvault: any;
    wasm_lib: any;

    cardano: any;
    connected: boolean = false;
    policyExpiration: any = new Date();
    newPolicy: any;

    constructor() {
        // console.log("==== CONSTRUCTER ======= ")
        this.load();
    }
    public async load() {
        // console.log("==== LOAD FUNC ======= 01")
        if (this.nami && this.ccvault && this.wasm_lib) return;
        // console.log("==== LOAD FUNC ======= 02")
        this.cardano = (window as any).cardano;

        this.ccvault = await this.cardano.eternl.enable();
        this.wasm_lib = await import('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib');
        const S = await Cardano();
        this.nami = new NamiWalletApi(
            S,
            this.ccvault,
            {
                0: this.blockFrostApiKey, // testnet
                1: this.blockFrostApiKeyMainnet // mainnet
            }
        )
    }

    private async isNamiInstalled() {
        await this.load()
        if (!this.nami || Object.keys(this.nami).length === 0) return false;
        return true;
    }
    public async isWalletConnected() {
        try {
            if (Wallet.has(Wallet.Names.CCVault)) {
                if (!await Wallet.isEnabled(Wallet.Names.CCVault)) {
                    Wallet.enable(Wallet.Names.CCVault)
                        .then(result => {
                            console.log("result , ", result)
                        });
                }
                return true;
            } else {
                return false; 
            }
        } catch (error) {
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
            if (!await this.isNamiInstalled()) return "CCVault-wallet not installed yet";
            if (!await this.isWalletConnected()) return "CCVault-wallet not connected";

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
            return 'CCVault-wallet extension not installed/enabled';  // 'Wrong CCVault-wallet connection';
        }
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


    public async Cardano() {
        // await this.load();
        return this.nami;
    }

    connect = async () => {
        // Connects nami wallet to current website 
        await Wallet.enable(Wallet.Names.CCVault)
            .then(result => { this.connected = true; return result; })
            .catch(e => {
                console.log(e)
                return false;
            })
    }

    getAddress = async () => {
        // await this.load()
        // retrieve address of nami wallet
        if (!this.connected) {
            await this.connect()
        }

        // Get Wallet Address
        const addressHex = Buffer.from(
            (await Wallet.CCVault.raw.getUsedAddresses())[0],
            "hex"
        );

        return this.wasm_lib.BaseAddress.from_address(
            this.wasm_lib.Address.from_bytes(addressHex)
        )
            .to_address()
            .to_bech32();
    }




    getBalance = async () => {
        if (!this.connected) {
            await this.connect()
        }
        this.ccvault.getBalance().then((res: any) => {
            const balance = this.wasm_lib.Value.from_bytes(Buffer.from(res, 'hex'));
            return balance.coin().to_str();
        })
    }

    buildFullTransaction = async (recipients: any, metadata: any = null) => {
        // await this.load();
        console.log("======================= Tx :01 ==========================")
        return await new Promise(async (resolve, reject) => {
            if (!this.connected) {
                await this.connect()
            }
            console.log(await this.ccvault.getUtxos(), " ======================= Tx :02 ==========================")
            // reject("error found!")
            try {
                let utxos = await this.ccvault.getUtxos();

                const myAddress = await this.getAddress();
                console.log(myAddress)
                console.log("======================= Tx :03 ==========================")
                let netId = await this.ccvault.getNetworkId();
                console.log("======================= Tx :04 ==========================", netId);
                const t = await this.nami.transaction({
                    PaymentAddress: myAddress,
                    recipients: recipients,
                    metadata,
                    utxosRaw: utxos,
                    networkId: netId.id,
                    ttl: 3600,
                    multiSig: null
                })
                console.log("======================= Tx :05 ==========================", t)
                const signature = await this.nami.signTx(t)
                console.log(signature, netId.id)
                console.log("======================= Tx :06 ==========================")
                const txHash = await this.nami.submitTx({
                    transactionRaw: t,
                    witnesses: [signature],

                    networkId: netId.id
                })
                console.log(txHash)
                console.log("======================= Tx :07 ==========================")
                resolve(txHash);
                // return txHash;
                // setComplextxHash(txHash)
            } catch (e) {
                console.log("======================= Tx :08 ==========================")
                // console.log(e);
                reject(e);
            }
            console.log("======================= Tx :09 ==========================")
        });
    }
}

export default new NamiMintLoader();
