import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';

const PHOTO_STORAGE: string = "photos";

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
    
    // The following Example filepaths are from iOS - Android paths will be slightly different.
    // Captured image from the device, currently stored in a temp directory.
    // Result example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/cdv_photo_003.jpg
    const capturedTempImage = await this.camera.getPicture(options);
    
    // Example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/cdv_photo_003.jpg
    const savedImageFile = await this.savePicture(capturedTempImage);

    // Rewrite from a device filepath (file:// protocol) to the local HTTP server (https:// protocol) hosting this Ionic app by using the 
    // WebView provided "this.webview.convertFileSrc(filepath)" method. 
    // Without this, we would get a "Not allowed to load local resource" error when trying to display this image to the app user 
    // on the Tab 2 page (tab2.page.html):
    // <ion-img src="{{ photo.webviewPath }}"
    //
    // More details: https://ionicframework.com/docs/building/webview#file-protocol
    // Result example: ionic://localhost/_app_file_/var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/cdv_photo_003.jpg
    this.photos.unshift({
      filepath: savedImageFile,
      webviewPath: this.webview.convertFileSrc(savedImageFile)
    });

    // Cache all photo data for future retrieval
    this.storage.set(PHOTO_STORAGE, this.photos);
  }

  // Save picture to file on device
  // The following Example filepaths are from iOS - Android paths will be slightly different.
  async savePicture(cameraImage) {
    // cameraImage variable
    // Example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/cdv_photo_003.jpg

    // Extract just the filename. Result example: cdv_photo_003.jpg
    const tempFilename = cameraImage.substr(cameraImage.lastIndexOf('/') + 1);

    // Now, the opposite. Extract the full path, minus filename. 
    // Result example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/tmp/
    const tempBaseFilesystemPath = cameraImage.substr(0, cameraImage.lastIndexOf('/') + 1);

    // Get the Data directory on the device. 
    // Result example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/Library/NoCloud/
    const newBaseFilesystemPath = this.file.dataDirectory;

    // Save picture to filesystem by copying it from temp storage to permanent file storage.
    // There are other methods to save files, but this is the simplest.
    // Same filename, different path (temp => filesystem).
    await this.file.copyFile(tempBaseFilesystemPath, tempFilename, newBaseFilesystemPath, tempFilename); 

    // Return new image full filepath
    // Result example: file:///var/mobile/Containers/Data/Application/E4A79B4A-E5CB-4E0C-A7D9-0603ECD48690/Library/NoCloud/cdv_photo_003.jpg
    return newBaseFilesystemPath + tempFilename;
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