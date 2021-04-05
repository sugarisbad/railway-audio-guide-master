import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file";
import { STORAGE_KEYS } from "./storage-keys";

@Injectable()
export class FilesChecker {
  private directories: string[] = ["en", "cn", "de", "ru"];

  constructor(
    private storage: Storage,
    private file: File
  ) {
  }

  public async isAnyAudioFilesExist(): Promise<boolean> {
    for (let i=0; i<this.directories.length; i++) {
      try {
        await this.file.checkDir(this.file.dataDirectory, this.directories[i]);
        return true;
      } catch(e) {
        //current directory doesn't exist
      }
    }

    return false;
  }

  public async clearStorage() {
    for (let i=0; i<this.directories.length; i++) {
      try {
        await this.file.removeRecursively(this.file.dataDirectory, this.directories[i]);
        console.log("Directory removed: ", this.directories[i]);
      } catch(e) {
        console.log("Some error for removing directory: ", this.directories[i]);
      }
    }
  }

  public async createDirIfNotExist() {
    let lang: string = await this.storage.get(STORAGE_KEYS.SELECTED_LANGUAGE);

    try {
      await this.file.checkDir(this.file.dataDirectory, lang);
    } catch(e) {
      console.log("Directory doesn't exist");
      await this.file.createDir(this.file.dataDirectory, lang, true);
    }
  }

  public async isFileExist(filename: string): Promise<boolean> {
    let lang: string = await this.storage.get(STORAGE_KEYS.SELECTED_LANGUAGE);
    let dir: string = this.file.dataDirectory + lang + "/";

    try {
      await this.file.checkFile(dir, filename);
      return true;
    } catch(e) {
      return false;
    }
  }

  public async getDownloadFileInfo(audioUrl: string, audioId: string) {
    let lang: string = await this.storage.get(STORAGE_KEYS.SELECTED_LANGUAGE);
    let dir: string = this.file.dataDirectory + lang + "/";

    return {
      src: audioUrl,
      dest: dir + audioId,
      destDir: dir,
      destFilename: audioId
    };
  }

  public async getFilePath(filename: string): Promise<string> {
    let lang: string = await this.storage.get(STORAGE_KEYS.SELECTED_LANGUAGE);
    let dir: string = this.file.dataDirectory + lang + "/";

    return (dir + filename).replace(/^file:\/\//, '');
  }

  public async getNonExistFileList(citiesInfo: any[]): Promise<any[]> {
    let lang: string = await this.storage.get(STORAGE_KEYS.SELECTED_LANGUAGE);
    let dir: string = this.file.dataDirectory + lang + "/";

    let nonExistFiles = [];

    for (let i=0; i<citiesInfo.length; i++) {
      let entry = citiesInfo[i];
      let localFilePath = dir + entry.audioId;

      try {
        await this.file.checkFile(dir, entry.audioId);
        entry.audioUrl = localFilePath;
      } catch(e) {
        nonExistFiles.push({
          src: entry.audioUrl,
          dest: localFilePath,
          destDir: dir,
          destFilename: entry.audioId
        });
      }
    }

    return nonExistFiles;
  }
}
