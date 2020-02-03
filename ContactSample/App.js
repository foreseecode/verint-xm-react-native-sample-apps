
import React, { Component } from 'react';

import { 
  Text, 
  View, 
  Image, 
  SafeAreaView,
  ScrollView, 
} from 'react-native';

import { ForeSeeButton } from './ForeSeeButton'
import { styles } from './styles'
import { ForeSee } from 'react-native-foresee-sdk'

const Space = (props) => {
  return (
    <View style={{height: 20}} />
  );
};

class App extends Component {
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
        <ScrollView style={{width: '90%'}} contentContainerStyle={{flexGrow : 1, justifyContent : 'center', alignItems: 'center'}}>
          <Space />
          <Image source={require('./assets/foresee_logo.png')} style={{width: 80, height: 80, alignItems: 'center'}} />

          <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
            <Space />
            <Text style={[styles.text]}>This sample demonstrates the Contact invite type, which delivers survey links via email or SMS. Use the "Set Contact Details" page to pre-set contact details for the invite. The SDK transitions to an idle state after an invite is displayed. Use "Reset State" to test again. (This will also delete pre-set contact details.). Follow the instructions below to check eligibility. Internet connection is required.</Text>
            <Space />
            <Text style={[styles.text]}>Option 1: The app can trigger an invite by launching 3 times. Try exiting the app and re-entering again.</Text>
            <Space />
            <Text style={[styles.text]}>Option 2: Significant events can also be used to trigger an invite. Click the button below a few times to trigger an invite.</Text>
            <ForeSeeButton
              title="Check Eligibility"
              onPress={() => { 
                // Increment the significant event count so that we're eligible for an invite
                // based on the criteria in foresee_configuration.json
                ForeSee.incrementSignificantEvent("instant_invite")
                
                // Launch an invite as a demo
                ForeSee.checkEligibility() }} />
            
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

export default App;