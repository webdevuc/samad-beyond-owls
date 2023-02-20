import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import * as Highcharts from "highcharts/highstock";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import StockTools from "highcharts/modules/stock-tools.js";
import map from "highcharts/modules/map";
const world = require('@highcharts/map-collection/custom/world.geo.json')

map(Highcharts);

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
StockTools(Highcharts);

@Component({
  selector: 'app-google-trends',
  templateUrl: './google-trends.component.html',
  styleUrls: ['./google-trends.component.scss']
})
export class GoogleTrendsComponent implements OnInit {

  highcharts = Highcharts;
  coins_list_api:any = []
  currentProduct:string = 'bitcoin'

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
    }
    },
    title: {
      text: "Interest Over Time",
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
        name: "Interest Over Time",
        data: [],
        color: '#DDDF00',
      }
    ]
  }

  WorldGraph:any = {
    chart: {
      map: world,
      backgroundColor: "#3b4148",
    },
    title:{
      text: '',
    },
    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },
    colorAxis: {
        min: 0
    },
    series: [
      {
        data: [],
        color: "#6226D9",
        name: ''
      }
    ]
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  getGoogleTrend(){
    const body = { 'coinName': this.currentProduct };
    this.http.post('https://grisemetamoonverse.io/get_google_trends', body).subscribe(Response => {
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      if(resJSON.code == 200){
        const IOT = resJSON.data.interest_over_time
        const IBR = resJSON.data.interest_by_region
        let InterestOverTime:any = []
        let InterestByRegion:any = []
        for (let i = 0; i < IOT.length; i++) {
          InterestOverTime.push([IOT[i].date,IOT[i].dataValue])
        }
        for (let i = 0; i < IBR.length; i++) {
          InterestByRegion.push([IBR[i].geoCode,IBR[i].dataValue])
        }
        this.GraphData = {
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
          }
          },
          title: {
            text: "Interest Over Time",
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
              name: "Interest Over Time",
              data: InterestOverTime,
              color: '#DDDF00',
            }
          ]
        }

        this.WorldGraph={
          chart: {
            map: world,
            backgroundColor: "#3b4148",
          },
          title:{
            text: '',
          },
          mapNavigation: {
              enabled: true,
              buttonOptions: {
                  verticalAlign: 'bottom'
              }
          },
          colorAxis: {
              min: 0
          },
          series: [
            {
              data: InterestByRegion,
              color: "#6226D9",
              name: resJSON.data.coinName
            }
          ]
        }
      }
      this.cdr.detectChanges();
    })
  }

  ngOnInit(): void {
    this.getGoogleTrend()
    this.http.get('https://grisemetamoonverse.io/get-coin-name').subscribe(Response => {
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.coins_list_api = resJSON.data.data;

      // console.log(this.coins_list_api);
    })
  }

}
