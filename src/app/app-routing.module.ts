import { ClipboardModule } from "@angular/cdk/clipboard";
import { NgModule } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LiquidityComponent } from "./components/dashboard/liquidity/liquidity.component";
import { PersonalComponent } from "./components/dashboard/personal/personal.component";
import { ReferralsComponent } from "./components/dashboard/referrals/referrals.component";
import { RefundHistoryComponent } from "./components/dashboard/refund-history/refund-history.component";
import { RewardComponent } from "./components/dashboard/reward/reward.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { HomeComponent } from "./components/home/home.component";
import { ReservationComponent } from "./components/reservation/reservation.component";
import { ReferralLinkDialogComponent } from "./components/tokeninfo/referral-link-dialog/referral-link-dialog.component";
import { TokeninfoComponent } from "./components/tokeninfo/tokeninfo.component";
import { StakingComponent } from "./components/tokenstats/staking/staking.component";
import { TokenstatsComponent } from "./components/tokenstats/tokenstats.component";
import { ConfirmDialogComponent } from "./helper/confirm-dialog/confirm-dialog.component";
import { SpinnerComponent } from "./helper/spinner/spinner.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NFTComponent } from "./components/nft/nft.component";
import { TokenMetrixComponent } from "./components/token-metrix/token-metrix.component";
import { LaunchTimerDialogComponent } from "./components/launch-timer-dialog/launch-timer-dialog.component";
import { TokenDataComponent } from "./components/tokenstats/token-data/token-data.component";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { SellFormComponent } from "./components/sell-form/sell-form.component";
import { MergepopupComponent } from "./components/mergepopup/mergepopup.component";
import { RoadmapComponent } from "./components/roadmap/roadmap.component";
import { InfoComponent } from "./components/info/info.component";
import { LoginComponent } from "./components/login/login.component";
import { ComingSoonComponent } from "./components/coming-soon/coming-soon.component";
import { NftCollectionComponent } from "./components/nft-collection/nft-collection.component";
import { MyNftsComponent } from "./components/my-nfts/my-nfts.component";
import { MoonverseComponent } from "./components/moonverse/moonverse.component";
import { OwlybirdComponent } from "./components/owly-bird/owly-bird.component";
import { TrippyOwlDetailComponent } from "./components/trippy-owl-detail/trippy-owl-detail.component";
import { SentimentAnalysisComponent } from './components/sentiment-analysis/sentiment-analysis.component';
import { CoinDetailsComponent } from './components/coin-details/coin-details.component';
import { CoinSummaryComponent } from './components/coin-details/coin-summary/coin-summary.component';
import { CoinMarketComponent } from './components/coin-details/coin-market/coin-market.component';
import { CoinPredictionComponent } from './components/coin-details/coin-prediction/coin-prediction.component';
import { CoinTweetsComponent } from './components/coin-details/coin-tweets/coin-tweets.component';
import { CoinTechnicalAnalysisComponent } from './components/coin-details/coin-technical-analysis/coin-technical-analysis.component';
import { CoinCorelationComponent } from './components/coin-details/coin-corelation/coin-corelation.component';
import { GoogleTrendsComponent } from './components/coin-details/google-trends/google-trends.component'
import { AdminpanelComponent } from "./components/adminpanel/adminpanel.component";
import { OwlStoryComponent } from "./components/owl-story/owl-story.component";

const material = [MatTabsModule, ClipboardModule, MatTooltipModule];
const routes: Routes = [
  //{ path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "reservation", component: ReservationComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    children: [
      { path: "", redirectTo: "personal", pathMatch: "full" },
      { path: "personal", component: PersonalComponent },
      { path: "liquidity", component: LiquidityComponent },
      { path: "referrals", component: ReferralsComponent },
      { path: "refundhistory", component: RefundHistoryComponent },
      { path: "reward", component: RewardComponent },
    ],
  },
  {
    path: 'coin-details', component: CoinDetailsComponent, children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      { path: 'summary', component: CoinSummaryComponent },
      { path: 'market', component: CoinMarketComponent },
      { path: 'prediction', component: CoinPredictionComponent },
      { path: 'google-trend', component: GoogleTrendsComponent },
      { path: 'tweets', component: CoinTweetsComponent },
      { path: 'technical-analysis', component: CoinTechnicalAnalysisComponent },
      { path: 'correlation', component: CoinCorelationComponent }
    ]
  },
  {
    path: "tokenstats",
    component: TokenstatsComponent,
    children: [
      { path: "", redirectTo: "tokendata", pathMatch: "full" },
      { path: "tokendata", component: TokenDataComponent },
      { path: "staking", component: StakingComponent },
    ],
  },
  { path: 'sentiment-analysis', component: SentimentAnalysisComponent },
  { path: "tokeninfo", component: TokeninfoComponent },
  { path: "nft", component: NFTComponent },
  { path: "AI", component: TokenMetrixComponent },
  { path: "vaultz", component: TokenMetrixComponent },
  { path: "landing", component: LandingPageComponent },
  { path: "form", component: SellFormComponent },
  { path: "merge", component: MergepopupComponent },
  { path: "roadmap", component: RoadmapComponent },
  { path: "info", component: InfoComponent },
  { path: "login", component: LoginComponent },
  { path: "comingsoon", component: ComingSoonComponent },
  { path: "nft-collection", component: NftCollectionComponent },
  { path: "my-nfts", component: MyNftsComponent },
  { path: "moonverse", component: MoonverseComponent },
  { path: "owly-bird", component: OwlybirdComponent },
  { path: "trippy-owl-listing", component: TrippyOwlDetailComponent },
  { path: "adminpanel", component: AdminpanelComponent },
  { path: "owl-story", component: OwlStoryComponent },
  { path: "**", redirectTo: "dashboard", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash : true})],
  exports: [RouterModule, material],
})
export class AppRoutingModule {}
export const routingmod = [
  HomeComponent,
  DialogComponent,
  StakingComponent,
  ReservationComponent,
  DashboardComponent,
  LiquidityComponent,
  PersonalComponent,
  ReferralsComponent,
  RefundHistoryComponent,
  TokenstatsComponent,
  TokeninfoComponent,
  RewardComponent,
  SpinnerComponent,
  ConfirmDialogComponent,
  ReferralLinkDialogComponent,
  LaunchTimerDialogComponent,
  NFTComponent,
  TokenMetrixComponent,
  TokenDataComponent,
  SentimentAnalysisComponent,
  CoinDetailsComponent,
  CoinSummaryComponent
];
