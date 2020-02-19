import React, { Component } from 'react';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";


import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
  TextInput
} from 'react-native';

import { ForeSeeButton } from './ForeSeeButton'
import { styles } from './styles'
import { ForeSee } from 'react-native-foresee-sdk'

const Space = (props) => {
  return (
    <View style={{height: 20}} />
  );
};

async function getContactDetails(type, callback) {
  try {
    var details = await ForeSee.getContactDetails(type);
    callback(details)
  } catch (e) {
    console.error(e);
  }
}

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state={
      siginificantEvent: 0,
      pageViews: 0
    }
 
    ForeSee.setDebugLogEnabled(true)
    ForeSee.startWithConfigurationJson(JSON.stringify(foreSeeConfig))
  }
  
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'flex-start', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/foresee_logo.png')} style={{width: 80, height: 80, alignItems: 'center'}} />

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
            <Space />
            <Text style={[styles.text]}>This sample demonstrates the Contact invite type, which delivers survey links via email or SMS. Use the "Set Contact Details" page to pre-set contact details for the invite. The SDK transitions to an idle state after an invite is displayed. Use "Reset State" to test again. (This will also delete pre-set contact details.). Follow the instructions below to check eligibility. Internet connection is required.</Text>
            <Space />
            <Text style={[styles.text]}>Option 1: The app can trigger an invite by launching 3 times. Try exiting the app and re-entering 3 times, then click the "Check Eligibility" button.</Text>
            <Space />
            <Text style={[styles.text]}>Option 2: Significant events can also be used to trigger an invite. Click the "Increment Significant Event" button below a few times, then click the "Check Eligibility" button to trigger an invite.</Text>
            <ForeSeeButton
              title="Check Eligibility"
              onPress={() => { 
                // Launch an invite as a demo
                ForeSee.checkEligibility() }} />
            <ForeSeeButton
              title="Increment Significant Event"
              onPress={() => { 
                // Increment the significant event count so that we're eligible for an invite
                // based on the criteria in foresee_configuration.json
                ForeSee.incrementSignificantEvent("instant_invite")}} />
            <ForeSeeButton
              title="Set Contact Details"
              onPress={() => { this.props.navigation.navigate('SetContactDetails'); }} />
            <ForeSeeButton
              title="Reset State"
              onPress={() => { ForeSee.resetState() }} />
            <Space />
            <Text style={[styles.text]}>Once the invite is shown, the SDK drops into an idle state until the repeat days have elapsed. Click here to reset the state of the SDK.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

class SetContactDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state={
      email: "",
      phone: ""
    }

    getContactDetails("email", (details) => { this.setState({email: details}) })
    getContactDetails("phone", (details) => { this.setState({phone: details}) })
  }
 
  render() {
    return(
      <SafeAreaView style={styles.container}>
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'flex-start', alignItems: 'center'}}>
          <Space />
          <Image source={require('../assets/foresee_logo.png')} style={{width: 80, height: 80, alignItems: 'center'}} />
          <Space />
          <Text style={[styles.text]}>Email Address:</Text>
          <Space />
          <TextInput
            style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => this.setState( {email: text} )}
            value={this.state.email}
          />
          <Space />
          <Text style={[styles.text]}>Phone Number:</Text>
          <Space />
          <TextInput
            style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => this.setState( {phone: text} )}
            value={this.state.phone}
          />
          <Space />
          <ForeSeeButton
              title="Save"
              style={{ width: 200, height: 40 }}
              onPress={() => { 
                ForeSee.setContactDetails(`${this.state.email}`, "email");
                ForeSee.setContactDetails(`${this.state.phone}`, "phone"); 
              } 
          } />
        </ScrollView>
    </SafeAreaView>
    );
  }
}

const foreSeeConfig = {
	"clientId":"FSRTESTINGCODECID12345==",
	"repeatDaysAfterDecline":5,
	"repeatDaysAfterComplete":5,
	"repeatDaysAfterAccept":3,
	"notificationType":"CONTACT",
	"measures":
	[
		{
			"surveyId":"iphone_app_QA",
			"launchCount": 3,
			"significantEventThresholds": {
				"instant_invite":3
			}
		}
	],
    "cppParameters":
    {
        "sample_app":"Contact Survey 2.0"
    },
	"invite": {
		"logo": "foresee_logo",
		"baseColor": [235, 43, 61]
	}
}

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const AppNavigator = createStackNavigator({
  Main: {
    navigationOptions: {
      title: "Contact Invite Sample"
    },
    screen: MainScreen
  },
  SetContactDetails: {
    navigationOptions: {
      title: "Set Contact Details"
    },
    screen: SetContactDetailsScreen
  }
});

const AppContainer = createAppContainer(AppNavigator);
