import React from 'react'
import { StyleSheet, View, Picker } from 'react-native'
import PropTypes from 'prop-types'

import Icon from './Icon'
import { walletTheme } from '../constants'

class StyledPicker extends React.Component {
  render() {
    const { shadowless, success, error, selectedValue, onValueChange, items } =
      this.props

    const pickerStyles = [
      styles.input,
      !shadowless && styles.shadow,
      success && styles.success,
      error && styles.error,
      { ...this.props.style },
    ]

    return (
      <View style={pickerStyles}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={{ flex: 1 }}
        >
          {items.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
        <Icon
          size={14}
          color={walletTheme.COLORS.ICON}
          name="link"
          family="AntDesign"
        />
      </View>
    )
  }
}

StyledPicker.defaultProps = {
  shadowless: false,
  success: false,
  error: false,
  items: [],
}

StyledPicker.propTypes = {
  shadowless: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  selectedValue: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 4,
    borderColor: walletTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  success: {
    borderColor: walletTheme.COLORS.INPUT_SUCCESS,
  },
  error: {
    borderColor: walletTheme.COLORS.INPUT_ERROR,
  },
  shadow: {
    shadowColor: walletTheme.COLORS.BLACK,
    backgroundColor: '#FFF',
    shadowOffset: { width: 0, height: 0.5 },
    shadowRadius: 1,
    shadowOpacity: 0.13,
    elevation: 2,
  },
})

export default StyledPicker
