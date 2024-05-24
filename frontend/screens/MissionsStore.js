import React from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { theme, Block } from 'galio-framework'
import { Images, walletTheme } from '../constants'

const { width, height } = Dimensions.get('screen')

const MissionsStore = () => {
  // Creating separate cards for each detail
  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  const NewCardButton = ({ title, children }) => {
    return <View style={styles.newCardCentered}>{children}</View>
  }

  const MiddleText = ({ children }) => (
    <View style={styles.descriptionWrapper}>
      <Text style={styles.description}>{children}</Text>
    </View>
  )

  const ExchangeCard = ({ xwc, xcoin }) => (
    <TouchableOpacity
      style={styles.exchangeCardWrapper}
      onPress={() => handleExchange(xwc, xcoin)}
    >
      <Text style={styles.exchangeCardText}>{xwc + ' XWC'}</Text>
      <Text style={styles.exchangeCardText}>{'='}</Text>
      <Text style={styles.exchangeCardText}>{xcoin + ' XCN'}</Text>
    </TouchableOpacity>
  )

  const handleExchange = (xwc, xcoin) => {
    Alert.alert(
      'Confirmar Transacción',
      `¿Estás seguro de que deseas intercambiar ${xwc} XWC por ${xcoin} XCN?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: () => {
            // Aquí puedes manejar la lógica de intercambio
            console.log(`Intercambiando ${xwc} XWC por ${xcoin} XCN`)
          },
        },
      ],
      { cancelable: false }
    )
  }

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
              {/* MissionsStore1 */}
              <Card title="XWC Totales" style={styles.cardBackgroundColor}>
                <Text style={styles.title}>400 XWC</Text>
              </Card>

              <MiddleText>
                Canjea tus XWC por XCN para tener en tu cuenta y acceder a
                beneficios increibles
              </MiddleText>

              <Card title="Opciones">
                <View>
                  <ExchangeCard xwc="20000" xcoin="2" />
                  <ExchangeCard xwc="40000" xcoin="4" />
                  <ExchangeCard xwc="60000" xcoin="6" />
                  <ExchangeCard xwc="80000" xcoin="8" />
                  <ExchangeCard xwc="100000" xcoin="10" />
                  <ExchangeCard xwc="120000" xcoin="12" />
                  <ExchangeCard xwc="140000" xcoin="14" />
                </View>
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
    flex: 1,
    marginTop: 0,
  },
  background: {
    width: width,
    height: height * 1.1,
    marginTop: -100,
  },
  detailCard: {
    backgroundColor: walletTheme.COLORS.VIOLET,
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
    fontSize: 20,
    marginBottom: theme.SIZES.BASE / 2,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.WHITE,
  },
  description: {
    fontSize: 14,
    color: theme.COLORS.BLACK,
    textAlign: 'justify',
  },
  scrollViewContent: {
    paddingTop: 100,
    paddingBottom: 150, // Añadido para asegurar que haya suficiente contenido para desplazarse
  },
  cardBackgroundColor: {
    backgroundColor: '#000000',
  },
  centerCard: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newCardCentered: {
    backgroundColor: walletTheme.COLORS.VIOLET,
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: theme.SIZES.BASE,
    borderRadius: theme.SIZES.BASE / 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
    display: 'flex',
    alignItems: 'center',
    color: '#FFFFFF',
  },
  newCardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  exchangeCardWrapper: {
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: '#5144A6',
  },
  exchangeCardsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingTop: 30,
    marginBottom: 200,
  },
  exchangeCardText: {
    fontSize: 18,
    color: '#5144A6',
    fontWeight: 'bold',
  },
})

export default MissionsStore
