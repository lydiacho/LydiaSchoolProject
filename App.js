import React, {useState} from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';

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
  container: {
    flex:1,
    paddingVertical:30
  },
  item: {
    padding:18,
    margin:10,
    flexDirection:'row',
    backgroundColor: 'lightblue',
    borderRadius:20,
    justifyContent:'space-between'
  },
  text: {
    fontSize: 25,
    marginHorizontal: 10
  },
  input: {
    flex:1,
    fontSize:30,
    borderWidth: 1,
    marginHorizontal: 5,
    borderRadius: 20
  },
});

export default function App() {
  const [name, setName] = useState('');
  const [month, setMonth] = useState(0);
  const [date, setDate] = useState(0);
  const [extra, setExtra] = useState(false);
  const [sel, setSel] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={{fontSize:50, textAlign:'center', fontFamily:'Copperplate-Bold'}}>ALL A+</Text>
      {/* <Text style={{fontSize:50, textAlign:'center', fontFamily:'HelveticaNeue-CondensedBold'}}>ALL A+</Text> */}
      {/* <Text style={{fontSize:50, textAlign:'center', fontFamily:'Verdana-Bold'}}>ALL A+</Text> */}

      <View style={{margin:10, flexDirection:"row"}}>
        <TextInput style={[styles.input, {flex:3}]} onChangeText={setName} />
        <TextInput style={[styles.input, {flex:1}]} onChangeText={setMonth} />
        <TextInput style={[styles.input, {flex:1}]} onChangeText={setDate} />
        <Button title="추가" onPress={function () {
          datalist.push({key : name, month: month,date: date});
          setExtra(!extra);
        }} />
      </View>
      <FlatList
        data = {datalist}
        extraDate = {extra}
        renderItem={
          function ({item, index}) {
            const weight = (index == sel)?'bold':'normal';
            const backcolor = (index == sel)?'lightgray':'lightblue';
            var today = new Date();
            var dday = new Date(2021,item.month-1,item.date);
            var gap = dday.getTime() - today.getTime();
            var result = Math.ceil(gap / (1000*60*60*24));
            return <TouchableOpacity style={[styles.item, { backgroundColor: backcolor}]} onPress={function() { setSel(index); setExtra(!extra);}}>
              <Text style={ [styles.text, { fontWeight:weight }] }>{item.key}</Text>
              <Text style={styles.text}>D-{result}</Text>
            </TouchableOpacity>;
          }
        }
      />
      <View style={{flexDirection:'row', justifyContent:'space-evenly' }}>
        <Button title="이동" onPress={function() {
          }} />
        <Button title="삭제" onPress={function() {
            if (sel !=null) datalist.splice(sel, 1);
            setSel(null);
            setExtra(!extra);
          }} />
      </View>
    </View>
  );
}