import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MainPage } from "./main";
import { TranslateModule } from "@ngx-translate/core";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [MainPage],
  imports: [
    IonicPageModule.forChild(MainPage),
    TranslateModule,
    ComponentsModule
  ]
})
export class MainPageModule {}
