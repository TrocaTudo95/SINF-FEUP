import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList } from 'react-native'
import { getCustomerDetails, getTopProductsFromCostumer, getNegativeCustomerAccount, getPositiveCustomerAccount, getOpenOportunities } from '../network/customers'
import call from 'react-native-phone-call'

import { Styles, ColorTheme, Hr,Bubble} from '../utils/utils'

import { connect } from 'react-redux'


import Ionicons from "@expo/vector-icons/Ionicons"

class CustomerPage extends React.Component {
  static navigationOptions = ({ navigation }) => {

    return {
      headerTitle: <Text style={Styles.header.title}> Customer Details </Text>,
      headerRight: (
        <View style={{ paddingRight: 10 }}>
          <Ionicons name="ios-contact" size={32} color={ColorTheme.lightGreen} />
        </View>

      )
    };
  };

  state = {
    customer: {}
  }

  componentDidMount() {
    this.mounted = true;
    this.props.navigation.setParams({ fetchCostumers: this.props.navigation.getParam("fetchCustomers") })
    this.costumerId = this.props.navigation.getParam('customerId')
    this.props.navigation.setParams({ getCustomerDetails: this.getCustomerDetails })
    this.getCustomerDetails(this.costumerId);
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  getCustomerDetails = async (customerId) => {
    try {
      const customer = await getCustomerDetails(customerId, this.props.user.primaveraToken)
      if (this.mounted)
        this.setState(() => ({ customer: customer.body, menu: 1 }))
      this.getCustomerTopOrders(customerId);
    }

    catch (err) {
      console.log(err)
    }

  }

  getCustomerTopOrders = async (customerId) => {
    try {
      const topOrders = await getTopProductsFromCostumer(customerId, this.props.user.primaveraToken)
      if (this.mounted)
        this.setState(() => ({ topOrders: topOrders.body.DataSet.Table }))
    }

    catch (err) {
      console.log(err)
    }

  }


  getCustomerAccount = async (costumerId) => {
    try {
      const negativeElements = await getNegativeCustomerAccount(costumerId, this.props.user.primaveraToken)
      const positiveElements = await getPositiveCustomerAccount(costumerId, this.props.user.primaveraToken)
      if (this.mounted)
        this.setState(() => ({ negativeElements: negativeElements.body.DataSet.Table, positiveElements: positiveElements.body.DataSet.Table }))

    }

    catch (err) {
      console.log(err)
    }

  }

  getCustomerOpenOportunities = async (customerId) => {
    try {
      const openOportunities = await getOpenOportunities(customerId, this.props.user.primaveraToken)
      if (this.mounted)
        this.setState(() => ({ openOportunities: openOportunities.body.DataSet.Table }))
    }

    catch (err) {
      console.log(err)
    }

  }

  selectView = (totalPrice, totalQuantity) => {
    let body
    if (this.state.menu == 1) {
      body = (
        <View>
          <FlatList
            data={this.state.topOrders}
            renderItem={({ item, index }) => {
              return (
                <TopItemView
                  item={{ descricao: item.Descricao, total: item.total, total_quantidade: item.total_quantidade }}
                  index={index}
                />
              );

            }}

            keyExtractor={(item, index) => index.toString()}

          />

          <View style={{ flex: -1, flexDirection: 'row', justifyContent: "space-around", paddingTop: 30 }}>
            <View >
            <Bubble fontSize={18} size={150} text={totalPrice + "€"}/>
            </View>
            <View style={styles.info}>
            <Bubble fontSize={18} size={150} text={totalQuantity + " un"}/>
            </View>
          </View>
        </View>)
    }
    else if (this.state.menu == 2) {
      let account = 0;
      if (this.state.negativeElements && this.state.positiveElements) {
        this.state.negativeElements.forEach((item) => {
          account -= (item.TotalIliquido + item.TotalIva);
        })
        this.state.positiveElements.forEach((item) => {
          account += item.totaldocumento;
        })
      }

      body = (
        <View>
          <FlatList
            data={this.state.negativeElements}
            renderItem={({ item, index }) => {
              return (
                <AccountItemView
                  item={{ data: item.Data.substring(0, 10), total: item.TotalIliquido + item.TotalIva, negative: true, descricao: item.Descricao }}
                  index={index}
                />
              );

            }}


            keyExtractor={(item, index) => index.toString()}

          />

          <FlatList
            data={this.state.positiveElements}
            renderItem={({ item, index }) => {
              return (
                <AccountItemView
                  item={{ data: item.data.substring(0, 10), total: item.totaldocumento, descricao: item.descricao, negative: false }}
                  index={index}
                />
              );

            }}


            keyExtractor={(item, index) => index.toString()}

          />
          <Hr color={ColorTheme.lightGrey} lineHeight={2} />

          <View style={{ flex: -1, flexDirection: 'row', justifyContent: "flex-end", paddingTop: 30 }}>
            <View >
              <Text style={account.toFixed(2) < 0 ? { fontSize: 13, color: ColorTheme.red, paddingRight: 15 } : { fontSize: 13, color: ColorTheme.lightGreen, paddingRight: 15 }}>{+account.toFixed(2)}€</Text>
            </View>

          </View>
        </View>)


    }
    else if (this.state.menu == 3) {
      body = (

        <View>
          <View style={{ flex: -1, flexDirection: 'row', justifyContent: "flex-start", paddingTop: 15 }}>
            <View >
              <Text style={{ textAlign: "center", fontSize: 23, color: ColorTheme.lightGrey }}>Open Opportunities</Text>
            </View>
          </View>
          <FlatList
            data={this.state.openOportunities}
            renderItem={({ item, index }) => {
              return (
                <View style={{ paddingLeft: 10, paddingBottom: 15, paddingTop: 10, paddingRight: 15, flexDirection: 'column' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 15 }}> {item.Oportunidade}</Text>
                    <Text style={{ fontSize: 15 }}>{item.Resumo} </Text>
                  </View>
                </View>
              )

            }}

            keyExtractor={(item, index) => index.toString()}

          />


        </View>)
    }
    return body;
  }


  render() {
    let totalPrice = 0;
    let totalQuantity = 0;
    if (this.state.topOrders) {
      this.state.topOrders.forEach((item) => {
        totalPrice += item.total;
        totalQuantity += item.total_quantidade;
      })
    }
    let body = this.selectView(totalPrice, totalQuantity)
    const args = {
      number: this.state.customer.Telefone,
      prompt: false
    }

    return (


      <ScrollView style={styles.container}>
        <View style={{ flex: -1, flexDirection: 'row', justifyContent: "center", alignItems: "center", alignContent: "center", paddingTop: 30 }}>
          <View >
            <Image style={styles.avatar} source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }} />
          </View>


          <View style={{ flex: -1, flexDirection: 'column', justifyContent: "center", alignItems: "center", alignContent: "center", paddingRight: 25, paddingLeft: 25 }}>
            <Text style={styles.name}>{this.state.customer.Nome}</Text>
            <Text style={styles.name}>{this.state.customer.Telefone}</Text>
          </View>
          <View style={{ paddingRight: 10 , marginRight:10}}>
            <TouchableOpacity onPress={() => { call(args).catch(console.error) }}>
              <Ionicons name="ios-call-outline" size={50} color={ColorTheme.lightGreen} />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate("EditCustomer", { customer: this.state.customer, getCustomerDetails: this.props.navigation.getParam('getCustomerDetails'), fetchCostumers: this.props.navigation.getParam('fetchCostumers') }) }}>
              <Ionicons name="md-create" size={40} color={ColorTheme.lightGreen} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.description}>{this.state.customer.Descricao}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-around", paddingBottom: 20 }}>
            <TouchableOpacity onPress={() => { if (this.mounted) this.setState(() => ({ menu: 1 })); if (!this.state.topOrders) this.getCustomerTopOrders(this.costumerId) }}>
              <Text style={this.state.menu == 1 ? { fontSize: 19, textDecorationLine: 'underline', color: ColorTheme.lightGrey } : { fontSize: 18, textDecorationLine: 'none', color: ColorTheme.black }}>Top Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { if (this.mounted) this.setState(() => ({ menu: 2 })); if (!this.state.negativeElements) this.getCustomerAccount(this.costumerId) }}>
              <Text style={this.state.menu == 2 ? { fontSize: 19, textDecorationLine: 'underline', color: ColorTheme.lightGrey } : { fontSize: 18, textDecorationLine: 'none', color: ColorTheme.black }}>Current Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { if (this.mounted) this.setState(() => ({ menu: 3 })); if (!this.state.openOportunities) this.getCustomerOpenOportunities(this.costumerId) }}>
              <Text style={this.state.menu == 3 ? { fontSize: 19, textDecorationLine: 'underline', color: ColorTheme.lightGrey } : { fontSize: 18, textDecorationLine: 'none', color: ColorTheme.black }}>Related</Text>
            </TouchableOpacity>
          </View>
          <Hr color={ColorTheme.lightGrey} lineHeight={2} />
        </View>


        {body}


      </ScrollView>
    )

  }
}
class TopItemView extends React.Component {



