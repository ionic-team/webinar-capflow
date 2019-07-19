# Capflow: Cordova and Capacitor app
Demo app used during the [Building Capacitor Apps in Appflow](https://ionicframework.com/resources/webinars/live-demo-building-capacitor-apps-in-appflow) webinar. This companion app consists of two copies of the same Ionic Angular app, but one built with Cordova and the other with Capacitor.

In the webinar, the Cordova version is [migrated to Capacitor](https://capacitor.ionicframework.com/docs/cordova/migration-strategy), then various [Ionic Appflow](https://ionicframework.com/docs/appflow) (mobile DevOps) features are demoed.

> Note: This app is meant to be a demo sample and thus is not guaranteed to work forever. Specs: @ionic/angular 4.6.2, Angular 7, Cordova Android 8.0.0, Cordova iOS 5.0.1.

## What Does the App... Do?

Capflow (Capacitor + Appflow, heh) is a modified version of the Ionic `tabs` starter project (`ionic start myApp tabs`). On tab 2, a basic photo gallery has been implemented that allows the user to take pictures from their devices' camera (via a [FAB](https://ionicframework.com/docs/api/fab) UI component), then arranges them within a simple grid. Upon tapping a picture, an [action sheet](https://ionicframework.com/docs/api/action-sheet) UI component is displayed with the option to delete the picture from the device (or cancel).

The Cordova version (iOS, Android):

* Taking pictures: [Ionic Native/Cordova Camera plugin](https://ionicframework.com/docs/native/camera)
* Saving files to the device: [Ionic Native/Cordova File plugin](https://ionicframework.com/docs/native/file)
* Caching app data: [Ionic Storage plugin](https://ionicframework.com/docs/building/storage) along with the Cordova [SQLite Storage plugin](https://www.npmjs.com/package/cordova-plugin-sqlite)

The Capacitor version:

* COMING SOON

## Project Structure

The Cordova version of the app is under the `cordova/` folder.
You guessed it! The Capacitor version is under the `capacitor/` folder.

Tab 2 (`src/app/tab2` folder) has been modified to become a Photo Gallery. `PhotoService` (`src/app/services/photo.service.ts`) contains all logic to take pictures, write files, and store data.

## How to Run

SOON