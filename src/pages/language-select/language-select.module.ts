import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LanguageSelectPage } from './language-select';
import { ComponentsModule } from "../../components/components.module";
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LanguageSelectPage],
  imports: [
    IonicPageModule.forChild(LanguageSelectPage),
    ComponentsModule,
    TranslateModule
  ]
})
export class LanguageSelectPageModule {}
