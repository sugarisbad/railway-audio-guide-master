import { Component } from "@angular/core";
import { IonicPage, NavController, AlertController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { Api } from "../../providers/api";
import { FilesChecker } from "../../providers/files-checker";
import { FilesDownloader } from "../../providers/files-downloader";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  name: "page-sync"
})
@Component({
  selector: "page-sync",
  templateUrl: "sync.html"
})
export class SyncPage {
  private readonly GIF_DELAY: number = 2000;
  data: any;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private api: Api,
    private storage: Storage,
    private filesChecker: FilesChecker,
    private filesDownloader: FilesDownloader,
    private base64ToGallery: Base64ToGallery,
    private translate: TranslateService
  ) {

  }

  async ngOnInit() {
    try {
      this.data = await this.api.getData();
      // await this.saveImgs();
      await this.storage.set("data", this.data);
    } catch(e) {
      this.data = await this.storage.get("data");
    }

    if (this.data == null || this.data == undefined) {
      this.showConnectionErrorAlert();
    } else {
      setTimeout(() => { this.navCtrl.setRoot("page-main"); }, this.GIF_DELAY);
    }
  }

  private showConnectionErrorAlert() {
    this.translate.get([
      "SYNC_ALERT_ERROR_TITLE",
      "SYNC_ALERT_ERROR_MESSAGE",
      "SYNC_ALERT_ERROR_BUTTON_RETRY"
    ]).subscribe(translations => {
      this.alertCtrl.create({
        title: translations.SYNC_ALERT_ERROR_TITLE,
        message: translations.SYNC_ALERT_ERROR_MESSAGE,
        buttons: [{
          text: translations.SYNC_ALERT_ERROR_BUTTON_RETRY,
          role: "cancel",
          handler: () => { this.ngOnInit(); }
        }]
      }).present();
    });
  }

  private async saveImgs() {
    for (let i=0; i<this.data.length; i++) {
      try {
        this.data[i].imagePath = await this.base64ToGallery
          .base64ToGallery(this.data[i].image.replace("data:image/jpeg;base64,", ""));;

        console.log("Saved image to: ", this.data[i].imagePath);
      } catch(e) {
        console.log("Can't save image to gallery: ", e);
      }
    }
  }

}
