import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { map } from "rxjs/operators";
import { Platform } from "ionic-angular";
import { FilesChecker } from "./files-checker";

import { AppSettings } from "../app/app.settings";
import { STORAGE_KEYS } from "./storage-keys";

@Injectable()
export class Api {
  private static readonly APIKEY: string = AppSettings.API_KEY;
  private baseUrl: string;

  constructor(
    public http: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private filesChecker: FilesChecker
  ) {
    this.baseUrl = platform.is("cordova") ? AppSettings.API_URL : AppSettings.API_URL_SERVE;
  }

  async getData() {
    let lang: string = await this.storage.get(STORAGE_KEYS.SELECTED_LANGUAGE);
    let options: any = { headers: { APIKEY: Api.APIKEY } };

    return this.http.get(`${this.baseUrl}/${lang}/data`, options).pipe(
      map(res => this.setAudioUrls(res, lang))
    ).toPromise();
  }

  async getContactInfo() {
    let lang: string = await this.storage.get(STORAGE_KEYS.SELECTED_LANGUAGE);

    return this.http.get(`${this.baseUrl}/${lang}/contact`).toPromise();
  }

  public async getAudioFileUrl(audioId: string): Promise<string> {
    let lang: string = await this.storage.get("selected_language");
    let isFileExist: boolean = await this.filesChecker.isFileExist(audioId);

    if (isFileExist) {
      return await this.filesChecker.getFilePath(audioId);
    } else {
      return this.getAudioUrl(lang, audioId);
    }
  }

  private setAudioUrls(res, lang: string) {
    res.forEach(cityInfo => cityInfo.audioUrl = this.getAudioUrl(lang, cityInfo.audioId));
    return res;
  }

  private getAudioUrl(lang: string, audioId: string): string {
    return `${this.baseUrl}/${lang}/audio/${audioId}?APIKEY=${Api.APIKEY}`;
  }
}
