import { createStackNavigator } from '@react-navigation/stack'
import { SearchUserScreen, UserProfileScreen } from '../screens'

const Stack = createStackNavigator();

export default function MainTabs(props) {
    const user = props.extraData
  
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <>
            <Stack.Screen name="SearchUserScreen" component={SearchUserScreen} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen}>
            {/* {props => <UserProfileScreen {...props} extraData={props} />} */}
            </Stack.Screen>
          </>
        </Stack.Navigator>
  
    )
  }
  
