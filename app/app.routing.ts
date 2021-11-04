import { HomeComponent } from "./pages/home/home.component";
import { ListComponent } from "./pages/list/list.component";
import { ProtocolComponent } from "./pages/protocol/protocol.component";
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

const routes = [
    { path: '', component: HomeComponent},
    { path: 'list/:chartId', component: ListComponent},
    { path: 'sublist/:chartId', component: ListComponent},
    { path: 'sublist1/:chartId', component: ListComponent},
    { path: 'sublist2/:chartId', component: ListComponent},
    { path: 'sublist3/:chartId', component: ListComponent},
    { path: 'sublist4/:chartId', component: ListComponent},
    { path: 'sublist5/:chartId', component: ListComponent},
    { path: 'protocol/:protocolNo', component: ProtocolComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})


export class AppRoutingModule { }
