import { Component } from "@angular/core";
import { IonicPage, NavController } from "ionic-angular";

@IonicPage({
  name: "page-transition"
})
@Component({
  selector: "page-transition",
  templateUrl: "transition.html"
})
export class TransitionPage {
  private readonly GIF_DELAY: number = 2000;

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    setTimeout(() => { this.navCtrl.setRoot("page-language-select"); }, this.GIF_DELAY);
  }
}
