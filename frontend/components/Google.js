import React, { useContext, useEffect, useState } from 'react'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  View,
} from 'react-native'
import { Block, Text } from 'galio-framework'

import { Button } from '../components'
import { Images, walletTheme } from '../constants'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import backendApi from '../api/backendGateway'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import LoadingScreen from '../components/LoadingScreen'
import asyncStorage from '@react-native-async-storage/async-storage/src/AsyncStorage'
import WalletContext from '../navigation/WalletContext'

GoogleSignin.configure({
  webClientId:
    '454272373471-5ojg0h21n0et134lvfjgokb9j0ovpsi8.apps.googleusercontent.com',
  androidClientId:
    '454272373471-0rikgi4sqndi5ge4gibbsccu690c4813.apps.googleusercontent.com',
  iosClientId: '',
  scopes: ['profile', 'email'],
})

const logOut = async () => {
  await clearAsyncStorage()
  await GoogleSignin.signOut()
}

const clearAsyncStorage = async () => {
  await AsyncStorage.clear()
}

export { logOut, GoogleSignin }
