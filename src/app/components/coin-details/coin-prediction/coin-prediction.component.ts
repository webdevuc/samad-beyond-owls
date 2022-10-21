import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label, SingleDataSet, Color } from 'ng2-charts';
import {formatDate} from '@angular/common';
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

@Component({
  selector: 'app-coin-prediction',
  templateUrl: './coin-prediction.component.html',
  styleUrls: ['./coin-prediction.component.scss']
})
export class CoinPredictionComponent implements OnInit {

  highcharts = Highcharts;
  coins_list_api:any = []
  currentProduct:string = 'bitcoin'
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: any[] = [];
  lineChartColors: Color[] = [];
  lineChartLegend = true;
  lineChartPlugins = [];
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

  // GraphData:any = {
  //   chart: {
  //     backgroundColor: "#3b4148",
  //   },
  //   rangeSelector: {
  //     chart: {
  //       backgroundColor: "#3b4148",
  //     },
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
  //   },
  //     selected: 1
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
  //       data: [],
  //       color: '#DDDF00',
  //     },
      
  //     {
  //       type: "line",
  //       name: "Predicted Price",
  //       data: [],
  //       color: '#ff0000'
  //     }
  //   ]
  // }

  getCoinPrediction(coinName:any){
    let headers = new HttpHeaders();
    let params = new HttpParams().set("coin", coinName)
    this.http.get(`https://etherkat.com/get-coin-predict`, {
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
        this.lineChartData = [{data:price, label:`${coinName} Predicted Price`}];
        this.lineChartLabels = time_stamp;

        // let PastPrice:any = []
        // let PredictedPrice:any = []
        // if(details.data.data[0]){
        //   const Past = details.data.data[0].data.timeseries
        //   const Future = details.data.data[0].data.predicted
        //   for (let i = 0; i < Past.length; i++) {
        //     PastPrice.push([Past[i].ds,Past[i].y])
        //   }
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
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCoinPrediction("bitcoin")
    this.http.get('https://etherkat.com/get-coin-name').subscribe(Response => {
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.coins_list_api = resJSON.data.data;

      // console.log(this.coins_list_api);
    })
  }

}
