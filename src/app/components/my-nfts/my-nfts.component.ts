import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {
  NFTContentGroup,
  NFTContentGroupData,
  NftObjData
} from "src/app/models/nft-content-group-data";
import { NFTContentType } from "src/app/models/nft-content-data";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../helper/spinner/spinner.service';
import { environment as env } from '../../../environments/environment';
import Loader from '../../services/nami-loader.service';


@Component({
  selector: 'app-my-nfts',
  templateUrl: './my-nfts.component.html',
  styleUrls: ['./my-nfts.component.scss']
})
export class MyNftsComponent implements OnInit {
  SERVER_URL = env.SERVER_URL;
  
  allMyNFTGroups: NFTContentGroupData[] = [];
  selectedNft: any;
  authUser: any = null;
  hideAssets = false;
  spinnerLoader = true;
  constructor(
    private readonly APIServices: NFTsAPIServices,
    private readonly router: Router,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) { }
  cancelbtn: boolean = false;
  async ngOnInit() {

    this.APIServices.userLoginData$.subscribe(async (data) => {
      // console.log(data, 'My NFT component');
      this.authUser = data;

      this.allMyNFTGroups = [];

      try {
        const Nami = await Loader.Cardano();

        const namiWalletAssetsList = await Nami.getAssets();
        const namiWalletTokens = namiWalletAssetsList.map((item: any) => item.unit);
        let paymentAddr = await Loader.CardanoWalletAddress(); // await Nami.getAddress();
        const walletAddr = paymentAddr;

        if (walletAddr) {

          const checkWallet = await Loader.verifyWallet(0, this.authUser.type);
          // console.log("clickMint verifyWallet => ", checkWallet);

          if (checkWallet !== true) {
            this.toastr.warning(checkWallet)
            return
          }

          this.APIServices.myNftsList(
            {
              walletAddress: await Loader.CardanoWalletAddress(),
              action: 'getUserNfts'
            }
          )
            .then(async (res) => {

              let userNftsList = res.data ? res.data : [];
              const list: any = [];
              this.spinnerLoader =  false;
              userNftsList.map(async (item: any) => {
                if ((namiWalletTokens.includes(item.mintToken) || item.status === 'list' || item.status === 'cancelPending') && (item.nftId && item.nftId.nftType !== 'trippy-owl')) {
                  list.push(item);
                }
              });

              this.allMyNFTGroups = [
                {
                  id: 1,
                  contentGroup: NFTContentGroup.Mythic,
                  contentHeader: "My NFTs",
                  contentData: list.map( (item: any) => {
                    const nft = item.nftId;
                    
                    return {
                      contentType: (nft && nft.nftType === "mythic") ? NFTContentType.Gif : NFTContentType.Image,
                      contentPath: nft && nft.imageLink, //? nft.imageLink : `assets/${nft && nft.nftType ? nft.nftType : 'type'}/${nft && nft.src ? nft.src : 'src'}`,
                      nftObj: item,
                      src: nft && nft.nftType === 'trippy-owl-single' ? `${this.SERVER_URL}/trippy-owl/${nft.src}` : null 
                    }
                  }),
                },
              ];
              
            })
            .catch(async (err) => {
              console.log("Error is: ", err);
            });
        }
      } catch (err) {
        console.log("wallet error is: ", err);
      }
    })

    setTimeout(() => {
      this.hideAssets = true;
     }, 5000);

  }

  redirectlandingPage(data: any) {
    this.setSelectedNft(data);
    // this.router.navigateByUrl("/landing");
  }
  setSelectedNft(data: any) {
    // this.selectedNft = data;
    data.nftId["userNftId"] = data._id;
    // this.selectedNft$ = new BehaviorSubject(data);
    const obj = {
      ...data.nftId,
      mintToken: data.mintToken,
      amount: data.amount
    }
    localStorage.setItem("selectedNft", JSON.stringify(obj));
    this.APIServices.userLoginData$.next(data.nftId);
  }

  redirectform(data: any) {
    console.log("data :: ", data);

    this.setSelectedNft(data);
    this.router.navigateByUrl("/form");

    // service
    // make a observable
  }

  cancelSelectedNft(data: any) {
    console.log("data :: ", data);
    this.cancelbtn = true;
    if (data && data._id) {
      this.APIServices.cancelUserNft(data._id)
        .then((res) => {
          console.log(this.allMyNFTGroups, "response is ", res);
          if (res.status) {
            // const nftIndex = this.allMyNFTGroups[0].contentData.findIndex(item => item.nftObj._id === data._id);
            // this.allMyNFTGroups[0].contentData[nftIndex].nftObj.status = 'list';
            // this.allMyNFTGroups = JSON.parse(JSON.stringify(this.allMyNFTGroups));
            this.cancelbtn = false;
            this.toastr.success(res.msg);
          } else {
            this.toastr.error(res.msg);
            this.cancelbtn = false;
          }
        })
        .catch((err) => {
          console.log("Error is: ", err);
          this.cancelbtn = false;
        });
    }
  }

}
