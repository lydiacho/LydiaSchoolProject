import pymysql
import PySimpleGUI as psg
import webbrowser

#회원가입----------------------------------------------------------------------------
def signup_win():
    signup_layout=[[psg.Text("닉네임 : "), psg.In(key="nick" )],
            [psg.Text("학번   : "), psg.In(key="num" )],
            [psg.Text("비밀번호 : "), psg.In(key="password" )],
            [psg.Button("회원가입")]]
    signup_w = psg.Window("회원가입", signup_layout)

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
    index = ["매장명","지점","배달비","인원","현재인원"]
    home_layout=[[psg.Text("벗들의 배달")],
            [psg.Button("모집하기")],
            [psg.Button("새로고침")],
            [psg.Table(values=data, headings=index, key="mylist", def_col_width=15, auto_size_columns=False, justification='center', enable_events=True)]
            ]
    home_w = psg.Window("벗들의 배달", home_layout)


    while True:
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
            home_w.refresh()
        elif e=='mylist':
            curs = mycon.cursor()
            mys = "select * from waiting_list where name like \'"+data[v['mylist'][0]][0]+"\' && store like \'"+ data[v['mylist'][0]][1]+"\'"
            curs.execute(mys)
            row = curs.fetchall()            
            if row[0][1] == now_user:
                manager_win(row[0][0])
                home_w.refresh()
            else :
                detail_win(row[0][0],row[0][2],row[0][3],row[0][4],row[0][5],row[0][6],row[0][7],row[0][8],row[0][9],row[0][10],row[0][11])
                home_w.refresh()
    home_w.close()

#모집하기-------------------------------------------------------------------
def make_win():
    make_layout=[[psg.Text("*표시된 항목은 필수로 작성해주세요.")],
                [psg.Text("매장명* : "), psg.In(key="name")],
                [psg.Text("지점* : "), psg.In(key="store")],
                [psg.Text("최소주문금액 : "), psg.In(key="min_price")],
                [psg.Text("배달비* : "), psg.In(key="deliv_price")],
                [psg.Text("모집인원* : "), psg.In(key="people")],
                [psg.Text("주문예정시간* : "), psg.In(key="ordertime")],
                [psg.Text("만나는위치* : "), psg.In(key="location")],
                [psg.Text("오픈카톡방 : "), psg.In(key="opentalk")],
                [psg.Text("앱링크 : "), psg.In(key="link")],
                [psg.Button("등록")]]

    make_w = psg.Window("모집하기", make_layout)

    while True:
        e,v = make_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="등록":
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

            mys = "insert into waiting_list(userid, name, store, min_price, deliv_price, people, ordertime, location, opentalk, link, enable) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,1)"
            curs.execute(mys, value)
            mycon.commit()
            break
    make_w.close()

#매니징화면-----------------------------------------------------------------
def manager_win(idx):
    data=[]
    index=["메뉴", "가격"]
    bank=["신한", "국민","기업","농협","산업","우리","하나","카카오","토스"]
    left_layout=[[psg.Button("새로고침")],
                [psg.Text("현재인원 : "), psg.Text(key="people")],
                [psg.Table(values=data, headings=index, key="mylist", def_col_width=20, auto_size_columns=False, justification='center', enable_events=True)]
                ]
    right_layout=[[psg.Text("은행"), psg.Combo(values=bank, key='bank_combo', size=(10,1))],
                [psg.Text("계좌 : "), psg.Input(size=(30,1), key="account")],
                [psg.Button("마감하기")],
                [psg.Button("배달도착")],
                [psg.Button("삭제하기")]]
    manager_layout = [[psg.Column(left_layout),
                        psg.VSeparator(),
                        psg.Column(right_layout)]]

    manager_w = psg.Window("주문자_대기하기", manager_layout)

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

            mys = "select COUNT(*) from order_list where waiting_id=%s"
            curs.execute(mys,idx)
            count = curs.fetchall()
            manager_w['people'].update(count[0][0])
        elif e=="마감하기":
            #계좌정보 쏴야함
            curs = mycon.cursor()
            mys = ""
            curs.execute(mys)
        elif e=="배달도착":
            curs = mycon.cursor()
            mys = ""
            curs.execute(mys)
        elif e=="삭제하기":
            curs = mycon.cursor()
            mys = ""
            curs.execute(mys)
    manager_w.close()

