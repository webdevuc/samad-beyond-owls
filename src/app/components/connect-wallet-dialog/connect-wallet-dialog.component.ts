import {Component, EventEmitter, Inject, OnChanges, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {connect, WalletType} from "@horizonx/aptos-wallet-connector";

@Component({
    selector: 'app-connect-wallet-dialog',
    templateUrl: './connect-wallet-dialog.component.html',
    styleUrls: ['./connect-wallet-dialog.component.scss'],
})

export class ConnectWalletDialogComponent implements OnInit, OnChanges {
    @Output() emitData = new EventEmitter();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        // console.log(this.data);
    }

    ngOnChanges(): void {
        // console.log('MODAL_ON CHANGES CALLED');
    }

    async connectWallet(type: string) {
        try {
            // console.log(type);
            const result = await connect(type as WalletType);
            // @ts-ignore
            const {account, disconnect} = result;
            const address = await account();
            // console.log('ADDRESS', address);
            this.emitData.next(address);
            // this.data.disconnect = disconnect;
            // console.log({address, result});
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
                    // console.log('ERROR:', e.message);
            }
            // console.log(e);
        }
    }
}


