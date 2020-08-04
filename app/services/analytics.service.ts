import { Component } from "@angular/core";
import { Injectable } from "@angular/core";
import * as googleAnalytics from 'nativescript-google-analytics';

@Injectable()
export class AnalyticsService {
    public constructor() { }

    public initAnalytics(){
      googleAnalytics.initalize({
        trackingId: 'UA-122827872-1',
        dispatchInterval: 5,
        logging: {
                     native: true,
                     console: false
                 }
      });
    }

      public logScreenView(message){
        if(typeof googleAnalytics != undefined){
          console.log("recording message:"+ message)
          googleAnalytics.logView(message);
        }
      }

      public logEvent(cat, act){
        if(typeof googleAnalytics!=undefined) {
            googleAnalytics.logEvent({
                category: cat,
                action: act
            });
        }
      }
}
