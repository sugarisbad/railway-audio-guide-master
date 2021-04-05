import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Platform } from "ionic-angular";
import { Media, MediaObject } from "@ionic-native/media";
import { CityAudio } from "../../models/city-audio";
import { Api } from "../../providers/api";
import { FilesChecker } from "../../providers/files-checker";
import { FilesDownloader } from "../../providers/files-downloader";

@Component({
  selector: "city-player-card",
  templateUrl: "city-player-card.html"
})
export class CityPlayerCard {
  @Input() cityAudio: any;
  @Output() onPlayClick: EventEmitter<any> = new EventEmitter();
  @Output() onPauseClick: EventEmitter<any> = new EventEmitter();

  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private isDownloading: boolean = false;

  private audioFile: MediaObject;
  private audioProgress: number = 0;
  private audioProgressIntervalId: any = -1;

  private description: string = "";

  constructor(
    private platform: Platform,
    private media: Media,
    private api: Api,
    private filesChecker: FilesChecker,
    private FilesDownloader: FilesDownloader
  ) {

  }

  ngOnInit() {
    this.description = this.cityAudio.short_description;
  }

  public play(position?: number) {
    this.onPlayClick.emit();

    this.isPlaying = true;
    this.isPaused = false;

    this.playAudioFile(position);
    this.addProgressBarUpdater();
  }

  public pause() {
    this.onPauseClick.emit();

    this.isPlaying = false;
    this.isPaused = true;

    this.removeProgressBarUpdater();
    this.pauseAudioFile();
  }

  public musicControlPlay() {
    this.isPlaying = true;
    this.isPaused = false;

    this.playAudioFile();
    this.addProgressBarUpdater();
  }

  public musicControlPause() {
    this.isPlaying = false;
    this.isPaused = true;

    this.removeProgressBarUpdater();
    this.pauseAudioFile();
  }

  public stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.isDownloading = false;

    this.removeProgressBarUpdater();
    this.pauseAudioFile();
  }

  onRangeFocus() {
    if (!this.platform.is("cordova")) {
      return;
    }

    this.audioFile.pause();
    this.removeProgressBarUpdater();
  }

  onRangeBlur() {
    if (!this.platform.is("cordova")) {
      return;
    }

    let duration: number = this.audioFile.getDuration();
    let position: number = (this.audioProgress / 100) * duration * 1000;

    this.play(position);
  }

  public getAudioCurrentPosition() {
    return this.audioFile.getCurrentPosition();
  }

  public getAudioDuration(): number {
    return this.audioFile.getDuration();
  }

  private addProgressBarUpdater() {
    if (!this.platform.is("cordova")) {
      return;
    }

    this.audioProgressIntervalId = setInterval(() => {
      if (this.audioFile == undefined) {
        return;
      }

      let duration = this.audioFile.getDuration();
      if (duration < 0) {
        return;
      }

      this.audioFile.getCurrentPosition().then(position => {
        this.audioProgress = 100 * position / duration;
      })
    }, 100);
  }

  private removeProgressBarUpdater() {
    if (!this.platform.is("cordova")) {
      return;
    }

    clearInterval(this.audioProgressIntervalId);
  }

  private async playAudioFile(position?: number) {
    if (!this.platform.is("cordova")) {
      console.log("Can't play audio file. This is not cordova platform");
      return;
    }

    if (this.audioFile == undefined) {
      let isFileExist: boolean = await this.filesChecker.isFileExist(this.cityAudio.audioId);

      if (!isFileExist) {
        this.isDownloading = true;

        let info = await this.filesChecker.getDownloadFileInfo(this.cityAudio.audioUrl, this.cityAudio.audioId);
        await this.FilesDownloader.downloadSingleFile(info);

        this.isDownloading = false;
      }

      if (!this.isPlaying) {
        return;
      }

      let audioFileUrl: string = await this.api.getAudioFileUrl(this.cityAudio.audioId);
      this.audioFile = this.media.create(audioFileUrl);
      this.audioFile.onSuccess.subscribe(() => console.log("File created successful"));
      this.audioFile.onError.subscribe(error => console.log("Error!", error));
    }

    this.audioFile.play();

    if (position) {
      this.audioFile.seekTo(position);
    }
  }

  private pauseAudioFile() {
    if (!this.platform.is("cordova")) {
      console.log("Can't pause audio file. This is not cordova platform");
      return;
    }

    if (this.audioFile != undefined) {
      this.audioFile.pause();
    }
  }
}
