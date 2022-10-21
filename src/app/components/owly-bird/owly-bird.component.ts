import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-owly-bird',
  templateUrl: './owly-bird.component.html',
  styleUrls: ['./owly-bird.component.scss']
})
export class OwlybirdComponent implements OnInit {
  
  constructor() { }
  hideleftside :boolean= true;
  zeroWidth : boolean = false;
  hideArrow : boolean = false;
  ngOnInit(): void {
  }
  hideSideBar(){
    this.hideleftside = !this.hideleftside;
    this.zeroWidth = !this.zeroWidth;
    this.hideArrow = !this.hideArrow;
  }

}
