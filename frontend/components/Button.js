import React from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Button } from 'galio-framework'

import walletTheme from '../constants/Theme'

class ArButton extends React.Component {
  render() {
    const { small, shadowless, children, color, style, fontSize, ...props } =
      this.props

    const colorStyle = color && walletTheme.COLORS[color.toUpperCase()]

    const buttonStyles = [
      small && styles.smallButton,
      color && { backgroundColor: colorStyle },
      !shadowless && styles.shadow,
      { ...style },
    ]

    return (
      <Button
        style={buttonStyles}
        shadowless
        textStyle={{ fontSize: fontSize || 12, fontWeight: '700' }}
        {...props}
      >
        {children}
      </Button>
    )
  }
}

ArButton.propTypes = {
  small: PropTypes.bool,
  shadowless: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      'default',
      'primary',
      'secondary',
      'info',
      'error',
      'success',
      'warning',
    ]),
  ]),
}

const styles = StyleSheet.create({
  smallButton: {
    width: 75,
    height: 28,
  },
  shadow: {
    backgroundColor: '#FFF',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
})

export default ArButton
