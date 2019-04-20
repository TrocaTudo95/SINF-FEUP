import React from 'react'
import {View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image, TextInput} from 'react-native'

import {Styles, ColorTheme, Hr} from '../utils/utils' 

import {connect} from 'react-redux'

import Ionicons from "@expo/vector-icons/Ionicons"

import {productsActions} from '../redux/actions'

import {fetchProducts, fetchPicture} from '../network/products'

import { DrawerActions } from 'react-navigation-drawer'

class ProductsList extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
          headerTitle: <Text style={Styles.header.title}>Product Catalogue</Text>,
          headerRight: (
            <View>
              <TouchableOpacity onPress={() => {navigation.getParam('fetchProducts')()}}>
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
      loading: false,
      text: 'Fetching products from Primavera...'
    }

    componentWillMount() {

      this.fetchProducts()
      this.props.navigation.setParams({fetchProducts:this.fetchProducts})

    }

    fetchProducts = async () => {

      this.setState(()=>({loading:true}))

      try {

        const products = await fetchProducts(this.props.user.primaveraToken)
        this.props.updateProducts(products.body.DataSet.Table)
        this.setState(()=>({loading:false, text:'Fetching products from Primavera...'}))

      }

      catch(error) {
        this.props.updateProducts([])
        this.setState(()=>({loading:false, text:'Could not connect to Primavera, please try again: ' + error.error}))
      }

    }

    render() {

        return (
            <View style={Styles.products.mainView}>
              {this.state.loading 
              ?
                <View>
                  <ActivityIndicator size="small" color={ColorTheme.lightGreen} style={{paddingRight:5, paddingTop:14.7, paddingBottom:14.7}}/>
                  <Text style={{color: ColorTheme.strongGrey}}>{this.state.text}</Text>
                </View>
              :

                <ReusableProductsList selectingProducts={false} productsPics = {this.props.productsPics} products={this.props.products} updateProductPic = {this.props.updateProductPic}/>
              }

            </View>
        )

    }

}

export class ReusableProductsList extends React.Component {

  updateProductQuantity = (product,quantity) => {

    let newProducts = [...this.props.products].map(iterator => {

      return {...iterator, quantity: product.Artigo == iterator.Artigo ? quantity : iterator.quantity }

    })

    this.props.updateProducts(newProducts)

  }

  updateProductDiscount = (product,discount) => {

    let newProducts = [...this.props.products].map(iterator => {

      return {...iterator, discount: product.Artigo == iterator.Artigo ? discount : iterator.discount }

    })

    this.props.updateProducts(newProducts)

  }

  render() {

    let productsPics = this.props.productsPics

    return (
      <FlatList
      data = {this.props.products}
      renderItem = {({item}) => {

        return (
          <ProductItemView
            item = {{...item, selectedQt: this.props.selectingProducts ? item.quantity : 0}}
            selectingProducts = {this.props.selectingProducts}
            updateProductQuantity = {this.updateProductQuantity.bind(this,item)}
            updateProductDiscount = {this.updateProductDiscount.bind(this,item)}
            updateProductPic = {this.props.updateProductPic}
            productsPics = {productsPics}

          />
        );

      }}

      keyExtractor={(item, index) => index.toString()}

    />
 
    )

  }

}

export class ProductItemView extends React.Component {

  state = {
    pic: this.props.productsPics.hasOwnProperty(this.props.item.Artigo) ? this.props.productsPics[this.props.item.Artigo] : ''
  }

  componentDidMount = () => {

    this.mounted = true

    if(this.state.pic === '')
      this.getPicture()

  }

  componentWillUnmount = () => {
    this.mounted = false

  }

  getPicture = async () => {

    try {

        const pic = await fetchPicture(this.props.item.Artigo)   
        
        if(this.mounted) 
          this.setState(() => ({pic:pic.body.picture}))
        
        const artigo = this.props.item.Artigo
        let newPic = this.props.productsPics
        newPic[artigo] = pic.body.picture

        this.props.updateProductPic(newPic)

      }
      
      catch(err) {
        console.log(err)
      }
  }

  render() {

    const color = parseInt(this.props.item.StkActual) > 0 ? 'green' : 'red'

    return (

      <View style={Styles.products.item}>
        <View style={{flexDirection:'row', paddingBottom: 15}}>
          <Image 
            style={{width: 100, height: 100}}
            source={{uri: `data:image/png;base64,${this.state.pic}`}}

          />
          <View style={{justifyContent: 'space-between', flex: 1}}>
            <View style={{flex:1, paddingLeft: 10, flexDirection:'row', justifyContent:'space-between'}}>
              <View>
                <Text style={{fontSize: 20, color: ColorTheme.lightGrey }}>{this.props.item.Descricao}</Text>
                <Text style={{fontSize: 17, color:color }}>{this.props.item.StkActual} units</Text>
              </View>
              <View style={{paddingTop: 5, alignItems: 'flex-end'}}>
                <Text style={{fontSize: 20, color:ColorTheme.lightGrey }}>{parseFloat(this.props.item.PVP1 * (1 + this.props.item.Iva/100)).toFixed(2)} €</Text>
                <Text style={{fontSize: 10, color:ColorTheme.lightGrey }}> {`VAT included (${this.props.item.Iva}`}%) </Text>
              </View>
            </View>
            {this.props.selectingProducts ?
              <View style={{flex:1, paddingLeft: 10, flexDirection:'row', alignItems: 'center', justifyContent:'space-between'}}>
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                  <TouchableOpacity style={{padding:10}} onPress={()=>{this.props.updateProductQuantity(this.props.item.selectedQt + 1)}}>
                    <Ionicons name="ios-add" size={32} color={ColorTheme.strongGrey} />
                  </TouchableOpacity>
                  <TextInput 
                        onChangeText={text => {
                          text = text == "" ? "0" : text
                          this.props.updateProductQuantity(parseInt(text))
                          
                        }}
                        value={`${this.props.item.selectedQt}`}
                        keyboardType="number-pad"
                        style={{marginHorizontal: 5, backgroundColor:ColorTheme.white, width: 30, padding: 5, textAlign: 'center'}}
                        />
                  <TouchableOpacity style={{padding:10}} onPress={()=>{
                        const newQt = this.props.item.selectedQt - 1 >= 0 ? this.props.item.selectedQt - 1 : 0
                        this.props.updateProductQuantity(newQt)
                      }
                  }>
                    <Ionicons name="ios-remove" size={32} color={ColorTheme.strongGrey} />
                  </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row', alignItems:'center'}}>
                    <Text>Discount:</Text>
                    <TextInput 
                        onChangeText={text => { 
                          text = text == "" ? "0" : text
                          this.props.updateProductDiscount(parseInt(text))
                          
                        }}
                        value={`${this.props.item.discount}`}
                        keyboardType="numeric"
                        style={{marginLeft: 5, marginRight: 3, backgroundColor:ColorTheme.white, width: 30, padding: 5, textAlign: 'center'}}
                    />
                    <Text>%</Text>
                  </View>
              </View>
            
            :
                null}
          </View>
          
        </View>

        
        
        <Hr color={ColorTheme.lightGrey} lineHeight={1} offset={10} />
      </View>
    )
  }

}


const mapPropsToState = state => ({

  products: state.products,
  user: state.user,
  productsPics: state.productsPics

})

const actionTriggers = {
  updateProducts: productsActions.updateProducts,
  updateProductPic: productsActions.updateProductPic
}

export default connect(mapPropsToState,actionTriggers)(ProductsList)