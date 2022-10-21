import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NFTContentType } from "src/app/models/nft-content-data";
import {
  NFTContentGroup,
  NFTContentGroupData,
  NftObjData,
  BuyNftObjData
} from "src/app/models/nft-content-group-data";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../helper/spinner/spinner.service';
import { environment as env } from '../../../environments/environment';
import Loader from '../../services/nami-loader.service';
import MintLoader from '../../services/nami-minting-243.service';
import { attr } from "highcharts";
declare var $: any;
@Component({
  selector: "app-nft",
  templateUrl: "./nft.component.html",
  styleUrls: ["./nft.component.scss"],
})
export class NFTComponent implements OnInit {
  adminNamiWalletAddress = env.adminNamiWalletAddress;
  ADMIN_ROYALITY = env.ADMIN_ROYALITY;
  ASSET_TRANSFER_PRICE = env.ASSET_TRANSFER_PRICE;

  [x: string]: any;
  allNFTGroups: NFTContentGroupData[] = [];
  // allMyNFTGroups: NFTContentGroupData[] = [];
  mythicNFTsGroup: NFTContentGroupData[] = [];
  rareNFTsGroup: NFTContentGroupData[] = [];
  legendaryNFTsGroup: NFTContentGroupData[] = [];
  commonNFTsGroup: NFTContentGroupData[] = [];
  filterNFTGroups: NFTContentGroupData[] = [];
  isOpen: boolean = false;




  constructor(
    private readonly APIServices: NFTsAPIServices,
    private readonly router: Router,
    private toastr: ToastrService,
    private spinnerService: SpinnerService
  ) { }

  nextBox: boolean = false;
  firstBox: boolean = true;
  resultBox: boolean = false;
  mergerButtons: boolean = false;
  AllNftShow: boolean = true;
  incubationText: boolean = false;
  showsell: boolean = false;
  mintHide: boolean = true;
  myNftsshow: boolean = false;
  action: any = '';
  namiwallet: any = "";
  custumid: any = "";
  loading: boolean = false;
  keyitem: any = {
    src: '',
    amount: ''
  };
  active: any = false;
  keynfthide: boolean = false;
  mintNftObj: NftObjData = {
    _id: 'N/A',
    assetName: 'N/A',
    amount: 'N/A',
    availableForSale: false,
    owned_by: 'N/A',
    quantity: 'N/A',
    userNftId: 'N/A',
    ownerAddr: 'ADMIN',
    metadata: '',
    assetKey: '',
    imageUrl: '',
    imageLink: ''
  };
  buyNftObj: BuyNftObjData = {
    _id: 'N/A',
    assetName: 'N/A',
    // amount: 'N/A',
    // availableForSale: false,
    // owned_by: 'N/A',
    // quantity: 'N/A',
    // userNftId: 'N/A',
    // ownerAddr: 'ADMIN',
    userNftData: {
      _id: '',
      amount: 0,
      userNftId: '',
      userId: ''
    }
  };
  isVerifiedWallet: any = false;
  authUser: any = null;
  disablebtn: any = false;
  buydiable: any = false;
  btnid = "";
  buyid = "";
  fundsbtn: boolean = false;
  remainingNftsClaimBtn: boolean = false;
  async ngOnInit() {
    // if (!localStorage.getItem("mintMsg")) {
    //   this.toastr.info("Minting is now live");
    //   localStorage.setItem("mintMsg", "true");
    // }
    this.namiwallet = await Loader.CardanoWalletAddress(); //localStorage.getItem("walletAddr");
    // console.log(this.namiwallet, " <= this.namiwallet")

    this.initNFTContents();
    // this.initMyNFTContents();
    this.allNFTs();

    // const userApiResp: any = await new Promise(async (resolve, reject) => {
    //   const regUser = await this.APIServices.userRegister({
    //     walletAddr: this.namiwallet,
    //     // name: "test",
    //   });
    //   resolve(regUser)
    // });
    // if (userApiResp.status) {

      this.APIServices.userLoginData$.subscribe((data) => {
        console.log(data, 'Home component');
        this.authUser = data;
      })

      // localStorage.setItem("token", userApiResp.token);
      // this.authUser = userApiResp.data.type;
      // console.log(this.authUser, "admin12345")

      this.fundsbtn = false;
      this.remainingNftsClaimBtn = false;
      if (this.authUser === 'admin') {
        this.fundsbtn = true;
      } else if (this.authUser === 'dev') {
        this.remainingNftsClaimBtn = true;
      }
    // }
  }

