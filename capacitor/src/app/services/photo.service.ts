import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';

import { Plugins, FilesystemDirectory, FileReadResult } from '@capacitor/core';

const PHOTO_STORAGE: string = "photos";
const { Filesystem } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage, private file: File, private webview: WebView) 
  { }

  async loadSaved() {
    this.storage.get(PHOTO_STORAGE).then((photos) => {
      this.photos = photos || [];
    });
  }

  // Open the device's camera, take a picture, then save it to the filesystem.
  async takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    const capturedTempImage = await this.camera.getPicture(options);
    
    const savedImageFile = await this.savePicture(capturedTempImage);

    // todo: figure out better webview path
    const webviewPath = savedImageFile.replace("file://", "capacitor-asset://");
    
    // capacitor://localhost/_capacitor_file_/var/mobile/Containers/Data/Application/63F50461-1A9D-4A8A-AD7C-FF5DE4DD204C/Documents/1563569873622.jpeg
    console.log(this.webview.convertFileSrc(savedImageFile));

    this.photos.unshift({
      filepath: savedImageFile,
      webviewPath: this.webview.convertFileSrc(savedImageFile)
    });

    // Cache all photo data for future retrieval
    this.storage.set(PHOTO_STORAGE, this.photos);
  }

  // Save picture to file on device
  async savePicture(cameraImage) {

    // Read the file into its base64 version
    let readFile: FileReadResult;
    try {
      readFile = await Filesystem.readFile({
        path: cameraImage
      });
    } catch (e) {
      console.error("unable to read file: ", e);
    }

    // Write the file to the data directory (instead of temp storage)
    let fileName = new Date().getTime() + '.jpeg';
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: readFile.data,
        directory: FilesystemDirectory.Data
      });
    } catch(e) {
      console.error('Unable to write file', e);
    }

    // Example:
    // file:///var/mobile/Containers/Data/Application/3688D7F2-3168-4275-B7EB-696FE0485852/Documents/1563565757167.jpeg
    const fileUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: fileName
    });

    return fileUri.uri;
  }

  // Delete picture by removing it from reference data and the filesystem
  async deletePicture(photo, position) {
    // Remove from our Photos reference data array
    this.photos.splice(position, 1);
    await this.storage.set(PHOTO_STORAGE, this.photos);

    // delete photo file
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
  }
}

class Photo {
  filepath: string;
  webviewPath: string;
}