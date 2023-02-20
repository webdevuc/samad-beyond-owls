import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Highcharts from "highcharts/highstock";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import StockTools from "highcharts/modules/stock-tools.js";

declare var require: any;
const wordCloud = require('highcharts/modules/wordcloud.js');
wordCloud(Highcharts);

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
StockTools(Highcharts);

@Component({
  selector: 'app-coin-summary',
  templateUrl: './coin-summary.component.html',
  styleUrls: ['./coin-summary.component.scss']
})
export class CoinSummaryComponent implements OnInit {

  NewsData: any = ''
  Indexes: any = []
  WordCloud: any = ''
  coins_list_api: any = []
  currentProduct: string = 'bitcoin'

  highcharts = Highcharts;
  public wordCloud: any = {
    chart: {
      backgroundColor: "#2d3339",
    },
    title: {
      text: '',
      style: {
        color: '#fff',
      }
    },
    series: [{
      type: 'wordcloud',
      data: [],
      name: 'Occurrences'
    }],
  };

  public coinHistory: any = {
    chart: {
      backgroundColor: "#2d3339",
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
        states: {
          select: {
            color: 'black',
          }
        }
      },
      labelStyle: {
        color: 'white',
        fontWeight: 'bold',
      },
    },
    title: {
      text: "Coin Price and MovingAvg",
      style: {
        color: '#fff',
      }
    },
    yAxis: {
      title: {
        text: 'Price & Moving Avg'
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
        name: "Price",
        data: [],
        color: '#ED561B',

      },
      {
        type: "line",
        name: "MovingAvg",
        data: [],
        color: '#DDDF00',
      }
    ]
  }

  public coinTrends: any = {
    chart: {
      backgroundColor: "#2d3339",
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
          // disabled: { ... }
        }
      },
      inputStyle: {
        color: 'white',
        fontWeight: 'bold',
        states: {
          select: {
            color: 'black',
          }
        }
      },
      labelStyle: {
        color: 'white',
        fontWeight: 'bold',
      },
    },
    title: {
      text: "Coin Seasonal and Trends",
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "Trends",

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
          text: "Seasonal"
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
        name: "Trends",
        data: [],
        color: '#24CBE5',

      },

      {
        type: "column",
        name: "Seasonal",
        data: [],
        yAxis: 1,
        color: '#50B432',
        zonesAxis: 'y',
        zones: [{
          value: 0.5,
          color: 'red',
        }, {
          value: 1,
          color: 'yellow',
        }]
      }
    ]
  }

  getWordCloudNews(coinName: any) {
    const headers = new HttpHeaders;
    const body = { coin_name: coinName };
    this.http.post<any>('https://grisemetamoonverse.io/get-google-news', body, { headers }).subscribe(data => {
      let details = data;
      if (details.code === 200 && details.data.news_link.length !== 0) {
        this.NewsData = details.data

        let i: number = 0
        let j: any = []
        details.data.news_link.forEach((news: any) => {
          j.push(i)
          i = i + 1;
        });
        this.Indexes = j

        if (details.data.scraping_error_message === "success - 200") {
          var bigcoin = false;
          var Wordlist = details.data.word_cloud_data
          Object.values(Wordlist).map((v: any) => {
            if (v > 50) {
              bigcoin = true
            }
            return null;
          })
          let list: any = [];
          i = 0;
          Object.entries(Wordlist).map((item: any) => {
            if (i < 100) {
              if (bigcoin) {
                if (item[1] < 20) {
                  list.push({ name: item[0], weight: item[1] + 20 })
                } else {
                  list.push({ name: item[0], weight: item[1] })
                }
              } else {
                if (item[1] < 20) {
                  list.push({ name: item[0], weight: item[1] + 10 })
                } else {
                  list.push({ name: item[0], weight: item[1] })
                }
              }
              i = i + 1;
            }
            return null;
          })
          this.WordCloud = list
          this.wordCloud = {
            chart: {
              backgroundColor: "#3b4148",
            },
            title: {
              text: '',
              style: {
                color: '#fff',
              }
            },
            series: [{
              type: 'wordcloud',
              name: 'Occurrences',
              data: this.WordCloud
            }],
          };
        }
      }
      this.cdr.detectChanges();
    });
  }

  getCoinTrends(coinName: any) {
    let headers = new HttpHeaders();
    let params = new HttpParams()
      .set("coin", coinName)
    this.http.get(`https://grisemetamoonverse.io/get-summary-page?coin=${coinName}&days=365`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      let Price: any = []
      let MovingAvg: any = []
      for (let i = 0; i < details.data.data.length; i++) {
        Price.push([details.data.data[i][0], details.data.data[i][1]])
        if (details.data.data[i][2] === "") {
          MovingAvg.push([details.data.data[i][0], 0])
        } else {
          MovingAvg.push([details.data.data[i][0], details.data.data[i][2]])
        }
      }
      this.coinHistory = {
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
            states: {
              select: {
                color: 'black',
              }
            }
          },
          labelStyle: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
        title: {
          text: "Coin Price and MovingAvg",
          style: {
            color: '#fff',
          }
        },
        yAxis: {
          title: {
            text: 'Price & Moving Avg',
            style: {
              color: '#fff',
            }
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
            name: "Price",
            data: Price,
            color: '#ED561B',
          },
          {
            type: "line",
            name: "MovingAvg",
            data: MovingAvg,
            color: '#DDDF00',
          }
        ]
      }

      let Trends: any = []
      let Seasonal: any = []
      for (let i = 0; i < details.data.trends.datetime.length; i++) {
        Trends.push([details.data.trends.datetime[i] / 1000000, details.data.trends.trend[i]])
        Seasonal.push([details.data.trends.datetime[i] / 1000000, details.data.trends.seasonal[i]])
      }

      this.coinTrends = {
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
              // disabled: { ... }
            }
          },
          inputStyle: {
            color: 'white',
            fontWeight: 'bold',
            states: {
              select: {
                color: 'black',
              }
            }
          },
          labelStyle: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
        title: {
          text: "Coin Seasonal and Trends",
          style: {
            color: '#fff',
          }
        },
        yAxis: [
          {
            labels: {
              align: "right",
              x: -3,
            },
            title: {
              text: "Trends",

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
              text: "Seasonal"
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
            name: "Trends",
            data: Trends,
            color: '#24CBE5',

          },

          {
            type: "column",
            name: "Seasonal",
            data: Seasonal,
            yAxis: 1,
            color: '#50B432',
            zonesAxis: 'y',
            zones: [{
              value: 0.5,
              color: 'red',
            }, {
              value: 1,
              color: 'yellow',
            }]
          }
        ]
      }
      this.cdr.detectChanges();

    })
  }

  getCoinData(name: string) {
    this.getWordCloudNews(name);
    this.getCoinTrends(name);
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getCoinData('bitcoin')
    this.http.get('https://grisemetamoonverse.io/get-coin-name').subscribe(Response => {
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.coins_list_api = resJSON.data.data;
      this.cdr.detectChanges();
    })
  }

}
