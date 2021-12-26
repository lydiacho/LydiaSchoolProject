from PySimpleGUI.PySimpleGUI import SetOptions, Text
import pymysql
import PySimpleGUI as psg
import webbrowser


#회원가입----------------------------------------------------------------------------
def signup_win():
    left_layout = [[psg.Text("Welcome!", font=('any',20,'bold'))],
                 [psg.Image('./img/delivery_100.png')]]
    right_layout=[[psg.Text("닉네임", size=(8,1)), psg.In(key="nick", size=(15,1))],
            [psg.Text("학번", size=(8,1)), psg.In(key="num" , size=(15,1))],
            [psg.Text("비밀번호", size=(8,1)), psg.In(key="password" , size=(15,1))],
            [psg.Text("")],
            [psg.Button("회원가입", expand_x=True)]]
    signup_layout= [[psg.Column(left_layout, justification='c'), psg.VSeparator(), psg.Column(right_layout)]]
    signup_w = psg.Window("회원가입", signup_layout, element_justification='c')

    while True:
        e,v = signup_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="회원가입":
            curs = mycon.cursor()
            nick = v['nick']
            num = v['num']
            pw = v['password']

            mys = "insert into user_list(nickname, studentnum, password) values (%s,%s,%s)"
            value = (nick,num,pw)
            curs.execute(mys, value)
            mycon.commit()
            psg.popup("회원가입 성공!")
            break
    signup_w.close()


#메인화면----------------------------------------------------------------
def home_win():
    data = []
    index = ["매장명","지점","배달비","희망인원","현재인원"]

    right_layout=[[psg.Text("매장명", size=(7,1)), psg.In(key="name", size=(15,1))],
        [psg.Text("배달비", size=(7,1)), psg.Slider(key="deliv_price_slider",range=(0, 5000), orientation='h', size=(12, 15), default_value=5000, text_color='green',trough_color='white')],
        [psg.Text("희망인원", size=(7,1)), psg.Slider(key="people_slider",range=(1, 10), orientation='h', size=(12, 15), default_value=10, text_color='green', trough_color='white')],
        [psg.Text("카톡방", size=(7,1)), psg.Radio('⭕', "kakao_radio",key='kakao_O'), psg.Radio('❌', "kakao_radio",key='kakao_X')],
        [psg.Button("검색하기", expand_x=True)]]
    frame_layout=[[psg.Table(values=data, headings=index, key="mylist", def_col_width=10, auto_size_columns=False, justification='center', enable_events=True, text_color='black'),
        psg.Column(right_layout)]]
    home_layout=[[psg.Image('./img/delivery_icon.png'), psg.Text(user_nick+"벗, 맛있는 식사 되세요 :)", text_color='#469840', font=('any',12,'bold')), 
        psg.Button("",key="모집하기",image_filename='./img/add.png', image_size=(27,27), border_width=0, button_color=('#E8FFE2','#E8FFE2')),
        psg.Button("",key="새로고침", image_filename='./img/refresh_icon.png', image_size=(25,25), image_subsample=1, border_width=0, button_color=('#E8FFE2','#E8FFE2'))],
        [psg.Frame(" 현재 모집중 ",frame_layout, title_color='green',font=('any 12 bold'))]]

    home_w = psg.Window("벗들의 배달", home_layout, finalize=True)

    
    #바로 load
    curs = mycon.cursor()
    mys = "select name,store,deliv_price, people, people_now from waiting_list"
    curs.execute(mys)
    data = curs.fetchall()
    home_w['mylist'].update(values = data)

    while True:
        
        #refresh
        curs = mycon.cursor()
        mys = "select distinct refresh from waiting_list"
        curs.execute(mys)
        refresh = curs.fetchone()
        if (refresh[0]==1) :
            curs = mycon.cursor()
            mys = "select name,store,deliv_price, people, people_now from waiting_list"
            curs.execute(mys)
            data = curs.fetchall()
            home_w['mylist'].update(values = data)
            mys = "update waiting_list set refresh=0"
            curs.execute(mys)
            mycon.commit()

        
        e,v = home_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="새로고침":
            curs = mycon.cursor()
            mys = "select name,store,deliv_price, people, people_now from waiting_list"
            curs.execute(mys)
            data = curs.fetchall()
            home_w['mylist'].update(values = data)
        elif e=="모집하기":
            make_win()
        elif e=="검색하기":
            name=''
            kakao=''
            if (v['name']!='') :
                name = " && name LIKE \'%"+v['name']+"%\'"
            if (v['kakao_O']==True):
                kakao = " && opentalk LIKE \'%.kakao.com%\'"
            elif (v['kakao_X']==True):
                kakao = " && opentalk LIKE \'Ctrl+v LINK\'"
            curs = mycon.cursor()
            mys = "select name,store,deliv_price, people, people_now from waiting_list where deliv_price <= \'"+str(int(v['deliv_price_slider']))+"\' && people <= \'"+str(int(v['people_slider']))+"\'" + name + kakao
            curs.execute(mys)
            data = curs.fetchall()
            home_w['mylist'].update(values = data)

        elif e=='mylist':
            mys = "select * from waiting_list where name=\'"+data[v['mylist'][0]][0]+"\'"
            curs.execute(mys)
            row1 = curs.fetchall()

            #이미 참가한 사람은 상세정보보기가 아닌 바로 참가자 대기화면으로 갈 수 있도록 
            mys = "select u.id from waiting_list as w join user_list as u on u.join_idx=w.id where join_idx=%s"
            curs.execute(mys, row1[0][0])
            row2 = curs.fetchall() 
            list = []  #참가자 idx list
            for i in row2 :
                list.append(i[0])
            if row1[0][1] == now_user:
                manager_win(row1[0][0], row1[0][9])
            elif now_user in list :
                join_win(row1[0][0],row1[0][5],row1[0][7])
            else :
                detail_win(row1[0][0],row1[0][2],row1[0][3],row1[0][4],row1[0][5],row1[0][6],row1[0][7],row1[0][8],row1[0][9],row1[0][10],row1[0][11])
    home_w.close()