  batchMinting = async () => {
    if (!localStorage.getItem("batchMintScriptAddr")) {
      console.log("Address not found");
      return;
    }
    const MintNami = await MintLoader.Cardano();
    const newPolicy = await MintLoader.createPolicy();
    console.log("newPolicy ", JSON.stringify(newPolicy));

    // const newPolicy = {
    //   "id": "f350de8ed1aa53522044ec6f74dee43c9a56b3a81aff32616352679f",
    //   "script": "8201828200581c21b056ce32f9b7ce600eb736ed0d4ccb8a3ff4ff7c76dca11c34f14c82051a033cf43b",
    //   "paymentKeyHash": "21b056ce32f9b7ce600eb736ed0d4ccb8a3ff4ff7c76dca11c34f14c",
    //   "ttl": 54326331
    // }

    // 3. Create POLICY_ID
    const POLICY_ID = newPolicy.id;
    const POLICY_SCRIPT = newPolicy.script;

    const mintedAssets = [
      {
        "assetName": "GRISEC12021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEC22021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEC32021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEC42021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEC52021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEC62021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEC72021",
        "quantity": "27",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEC82021",
        "quantity": "27",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISER12021",
        "quantity": "18",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISER22021",
        "quantity": "18",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISER32021",
        "quantity": "18",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISER42021",
        "quantity": "18",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISER52021",
        "quantity": "19",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISER62021",
        "quantity": "19",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEL12021",
        "quantity": "14",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEL22021",
        "quantity": "14",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEL32021",
        "quantity": "14",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEL42021",
        "quantity": "13",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEMYTHIC2021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      },
      {
        "assetName": "GRISEKEY2021",
        "quantity": "28",
        "policyId": POLICY_ID,
        "policyScript": POLICY_SCRIPT
      }
    ];

    const assetsData = [
      {
        "assetKey": "GRISEC12021",
        "assetName": "GRISE C-1-2021",
        "imageUrl": "ipfs://QmRTSn3aaDrn3AMGpJofup5XNvBL7vdQ531TqGyuMu6AFx",
        "metadata": {}
      },
      {
        "assetKey": "GRISEC22021",
        "assetName": "GRISE C-2-2021",
        "imageUrl": "ipfs://QmW9rtRtjT3H8dVJjH6mBxdEqo8dN9H9NrrZaCJJHV46Nc",
        "metadata": {}
      },
      {
        "assetKey": "GRISEC32021",
        "assetName": "GRISE C-3-2021",
        "imageUrl": "ipfs://QmWGSKrXV2pyeEtQEpN5Vo9mc8gu1Z7ytBiTrWa7enFSyu",
        "metadata": {}
      },
      {
        "assetKey": "GRISEC42021",
        "assetName": "GRISE C-4-2021",
        "imageUrl": "ipfs://QmZUvx6T1X6ppnJVwhp9xbmQijTDgCAjfq9AkrbqBdNmUt",
        "metadata": {}
      },
      {
        "assetKey": "GRISEC52021",
        "assetName": "GRISE C-5-2021",
        "imageUrl": "ipfs://QmPYK7WakmUMHyLc72YK3URmyj5MRyb6FDhWCF23tX49NL",
        "metadata": {}
      },
      {
        "assetKey": "GRISEC62021",
        "assetName": "GRISE C-6-2021",
        "imageUrl": "ipfs://QmTsbnuFJUs987mtVJvxpsXQamRdxgPVdFX4ZmoAX6rp3p",
        "metadata": {}
      },
      {
        "assetKey": "GRISEC72021",
        "assetName": "GRISE C-7-2021",
        "imageUrl": "ipfs://QmP8f274nv8LEzimZTa792pAv9xxknpCwFDXrQ4X4bwpEY",
        "metadata": {}
      },
      {
        "assetKey": "GRISEC82021",
        "assetName": "GRISE C-8-2021",
        "imageUrl": "ipfs://QmU3PsxnPaKphfgx5zVazWo359ABroabVyCBKKRJVuxJ4W",
        "metadata": {}
      },
      {
        "assetKey": "GRISER12021",
        "assetName": "GRISE R-1-2021",
        "imageUrl": "ipfs://QmXvvcGGf2ptHdipdDPpgarsZYVDmrpwFekGAohejA9o2q",
        "metadata": {}
      },
      {
        "assetKey": "GRISER22021",
        "assetName": "GRISE R-2-2021",
        "imageUrl": "ipfs://QmZbnadfNKKae5YyJtWkw59Cj7KLw1xsYi1op6e9QqXAqF",
        "metadata": {}
      },
      {
        "assetKey": "GRISER32021",
        "assetName": "GRISE R-3-2021",
        "imageUrl": "ipfs://QmSBB54xgeUzESkWf3VzUBhn4981LcGgSfB9pCBJjqaXsj",
        "metadata": {}
      },
      {
        "assetKey": "GRISER42021",
        "assetName": "GRISE R-4-2021",
        "imageUrl": "ipfs://QmQwpRwha92Nc9j5ZqM2tdiYbwZCC2UmeBhsSEpZPbE3Vo",
        "metadata": {}
      },
      {
        "assetKey": "GRISER52021",
        "assetName": "GRISE R-5-2021",
        "imageUrl": "ipfs://QmSdvikU2N9ggR3UHkwZgGDirFvkUyDo9gvEHfUEcozMGb",
        "metadata": {}
      },
      {
        "assetKey": "GRISER62021",
        "assetName": "GRISE R-6-2021",
        "imageUrl": "ipfs://QmaotUK8BXdvidgYctMBcSBuvgrmbEj7EgjAShanyEHPXb",
        "metadata": {}
      },
      {
        "assetKey": "GRISEL12021",
        "assetName": "GRISE L-1-2021",
        "imageUrl": "ipfs://QmYuPnqxqEEF5k8TEe8dKP8GRuVnQcp1nWQo41sNp7E19X",
        "metadata": {}
      },
      {
        "assetKey": "GRISEL22021",
        "assetName": "GRISE L-2-2021",
        "imageUrl": "ipfs://QmNXGdoGq96zwWzZag1Yq1ZPGkiKS1muiKeunFBDRvpazX",
        "metadata": {}
      },
      {
        "assetKey": "GRISEL32021",
        "assetName": "GRISE L-3-2021",
        "imageUrl": "ipfs://QmcVJoPB8Zyfeh5FmMeX5LD9KehBXe4VDn7Jww5hMMWSYD",
        "metadata": {}
      },
      {
        "assetKey": "GRISEL42021",
        "assetName": "GRISE L-4-2021",
        "imageUrl": "ipfs://QmZtdJtNfYnSQx24dLxwex1RrDfLtbcxspx8urAcUPg7TB",
        "metadata": {}
      },
      {
        "assetKey": "GRISEMYTHIC2021",
        "assetName": "GRISE MYTHIC-2021",
        "imageUrl": "ipfs://QmehyozkKD9gdhAnU3cCrzRVmPFPYFhvCTL1KKwDDKKxty",
        "metadata": {}
      },
      {
        "assetKey": "GRISEKEY2021",
        "assetName": "GRISE KEY-2021",
        "imageUrl": "ipfs://QmSTRDjr6R4wAqbadga2gxWc92wfHwCEWbE4w2hHyuEz5K",
        "metadata": {}
      }
    ];

    const batchRecipients = [
      {
        address: localStorage.getItem("batchMintScriptAddr"),
        mintedAssets
      }
    ];

    const metadata_assets = assetsData.reduce((result, asset) => {

      // 4. Define ASSET_NAME
      const ASSET_NAME = asset.assetKey;

      // 5. Create ASSET_ID
      const ASSET_ID = POLICY_ID + "." + ASSET_NAME;

      const asset_metadata = {
        name: asset.assetName,
        image: asset.imageUrl,
        description: "GRISE NFT Marketplace",
        authors: ["GRISE"]
      }

      asset.metadata = {
        721: {
          [POLICY_ID]: {
            [ASSET_NAME]: asset_metadata
          }
        }
      };

      return {
        ...result,
        [ASSET_NAME]: asset_metadata
      }
    }, {})

    // 6. Define metadata
    const metadataMinting = {
      721: {
        [POLICY_ID]: {
          ...metadata_assets
        }
      }
    }

    let txHash: any = '';
    try { // T#1
      console.log("======================= Start Tx ==========================")
      txHash = await MintLoader.buildFullTransactionBatchMinting(batchRecipients, metadataMinting);
      // txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
      console.log("======================= End Tx ==========================")

      if (txHash && txHash.error) {
        this.toastr.error("Transaction Failed");
        return
      } else {
        this.toastr.success(`TxHash is: ${txHash}`, "Remaining NFTs minted successfully");
      }
    } catch (err) {
      console.log("err1: ", err);
      if (err && err.info) {
        // this.toastr.info(err.info);
        return

      } else {
        this.toastr.error("Failed to batch minting");
      }
    }
  }
  // initMyNFTContents() {
  //   this.allMyNFTGroups = [];
  //   this.mythicNFTsGroup = [];
  //   this.rareNFTsGroup = [];
  //   this.legendaryNFTsGroup = [];
  //   this.commonNFTsGroup = [];
  //   const walletAddr = localStorage.getItem("walletAddr");
  //   if (walletAddr) {
  //     this.APIServices.myNftsList(walletAddr)
  //       .then((res) => {