#상세화면-------------------------------------------------------------------
def detail_win(id,name,store,min_price,deliv_price,people,people_now,ordertime,location,opentalk,link):
    detail_layout=[[psg.Text("매장명 : "), psg.Text(name)],
                [psg.Text("지점 : "), psg.Text(store)],
                [psg.Text("배달비 : "), psg.Text(deliv_price)],
                [psg.Text("모집인원 : "), psg.Text(people)],
                [psg.Text("현재인원 : "), psg.Text(people_now)],
                [psg.Text("주문예정시간 : "), psg.Text(ordertime)],
                [psg.Text("만나는위치 : "), psg.Text(location)],
                [psg.Text("최소주문금액 : "), psg.Text(min_price)],
                [psg.Text("오픈카톡방 CLICK", enable_events=True, key="opentalk")],
                [psg.Text("앱링크 CLICK", enable_events=True, key="link")],
                [psg.Button("참가하기")]
                ]
    detail_w = psg.Window("상세보기", detail_layout)

    while True:
        e,v = detail_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="참가하기":
            curs = mycon.cursor()
            mys = "update waiting_list set people_now=%s where id=%s"
            value = (people_now+1, id)
            curs.execute(mys,value)
            mycon.commit()
            join_win(id)
            break
        elif e=="opentalk":
            webbrowser.open(opentalk)
        elif e=="link":
            webbrowser.open(link)
    detail_w.close()

#참가----------------------------------------------------------------------
def join_win(id):
    data=[]
    index=["메뉴", "가격"]
    join_layout = [[psg.Button("새로고침")],
                [psg.In(key="menu"), psg.In(key="price"), psg.Button("주문하기")],
                [psg.Table(values=data, headings=index, key="mylist", def_col_width=20, auto_size_columns=False, justification='center')],
                [psg.Text(key="my_pay")]]

    join_w = psg.Window("참가자_대기하기", join_layout)

    while True:
        e,v = join_w.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="새로고침":
            curs = mycon.cursor()
            mys = "select menu, price from order_list where waiting_id=%s"
            curs.execute(mys,id)
            data = curs.fetchall()
            join_w['mylist'].update(values = data)

            mys = "select deliv_price, people_now from waiting_list where id=%s"
            curs.execute(mys,id)
            data = curs.fetchall()
            price = int(round(data[0][0]/data[0][1],-1))
            join_w['my_pay'].update("인당 배달비 약 "+str(price)+"원")

        elif e=="주문하기":
            curs = mycon.cursor()
            mys = "insert into order_list(waiting_id, userid, menu, price) values (%s,%s,%s,%s)"
            value = (id,now_user,v['menu'], v['price'])
            curs.execute(mys,value)
            mycon.commit()
            
    join_w.close()

#로그인---------------------------------------------------------------------
signin_layout = [[psg.Text("벗들의 배달")],
            [psg.Text("학번 : "), psg.In(key="num" )],
            [psg.Text("PW   : "), psg.In(key="password" )],
            [psg.Button("로그인"), psg.Button("회원가입")]
            ]
mycon = pymysql.connect(host="54.180.117.205", user="lydia", password="lydia0804!", db="LydiaDB", charset="utf8")

signin_win = psg.Window("로그인", signin_layout)

#로그인한 회원 idx 변수에 저장
now_user = 0
try : 
    while True:
        e,v = signin_win.read()
        if e==psg.WINDOW_CLOSED:
            break
        elif e=="회원가입":
            signup_win()
        elif e=="로그인":
            curs = mycon.cursor()
            mys = "select id,nickname from user_list where studentnum like \'"+v['num']+"\' && password like \'"+v['password']+"\'"
            try : 
                curs.execute(mys)
                row = curs.fetchall()
                psg.popup(row[0][1]+"님 안녕하세요!")
                now_user = row[0][0]
                home_win()
                break
            except IndexError as e: 
                psg.popup("학번,비밀번호를 다시 확인해주세요.")
                continue
finally:
    mycon.close()

signin_win.close()