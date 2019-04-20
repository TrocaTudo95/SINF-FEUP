import React from 'react'

import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'

import { connect } from 'react-redux'

import { opportunityActions } from '../redux/actions'

import { Styles } from '../utils/utils'

import Ionicons from '@expo/vector-icons/Ionicons'

import { Badge } from 'react-native-elements'

import { ColorTheme, Hr } from '../utils/utils'

import { fetchOpportunityList } from '../network/opportunities'

import { DrawerActions } from 'react-navigation-drawer'

import moment from 'moment';



class OpportunityList extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text style={Styles.header.title}>Opportunity List</Text>
      ),
      headerRight: (
        <View>
          <TouchableOpacity onPress={() => { navigation.getParam('fetchOpportunityList')() }}>
          <View style={{ paddingRight: 15 }}>
              <Ionicons name="ios-refresh" size={36} color={ColorTheme.lightGreen} />
            </View>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: (

        <View>
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            > 
              <View style={{ paddingLeft: 10 }}>
                <Ionicons name='ios-menu-outline' size={32} color={ColorTheme.lightGreen}></Ionicons>
              </View>

              
          </TouchableOpacity>
        </View>

      )
    };
  };

  state = {
    loading: false,
    text: 'Fetching opportunities from Primavera...'
  }



  state = {
    loading: false,
    text: 'Fetching opportunities from Primavera...'
  }

  componentDidMount() {
    this.fetchOpportunityList()
    this.props.navigation.setParams({ fetchOpportunityList: this.fetchOpportunityList })
  }

  fetchOpportunityList = async () => {

    this.setState(() => ({ loading: true }))

    try {

      const opportunitiesResponse = await fetchOpportunityList(this.props.user.primaveraToken, this.props.user.salesmanCode)

      this.props.updateOpportunities(opportunitiesResponse.body.DataSet.Table)
      this.setState(() => ({ loading: false, text: 'Fetching opportunities from Primavera...' }))

    }

    catch (error) {

      this.props.updateOpportunities([])
      this.setState(() => ({ loading: false, text: 'Could not connect to Primavera, please try again: ' + error.error }))
    }
  }


  render() {
    return (
      <View style={Styles.products.mainView}>
        {this.state.loading
          ?
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator color={ColorTheme.lightGreen} style={{ paddingRight: 5, paddingTop: 14.7, paddingBottom: 14.7 }} />
            <Text style={{ color: ColorTheme.strongGrey }}>{this.state.text}</Text>
          </View>
          :
          <FlatList
            data={this.props.opportunities}
            renderItem={({ item }) => {

              return (
                <OpportunityItemView navigation={this.props.navigation}

                  item={{
                    opptyID: item.id,
                    opptyCode: item.oportunidade,
                    opptyDescription: item.descricao,
                    opptyClient: item.entidade,
                    // opptyCreationDate: moment(item.datacriacao).format("DD-MM-YYYY"),
                    opptyDueDate: moment(item.dataexpiracao).format("DD-MM-YYYY"),
                    opptyPrice: item.totalpropostas,
                    opptyState: item.estadovenda,
                  }}
                  fetchOpportunityList={this.fetchOpportunityList}
                />
              );

            }}

            keyExtractor={(item, index) => index.toString()}
          />
        }

        <View elevation={5} style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          borderRadius: 30,
          backgroundColor: ColorTheme.lightGreen
        }} >
          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate("AddOpportunity", { fetchOpportunities: this.props.navigation.getParam('fetchOpportunityList') })  }}
          >
            <Ionicons style={{ marginVertical: 10, marginHorizontal: 16 }} name='md-add' size={32} color={ColorTheme.white}></Ionicons>
          </TouchableOpacity>
        </View>

      </View>

    )

  }

}

class OpportunityItemView extends React.Component {

  constructor(props) {
    super(props)
  }

  getBadgeColor(idx) {
    const colors = ['#029CBF', '#29D12F', '#c90a0a'] //Blue, Green,  Red

    return colors[idx];
  }


  render() {
    return (

      <View>
        <TouchableOpacity onPress={() => {
          this.props.navigation
            .navigate('OpportunityDetails', { opptyID: this.props.item.opptyID, opptyCode: this.props.item.opptyCode, fetchOpportunityList: this.props.fetchOpportunityList })
        }}>
          <View style={Styles.opportunities.itemContainer}>

            <View style={{ paddingLeft:10,flex: 2 }}>
              <Text style={{ fontSize: 14 }}>{this.props.item.opptyDescription}</Text>
              <Badge containerStyle={{ backgroundColor: this.getBadgeColor(this.props.item.opptyState), marginTop: 5.3, height: 30 }}>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                  {['Aberta', 'Ganha', 'Perdida'][this.props.item.opptyState]}
                </Text>
              </Badge>
            </View>

            <View style={[Item.priceDate, {flex: 1}]}>
              {/* <Text style={{ fontSize: 13, textAlign: 'center' }}>{this.props.item.opptyPrice + '€'}</Text> */}
              <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 7 }}>{this.props.item.opptyDueDate}</Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', paddingRight: 10 }}>
              <Text style={{ textAlign: 'right', fontSize: 16 }}> {this.props.item.opptyClient}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={15} />
      </View>
    )
  }

}

const Item = StyleSheet.create({
  priceDate: {
    flexGrow: 2,
    justifyContent: 'space-evenly',
  },
})

const mapStateToProps = state => ({
  opportunities: state.opportunities,
  user: state.user
})

const actionTriggers = {
  updateOpportunities: opportunityActions.updateOpportunities
}


export default connect(mapStateToProps, actionTriggers)(OpportunityList)