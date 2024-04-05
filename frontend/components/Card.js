import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import { Block, Text, theme } from 'galio-framework'
import { useNavigation } from '@react-navigation/native' // Importa useNavigation
import { walletTheme } from '../constants'
import { AirbnbRating } from 'react-native-ratings'
const { height, width } = Dimensions.get('window')

const Card = ({ item, horizontal, style }) => {
  const navigation = useNavigation() // Usa el hook useNavigation

  const cardContainer = [
    styles.card,
    styles.shadow,
    horizontal ? null : styles.cardVertical,
    style,
  ]
  const imgContainer = [
    styles.imageContainer,
    horizontal ? styles.horizontalStyles : styles.verticalStyles,
    styles.shadow,
  ]

  return (
    <Block row={horizontal} card flex style={cardContainer}>
      <TouchableWithoutFeedback>
        <Block flex>
          <Block flex style={styles.cardDescription}>
            <Block flex>
              <Text
                size={14}
                style={styles.cardTitle}
                color={walletTheme.COLORS.TEXT}
              >
                {item.title}
              </Text>
            </Block>
            <Block flex>
              <Block flexDirection="row-reverse" alignItems="flex-end">
                <Text
                  style={{
                    textAlign: 'right',
                    alignSelf: 'flex-end',
                    fontFamily: 'open-sans-bold',
                  }}
                  size={12}
                  color={walletTheme.COLORS.ACTIVE}
                  bold
                >
                  Ver
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </TouchableWithoutFeedback>
    </Block>
  )
}

Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
  ctaRight: PropTypes.bool,
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 50,
    marginBottom: 4,
  },
  cardVertical: {
    maxWidth: width / 2 - theme.SIZES.BASE,
  },
  cardTitle: {
    paddingBottom: 6,
    fontFamily: 'open-sans-regular',
  },
  cardDescription: {
    justifyContent: 'space-betweenm',
    padding: theme.SIZES.BASE / 2,
    borderWidth: 0,
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  shadow: {
    shadowColor: '#8898AA',
    backgroundColor: '#FFF',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
})

export default Card
