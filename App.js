import React, {useState} from 'react';
import { Alert, Keyboard, TouchableWithoutFeedback, FlatList, StyleSheet, Text, ScrollView, Image, View, TextInput, Button, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CalendarPicker from 'react-native-calendar-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

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
    paddingTop:20,
    backgroundColor:'#D6F0FF'   //#EBF7FF
  },
  item: {
    padding:18,
    marginHorizontal:20,
    marginVertical:10,
    borderRadius:20,
    justifyContent:'space-between',
    shadowColor:'gray',
    shadowOpacity:0.5,
    shadowRadius:2,
    shadowOffset:{width:2,height:2}
  },
  text: {
    fontSize: 18,
  },
  input: {
    flex:1,
    padding:8,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    margin:5,
    textAlignVertical: 'top',
  },
  datetext: {
    fontSize:20,
    marginVertical: 10,
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

//데이터 저장**************************************************************************************
async function save_data() {
  await AsyncStorage.setItem("datalist", JSON.stringify(datalist));
}

//todo*************************************************************************************************
var todo_list=[];  //하루치 투두리스트
function TodoScreen() {
  const [date, setDate] = useState("");
  const [todo, setTodo] = useState("");
  const [extra, setExtra] = useState(false);

  async function date_change(d) {
    setDate(d.format('YYYYMMDD'));
    var key = d.format('YYYYMMDD');
    var value = await AsyncStorage.getItem(key);  //value_todo=[~,~,~,~]
    
    if (value == null) {
      todo_list = [];
    } else {
      todo_list = JSON.parse(value);
    }
    setExtra(!extra);
  }

  async function save_todo() {
    await AsyncStorage.setItem(date, JSON.stringify(todo_list));
  }
  
  function add() {
    todo_list.push({todo:todo, done:false});
    save_todo();
    setExtra(!extra);
  }

  return (
    <View style={styles.container}>
      <CalendarPicker onDateChange={date_change}/>
      <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20}}>
        <TextInput style={[styles.input]} placeholder='무엇을 해야하나요?' onChangeText={setTodo}/>
        <TouchableOpacity onPress={add}>
          <Image source={require('./assets/add_icon.png')} opacity={0.5}/>
        </TouchableOpacity>
      </View>
      <View style={{flex:1, marginHorizontal:20}}>
        <FlatList
          contentContainerStyle={{paddingBottom:30}}
          data = {todo_list}
          extraDate = {extra}
          renderItem={
            function ({item, index}) {
              const font_st = (todo_list[index].done==false)?'normal':'italic';
              const color = (todo_list[index].done==false)?'black':'lightgray';
              const line = (todo_list[index].done==false)?'none':'line-through';
              return (
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                  <TouchableOpacity onPress={function() { todo_list[index].done = true; save_todo(); setExtra(!extra);}}>
                    <Text style={{fontSize:18, margin:10, textDecorationLine:line, fontStyle:font_st, color:color}}>✔ {todo_list[index].todo}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={function() {todo_list.splice(index, 1); save_todo(); setExtra(!extra);}}>
                    <Image source={require('./assets/delete_icon.png')} style={{width:30 ,height:30}} opacity='0.4'/>
                  </TouchableOpacity>
                </View>
              );
            }
          }
        />
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

  async function load_data() {
    var value = await AsyncStorage.getItem("datalist");
    if (value != null) {
      datalist = JSON.parse(value);
    }
    setExtra(!extra);
  }

  load_data();

  if (sel == null) {
    var button = (
      <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:20 }}>
        <Button title="삭제" disabled='true' />
        <Button title="이동" disabled='true' />
      </View>
    );
  } else {
    var button = (
      <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:20 }}>
        <Button title="삭제" color='#6A84B7' onPress={function() {
          Alert.alert('⚠', '정말로 삭제하시겠습니까?',  
            [{text: '취소',  
              onPress: () => console.log('Cancel Pressed')},  
              {text: '삭제', 
              onPress: () => {datalist.splice(sel, 1);
                sel = null;
                save_data();
                setExtra(!extra);}}]  
          ); }} />
          <Button title="이동" color='#6A84B7' onPress={function() { 
          navigation.navigate('ALL A+')}} />
      </View>
    );
  }


  return(
    <View style={[styles.container]}>
      <Text style={{fontSize:50, textAlign:'center', fontFamily:'HelveticaNeue-Bold'}}>☁        ☁  </Text>
      <Text style={{fontSize:50, textAlign:'center', fontFamily:'HelveticaNeue-Bold'}}>☁  All A+  ☁</Text>
      <Text style={{fontSize:50, textAlign:'center', fontFamily:'HelveticaNeue-Bold'}}>☁     ☁   ☁</Text>
      <View style={{marginHorizontal:20, flexDirection:"row", alignItems:'center'}}>
        <TextInput style={[styles.input, {flex:3}]} placeholder='과목명' onChangeText={setName} />
        <TextInput style={[styles.input, {flex:1}]} placeholder='월' onChangeText={setMonth} />
        <TextInput style={[styles.input, {flex:1}]} placeholder='일' onChangeText={setDate} />
        <TouchableOpacity onPress={function() {
          datalist.push({ key : name, 
            month : month, 
            date:date ,
            checklist : [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]],
            n_read: {full_num:[0,0,0,0], divide:1},
            questionlist : [{ask:"뭐부터질문을"}],
          })
          save_data();
          setExtra(!extra);
        }}>
          <Image source={require('./assets/add_icon.png')} opacity={0.5}/>
        </TouchableOpacity>
      </View>
      {button}
      <FlatList
        contentContainerStyle={{paddingBottom:30}}
        data = {datalist}
        extraDate = {extra}
        renderItem={
          function ({item, index}) {
            const weight = (index == sel)?'bold':'normal';
            const backcolor = (index == sel)?'lightgray':'white';
            var today = new Date();
            var dday = new Date(2021,item.month-1,item.date);
            var gap = dday.getTime() - today.getTime();
            var result = Math.ceil(gap / (1000*60*60*24));
            var alarm = (0<result && result <=3)?"임박⚠":""
            var result = (result==0)?'DAY':result;
            return <TouchableOpacity style={[styles.item, { flexDirection:'row',backgroundColor: backcolor}]} onPress={function() { sel = index; setExtra(!extra);}}>
              <Text style={ [styles.text, { fontWeight:weight }] }>☁ {item.key}</Text>
              <Text style={styles.text}>{alarm}  D-{result}</Text>
            </TouchableOpacity>;
          }
        }
      />
    </View>
  );
}


