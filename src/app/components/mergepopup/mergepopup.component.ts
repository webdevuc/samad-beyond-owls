import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mergepopup",
  templateUrl: "./mergepopup.component.html",
  styleUrls: ["./mergepopup.component.scss"],
})
export class MergepopupComponent implements OnInit {
  constructor() {}
  showNext = false;
  firstMerge = true;
  secondMerge = false;
  threeMerge = false;
  fourMerge = false;
  firstBoxMerge = true;
  secondBoxMerge = false;
  resultBoxMerge = false;
  userTab = "Common Merge";
  tabData = [
    {
      src: "assets/rare/r1.png",
      text: "Sample text here Sample text here Sample text here",
    },
    {
      src: "assets/rare/r2.png",
      text: "Sample text here Sample text here Sample text here",
    },
    {
      src: "assets/rare/r3.png",
      text: "Sample text here Sample text here Sample text here",
    },
    {
      src: "assets/rare/r4.png",
      text: "Sample text here Sample text here Sample text here",
    },
    {
      src: "assets/rare/r5.png",
      text: "Sample text here Sample text here Sample text here",
    },
    {
      src: "assets/rare/r1.png",
      text: "Sample text here Sample text here Sample text here",
    },
    {
      src: "assets/rare/r2.png",
      text: "Sample text here Sample text here Sample text here",
    },
    {
      src: "assets/rare/r3.png",
      text: "Sample text here Sample text here Sample text here",
    },
  ];

  ngOnInit(): void {}

  commonMerge(name: string) {
    this.userTab = name;
    this.firstMerge = true;
    this.secondMerge = false;
    this.threeMerge = false;
    this.fourMerge = false;
  }
  mythicMerge(name: string) {
    this.userTab = name;
    this.firstMerge = false;
    this.secondMerge = true;
    this.threeMerge = false;
    this.fourMerge = false;
  }
  legendaryMerge(name: string) {
    this.userTab = name;
    this.firstMerge = false;
    this.secondMerge = false;
    this.threeMerge = true;
    this.fourMerge = false;
  }
  mythicTwoMerge(name: string) {
    this.userTab = name;
    this.firstMerge = false;
    this.secondMerge = false;
    this.threeMerge = false;
    this.fourMerge = true;
  }

  nextMerge() {
    this.firstBoxMerge = false;
    this.secondBoxMerge = true;
    this.resultBoxMerge = false;
  }
  submitmerge() {
    this.firstBoxMerge = false;
    this.secondBoxMerge = false;
    this.resultBoxMerge = true;
  }
}