  //         let userNftsList = res.data ? res.data : [];
  //         this.allMyNFTGroups = [
  //           {
  //             id: 1,
  //             contentGroup: NFTContentGroup.Mythic,
  //             contentHeader: "My NFTs",
  //             contentData: userNftsList.map((item: any) => {
  //               const nft = item.nftId;
  //               return {
  //                 contentType: (nft && nft.nftType === "mythic") ? NFTContentType.Gif : NFTContentType.Image,
  //                 contentPath: `assets/${nft && nft.nftType ? nft.nftType : 'type'}/${nft && nft.src ? nft.src : 'src'}`,
  //                 availableForSale: item.availableForSale
  //               }
  //             }),
  //           },
  //         ];

  //       })
  //       .catch((err) => {
  //         console.log("Error is: ", err);
  //       });
  //   }
  // }

  async initNFTContents() {
    this.allNFTGroups = [];
    this.mythicNFTsGroup = [];
    this.rareNFTsGroup = [];
    this.legendaryNFTsGroup = [];
    this.commonNFTsGroup = [];
    this.keynftGroup = [];
    // this.spinnerService.show()

    // await Loader.load()
    // const Nami = await Loader.Cardano();
    // let paymentAddr = await Nami.getAddress();

    // const connectedWalletAddress = paymentAddr; // localStorage.getItem('walletAddr') ? localStorage.getItem('walletAddr') : null;

    // const userApiResp: any = await new Promise(async (resolve, reject) => {
    //   const regUser = await this.APIServices.userRegister({
    //     walletAddr: this.namiwallet,
    //     // name: "test",
    //   });
    //   resolve(regUser)
    // });
    // if (userApiResp.status) {
    //   localStorage.setItem("token", userApiResp.token);
    //   this.authUser = userApiResp.data;
    // }
    this.APIServices.userLoginData$.subscribe((data) => {
      console.log(data, 'NFT component');
      this.authUser = data;
    })

    // console.log("userApiResp : ", userApiResp);

    this.APIServices.nftsList(this.namiwallet)
      .then((res) => {
        // this.spinnerService.hide()

        this.keyitem = this.keyNftshow(res.data);
        this.keynfthide = true;
        const mythicNfts = res.data.filter(
          (item: any) => item.nftType === "mythic",
        );
        const rareNfts = res.data.filter(
          (item: any) => item.nftType === "rare"
        );
        const legendaryNfts = res.data.filter(
          (item: any) => item.nftType === "legend"
        );
        const commonNfts = res.data.filter(
          (item: any) => item.nftType === "common"
        );
        const keyNfts = res.data.filter(
          (item: any) => item.nftType === "key"
        );
        // console.log("keyNfts ", keyNfts);

        this.mythicNFTsGroup = [
          {
            id: 1,
            contentGroup: NFTContentGroup.Mythic,
            contentHeader: "Mythic",
            contentData: mythicNfts.map((nft: any) => {
              return {
                contentType: NFTContentType.Gif,
                contentPath: `assets/mythic/${nft.src}`,
                nftObj: nft,

              };
            }),
          },
        ];
        console.log(this.btnid, "nft")
        this.rareNFTsGroup = [
          {
            id: 2,
            contentGroup: NFTContentGroup.Rare,
            contentHeader: "Rare",
            contentData: rareNfts.map((nft: any) => {
              return {
                contentType: NFTContentType.Image,
                contentPath: `assets/rare/${nft.src}`,
                nftObj: nft,

              };
            }),
          },
        ];

        this.legendaryNFTsGroup = [
          {
            id: 3,
            contentGroup: NFTContentGroup.Legendary,
            contentHeader: "Legendary",
            contentData: legendaryNfts.map((nft: any) => {
              return {
                contentType: NFTContentType.Image,
                contentPath: `assets/legend/${nft.src}`,
                nftObj: nft
              };
            }),
          },
        ];

        this.commonNFTsGroup = [
          {
            id: 4,
            contentGroup: NFTContentGroup.Common,
            contentHeader: "Common",
            contentData: commonNfts.map((nft: any) => {
              return {
                contentType: NFTContentType.Image,
                contentPath: `assets/common/${nft.src}`,
                nftObj: nft
              };
            }),
          },
        ];
        // this.keynftGroup = [
        //   {
        //     id: 0,
        //     contentGroup: NFTContentGroup.key,
        //     contentHeader: "Key",
        //     contentData: keyNfts.map((nft: any) => {
        //       return {
        //         contentType: NFTContentType.Gif,
        //         contentPath: `assets/key/${nft.src}`,
        //         nftObj: nft,
        //       };
        //     }),

        //   },

        // ];

        this.allNFTGroups.push(
          ...this.mythicNFTsGroup,
          //...this.rareNFTsGroup,
          //...this.legendaryNFTsGroup,
          //...this.commonNFTsGroup,
          //...this.keynftGroup,
        );
        console.log(this.allNFTGroups, "show data");
      })
      .catch((err) => {
        console.log("Error: response api =>  ", err);
        // this.spinnerService.hide()
      });
  }

