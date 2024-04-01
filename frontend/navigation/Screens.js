import { Animated, Dimensions, Easing } from 'react-native'
// header for screens
import { Header, Icon } from '../components'
import { walletTheme, tabs } from '../constants'
// screens
import Home from '../screens/Home'
import Transaction from '../screens/Transaction'
import Profile from '../screens/Profile'
import React from 'react'
import Login from '../screens/Login'
import Search from '../screens/Search'
import AccountDetails from '../screens/AccountDetails'
// settings
import Settings from '../screens/Settings'
import { createStackNavigator } from '@react-navigation/stack'

const { width } = Dimensions.get('screen')
const Stack = createStackNavigator()

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: 'card',
        headerShown: 'screen',
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
      <Stack.Screen
        name="Transaction"
        component={Transaction}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              back
              title="Transaccion"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Search" back navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
      <Stack.Screen
        name="AccountDetails"
        component={AccountDetails}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Recibir"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              back
              title="Perfil"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Configuracion"
              back
              scene={scene}
              navigation={navigation}
            />
          ),
          cardStyle: { backgroundColor: '#F8F9FE' },
        }}
      />
    </Stack.Navigator>
  )
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: 'card',
        headerShown: false,
      }}
    >
      <Stack.Screen name="App" component={HomeStack} />
    </Stack.Navigator>
  )
}
