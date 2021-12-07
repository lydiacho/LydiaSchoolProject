import React, {useState} from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
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


questionlist = [{ask:"뭐부터질문을", answer:""}, {ask:"드려야할지"}];
export default function App() {
  const [extra, setExtra] = useState(false);
  const [sel, setSel] = useState(null);
  const [newAsk, setNewAsk] = useState("");
  const [newAnswer, setNewAnswer] = useState("");


  return (
    <View style={ {paddingTop:30}}>
      <Text style={{textAlign:'center', fontSize:50, margin:20}}> QNA </Text>
      <TextInput style={[styles.input, {marginHorizontal:20, height:50}]} multiline={true} placeholder="질문을 입력해주세요." onChangeText={setNewAsk}/>
      <Button title="질문 추가하기" onPress={function() {questionlist.push({ask:newAsk})}}/>
      <FlatList
        data = {questionlist}
        extraDate = {extra}
        keyExtractor={(item) => item.ask}  //질문내용을 key로 사용
        renderItem={
          function ({item, index}) {
            const height_out = (index == sel)?120:0;
            const height_in = (index == sel)?100:0;
            const opacity = (index == sel)?100:0;
            return <TouchableOpacity style={[styles.item]} onPress={function() { setSel(index); setExtra(!extra); }}>
              <Text style={{fontSize:15, padding:5}}>Q. {item.ask}</Text>
              <Text style={{fontSize:15, padding:5}}>A. {item.answer}</Text>
              <View style={{height:height_out, opacity:opacity}}>
                <TextInput style={[styles.input,{height:height_in}]} multiline={true} placeholder="답변을 입력해주세요." onChangeText={setNewAnswer}/>
                <View style={{flexDirection:'row'}}>
                  <Button title="답변 추가하기" onPress={function() {questionlist.splice(sel, 1, {ask:questionlist[sel].ask, answer:newAnswer})}}/>
                  <Button title="질문 삭제하기" onPress={function() {
                    if (sel !=null) questionlist.splice(sel, 1);
                    setSel(null);
                    setExtra(!extra);
                  }} />
                </View>
              </View>
            </TouchableOpacity>;
          }
          
        }
      />
    </View>
  );
}