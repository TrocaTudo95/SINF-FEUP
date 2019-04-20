import React from 'react'
import {Platform, ScrollView, View, Picker, Text, FlatList, KeyboardAvoidingView, ActivityIndicator, TextInput, TouchableOpacity, DatePickerIOS, DatePickerAndroid, Modal} from 'react-native'

import {Styles, ColorTheme, Hr} from '../utils/utils'


import {ReusableProductsList} from './ProductsList'

import {connect} from 'react-redux'
import {customersActions, productsActions} from '../redux/actions'
import {fetchCustomers} from '../network/customers'
import {fetchProducts} from '../network/products'
import {createOpportunity, fetchOpportunity, createProposal, fetchProposal, addProductsToProposal} from '../network/opportunities'

import moment from 'moment'
import Ionicons from "@expo/vector-icons/Ionicons"

class AddOpportunity extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <Text style={Styles.header.title}>New Opportunity</Text>,
        };
      };

    constructor(props) {
        super(props)

        let date = new Date()
        let initDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate())

        this.state = {
            activityIndicator: false,
            selectedCustomer: null,
            customers: [],
            products: [],
            selectedExpirationDate: initDate,
            selectedCode: "",
            selectedCodeCorrect: true,
            description:"",
            descriptionCorrect: true,
            summary:"",
            opportunityTotal: 0,
            filteredProducts: []
        }
    }

    componentDidMount = () => {

        if(this.props.customers.length == 0)
            this.fetchCustomers()

        else
            this.setState(()=>({selectedCustomer: this.props.customers[0].Cliente}))
    }
    
    setProducts = products => {
        
        const filtered = products.filter(product => product.quantity > 0)

        const opportunityTotal = parseFloat(products.reduce(((accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.PVP1),0)).toFixed(2)

        this.setState(() => ({products: products, opportunityTotal: opportunityTotal, filteredProducts: filtered}))
        
    }

    fetchCustomers = async () => {
        
        try {
            const customers = await fetchCustomers(this.props.user.primaveraToken)
            this.props.updateCustomers(customers.body.DataSet.Table)
            this.setState(()=>({selectedCustomer: this.props.customers[0].Cliente}))
        }

        catch (err) {
            this.setState({userError: err.error, activityIndicator: false})
        }

    }

    populateInitialQt = (products) => {
        this.props.updateProducts(products)  
        this.setState(() => ({products:products.map(product => ({...product, quantity: 0, discount: 0}))}))  
        
    }


    createOpportunity = async () => {

        try {

            const opportunity = {
                Oportunidade: this.state.selectedCode,
                Descricao: this.state.description,
                DataCriacao: moment(new Date()).format("MM/DD/YYYY"),
                DataExpiracao: moment(this.state.selectedExpirationDate).format("MM/DD/YYYY"),
                Resumo: this.state.summary,
                Entidade: this.state.selectedCustomer,
                TipoEntidade: "C",
                EstadoVenda: "0",
                Moeda: "EUR",
                Vendedor: this.props.user.salesmanCode,
                CicloVenda: "C1"

            }

            await createOpportunity(this.props.user.primaveraToken, opportunity)

            if(this.state.filteredProducts.length > 0) {

                const opportunityJustCreated = await fetchOpportunity(this.props.user.primaveraToken, this.state.selectedCode)
                
                await createProposal(this.props.user.primaveraToken, opportunityJustCreated.body.ID, this.state.filteredProducts, 1)

                this.props.navigation.getParam('fetchOpportunities')()
                this.props.navigation.pop()

                

            }

            else {

                this.props.navigation.getParam('fetchOpportunities')()
                this.props.navigation.pop()
            }
        }

        catch (err) {
            this.setState({userError: err.error, activityIndicator: false})
        }

    }

    pickerItems = () => {

        return this.props.customers.map((item,index) => <Picker.Item key={index} label={item.Nome} value={item.Cliente} />)
    }

    handleSubmit = () => {

        let ok = true;

        this.setState({activityIndicator: true})

        if(this.state.selectedCode == '') {
            this.setState({activityIndicator: false, selectedCodeCorrect: false})
            ok = false;
        }

        if(this.state.description == '') {
            this.setState({activityIndicator: false, descriptionCorrect: false})
            ok = false;
        }

        if(ok) {
            this.createOpportunity()
        }

    }

    openAndroidDate = async () => {

        const date = {date:this.state.selectedExpirationDate}
        const view = this

        try {
            const {action, year, month, day} = await DatePickerAndroid.open(date)

            if (action !== DatePickerAndroid.dismissedAction) {
                view.setState(()=>({selectedExpirationDate:new Date(year,month,day)}))
            }
    
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }

    }

    render() {

        const codeError = !this.state.selectedCodeCorrect

        ?  <View style={Styles.newOpportunity.warningsView}>
                <Text style={Styles.newOpportunity.warnings}> Opportunity code is mandatory</Text>
            </View>
        : null

        const descriptionError = !this.state.descriptionCorrect

        ?  <View style={Styles.newOpportunity.warningsView}>
                <Text style={Styles.newOpportunity.warnings}> Description is mandatory</Text>
            </View>
        : null



        return (
            
            <KeyboardAvoidingView style={Styles.newOpportunity.mainView} behavior='padding' enabled>

                <View style={Styles.newOpportunity.warningsView}>
                    <Text style={Styles.newOpportunity.warnings}>{this.state.userError}</Text>
                </View>

                <ScrollView>

                    <Text style={{fontSize: 18, paddingTop: 10}}>For</Text>

                    <View>
                        <Picker
                            selectedValue={this.state.selectedCustomer}
                            onValueChange={(item)=>{this.setState(() => ({selectedCustomer: item}))}}
                            >
                            {this.pickerItems()}
                        </Picker>

                    </View>

                    <TextInput 
                        style={Styles.newOpportunity.textField} 
                        placeholder='opportunity code' 
                        placeholderTextColor={ColorTheme.lightGrey}
                        onChangeText={(text) => this.setState(() => ({selectedCode: text, selectedCodeError: true}))}
                        value={this.state.selectedCode}
                        autoCapitalize="none"
                        />
                    {codeError}
                    <TextInput 
                        style={Styles.newOpportunity.textField} 
                        placeholder='description' 
                        placeholderTextColor={ColorTheme.lightGrey}
                        onChangeText={(text) => this.setState({description: text, descriptionCorrect: true})}
                        value={this.state.description}
                        />
                    {descriptionError}
                    <TextInput 
                        style={Styles.newOpportunity.textField} 
                        placeholderTextColor={ColorTheme.lightGrey}
                        multiline={true}
                        numberOfLines={3}
                        placeholder='summary'
                        onChangeText={(text) => this.setState({summary: text})}
                        value={this.state.summary}
                        />

                    <OpportunityProducts updateProductPic = {this.props.updateProductPic} productsPics = {this.props.productsPics} populateInitialQt= {this.populateInitialQt} doneFunction={this.setProducts} user={this.props.user} products={this.state.products} filteredProducts={this.state.filteredProducts}/>

                    <View style={Styles.newOpportunity.totalView}>
                        <Text style={{fontSize: 18}}>Total </Text>
                        <Text style={{fontSize: 18}}>{this.state.opportunityTotal} €</Text>
                    </View>

                    {Platform.OS == 'ios'
                    
                    ?

                        <DatePickerIOS
                            date={this.state.selectedExpirationDate}
                            mode="date"
                            minimumDate={new Date()}
                            onDateChange={(selectedDate)=>{ this.setState(() => ({selectedExpirationDate: selectedDate }))}}
                        />

                    :

                    <View style={{alignItems:'center', flexDirection: 'column', padding: 10}}>
                        <Text style={Styles.newOpportunity.androidDateButton}>Until</Text>
                        <View style={Styles.newOpportunity.androidDate}>
                            <Text style={Styles.newOpportunity.androidDateButton}>{moment(this.state.selectedExpirationDate).format("DD/MM/YYYY")}</Text>
                            <TouchableOpacity onPress={()=>{this.openAndroidDate()}}>
                                <Ionicons name="ios-calendar" size={20} color={ColorTheme.lightGreen} />
                            </TouchableOpacity> 
                        </View>
                    </View>
                    
                    }

                    <View style={Styles.newOpportunity.bottomView}>

                        <ActivityIndicator size="large" color={ColorTheme.strongGreen} animating={this.state.activityIndicator} />

                        <TouchableOpacity 
                            onPress={() => {this.handleSubmit()}}
                            style={Styles.newOpportunity.buttonView}
                        >
                            <Text style={Styles.newOpportunity.button}>Confirm</Text>
                        </TouchableOpacity>
                    </View>

                    
                </ScrollView>

            </KeyboardAvoidingView>

            
        )
    }
}

