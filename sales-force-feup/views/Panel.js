import React,{Component,StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native'; //Step 1

export class Panel extends React.Component{
    constructor(props){
        super(props);

        this.icons = {     //Step 2
            'up'    : require('./images/Arrowhead-01-128.png'),
            'down'  : require('./images/Arrowhead-Down-01-128.png')
        };

        this.state = {       //Step 3
            title       : props.title,
            expanded    : true
        };
    }

    toggle(){
        
    }


    render(){
        let iconName = "ios-arrow-down";

        if(this.state.expanded){
            iconName = "ios-arrow-up";   //Step 4
        }

        //Step 5
        return ( 
            <View style={styles.container} >
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                        <Image
                            style={styles.buttonImage}
                            source={icon}
                        ></Image>
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body}>
                    {this.props.children}
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container   : {
        backgroundColor: '#fff',
        margin:10,
        overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title       : {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold'
    },
    button      : {

    },
    buttonImage : {
        width   : 30,
        height  : 25
    },
    body        : {
        padding     : 10,
        paddingTop  : 0
    }
});