#모집하기-------------------------------------------------------------------
def make_win():
    frame_layout=[[psg.Text("매장명", size=(7,1)), psg.In(key="name", size=(12,1))],
                [psg.Text("지점", size=(7,1)), psg.In(key="store", size=(12,1))],
                [psg.Text("배달비", size=(7,1)), psg.In(key="deliv_price", size=(12,1))],
                [psg.Text("모집인원", size=(7,1)), psg.In(key="people", size=(12,1))],
                [psg.Text("주문시간", size=(7,1)), psg.In(key="ordertime", size=(12,1))],
                [psg.Text("접선위치", size=(7,1)), psg.In(key="location", size=(12,1))],
                [psg.Text("최소주문", size=(7,1)), psg.In(key="min_price", size=(12,1))]]
    frame2_layout=[[psg.Text("오픈카톡", size=(7,1)), psg.In(key="opentalk", size=(12,1), default_text="Ctrl+v LINK")],
                [psg.Text("배달앱", size=(7,1)), psg.In(key="link", size=(12,1), default_text="Ctrl+v LINK")]]
    col1_layout=[[psg.Frame(" 필수항목 ", frame_layout,title_color='green',font=('any 12 bold'))]]
    col2_layout=[[psg.Frame(" 선택항목 ", frame2_layout,title_color='green',font=('any 12 bold'))], 
                [psg.Text("")],[psg.Button("모집시작", expand_x=True)]]
    
    make_layout=[[psg.Column(col1_layout),psg.Column(col2_layout)]]

    make_w = psg.Window("모집하기", make_layout)

    while True:
        e,v = make_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="모집시작":
            curs = mycon.cursor()
            name = v['name']
            store = v['store']
            min_price = v['min_price']
            deliv_price = v['deliv_price']
            people = v['people']
            ordertime = v['ordertime']
            location = v['location']
            opentalk = v['opentalk']
            link = v['link']

            value = (now_user, name, store, min_price, deliv_price, people, ordertime, location, opentalk, link)
            curs = mycon.cursor()
            mys = "insert into waiting_list(userid, name, store, min_price, deliv_price, people, ordertime, location, opentalk, link) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            curs.execute(mys, value)
            mycon.commit()

            mys = "update waiting_list set refresh=1"
            curs.execute(mys)
            mycon.commit()

            psg.popup("참여자를 기다려주세요!")
                        
            break
    make_w.close()

