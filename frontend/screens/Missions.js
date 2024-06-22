import React, { useContext, useEffect, useState } from 'react'
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
import backendApi from '../api/backendGateway'
import { useWallet } from '../navigation/WalletContext'
import LoadingScreen from '../components/LoadingScreen'

const { width, height } = Dimensions.get('screen')

const Missions = () => {
  const { user } = useWallet()
  const [totalXWC, setTotalXWC] = useState(0)
  const [missions, setMissions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserTokenBalance = async () => {
      try {
        const response = await backendApi.userTokensGateway.getUserTokenBalance(
          user.id
        )
        setTotalXWC(response.response.balance)
      } catch (error) {
        console.error('Error fetching user token balance:', error)
      }
    }

    const fetchUserMissions = async () => {
      try {
        const response = await backendApi.missionsGateway.getMissionsForUser(
          user.id
        )
        setMissions(response.response)
      } catch (error) {
        console.error('Error fetching user missions:', error)
        setMissions([])
      }
    }

    fetchUserTokenBalance()
    fetchUserMissions()
  }, [user.id])

  const handleClaim = async (missionId, reward, index) => {
    Alert.alert(
      'Confirmar Reclamo',
      `¿Estás seguro de que deseas reclamar ${reward} XWC?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              setIsLoading(true)
              await backendApi.missionsGateway.updateMission(missionId, {
                claimed: true,
              })
              await backendApi.userTokensGateway.updateUserTokens(
                user.id,
                totalXWC + reward
              )
              setTotalXWC(totalXWC + reward)
              const updatedMissions = [...missions]
              updatedMissions[index].claimed = true
              setMissions(updatedMissions)
              setIsLoading(false)
              console.log(`Reclamando ${reward} XWC`)
            } catch (error) {
              setIsLoading(false)
              console.error('Error reclamando la misión:', error)
            }
          },
        },
      ],
      { cancelable: false }
    )
  }

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

  const MissionsList = ({ data }) => (
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
              style={[
                styles.claimButton,
                !mission.fulfilled && styles.disabledButton,
              ]}
              onPress={() =>
                mission.fulfilled &&
                handleClaim(mission.id, mission.reward, index)
              }
              disabled={!mission.fulfilled}
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

  return (
    <Block flex style={styles.home}>
      <ImageBackground source={Images.Background} style={styles.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width }}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Card title="XWC Totales" style={styles.cardBackgroundColor}>
            <Text style={styles.title}>{totalXWC + ' XWC'}</Text>
          </Card>

          <MiddleText>
            ¡Obtené más XWC completando las diferentes misiones y desafíos!
          </MiddleText>

          <MissionsList data={missions} />
        </ScrollView>
      </ImageBackground>
      {isLoading && <LoadingScreen />}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#545F71',
  },
  missionsRowColumnDescription: {
    fontSize: 14,
    color: '#545F71',
    maxWidth: width * 0.5,
    flexWrap: 'wrap',
    textAlign: 'justify',
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
  disabledButton: {
    backgroundColor: '#CCC',
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
})

export default Missions
