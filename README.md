# NativeScript SipMobile App
SIP Mobile App is a NativeScript-built iOS and Android app for displaying SIP Flowcharts. 

## Environment

- Nativescript Version: 8.1.4
- Xcode 12.4 (12D4e)
- Android Studio 4.2.1
- Node 16

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
$ tns run ios
```

And the same command to run SipMobile on Android:

```
$ tns run android
```

## Configuration File - config.ts

- Located under folder /app/shared/ folder includes OnCore flowchart URL's. These URLs needs to be updated for your organization.

## Known Issues
- Back Button Animation Plays two Different Animations 
