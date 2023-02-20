import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-coin-technical-analysis',
  templateUrl: './coin-technical-analysis.component.html',
  styleUrls: ['./coin-technical-analysis.component.scss']
})
export class CoinTechnicalAnalysisComponent implements OnInit {

  highcharts = Highcharts;

  CashIn:any = 0
  CashOut:any = 0
  coins_list_api:any = []
  currentProduct:string = 'bitcoin'
  
  CashflowGraph:any = {
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
      text: `Cashflow`,
      style: {
        color: '#fff'
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
        name: `price`,
        data: [],
        color: '#DDDF00',
      },
    ]
  }

  TechnicalGraph:any = {
    chart: {
      backgroundColor: "#3b4148",
    },
    title: {
      text: `Price`,
      style: {
        color: '#fff'
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
        name: `price`,
        data: [],
        color: 'green',
        zoneAxis: 'x',
        zones: []
      },
    ]
  }

  getCoinCashflow(coinName:any){
    let headers = new HttpHeaders();
    let params = new HttpParams().set("coin", coinName)
    this.http.get(`https://grisemetamoonverse.io/get-cashflow?coin=${coinName}&days=30`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      if(details.code == 200){
        var Data:any = [];
        details.data.data.data_plot.map((data:any) => {
            Data.push([data.date,data.cashflow]);
            return null;
        })
        this.CashIn = details.data.data.cashin_percentage
        this.CashOut = details.data.data.cashout_percentage
        this.CashflowGraph = {
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
            text: `${coinName} Cashflow`,
            style: {
              color: '#fff'
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
              name: `${coinName} price`,
              data: Data,
              color: '#DDDF00',
            },
          ]
        }
      }
      this.cdr.detectChanges();
    })
  }

  getCoinTechnicalGraph(coinName:any){
    let headers = new HttpHeaders();
    let params = new HttpParams().set("coin", coinName)
    this.http.get(`https://grisemetamoonverse.io/get-tech-analysis?coin=${coinName}`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      if(details.code == 200){
        var Data:any = [];
        var zonesColor:any = [];
        details.data.data.timeseries.map((data:any) => {
          Data.push({x: data.index,y: data.price});
          return null;
        })
        
        details.data.data.down_span_data.map((points:any) => {
          zonesColor.push({value: points[0]}, {value: points[1], color: 'red'})
          return null;
        })

        this.TechnicalGraph = {
          chart: {
            backgroundColor: "#3b4148",
          },
          title: {
            text: `${coinName} Price`,
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
              name: `${coinName} price`,
              data: Data,
              color: 'green',
              zoneAxis: 'x',
              zones: zonesColor
            },
          ]
        }
      }
      this.cdr.detectChanges();
    })
  }

  getCoinData(name:string){
    this.getCoinCashflow(name);
    this.getCoinTechnicalGraph(name);
  }

  constructor(private http: HttpClient, private cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getCoinData('bitcoin')
    this.http.get('https://grisemetamoonverse.io/get-coin-name').subscribe(Response => {
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.coins_list_api = resJSON.data.data;

      // console.log(this.coins_list_api);
    })
  }

}
