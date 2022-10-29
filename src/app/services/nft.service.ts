import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

// console.log("token is: ", localStorage.getItem('token'));
// const tokenValue: any = new HttpHeaders({ authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyIjoiYWRkcl90ZXN0MXFxc21xNGt3eHR1bTBubnFwNm1uZG1nZGZuOWM1MGw1bGE3OGRoOXByczYwem56c3FnNW5qNXNtbmswNzNmYzZqeTR3dmNyanpqandseDY3enk5OWd0cmt4bG5zeGw0YTJ5IiwiaWF0IjoxNjM5MDgxNDEyLCJleHAiOjE2MzkxNjc4MTJ9.WwycHhpGT2aWBguLqnXpSTjlgOgzaDyY2s2fH1ueLqM' });
const authToken = localStorage.getItem('token')?.toString() || '';
const tokenValue: any = new HttpHeaders({ authorization: authToken });

@Injectable({
  providedIn: 'root'
})

export class NFTsAPIServices {
  baseUrlAPI = env.baseUrlAPI;

  AuthHeader: any;

  // User Info
  public userLoginData$: BehaviorSubject<any>;
  // Auth Token
  public userAuthToken$: BehaviorSubject<any>;
  // Total Nami wallet's NFTs
  public totalNamiWalletNFT$: BehaviorSubject<any>;
  // Handle Claim button loading
  public claimButtonLoading$: BehaviorSubject<any>;


  public set loginData(_value: any) {
    console.log("loginData :: =>> ", _value);
    this.userLoginData$.next(_value.data);
  }

  public get loginData$() {
    return this.userLoginData$.asObservable();
  }
  // End: User Info


  // Auth Token
  public set authToken(_value: any) {
    console.log("authToken :: =>> ", _value);
    this.userAuthToken$.next(_value.token);
  }

  public get authToken$() {
    return this.userAuthToken$.asObservable();
  }
  // End: Auth Token


  // Total Nami wallet's NFTs
  public set totalNamiAssets(_value: any) {
    console.log("totalNamiAssets :: =>> ", _value);
    this.totalNamiWalletNFT$.next(_value.data);
  }

  public get totalNamiAssets$() {
    return this.totalNamiWalletNFT$.asObservable();
  }
  // END: Total Nami wallet's NFTs

  
  // Handle Claim button loading
  public set handleClaimBtnLoading(_value: any) {
    console.log("handleClaimBtnLoading :: =>> ", _value);
    this.claimButtonLoading$.next(_value.data);
  }

  public get handleClaimBtnLoading$() {
    return this.claimButtonLoading$.asObservable();
  }
  // END: Handle Claim button loading

  constructor(private readonly http: HttpClient) {
    this.userLoginData$ = new BehaviorSubject<any>(false);
    this.userAuthToken$ = new BehaviorSubject<any>(false);
    this.totalNamiWalletNFT$ = new BehaviorSubject<any>(false);
    this.claimButtonLoading$ = new BehaviorSubject<any>(false);
    // Nothing
  }



  public async myNftsList(data) {
    const resp: any = await new Promise(async (resolve, reject) => {
      await this.userAuthToken$.subscribe(async (token) => {
        const authTokenValue: any = new HttpHeaders({ authorization: token });
        resolve(authTokenValue);
      })
    });

    return this.http.post<any>(`${this.baseUrlAPI}/get-user-nfts-list`, data, { headers: resp }).toPromise();
  }
  public async trippyOwlList() {
    return this.http.get<any>(`${this.baseUrlAPI}/trippy-owl-list`, { headers: tokenValue }).toPromise();
  }
  public async mintTrippyOwl(data: any) {
    const resp: any = await new Promise(async (resolve, reject) => {
      await this.userAuthToken$.subscribe(async (token) => {
        const authTokenValue: any = new HttpHeaders({ authorization: token });
        resolve(authTokenValue);
      })
    });

    // console.log("check data on api: ", data);
    return this.http.post<any>(`${this.baseUrlAPI}/trippy-mint`, data, { headers: resp }).toPromise();
  }
  public async verifyClaimedCollection(data: any) {
    const resp: any = await new Promise(async (resolve, reject) => {
      await this.userAuthToken$.subscribe(async (token) => {
        const authTokenValue: any = new HttpHeaders({ authorization: token });
        resolve(authTokenValue);
      })
    });

    return this.http.post<any>(`${this.baseUrlAPI}/verify-trippy`, data, { headers: resp }).toPromise();
  }

  public async getGriseBalance() {
    return this.http.get<any>(`${this.baseUrlAPI}/check-available-grise-ada`).toPromise();
  }
  public async sendGriseBalance(amount: any, walletAddress: any) {
    const resp: any = await new Promise(async (resolve, reject) => {
      await this.userAuthToken$.subscribe(async (token: any) => {
        const authTokenValue: any = new HttpHeaders({ authorization: token });
        resolve(authTokenValue);
      })
    });

    return this.http.post<any>(`${this.baseUrlAPI}/withdraw-grise-ada`, { amount, walletAddress }, { headers: resp }).toPromise();
  }

  public async nftsList(data: any) {
    return this.http.post<any>(`${this.baseUrlAPI}/nfts-list`, { data }).toPromise();
  }

  public async userRegister(data: any) {
    // console.log("check data on api: ", data);
    return this.http.post<any>(`${this.baseUrlAPI}/register-user`, data).toPromise();
  }

  public async mintNft(data: any) {
    console.log("check data on api: ", data);
    return this.http.post<any>(`${this.baseUrlAPI}/single-nft-mint`, data, { headers: tokenValue }).toPromise();
  }

  public async buyNft(data: any) {
    console.log("check data on api: ", data);
    return this.http.post<any>(`${this.baseUrlAPI}/buy-nft`, data, { headers: tokenValue }).toPromise();
  }

  public async verifyUserNft(data: any) {
    console.log("check data on verifyUserNft api: ", data);
    return this.http.post<any>(`${this.baseUrlAPI}/verify-nft`, data, { headers: tokenValue }).toPromise();
  }

  public async cancelUserNft(data: any) {
    console.log("check data on api: ", data);
    return this.http.post<any>(`${this.baseUrlAPI}/cancel-nft`, { data }, { headers: tokenValue }).toPromise();
  }

  public async setTokenPrice(data: any) {
    console.log("check data on api: ", data);
    return this.http.post<any>(`${this.baseUrlAPI}/set-nft-price`, data).toPromise();
  }

}