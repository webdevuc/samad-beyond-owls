import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NFTsAPIServices } from "../../services/nft.service";
import { ToastrService } from 'ngx-toastr';
import { environment as env } from '../../../environments/environment';

const INCREAMENT = 12;

@Component({
  selector: 'app-trippy-owl-detail',
  templateUrl: './trippy-owl-detail.component.html',
  styleUrls: ['./trippy-owl-detail.component.scss']

})
export class TrippyOwlDetailComponent implements OnInit {
  SERVER_URL = env.SERVER_URL;

  p: number = 1;
  lists: any = [];
  allRecords: any = [];
  empty = false;

  spinnerloader = true;
  hideassets = false;
  loadMoreBtn = false;

  //lists: any = [];
  constructor(
    private readonly APIServices: NFTsAPIServices,
    private readonly router: Router,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    const resp: any = await new Promise(async (resolve, reject) => {
      const data = await this.APIServices.trippyOwlList();
      resolve(data)
    });
    if (resp.data && resp.data.length) {
      this.allRecords = resp.data;
      this.lists = resp.data.slice(0, INCREAMENT)
      this.empty = false;
      this.spinnerloader = false;
    }
    setTimeout(() => {
      this.hideassets = true;
    }, 1000);

  }

  loadMore() {
    this.loadMoreBtn = true;

    //console.log("======== HI ==========")
    const currentList = this.lists.length;

    //console.log("check data: ",currentList, this.lists, this.allRecords.slice(currentList, currentList + 3), this.allRecords)
    this.lists.push(...this.allRecords.slice(currentList, currentList + INCREAMENT))
    //console.log("Lists: ", this.lists);

    setTimeout(() => {
      this.loadMoreBtn = false;
    }, 5000);
  }


}
