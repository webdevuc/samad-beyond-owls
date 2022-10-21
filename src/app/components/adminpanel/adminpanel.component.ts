import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import Loader from '../../services/nami-loader.service';

declare var $: any;
@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
  renderer: any;
  constructor(@Inject(DOCUMENT) private document: any, private readonly APIServices: NFTsAPIServices, private toastr: ToastrService,) {
    this.document.body.classList.add('leftmenu');
   }
   availablebalance:"";
   totalbalance:"";
   hidezero:any = true;
   inputValue: number;
  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.document.body.classList.remove('leftmenu');
  }
  getBalance = async () => {
    try {
      this.APIServices.getGriseBalance()
      .then((res) => {
          //console.log(res.balance);
          if(res.status === true){
            this.hidezero = false;
            this.availablebalance = res.balance 
            this.totalbalance = res.total
          } else {

            this.hidezero = true;
            this.availablebalance = ""
            this.totalbalance = ""
          }
        
      })
    } catch (error) {
      
    }
  }

  withdrawGrise = async () => {
    this.inputValue 
    try {
      this.APIServices.sendGriseBalance(
        this.inputValue, 
        await Loader.CardanoWalletAddress()
      )
      .then((res) => {
        //console.log(res)
       if(res.status === true){
        this.toastr.success("txHash: " + res.resp);
       } else {
        this.toastr.error(res.msg);
       }
      })
    } catch (error) {
      this.toastr.error();
    }
  }

  
  async confirmpopup() {
    $('#exampleModaltwo').modal('show');
  }
}