class OpportunityProducts extends React.Component {

    state= {
        showingSelectProducts: false,
    }

    componentDidMount() {

        if(this.props.products.length == 0)
            this.fetchProducts()
        
    }

    fetchProducts = async () => {

        try {
            const products = await fetchProducts(this.props.user.primaveraToken)
            this.props.populateInitialQt(products.body.DataSet.Table)
            
        }

        catch (err) {
            this.setState({userError: err.error, activityIndicator: false})
        }

    }

    toggleSelectProducts = () => {
        this.setState((prev) => ({showingSelectProducts: !prev.showingSelectProducts}))
    }
        
      render() {

        return (

        <View style={{marginBottom: 20}}>

            <View style={Styles.newOpportunity.productsHeader}>
            <Text style={[Styles.newOpportunity.productsTitle, {padding: 15}]}>Products</Text>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{padding: 15}}onPress={this.toggleSelectProducts}>
                    <Ionicons name="ios-create-outline" size={25} color={ColorTheme.lightGreen} />
                </TouchableOpacity>
            </View>
          </View>

           <SelectedProducts products={this.props.filteredProducts}/>   

            {this.state.showingSelectProducts && this.props.products.length > 0 && this.props.products[0].hasOwnProperty('quantity')? 
                 <SelectProducts updateProductPic = {this.props.updateProductPic} productsPics = {this.props.productsPics} doneFunction={this.props.doneFunction} products={this.props.products} close={this.toggleSelectProducts}/>
                 : null}
        </View>
            
          
        );
      }
}

