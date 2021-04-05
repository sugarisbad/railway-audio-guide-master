import { Component } from "@angular/core";
import { IonicPage, NavController, Platform, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { FilesChecker } from "../../providers/files-checker";
import { FilesDownloader, FilesDownloaderStatus } from "../../providers/files-downloader";
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  name: "page-download"
})
@Component({
  selector: "page-download",
  templateUrl: "download.html"
})
export class DownloadPage {
  counter: number = 0;
  total: number = 0;
  data: any;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private storage: Storage,
    private filesChecker: FilesChecker,
    private filesDownloader: FilesDownloader,
    private translate: TranslateService
  ) {

  }

  async ngOnInit() {
    this.data = await this.storage.get("data");

    if (!this.platform.is("cordova")) {
      this.total = 10;

      let intervalId: any = setInterval(() => {
        this.counter++;

        if (this.counter == this.total) {
          clearInterval(intervalId);
          this.navCtrl.setRoot("page-main");
        }
      }, 2500);
    } else {
      this.download();
    }
  }

  abortDownloading() {
    this.filesDownloader.abortDownloading();
    this.navCtrl.setRoot("page-main");
  }

  private async isAllFilesExist() {
    let filesForDownload = await this.filesChecker.getNonExistFileList(this.data);

    return filesForDownload.length == 0;
  }

  private async download() {
    await this.filesChecker.createDirIfNotExist();
    let filesForDownload = await this.filesChecker.getNonExistFileList(this.data);

    if (filesForDownload.length == 0) {
      console.log("All files already downloaded");
      return;
    }

    this.total = filesForDownload.length;
    this.filesDownloader.setDownloadCompleteCallback(() => {
      console.log("File downloaded");
      this.counter++;
    });

    let downloaderStatus: FilesDownloaderStatus = await this.filesDownloader.downloadFiles(filesForDownload);
    console.log("Download complete");

    if (downloaderStatus.status == FilesDownloaderStatus.STATUS_OK) {
      this.navCtrl.setRoot("page-main");
    } else if (downloaderStatus.status == FilesDownloaderStatus.STATUS_ERROR) {
      this.showErrorAlert();
    }
  }

  private showErrorAlert() {
    this.translate.get([
      "DOWNLOAD_ALERT_ERROR_TITLE",
      "DOWNLOAD_ALERT_ERROR_MESSAGE",
      "DOWNLOAD_ALERT_ERROR_BUTTON_OK"
    ]).subscribe(translations => {
      this.alertCtrl.create({
        title: translations.DOWNLOAD_ALERT_ERROR_TITLE,
        message: translations.DOWNLOAD_ALERT_ERROR_MESSAGE,
        buttons: [{
          text: translations.DOWNLOAD_ALERT_ERROR_BUTTON_OK,
          role: "cancel",
          handler: () => { this.navCtrl.setRoot("page-main"); }
        }]
      }).present();
    });
  }
}
