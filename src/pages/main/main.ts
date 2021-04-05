import { Component, QueryList, ViewChild, ViewChildren, ElementRef } from "@angular/core";
import { IonicPage, NavController, Platform, Slides, AlertController } from "ionic-angular";
import { BackgroundMode } from '@ionic-native/background-mode';
import { CityPlayerCard } from "../../components/city-player-card/city-player-card";
import { CityAudio } from "../../models/city-audio";
import { Api } from "../../providers/api";
import { Storage } from "@ionic/storage";
import { AppSettings } from "../../app/app.settings";
import { FilesChecker } from "../../providers/files-checker";
import { MusicControls } from '@ionic-native/music-controls';
import { TranslateService } from '@ngx-translate/core';
import { AppRate } from "@ionic-native/app-rate";

@IonicPage({
  name: "page-main"
})
@Component({
  selector: "page-main",
  templateUrl: "main.html"
})
export class MainPage {
  Math: Math = Math;

  @ViewChild('imgContainer') mapContainer: ElementRef;
  @ViewChild("railwayMap") railwayMap: ElementRef;
  @ViewChild(Slides) slides: Slides;

  @ViewChildren(CityPlayerCard) cityCards: QueryList<CityPlayerCard>;
  @ViewChildren("citiesList") citiesList: QueryList<ElementRef>;

  private isStationOrderReversed: boolean = false;
  private activeStationIndex: number = 0;

  private cities: any[] = [];
  private base64Image: string;
  private playNow = false;

  scaleStep: number = 0.2;
  zoomStep = 0;
  readonly maxZoomStep: number = 3;
  readonly minZoomStep: number = -20;

  private lastMapScrollLeft: number;
  private lastMapScrollTop: number;
  private title: string;
  private text: string;

  private isPaidApp: boolean = AppSettings.IS_PAID;
  private isDownloadButtonVisible: boolean = false;
  private readonly MIN_LAUNCHES_TO_RATE: number = 2;

