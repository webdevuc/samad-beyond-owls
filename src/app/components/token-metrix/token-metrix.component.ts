import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { from, Observable, throwError } from 'rxjs';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label, SingleDataSet, Color } from 'ng2-charts';
import {MatPaginatorModule} from '@angular/material/paginator';
import { color, Dictionary } from 'highcharts';
import {formatDate} from '@angular/common';
import * as StakingToken from '../../../abis/token/GriseToken.json';
import { ContractService } from '../../services/contract.service';
import { promise } from 'selenium-webdriver';
import * as Highcharts from "highcharts/highstock";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import StockTools from "highcharts/modules/stock-tools.js";

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
StockTools(Highcharts);


declare let Web3: any;
declare let window: any;
const web3 = window.web3;


@Component({
  selector: 'app-token-metrix',
  templateUrl: './token-metrix.component.html',
  styleUrls: ['./token-metrix.component.scss']
})
export class TokenMetrixComponent implements OnInit {
// contract
  address:string;
  public bar: any = [];
  highcharts = Highcharts;
  Inv_Type:string = "trader"
  inv_type: string;
  time_win: string;
  time_frame: string;
  min_cap: number;
  max_cap: number;
  limit: number;
  // url = 'https://etherkat.com/get-best-coin`;
  url = 'https://etherkat.com'
  items: any  = [];
  public pieChartOptions: any = {
  responsive: true,
  tooltips: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    bodyFontColor: '#999',
    borderColor: '#999',
    titleFontColor: '#999',
    titleFontSize: 20,
    bodyFontSize: 20,
    titleMarginBottom: 10,
    xPadding: 15,
    yPadding: 15,
  },
  legend: {
    display: true,
    fontSize: 20,
    labels: {
      fontColor: 'white', fontSize:20
    }
   }
  };
  public PieChartColor: Color[] = [{
    backgroundColor: ['#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43', '#ffa600', '#ca5300', '#aa2600']
   }];
  public pieChartLabels: Label[] = ['SciFi', 'Drama', 'Comedy'];
  public pieChartData: SingleDataSet = [30, 50, 20];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public loadData = true
  public loadingstate: number;
  public ld:number = 0;


  public data_coins:any;
  public trend_coins:any;



  // Pagination
  page_number:number;

  GraphData:any = {
    chart: {
      backgroundColor: "#3b4148",
    },
    rangeSelector: {
      chart: {
        backgroundColor: "#3b4148",
      },
      buttonTheme: { // styles for the buttons
        fill: 'none',
        stroke: 'none',
        'stroke-width': 0,
        r: 8,
        style: {
            color: 'white',
            fontWeight: 'bold'
        },
        states: {
            hover: {
                fill: 'white',
                style: {
                    color: 'black'
                }
            },
            select: {
                fill: 'white',
                style: {
                    color: 'black'
                }
            }
        }
    },
    inputStyle: {
        color: 'white',
        fontWeight: 'bold',
        states:{
            select:{
                color: 'black',
            }
        }
    },
    labelStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
      selected: 1
    },
    title: {
      text: "Coin Past and Predicted Price",
      style: {
        color: '#fff',
      }
    },
    yAxis: {
        title: {
            text: ''
        },
        gridLineColor: 'gray',
        labels: {
          style: {
              color: 'white'
          }
      }
    },

    series: [
      {
        type: "line",
        name: "Past Price",
        data: [],
        color: '#DDDF00',
      },

      {
        type: "line",
        name: "Predicted Price",
        data: [],
        color: '#ff0000'
      }
    ]
  }

  // pieChart:any = {
  //   chart: {
  //       type: 'pie',
  //       backgroundColor: "#3b4148",
  //   },
  //   title: {
  //       text: "Trending Coins",
  //       style: {
  //         color: '#fff',
  //       }
  //   },
  //   tooltip: {
  //       pointFormat: '{series.name}: {point.percentage:.1f}%'
  //   },
  //   accessibility: {
  //       point: {
  //           valueSuffix: '%'
  //       }
  //   },
  //   plotOptions: {
  //       pie: {
  //           allowPointSelect: true,
  //           cursor: 'pointer',
  //           dataLabels: {
  //               enabled: true,
  //               format: '{point.name}: {point.percentage:.1f} %'
  //           }
  //       }
  //   },
  //   series: [{
  //       name: 'Market Cap',
  //       colorByPoint: true,
  //       data: []
  //   }]
  // }


  // coin prediction line chart
 // Array of different segments in chart
 public lineChartData: ChartDataSets[] = [];

