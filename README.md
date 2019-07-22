# Capflow: Cordova and Capacitor app
Demo app used during the [Building Capacitor Apps in Appflow](https://ionicframework.com/resources/webinars/live-demo-building-capacitor-apps-in-appflow) webinar. This companion app consists of two copies of the same Ionic Angular app: one built with Cordova and the other with Capacitor.

In the webinar, the Cordova version is [migrated to Capacitor](https://capacitor.ionicframework.com/docs/cordova/migration-strategy), then various [Ionic Appflow](https://ionicframework.com/docs/appflow) (mobile DevOps) features are demoed.

> Note: This app is meant to be a demo sample and thus may not be maintained over time. Specs: @ionic/angular 4.6.2, Angular 7, Cordova Android 8.0.0, Cordova iOS 5.0.1, Capacitor 1.1.1.

## What Does the App Do?

Capflow (Capacitor + Appflow, heh) is a modified version of the Ionic `tabs` starter project (`ionic start myApp tabs`). On tab 2, a basic photo gallery has been implemented that allows the user to take pictures from their devices' camera (via a [FAB](https://ionicframework.com/docs/api/fab) UI component), then arranges them within a simple grid. Upon tapping a picture, an [action sheet](https://ionicframework.com/docs/api/action-sheet) UI component is displayed with the option to delete the picture from the device (or cancel).

The Cordova version (iOS, Android):

* Taking pictures: [Ionic Native/Cordova Camera plugin](https://ionicframework.com/docs/native/camera)
* Saving files to the device: [Ionic Native/Cordova File plugin](https://ionicframework.com/docs/native/file)
* Caching app data: [Ionic Storage plugin](https://ionicframework.com/docs/building/storage) along with the Cordova [SQLite Storage plugin](https://www.npmjs.com/package/cordova-plugin-sqlite)

The Capacitor version (iOS, Android, and can be extended with PWA support):

* Taking pictures and caching app data: Still uses the [Ionic Native/Cordova Camera plugin](https://ionicframework.com/docs/native/camera) and [Ionic Storage plugin](https://ionicframework.com/docs/building/storage)! This is intentional, demonstrating that these Cordova plugins work as-is with Capacitor without any modifications. 

> Challenge! Fork this repo then switch to the Capacitor [Camera plugin](https://capacitor.ionicframework.com/docs/apis/camera), which adds PWA support!

* Saving files to the device: [Capacitor Filesystem plugin](https://capacitor.ionicframework.com/docs/apis/filesystem). Changed from Cordova File plugin to this, which also brings support for PWAs.

## Project Structure

The Cordova version of the app is under the `cordova/` folder.
You guessed it! The Capacitor version is under the `capacitor/` folder.

The Tab 2 page (within the `src/app/tab2` folder) has been modified to become a Photo Gallery. The `PhotoService` class (`src/app/services/photo.service.ts`) contains all logic to take pictures, write files, and store data.

## How to Run

1) Clone this repository.
2) In a terminal, change directory into the repo: `cd webinar-capflow`.
3) If not already installed, install Ionic: `npm install -g ionic`.
4) Continue on based on your device OS of choice.

### Cordova: Android Device

1) Change directory into the `cordova` folder.
2) Run `npm install`.
3) Cordova-based projects are not considered _source assets_, but rather _build time assets_, so the Android project must be freshly created. Run `ionic cordova platform add android`.
4) With a device connected to your computer, run `ionic cordova run android`.
5) After a few moments, the app should load on the device.

### Capacitor: Android Device

1) Change directory into the `capacitor` folder.
2) Run `npm install`.
3) Capacitor-based projects are considered _source assets_, so there is no need to recreate the Android project.
4) Build the project: `ionic build`.
5) Copy the web code into the Android project: `ionic cap copy`.
6) Open Android Studio: `ionic cap open android`.
7) Click the Run button to build and deploy to a device.

### Cordova: iOS Device

1) Change directory into the `cordova` folder.
2) Run `npm install`.
3) Open `config.xml` and change the `<widget>` id property (currently `io.ionic.webinars.capflow.cordova`). This must be changed because each App Id is uniquely attached to an Apple Developer account.
4) Build the project: `ionic build`.
5) Cordova-based projects are not considered _source assets_, but rather _build time assets_, so the iOS project must be freshly created. Run `ionic cordova platform add ios`.
6) Build the iOS project: `ionic cordova build ios`.
7) Open the Cordova iOS project in Xcode: `cordova/platforms/ios/Capflow - Cordova.xcworkspace`.
8) With a device connected to your computer, click the Run button to build and deploy to a device.

### Capacitor: iOS Device

1) Change directory into the `capacitor` folder.
2) Run `npm install`.
3) Capacitor-based projects are considered _source assets_, so there is no need to recreate the iOS project.
4) Build the project: `ionic build`.
5) Copy the web code into the iOS project: `ionic cap copy`.
6) Open Xcode: `ionic cap open ios`.
7) Change the Bundle Identifier property (currently `io.ionic.webinars.capflow.capacitor`). This must be changed because each App Id is uniquely attached to an Apple Developer account.
8) Click the Run button to build and deploy to a device.