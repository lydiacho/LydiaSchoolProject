CREATE TABLE user_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(10) NOT NULL,
    studentnum VARCHAR(8) NOT NULL,
    password VARCHAR(10) NOT NULL );

CREATE TABLE waiting_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userid INT NOT NULL,
    name VARCHAR(10) NOT NULL,
    store VARCHAR(10) NOT NULL,
    min_price INT,
    deliv_price INT NOT NULL,
    people INT NOT NULL,
    people_now INT DEFAULT 0,
    ordertime VARCHAR(5) NOT NULL,
    location VARCHAR(10) NOT NULL,
    opentalk VARCHAR(50) ,
    link VARCHAR(50) ,
    enable TINYINT DEFAULT 0);

CREATE TABLE order_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    waiting_id INT NOT NULL,
    userid INT NOT NULL,
    menu VARCHAR(10) NOT NULL,
    price INT NOT NULL
)
