import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../helper/spinner/spinner.service';
import { environment as env } from '../../../environments/environment';
import Loader from '../../services/nami-loader.service';
@Component({
  selector: 'app-sell-form',
  templateUrl: './sell-form.component.html',
  styleUrls: ['./sell-form.component.scss']
})
export class SellFormComponent implements OnInit {
  adminNamiWalletAddress = env.adminNamiWalletAddress;
  ASSET_TRANSFER_PRICE = env.ASSET_TRANSFER_PRICE;

  selectedNft: any;
  nftImg: any;
  feeamount: boolean = false;
  inputvalue: any;
  authUser: any = null;
  disablebtn: any = false;
  constructor(
    private readonly APIServices: NFTsAPIServices,
    private readonly router: Router,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) { }

  amounshow: string = '';
  amountresit: string = '';

  async ngOnInit() {
    // const userApiResp: any = await new Promise(async (resolve, reject) => {
    //   const regUser = await this.APIServices.userRegister({
    //     walletAddr: await Loader.CardanoWalletAddress()
    //   });
    //   resolve(regUser)
    // });
    // if (userApiResp.status) {
    //   // localStorage.setItem("token", userApiResp.token);
    //   this.authUser = userApiResp.data;
    // }
    this.APIServices.userLoginData$.subscribe((data) => {
      console.log(data, 'SELL FORM component');
      this.authUser = data;
    })

    // const checkWallet = await Loader.verifyWallet(0, this.authUser.type);
    // if (checkWallet !== true) {
    //   this.toastr.warning(checkWallet);
    //   this.router.navigateByUrl("/nft");
    // }

    const data: any = localStorage.getItem("selectedNft");
    this.selectedNft = JSON.parse(data);
    this.nftImg = `assets/${this.selectedNft.nftType}/${this.selectedNft.src}`;
    this.inputvalue = this.selectedNft.amount;
    this.amounshow = this.selectedNft.amount;
    this.amountresit = this.selectedNft.amount;
    // this.APIServices.userLoginData$.subscribe((data) => {
    //   console.log(data, '@dadadadad');
    //   this.selectedNft = data;
    // })
    if (this.amounshow < this.amountresit) {
      this.toastr.error("Unable to list asset");
    }

  }

  redirectlandingPage() {
    this.router.navigateByUrl("/nft");
  }

  getAmount = async () => {
    console.log(this.selectedNft, 'amount', this.amounshow);
    this.disablebtn = true;
    // this.selectedNft = localStorage.getItem("selectedNft");
    if (this.selectedNft) {
      // this.selectedNft = JSON.parse(this.selectedNft);

      const sellAsset = {
        userNftId: this.selectedNft.userNftId,
        amount: Number(this.amounshow),
        mintToken: this.selectedNft.mintToken,
      }
      console.log("sellAsset : ", sellAsset);
      const transectionFee = this.ASSET_TRANSFER_PRICE;

      // Transfer amount (royalty fee + Asset amount) from connected wallet's address to admin
      try {
        const Nami = await Loader.Cardano();

        const checkWallet = await Loader.verifyWallet(transectionFee, this.authUser.type);
        console.log("transectionFee: ", transectionFee, sellAsset.amount, "putOnSale verifyWallet => ", checkWallet);

        // const walletBalance = localStorage.getItem("lovelaces") ? localStorage.getItem("lovelaces") : 0;
        // console.log("balance cond: ", walletBalance, Number(walletBalance) / 1000000, transectionFee + 1, Number(walletBalance) / 1000000 > transectionFee + 1);
        // if (walletBalance && Number(walletBalance) / 1000000 > transectionFee + 1) {

        if (checkWallet !== true) {
          this.toastr.warning(checkWallet);
          return;
        }

        const nftResp: any = await new Promise(async (resolve, reject) => {
          const resp = await this.APIServices.verifyUserNft({
            userNftId: this.selectedNft.userNftId,
            action: 'list'
          });
          resolve(resp)
        });
        if (!nftResp.status) {
          this.toastr.error(nftResp.msg);
          return;
        }

        const txHash = await Nami.send({
          address: this.adminNamiWalletAddress, // ADMIN ADDRESS
          amount: transectionFee,
          assets: [
            {
              "unit": this.selectedNft.mintToken,
              "quantity": "1"
            }
          ],
        })

        if (!txHash) {
          this.toastr.error("Unable to list NFT");
        } else {
          // this.spinnerService.show();

          // update token price
          this.APIServices.setTokenPrice(sellAsset)
            .then((res) => {
              // this.spinnerService.hide();
              if (res.status) {
                this.redirectlandingPage()
                this.toastr.success(res.msg);
              } else {
                this.toastr.error(res.msg);
              }
            })
            .catch((err) => {
              // this.spinnerService.hide();
              console.log("Error is: ", err);
            });
        }

      } catch (error) {
        console.log("Error :: ", error);
        if (error) {
          if (error instanceof Error)
            if (error['code']) {
              this.toastr.error(error['info']);
              this.disablebtn = false;
            }
        } else {
          this.toastr.error("Something went wrong");
          this.disablebtn = false;
        }
      }

    } else {
      this.toastr.error("Something went wrong");
      this.disablebtn = false;
    }
  }

  feeshow() {
    this.feeamount = !this.feeamount
  }


}
