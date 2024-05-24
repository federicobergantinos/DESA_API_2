import React, { useState } from 'react'
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'
const { width, height } = Dimensions.get('screen')

const Buy = () => {
  const BalanceCard = ({ title, children }) => (
    <View style={styles.detailCardBalance}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )
  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )
  const MiddleText = ({ children }) => (
    <View style={styles.descriptionWrapper}>
      <Text style={styles.description}>{children}</Text>
    </View>
  )

  const [StarlinkOpen, setStarlinkOpen] = useState(false)
  const [XOpen, setXOpen] = useState(false)
  const [TeslaOpen, setTeslaOpen] = useState(false)
  const [SpaceXOpen, setSpaceXOpen] = useState(false)

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
              <Card>
                <Text style={styles.balanceText}>XCoin totales</Text>
                <Text style={styles.balanceAmount}>0.00 XCoin</Text>
              </Card>
              <MiddleText>
                <Text style={styles.subtitle}>
                  ¡Utiliza tu XCoin para obtener beneficios increíbles!
                </Text>
              </MiddleText>
              <BalanceCard title="Servicios">
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setStarlinkOpen(!StarlinkOpen)}
                >
                  <Text style={styles.dropdownText}>Starlink</Text>
                  <Icon
                    name={StarlinkOpen ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                {StarlinkOpen && (
                  <View style={styles.dropdownContent}>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>2 XCoin → 2 GB/mes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>4 XCoin → 4 GB/mes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>6 XCoin → 6 GB/mes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>8 XCoin → 8 GB/mes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>
                        10 XCoin → 10 GB/mes
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setXOpen(!XOpen)}
                >
                  <Text style={styles.dropdownText}>X</Text>
                  <Icon
                    name={XOpen ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                {XOpen && (
                  <View style={styles.dropdownContent}>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>2.67 XCoin → Basic</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>7 XCoin → Premium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>
                        14 XCoin → Premium +
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setTeslaOpen(!TeslaOpen)}
                >
                  <Text style={styles.dropdownText}>Tesla</Text>
                  <Icon
                    name={TeslaOpen ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                {TeslaOpen && (
                  <View style={styles.dropdownContent}>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Opción 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Opción 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Opción 3</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setSpaceXOpen(!SpaceXOpen)}
                >
                  <Text style={styles.dropdownText}>SpaceX</Text>
                  <Icon
                    name={SpaceXOpen ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
                {SpaceXOpen && (
                  <View style={styles.dropdownContent}>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Opción 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Opción 2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton}>
                      <Text style={styles.optionText}>Opción 3</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </BalanceCard>
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
  detailCardBalance: {
    backgroundColor: walletTheme.COLORS.WHITE,
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
  detailCard: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
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
    paddingBottom: 200, // Añadir padding al final para asegurarse de que el contenido sea desplazable
  },
  balanceText: {
    color: '#F2F2F2',
    fontSize: 18,
    marginTop: -30,
  },
  balanceAmount: {
    color: '#F2F2F2',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: theme.SIZES.BASE / 2,
  },
  button: {
    backgroundColor: '#5D4EBF',
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F2F2F2',
    fontSize: 18,
  },
  subtitle: {
    color: '#F2F2F2',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  dropdownButton: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dropdownText: {
    color: '#F2F2F2',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
  dropdownContent: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: walletTheme.COLORS.WHITE,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  optionText: {
    color: walletTheme.COLORS.VIOLET,
    fontSize: 16,
    textAlign: 'center',
  },
  descriptionWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingTop: 20,
    paddingLeft: 50,
    paddingRight: 50,
  },
  description: {
    fontSize: 17,
    color: '#FFFFFF',
    textAlign: 'center',
  },
})

export default Buy
