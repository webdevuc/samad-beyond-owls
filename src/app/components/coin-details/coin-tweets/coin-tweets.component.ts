import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Highcharts from "highcharts/highstock";

declare var require: any;
const wordCloud = require('highcharts/modules/wordcloud.js');
wordCloud(Highcharts);

@Component({
  selector: 'app-coin-tweets',
  templateUrl: './coin-tweets.component.html',
  styleUrls: ['./coin-tweets.component.scss']
})
export class CoinTweetsComponent implements OnInit {

  highcharts = Highcharts;
  UsersTweets:any = []
  Indexes:any = []
  coins_list_api:any = []
  currentProduct:string = 'bitcoin'
  UsersHashtags: any = {
    chart: {
      backgroundColor: "#3b4148",
    },
    title: {
    text: '',
    style: {
        color: '#ffffff',
    }
    },
    series: [{
        type: 'wordcloud',
        data: [],
        name: 'Occurrences'
    }],
  }
  TrendingWords: any = {
    chart: {
      backgroundColor: "#3b4148",
      },
      title: {
      text: '',
      style: {
          color: '#ffffff',
      }
      },
      series: [{
          type: 'wordcloud',
          data: [],
          name: 'Occurrences'
      }],
  }


  getCoinTweets(coinName:any){
    let headers = new HttpHeaders();
    let params = new HttpParams().set("coin", coinName)
    this.http.get(`https://api.ethama.finance/get-sentiment-coin?coin=${coinName}`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      if(details.code == 200){
        var tweets:any = details.data.data.tweets;
        const hashtags:any = details.data.data.hashtags;
        const words:any = details.data.data.wordfrequency;
        tweets = tweets.sort((a:any, b:any) => (a.followers < b.followers) ? 1 : -1)
        var index:any = [];
        var i = 0;
        tweets.map((tweet:any) => { 
            index.push(i)
            i=i+1
            return null;
        })
        var list:any = [];
        var bigcoin:any = false;

        words.map((word:any) => {
            if(word[1]>50){
                bigcoin = true;
            }
            return null;
        })

        words.map((word:any) => {
            if(bigcoin){
                if(word[1]< 20){
                    list.push({name: word[0], weight: word[1]+20})
                }else{
                    list.push({name: word[0], weight: word[1]})
                }
            }else{
                if(word[1]< 20){
                    list.push({name: word[0], weight: word[1]+10})
                }else{
                    list.push({name: word[0], weight: word[1]})
                }
            }
            return null;
        })
        var hashtagsList:any = [];
        hashtags.map((tag:any) => {
            const val = Math.random() * (5 - 1) + 1
            hashtagsList.push({name: tag, weight: val});
            return null;
        })

        this.UsersTweets = tweets
        this.UsersHashtags = {
          chart: {
            backgroundColor: "#3b4148",
          },
          title: {
          text: '',
          style: {
              color: '#ffffff',
          }
          },
          series: [{
              type: 'wordcloud',
              data: hashtagsList,
              name: 'Occurrences'
          }],
        }

        this.TrendingWords = {
          chart: {
            backgroundColor: "#3b4148",
            },
            title: {
            text: '',
            style: {
                color: '#ffffff',
            }
            },
            series: [{
                type: 'wordcloud',
                data: list,
                name: 'Occurrences'
            }],
        }
        this.Indexes = index
      }
    })
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCoinTweets("bitcoin")
    this.http.get('https://api.ethama.finance/get-coin-name').subscribe(Response => {
      // console.log(Response);
      let resSTR = JSON.stringify(Response);
      let resJSON = JSON.parse(resSTR);
      this.coins_list_api = resJSON.data.data;

      // console.log(this.coins_list_api);
    })
  }

}
