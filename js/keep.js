import React, {useState} from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'


var datalist = [
  { key : "콘텐츠데이터베이스", 
    month : 12, 
    date:10 },
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
  // 여기부터 따온거
  box: {
    margin:20,
    marginHorizontal: 20,
  },
  datetext: {
    fontSize:20,
    marginVertical: 10,
  },
  row: {
    flexDirection:'row',
    alignItems:'center',
  },
  todo: {
    flex:1,
    borderBottomWidth:1,
    marginHorizontal:10,
    fontSize:16,
    color:'blue'
  },
  memo: {
    borderBottomWidth:1,
    fontSize:16,
    marginTop:10,
    color:'blue',
  }
});

// var todo_list=[];
// function TodoScreen() {
//   const [date, setDate] = useState("");
//   const [todo, setTodo] = useState("");
//   const [extra, setExtra] = useState(false);

//   async function date_change(d) {
//     setDate(d.format('YYYYMMDD'));
//     var key = d.format('YYYYMMDD');
//     var value = await AsyncStorage.getItem(key);
//     if (value == null) {
//       todo_list = [];
//     } else {
//       todo_list = value;
//     }
//     setExtra(!extra);
//   }

//   async function save_todo() {
//     await AsyncStorage.setItem(date, todo_list);
//   }
  
//   //TodoList 반복출력하는 파트********************************************************************
//   var L = [];
//   for(var i=0; i<todo_list.length; i++) {
//     var a = <Text style={{fontSize:20, margin:10}}>{todo_list[i]}</Text>
//     L.push(a);
//   }

//   return (
//     <View style={ styles.container}>
//       <CalendarPicker onDateChange={date_change}/>
//       <View style={styles.box}>
//         <Text style={styles.text}>Todo List</Text>  
//         <View style={styles.row}>
//           <TextInput style={styles.todo} onChangeText={setTodo}/>
//           <Button title="ADD" onPress={function() {todo_list.push(todo); setExtra(!extra);}}/>
//         </View>
//         <Text>MEEEEE</Text>
//         {L}
//         <Button title="SAVE" onPress={save_todo}/>
//       </View>
//     </View>
//   );
// }

function HomeScreen({navigation}) {
  const [name, setName] = useState('');
  const [month, setMonth] = useState(0);
  const [date, setDate] = useState(0);
  const [extra, setExtra] = useState(false);
  const [sel, setSel] = useState(null);
  return(
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
        <Button title="이동" onPress={function() { navigation.navigate('Todo')
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

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Todo" component={TodoScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}