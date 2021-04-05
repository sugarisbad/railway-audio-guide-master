import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { DownloadPage } from "./download";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [DownloadPage],
  imports: [
    IonicPageModule.forChild(DownloadPage),
    TranslateModule
  ]
})
export class DownloadPageModule {}
