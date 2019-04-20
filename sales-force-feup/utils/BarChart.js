import React from 'react'

import {View, Text} from 'react-native'

/**
 * @param orientation enum {hor, vert} defaults to horizontal
 * @param lables
 * @param xStep x axis step
 * @param xLable
 * @param barsValue
 * @param barsColour
 * 
 */
export default class BarChart extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {}
    }

    render(){

        let output = []
        let colours

        let max = Math.max(...this.props.barsValue)

        if(this.props.barsColour.length != this.props.barsValue.length)
            colours = Array(this.props.barsValue.length).fill(this.props.barsColour)
        else
            colours = [...this.props.barsColour]
        
        for(let i = 0; i < this.props.barsValue.length; i++){
            output.push(
                <View style={{flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: colours[i],
                    marginBottom: this.props.barsMarginBottom}}
                        key={i} 
                        width={`${this.props.barsValue[i]/max*100}%`} 
                        height={this.props.barsHeight}>
                    <Text style={{paddingLeft: this.props.barLabelsPaddingLeft}}>{this.props.barLables[i]} - {this.props.barsValue[i]}</Text>
                </View>)
        }

        return output
    }
}