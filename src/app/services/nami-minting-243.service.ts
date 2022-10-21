import { environment as env } from '../../environments/environment';
// import NamiWalletApi, { Cardano } from 'nami-wallet-api-243';
import NamiWalletApi, { Cardano } from '../../packages/nami-js';

class NamiMintLoader {
    blockFrostApiKey = env.blockFrostApiKey;
    blockFrostApiKeyMainnet = env.blockFrostApiKeyMainnet;
    production = env.production;

    nami: any;
    cardano: any;
    connected: boolean = false;
    policyExpiration: any = new Date();
    newPolicy: any;

    public async load() {
        if (this.nami) return;

        this.cardano = (window as any).cardano;

        const S = await Cardano();
        this.nami = new NamiWalletApi(
            S,
            this.cardano,
            {
                0: this.blockFrostApiKey, // "testnetLYuDgDFyN0OD1s9hXnNMVzyRlPN7imcG", // testnet
                1: this.blockFrostApiKeyMainnet // "yourBlockfrostMainnetApiKey" // mainnet
            }
        )

        // if (await this.nami.isInstalled()) {
        //     await this.nami.isEnabled().then(result => { this.connected = result })

        // }
    }

    public async Cardano() {
        await this.load();
        return this.nami;
    }




    connect = async () => {
        // Connects nami wallet to current website 
        await this.nami.enable()
            .then(result => result) // this.connected = result
            .catch(e => {
                console.log(e)
                return false;
            })
    }

    getAddress = async () => {
        // retrieve address of nami wallet
        if (!this.connected) {
            await this.connect()
        }
        await this.nami.getAddress().then((newAddress) => {
            console.log(newAddress);
            return newAddress;
        })
    }


    // public async getBalance = async () => {
    //     if (!connected) {
    //         await connect()
    //     }
    //     await nami.getBalance().then(result => { console.log(result); setNfts(result.assets); setBalance(result.lovelace) })
    // }


    // buildTransaction = async (recipients) => {
    //     return await new Promise(async (resolve, reject) => {
    //         if (!this.connected) {
    //             await this.connect()
    //         }
    //         try {
    //             // const recipients = [{ "address": recipientAddress, "amount": amount }]
    //             let utxos = await this.nami.getUtxosHex();
    //             const myAddress = await this.nami.getAddress();

    //             let netId = await this.nami.getNetworkId();
    //             const t = await this.nami.transaction({
    //                 PaymentAddress: myAddress,
    //                 recipients,
    //                 metadata: null,
    //                 utxosRaw: utxos,
    //                 networkId: netId.id,
    //                 ttl: 3600,
    //                 multiSig: null
    //             })
    //             console.log(t)
    //             // setTransaction(t)
    //             resolve(t);

    //         } catch (e) {
    //             // console.log(e);
    //             reject(e);
    //         }
    //     });
    // }



    buildFullTransaction = async (recipients: any, metadata: any = null) => {
        console.log("======================= Tx :01 ==========================")
        return await new Promise(async (resolve, reject) => {
            if (!this.connected) {
                await this.connect()
            }
            console.log("======================= Tx :02 ==========================")
            try {
                let utxos = await this.nami.getUtxosHex();

                const myAddress = await this.nami.getAddress();
                console.log(myAddress)
                console.log("======================= Tx :03 ==========================")
                let netId = await this.nami.getNetworkId();
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

    buildFullTransactionBatchMinting = async (recipients: any, metadata: any = null) => {
        console.log("======================= Tx :01 ==========================")
        return await new Promise(async (resolve, reject) => {
            if (!this.connected) {
                await this.connect()
            }
            console.log("======================= Tx :02 ==========================")
            try {
                let utxos = await this.nami.getUtxosHex();

                const myAddress = await this.nami.getAddress();
                console.log(myAddress)
                console.log("======================= Tx :03 ==========================")
                let netId = await this.nami.getNetworkId();
                console.log("======================= Tx :04 ==========================", netId);
                const t = await this.nami.transaction({
                    PaymentAddress: myAddress, // "addr_test1qqsmq4kwxtum0nnqp6mndmgdfn9c50l5la78dh9prs60znzsqg5nj5smnk073fc6jy4wvcrjzjjwlx67zy99gtrkxlnsxl4a2y",
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

    tokenTransfer = async (recipients: any, metadata: any = null) => {
        return await new Promise(async (resolve, reject) => {
            if (!this.connected) {
                await this.connect()
            }
            try {
                let utxos = await this.nami.getUtxosHex();
                console.log("utxos ;; ", utxos);
                // alert("hi")
                const myAddress = await this.nami.getAddress();
                console.log(myAddress)
                let netId = await this.nami.getNetworkId();

                const t = await this.nami.transaction({
                    PaymentAddress: myAddress,
                    recipients: recipients,
                    metadata,
                    utxosRaw: utxos,
                    networkId: netId.id,
                    ttl: 3600,
                    multiSig: null
                })

                const signature = await this.nami.signTx(t)
                console.log(t, signature, netId.id)
                const txHash = await this.nami.submitTx({
                    transactionRaw: t,
                    witnesses: [signature],

                    networkId: netId.id
                })
                console.log(txHash)
                resolve(txHash);
                // return txHash;
                // setComplextxHash(txHash)
            } catch (e) {
                // console.log(e);
                reject(e);
            }
        });
    }



    // public async signTransaction = async () => {
    //     if (!connected) {
    //         await connect()
    //     }

    //     const witnesses = await nami.signTx(transaction)
    //     setWitnesses(witnesses)
    // }

    // public async submitTransaction = async () => {
    //     let netId = await nami.getNetworkId();
    //     const txHash = await nami.submitTx({
    //         transactionRaw: transaction,
    //         witnesses: [witnesses],

    //         networkId: netId.id
    //     })
    //     setTxHash(txHash)

    // }

    createPolicy = async () => {
        const defaultDate = new Date();
        defaultDate.setTime(defaultDate.getTime() + (1 * 60 * 90 * 1000))
        this.policyExpiration = defaultDate;

        console.log(this.policyExpiration)
        try {
            await this.nami.enable()


            const myAddress = await this.nami.getHexAddress();

            let networkId = await this.nami.getNetworkId()
            const newPolicy = await this.nami.createLockingPolicyScript(myAddress, networkId.id, this.policyExpiration)
            this.newPolicy = newPolicy;
            return newPolicy;

            // setPolicy(newPolicy)
            // setComplexTransaction(async (prevState) => {
            //     const state = prevState; state.recipients[0].mintedAssets[0].policyId = newPolicy.id;
            //     state.recipients[0].mintedAssets[0].policyScript = newPolicy.script;
            //     state.metadata = {
            //         "721": {
            //             [newPolicy.script]:
            //                 { [state.recipients[0].mintedAssets[0].assetName]: { name: "MyNFT", description: "This is a test NFT", image: "ipfs://QmUb8fW7qm1zCLhiKLcFH9yTCZ3hpsuKdkTgKmC8iFhxV8", } }
            //         }
            //     };
            //     return { ...state }
            // })

        } catch (e) {
            console.log(e)
        }

    }

}

export default new NamiMintLoader();