  private readonly appIdIOS: string = "1201150645";
  private readonly appIdAndroid: string = "market://details?id=com.metoo.app";

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
    private api: Api,
    private storage: Storage,
    private filesChecker: FilesChecker,
    private musicControls: MusicControls,
    private translate: TranslateService,
    private appRate: AppRate
  ) {
    this.backgroundMode.setDefaults({ silent: true });

    if (this.platform.is("cordova")) {
      this.appRate.preferences.storeAppURL = {
        ios: this.appIdIOS,
        android: this.appIdAndroid
      };
    }
  }

  ionViewDidLoad() {
    this.setMapCenterToMoscow();
  }

  async ngOnInit() {
    this.cities = await this.storage.get("data");

    let isAllFilesExist = await this.isAllFilesExist();
    let isFirstFilesCheck: boolean = await this.isFirstFilesCheck();

    if (!isAllFilesExist && isFirstFilesCheck) {
      this.showDownloadAudioFilesAlert();
      this.storage.set("is_first_files_check", false);
    } else {
      this.suggestToRate();
    }

    this.isDownloadButtonVisible = !isAllFilesExist;
  }

  private async suggestToRate() {
    let launchCounter = await this.storage.get("launch_counter");
    let isAlreadyRated = await this.storage.get("already_rated");

    if (launchCounter >= this.MIN_LAUNCHES_TO_RATE && isAlreadyRated != true) {
      this.showSuggestToRateAlert();
    }
  }

  private showSuggestToRateAlert() {
    this.translate.get([
      "MAIN_RATE_ALERT_MESSAGE",
      "MAIN_RATE_ALERT_BUTTON_CANCEL",
      "MAIN_RATE_ALERT_BUTTON_RATE"
    ]).subscribe(translations => {
      this.alertCtrl.create({
        message: translations.MAIN_RATE_ALERT_MESSAGE,
        buttons: [
          {
            text: translations.MAIN_RATE_ALERT_BUTTON_CANCEL,
            role: "cancel",
            handler: () => { this.storage.set("already_rated", true); }
          },
          {
            text: translations.MAIN_RATE_ALERT_BUTTON_RATE,
            handler: () => {
              this.appRate.navigateToAppStore();
              this.storage.set("already_rated", true);
            }
          }
        ]
      }).present();
    });
  }

  private async isAllFilesExist() {
    let filesForDownload = await this.filesChecker.getNonExistFileList(this.cities);
    return filesForDownload.length == 0;
  }

  private async isFirstFilesCheck() {
    let isFirstFilesCheck = await this.storage.get("is_first_files_check");
    return isFirstFilesCheck !== false;
  }

  private showDownloadAudioFilesAlert() {
    this.translate.get([
      "MAIN_DOWNLOAD_ALERT_TITLE",
      "MAIN_DOWNLOAD_ALERT_MESSAGE",
      "MAIN_DOWNLOAD_ALERT_BUTTON_CANCEL",
      "MAIN_DOWNLOAD_ALERT_BUTTON_DOWNLOAD"
    ]).subscribe(translations => {
      this.alertCtrl.create({
        title: translations.MAIN_DOWNLOAD_ALERT_TITLE,
        message: translations.MAIN_DOWNLOAD_ALERT_MESSAGE,
        buttons: [
          {
            text: translations.MAIN_DOWNLOAD_ALERT_BUTTON_CANCEL,
            role: "cancel",
            handler: () => {}
          },
          {
            text: translations.MAIN_DOWNLOAD_ALERT_BUTTON_DOWNLOAD,
            handler: () => { this.navCtrl.push("page-download"); }
          }
        ]
      }).present();
    });
  }

  openInfoPage() {
    this.navCtrl.push("page-info");
  }

  writeToSupport() {
    window.open("mailto:admin@afisha-omsk.ru", "_system");
  }

  mapZoomIn() {
    this.zoomStep++;
    this.scaleMap(1 + this.scaleStep);
  }

  mapZoomOut() {
    this.zoomStep--;
    this.scaleMap(1 / (1 + this.scaleStep));
  }

  openStore() {
    let url: string = this.platform.is("ios") ? AppSettings.PAID_APP_URL_IOS : AppSettings.PAID_APP_URL_ANDROID;
    window.open(url, "_system");
  }

  scaleMap(scale: number) {
    let map = this.railwayMap.nativeElement;
    let mapContainer = this.mapContainer.nativeElement;

    if (scale < 1 && (map.clientWidth == mapContainer.clientWidth
      || map.clientHeight == mapContainer.clientHeight)) {
      this.zoomStep++;
      return;
    }

    if (scale * map.clientWidth < mapContainer.clientWidth || scale * map.clientHeight < mapContainer.clientHeight) {
      scale = Math.max(mapContainer.clientWidth / map.clientWidth, mapContainer.clientHeight / map.clientHeight);
    }

    map.style.width = `${scale * map.clientWidth}px`;
    map.style.height = `${scale * map.clientHeight}px`;

    mapContainer.scrollLeft = scale*mapContainer.scrollLeft + (scale - 1) * mapContainer.clientWidth / 2;
    mapContainer.scrollTop = scale*mapContainer.scrollTop + (scale - 1) * mapContainer.clientHeight / 2;
  }

  reverseStationOrder() {
    this.isStationOrderReversed ? this.restoreOrder() : this.reverseOrder();
    this.isStationOrderReversed = !this.isStationOrderReversed;
  }

  private reverseOrder() {
    let first = this.citiesList.first.nativeElement;
    let last = this.citiesList.last.nativeElement;

    let topBorder: number = first.getBoundingClientRect().top;
    let bottomBorder: number = last.getBoundingClientRect().top + last.getBoundingClientRect().height;

    this.citiesList.forEach(elRef => {
      let el = elRef.nativeElement;
      let rect = el.getBoundingClientRect();
      let top = topBorder + bottomBorder - rect.height - 2*rect.top;

      el.style.top = `${top}px`;
    });
  }

  private restoreOrder() {
    this.citiesList.forEach(elRef => {
      let el = elRef.nativeElement;
      el.style.top = 0;
    });
  }

  setMapCenterToMoscow() {
    this.mapContainer.nativeElement.scrollLeft = 100;
    this.mapContainer.nativeElement.scrollTop = 400;
  }

  openSelectLanguagePage() {
    this.cityCards.forEach((card, index, array) => {
      card.stop();
    });

    this.playNow = false;
    this.navCtrl.push("page-transition", {}, { direction: "back" }).then(() => {
      this.navCtrl.setRoot("page-transition");
    });
  }

  onPlay(clickedElementIndex: number) {
    this.lastMapScrollLeft = this.mapContainer.nativeElement.scrollLeft;
    this.lastMapScrollTop = this.mapContainer.nativeElement.scrollTop;

    this.playNow = true;
    this.base64Image = this.cities[clickedElementIndex].image;
    this.activeStationIndex = clickedElementIndex;

    this.cityCards.forEach((card, index, array) => {
      if (index != clickedElementIndex) {
        card.stop();
      } else {
        this.title = this.cities[index].title;
        if (this.slides) this.slides.slideTo(0, 50);
        this.text = this.cities[index].additional_text;
      }
    });

    if (this.platform.is("cordova")) {
      setTimeout(() => { this.createMusicControls(clickedElementIndex); }, 500);
    }
  }

  onPauseClick(clickedElementIndex: number) {
    this.playNow = false;

    requestAnimationFrame(() => {
      this.mapContainer.nativeElement.scrollLeft = this.lastMapScrollLeft;
      this.mapContainer.nativeElement.scrollTop = this.lastMapScrollTop;
    });

    if (this.platform.is("cordova")) {
      this.destroyMusicControls();
    }
  }

  createMusicControls(id: any) {
    let duration: number = this.cityCards.toArray()[id].getAudioDuration();
    let position: number = 0;

    this.backgroundMode.enable();
    this.musicControls.create({
      track: this.cities[id].title,
      // cover: this.cities[id].imagePath,
      hasPrev: false,
      hasNext: false,
      dismissable : true,

      // ios only config
      elapsed: 0,
      duration: duration
    });

    this.musicControls.subscribe().subscribe(async (action) => {
      let message: string = JSON.parse(action).message;

      switch(message) {
        case 'music-controls-pause':
          position = await this.cityCards.toArray()[id].getAudioCurrentPosition();
          this.cityCards.toArray()[id].musicControlPause();

          if (this.platform.is("ios")) {
            this.musicControls.updateElapsed({ elapsed: position.toString(), isPlaying: false });
          } else {
            this.musicControls.updateIsPlaying(false);
          }

          break;

        case 'music-controls-play':
          this.cityCards.toArray()[id].musicControlPlay();

          if (this.platform.is("ios")) {
            this.musicControls.updateElapsed({ elapsed: position.toString(), isPlaying: true });
          } else {
            this.musicControls.updateIsPlaying(true);
          }
          break;
      }
    });

    this.musicControls.listen();
    this.musicControls.updateIsPlaying(true);
  }

  destroyMusicControls() {
    this.backgroundMode.disable();
    this.musicControls.destroy();
  }
}
