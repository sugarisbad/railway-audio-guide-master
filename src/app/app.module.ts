import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';
import { Media } from "@ionic-native/media";
import { BackgroundMode } from '@ionic-native/background-mode';
import { MusicControls } from '@ionic-native/music-controls';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { AppRate } from "@ionic-native/app-rate";

import { Api } from "../providers/api";
import { FilesChecker } from "../providers/files-checker";
import { FilesDownloader } from "../providers/files-downloader";

import { MyApp } from './app.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { swipeBackEnabled: false, mode: "ios" }),
    IonicStorageModule.forRoot({ name: "__ragdb", driverOrder: ['indexeddb', 'sqlite', 'websql'] }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Media,
    BackgroundMode,
    MusicControls,
    Api,
    FilesChecker,
    FilesDownloader,
    File,
    FileTransfer,
    Base64ToGallery,
    AppRate
  ]
})
export class AppModule {}
