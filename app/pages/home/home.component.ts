import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output  } from "@angular/core";
import { HomeService } from "../../shared/home/home.service";
import {AnalyticsService} from '../../services/analytics.service';
import { parse } from "romagny13-html-parser";
import { Router, ActivatedRoute,NavigationExtras} from "@angular/router";
import * as utils from "tns-core-modules/utils/utils";
import * as TNSPhone from 'nativescript-phone';
import * as platformModule from '@nativescript/core/platform';
import { ItemEventData } from '@nativescript/core';

@Component({
    // selector: "home",
    moduleId: module.id,
    providers: [HomeService, AnalyticsService],
    templateUrl: "./home.html",
    styleUrls: ["./home.css"]
})

export class HomeComponent implements OnInit {
    nodes: Array<any>;
    private picked: string;
    private pickedId: string;
    private showAlertMessage: boolean;
    isMaintaining: boolean;
    connectivity: boolean;
    currentYear;
    dHeight = (platformModule.Screen.mainScreen.heightPixels)-100;
    logoHeight= this.dHeight/4+"px";
    dWidth = platformModule.Screen.mainScreen.widthPixels-100;
    showingLongListPicker: any = false;
    isBusy: boolean = false;

    constructor(private router: Router, private homeService: HomeService, private  _AnalyticsService: AnalyticsService) {
    }

    public ngOnInit() {
        this._AnalyticsService.initAnalytics();
        this._AnalyticsService.logScreenView("home screen loaded");
        this.isBusy = true;
        this.checkInternetConnectivity();
        console.log("Device Width"+this.dWidth);
        console.log("Device Height"+platformModule.Screen.mainScreen.heightPixels);
        this.logoHeight = (platformModule.Screen.mainScreen.heightPixels)/4+"px";
        this.currentYear = new Date().getFullYear();
        this.showAlertMessage = false;
        this.isMaintaining = false;
        this.isBusy = false;
        this.homeService.getData().subscribe((result) => {
                    this.nodes =  this.homeService.onGetDataSuccess(result);
                    this.isMaintaining = false;
                }, (error) => {
                    console.log('error occured');
                    this.homeService.onGetDataError(error)
                    this.isMaintaining = true;
                    this.showingLongListPicker = false;
            });
    }

    public submit() {
        if(this.pickedId!=null){
            const pickedItem = this.pickedId;
            this.pickedId = null;
            this.picked = null;
            let url = "/list/"+pickedItem;
            this.showAlertMessage = false;
            console.log(encodeURI(url));
            this.router.navigateByUrl(encodeURI(url));
        }else{
            this.showAlertMessage = true;
        }
    }

    public getHelpviaMail(){
        this._AnalyticsService.logEvent('getHelpviaMail','clicked');
        const url: string = "mailto:trials@cancer.ufl.edu?Subject=Clinical%20Trial%20NaviGATOR%20Message&Body=Please%20Do%20Not%20Include%20PHI%20in%20E-mail%20Correspondence";
        utils.openUrl(url);
    }

    public getHelpviaPhone(){
        this._AnalyticsService.logEvent('getHelpviaPhone','clicked');
        const platformModule = require("tns-core-modules/platform");
        if (platformModule.isAndroid) {
            const url: string = "tel:"+"+1-352-273-8675";
            console.log(url+"URL is valid: ");
            utils.openUrl(url);
        } else if (platformModule.isIOS) {
            TNSPhone.dial('1-352-273-8675', false);
        }

    }

    public checkInternetConnectivity(){
        const connectivityModule = require("tns-core-modules/connectivity");
        const connectionType = connectivityModule.getConnectionType();

        switch (connectionType) {
            case connectivityModule.connectionType.none:
                // Denotes no Internet connection.
                console.log("No connection");
                this.connectivity = false;
                break;
            case connectivityModule.connectionType.wifi:
                // Denotes a WiFi connection.
                console.log("WiFi connection");
                this.connectivity = true;
                break;
            case connectivityModule.connectionType.mobile:
                // Denotes a mobile connection, i.e. cellular network or WAN.
                console.log("Mobile connection");
                this.connectivity = true;
                break;
            default:
                this.connectivity = true;
                break;
        }
    }

    public showDiseaseSite(){
        this._AnalyticsService.logEvent('DiseaseSite','clicked');
        this.isBusy = true;
        if(this.nodes == null){
          this.homeService.getData().subscribe((result) => {
                      this.nodes =  this.homeService.onGetDataSuccess(result);
                      this.isMaintaining = false;
                      // if(!(this.nodes.length > 0)){
                      //     this.connectivity = false;
                      // }
                      this.showingLongListPicker = true;
                  }, (error) => {
                      console.log('error occured');
                      this.homeService.onGetDataError(error)
                      this.isMaintaining = true;
                      this.showingLongListPicker = false;
              });
        }else{
          this.showingLongListPicker = true;
        }
        this.isBusy = false;
    }

    public selectDiseaseSite(args: ItemEventData){
        this.pickedId = this.nodes[args.index].value;
        this.picked = this.nodes[args.index].title;
        this.showingLongListPicker = false;
        this._AnalyticsService.logEvent(this.picked,'selected');
        let url = "/list/"+this.pickedId;
        console.log(encodeURI(url));
        this.router.navigateByUrl(encodeURI(url));
    }


    public closeLongListPicker(){
        this.showingLongListPicker = false;
    }
}
