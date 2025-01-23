-- DROP TABLE
DROP TABLE PURCHASE;
DROP TABLE TEMPLATE;
DROP TABLE COMPLAIN;

-- CREATE TABLE
-- PURCHASE 테이블 생성
CREATE TABLE PURCHASE (
    Sale_ID VARCHAR2(10) PRIMARY KEY,
    Car_ID VARCHAR2(10) NOT NULL,
    Car_Price NUMBER(9, 0) NOT NULL,
    Cust_ID VARCHAR2(10) NOT NULL,
    Sale_Date DATE,
    Emp_Id VARCHAR2(10) NOT NULL,
    CONSTRAINT FK_PURCHASE_CAR FOREIGN KEY (Car_ID) REFERENCES CAR(Car_ID),
    CONSTRAINT FK_PURCHASE_CUSTOMER FOREIGN KEY (Cust_ID) REFERENCES CUSTOMER(Cust_ID),
    CONSTRAINT FK_PURCHASE_EMPLOYEE FOREIGN KEY (Emp_Id) REFERENCES EMPLOYEE(EMP_ID)
);

-- TEMPLATE 테이블 생성
CREATE TABLE TEMPLATE
(
	Cust_Status VARCHAR2(10) NOT NULL,
	Template_Detail VARCHAR2(500),
	CONSTRAINT FK_TEMPLATE_CUSTOMER_STATUS FOREIGN KEY (Cust_Status) REFERENCES CUSTOMER(Cust_Status)
);

-- COMPLAIN 테이블 생성
CREATE TABLE COMPLAIN
(
	 Cust_ID VARCHAR2(10) NOT NULL,
	 Complain_Date DATE NOT NULL,
	 Complain_Comment VARCHAR2(255),
	 Complain_Type VARCHAR2(10) NOT NULL,
	 CONSTRAINT FK_COMPLAIN_CUSTOMER FOREIGN KEY (Cust_ID) REFERENCES CUSTOMER(Cust_ID)
);
