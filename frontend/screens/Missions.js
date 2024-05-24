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

const Buy = () => {

  const [totalXWC, setTotalXWC] = useState(400);

  // Creating separate cards for each detail
  const Card = ({ title, children }) => (
    <View style={styles.detailCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  )

  const NewCardButton = ({title, children}) => {
    return(
      <View style={styles.newCardCentered}>
        {children}
      </View>
    )
  }

  const MiddleText = ({children}) => (
    <View style={styles.descriptionWrapper}>
      <Text style={styles.description}>{children}</Text>
    </View>
  )

  const ExchangeCard = ({xwc, xcoin}) => (
    <View style={styles.exchangeCardWrapper}>
      <Text style={styles.exchangeCardText}>{xwc + " XWC"}</Text>
      <Text style={styles.exchangeCardText}>{"="}</Text>
      <Text style={styles.exchangeCardText}>{xcoin + " Xcoin"}</Text>
      

    </View>
  )


 
  const missionSchema = [{
    key: 0,
    title: 'Misión 1',
    description: 'Descripción de la misión 1',
    reward: 100,
    claimed: false,
  },
  {
    key: 1,
    title: 'Misión 2',
    description: 'Descripción de la misión 2',
    reward: 100,
    claimed: true,
  },
  {
    key: 2,
    title: 'Misión 3',
    description: 'Descripción de la misión 3',
    reward: 300,
    claimed: true,
  },
  {
    key: 3,
    title: 'Misión 4',
    description: 'Descripción de la misión 4',
    reward: 400,
    claimed: false, 
  },
  {
    key: 4,
    title: 'Misión 5',
    description: 'Descripción de la misión 5',
    reward: 400,
    claimed: false, 
  },
  {
    key: 5,
    title: 'Misión 6',
    description: 'Descripción de la misión 5',
    reward: 400,
    claimed: false, 
  }
  ]

  const [stateMissionSchema, setStateMissionSchema] = useState(missionSchema);

  const handleClaim = (index) => {

    const updatedMissionSchema = [...stateMissionSchema];
    updatedMissionSchema[index].claimed = true;
    setTotalXWC(totalXWC + updatedMissionSchema[index].reward);
    setStateMissionSchema(updatedMissionSchema);
    /*
    missionSchema[index].claimed = true;
    setTotalXWC(totalXWC + missionSchema[index].reward);
    
    setStateMissionSchema(missionSchema);
    */
  }

  const CompletedMissions = ({data}) => (
    <View style={styles.missionsWrapper}>
      <Text style={styles.missionsTitle}>Misiones Completadas</Text>
      
        {data.map((mission, index) => (
          <View style={styles.missionRowWrapper} key={index}>
          <View style={styles.missionsRowColumn} >
            <Text style={styles.missionsRowColumnTitle}>{mission.title}</Text>
            <Text style={styles.missionsRowColumnDescription}>{mission.description}</Text>
          </View>
          {!mission.claimed ? <TouchableOpacity style={styles.claimButton} onPress={() => {handleClaim(mission.key)}}><Text style={styles.claimButtonText}>Claim</Text></TouchableOpacity> : <View style={styles.alreadyClaimedIcon}><Text style={styles.alreadyClaimedIconText}>{"+" + mission.reward}</Text></View>}
          </View>
        ))}
      

    </View>
  )

  const MissionsToComplete = ({data}) => (
    <View style={styles.missionsWrapper}>
      <Text style={styles.missionsTitle}>Misiones a completar</Text>
        {
          data.map((mission, index) => (
            <View style={styles.missionRowWrapper} key={index}>
              <View style={styles.misisonsRowColumn}>
                <Text style={styles.missionsRowColumnTitle}>{mission.title}</Text>
                 <Text style={styles.missionsRowColumnDescription}>{mission.description}</Text>
              </View>
            </View>
          ))
        }
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
              {/* Buy1 */}
              <Card title="XWC Totales" style={styles.cardBackgroundColor}>
                <Text style={styles.title}>{ totalXWC + " XWC"}</Text>
              </Card>

              {/* Buy2 */}
              <NewCardButton>
                <Text style={styles.newCardText}>Misiones</Text>
              </NewCardButton>

              <MiddleText>¡Obtené más XWC completando las diferentes misiones y desafios!</MiddleText>

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
    fontSize: 22,
    marginBottom: theme.SIZES.BASE / 2,
    color: '#FFFFFF'
  },
  title: {
    fontSize: 34,
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
    fontSize: 25,
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
    gap: 10,
  },
  missionsRowColumnTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#545F71',
  },
  missionsRowColumnDescription: {
    fontSize: 16,
    color: '#545F71',
    maxWidth: 90,
    textWrap: 'wrap',
  },
  claimButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5144A6',
    color: '#FFFFFF',
    fontWeight: 'bold',
    height: 56,
    width: 91,
    borderRadius: 10,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  alreadyClaimedIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEBFF',
    color: '#545F71',
    fontWeight: 'bold',
    height: 56,
    width: 91,
    borderRadius: 10,
  },
  alreadyClaimedIconText: {
    color: '#545F71',
    fontWeight: 'bold',
    fontSize: 20,
  },
  bottomMargin: {
    marginBottom: 200,
  },


})

export default Buy
