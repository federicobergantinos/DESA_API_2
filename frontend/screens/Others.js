import React, { useContext, useEffect } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
const { width, height } = Dimensions.get('screen')

const Others = () => {
  // Creating separate cards for each detail
  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          {
            <>
              {/* Card1 */}
              <Card title="Card1">
                <Text style={styles.title}>Card1</Text>
                <Text style={styles.description}>Card1</Text>
              </Card>

              {/* Card2 */}
              <Card title="Card2">
                <Text style={styles.title}>Card2</Text>
                <Text style={styles.description}>Card2</Text>
              </Card>
            </>
          }
        </ScrollView>
      </ImageBackground>
    </Block>
  )
}

const styles = StyleSheet.create({
  home: {
    marginTop: 0,
  },
  background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  detailCard: {
    backgroundColor: theme.COLORS.WHITE,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: theme.SIZES.BASE / 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    textAlign: 'justify',
  },
  scrollViewContent: {
    paddingTop: 100,
  },
})

export default Others