#주문자 대기화면-----------------------------------------------------------------
def manager_win(idx,location):
    data=[]
    index=["메뉴", "가격"]
    bank=["신한", "국민","기업","농협","산업","우리","하나","카카오","토스"]
    left_layout=[
                [psg.Text("현재인원 ", size=(6,1)), psg.Text(key="people", text_color='#469840',font=('any',10,'bold'))],
                [psg.Table(values=data, headings=index, key="mylist", def_col_width=10, auto_size_columns=False, justification='center', enable_events=True, text_color='black')]
                ]
    price_layout=[[psg.Combo(values=bank, key='bank_combo', size=(10,1)), psg.Input(size=(20,1), key="account")],
                [psg.Text("인당 배달비", size=(11,1)), psg.Input(size=(20,1), key="deliv_price")]]
    notice_layout=[[psg.Multiline("원하시는 공지를 입력하세요", key="note", expand_x=True, size=(30,2)), 
                    psg.Button("",key="공지하기", image_filename='./img/notice.png', image_size=(40,35), border_width=0, button_color=('#E8FFE2','#E8FFE2'))]]
    right_layout=[[psg.Frame(" 입금정보 입력 ",price_layout, title_color='green',font=('any 12 bold'), expand_x=True)],
                [psg.Button("마감하기", expand_x=True), psg.Button("배달도착", expand_x=True)],
                [psg.Frame(" 공지하기 ",notice_layout, title_color='green',font=('any 12 bold'))]
                ]
    frame1_layout=[[psg.Frame(" 주문현황 ",left_layout, title_color='green',font=('any 12 bold'))]]
    manager_layout=[[psg.Image('./img/delivery_icon.png'), psg.Text("주문자 대기", text_color='#469840', font=('any',12,'bold')),
                psg.Button("",key="새로고침", image_filename='./img/refresh_icon.png', image_size=(25,25), image_subsample=1, border_width=0, button_color=('#E8FFE2','#E8FFE2'))],
                [psg.Column(frame1_layout), psg.Column(right_layout)]]

    manager_w = psg.Window("주문자_대기하기", manager_layout, finalize=True)

    #내용 바로 load
    curs = mycon.cursor()
    mys = "select menu, price from order_list where waiting_id=%s"
    curs.execute(mys,idx)
    data = curs.fetchall()
    manager_w['mylist'].update(values = data)

    mys = "select people_now from waiting_list where id=%s"
    curs.execute(mys,idx)
    count = curs.fetchall()
    manager_w['people'].update(count[0][0])


    while True:
        e,v = manager_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="새로고침":
            curs = mycon.cursor()
            mys = "select menu, price from order_list where waiting_id=%s"
            curs.execute(mys,idx)
            data = curs.fetchall()
            manager_w['mylist'].update(values = data)

            mys = "select people_now from waiting_list where id=%s"
            curs.execute(mys,idx)
            count = curs.fetchall()
            manager_w['people'].update(count[0][0])

        elif e=="마감하기":
            curs = mycon.cursor()
            mys = "UPDATE order_list SET account=%s where waiting_id=%s"
            notice = v['bank_combo']+" "+v['account']+"\n인당 배달비 : "+v['deliv_price']+"원"
            value = (notice,idx)
            curs.execute(mys,value)
            mycon.commit()

            mys = "DELETE FROM waiting_list WHERE id=%s"
            curs.execute(mys,idx)
            mycon.commit()

            mys = "update waiting_list set refresh=1"
            curs.execute(mys)
            mycon.commit()

            psg.popup("모집이 마감되었습니다")

        elif e=="배달도착":
            curs = mycon.cursor()
            mys = "UPDATE order_list SET account=%s where waiting_id=%s"
            value = (location+"으로 와주세요!",idx)
            curs.execute(mys, value)
            mycon.commit()
            psg.popup("위치가 공지되었습니다")

            mys = "update waiting_list set refresh=1"
            curs.execute(mys)
            mycon.commit()
            break
        
        elif e=="공지하기":
            curs = mycon.cursor()
            mys = "UPDATE order_list SET account=%s where waiting_id=%s"
            value = (v['note'],idx)
            curs.execute(mys, value)
            mycon.commit()
            psg.popup("공지가 전송되었습니다")


    manager_w.close()