//Labels shown on the x-axis
public lineChartLabels: any[] = [];

// Define chart options
lineChartOptions: ChartOptions = {
  responsive: false,
  tooltips: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    bodyFontColor: '#999',
    borderColor: '#999',
    borderWidth: 1,
    caretPadding: 15,
    displayColors: false,
    enabled: true,
    intersect: true,
    mode: 'x',
    titleFontColor: '#999',
    titleFontSize: 20,
    bodyFontSize: 20,
    titleMarginBottom: 10,
    xPadding: 15,
    yPadding: 15,
  },
  legend: {
    labels: { fontColor: 'white' ,  fontSize: 20}
  },
  scales: {
    xAxes: [{
      ticks: { fontColor: 'white', fontSize: 20 },
      gridLines: { color: 'rgba(255,255,255,0.1)' }
    }],
    yAxes: [{
      ticks: { fontColor: 'white' , fontSize: 20 },
      gridLines: { color: 'rgba(255,255,255,0.1)' }
    }]
  }

};

// Define colors of chart segments
lineChartColors: Color[] = [
];

// Set true to show legends
lineChartLegend = true;

// Define type of chart
lineChartType = 'line';

lineChartPlugins = [];


// coins_list_api
public coins_list_api:any = [];
// coin search dropdown
currentProduct: string = "";


// Last Change Date
public last_change_date:string;


