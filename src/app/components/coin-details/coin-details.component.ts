import { Component, OnInit } from '@angular/core';
import * as StakingToken from '../../../abis/token/GriseToken.json';
import { ContractService } from '../../services/contract.service';
import { promise } from 'selenium-webdriver';

declare let Web3: any;
declare let window: any;
const web3 = window.web3;

@Component({
  selector: 'app-coin-details',
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.scss']
})
export class CoinDetailsComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  allowed_user:boolean = false;
  address:string;
  staker_fuction(){
    let lcladdress:string='';
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);

      try {
        window.ethereum.enable().then( () => {
          // User has allowed account access to DApp...
          let promise = web3.eth.getAccounts(function (error: any, accounts: any[]) {

              // console.log(accounts[0], 'current account on init');
              lcladdress = accounts[0]
              // console.log(lcladdress)
              return accounts[0]
          });

          promise.then( async (account: any) => {
            account = account;
            this.address = account[0];

            // console.log(this.address)

            const stakingTokenContract = await  this.contractService.getContractObject(StakingToken);
            if (stakingTokenContract) {
              const stakeCounts = await stakingTokenContract.methods.isStaker(this.address).call();
              // console.log(stakeCounts)
              this.allowed_user= stakeCounts;
            }
          });
        });
      } catch (e) {
            // console.log('Please Connect MetaMsk !');
            // User has denied account access to DApp...
          }
    } else {
        // console.log('You have to install MetaMask !');
      }
    }

    giveAccess(){
      if(this.allowed_user){
        this.allowed_user = false
      }else{
        this.allowed_user = true
      }
    }

  ngOnInit(): void {
    // this.staker_fuction();
  }

}
