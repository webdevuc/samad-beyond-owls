import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor() { }

  public getClaimEggs() {
    return [
      { imgPath: 'assets/dragon_egg_4.gif', cliamDate: 'Dec 13th 2022', bg:'success' },
      { imgPath: 'assets/dragon egg-blue.gif', cliamDate: 'Dec 13th 2022', bg:'orange' },
      { imgPath: 'assets/dragon egg-orange.gif', cliamDate: 'Dec 13th 2022', bg:'primary' },
    ]
  }
}
