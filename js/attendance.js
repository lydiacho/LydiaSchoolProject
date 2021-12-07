import React, {useState} from 'react';
import { ScrollView,Image, FlatList, StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'


var datalist = [
  { key : "콘텐츠데이터베이스", month : 12, date:10},
  { key : "모바일앱제작", month : 12, date:11},
  { key : "리더십세미나", month : 12, date:12},
  { key : "컴퓨터네트워크", month : 12, date:13},
  { key : "기계학습", month : 12, date:14},
  { key : "소프트웨어공학", month : 12, date:15},
  { key : "자바프로그래밍및실습", month : 12, date:16},
]

const styles = StyleSheet.create( {
  input: {
    padding:5,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: 'top',
  },
  item: {
    padding:18,
    margin:10,
    backgroundColor: 'lightblue',
    borderRadius:20,
    justifyContent:'space-between'
  },
});

var checklist = [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]];

function Stamp(props) {
  const [extra, setExtra] = useState(false);

  return (
    <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
      <Text>Week{props.id+1}</Text>
      <TouchableOpacity onPress={function() {checklist[props.id][0] = 1; setExtra(!extra); }}>
        <Image style={{width:150,height:150}} source={require('./assets/ewha.png')} opacity={checklist[props.id][0]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={function() {checklist[props.id][1] = 1; setExtra(!extra); }}>
        <Image style={{width:150,height:150}} source={require('./assets/ewha.png')} opacity={checklist[props.id][1]}/>
      </TouchableOpacity>
    </View>
  );
}



export default function App() {
  const [extra, setExtra] = useState(false);


  var L = [];
  for (var i=0; i<checklist.length; i++) {
    var a = <Stamp id={i}/>
    L.push(a);
  }

  return (
    <View style={ {paddingTop:30}}>
      <Text style={{textAlign:'center', fontSize:50, margin:20}}> 진도표 </Text>
      <ScrollView contentContainerStyle={{paddingBottom:120}}>
        {L}
      </ScrollView>
    </View>
  );
}