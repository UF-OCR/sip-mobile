import { Component, OnInit ,NgModule} from "@angular/core";
import { ProtocolService } from "../../shared/protocol/protocol.service";
import { Protocol } from "../../shared/protocol/protocol.model";
import { ClinicalTrial } from "../../shared/protocol/clinicalTrial.model";
import { Router, ActivatedRoute,NavigationEnd} from "@angular/router";
import { Page, ScrollEventData, ScrollView } from '@nativescript/core';
import * as utils from "@nativescript/core/utils/utils";
import * as TNSPhone from 'nativescript-phone';
import * as platformModule from '@nativescript/core/platform';

@Component({
    selector: "protocol",
    providers: [ProtocolService],
    moduleId: module.id,
    templateUrl: "./protocol.html",
    styleUrls: ["./protocol.css"]
})
export class ProtocolComponent implements OnInit{
    protocolObj = new Protocol();
    private clinicalTrialObj = new ClinicalTrial();
    private showScroll: boolean;
    private page;
    private protocolScroller;
    private observable = require("@nativescript/core/data/observable");
    private pageData = new this.observable.Observable();
    private screenHeight = (platformModule.Screen.mainScreen.heightPixels)-100;
    private screenHeightDIP = (platformModule.Screen.mainScreen.heightDIPs)-100;
    isBusy = false;

    constructor(private protocolService: ProtocolService,private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    public goToClinicalTrials(nctId){
        console.log("NctId"+nctId);
        const url: string = "http://www.clinicaltrials.gov/ct2/show/"+nctId;
        const value:boolean = utils.isDataURI(url);
        console.log("URL is valid: "+value);
        utils.openUrl(url);
    }

    public ngOnInit() {
        this.isBusy = true;
        this.showScroll = false;
        this.protocolService.getData()
            .subscribe((result) => {
                this.protocolObj =this.protocolService.onGetDataSuccess(result);
                if(this.protocolObj.nctId!='undefined' && this.protocolObj.nctId!=null){
                    this.protocolService.getClinicalTrialData().subscribe((result) => {
                        this.clinicalTrialObj = this.protocolService.onGetClinicalDataSuccess(result);
                        this.isBusy = false;
                    }, (error) => {
                        this.protocolService.onGetClinicalDataError(error)});
                }else{
                this.isBusy = false;
              }
            }, (error) => {
                this.protocolService.onGetDataError(error)});
    }

    public mailTo(piEmail){
        console.log("piEmail"+piEmail+"?Subject=Clinical%20Trial%20NaviGATOR%20inquiry%20–%20Protocol%20"+this.protocolObj.protocolNo);
        const url: string = "mailto:"+piEmail+"?Subject=Clinical%20Trial%20NaviGATOR%20inquiry%20Protocol%20"+this.protocolObj.protocolNo;
        console.log(url+"URL is valid: ");
        utils.openUrl(url);
    }

    public call(piPhone) {
        let piPhoneFormat = piPhone.replace(" ext. ",",");
        piPhoneFormat = piPhoneFormat.replace(" ","");
        piPhoneFormat = piPhoneFormat.substring(0,2)+"-"+piPhoneFormat.substring(2,piPhoneFormat.length);
         const platformModule = require("@nativescript/core/platform");
         if (platformModule.isAndroid) {
             let piPhoneFormatTemp = piPhoneFormat.replace(/-/g,"");
             piPhoneFormatTemp = piPhoneFormatTemp.replace("+","");
             console.log("Pi phone no:"+piPhoneFormatTemp);
             const url: string = "tel:"+piPhoneFormatTemp;
             utils.openUrl(url);
         } else if (platformModule.isIOS) {
             TNSPhone.dial(piPhoneFormat, false);
         }
    }

    public onScroll(args: ScrollEventData) {
        this.showScroll = false;
        this.page = <Page>args.object;
        this.protocolScroller = <ScrollView>this.page.getViewById("protocolScroller");
        let scrollY = args.scrollY;
        if((this.screenHeightDIP/100) < scrollY){
            this.showScroll = true;
        }
    }

    public scrollToTop(){
        console.log("tapped event");
        if(this.showScroll) {
            this.protocolScroller.scrollToVerticalOffset(0, true);
        }
        this.pageData.set("showScroll", false);
    }
}