#상세화면-------------------------------------------------------------------
def detail_win(id,name,store,min_price,deliv_price,people,people_now,ordertime,location,opentalk,link):
    detail_layout=[[psg.Text("매장명", size=(7,1)), psg.Text(name)],
                [psg.Text("지점", size=(7,1)), psg.Text(store)],
                [psg.Text("배달비", size=(7,1)), psg.Text(deliv_price)],
                [psg.Text("모집인원", size=(7,1)), psg.Text(people)],
                [psg.Text("현재인원", size=(7,1)), psg.Text(people_now)],
                [psg.Text("주문시간", size=(7,1)), psg.Text(ordertime)],
                [psg.Text("접선위치", size=(7,1)), psg.Text(location)],
                [psg.Text("최소주문", size=(7,1)), psg.Text(min_price)],
                [psg.Button("메뉴둘러보기"), psg.Button("",key="오픈카톡", image_filename='./img/talk_50.png', image_size=(50,50), border_width=0, button_color=('#E8FFE2','#E8FFE2')) ,
                psg.Button("",key="참가하기", image_filename='./img/login_50.png', image_size=(50,50), border_width=0, button_color=('#E8FFE2','#E8FFE2'))],
                ]
    detail_w = psg.Window("상세보기", detail_layout)

    while True:
        e,v = detail_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="참가하기":
            curs = mycon.cursor()
            mys = "update user_list set join_idx=%s where id=%s"
            val = (id, now_user)
            curs.execute(mys,val)
            mycon.commit()
            join_win(id, deliv_price, people_now)
            break
        elif e=="오픈카톡":
            webbrowser.open(opentalk)
        elif e=="메뉴둘러보기":
            webbrowser.open(link)
    detail_w.close()