  allNFTs() {
    this.filterNFTGroups = this.allNFTGroups;
    this.mergerButtons = false;
    this.AllNftShow = true;
    this.incubationText = false;
    this.myNftsshow = false;
    if (this.allNFTGroups) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  mythicNFTs() {
    this.filterNFTGroups = this.mythicNFTsGroup;
    this.mergerButtons = false;
    this.AllNftShow = true;
    this.incubationText = false;
    this.myNftsshow = false;
    if (this.filterNFTGroups = this.mythicNFTsGroup) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  rareNFTs() {
    this.filterNFTGroups = this.rareNFTsGroup;
    this.mergerButtons = false;
    this.AllNftShow = true;
    this.incubationText = false;
    this.myNftsshow = false;
  }

  legendaryNFTs() {
    this.filterNFTGroups = this.legendaryNFTsGroup;
    this.mergerButtons = false;
    this.AllNftShow = true;
    this.incubationText = false;
    this.myNftsshow = false;
  }

  commonNFTs() {
    this.filterNFTGroups = this.commonNFTsGroup;
    this.mergerButtons = false;
    this.AllNftShow = true;
    this.incubationText = false;
    this.myNftsshow = false;
  }
  nextImagesBox() {
    this.nextBox = true;
    this.firstBox = false;
  }
  nextResultBox() {
    this.nextBox = false;
    this.resultBox = true;
  }
  redirectlandingPage(data: any) {
    this.setSelectedNft(data);
    // this.router.navigateByUrl("/landing");
  }

  setSelectedNft(data: any) {
    // localStorage.setItem("selectedNft", JSON.stringify(data));
    // this.APIServices.userLoginData$.next(data);
  }

  redirectform(data: any) {
    // this.setSelectedNft(data);
    // this.router.navigateByUrl("/form");
  }
  mergerButtonsShow() {
    this.filterNFTGroups = [];
    this.mergerButtons = true;
    this.AllNftShow = false;
    this.incubationText = false;
    this.myNftsshow = false;
  }
  incubationShow() {
    this.filterNFTGroups = [];
    this.incubationText = true;
    this.mergerButtons = false;
    this.AllNftShow = false;
    this.myNftsshow = false;
  }
  resetMintNftObj() {
    this.mintNftObj = {
      _id: 'N/A',
      assetName: 'N/A',
      amount: 'N/A',
      availableForSale: false,
      owned_by: 'N/A',
      quantity: 'N/A',
      userNftId: 'N/A',
      ownerAddr: 'ADMIN',
      metadata: '',
      assetKey: '',
      imageUrl: '',
      imageLink: ''
    }
  }

  calcAdminRoyality = async (num: number, percentage: number) => {
    try {
      return num > 0 && percentage > 0 ? num * (percentage / 100) : 0 // parseInt(parseFloat(num * (percentage / 100)).toFixed(6)) : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  clickMint = async () => {
    console.log(this.mintNftObj, 'this.mintNftObjakldjfa;lksdjfas')
    // ***
    // verify wallet validations
    // check availbele tokens for minting
    // nami-wallet minting
    // update db records
    // ***
    this.disablebtn = true;
    try {

      const tokenAmmount = Number(this.mintNftObj.amount)
      const MintNami = await MintLoader.Cardano();

      const checkWallet = await Loader.verifyWallet(tokenAmmount, this.authUser.type);
      console.log(tokenAmmount, "clickMint verifyWallet => ", checkWallet);

      if (checkWallet !== true) {
        this.toastr.warning(checkWallet)
        return
      }
      if (this.namiwallet && checkWallet === true) {
        const nftResp: any = await new Promise(async (resolve, reject) => {
          const resp = await this.APIServices.verifyUserNft({
            nftId: this.mintNftObj._id,
            action: 'mint'
          });
          resolve(resp)
        });
        if (!nftResp.status) {
          this.toastr.error(nftResp.msg);
          return
        }

        const newPolicy = await MintLoader.createPolicy();
        console.log("newPolicy ", JSON.stringify(newPolicy));
        const recipients = [
          { // mint nft against connected wallet
            address: await MintNami.getAddress(),
            amount: this.ASSET_TRANSFER_PRICE,
            mintedAssets: [{
              assetName: this.mintNftObj.assetKey, quantity: "1", policyId: newPolicy.id,
              policyScript: newPolicy.script
            }]
          },
          { // send nft amount to admin
            address: this.adminNamiWalletAddress,
            amount: tokenAmmount
          }
        ];

        const mintMetadata: any = {
          "721": {
            [newPolicy.id]: {
              [this.mintNftObj.assetKey]: {
                name: this.mintNftObj.assetKey,
                description: 'GRISE NFT Marketplace.', // `GRISE Metamoonverse NFT Marketplace. https://grisemetamoonverse.io/nft`,
                image: this.mintNftObj.imageUrl,
                authors: ["GRISE"] // GRISEMETAMOONVERSE
              }
            }
          }
        };
        // console.log("mintMetadata => ", JSON.stringify(mintMetadata));
        let txHash: any = '';
        try { // T#1
          console.log("======================= Start Tx ==========================")
          txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
          console.log("======================= End Tx ==========================")

          if (txHash && txHash.error) {
            this.toastr.error("Transaction Failed");
            this.disablebtn = false;
            return
          }
        } catch (err) {
          console.log("err1: ", err);
          if (err && err.info) {
            // this.toastr.info(err.info);
            this.disablebtn = false;
            //console.log(err.info, "error test");
            return

          } else {

            console.log("mintMetadata 1:: ", JSON.stringify(mintMetadata));
            try { // T#2
              delete mintMetadata["721"][newPolicy.id][this.mintNftObj.assetKey].description;
              txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
            } catch (err2) {
              console.log("err2: ", err2);
              try { // T#3
                mintMetadata["721"][newPolicy.id][this.mintNftObj.assetKey].image = this.mintNftObj.imageLink;
                txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
              } catch (err3) {
                console.log("err3: ", err3);
                try { // T#4
                  delete mintMetadata["721"][newPolicy.id][this.mintNftObj.assetKey].image;
                  // mintMetadata["721"][newPolicy.script] = mintMetadata["721"][newPolicy.id];
                  // delete mintMetadata["721"][newPolicy.id];
                  // console.log("mintMetadata 3:: ", JSON.stringify(mintMetadata));
                  txHash = await MintLoader.buildFullTransaction(recipients, mintMetadata);
                } catch (err4) {
                  console.log("err4: ", err4);
                  txHash = await MintLoader.buildFullTransaction(recipients);
                }
              }

            }
          }
        }
        console.log("mintTransaction ", txHash);

        // const txHash = await Nami.send({
        //   address: this.adminNamiWalletAddress, // ADMIN ADDRESS
        //   amount: tokenAmmount
        // })
        if (!txHash) {
          this.toastr.error("Failed to mint NFT");
        } else {
          const data = {
            nftId: this.mintNftObj._id,
            mintToken: `${newPolicy.id}.${this.mintNftObj.assetKey}`,
            nftQuantity: 1
          }

          this.APIServices.mintNft(data)
            .then((res) => {
              this.btnid = ""
              if (res.status) {
                this.disablebtn = false;
                this.mintNftObj.quantity = String(Number(this.mintNftObj.quantity) - 1);
                this.toastr.success(`TxHash is: ${txHash}`, res.msg);
              } else {
                this.toastr.success(`TxHash is: ${txHash}`, "NFT minted");
                this.toastr.error(res.msg);
                this.disablebtn = false;
              }
            })
            .catch((err) => {
              this.toastr.success(`TxHash is: ${txHash}`, "NFT minted");
              this.toastr.error("Something went wrong");
              console.log("Error is: ", err);
              this.disablebtn = false;
            });
        }
      }
    } catch (error) {
      console.log("Error :: ", error);
      if (error && error.info) {
        this.toastr.info(error.info);
      } else {
        this.toastr.error("Something went wrong");
      }
    }
  }

  clickBuy = async () => {

    // this.showsell = true;
    // this.mintHide = false;
    console.log(this.adminNamiWalletAddress, "data is: ", this.buyNftObj);
    // Calculate 12% royalty for admin
    // const adminRoyality = await this.calcAdminRoyality(Number(this.mintNftObj.amount), this.ADMIN_ROYALITY); // func(250, 20) mean, 20 percent of 250
    // console.log("adminRoyality :: ", (parseFloat(adminRoyality.toString()).toFixed(6)));

    if (!this.buyNftObj || !this.buyNftObj.userNftData) {
      return
    }

    const selectedNft = this.buyNftObj.userNftData;
    const tokenAmmount = Number(selectedNft.amount) + this.ASSET_TRANSFER_PRICE;
    console.log("tokenAmmount:: ", tokenAmmount);


    this.buydiable = true;
    // Transfer amount (royalty fee + Asset amount) from connected wallet's address to admin
    try {
      const Nami = await Loader.Cardano();

      // ***
      // Check wallet balance
      // Royalty + Amount Transaction
      // ***

      const walletBalance = localStorage.getItem("lovelaces") ? localStorage.getItem("lovelaces") : 0;
      console.log("check blnc cond: ", walletBalance, Number(walletBalance) / 1000000, tokenAmmount)
      if (walletBalance && Number(walletBalance) / 1000000 > tokenAmmount + 1) {
        const nftResp: any = await new Promise(async (resolve, reject) => {

          const resp = await this.APIServices.verifyUserNft({
            userNftId: selectedNft.userNftId,
            action: 'buy'

          });
          resolve(resp)

        });
        if (!nftResp.status) {
          this.buydiable = false;
          this.toastr.error(nftResp.msg);
          return;
        }

        // const nftOwnerAddress = this.mintNftObj.ownerAddr;
        // const connectedUserWalletAddress = localStorage.getItem('walletAddr') ? localStorage.getItem('walletAddr') : null;

        // const txHash = await Nami.sendMultiple({
        //   recipients: [
        //     {
        //       address: this.adminNamiWalletAddress,
        //       amount: adminRoyality + this.ASSET_TRANSFER_PRICE
        //     },
        //     {
        //       address: nftOwnerAddress,
        //       amount: Number(this.mintNftObj.amount)
        //     }
        //   ]
        // })
        const txHash = await Nami.send({
          address: this.adminNamiWalletAddress, // ADMIN ADDRESS
          amount: tokenAmmount
        })
        if (!txHash) {
          this.toastr.error("Unable to pay asset amount to transfer");
          this.buydiable = false;
        } else {

          // console.log("txHash :: ", txHash)
          // Mint NFT against admin address(server address) then transfer to user's wallet
          this.spinnerService.show();
          this.buydiable = false;
          const data = {
            userNftId: selectedNft.userNftId,
            nftOwner: selectedNft.userId // nftOwnerAddress // receiver
          }

          this.APIServices.buyNft(data)
            .then((res) => {
              this.buyid = ""
              this.buydiable = false;
              this.spinnerService.hide();

              if (res.status) {
                this.buydiable = false;
                this.toastr.success(res.msg);
              } else {
                this.toastr.error(res.msg);
                this.buydiable = false;
                console.log(res.msg, "error msg")
              }
            })
            .catch((err) => {
              this.spinnerService.hide();
              this.buydiable = false;
              this.toastr.error("Something went wrong");
              console.log("Error is: ", err);
            });
        }

      } else {
        this.toastr.error("Insufficient balance");
        this.buydiable = false;
      }

    } catch (error) {
      console.log("Error :: ", error);
      this.buydiable = false;
      // this.toastr.error("Something went wrong");
    }
  }
  async getWalletBalance() {
    //debugger;
    try {
      //console.log('=================== ngOnInit')
      await Loader.load()
      const cardanoSerialize = await Loader.CardanoSRL();
      const S = cardanoSerialize;
      const cardano = (window as any).cardano;

      (window as any).global = window;
      // @ts-ignore
      window.Buffer = window.Buffer || require('buffer').Buffer;


      // const buffer =  (window as any).Buffer;
      //console.log('namiWallet loader', cardanoSerialize);
      //console.log('cardano loader', cardano);
      //console.log('cardano Get Balance :: ', await cardano.getBalance());

      cardano.getBalance().then((res: any) => {
        const balance = cardanoSerialize.Value.from_bytes(Buffer.from(res, 'hex'));
        const lovelaces = balance.coin().to_str();
        this.walletBalance = lovelaces;
        localStorage.setItem("lovelaces", lovelaces);
        console.log("**  lovelaces  ** ", this.convertToADA(lovelaces));
      })


      // const paymentAddr = cardanoSerialize.Address.from_bytes(Buffer.from(await cardano.getChangeAddress(), 'hex')).to_bech32()
      // console.log("paymentAddr :: ", paymentAddr);
      // localStorage.setItem("address", paymentAddr);
      // this.walletAddr = `${paymentAddr.slice(0, 10)}...${paymentAddr.slice(paymentAddr.length - 5, paymentAddr.length)}`;
      // let data = await this.nftService.namiRegister({
      //   walletAddr: paymentAddr,
      //   name: "test",

      // });
      // console.log(data, "this is nami address");

    } catch (error) {
      console.log('Something went wrong!')
      console.log(error)
    }
  }
  async handleMintNft(obj: any, action: any) {
    //  if (this.authUser && (this.authUser.type === 'dev' || this.authUser.type === 'admin')) {

    let nftAmount = 0;

    if (obj.userNftData && action === 'buy') {
      this.buyNftObj = obj;
      nftAmount = obj.userNftData.amount;
      this.buyid = obj.userNftData.userNftId;
    } else {
      this.mintNftObj = JSON.parse(JSON.stringify(obj));
      nftAmount = obj.amount;
    }
    if (this.authUser.type === 'dev') this.toastr.info('Developer mode enabled');

    const checkWallet = await Loader.verifyWallet(nftAmount, this.authUser.type);
    console.log(nftAmount, "Hi verifyWallet => ", checkWallet);
    if (checkWallet !== true) this.toastr.warning(checkWallet);

    if (this.namiwallet && checkWallet === true) {

      this.action = action;
      this.btnid = obj._id;
      // this.isOpen = true;
      $('#exampleModaltwo').modal('show');


    }

    // }else {
    //   this.toastr.info('Minting will be live in 2 Hours');
    // }
  }
  keyNftshow(keylist: any[]) {
    let keyNft = keylist.find(item => item.nftType == "key");
    // keyNft.src = `assets/key/${keyNft.src}`
    return keyNft;
  }

}
