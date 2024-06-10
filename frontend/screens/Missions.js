import React, { useContext, useEffect, useState } from 'react'
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
import { TouchableOpacity } from 'react-native-gesture-handler'
const { width, height } = Dimensions.get('screen')

const Missions = () => {
  const [totalXWC, setTotalXWC] = useState(400)

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
    <View style={styles.exchangeCardWrapper}>
      <Text style={styles.exchangeCardText}>{xwc + ' XWC'}</Text>
      <Text style={styles.exchangeCardText}>{'='}</Text>
      <Text style={styles.exchangeCardText}>{xcoin + ' XCN'}</Text>
    </View>
  )

  const missionSchema = [
    {
      key: 0,
      title: 'Completar Registro',
      description: 'Regístrate en la app',
      reward: 50,
      claimed: false,
    },
    {
      key: 1,
      title: 'Verificar Identidad',
      description: 'Verifica tu identidad',
      reward: 100,
      claimed: false,
    },
    {
      key: 2,
      title: 'Hacer Primer Depósito',
      description: 'Realiza tu primer depósito',
      reward: 200,
      claimed: true,
    },
    {
      key: 3,
      title: 'Comprar Criptomoneda',
      description: 'Compra tu primera cripto',
      reward: 150,
      claimed: false,
    },
    {
      key: 4,
      title: 'Configurar 2FA',
      description: 'Configura autenticación dos factores',
      reward: 100,
      claimed: false,
    },
    {
      key: 5,
      title: 'Transferir Criptomonedas',
      description: 'Envía criptomonedas a otros',
      reward: 200,
      claimed: false,
    },
    {
      key: 6,
      title: 'Programa de Referidos',
      description: 'Refiere a un amigo',
      reward: 300,
      claimed: false,
    },
    {
      key: 7,
      title: 'Intercambiar Criptos',
      description: 'Intercambia dos criptomonedas',
      reward: 150,
      claimed: true,
    },
    {
      key: 8,
      title: 'Asistir a Webinar',
      description: 'Asiste a un webinar',
      reward: 100,
      claimed: false,
    },
    {
      key: 9,
      title: 'Mantener Saldo Mínimo',
      description: 'Mantén saldo de $1000',
      reward: 250,
      claimed: false,
    },
  ]

  const [stateMissionSchema, setStateMissionSchema] = useState(missionSchema)

  const handleClaim = (index) => {
    const updatedMissionSchema = [...stateMissionSchema]
    updatedMissionSchema[index].claimed = true
    setTotalXWC(totalXWC + updatedMissionSchema[index].reward)
    setStateMissionSchema(updatedMissionSchema)
    /*
    missionSchema[index].claimed = true;
    setTotalXWC(totalXWC + missionSchema[index].reward);
    
    setStateMissionSchema(missionSchema);
    */
  }

  const CompletedMissions = ({ data }) => (
    <View style={styles.missionsWrapper}>
      <Text style={styles.missionsTitle}>Misiones</Text>

      {data.map((mission, index) => (
        <View style={styles.missionRowWrapper} key={index}>
          <View style={styles.missionsRowColumn}>
            <Text style={styles.missionsRowColumnTitle}>{mission.title}</Text>
            <Text style={styles.missionsRowColumnDescription}>
              {mission.description}
            </Text>
          </View>
          {!mission.claimed ? (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => {
                handleClaim(mission.key)
              }}
            >
              <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.alreadyClaimedIcon}>
              <Text style={styles.alreadyClaimedIconText}>
                {'+' + mission.reward}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  )

  const MissionsToComplete = ({ data }) => (
    <View style={styles.missionsWrapper}>
      <Text style={styles.missionsTitle}>Pendientes</Text>
      {data.map((mission, index) => (
        <View style={styles.missionRowWrapper} key={index}>
          <View style={styles.misisonsRowColumn}>
            <Text style={styles.missionsRowColumnTitle}>{mission.title}</Text>
            <Text style={styles.missionsRowColumnDescription}>
              {mission.description}
            </Text>
          </View>
        </View>
      ))}
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
              <Card title="XWC Totales" style={styles.cardBackgroundColor}>
                <Text style={styles.title}>{totalXWC + ' XWC'}</Text>
              </Card>

              <MiddleText>
                ¡Obtené más XWC completando las diferentes misiones y desafios!
              </MiddleText>

              <CompletedMissions data={stateMissionSchema} />
              <View style={styles.bottomMargin}>
                <MissionsToComplete data={missionSchema} />
              </View>
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
    fontSize: 26,
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
    fontSize: 18,
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
  },
  exchangeCardText: {
    fontSize: 30,
    color: '#5144A6',
    fontWeight: 'bold',
  },
  missionsWrapper: {
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
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
  },
  missionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5144A6',
  },
  missionRowWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionsRowColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  missionsRowColumnTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#545F71',
  },
  missionsRowColumnDescription: {
    fontSize: 16,
    color: '#545F71',
    maxWidth: width * 0.5,
    textWrap: 'wrap',
  },
  claimButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5144A6',
    color: '#FFFFFF',
    fontWeight: 'bold',
    height: 45,
    width: 80,
    borderRadius: 10,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  alreadyClaimedIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEBFF',
    color: '#545F71',
    fontWeight: 'bold',
    height: 45,
    width: 80,
    borderRadius: 10,
  },
  alreadyClaimedIconText: {
    color: '#545F71',
    fontWeight: 'bold',
    fontSize: 15,
  },
  bottomMargin: {
    marginBottom: 200,
  },
})

export default Missions
