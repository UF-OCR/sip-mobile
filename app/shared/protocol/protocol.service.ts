import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders } from "@angular/common/http";
import {parse} from "romagny13-html-parser";
import {Router, ActivatedRoute} from "@angular/router";
import {Protocol} from "../../shared/protocol/protocol.model";
import {ClinicalTrial} from "../../shared/protocol/clinicalTrial.model";
import {Config} from '../config';
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import { map } from "rxjs/operators";
import { Formatter } from "ctgov-ocr-formatter";

@Injectable({
providedIn: "root"
})

export class ProtocolService {

    public protocolObj = new Protocol();
    public clinicalTrialObj = new ClinicalTrial();
    public protocolNo: string;

    constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
        this.protocolNo = this.activatedRoute.snapshot.params['protocolNo'];
    }

    public onGetDataSuccess(res): Protocol {
        let parseString = require('nativescript-xml2js').parseString;
        let protocolObjTmp = new Protocol();
        var xml = res.toLocaleString();
        parseString(xml, function (err, result) {
            if (result['protocol_summary'] != undefined) {
                let protocolTemp = result['protocol_summary']['protocol'][0];
                protocolObjTmp.protocolNo = protocolTemp.no;
                protocolObjTmp.sponsorProtocolNo = protocolTemp.secondary_protocol_no;
                protocolObjTmp.studyTitle = protocolTemp.title;
                if (protocolTemp.PI != null && protocolTemp.PI != undefined) {
                    protocolObjTmp.principalInvestigator = protocolTemp.PI;
                }
                if (protocolTemp.objective != null && protocolTemp.objective != undefined) {
                    protocolObjTmp.objective = protocolTemp.objective;
                }
                if (protocolTemp.lay_description != null && protocolTemp.lay_description != undefined) {
                      protocolObjTmp.description = protocolTemp.lay_description;
                }
                protocolObjTmp.phase = protocolTemp.phase;
                protocolObjTmp.ageGroup = protocolTemp.age_group;
                protocolObjTmp.scope = protocolTemp.scope;
                protocolObjTmp.detailedEligibility = protocolTemp.detailed_eligibility;
                if (protocolTemp.disease_site != null && protocolTemp.disease_site != undefined) {
                    let diseaseSiteTemp = ' ' + protocolTemp.disease_site;
                    let diseaseSiteTempArr = diseaseSiteTemp.split(";");
                    protocolObjTmp.applicableDiseaseSites = '';
                    for (let diseaseSite of diseaseSiteTempArr) {
                        protocolObjTmp.applicableDiseaseSites += diseaseSite;
                        protocolObjTmp.applicableDiseaseSites += '\r\n';
                    }
                    protocolObjTmp.applicableDiseaseSites = protocolObjTmp.applicableDiseaseSites.slice(0, protocolObjTmp.applicableDiseaseSites.length-2);
                }
                if (protocolTemp.institution != null && protocolTemp.institution != undefined) {
                    let institutiontemp = ' ' + protocolTemp.institution;
                    let institutiontempArr = institutiontemp.split(";");
                    protocolObjTmp.participatingInstituition = '';
                    for (let inst of institutiontempArr) {
                        protocolObjTmp.participatingInstituition += inst;
                        protocolObjTmp.participatingInstituition += '\r\n';
                    }
                    protocolObjTmp.participatingInstituition = protocolObjTmp.participatingInstituition.slice(0, protocolObjTmp.participatingInstituition.length-2);
                }
                if (protocolTemp.treatment != null && protocolTemp.treatment != undefined) {
                    protocolObjTmp.treatment = protocolTemp.treatment;
                }
                protocolObjTmp.nctId = protocolTemp.nct_id;
                if (protocolTemp['item'] != undefined) {
                    let contactTemp = protocolTemp['item'][0];
                    protocolObjTmp.piPhone = ""+contactTemp.phone_no;
                    protocolObjTmp.piEmail = ""+contactTemp.email;
                    protocolObjTmp.piName = ""+contactTemp.item_description;
                }
            }
        });
        this.protocolObj = protocolObjTmp;
        return this.protocolObj;
    }


    public onGetDataError(error: Response | any) {
        const body = error || "";
        const err = body.error || body;
        console.log("onGetDataError: " + err);
    }

    public getData() {
        let serverUrl = Config.protocolUrl + this.protocolNo + '&format=xml';
        let headers = this.createRequestHeader();
        return this.http.get(serverUrl, {responseType: 'text', headers: headers})
            .pipe(map(res => res));
    }

    public createRequestHeader() {
        let headers = new HttpHeaders({});
        return headers;
    }

    public extractData(): Protocol {
        return this.protocolObj;
    }

    public getClinicaltrialObj(): ClinicalTrial {
        return this.clinicalTrialObj;
    }


    public onGetClinicalDataSuccess(res): ClinicalTrial {
        let iFormat = new Formatter();
        let parseString = require('nativescript-xml2js').parseString;
        let clinicalTrialObj = new ClinicalTrial();
        var xml = res;
        parseString(xml, function (err, result) {
            clinicalTrialObj.nct_id = result['clinical_study']['id_info'][0].nct_id;
            if (result['clinical_study']['brief_summary'] != undefined) {
                let objectiveStr = result['clinical_study']['brief_summary'][0].textblock[0];
                clinicalTrialObj.objective = iFormat.formatData(objectiveStr);
            }
            if (result['clinical_study']['detailed_description'] != undefined) {
                let descriptionStr = result['clinical_study']['detailed_description'][0].textblock[0];
                clinicalTrialObj.description = iFormat.formatData(descriptionStr);
            }
            if (result['clinical_study'] != undefined) {
                clinicalTrialObj.phase = result['clinical_study'].phase;
            }
            if (result['clinical_study']['eligibility'] != undefined) {
                let detailedEligibilityStr = result['clinical_study']['eligibility'][0].criteria[0].textblock[0];
                clinicalTrialObj.detailedEligibility = iFormat.formatData(detailedEligibilityStr);
                clinicalTrialObj.gender = result['clinical_study']['eligibility'][0].gender[0];
                clinicalTrialObj.minAge = result['clinical_study']['eligibility'][0].minimum_age[0];
                clinicalTrialObj.maxAge = result['clinical_study']['eligibility'][0].maximum_age[0];
            }
            if (result['clinical_study']['intervention'] != undefined) {
                clinicalTrialObj.studyArms = "";
                for (let arms in result['clinical_study']['intervention']) {
                    clinicalTrialObj.studyArms += result['clinical_study']['intervention'][arms].intervention_name + "\n";
                    clinicalTrialObj.studyArms += result['clinical_study']['intervention'][arms].description + "\n";
                    if (result['clinical_study']['intervention'][arms].arm_group_label != undefined) {
                        clinicalTrialObj.studyArms += "Arm Group:";
                        for (let armsGroup in result['clinical_study']['intervention'][arms].arm_group_label) {
                            clinicalTrialObj.studyArms += result['clinical_study']['intervention'][arms]['arm_group_label'][armsGroup] + ",";
                        }
                        clinicalTrialObj.studyArms = clinicalTrialObj.studyArms.substring(0,clinicalTrialObj.studyArms.length - 1);
                    }

                }
            }

        });
        return clinicalTrialObj;
    }

    public onGetClinicalDataError(error: Response | any) {
        const body = error|| "";
        const err = body.error || body;
        console.log("onGetDataError: " + err);
    }

    public getClinicalTrialData(){
        let ctUrl = "https://clinicaltrials.gov/ct2/show/" + this.protocolObj.nctId + "?displayxml=true";
        let headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml');
        console.log("Making a request"+ctUrl)
        return this.http.get(ctUrl, {observe: 'body', responseType: 'text', headers: headers})
            .pipe(map(res => res));
    }
}
