//Import navigation and icons
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Import screens needed in navbar
import { HomeScreen, NewPost, SearchUserNavigater } from '../screens'


//Define const for navigation (bottom navbar)
const Tab = createMaterialBottomTabNavigator();


//Define function to navigate using bottom navbar (if user is connected)
export default function MainTabs(props) {

  //Define const for connected user (got it from App.js' return)
  const user = props.extraData

  //Return the navbar
  return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
        <>
          {/* Home screen */}
          <Tab.Screen
            name="HomeScreen"
            options={{
              tabBarLabel: 'Accueil',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          >
            {(props) => <HomeScreen {...props} extraData={user}></HomeScreen>}
          </Tab.Screen>

          {/* New post creation */}
          <Tab.Screen
            name="NewPost"
            options={{
              tabBarLabel: 'Poster',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="plus" color={color} size={26} />
              ),
            }}>
            {(props) => <NewPost {...props} extraData={user}></NewPost>}
          </Tab.Screen>

          {/* Search for a user */}
          <Tab.Screen
            name="SearchUserNavigater"
            component={SearchUserNavigater}
            options={{
              tabBarLabel: 'Recherche',
              header: () => null,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account-search" color={color} size={26} />
              ),
            }}
          >
          </Tab.Screen>
        </>
      </Tab.Navigator>



  )
}

