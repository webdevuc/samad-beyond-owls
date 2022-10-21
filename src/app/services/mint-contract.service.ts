// import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { BehaviorSubject } from 'rxjs';
// import * as RefundSponsor from '../../abis/liquidity/RefundSponsor.json';
// import { SpinnerService } from '../helper/spinner/spinner.service';
// import { RefundHistoryData } from '../models/refund-history-data';
// import { ContractService } from './contract.service';

// import { environment as env } from '../../environments/environment';
// import { BlockFrostAPI } from '@blockfrost/blockfrost-js';


// const blockFrostApiKey = env.blockFrostApiKey;
// const API = new BlockFrostAPI({
//     projectId: blockFrostApiKey // 'YOUR API KEY HERE', // see: https://blockfrost.io
// });
// @Injectable({ providedIn: 'root' })
export class MintContractService {


    // private claimGasFeeRefundUpdate = new BehaviorSubject<boolean>(false);
    // isClaimGasFeeRefundUpdated = this.claimGasFeeRefundUpdate.asObservable();
    // getBlockFrostInfo: any;
    constructor(
        // private contractService: ContractService,
        //         private toastr: ToastrService,
        //         private spinnerService: SpinnerService
    ) { }

    async ngOnInit() {
        // this.getBlockFrostInfo();

    }
    // async getBlockFrostInfo() {
    //     try {
    //         // const latestBlock = await API.blocksLatest();
    //         const networkInfo = await API.network();
    //         // const latestEpoch = await API.epochsLatest();
    //         // const health = await API.health();
    //         // const address = await API.addresses(
    //         //     'addr1qxqs59lphg8g6qndelq8xwqn60ag3aeyfcp33c2kdp46a09re5df3pzwwmyq946axfcejy5n4x0y99wqpgtp2gd0k09qsgy6pz',
    //         // );
    //         // const pools = await API.pools({ page: 1, count: 10, order: 'asc' });

    //         // console.log('pools', pools);
    //         // console.log('address', address);
    //         console.log('networkInfo', networkInfo);
    //         // console.log('latestEpoch', latestEpoch);
    //         // console.log('latestBlock', latestBlock);
    //         // console.log('health', health);
    //     } catch (err) {
    //         console.log('error', err);
    //     }
    // }

    // async getRefundHistoryData() {
    //     try {
    //         const refundSponsorContract = await this.contractService.getContractObject(RefundSponsor);
    //         if (refundSponsorContract) {
    //             // let sponsoredAmount = await refundSponsorContract.methods.sponsoredAmount(refundSponsorContract._address).call();
    //             const sponsoredAmount = await this.contractService.getAccountBalance(refundSponsorContract._address);
    //             let myRefundAmount = await refundSponsorContract.methods.myRefundAmount().call({ from: this.contractService.accountNo });

    //             myRefundAmount = this.contractService.convertAmountInBigUnit(myRefundAmount);

    //             const griseReservationData: RefundHistoryData = {
    //                 sponsoredAmount,
    //                 myRefundAmount
    //             };
    //             return griseReservationData;
    //         }
    //     } catch (ex) { }
    //     return null;
    // }

    // async claimGasFeeRefund() {
    //     try {
    //         const refundSponsorContract = await this.contractService.getContractObject(RefundSponsor);
    //         if (refundSponsorContract) {
    //             this.spinnerService.show();
    //             refundSponsorContract.methods.requestGasRefund()
    //                 .send({ from: this.contractService.accountNo })
    //                 .then((response: any) => {
    //                     // console.log("transaction successful.", response);
    //                     this.claimGasFeeRefundUpdate.next(true);
    //                     this.toastr.success('Transaction successful.');
    //                     this.spinnerService.hide();
    //                 })
    //                 .catch((error: any) => {
    //                     // console.log("error", error);
    //                     this.toastr.error('Transaction failed. Try again!');
    //                     this.spinnerService.hide();
    //                 });
    //         }
    //     } catch (ex) { }
    // }
}
