import React from 'react';

import { View, ScrollView, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Badge } from 'react-native-elements';

import { connect } from 'react-redux';

import { opportunityActions } from '../redux/actions';

import moment from 'moment';

import { Styles, Hr, ColorTheme } from '../utils/utils';

import { fetchOpportunityDetails, fetchOpportunityTasks, changeOpportunityState, makeOrder } from '../network/opportunities';

import Ionicons from '@expo/vector-icons/Ionicons';

import {OpportunityProducts} from '../views/AddOpportunity'

class Opportunity extends React.Component {


    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <Text style={Styles.header.title}>Opportunity</Text>
        };
    };

    state = { loading: false, products: [], 'tasks': [] }

    componentDidMount() {
        this.fetchOpportunityDetails();
    }

    fetchOpportunityDetails = async () => {
        const responseOpportunity = await fetchOpportunityDetails(this.props.user.primaveraToken, this.props.navigation.state.params.opptyCode)

        const infoArray = responseOpportunity.body.DataSet.Table;

        this.setState({ ...infoArray[0], products: infoArray.filter(product => product.Artigo != null) });

        this.fetchOpportunityTasks();
    }

    fetchOpportunityTasks = async () => {

        let tasks = []
        try {
            const response = await fetchOpportunityTasks(this.props.user.primaveraToken, this.props.navigation.state.params.opptyID)
            tasks = response.body.DataSet.Table
        }
        catch (error) {
            console.log(error)
            console.log("Failed retrieving opportunity tasks...")
        }

        this.setState({ 'tasks': tasks })


    }

    changeOpportunityState = async (state) => {

        this.setState(() => ({loading: true}))

        await changeOpportunityState(this.props.user.primaveraToken, this.props.navigation.state.params.opptyCode, state)

        this.props.navigation.getParam("fetchOpportunityList")()
        this.props.navigation.pop()
    }

    makeOrder = async () => {
        this.setState({ loading: true })

        let requestBody = {}
        requestBody.Tipodoc = "ECL";
        requestBody.Serie = "A";
        requestBody.TipoEntidade = "C";
        requestBody.Entidade = this.state.Entidade;
        requestBody.DataDoc = moment().format("DD/MM/YYYY");
        requestBody.IdOportunidade = this.state.Id;
        requestBody.Linhas = [];

        for (let i = 0; i < this.state.products.length; i++) {
            const lineProduct = this.state.products[i];

            let productBody = {}
            productBody.Artigo = lineProduct.Artigo;
            productBody.Quantidade = lineProduct.Quantidade;
            productBody.Desconto = lineProduct.Desconto;

            requestBody.Linhas.push(productBody);
        }

        await makeOrder(this.props.user.primaveraToken, requestBody)
        await changeOpportunityState(this.props.user.primaveraToken, this.props.navigation.state.params.opptyCode, 1)

        this.props.navigation.getParam("fetchOpportunityList")()
        this.props.navigation.pop()
    }

    calculateTotalProductsWithDiscount = () => {

        const reducerFunction = (accumulator, currentValue) => {
            
            return currentValue.PrecoVenda*(1-0.01*currentValue.Desconto) * currentValue.Quantidade + accumulator

        } 

        return parseFloat(this.state.products.reduce(reducerFunction, 0)).toFixed(2)

    }

    calculateTotalProducts = () => {

        const reducerFunction = (accumulator, currentValue) => {
            
            return currentValue.PrecoVenda * currentValue.Quantidade + accumulator

        } 

        return parseFloat(this.state.products.reduce(reducerFunction, 0)).toFixed(2)

    }

    calculateTotalWithIva = () => {

        const reducerFunction = (accumulator, currentValue) => {
            
            return currentValue.PrecoVenda*(1-0.01*currentValue.Desconto) * currentValue.Quantidade * (1 + currentValue.Iva * 0.01) + accumulator

        } 

        return parseFloat(this.state.products.reduce(reducerFunction, 0)).toFixed(2)

    }

    render() {
        let badgeColor = [ColorTheme.blue, ColorTheme.green, ColorTheme.red][this.state.EstadoVenda]
        let badgeText = ['Aberta', 'Ganha', 'Perdida'][this.state.EstadoVenda]

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ margin: 10 }}>
                    <View>
                        <Badge containerStyle={{ backgroundColor: badgeColor, marginTop: 5.3, paddingVertical: 2, height:30 }}>
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                                {badgeText}
                            </Text>
                        </Badge>
                    </View>

                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 14 }}>{this.state.Oportunidade}</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14 }}>{this.state.DescricaoOportunidade}</Text>
                    </View>
                    <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />

                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ paddingTop: 8 }}>{this.state.Entidade}</Text>
                        <Ionicons name="ios-person" size={32} color={ColorTheme.lightGreen} />
                    </View>

                    <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />

                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ textAlign: 'center', fontSize: 14 }}>{this.state.Resumo}</Text>
                    </View>

                    <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />

                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Products</Text>
                        <TouchableOpacity onPress={() => {} /*this.toggleSelectProducts*/}>
                            <Ionicons name="ios-create-outline" size={25} color={ColorTheme.lightGreen} />
                        </TouchableOpacity>

                    </View>
                    <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />
                    
                    <FlatList
                        style={{ paddingLeft: 20, paddingTop: 5 }}
                        data={this.state.products}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <View style={{ flex: -1, flexDirection: 'row', justifyContent: "space-between", paddingVertical: 5 }}>
                                        <View style={{ flex: 2, flexDirection: 'column', justifyContent: "space-between" }}>
                                            <View>
                                                <Text>
                                                    {item.DescricaoArtigo}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: "steelblue" }}>
                                                    {item.PrecoVenda + " €"}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: "red" }}>
                                                    {item.Quantidade + " " + item.Unidade}
                                                </Text>
                                            </View>
                                        </View>
                                        <ProductPriceDisplay
                                            label={"€/un"}
                                            value={parseFloat(item.PrecoVenda * item.Quantidade).toFixed(2)+ " €"}
                                            color={ColorTheme.black}>
                                        </ProductPriceDisplay>
                                        <ProductPriceDisplay
                                            label={`- ${item.Desconto} %`}
                                            value={parseFloat(item.PrecoVenda*(1-0.01*item.Desconto) * item.Quantidade).toFixed(2) + " €"}
                                            color={"steelblue"}>
                                        </ProductPriceDisplay>
                                        <ProductPriceDisplay
                                            label={"+ IVA"}
                                            value={parseFloat(item.PrecoVenda*(1-0.01*item.Desconto) * item.Quantidade * (1 + item.Iva * 0.01)).toFixed(2) + " €"}
                                            color={ColorTheme.red}>
                                        </ProductPriceDisplay>
                                    </View>
                                    <Hr color={ColorTheme.light2Grey} lineHeight={1} />
                                </View>
                            )
                        }}
                    />

                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{marginRight: 70}}>Total</Text>
                        {/* <View style={{flexDirection:'row'}}> */}
                            <ProductPriceDisplay
                                label={"€/un"}
                                value={this.calculateTotalProducts() + " €"}
                                color={ColorTheme.black}>
                            </ProductPriceDisplay>
                            <ProductPriceDisplay
                                label={"%"}
                                value={this.calculateTotalProductsWithDiscount() + " €"}
                                color={"steelblue"}>
                            </ProductPriceDisplay>
                            <ProductPriceDisplay
                                label={"+ IVA"}
                                value={this.calculateTotalWithIva() + " €"}
                                color={ColorTheme.red}>
                            </ProductPriceDisplay>
                            
                        {/* </View> */}
                    </View>

                    <Hr color={ColorTheme.lightGrey} lineHeight={3} offset={10} />



                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Creation Date</Text>
                        <Text>{moment(this.state.DataCriacao).format('DD-MM-YYYY')}</Text>
                    </View>

                    <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />


                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Due Date</Text>
                        <Text>{moment(this.state.DataExpiracao).format('DD-MM-YYYY')}</Text>
                    </View>

                    {this.state.loading ?

                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <ActivityIndicator size='large' color={ColorTheme.lightGreen}/>
                    </View>

                    : null}

                    {this.state.tasks.length > 0 ?
                        (<View style={{ padding: 10 }}>
                            <Text style={{ marginBottom: 10 }}>Tasks</Text>
                            <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />

                            <FlatList style={{ padding: 3 }} data={this.state.tasks}
                                renderItem={({ item }) => {
                                    return <TaskItem item={item} />
                                }}
                                keyExtractor={(item, index) => index.toString()} />

                            <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />
                        </View>) : null
                    }

                    <View style={{height: 60, width: 60}}></View>
                </ScrollView>
                <View elevation={5} style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    borderRadius: 30,
                    backgroundColor: ColorTheme.lightGreen
                }} >
                    <TouchableOpacity
                        disabled={this.state.products.length == 0 || this.state.loading || this.state.EstadoVenda == 2 || this.state.EstadoVenda == 1}
                        onPress={() => {
                            this.makeOrder()
                        }}
                    >
                        <Text style={{ marginVertical: 15, marginHorizontal: 16, color: ColorTheme.white, fontSize: 18 }}>Make Order</Text>
                    </TouchableOpacity>
                </View>

                <View elevation={5} style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    borderRadius: 30,
                    backgroundColor: ColorTheme.red
                }} >
                    <TouchableOpacity
                        disabled={this.state.loading || this.state.EstadoVenda == 2 || this.state.EstadoVenda == 1}
                        onPress={() => {
                            this.changeOpportunityState(2);
                        }}
                    >
                        <Ionicons style={{ marginVertical: 10, marginHorizontal: 16 }} name='md-close' size={32} color={ColorTheme.white}></Ionicons>

                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
            
