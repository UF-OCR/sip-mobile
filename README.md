# NativeScript SipMobile App
SIP Mobile App is a NativeScript-built iOS and Android app for displaying SIP Flowcharts. 

## Environment 
- Nativescript Version: 7.2.1
- Xcode 12.4 (12D4e)
- Android Studio 4.2.1
- Node 12

## Prerequisites
- Sip Mobile App is built using Nativescript Angular Template.
- OnCore Flowchart must be setup.

## Installation

Sip Mobile app is built with the NativeScript CLI. Once you have the CLI installed, start by cloning the repo:

```
$ git clone https://github.com/UF-OCR/sip-mobile.git
$ cd sip-mobile-app
```

From there you can use the `run` command to run SipMobile on iOS:

```
$ ns run ios
```

And the same command to run SipMobile on Android:

```
$ ns run android
```

## Configuration File - config.ts

- Located under folder /app/shared/ folder includes OnCore flowchart URL's. These URLs needs to be updated for your organization.

## Known Issues 
- Navigation Bar Disappears on any iOS version greater than iOS 15
- Dark Mode is not Optimized for iOS 
- Back Button Animation Plays two Different Animations   
