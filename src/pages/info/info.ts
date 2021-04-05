import { Component, ViewChild, ElementRef } from "@angular/core";
import { IonicPage, NavController, AlertController } from "ionic-angular";
import { Api } from "../../providers/api";
import { FilesChecker } from "../../providers/files-checker";

@IonicPage({
  name: "page-info"
})
@Component({
  selector: "page-info",
  templateUrl: "info.html"
})
export class InfoPage {
  @ViewChild("content") content: ElementRef;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private api: Api,
    private filesChecker: FilesChecker
  ) {

  }

  async ngOnInit() {
    let info: any = await this.api.getContactInfo();
    this.content.nativeElement.innerHTML = info.content;
  }

  backToMainPage() {
    this.navCtrl.pop();
  }

  async clearStorage() {
    await this.filesChecker.clearStorage();

    this.alertCtrl.create({
      title: "Записи удалены",
      buttons: [{ text: "ОК", handler: () => {} }]
    }).present();
  }
}
