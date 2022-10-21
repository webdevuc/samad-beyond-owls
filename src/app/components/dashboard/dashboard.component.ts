import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  marketCapValue: number;
  totalGriseSupply: any;
  priceData: any;
  griseTokenContractService: any;
  graphDataService: any;
  constructor() {
  }

  ngOnInit() {
  }
  getTokenData() {
    this.griseTokenContractService.getTotalSupply().then((totalSupply: any) => {
      this.totalGriseSupply = totalSupply;
      this.calcMarketCap();
    });
    this.graphDataService.getTableData().subscribe((priceData: any) => {
      this.priceData = priceData;
      this.calcMarketCap();
    });
  }

  calcMarketCap() {
    this.marketCapValue = this.totalGriseSupply * this.priceData?.priceUSD;
  }
}
