import { Injectable } from "@angular/core";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { FilesChecker } from "./files-checker";

export class FilesDownloaderStatus {
  public static readonly STATUS_ABORT: number = -1;
  public static readonly STATUS_OK: number = 1;
  public static readonly STATUS_ERROR: number = 2;

  public status: number;
  public countOfDownloadErrors: number;

  constructor(countOfDownloadErrors: number) {
    switch (countOfDownloadErrors) {
      case -1: this.status = FilesDownloaderStatus.STATUS_ABORT; break;
      case 0: this.status = FilesDownloaderStatus.STATUS_OK; break;

      default: this.status = FilesDownloaderStatus.STATUS_ERROR;
    }

    this.countOfDownloadErrors = countOfDownloadErrors;
  }
}

@Injectable()
export class FilesDownloader {
  private downloadCompleteCallback = () => {};
  private forceStop: boolean = false;

  constructor(
    private file: File,
    private transfer: FileTransfer
  ) {

  }

  public setDownloadCompleteCallback(callback) {
    this.downloadCompleteCallback = callback;
  }

  public abortDownloading() {
    this.forceStop = true;
    console.log("Force stop initialize");
  }

  async downloadSingleFile(fileInfo: any): Promise<boolean> {
    let fileTransfer: FileTransferObject = this.transfer.create();

    try {
      await fileTransfer.download(fileInfo.src, fileInfo.dest);
      return true;
    } catch(e) {
      return false;
    }
  }

  async downloadFiles(list: any[]): Promise<FilesDownloaderStatus> {
    this.forceStop = false;
    let fileTransfer: FileTransferObject = this.transfer.create();
    let countOfErrors: number = 0;

    for (let i=0; i<list.length; i++) {
      if (this.forceStop) {
        console.log("Downloading stopped");
        return new FilesDownloaderStatus(-1);
      }

      try {
        let downloadedFile = await fileTransfer.download(list[i].src, list[i].dest);
        console.log("Download complete from: ", downloadedFile.toURL());

        this.downloadCompleteCallback();
      } catch(e) {
        // can't download, need to removed this file
        console.log("Can't download file from: ", list[i].src);
        this.removeFile(list[i].destDir, list[i].destFilename);
        countOfErrors++;
      }
    }

    return new FilesDownloaderStatus(countOfErrors);
  }

  private async removeFile(dir: string, filename: string) {
    try {
      await this.file.removeFile(dir, filename);
    } catch(e) {
      console.log("Can't remove file: ", dir, filename);
    }
  }
}
