import React from 'react';

import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from "@expo/vector-icons/Ionicons"

import { Styles, ColorTheme, Bubble } from '../utils/utils'

import { connect } from 'react-redux'
import moment from 'moment';
import { DrawerActions } from "react-navigation-drawer";

import { getMonthSalesForecast, getOpenLeads, getTotalOrdersMonth, getNextTask, getOportunitiesStatus } from '../network/dashboard'

import BarChart from '../utils/BarChart'

class Dashboard extends React.Component {

  static navigationOptions = ({ navigation }) => {

    return {
      headerTitle: <Text style={Styles.header.title}>Dashboard</Text>,
      headerRight: (
        <View>
          <TouchableOpacity onPress={() => navigation.getParam('fetchData')()}>
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

      ),

    };
  };

  state = {
    forecastSales: 0,
    openLeads: 0,
    sales: 0,
    opportunitiesStatus: []
  }

  componentDidMount = () => {

    this.fetchData()
    this.props.navigation.setParams({ fetchData: this.fetchData })

  };

  fetchData = async () => {

    if (!false) {

      const salesForecast = await getMonthSalesForecast(this.props.user.salesmanCode, this.props.user.primaveraToken)
      this.setState(() => ({ forecastSales: parseFloat(salesForecast.body.DataSet.Table[0].total / 1000).toFixed(2) }))
    }

    if (!false) {

      const openLeads = await getOpenLeads(this.props.user.salesmanCode, this.props.user.primaveraToken)
      this.setState(() => ({ openLeads: openLeads.body.DataSet.Table[0].OpenLeads }))

    }

    if (!false) {
      const sales = await getTotalOrdersMonth(this.props.user.salesmanCode, this.props.user.primaveraToken)
      this.setState(() => ({ sales: parseFloat(sales.body.DataSet.Table[0].total / 1000).toFixed(2) }))
    }

    if (!false) {
      const nextTask = await getNextTask(this.props.user.salesmanCode, this.props.user.primaveraToken)
      if (nextTask.body.DataSet.Table[0])
        this.setState(() => ({ resumo: nextTask.body.DataSet.Table[0].Resumo, data: Math.abs(moment().diff(nextTask.body.DataSet.Table[0].DataInicio, 'minutes')) }))
    }

    if (!false) {
      const opportunitiesStatus = await getOportunitiesStatus(this.props.user.salesmanCode, this.props.user.primaveraToken)

      let countArray = [0, 0, 0]
      for (let i = 0; i < opportunitiesStatus.body.DataSet.Table.length; i++) {
        countArray[opportunitiesStatus.body.DataSet.Table[i].EstadoVenda] = opportunitiesStatus.body.DataSet.Table[i].Ocorrencias
      }

      this.setState(() => ({ opportunitiesStatus: countArray }))

    }
  }


  render = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', padding: 10 }}>
          <Bubble style={{ flex: 2 }} color={ColorTheme.red} fontSize={24} size={115} fontSize={14} text={`Month Sales Forecast\n ${this.state.forecastSales}` + "K"} />
          <Bubble color={'#ffcc00'} fontSize={24} size={115} fontSize={14} text={`Open Leads\n ${this.state.openLeads}`} />
          <Bubble color={ColorTheme.lightGreen} fontSize={24} size={115} fontSize={14} text={`Orders\n ${this.state.sales}` + "K"} />

        </View>
       

        {this.state.opportunitiesStatus.length > 0 ?
          <View style={{ padding: 10}}>
           <Text style={{textAlign:'center',paddingBottom:20, fontSize:20}}>Leads Status</Text>
            <BarChart barsValue={[this.state.opportunitiesStatus[0],
            this.state.opportunitiesStatus[1], this.state.opportunitiesStatus[2]]}
              barLables={['Abertas', 'Ganhas', 'Perdidas']}
              barsColour={['#00A3CC', '#47D147', '#B10']} barsHeight={50}
              barLabelsPaddingLeft={5} barsMarginBottom={3} />
          </View>
          : <View></View>
        }


        <View style={{ flexDirection: 'row', justifyContent: 'center', height: "15%" }}>
          <View style={{ justifyContent: 'center', alignContent: 'center', width: '80%', borderRadius: 12, borderColor: 'black', borderWidth: 3, marginBottom: 15 }}>
            <Text style={{ textAlign: 'center', fontSize: 20 }} >{this.state.resumo} in {parseInt((this.state.data) / 60)} hours and {parseInt(this.state.data % 60)} mins</Text>
          </View>
        </View>
      </View>
    )

  }

}


const mapStateToProps = state => ({

  tasks: state.tasks,
  user: state.user

})

export default connect(mapStateToProps)(Dashboard)