var Store = {};
var btn = [];
var yesterday_total = 0;
var total_time = 0;
var start_time = 0, rest_time = 0, restart_time = 0, finish_time = 0;
var total_rest = [];
var grass=[];

var full_Date; var m; var date; 
var grass_month; var grass_date;


var month; 
var color = [ "#ffffff","#e6eeff", "#b3cbff", "#80a8ff", "#4d85ff"];
var color2 = [ "#ffffff","#dafdc9", "#8ce065", "#59c228", "#368b0f"];

function loading() {
    var d = new Date();
    var t = localStorage.getItem("Storage");
    Store = JSON.parse(t);

    setInterval(run_everysec,1000);

    if(Store==null) {  //첫방문일 경우
        Store = {};
    } else {
        if(d.toDateString() == Store.full_date) {  //최근에 저장되어있는 날짜와 접속 순간의 날짜가 동일할 시 (= 같은날 접속 시, 공부시간 측정 이어가기)
            m = Store.m;
            date = Store.date;
            start_time = Store.start;
            rest_time = Store.rest;
            restart_time = Store.restart;
            btn = Store.btn;
            total_rest = Store.total_rest;
            document.getElementById("start").innerHTML = "<a id=\"btn_start\" href=\"#now\" style=\"font-family: 'Baloo Tammudu 2', cursive; font-size: 30px;\">You've Already Started!</a>"
        }
        
        //과거 총 공부량 받아오기
        yesterday_total = Store.total;
        //총 시간을 계산하고 다시 _:_:_ 형태로 출력할 수 있도록 하는 연산 
        if((yesterday_total - (yesterday_total % 3600))/3600 < 10) { document.getElementById("h").innerHTML = "0"+ (yesterday_total - (yesterday_total % 3600))/3600;}
        else {document.getElementById("h").innerHTML = (yesterday_total - (yesterday_total % 3600))/3600;}
        if(((yesterday_total - (yesterday_total % 60))/60)%60 < 10) { document.getElementById("m").innerHTML = "0"+ ((yesterday_total - (yesterday_total % 60))/60)%60;}
        else {document.getElementById("m").innerHTML = ((yesterday_total - (yesterday_total % 60))/60)%60;}
        if(yesterday_total % 60 < 10) { document.getElementById("s").innerHTML = "0"+ yesterday_total % 60;}
        else {document.getElementById("s").innerHTML = yesterday_total % 60;}
    
    }
    
}

function start() {
    //시간은 초단위로 저장
    var d = new Date();
    full_date = d.toDateString();  //날짜 백업
    m = d.getMonth(); //월 저장
    date = d.getDate()-1;   //일 저장(0~)
    start_time = d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds();  //시작버튼 누른 시각(초)
    btn.push(0);   //btn배열에 버튼 종류 저장
    Store.full_date = full_date;
    Store.m = m;
    Store.date = date;
    Store.start = start_time;
    Store.btn = btn;
}

function rest() {

    swal({
        title: "진짜...쉬게?",
        text: "오늘의 할당량 다 채울 수 있겠니?",
        icon: "warning",
        buttons: [true, "REST"],
      })
      .then((rest) => {
        if (rest) {
          swal("얼른 다시 돌아와!", {icon: "success", });
          var d = new Date();
          rest_time = d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds();
          btn.push(1);
          Store.rest = rest_time;
          Store.btn = btn;
        } else {
          swal("조금만 더 하자. 화이팅!");
        }
      });
      
}
function restart() {
    swal("🏃‍♀️ ~ 다시 달려 ~ 🏃‍♀️");
    var d = new Date();
    restart_time = d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds();
    total_rest.push(restart_time - rest_time);  //총 휴식시간이 배열에 저장됨
    btn.push(2);
    Store.restart = restart_time;
    Store.total_rest = total_rest;
    Store.btn = btn;
}
function finish() {
    swal({
        title: "오늘 공부는 끝?",
        text: "오늘의 할당량 다 채웠니?",
        icon: "warning",
        buttons: [true, "FINISH"],
      })
      .then((finish) => {
        if (finish) {
          swal("수고했어! 좋은 밤 보내🌙", {icon: "success", });
          var d = new Date();
          finish_time = d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds();
          btn.push(3);
          total_time = cal_total();
          Store.total = total_time;

          cal_grass(total_time);

        } else {
          swal("조금만 더 하자. 화이팅!");
        }
      });
}

function cal_total() {
    var total = finish_time - start_time;
    for (var i = 0; i < total_rest.length; i++) {
        total -= total_rest[i];
    }
    return total;
}

