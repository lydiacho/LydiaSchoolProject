import React, {useState} from 'react';
import { ScrollView,Image, FlatList, StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';



function Full(props) {

  //각 과목별 full_num과 num 저장해야함 

  const [full_num, setFull_num] = useState(0);

  var L = [];
  for (var i=0; i<props.num; i++) {
    if (i<full_num) {
      var a = <View style={{flex:1, backgroundColor:'red',borderWidth:2, height:50 }}/>
    } else {
      var a = <View style={{flex:1, backgroundColor:'black',borderWidth:2, height:50}}/>
    }
    L.push(a);
  }

  return (
    <View style={{justifyContent:'space-evenly',margin:20}}>
      <View style={{flexDirection:'row'}}>
        <Text style={{fontSize:20, margin:10}}>{props.id}회독</Text>
        <Button title="PLUS" onPress={function() {setFull_num(full_num+1)}}/>
        <Button title="MINUS" onPress={function() {setFull_num(full_num-1)}}/>
      </View>
      <View style={{flex:1, flexDirection:'row', margin:10}}>
        {L}
      </View>
    </View>
  );
}

export default function App() {
  const [num, setNum] = useState(1);
  return (
    <View style={ {paddingTop:50}}>
      <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20}}>
        <Text style={{fontSize:20}}>몇 번에 걸쳐 1회독?    </Text>
        <TextInput style={{backgroundColor:'wheat',width:50,height:50,borderRadius:20,fontSize:20, textAlign:'center'}} onChangeText={setNum}/>
      </View>
      <Full id={1} num={num}/>
      <Full id={2} num={num}/>
      <Full id={3} num={num}/>
      <Full id={4} num={num}/>
    </View>
  );
}