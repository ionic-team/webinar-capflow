import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';

const PHOTO_STORAGE: string = "photos";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private camera: Camera, private storage: Storage, private file: File, 
    private sanitizer: DomSanitizer, private webview: WebView) 
  { }

  async loadSaved() {
    this.storage.get(PHOTO_STORAGE).then((photos) => {
      this.photos = photos || [];
    });
  }

  // Open the device's camera, take a picture, then save it to the filesystem.
  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    // The following Example filepaths are from iOS - Android paths will be slightly different.
    this.camera.getPicture(options).then((capturedTempImage) => {
      // Captured image from the device, currently stored in a temp directory
      // Example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/cdv_photo_003.jpg

      // Rewrite from a device filepath (file:// protocol) to the local HTTP server (https:// protocol) hosting this Ionic app. 
      // Without this, we would get a "Not allowed to load local resource" error.
      // More details: https://ionicframework.com/docs/building/webview#file-protocol
      // Example: ionic://localhost/_app_file_/var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/cdv_photo_003.jpg
      const webviewImage = this.webview.convertFileSrc(capturedTempImage);

      // Save picture to a file on device
      const tempFilename = capturedTempImage.substr(capturedTempImage.lastIndexOf('/') + 1);
      // Example: cdv_photo_003.jpg
      const tempBaseFilesystemPath = capturedTempImage.substr(0, capturedTempImage.lastIndexOf('/') + 1);
      // Example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/

      const newBaseFilesystemPath = this.file.dataDirectory;
      // Example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/Library/NoCloud/

      // Save picture to filesystem by copying it from temp storage to permanent file storage.
      // There are other methods to save files, but this is the simplest.
      // Same filename, different path (temp => filesystem).
      this.file.copyFile(tempBaseFilesystemPath, tempFilename, newBaseFilesystemPath, tempFilename); 

      // Add new photo to gallery
      const newImageFile = newBaseFilesystemPath + tempFilename;
      // Example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/Library/NoCloud/cdv_photo_003.jpg

      this.photos.unshift({
        filepath: newImageFile,
        webviewPath: this.webview.convertFileSrc(newImageFile)
      });

      // Cache all photo data for future retrieval
      this.storage.set(PHOTO_STORAGE, this.photos);
    }, (err) => {
      // Handle error
      console.log("Camera issue: " + err);
    });
  }

  // Delete picture by removing it from reference data and the filesystem
  async deletePicture(photo, position) {
    // Remove from our Photos reference data array
    this.photos.splice(position, 1);
    await this.storage.set(PHOTO_STORAGE, this.photos);

    // delete photo file
    const photoToDelete = photo.filepath;
    const baseFilesystemPath = photoToDelete.substr(0, photoToDelete.lastIndexOf('/') + 1);
    const filename = photoToDelete.substr(photoToDelete.lastIndexOf('/') + 1);
    await this.file.removeFile(baseFilesystemPath, filename);
  }
}

class Photo {
  filepath: string;
  webviewPath: string;
}