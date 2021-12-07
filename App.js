import React, {useState} from 'react';
import { FlatList, StyleSheet, Text, ScrollView, Image, View, TextInput, Button, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'

var sel = null;
var datalist = [
  { key : "콘텐츠데이터베이스", 
    month : 12, 
    date:10 ,
    checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
    n_read: {full_num:[0,0,0,0], divide:1},
    questionlist : [{ask:"뭐부터질문을", answer:""}, {ask:"드려야할지"}],
  },
  { key : "모바일앱제작", month : 12, date:11, 
    checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
    n_read: {full_num:[0,0,0,0], divide:1},
    questionlist : [{ask:"뭐부터질문을"}]},
  { key : "리더십세미나", month : 12, date:12,
    checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
    n_read: {full_num:[0,0,0,0], divide:1},
    questionlist : [{ask:"뭐부터질문을"}]},
  { key : "컴퓨터네트워크", month : 12, date:13,
    checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
    n_read: {full_num:[0,0,0,0], divide:1},
    questionlist : [{ask:"뭐부터질문을"}]},
  { key : "기계학습", month : 12, date:14,
    checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
    n_read: {full_num:[0,0,0,0], divide:1},
    questionlist : [{ask:"뭐부터질문을"}]},
  { key : "소프트웨어공학", month : 12, date:15,
    checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
    n_read: {full_num:[0,0,0,0], divide:1},
    questionlist : [{ask:"뭐부터질문을"}]},
  { key : "자바프로그래밍및실습", month : 12, date:16,
    checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
    n_read: {full_num:[0,0,0,0], divide:1},
    questionlist : [{ask:"뭐부터질문을"}]},
]

const styles = StyleSheet.create( {
  container: {
    flex:1,
    paddingVertical:30
  },
  item: {
    padding:18,
    margin:10,
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
    padding:5,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal:5,
    textAlignVertical: 'top',
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

//todo*************************************************************************************************

var todo_list=[];
function TodoScreen() {
  const [date, setDate] = useState("");
  const [todo, setTodo] = useState("");
  const [extra, setExtra] = useState(false);

  async function date_change(d) {
    setDate(d.format('YYYYMMDD'));
    var key = d.format('YYYYMMDD');
    var value = await AsyncStorage.getItem(key);
    if (value == null) {
      todo_list = [];
    } else {
      todo_list = value;
    }
    setExtra(!extra);
  }

  async function save_todo() {
    await AsyncStorage.setItem(date, todo_list);
  }
  
  //TodoList 반복출력하는 파트
  var L = [];
  for(var i=0; i<todo_list.length; i++) {
    var a = <Text style={{fontSize:20, margin:10}}>{todo_list[i]}</Text>
    L.push(a);
  }

  return (
    <View style={ styles.container}>
      <CalendarPicker onDateChange={date_change}/>
      <View style={styles.box}>
        <Text style={styles.text}>Todo List</Text>  
        <View style={styles.row}>
          <TextInput style={styles.todo} onChangeText={setTodo}/>
          <Button title="ADD" onPress={function() {todo_list.push(todo); setExtra(!extra);}}/>
        </View>
        <Text>MEEEEE</Text>
        {L}
        <Button title="SAVE" onPress={save_todo}/>
      </View>
    </View>
  );
}

//Home***************************************************************************************************

function HomeScreen({navigation}) {
  const [name, setName] = useState('');
  const [month, setMonth] = useState(0);
  const [date, setDate] = useState(0);
  const [extra, setExtra] = useState(false);

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
          datalist.push({ key : name, 
            month : month, 
            date:date ,
            checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
            n_read: {full_num:[0,0,0,0], divide:1},
            questionlist : [{ask:"뭐부터질문을"}],
          })
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
            return <TouchableOpacity style={[styles.item, { flexDirection:'row',backgroundColor: backcolor}]} onPress={function() { sel = index; setExtra(!extra);}}>
              <Text style={ [styles.text, { fontWeight:weight }] }>{item.key}</Text>
              <Text style={styles.text}>D-{result}</Text>
            </TouchableOpacity>;
          }
        }
      />
      <View style={{flexDirection:'row', justifyContent:'space-evenly' }}>
      <Button title="ToDO" onPress={function() { navigation.navigate('ToDo')
          }} />
        <Button title="이동" onPress={function() { navigation.navigate('Drawer')
          }} />
        <Button title="삭제" onPress={function() {
            if (sel !=null) datalist.splice(sel, 1);
            sel = null;
            setExtra(!extra);
          }} />
      </View>
    </View>
  );
}


//진도체크**************************************************************************************
// var checklist = [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]];

function Stamp(props) {
  const [extra, setExtra] = useState(false);

  return (
    <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
      <Text>Week{props.id+1}</Text>
      <TouchableOpacity onPress={function() {datalist[sel].checklist[props.id][0] = 1; setExtra(!extra); }}>
        <Image style={{width:150,height:150}} source={require('./assets/ewha.png')} opacity={datalist[sel].checklist[props.id][0]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={function() {datalist[sel].checklist[props.id][1] = 1; setExtra(!extra); }}>
        <Image style={{width:150,height:150}} source={require('./assets/ewha.png')} opacity={datalist[sel].checklist[props.id][1]}/>
      </TouchableOpacity>
    </View>
  );
}



function AttendanceScreen() {
  var L = [];
  for (var i=0; i<datalist[sel].checklist.length; i++) {
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


//N회독*************************************************************************************************************
//n_read: {full_num:[0,0,0,0], divide:8},
function Full(props) {

  const [extra, setExtra] = useState(false);
  var L = [];
  for (var i=0; i<datalist[sel].n_read.divide; i++) {
    if (i<datalist[sel].n_read.full_num[props.id-1]) {
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
        <Button title="PLUS" onPress={function() {datalist[sel].n_read.full_num[props.id-1]+=1; setExtra(!extra); }}/>
        <Button title="MINUS" onPress={function() {datalist[sel].n_read.full_num[props.id-1]-=1; setExtra(!extra); }}/>
      </View>
      <View style={{flex:1, flexDirection:'row', margin:10}}>
        {L}
      </View>
    </View>
  );
}

function NreadScreen() {
  const [extra, setExtra] = useState(false);

  return (
    <View style={ {paddingTop:50}}>
      <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20}}>
        <Text style={{fontSize:20}}>몇 번에 걸쳐 1회독?    </Text>
        <TextInput style={{backgroundColor:'wheat',width:50,height:50,borderRadius:20,fontSize:20, textAlign:'center'}} placeholder={datalist[sel].n_read.divide.toString()} onChangeText={ function(t) {datalist[sel].n_read.divide = Number(t); setExtra(!extra);}}/>
      </View>
      <Full id={1}/>
      <Full id={2}/>
      <Full id={3}/>
      <Full id={4}/>
    </View>
  );
}

//QNA**********************************************************************************************************
//questionlist : [{ask:"뭐부터질문을", answer:""}, {ask:"드려야할지"}],
function QnAScreen() {
  const [extra, setExtra] = useState(false);
  const [idx, setIdx] = useState(null);
  const [newAsk, setNewAsk] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  return (
    <View style={ {paddingTop:30, flex:1}}>
      <Text style={{textAlign:'center', fontSize:50, margin:20}}> QNA </Text>
      <TextInput style={[styles.input, {marginHorizontal:20, height:50}]} multiline={true} placeholder="질문을 입력해주세요." onChangeText={setNewAsk}/>
      <Button title="질문 추가하기" onPress={function() {datalist[sel].questionlist.push({ask:newAsk})}}/>
      <FlatList
        data = {datalist[sel].questionlist}
        extraDate = {extra}
        keyExtractor={(item) => item.ask}  //질문내용을 key로 사용
        renderItem={
          function ({item, index}) {
            const height_out = (index == idx)?120:0;
            const height_in = (index == idx)?100:0;
            const opacity = (index == idx)?100:0;
            return <TouchableOpacity style={[styles.item]} onPress={function() { setIdx(index); setExtra(!extra); }}>
              <Text style={{fontSize:15, padding:5}}>Q. {item.ask}</Text>
              <Text style={{fontSize:15, padding:5}}>A. {item.answer}</Text>
              <View style={{height:height_out, opacity:opacity}}>
                <TextInput style={[styles.input,{height:height_in}]} multiline={true} placeholder="답변을 입력해주세요." onChangeText={setNewAnswer}/>
                <View style={{flexDirection:'row'}}>
                  <Button title="답변 추가하기" onPress={function() {datalist[sel].questionlist.splice(idx, 1, {ask:datalist[sel].questionlist[idx].ask, answer:newAnswer})}}/>
                  <Button title="질문 삭제하기" onPress={function() {
                    if (idx !=null) datalist[sel].questionlist.splice(idx, 1);
                    setIdx(null);
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

//세 페이지 controller******************************************************************************************
const Drawer = createDrawerNavigator();
function drawer() {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator>
        <Drawer.Screen name="Attendance" component={AttendanceScreen}/>
        <Drawer.Screen name="Nread" component={NreadScreen}/>
        <Drawer.Screen name="QnA" component={QnAScreen}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}


//main****************************************************************************************************************
const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Todo" component={TodoScreen}/>
        <Stack.Screen name="Drawer" component={drawer}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}