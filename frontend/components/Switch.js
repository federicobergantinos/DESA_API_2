import React from 'react'
import { Switch, Platform } from 'react-native'

import walletTheme from '../constants/Theme'

class MkSwitch extends React.Component {
  render() {
    const { value, ...props } = this.props
    const thumbColor =
      Platform.OS === 'ios'
        ? null
        : Platform.OS === 'android' && value
          ? walletTheme.COLORS.SWITCH_ON
          : walletTheme.COLORS.SWITCH_OFF

    return (
      <Switch
        value={value}
        thumbColor={thumbColor}
        ios_backgroundColor={walletTheme.COLORS.SWITCH_OFF}
        trackColor={{
          false: walletTheme.COLORS.SWITCH_ON,
          true: walletTheme.COLORS.SWITCH_ON,
        }}
        {...props}
      />
    )
  }
}

export default MkSwitch
