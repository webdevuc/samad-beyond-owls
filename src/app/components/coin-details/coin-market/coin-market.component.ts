import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-coin-market',
  templateUrl: './coin-market.component.html',
  styleUrls: ['./coin-market.component.scss']
})
export class CoinMarketComponent implements OnInit {

  green: any = {
    "background-color": "green",
    "border-radius": "50%",
    "width": "50px",
    "height": "50px"
  }
  red: any = {
    "background-color": "red",
    "border-radius": "50%",
    "width": "50px",
    "height": "50px"
  }

  Markets: any = []
  Exchanges: any = []
  exchangeName: string = "binance"

  getCoinMarket(coinName: any) {
    let headers = new HttpHeaders();
    let params = new HttpParams().set("exchange", coinName)
    this.http.get(`https://grisemetamoonverse.io/get-detail-exchange?exchange=${coinName}`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      if (details.code == 200) {
        this.Markets = details.data.data
        this.cdr.detectChanges();
      }
    })
  }

  getExchanges() {
    let headers = new HttpHeaders();
    let params = new HttpParams()
    this.http.get(`https://grisemetamoonverse.io/get-top-exchange`, {
      headers: headers,
      params: params,
      responseType: 'text'
    }).toPromise().then(Response => {
      let details = JSON.parse(Response);
      if (details.code == 200) {
        this.Exchanges = details.data.data
        this.cdr.detectChanges();
      }
    })
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getCoinMarket("binance")
    this.getExchanges()
  }

}
