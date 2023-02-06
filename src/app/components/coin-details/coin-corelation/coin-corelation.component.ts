import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
  selector: 'app-coin-corelation',
  templateUrl: './coin-corelation.component.html',
  styleUrls: ['./coin-corelation.component.scss']
})
export class CoinCorelationComponent implements OnInit {
  highcharts = Highcharts;
  Coins:any = []
  CoinDetails:any = {}
  CorrelateCoinDetails:any = {}
  PValue:any = 0
  CorrelationValue:any = 0
  Coin:string = "dogecoin"
  CorrelateCoin:string = "bitcoin"
  CorrelationGraph:any = {
    chart: {
      backgroundColor: "#3b4148",
    },
    rangeSelector: {
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
    }
    },
    title: {
      text: "Correlation Graph",
    },
    yAxis: [
        {
          labels: {
            align: "right",
            x: -3,
          },
          title: {
            text: `Price`,
            
          },
          height: "60%",
          resize: {
            enabled: true
          },
        },
        {
          labels: {
            align: "right",
            x: -3
          },
          title: {
            text: `Price`,
          },
          top: "65%",
          height: "35%",
          offset: 0,
        }
      ],
      tooltip: {
        split: true,
      },
    series: [
    
    {
        type: "line",
        name: `Price`,
        data: [],
        color: '#DDDF00',
    },
    {
        type: "line",
        name: `Price`,
        yAxis: 1,
        data: [],
        color: '#ff0000'
    },]
  }

  getCoins(){
    this.http.get('https://grisemetamoonverse.io/get-coin-name').subscribe(Response => {
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      if(resJSON.code == 200){
        this.Coins = resJSON.data.data
      }
    })
  }

  getCoinCorrelation(coinName:any, correlateCoin:any){
    let headers = new HttpHeaders();
    let params = new HttpParams()
    this.http.get(`https://grisemetamoonverse.io/get-statitistical-data?coin=${coinName}&corr-with=${correlateCoin}`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      if(details.p_value <= 0.001){
        this.PValue = 0.001
      }else{
        this.PValue = details.p_value
      }
      this.CorrelationValue = details.correlation.toFixed(3)
      this.CoinDetails = details.query_detail
      this.CorrelateCoinDetails = details.corr_with_detail
      this.CorrelationGraph = {
        chart: {
          backgroundColor: "#3b4148",
        },
        title: {
          text: "Correlation Graph",
          style: {
            color: '#fff'
          }
        },
        legend: {
          itemStyle: {
              color: '#fff',
          },
          itemHoverStyle: {
            color: '#fff',
          }
        },
        yAxis: [
            {
              labels: {
                align: "right",
                x: -3,
                style: {
                  color: 'white'
                }
              },
              title: {
                text: `${coinName} Price`,
                style: {
                  color: 'white'
                }
              },
              height: "60%",
              resize: {
                enabled: true
              },
            },
            {
              labels: {
                align: "right",
                x: -3,
                style: {
                  color: 'white'
                }
              },
              title: {
                text: `${correlateCoin} Price`,
                style: {
                  color: 'white'
                }
              },
              top: "65%",
              height: "35%",
              offset: 0,
            }
          ],
          tooltip: {
            split: true,
          },
        series: [
        {
            type: "line",
            name: `${coinName} Price`,
            data: details.query,
            color: '#DDDF00',
        },
        {
            type: "line",
            name: `${correlateCoin} Price`,
            yAxis: 1,
            data: details.corr_with,
            color: '#ff0000'
        },
      ]
    }
  })
}

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCoinCorrelation(this.Coin,this.CorrelateCoin)
    this.getCoins()
  }

}
