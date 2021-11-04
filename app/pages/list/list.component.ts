import { Component, OnInit } from "@angular/core";
import { ListService } from "../../shared/list/list.service";
import * as platformModule from '@nativescript/core/platform';
import { Router, ActivatedRoute,NavigationExtras} from "@angular/router";

@Component({
    selector: "list",
    providers: [ListService],
    moduleId: module.id,
    templateUrl: "./list.html",
    styleUrls: ["./list.css"]
})
export class ListComponent implements OnInit {
    chartName: string;
    private chartId: string;
    private pickedId: string;
    private picked: string;
    nodeList: Array<any>;
    loaded: boolean;
    protocolList: Array<any>;
    dHeight = (platformModule.Screen.mainScreen.heightPixels)-100;
    isBusy=false;

    constructor(public listService: ListService,private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.nodeList = ["Loading"];
    }

    public ngOnInit() {
        this.loaded=false;
        this.isBusy = true;
        this.chartId = this.listService.getChartId();
        this.nodeList = this.listService.extractData();
        this.protocolList = this.listService.extractProtocol();
        this.listService.getData(this.chartId)
            .subscribe((result) => {
                this.chartName = this.listService.onGetDataName(result);
                this.loaded=true;
                this.isBusy = false;
            }, (error) => {
                this.listService.onGetDataError(error);
            });

    }

    public onItemTap(args) {
        this.picked = this.nodeList[args.index].content;
        this.picked = encodeURI(this.picked.replace("/",''));
        console.log("picked"+this.picked);
        this.pickedId = this.nodeList[args.index].id;
        let presenturl = this.router.url;
        let url = '';
        console.log("This is your index for sublist"+presenturl.indexOf("sublist"));
        if(presenturl.indexOf("sublist1")>=0){
            url = "/sublist2/"+this.pickedId;
        }else if(presenturl.indexOf("sublist2")>=0){
            url = "/sublist3/"+this.pickedId;
        } else if(presenturl.indexOf("sublist3")>=0){
            url = "/sublist4/"+this.pickedId;
        }else if(presenturl.indexOf("sublist4")>= 0){
            url = "/sublist5/"+this.pickedId;
        }else  if(presenturl.indexOf("sublist") >= 0){
            url = "/sublist1/"+this.pickedId;
        }else{
            url = "/sublist/"+this.pickedId;
        }
        this.router.navigateByUrl(url);
    }

    public onProtocolTap(args){
        let protocolNo = this.protocolList[args.index].protocolNo;
        let url = '/protocol/'+protocolNo;
        this.router.navigateByUrl(url);
    }

}
