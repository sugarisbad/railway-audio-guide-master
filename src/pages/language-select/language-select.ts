import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  name: "page-language-select"
})
@Component({
  selector: "page-language-select",
  templateUrl: "language-select.html"
})
export class LanguageSelectPage {
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private translate: TranslateService,
  ) {

  }

  async onClick(lang: any) {
    await this.storage.set("selected_language", lang);
    this.translate.setDefaultLang(lang);
    this.navCtrl.setRoot("page-sync");
  }
}
