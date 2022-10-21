import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-moonverse',
  templateUrl: './moonverse.component.html',
  styleUrls: ['./moonverse.component.scss']
})
export class MoonverseComponent implements OnInit {
  
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
