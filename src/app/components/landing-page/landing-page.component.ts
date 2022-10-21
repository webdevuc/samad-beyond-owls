import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color } from "ng2-charts";
import { environment as env } from '../../../environments/environment';

import Loader from '../../services/nami-loader.service';

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  spinnerService: any;
  toastr: any;
  APIServices: any;
  
  adminNamiWalletAddress = env.adminNamiWalletAddress;
  ADMIN_ROYALITY = env.ADMIN_ROYALITY;
  ASSET_TRANSFER_PRICE = env.ASSET_TRANSFER_PRICE;
  mintNftObj: any;

  selectedNft: any;
  nftImg: any;
  nftamount:any;
  mintstatus : any;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  action: any;
  ngOnInit() {
    this.router.navigateByUrl("/nft");
    const data: any = localStorage.getItem("selectedNft");
    this.selectedNft = JSON.parse(data);
    this.nftImg = `assets/${this.selectedNft.nftType}/${this.selectedNft.src}`;
    this.mintstatus = this.selectedNft.isMinted;
    this.nftamount = this.selectedNft.amount;
    console.log("value: ", this.nftImg)
    console.log(this.mintstatus, "mint")
    this.dropdownList = [
      { item_id: 1, item_text: "Listing" },
      { item_id: 2, item_text: "Sales" },
      { item_id: 3, item_text: "Bids" },
      { item_id: 4, item_text: "Transfer" },
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 4,
      allowSearchFilter: false,
      enableCheckAll: false,
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  constructor(private router: Router) {}

  goToForm() {
    this.router.navigateByUrl("/form");
  }

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
            max: 0.03,
            fontColor: "white",
            display: false,
          },
          gridLines: {
            color: "#fff", // grid line color (can be removed or changed)
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 0.03,
            fontColor: "white",
            // callback: function (value, index) {
            //   if (index == 0) return 0.1;
            //   else if (index == 1) return 0.2;
            //   else if (index == 2) return 0.3;
            //   return "";
            // },
          },
          gridLines: {
            color: "#fff", // grid line color (can be removed or changed)
          },
        },
      ],
    },
    legend: { labels: { fontColor: "white" } },
  };
  public bubbleChartType: ChartType = "bubble";
  public bubbleChartLegend = true;

  public bubbleChartData: ChartDataSets[] = [
    {
      data: [{ x: 0.015, y: 0.015, r: 10 }],
      label: "Price History",
      backgroundColor: "white",
      borderColor: "white",
    },
  ];
  public bubbleChartColors: Color[] = [
    {
      borderColor: "rgb(255, 255, 255)",
      backgroundColor: "grey",
      borderWidth: 2,
    },
  ];

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  private rand(max: number): number {
    return Math.trunc(Math.random() * max);
  }

  private randomPoint(maxCoordinate: number): {
    r: number;
    x: number;
    y: number;
  } {
    const x = this.rand(maxCoordinate);
    const y = this.rand(maxCoordinate);
    const r = this.rand(30) + 5;
    return { x, y, r };
  }
  options: {
    legend: {
      display: false;
    };
  };

  calcAdminRoyality = async (num: number, percentage: number) => {
    try {
      return num > 0 && percentage > 0 ? num * (percentage / 100) : 0 // parseInt(parseFloat(num * (percentage / 100)).toFixed(6)) : 0;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  clickMint = async () => {
    // this.showsell = true;
    // this.mintHide = false;
    console.log(this.adminNamiWalletAddress, "data is: ", this.mintNftObj.amount);

    // Calculate 12% royalty for admin
    const adminRoyality = await this.calcAdminRoyality(Number(this.mintNftObj.amount), this.ADMIN_ROYALITY); // func(250, 20) mean, 20 percent of 250
    console.log("adminRoyality :: ", (parseFloat(adminRoyality.toString()).toFixed(6)));

    const tokenAmmount = this.mintNftObj.amount + adminRoyality;
    console.log("tokenAmmount:: ", tokenAmmount);



    // Transfer amount (royalty fee + Asset amount) from connected wallet's address to admin
    try {
      const Nami = await Loader.Cardano();

      // ***
      // Check wallet balance
      // Royalty + Amount Transaction
      // ***

      const walletBalance = localStorage.getItem("lovelaces") ? localStorage.getItem("lovelaces") : 0;
      if (walletBalance && Number(walletBalance) / 1000000 > Number(tokenAmmount)) {
        const txHash = await Nami.send({
          address: this.adminNamiWalletAddress, // ADMIN ADDRESS
          amount: tokenAmmount
        })
        if (!txHash) {
          this.toastr.error("Unable to pay asset amount to mint");
        } else {

          console.log("txHash :: ", txHash)
          // Mint NFT against admin address(server address) then transfer to user's wallet
          this.spinnerService.show();
          const receiver = localStorage.getItem('walletAddr') ? localStorage.getItem('walletAddr') : null;
          const data = {
            nftId: this.mintNftObj._id,
            receiverAddr: receiver
          }

          this.APIServices.mintNft(data)
            .then((res: { status: any; msg: any; }) => {
              this.spinnerService.hide();

              if (res.status) {
                this.toastr.success(res.msg);
              } else {
                this.toastr.error(res.msg);
              }
            })
            .catch((err: any) => {
              this.spinnerService.hide();
              this.toastr.error("Something went wrong");
              console.log("Error is: ", err);
            });
        }

      } else {
        this.toastr.error("Insufficient balance");
      }

    } catch (error) {
      console.log("Error :: ", error);
      // this.toastr.error("Something went wrong");
    }
  }

  clickBuy = async () => {
    // this.showsell = true;
    // this.mintHide = false;
    console.log(this.adminNamiWalletAddress, "data is: ", this.mintNftObj);

    // Calculate 12% royalty for admin
    const adminRoyality = await this.calcAdminRoyality(Number(this.mintNftObj.amount), this.ADMIN_ROYALITY); // func(250, 20) mean, 20 percent of 250
    console.log("adminRoyality :: ", (parseFloat(adminRoyality.toString()).toFixed(6)));

    const tokenAmmount = this.mintNftObj.amount // + adminRoyality;
    console.log("tokenAmmount:: ", tokenAmmount);



    // Transfer amount (royalty fee + Asset amount) from connected wallet's address to admin
    try {
      const Nami = await Loader.Cardano();

      // ***
      // Check wallet balance
      // Royalty + Amount Transaction
      // ***

      const walletBalance = localStorage.getItem("lovelaces") ? localStorage.getItem("lovelaces") : 0;
      if (walletBalance && Number(walletBalance) / 1000000 > Number(tokenAmmount)) {

        const nftOwnerAddress = this.mintNftObj.ownerAddr;
        // const connectedUserWalletAddress = localStorage.getItem('walletAddr') ? localStorage.getItem('walletAddr') : null;

        const txHash = await Nami.sendMultiple({
          recipients: [
            {
              address: this.adminNamiWalletAddress,
              amount: adminRoyality
            },
            {
              address: nftOwnerAddress,
              amount: tokenAmmount
            }
          ]
        })
        // const txHash = await Nami.send({
        //   address: this.adminNamiWalletAddress, // ADMIN ADDRESS
        //   amount: adminRoyality
        // })
        if (!txHash) {
          this.toastr.error("Unable to pay asset amount to transfer");
        } else {

          // console.log("txHash :: ", txHash)
          // Mint NFT against admin address(server address) then transfer to user's wallet
          this.spinnerService.show();

          const data = {
            userNftId: this.mintNftObj.userNftId,
            receiverAddr: this.mintNftObj.ownerAddr // receiver
          }

          this.APIServices.buyNft(data)
            .then((res:any) => {
              this.spinnerService.hide();

              if (res.status) {
                this.toastr.success(res.msg);
              } else {
                this.toastr.error(res.msg);
              }
            })
            .catch((err:any) => {
              this.spinnerService.hide();
              this.toastr.error("Something went wrong");
              console.log("Error is: ", err);
            });
        }

      } else {
        this.toastr.error("Insufficient balance");
      }

    } catch (error) {
      console.log("Error :: ", error);
      // this.toastr.error("Something went wrong");
    }
  }

  handleMintNft(obj: any, action: any) {
    // obj["owned_by"] = "ADMIN";
    console.log('handleMintNft ', obj);
    this.action = action;
    this.mintNftObj = obj;
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
      ownerAddr: 'ADMIN'
    }
  }
}
