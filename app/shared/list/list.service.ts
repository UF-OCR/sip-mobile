import {Injectable} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {parse} from "romagny13-html-parser";
import {Router, ActivatedRoute} from "@angular/router";
import {Config} from '../config';
import { map } from "rxjs/operators";

@Injectable()
export class ListService {
    private nodes = new Array<any>();
    private protocols = new Array<any>();
    private chartId;
    private nodeName;

    constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
        this.chartId = this.activatedRoute.snapshot.params['chartId'];
        this.activatedRoute.params
            .forEach((params) => {
                this.chartId = params['chartId'];
            });
        this.getData(this.chartId)
            .subscribe((result) => {
                this.nodeName = this.onGetDataName(result);
                console.log("Node name updated" + this.nodeName);
                this.nodes = this.onGetDataSuccessNodes(result);
                this.protocols = this.onGetDataSuccessProtocols(result);
            }, (error) => {
                this.onGetDataError(error);
            });
    }

    public extractProtocol(): any[] {
        return this.protocols;
    }

    public extractData(): any[] {
        return this.nodes;
    }

    public extractChartName(): string {
        return this.nodeName;
    }

    public getChartId(): string {
        return this.chartId;
    }

    public getData(chartId) {
        let serverUrl = Config.nodeUrl + chartId.trim();
        let headers = this.createRequestHeader();
        return this.http.get(serverUrl, {responseType: 'text', headers: headers})
            .pipe(map(res => res));
    }

    private createRequestHeader() {
        let headers = new HttpHeaders();
        return headers;
    }

    public onGetDataName(res): string {
        let html = res.toLocaleString();
        let nodes = parse(html);
        let nameContent = nodes[1].children[1].children[0].children[0].innerHTML;
        nameContent = nameContent.replace(/&amp;/g, '&');
        this.nodeName = nameContent
        console.log("chartName" + this.nodeName);
        return nameContent.toString();
    }

    public onGetDataSuccessNodes(res): any[] {
        let html = res.toLocaleString();
        let nodes = parse(html);
        let tableContent = nodes[1].children;
        for (let entry of tableContent) {
            let infos = entry.infos;
            let tableContentName = html.substring(infos.index, infos.end);
            if (tableContentName.search("node-table") != -1) {
                this.parseNodes(html, entry);
            }
        }
        console.log("conpleted" + this.nodes.length);
        return this.nodes;
    }

    public onGetDataSuccessProtocols(res): any[] {
        let html = res.toLocaleString();
        let nodes = parse(html);
        let tableContent = nodes[1].children;
        for (let entry of tableContent) {
            let infos = entry.infos;
            let tableContentName = html.substring(infos.index, infos.end);
            tableContentName = tableContentName.replace(/&amp;/g, '&');
            if (tableContentName.search("protocol-table") != -1) {
                this.parseProtocols(html, entry);
            }
        }
        console.log("completed" + this.protocols.length);
        return this.protocols;
    }

    private parseNodes(html, entry) {
        let pclSize = entry.children[0].children[0].innerHTML;
        let content = entry.children[0].children[1].children[0].innerHTML;
        content = content.replace(/&amp;/g, '&');
        let anchorInfo = entry.children[0].children[1].children[0].infos;
        let anchorString = html.substring(anchorInfo.index, anchorInfo.end);
        anchorString = anchorString.replace('<a name="node-link" href="javascript:getNodeContent(document.frm_get_detail, ', '');
        anchorString = anchorString.replace('</a>', '');
        anchorString = anchorString.replace(')">', '');
        anchorString = anchorString.replace("'", ' ');
        anchorString = anchorString.replace(",", ' ');
        let anchorIDs = anchorString.split(" ");
        let anchorID = anchorIDs[1].replace("'", "");
        console.log("This is anchor: " + anchorID);
        console.log("Content " + content);
        console.log("pclSize " + pclSize);
        this.nodes.push({id: anchorID, pclSize: pclSize, content: content});
    }

    private parseProtocols(html, entry) {
        console.log(entry.children[1].children.length);
        for (let child of entry.children[1].children) {
            let protcolNo = child.children[0].children[0].children[0].children[0].children[0].innerHTML;
            let protocolStatus = child.children[0].children[0].children[0].children[1].innerHTML;
            let protcolTitle = child.children[0].children[0].children[1].children[0].innerHTML;
            protcolTitle = protcolTitle.replace("<br>", "");
            protcolTitle = protcolTitle.replace("<br>", "");
            protcolTitle = protcolTitle.replace(/&amp;/g, '&');
            console.log("Protocol Title: " + protcolTitle);
            this.protocols.push({protocolNo: protcolNo, protocolStatus: protocolStatus, protcolTitle: protcolTitle});
        }
    }

    public onGetDataError(error: Response | any) {
        const body = error.toLocaleString() || "";
        const err = body.error || body;
        console.log("onGetDataError: " + err);

    }
}