//진도체크**************************************************************************************
// var checklist = [[0.2, 0.2], [0.2, 0.2], [0.2, 0.2], [0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2],[0.2, 0.2]];

function Stamp(props) {
  const [extra, setExtra] = useState(false);

  return (
    <View style={{flex:1, margin:5}}>
      <Text style={{fontWeight:'bold', marginBottom:5}}>☁Week{props.id+1}</Text>
      <View style={{flexDirection:'row', justifyContent:'space-evenly', backgroundColor:'white', borderRadius:10,
        shadowColor:'gray',
        shadowOpacity:0.5,
        shadowRadius:2,
        shadowOffset:{width:2,height:2}}}>
        <TouchableOpacity onPress={function() {datalist[sel].checklist[props.id][0] = 1; save_data(); setExtra(!extra); }}>
          <Image style={{width:90,height:90}} source={require('./assets/ewha.png')} opacity={datalist[sel].checklist[props.id][0]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={function() {datalist[sel].checklist[props.id][1] = 1; save_data(); setExtra(!extra); }}>
          <Image style={{width:90,height:90}} source={require('./assets/ewha.png')} opacity={datalist[sel].checklist[props.id][1]}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}


function AttendanceScreen() {
  var L = [];
  for (var i=0; i<datalist[sel].checklist.length; i+=2) {
    var a = (
      <View style={{flexDirection:'row', margin:10}}>
        <Stamp id={i}/>
        <Stamp id={i+1}/>
      </View>
    );
    L.push(a);
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row', marginHorizontal:20, marginVertical:5, alignItems:'flex-end'}}>
        <Text style={{fontSize:30, fontWeight:'bold'}}>{datalist[sel].key}</Text><Text style={{fontSize:17}}> 의</Text>
      </View>
      <Text style={{fontSize:17, marginHorizontal:20, marginVertical:5}}>수강완료한 강의를 터치하세요</Text>
      <View style={{magin:10}} >
        {L}
      </View>
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
        <Text style={{fontSize:20, textAlign:'center'}}>{props.id}회독</Text>
        <Button title="PLUS" onPress={function() {datalist[sel].n_read.full_num[props.id-1]+=1; save_data(); setExtra(!extra); }}/>
        <Button title="MINUS" onPress={function() {datalist[sel].n_read.full_num[props.id-1]-=1; save_data(); setExtra(!extra); }}/>
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
    <View style={styles.container}>
      <View style={{flexDirection:'row', marginHorizontal:20, marginVertical:5, alignItems:'flex-end'}}>
        <Text style={{fontSize:30, fontWeight:'bold'}}>{datalist[sel].key}</Text><Text style={{fontSize:17}}> 를</Text>
      </View>
      <View style={{flexDirection:'row', marginHorizontal:20, marginVertical:5, fontSize:17, alignItems:'center'}}>
        <TextInput style={{
          padding:3,
          borderRadius:7,
          shadowColor:'gray',
          shadowOpacity:0.5,
          shadowRadius:1,
          shadowOffset:{width:2,height:2},
          textAlign:'center',
          backgroundColor:'white',
          width:30, height:30
        }} 
          placeholder={datalist[sel].n_read.divide.toString()} 
          onChangeText={ function(t) {datalist[sel].n_read.divide = Number(t); save_data(); setExtra(!extra);}}/>
        <Text>  번에 걸쳐서 1회독 복습하기</Text>
      </View>
      <View style={{magin:10}} >
        <Full id={1}/>
        <Full id={2}/>
        <Full id={3}/>
        <Full id={4}/>
      </View>
{/* 
      <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20}}>
        <Text style={{fontSize:20}}>몇 번에 걸쳐 1회독?    </Text>
        <TextInput style={{backgroundColor:'wheat',width:50,height:50,borderRadius:20,fontSize:20, textAlign:'center'}} 
          placeholder={datalist[sel].n_read.divide.toString()} 
          onChangeText={ function(t) {datalist[sel].n_read.divide = Number(t); save_data(); setExtra(!extra);}}/>
      </View>
      <Full id={1}/>
      <Full id={2}/>
      <Full id={3}/>
      <Full id={4}/> */}
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

  if (newAsk=="") {
    var q_btn = <Button title="질문 추가하기" disabled/>
  } else {
    var q_btn = <Button title="질문 추가하기" onPress={function() {datalist[sel].questionlist.push({ask:newAsk}); save_data(); setExtra(!extra);}}/>
  }

  if (newAnswer=="") {
    var a_btn = <Button title="답변 추가하기" disabled/>
  } else {
    var a_btn = <Button title="답변 추가하기" onPress={function() {
      datalist[sel].questionlist.splice(idx, 1, {ask:datalist[sel].questionlist[idx].ask, answer:newAnswer}); 
      save_data();
      setExtra(!extra);}}/>
  }

  return (
    <View style={{paddingTop:10, flex:1}}>
      <View style={{height:'30%'}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
          <View style={{flex:1}}>
            <Text style={{textAlign:'center', fontSize:50}}> QNA </Text>
            <TextInput style={[styles.input, {marginHorizontal:20}]} multiline={true} placeholder="질문을 입력해주세요." onChangeText={setNewAsk}/>
            {q_btn}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <FlatList
        data = {datalist[sel].questionlist}
        extraDate = {extra}
        keyExtractor={(item) => item.ask}  //질문내용을 key로 사용
        renderItem={
          function ({item, index}) {
            const height_out = (index == idx)?120:0;
            const height_in = (index == idx)?100:0;
            const opacity = (index == idx)?100:0;
            return (
              <TouchableOpacity style={[styles.item]} onPress={function() { setIdx(index); setExtra(!extra); }}>
                <Text style={{fontSize:15, padding:5}}>Q. {item.ask}</Text>
                <Text style={{fontSize:15, padding:5}}>A. {item.answer}</Text>
                <View style={{height:height_out, opacity:opacity}}>
                  <TextInput style={[styles.input,{height:height_in}]} multiline={true} placeholder="답변을 입력해주세요." onChangeText={setNewAnswer}/>
                  <View style={{flexDirection:'row'}}>
                    {a_btn}
                    <Button title="질문 삭제하기" onPress={function() {
                      if (idx !=null) datalist[sel].questionlist.splice(idx, 1);
                      save_data();
                      setIdx(null);
                      setExtra(!extra);
                    }} />
                  </View>
                </View>
              </TouchableOpacity>
            );
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
        <Drawer.Screen name="진도체크" component={AttendanceScreen} 
          options={{
            headerStyle: {backgroundColor: '#D6F0FF'},
            headerTintColor: 'black',
            headerTitleStyle: {fontWeight: 'bold'},
          }}/>
        <Drawer.Screen name="회독체크" component={NreadScreen}
          options={{
            headerStyle: {backgroundColor: '#D6F0FF'},
            headerTintColor: 'black',
            headerTitleStyle: {fontWeight: 'bold'},
          }}/>
        <Drawer.Screen name="질의응답" component={QnAScreen}
          options={{
            headerStyle: {backgroundColor: '#D6F0FF'},
            headerTintColor: 'black',
            headerTitleStyle: {fontWeight: 'bold'},
          }}/>
        <Drawer.Screen name="투두달력" component={TodoScreen}
          options={{
            headerStyle: {backgroundColor: '#D6F0FF'},
            headerTintColor: 'black',
            headerTitleStyle: {fontWeight: 'bold'},
          }}/>
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
        <Stack.Screen name="홈" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ALL A+" component={drawer}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}