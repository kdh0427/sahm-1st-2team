-- DROP TALBE
DROP TABLE CAR;
DROP TABLE CUSTOMER;
DROP TABLE BRANCH;
DROP TABLE EMPLOYEE;
DROP TABLE PURCHASE;
DROP TABLE TEMPLATE;
DROP TABLE COMPLAIN;

-- CREATE TABLE
-- CAR 테이블 생성
CREATE TABLE CAR (
    Car_ID VARCHAR2(10) NOT NULL,
    jsonstr VARCHAR2(2000),
    CONSTRAINT PK_CAR_id PRIMARY KEY (Car_ID)
);

-- TEMPLATE 테이블 생성
CREATE TABLE TEMPLATE
(
	Cust_Status VARCHAR2(40) NOT NULL,
	Template_Detail VARCHAR2(500),
	CONSTRAINT UQ_CUSTOMER_st UNIQUE (Cust_Status)
);

-- CUSTOMER 테이블 생성
CREATE TABLE CUSTOMER (
    Cust_ID VARCHAR2(10) NOT NULL,
    jsonstr VARCHAR2(1000),
    Cust_Status VARCHAR2(40),
    CONSTRAINT PK_CUSTOMER PRIMARY KEY (Cust_ID),
    CONSTRAINT FK_TEMPLATE_CUSTOMER_STATUS FOREIGN KEY (Cust_Status) REFERENCES TEMPLATE(Cust_Status)
);

-- CUSTOMER_LOGIN 테이블 생성
CREATE TABLE Customer_Login (
    CuEmail VARCHAR(50) PRIMARY KEY,
    Cust_pwd VARCHAR(20) NOT NULL,
    Cust_ID VARCHAR2(10) NOT NULL,
    CONSTRAINT FK_CUSTOMER_LOGIN FOREIGN KEY (Cust_ID) REFERENCES CUSTOMER(Cust_ID)
);

-- BRANCH 테이블 생성
CREATE TABLE BRANCH (
    Branch_Id VARCHAR2(10) NOT NULL,
    Branch_Name VARCHAR2(100) NOT NULL,
    CONSTRAINT PK_BRANCH PRIMARY KEY (Branch_Id)
);

-- BRANCH 테이블 정보 저장
INSERT INTO BRANCH VALUES ('B01', '서울');
INSERT INTO BRANCH VALUES ('B02', '부산');
INSERT INTO BRANCH VALUES ('B03', '인천');
    
-- EMPLOYEE 테이블 생성
CREATE TABLE EMPLOYEE (
    Emp_Id VARCHAR2(100) NOT NULL,
    jsonstr VARCHAR2(500),
    Branch_Id VARCHAR2(10) NOT NULL,
    CONSTRAINT PK_EMPLOYEE PRIMARY KEY (Emp_Id),
    CONSTRAINT FK_EMPLOYEE FOREIGN KEY (Branch_Id) REFERENCES BRANCH(Branch_Id)
);

-- PURCHASE 테이블 생성
CREATE TABLE PURCHASE (
    Sale_ID VARCHAR2(10) PRIMARY KEY,
    Car_ID VARCHAR2(10) NOT NULL,
    Cust_ID VARCHAR2(10) NOT NULL,
    Emp_Id VARCHAR2(10) NOT NULL,
    jsonstr VARCHAR2(200),
    CONSTRAINT FK_PURCHASE_CAR FOREIGN KEY (Car_ID) REFERENCES CAR(Car_ID),
    CONSTRAINT FK_PURCHASE_CUSTOMER FOREIGN KEY (Cust_ID) REFERENCES CUSTOMER(Cust_ID),
    CONSTRAINT FK_PURCHASE_EMPLOYEE FOREIGN KEY (Emp_Id) REFERENCES EMPLOYEE(EMP_ID)
);

-- COMPLAIN 테이블 생성
CREATE TABLE COMPLAIN
(
	Comp_ID VARCHAR2(10) PRIMARY KEY,
	Cust_ID VARCHAR2(10) NOT NULL,
	Complain_Date DATE,
	Cment VARCHAR2(500),
	Complain VARCHAR2(500),
	Complain_status VARCHAR2(10),
	Cust_Status VARCHAR2(40),
	CONSTRAINT FK_COMPLAIN_CUSTOMER FOREIGN KEY (Cust_ID) REFERENCES CUSTOMER(Cust_ID),
	CONSTRAINT FK_TEMPLATE_CUSTOMER_STATUS2 FOREIGN KEY (Cust_Status) REFERENCES TEMPLATE(Cust_Status)
);