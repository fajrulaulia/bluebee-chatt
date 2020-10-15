import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Recentchatt from './RecentChatt'
import Map from './Maps'
import Profile from './Profile'

import GeoPermission from '../../utils/Geolocation'

const GeoPermissionService = new GeoPermission()
const Tab = createBottomTabNavigator();

export default function App() {

  React.useEffect(() => {
    GeoPermissionService.setLocation()
  })
  return (

    
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        activeTintColor: 'blue',
        inactiveTintColor: '#fff',
        style: {
          backgroundColor: '#03254c',
        },
      }}
    >
      <Tab.Screen
        name="recentchatt"
        component={Recentchatt}
        options={{
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="maps"
        component={Map}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="google-maps" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="face-profile" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}