class TaskItem extends React.Component {

    state = {}

    render() {
        let textDecoration = 'none'

        if (this.props.item.Estado == 1)
            textDecoration = 'line-through'

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ textDecorationLine: textDecoration }}>{this.props.item.Resumo}</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center' }}>{moment(this.props.item.DataInicio).format('HH:MM')}</Text>
                    <Text>{moment(this.props.item.DataInicio).format('DD/MM/YYYY')}</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'center' }}>{moment(this.props.item.DataFim).format('HH:MM')}</Text>
                    <Text>{moment(this.props.item.DataFim).format('DD/MM/YYYY')}</Text>
                </View>
            </View>
        )
    }
}

class ProductPriceDisplay extends React.Component {

    Style = {
        products: {
            priceValues: {
                flex: 1,
                flexDirection: 'column',
                justifyContent: "space-between",
                alignItems: "flex-end"
            }
        }
    }

    render() {
        return (
            <View style={{ ...this.Style.products.priceValues }}>
                <View style={{ flex: 0 }}>
                    <Text style={{ color: this.props.color }}>
                        {this.props.label}
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                    <Text style={{ color: this.props.color, fontSize: 15, fontWeight: "bold" }}>
                        {this.props.value}
                    </Text>
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => ({
    opportunities: state.opportunities, //Guardar opptyID e opptyCode
    user: state.user
})

const actionTriggers = {
    updateOpportunities: opportunityActions.updateOpportunities
}

export default connect(mapStateToProps, actionTriggers)(Opportunity)