  render() {

    return (

      <View style={Styles.products.item}>
      
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
          <View style={{ flex: 2}}>
            <Bubble fontSize={18} size={40} backgroundColor={ColorTheme.lightGreen} text={this.props.index + 1}/>
          </View>
          <Text style={{ flex: 6,fontSize: 17}}> {this.props.item.descricao}</Text>
          <Text style={{  flex: 3, fontSize: 17}}>{this.props.item.total_quantidade} un</Text>
          <Text style={{ flex: 3,fontSize: 17, textAlign:"right"}}>{this.props.item.total}€</Text>
        </View>

      </View>
    )
  }

}


class AccountItemView extends React.Component {


  render() {

    return (

      <View style={{ paddingLeft: 10, paddingBottom: 15, paddingTop: 10, paddingRight: 15, flexDirection: 'column' }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 15 , flex:10}}> {this.props.item.data}</Text>
          <Text style={{ fontSize: 15 , flex:8}}> {this.props.item.descricao}</Text>
          <Text style={this.props.item.negative ? { fontSize: 15, color: ColorTheme.red, flex:4, textAlign:"right"} : { fontSize: 15, color: ColorTheme.lightGreen,flex:4, textAlign:"right" }}>{this.props.item.total}€</Text>
        </View>

      </View>
    )
  }

}

const mapStateToProps = (state) => ({

  user: state.user

})

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 200,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
  },
  name: {
    fontSize: 15,
    color: "#000000",
    fontWeight: '100',
  },
  body: {
    marginTop: 20,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    width: 30,
    height: 30,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: ColorTheme.lightGreen,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "white",
    alignItems: 'center'
  },
});

export default connect(mapStateToProps)(CustomerPage)