// Trading Signal
doughnutChartLabels: Label[] = ['Money IN-OUT','Largest Transaction','User Growth','Concentration On-Chain'];
  doughnutChartData: MultiDataSet = [
  ];
  doughnutChartType: ChartType = 'doughnut';
  public doughnutChartColors: Color[] = [{
    backgroundColor: ['#f1c40f', '#2ecc71', '#e74c3c', '#195EFF']
   }];

   DonOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      bodyFontColor: '#999',
      borderColor: '#999',
      displayColors: false,
      enabled: true,
      intersect: true,
      titleFontSize: 20,
      bodyFontSize: 20,
      titleMarginBottom: 10,
      xPadding: 15,
      yPadding: 15,
    },
    legend: {
      labels: { fontColor: 'white' ,  fontSize: 20}
    }
  }

  ai_decision_1: string;
  ai_decision_2: string;
  ai_decision_3: string;
  ai_decision_4: string;

  success_response:string;


  trade_coin_t:string;

  handleInvester(){
    if(this.Inv_Type == "trader"){
      this.Inv_Type = "invester"
    }else{
      this.Inv_Type = "trader"
    }
  }

  getCoinPrediction(coinName:any){
    let headers = new HttpHeaders();
    let params = new HttpParams().set("coin", coinName);
    this.http.get(this.url+`/get-coin-predict`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      if(details.code == 200){

        let price:number[]=[];
        let time_stamp:string[] = [];

        // console.log(coin_json)
        for (let data_coin of details.data.predicted){

          let date = new Date(data_coin.ds)
          let date_final:string = formatDate(date, 'yyyy/MM/dd', 'en');
          price.push(data_coin.y)
          time_stamp.push(date_final)
        }
        this.lineChartData = [
          {data:price, label:`${coinName} Predicted Price`}
        ];
        this.lineChartLabels = time_stamp;

        // let PastPrice:any = []
        // let PredictedPrice:any = []
        // if(details.data.data[0]){
        //   // const Past = details.data.data[0].data.timeseries
        //   const Future = details.data.data[0].data.predicted
        //   // for (let i = 0; i < Past.length; i++) {
        //   //   PastPrice.push([Past[i].ds,Past[i].y])
        //   // }
        //   for (let i = 0; i < Future.length; i++) {
        //     PredictedPrice.push([Future[i].ds,Future[i].y])
        //   }
        // }

        // this.GraphData = {
        //   chart: {
        //     backgroundColor: "#3b4148",
        //   },
        //   rangeSelector: {
        //     buttonTheme: { // styles for the buttons
        //       fill: 'none',
        //       stroke: 'none',
        //       'stroke-width': 0,
        //       r: 8,
        //       style: {
        //           color: 'white',
        //           fontWeight: 'bold'
        //       },
        //       states: {
        //           hover: {
        //               fill: 'white',
        //               style: {
        //                   color: 'black'
        //               }
        //           },
        //           select: {
        //               fill: 'white',
        //               style: {
        //                   color: 'black'
        //               }
        //           }
        //       }
        //   },
        //   inputStyle: {
        //       color: 'white',
        //       fontWeight: 'bold',
        //       states:{
        //           select:{
        //               color: 'black',
        //           }
        //       }
        //   },
        //   labelStyle: {
        //       color: 'white',
        //       fontWeight: 'bold',
        //   }
        //   },
        //   title: {
        //     text: "Coin Past and Predicted Price",
        //     style: {
        //       color: '#fff',
        //     }
        //   },
        //   yAxis: {
        //       title: {
        //           text: ''
        //       },
        //       gridLineColor: 'gray',
        //       labels: {
        //         style: {
        //             color: 'white'
        //         }
        //     }
        //   },

        //   series: [
        //     {
        //       type: "line",
        //       name: "Past Price",
        //       data: PastPrice,
        //       color: '#DDDF00',
        //     },

        //     {
        //       type: "line",
        //       name: "Predicted Price",
        //       data: PredictedPrice,
        //       color: '#ff0000'
        //     }
        //   ]
        // }

      }
    })
  }


  constructor(private contractService: ContractService,
    private http : HttpClient

  ) {
    this.page_number = 1;

  }

  // signal Trading function
  coinListTrading(trade_coin:any){
    let final_coin_symbol = trade_coin.toUpperCase()
    // console.log(final_coin_symbol)
    let headers_trading = new HttpHeaders();
    let params_trading = new HttpParams()
    .set("fsym", final_coin_symbol)
    .set("api_key", "d00aa50b839f504c38e611fe15f168cb3f0361e4b192efb98e90dfc303acea7b")
    this.http.get("https://min-api.cryptocompare.com/data/tradingsignals/intotheblock/latest", {headers:headers_trading, params:params_trading, responseType: 'text'}).toPromise().then(res_trading => {
      let data_json_trading = JSON.parse( res_trading )

      if (data_json_trading.Response!="Error")
      {
        this.doughnutChartData = [data_json_trading.Data.inOutVar.score, data_json_trading.Data.largetxsVar.score, data_json_trading.Data.addressesNetGrowth.score,data_json_trading.Data.concentrationVar.score]
        this.ai_decision_1 = data_json_trading.Data.inOutVar.sentiment
        this.ai_decision_2 = data_json_trading.Data.largetxsVar.sentiment
        this.ai_decision_3 = data_json_trading.Data.addressesNetGrowth.sentiment
        this.ai_decision_4 = data_json_trading.Data.concentrationVar.sentiment

        this.success_response = data_json_trading.Response + " " + data_json_trading.Message

      }
      else{
        this.doughnutChartData = []
        this.ai_decision_1 = ""
        this.ai_decision_2 = ""
        this.ai_decision_3 = ""
        this.ai_decision_4 = ""

        this.success_response = data_json_trading.Response + " " + data_json_trading.Message


      }







    })

  }

