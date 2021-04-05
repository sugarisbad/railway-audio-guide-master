import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from "@ionic/storage";

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    splashScreen: SplashScreen,
    private translate: TranslateService,
    private storage: Storage
  ) {
    platform.ready().then(() => {
      // workaround to avoid white screen after splash
      // https://forum.ionicframework.com/t/android-splashscreen-fade-animation-on-hide-not-working/120130
      setTimeout(() => { splashScreen.hide(); }, 1500);
    });
  }

  async ngOnInit() {
    let launchCounter = await this.storage.get("launch_counter");
    launchCounter == null ? launchCounter = 1 : launchCounter++;
    await this.storage.set("launch_counter", launchCounter);

    let lang = await this.storage.get("selected_language");
    if (lang != null) this.translate.setDefaultLang(lang);

    this.rootPage = lang == null ? "page-language-select" : "page-sync";
  }
}
