## foresee-sdk-react-native-sample-apps

## Requirements

* react: 18.2.0
* react-native: 0.72.3
* Android: 22+
* iOS: 11.0+
* ForeSee React Native SDK 2.0.0

## Installing
Clone this repo:

    $ git clone https://github.com/foreseecode/foresee-sdk-react-native-sample-apps.git

Once it's done, you will find 3 project folders:
  
    InSessionSample
    ContactSample
    LocalNotificationSample

In each project folder, run
  
    $ npm install
    $ cd ios
    $ pod install

To start a project, run
    
    $ npx react-native run-ios
    or..
    $ npx react-native run-android

## Projects

## InSessionSample
This sample project demonstrates a basic implementation of the ForeSee CXMeasure In Session Invite code in an empty app.
It uses a native view to show a modal dialog to the user inviting them to take a survey when they have met the 
configured threshold.


## ContactInvitationSample
This example shows how to provide a user's contact information to the SDK for use in a CONTACT mode survey.


## LocalNotificationSample
This sample project demonstrates a local notification invite. Accept the invite and then close the application. 
You will receive a local notification linking the survey.
