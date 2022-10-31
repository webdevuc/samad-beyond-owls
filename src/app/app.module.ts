import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WavesModule } from "angular-bootstrap-md";
import { ChartsModule } from "ng2-charts";
import { Ng2PageScrollModule } from "ng2-page-scroll";
import { CountdownModule } from "ngx-countdown";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule, routingmod } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AccountNoPipe } from "./pipes/account-no.pipe";
import { ClipboardModule } from "ngx-clipboard";
import { LandingPageComponent } from "./components/landing-page/landing-page.component";
import { SellFormComponent } from "./components/sell-form/sell-form.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { MergepopupComponent } from "./components/mergepopup/mergepopup.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { NFTsAPIServices } from "./services/nft.service";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { RoadmapComponent } from './components/roadmap/roadmap.component';
import { InfoComponent } from './components/info/info.component';
import { LoginComponent } from './components/login/login.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { NftCollectionComponent } from './components/nft-collection/nft-collection.component';
import { MyNftsComponent } from './components/my-nfts/my-nfts.component';
import { MoonverseComponent } from './components/moonverse/moonverse.component';
import { OwlybirdComponent } from './components/owly-bird/owly-bird.component';
import { MataMaskButtonComponent } from './shared/mata-mask-button/mata-mask-button.component';
import { TrippyOwlDetailComponent } from './components/trippy-owl-detail/trippy-owl-detail.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { SentimentAnalysisComponent } from './components/sentiment-analysis/sentiment-analysis.component';
import { CoinDetailsComponent } from './components/coin-details/coin-details.component';
import { CoinSummaryComponent } from './components/coin-details/coin-summary/coin-summary.component';
import { HighchartsChartModule } from "highcharts-angular";
import { CoinMarketComponent } from './components/coin-details/coin-market/coin-market.component';
import { CoinPredictionComponent } from './components/coin-details/coin-prediction/coin-prediction.component';
import { CoinTweetsComponent } from './components/coin-details/coin-tweets/coin-tweets.component';
import { CoinTechnicalAnalysisComponent } from './components/coin-details/coin-technical-analysis/coin-technical-analysis.component';
import { CoinCorelationComponent } from './components/coin-details/coin-corelation/coin-corelation.component';
import { MyLoaderComponent } from './components/my-loader/my-loader.component';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { GoogleTrendsComponent } from './components/coin-details/google-trends/google-trends.component';
import { AdminpanelComponent } from './components/adminpanel/adminpanel.component';
import { ConnectWalletDialogComponent } from './components/connect-wallet-dialog/connect-wallet-dialog.component';
import {MatListModule} from "@angular/material/list";
import { OwlStoryComponent } from './components/owl-story/owl-story.component';
//import { LazyLoadImageModule } from 'ng-lazyload-image'; 

@NgModule({
  declarations: [
    AppComponent,
    AccountNoPipe,
    routingmod,
    LandingPageComponent,
    SellFormComponent,
    MergepopupComponent,
    RoadmapComponent,
    InfoComponent,
    LoginComponent,
    ComingSoonComponent,
    NftCollectionComponent,
    MyNftsComponent,
    MoonverseComponent,
    OwlybirdComponent,
    MataMaskButtonComponent,
    TrippyOwlDetailComponent,
    SentimentAnalysisComponent,
    CoinDetailsComponent,
    CoinSummaryComponent,
    CoinMarketComponent,
    CoinPredictionComponent,
    CoinTweetsComponent,
    CoinTechnicalAnalysisComponent,
    CoinCorelationComponent,
    MyLoaderComponent,
    GoogleTrendsComponent,
    AdminpanelComponent,
    ConnectWalletDialogComponent,
    OwlStoryComponent,
  ],
  imports: [
    FormsModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    CountdownModule,
    MatMenuModule,
    WavesModule,
    ChartsModule,
    MatButtonModule,
    Ng2PageScrollModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSelectModule,
    ToastrModule.forRoot({ positionClass: "toast-top-center" }),
    MatProgressSpinnerModule,
    ClipboardModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule,
    HighchartsChartModule,
    CountdownModule,
    //LazyLoadImageModule
  ],
  providers: [
    NFTsAPIServices, LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