export class SelectProducts extends React.Component {

    state = {
        products: this.props.products
    }


    updateProducts = (products) => {

        this.setState(() => ({products: products}))

    } 

    render() {
        
        return (
                <Modal
                animationType="slide"
                transparent={true}
                visible={true}
                presentationStyle="overFullScreen"
                onRequestClose={() => {}}
                >
                    <View style={Styles.newOpportunity.selectProductsView}>
                        <View style={{backgroundColor: ColorTheme.lightGrey, paddingHorizontal:15, paddingTop: 12, flexDirection: 'row', alignItems:'center', justifyContent: 'space-between'}}>
                            
                            <TouchableOpacity onPress={()=>{this.props.close()}}>
                                <Ionicons name="ios-close" size={40} color={ColorTheme.white} />
                            </TouchableOpacity>
                            <Text style={{color:ColorTheme.white, fontSize: 20}}>Catalogue</Text>
                            <TouchableOpacity onPress={()=>{this.props.doneFunction(this.state.products); this.props.close()}}>
                                <Text style={{color: ColorTheme.white, fontSize: 20, textAlign: 'center'}}>Confirm</Text>
                            </TouchableOpacity>
                            
                        </View>
                        <ReusableProductsList updateProductPic = {this.props.updateProductPic} productsPics = {this.props.productsPics} updateProducts={this.updateProducts} selectingProducts={true} products={this.state.products}/>
                    </View>
                </Modal>

        )

    }

}

class SelectedProducts extends React.Component {

    render() {

        return (

                <FlatList
                    data = {this.props.products}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem = {({item}) => {

                        const total = parseFloat(item.quantity * parseFloat(item.PVP1)).toFixed(2)

                        return (
                            <View style={{paddingLeft: 10}}>
                                <View style={{ flex: 1, marginTop: 10, paddingLeft: 20, flexDirection: 'row', alignItems: 'center', borderBottomColor: ColorTheme.lightLightGrey, borderBottomWidth: 2}}>
                                    <View style={{justifyContent:'center', flex: 0.6}}>
                                        <Text style={{fontSize: 15}}>{item.Descricao}</Text>
                                        <Text style={{color: ColorTheme.strongGreen, fontSize: 15}}>{parseFloat(item.PVP1).toFixed(2)} €</Text> 
                                    </View>
                                    <View style={{justifyContent:'center', flex: 0.4}}>
                                        <View style={{padding: 7, flexDirection: 'row'}}>
                                            <Text style={{fontSize: 15, marginRight: 30, textAlign:'left'}}>{item.quantity} un</Text>
                                            <Text style={{fontSize: 15, textAlign: 'right'}}>{total} €</Text>
                                        </View>
                                    </View>                            
                                </View>
                            </View>
                        )
                    }}
                />
                
        )

    }

}

const mapStateToProps = (state) => {

    return {
        user: state.user,
        customers: state.customers,
        products: state.products,
        productsPics: state.productsPics

    }

}

const mapActionsToProps = {
    updateCustomers: customersActions.updateCustomers,
    updateProducts: productsActions.updateProducts,
    updateProductPic: productsActions.updateProductPic

}

export default connect(mapStateToProps, mapActionsToProps)(AddOpportunity)

