import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppComponent } from "./app.component";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { AppRoutingModule } from "./app.routing";
import { HomeService } from "./shared/home/home.service";
import { ListService } from "./shared/list/list.service";
import { ProtocolService } from "./shared/protocol/protocol.service";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { CustomReuseStrategy } from "./reuse-strategy"
import { RouteReuseStrategy } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { ListComponent } from "./pages/list/list.component";
import { ProtocolComponent } from "./pages/protocol/protocol.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListComponent,
    ProtocolComponent
  ],
  bootstrap: [
    AppComponent
  ],
  imports: [
    NativeScriptModule,
    NativeScriptHttpClientModule,
    NativeScriptFormsModule,
    AppRoutingModule
  ], providers: [
    HomeService,
    ListService,
    ProtocolService,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
}