#참여자 대기 ----------------------------------------------------------------------
def join_win(id, deliv_price,people_now):

    data=[]
    index=["메뉴", "가격"]
    
    left_layout=[
                [psg.Text("인당 예상배달비 ", size=(12,1)), psg.Text(key="my_pay", text_color='#469840',font=('any',10,'bold'))],
                [psg.Table(values=data, headings=index, key="mylist", def_col_width=10, auto_size_columns=False, justification='center', enable_events=True, text_color='black')]
                ]
    order_layout=[[psg.Text("메뉴", size=(4,1)), psg.Input(size=(20,1), key="menu")],
                [psg.Text("가격", size=(4,1)), psg.Input(size=(20,1), key="price")]]
    notice_layout=[[psg.Text(key="notice",size=(17,5), font='any 14 bold', text_color='red', justification='c', expand_y=True)]]
    right_layout=[[psg.Frame(" 메뉴 주문하기 ",order_layout, title_color='green',font=('any 12 bold'), expand_x=True)],
                [psg.Button("메뉴 둘러보기", expand_x=True), psg.Button("주문하기", expand_x=True)],
                [psg.Frame(" 주문자 공지 ",notice_layout, title_color='green',font=('any 12 bold'), expand_x=True, expand_y=True)]
                ]
    frame1_layout=[[psg.Frame(" 주문현황 ",left_layout,expand_y=True, title_color='green',font=('any 12 bold'))]]
    join_layout=[[psg.Image('./img/delivery_icon.png'), psg.Text("참여자 대기", text_color='#469840', font=('any 12 bold')),
                psg.Button("",key="오픈카톡", image_filename='./img/talk_50.png', image_size=(50,50), image_subsample=2, border_width=0, button_color=('#E8FFE2','#E8FFE2')),
                psg.Button("",key="새로고침", image_filename='./img/refresh_icon.png', image_size=(25,25), image_subsample=1, border_width=0, button_color=('#E8FFE2','#E8FFE2'))],
                [psg.Column(frame1_layout), psg.Column(right_layout, expand_y=True)]]
    
    join_w = psg.Window("참가자_대기하기", join_layout, finalize=True)

    #바로 load
    curs = mycon.cursor()
    mys = "select menu, price from order_list where waiting_id=%s"
    curs.execute(mys,id)
    data = curs.fetchall()
    join_w['mylist'].update(values = data)

    mys = "select deliv_price, people_now from waiting_list where id=%s"
    curs.execute(mys,id)
    data = curs.fetchall()
    total_people = data[0][1]+1
    price = int(round(data[0][0]/total_people,-1)) 
    join_w['my_pay'].update(str(price)+"원")

    while True:
        e,v = join_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="오픈카톡":
            curs = mycon.cursor()
            mys = "select opentalk from waiting_list where id=%s"
            curs.execute(mys,id)
            data = curs.fetchone()
            webbrowser.open(data[0])
        elif e=="메뉴 둘러보기":
            curs = mycon.cursor()
            mys = "select link from waiting_list where id=%s"
            curs.execute(mys,id)
            data = curs.fetchone()
            webbrowser.open(data[0])
        elif e=="새로고침":
            curs = mycon.cursor()
            mys = "select menu, price from order_list where waiting_id=%s"
            curs.execute(mys,id)
            data = curs.fetchall()
            join_w['mylist'].update(values = data)

            try:
                mys = "select DISTINCT account from order_list where waiting_id=%s "
                curs.execute(mys,id)
                data = curs.fetchone()
                join_w['notice'].update(data[0])

                total_people = people_now+1
                price = int(round(deliv_price/total_people,-1)) 
                join_w['my_pay'].update(str(price)+"원")

            except:
                psg.popup("메뉴를 먼저 추가해주세요!")
                continue

        elif e=="주문하기":
            curs = mycon.cursor()
            mys = "insert into order_list(waiting_id, userid, menu, price,account) values (%s,%s,%s,%s,%s)"
            value = (id,now_user,v['menu'], v['price'], "")
            curs.execute(mys,value)
            mycon.commit()

            mys2 = "update waiting_list set people_now=%s where id=%s"
            value2 = (people_now+1, id)
            curs.execute(mys2,value2)
            mycon.commit()

            #주문현황에 바로 추가될 수 있도록 (피드백반영사항)
            curs = mycon.cursor()
            mys = "select menu, price from order_list where waiting_id=%s"
            curs.execute(mys,id)
            data = curs.fetchall()
            join_w['mylist'].update(values = data)

            mys = "select deliv_price, people_now from waiting_list where id=%s"
            curs.execute(mys,id)
            data = curs.fetchall()
            total_people = data[0][1]+1
            price = int(round(data[0][0]/total_people,-1)) 
            join_w['my_pay'].update(str(price)+"원")

            psg.popup("주문 완료")
            
    join_w.close()

#로그인---------------------------------------------------------------------
SetOptions(background_color='#E8FFE2', text_element_background_color='#E8FFE2', text_color='black',
        element_background_color='#E8FFE2', scrollbar_color='pink', 
        input_elements_background_color='white', button_color=('#469840','white'))

signin_layout = [[psg.Text("E-HOUSE", font=('any',20,'bold'))],
            [psg.Image('./img/delivery_100.png')],
            [psg.Text('DELIVERY', font=('any',20,'bold'))],
            [psg.Text("학번"), psg.In(key="num", size=(15,1)), psg.Button(" 로그인 ")],
            [psg.Text("PW"), psg.In(key="password", size=(15,1) ), psg.Button("회원가입")]
            ]

mycon = pymysql.connect(host="54.180.117.205", user="lydia", password="lydia0804!", db="LydiaDB", charset="utf8")
mycon.autocommit(True)
signin_win = psg.Window("로그인", signin_layout, element_justification='c')

#로그인한 회원 idx 변수에 저장
now_user = 0
user_nick = ''
try : 
    while True:
        e,v = signin_win.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="회원가입":
            signup_win()
        elif e==" 로그인 ":
            curs = mycon.cursor()
            mys = "select id,nickname from user_list where studentnum like \'"+v['num']+"\' && password like \'"+v['password']+"\'"
            try : 
                curs.execute(mys)
                row = curs.fetchall()
                user_nick = row[0][1]
                psg.popup(user_nick+"벗, 안녕하세요!")
                now_user = row[0][0]
                home_win()
                break
            except IndexError as e: 
                psg.popup("학번,비밀번호를 다시 확인해주세요.")
                continue
            
finally:
    mycon.close()

signin_win.close()