// f_address:string;
allowed_user:boolean = false;
staker_fuction(){
  let lcladdress:string='';
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);

      try {
         window.ethereum.enable().then( () => {
              // User has allowed account access to DApp...
              let promise = web3.eth.getAccounts(function (error: any, accounts: any[]) {

                  console.log(accounts[0], 'current account on init');
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
                    this.CustomOnInit();
                    }
              });
          });
      } catch (e) {
          console.log('Please Connect MetaMsk !');
          // User has denied account access to DApp...
      }


  } else {
      console.log('You have to install MetaMask !');

  }
  }

  giveAccess(){
    if(this.allowed_user){
      this.allowed_user = false
    }else{
      this.allowed_user = true
      this.CustomOnInit();
    }
  }

  CustomOnInit(){
    this.getCoinPrediction('bitcoin')
    // get coin names for dropdown options
    this.http.get(this.url+'/get-coin-name').subscribe(Response =>{
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.coins_list_api=resJSON.data.data;

      // console.log(this.coins_list_api);
  })


    // all coins api call
  //   this.http.get(this.url+'/get-all-coin?page='+this.page_number+'&per_page=10').subscribe(Response =>{
  //     // console.log(Response);
  //     let resSTR = JSON.stringify(Response);
  //     let resJSON = JSON.parse(resSTR);
  //     this.data_coins=resJSON.data.data;
  //     // console.log(data_coins);
  // })

// Trending coins api call
  this.http.get(this.url+'/get-trending-coin').subscribe(Response =>{
      // console.log(Response);
      let trendResSTR = JSON.stringify(Response);
      let trendResJSON = JSON.parse(trendResSTR);
      this.trend_coins=trendResJSON.data;
      // console.log(this.trend_coins);
  })

// intial coin prediction graph
let headers = new HttpHeaders();
let params = new HttpParams()
.set("coin", "bitcoin")
this.http.get(this.url+'/get-coin-predict',{headers: headers, params: params, responseType: 'text' }).toPromise().then(Response =>{
      // console.log(Response);


      let coin_json = JSON.parse(Response);
      let price:number[]=[];
      let time_stamp:string[] = [];

      // last change date display
      this.last_change_date = coin_json.data.last_updated_date
      // console.log(this.last_change_date)

      // console.log(coin_json)
      for (let data_coin of coin_json.data.predicted){

        let date = new Date(data_coin.ds)
        let date_final:string = formatDate(date, 'yyyy/MM/dd', 'en');
        price.push(data_coin.y)
        time_stamp.push(date_final)


      }
      // let price_past:number[]=[];
      // let coin_timestamp_past:Date[]=[];

      // for (let data_coin_past of coin_json.data.timeseries){

      //   let date_past = new Date(data_coin_past.ds)
      //   price_past.push(data_coin_past.y)
      //   coin_timestamp_past.push(date_past)

      // }

      // console.log(coin_timestamp_past)

      this.lineChartData = [
        {data:price, label:"Predicted Price"}
    ];
      this.lineChartLabels = time_stamp;


      // console.log(this.trend_coins);
  })

// Trading Signal
let headers_trading = new HttpHeaders();
let params_trading = new HttpParams()
.set("fsym", "BTC")
.set("api_key", "d00aa50b839f504c38e611fe15f168cb3f0361e4b192efb98e90dfc303acea7b")
this.http.get("https://min-api.cryptocompare.com/data/tradingsignals/intotheblock/latest", {headers:headers_trading, params:params_trading, responseType: 'text'}).toPromise().then(res_trading => {
  let data_json_trading = JSON.parse( res_trading )


  if (data_json_trading.Response!="Error")
  {
    this.doughnutChartData = [data_json_trading.Data.inOutVar.score, data_json_trading.Data.largetxsVar.score, data_json_trading.Data.addressesNetGrowth.score,data_json_trading.Data.concentrationVar.score]
    this.ai_decision_1 = data_json_trading.Data.inOutVar.sentiment
    this.ai_decision_2 = data_json_trading.Data.largetxsVar.sentiment
    this.ai_decision_3 = data_json_trading.Data.addressesNetGrowth.sentiment
    this.ai_decision_4 = data_json_trading.Data.concentrationVar.sentiment

    this.success_response = data_json_trading.Response + " " + data_json_trading.Message

  }
  else{
    this.doughnutChartData = []
    this.ai_decision_1 = ""
    this.ai_decision_2 = ""
    this.ai_decision_3 = ""
    this.ai_decision_4 = ""

    this.success_response = data_json_trading.Response + " " + data_json_trading.Message


  }




})
  }

  ngOnInit(): void {
    // this.staker_fuction();
    // this.CustomOnInit();
    }

  // function for pre_page pagination
  pre_page(){
    // all coins api call
    if (this.page_number >1)
    {
      this.page_number -= 1
      this.http.get(this.url+'/get-all-coin?page='+this.page_number+'&per_page=10').subscribe(Response =>{
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.data_coins=resJSON.data.data;
      // console.log(data_coins);
  })
    }
    else{
      this.http.get(this.url+'/get-all-coin?page='+this.page_number+'&per_page=10').subscribe(Response =>{
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.data_coins=resJSON.data.data;
      // console.log(data_coins);
  })

    }

  }
 // function for next_page pagination
 next_page(){
  // all coins api call
  if (this.page_number <=900)
  {
    this.page_number += 1
    this.http.get(this.url+'/get-all-coin?page='+this.page_number+'&per_page=10').subscribe(Response =>{
    // console.log(Response);
    let resSTR = JSON.stringify(Response);
    let resJSON = JSON.parse(resSTR);
    this.data_coins=resJSON.data.data;
    // console.log(data_coins);
})
  }
  else{
    this.http.get(this.url+'/get-all-coin?page='+this.page_number+'&per_page=10').subscribe(Response =>{
    // console.log(Response);
    let resSTR = JSON.stringify(Response);
    let resJSON = JSON.parse(resSTR);
    this.data_coins=resJSON.data.data;
    // console.log(data_coins);
})

  }

}


  // on submit index api
  onSubmit(form: NgForm) {
    // loading stop
    this.ld = 1;
    // console.warn('your request has been submitted');
    // console.log(form.value);
    // {inv_type: true, time_wind: true, : 'w'}
    let form_json = form.value;
    if (form_json.inv_type == true)
    {
      this.inv_type = "1"
    }
    else{
      this.inv_type = "0"
    }
    if (form_json.time_wind == true)
    {
      this.time_win = "1"
    }
    else{
      this.time_win = "0"
    }
    this.time_frame = form_json.exampleRadios
    let headers = new HttpHeaders();
    let params = new HttpParams()
    .set("min_cap", "500000")
    .set("max_cap", "947945765974")
    .set("inv_type", this.inv_type)
    .set("limit", "10")
    .set("time_frame", this.time_frame)
    .set("time_win", this.time_win); //Create new HttpParams
    this.http.get(this.url+'/get-best-coin', {headers: headers, params: params, responseType: 'text' }).toPromise().then(data => {
      let data_json = JSON.parse( data )
      // let CoinsData:any = [];
      // console.log(data_json)
      let coin_cap:any = [];
      let coin_name:any = [];
      for (let coin_data of data_json.data.data) {
        coin_cap.push(coin_data.market_cap)
        coin_name.push(coin_data.id)
        // CoinsData.push({name: coin_data.id,y: coin_data.market_cap_rank});
      }
      // console.log(CoinsData)
      this.pieChartData = coin_cap;
      this.pieChartLabels = coin_name;
      // console.log(this.pieChartLabels);
      // console.log(this.pieChartData);
      this.loadData = false
      // this.pieChart = {
      //   chart: {
      //       type: 'pie',
      //       backgroundColor: "#3b4148",
      //   },
      //   title: {
      //       text: "Coin MarketCaps",
      //       style: {
      //         color: '#fff',
      //       }
      //   },
      //   tooltip: {
      //       pointFormat: '{series.name}: {point.percentage:.1f}%'
      //   },
      //   accessibility: {
      //       point: {
      //           valueSuffix: '%'
      //       }
      //   },
      //   plotOptions: {
      //       pie: {
      //           allowPointSelect: true,
      //           cursor: 'pointer',
      //           dataLabels: {
      //               enabled: true,
      //               format: '{point.name}: {point.percentage:.1f} %'
      //           }
      //       }
      //   },
      //   series: [{
      //       name: 'Market Cap',
      //       colorByPoint: true,
      //       data: CoinsData
      //   }]
      // }
    });
    setTimeout(()=>{                           // <<<---using ()=> syntax
      this.ld = 0;
    }, 3000);
  }
}
