import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {parse} from "romagny13-html-parser";
import {Config} from '../config';
import { map } from "rxjs/operators";

@Injectable()
export class HomeService {
    private nodes = new Array<any>();
    private serverUrl = Config.flowChartUrl;

    constructor(private http: HttpClient) {}

    public extractData(): any[] {
        return this.nodes;
    }

    public onGetDataSuccess(res): any[]{
        let html = res.toLocaleString();
        let nodes = parse(html);
        let tableContent = nodes[0].children[1].children[1].children;
        for (let entry of tableContent) {
            let tableContentChildren = entry.children[0].children;
            for (let entry of tableContentChildren) {
                let infos = entry.infos; // 1, "string", false
                let anchorString = html.substring(infos.index, infos.end);
                anchorString = anchorString.replace('<a name="flowchart-link" href="javascript:getChart(document.frm_get_flowchart,', '');
                anchorString = anchorString.replace('</a>', '');
                anchorString = anchorString.replace(')">', '');
                anchorString = anchorString.replace("'", '');
                let flowChart = anchorString.split("'");
                if (flowChart.length == 2) {
                    this.nodes.push({
                        'value': flowChart[0],
                        'title': flowChart[1],
                    });
                }
            }
        }
        console.log("Updated list:" + this.nodes.length);
        return this.nodes;
    }

    public onGetDataError(error: Response | any) {
        const body = error.toLocaleString() || "";
        const err = body.error || body;
        console.log("onGetDataError: " + err);
    }

    public getNode(value: number): any {
        return this.nodes.filter(item => item.value === value)[0];
    }

    public getData() {
        let headers = this.createRequestHeader();

        return this.http.get(this.serverUrl, {responseType: 'text' ,headers: headers})
            .pipe(map(res => res));
    }

    private createRequestHeader() {
        let headers = new HttpHeaders({"Content-Type": "text/html"});
        return headers;
    }

}
