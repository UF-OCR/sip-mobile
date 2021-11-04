import { platformNativeScript, runNativeScriptAngularApp } from '@nativescript/angular';
import 'zone.js';
import { AppModule } from "./app.module";

runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