function run_everysec() {
    //매초마다 local에 백업
    localStorage.setItem("Storage", JSON.stringify(Store));
    
    var d = new Date();
    
    switch(btn[btn.length-1]) {  //가장 최근의 button의 키값 가져오기
        case 0 :
            //시작버튼 눌렀을 때
            real_time = d.getHours()*3600 + d.getMinutes()*60 + d.getSeconds() - start_time;
            if((real_time - (real_time % 3600))/3600 < 10) { document.getElementById("hh").innerHTML = "0"+ (real_time - (real_time % 3600))/3600;}
            else {document.getElementById("hh").innerHTML = (real_time - (real_time % 3600))/3600;}
            if(((real_time - (real_time % 60))/60)%60 < 10) { document.getElementById("mm").innerHTML = "0"+ ((real_time - (real_time % 60))/60)%60;}
            else {document.getElementById("mm").innerHTML = ((real_time - (real_time % 60))/60)%60;}
            if(real_time % 60 < 10) { document.getElementById("ss").innerHTML = "0"+ real_time % 60;}
            else {document.getElementById("ss").innerHTML = real_time % 60;}
            break;
        case 1 : 
            //rest 버튼 눌렀을 때
            real_time = rest_time - start_time;
            for(var i = 0; i < total_rest.length; i++) {
                real_time -= total_rest[i];
            }
            if((real_time - (real_time % 3600))/3600 < 10) { document.getElementById("hh").innerHTML = "0"+ (real_time - (real_time % 3600))/3600;}
            else {document.getElementById("hh").innerHTML = (real_time - (real_time % 3600))/3600;}
            if(((real_time - (real_time % 60))/60)%60 < 10) { document.getElementById("mm").innerHTML = "0"+ ((real_time - (real_time % 60))/60)%60;}
            else {document.getElementById("mm").innerHTML = ((real_time - (real_time % 60))/60)%60;}
            if(real_time % 60 < 10) { document.getElementById("ss").innerHTML = "0"+ real_time % 60;}
            else {document.getElementById("ss").innerHTML = real_time % 60;}
            break;
        case 2 :
            //restart 버튼
            real_time = d.getHours()*3600+ d.getMinutes()*60 + d.getSeconds() - start_time;
            for(var i = 0; i < total_rest.length; i++) {
                real_time -= total_rest[i];
            }
            if((real_time - (real_time % 3600))/3600 < 10) { document.getElementById("hh").innerHTML = "0"+ (real_time - (real_time % 3600))/3600;}
            else {document.getElementById("hh").innerHTML = (real_time - (real_time % 3600))/3600;}
            if(((real_time - (real_time % 60))/60)%60 < 10) { document.getElementById("mm").innerHTML = "0"+ ((real_time - (real_time % 60))/60)%60;}
            else {document.getElementById("mm").innerHTML = ((real_time - (real_time % 60))/60)%60;}
            if(real_time % 60 < 10) { document.getElementById("ss").innerHTML = "0"+ real_time % 60;}
            else {document.getElementById("ss").innerHTML = real_time % 60;}
            break;
        case 3 :
            //finish 버튼
            document.getElementById("time").innerHTML = "YOU'RE THE BEST"
            break;
    }
}

/*달력 복원*/
function calendar() {
    month = Store.month;
    if(month == null) { 
        month = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
     }
    for(var x = 0; x < 12; x++) {
        for(var y = 0; y < 42; y++) {
            document.getElementById(x+"_"+y).style.backgroundColor = color[month[x][y]];
        }
    }
}
//달력 클릭시 색상변경
function change(x, y) {
    month[x][y] = (month[x][y]+1)%5;  //color의 index 값을 클릭할때마다 변경시켜주기
    document.getElementById(x+"_"+y).style.backgroundColor = color[month[x][y]];
    Store.month = month;
}

/*grass 복원*/
function put_grass() {
    grass = Store.grass;
    if(grass==undefined){grass=[];}
    else{
        for(var i = 0; i < grass.length; i++) {
            var grass_month = grass[i].month;
            var grass_date = grass[i].date;
            if(grass_month<10) {var mm = "0"+(grass_month+1);}
            else {var mm = grass_month+1;}
            var start_date = new Date('2021-'+mm+'-01');
            var start_day = start_date.getDay();   //일 = 0
            var real_date = Number(grass_date)+Number(start_day);
            document.getElementById(grass_month+"/"+real_date).style.backgroundColor = grass[i].color;   //해당 월의 1일 요일inedex를 더하여 달력의 알맞는 위치에 색 칠하기
        }
    }
}
/*grass 만들기*/
function cal_grass(total_time) {
    if(total_time >= 32400) {   //9시간 이상
        var grass_item = { month:m, date:date, color:"#368b0f"};
        grass.push(grass_item);
    } else if(total_time >= 21600) {   //6시간 이상
        var grass_item = { month:m, date:date, color:"#59c228"};
        grass.push(grass_item);
    } else if(total_time >= 10800) {   //3시간 이상
        var grass_item = { month:m, date:date, color:"#8ce065"};
    } else if(total_time > 0) {    //0시간 초과
        var grass_item = { month:m, date:date, color:"#dafdc9"};
        grass.push(grass_item);
    }
    Store.grass = grass;
}

//마우스 btn hover
function ask_rest() {
    document.getElementById("btn_txt").innerHTML = "또... 쉬게? <img src=\"hmm.png\" width=\"30px\">"
}
//마우스 btn 바깥으로 가져갈 시
function out_btn() {
    document.getElementById("btn_txt").innerHTML = " ";
}




/*평가용 text*/
function test() {
    swal({
        title: "임시 데이터를 정말 추가하시겠습니다?",
        text: "1월~5월 데이터가 추가되며, 이전의 데이터로 복원되지 않습니다.",
        icon: "warning",
        buttons: [true, "OK"],
      })
      .then((test) => {
        if (test) {
            swal("임시데이터가 추가되었습니다.", {icon: "success", });
            for(var i = 0; i < 5; i++) {
                for(var j = 0; j < 30; j++) {
                    grass.push({month:i, date:j, color:color2[j%5]});
                }
            }
            Store.grass = grass;
        } else {
          swal("취소하셨습니다.");
        }
      });
}