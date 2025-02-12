//Car
INSERT INTO Car VALUES ('CAR001', 'Avante', 'Sedan', 'B');
INSERT INTO Car VALUES ('CAR001', 'Avante', 'Sedan', 'P');
INSERT INTO Car VALUES ('CAR002', 'Sonata', 'Sedan', 'B');
INSERT INTO Car VALUES ('CAR002', 'Sonata', 'Sedan', 'P');
INSERT INTO Car VALUES ('CAR003', 'Grandeur', 'Sedan', 'B');
INSERT INTO Car VALUES ('CAR003', 'Grandeur', 'Sedan', 'P');
INSERT INTO Car VALUES ('CAR004', 'G70', 'Sedan', 'B');
INSERT INTO Car VALUES ('CAR004', 'G70', 'Sedan', 'P');
INSERT INTO Car VALUES ('CAR005', 'G80', 'Sedan', 'B');
INSERT INTO Car VALUES ('CAR005', 'G80', 'Sedan', 'P');
INSERT INTO Car VALUES ('CAR006', 'G90', 'Sedan', 'B');
INSERT INTO Car VALUES ('CAR006', 'G90', 'Sedan', 'P');
INSERT INTO Car VALUES ('CAR007', 'Palisade', 'SUV', 'B');
INSERT INTO Car VALUES ('CAR007', 'Palisade', 'SUV', 'P');
INSERT INTO Car VALUES ('CAR008', 'Tucson', 'SUV', 'B');
INSERT INTO Car VALUES ('CAR008', 'Tucson', 'SUV', 'P');
INSERT INTO Car VALUES ('CAR009', 'Venue', 'SUV', 'B');
INSERT INTO Car VALUES ('CAR009', 'Venue', 'SUV', 'P');
INSERT INTO Car VALUES ('CAR010', 'Kona', 'SUV', 'B');
INSERT INTO Car VALUES ('CAR010', 'Kona', 'SUV', 'P');
INSERT INTO Car VALUES ('CAR011', 'Santa Fe', 'SUV', 'B');
INSERT INTO Car VALUES ('CAR011', 'Santa Fe', 'SUV', 'P');
INSERT INTO Car VALUES ('CAR012', 'GV70', 'SUV', 'B');
INSERT INTO Car VALUES ('CAR012', 'GV70', 'SUV', 'P');
INSERT INTO Car VALUES ('CAR013', 'GV80', 'SUV', 'B');
INSERT INTO Car VALUES ('CAR013', 'GV80', 'SUV', 'P');
INSERT INTO Car VALUES ('CAR014', 'Staria', 'Compact', 'B');
INSERT INTO Car VALUES ('CAR014', 'Staria', 'Compact', 'P');
INSERT INTO Car VALUES ('CAR015', 'GV60', 'Electric', 'B');
INSERT INTO Car VALUES ('CAR015', 'GV60', 'Electric', 'P');
INSERT INTO Car VALUES ('CAR016', 'Ioniq 6', 'Electric', 'B');
INSERT INTO Car VALUES ('CAR016', 'Ioniq 6', 'Electric', 'P');
INSERT INTO Car VALUES ('CAR017', 'Ioniq 5', 'Electric', 'B');
INSERT INTO Car VALUES ('CAR017', 'Ioniq 5', 'Electric', 'P');

//Complain
INSERT INTO Complain VALUES ('C001', TO_DATE('2024-01-10', 'YYYY-MM-DD'), '차량 옵션에 대한 문의', '구매 문의');
INSERT INTO Complain VALUES ('C002', TO_DATE('2023-12-15', 'YYYY-MM-DD'), '재고 여부와 가격 문의', '구매 문의');
INSERT INTO Complain VALUES ('C003', TO_DATE('2024-02-05', 'YYYY-MM-DD'), '할부 프로그램 관련 문의', '구매 문의'); 
INSERT INTO Complain VALUES ('C004', TO_DATE('2024-01-30', 'YYYY-MM-DD'), '시승 예약 관련 문의', '구매 문의'); 
INSERT INTO Complain VALUES ('C005', TO_DATE('2024-02-20', 'YYYY-MM-DD'), '구매 시 혜택 및 할인 여부', '구매 문의'); 

INSERT INTO Complain VALUES ('C006', TO_DATE('2023-09-10', 'YYYY-MM-DD'), '엔진 경고등 점등 문제', '정비 문의'); 
INSERT INTO Complain VALUES ('C007', TO_DATE('2023-08-01', 'YYYY-MM-DD'), '브레이크에서 소음 발생', '정비 문의'); 
INSERT INTO Complain VALUES ('C008', TO_DATE('2023-07-15', 'YYYY-MM-DD'), '에어컨이 정상 작동하지 않음', '정비 문의'); 
INSERT INTO Complain VALUES ('C009', TO_DATE('2023-06-05', 'YYYY-MM-DD'), '오토홀드 기능이 작동하지 않음', '정비 문의'); 
INSERT INTO Complain VALUES ('C010', TO_DATE('2023-05-25', 'YYYY-MM-DD'), '차량 내장재에서 소음 발생', '정비 문의'); 

INSERT INTO Complain VALUES ('C031', TO_DATE('2024-02-10', 'YYYY-MM-DD'), '전기차 충전소 지원 관련 문의', '구매 문의');
INSERT INTO Complain VALUES ('C032', TO_DATE('2024-02-05', 'YYYY-MM-DD'), '특정 모델의 출고 대기 기간 문의', '구매 문의');
INSERT INTO Complain VALUES ('C033', TO_DATE('2024-01-30', 'YYYY-MM-DD'), '차량 유지보수 비용 관련 문의', '구매 문의');
INSERT INTO Complain VALUES ('C034', TO_DATE('2024-01-25', 'YYYY-MM-DD'), '법인 구매 시 할인 여부', '구매 문의');
INSERT INTO Complain VALUES ('C035', TO_DATE('2024-01-20', 'YYYY-MM-DD'), '차량 보험 및 금융 프로그램 문의', '구매 문의');
INSERT INTO Complain VALUES ('C036', TO_DATE('2024-01-15', 'YYYY-MM-DD'), '트레이드 인(중고차 보상) 관련 문의', '구매 문의');
INSERT INTO Complain VALUES ('C037', TO_DATE('2024-01-10', 'YYYY-MM-DD'), '하이브리드 모델과 전기차 비교 문의', '구매 문의');
INSERT INTO Complain VALUES ('C038', TO_DATE('2024-01-05', 'YYYY-MM-DD'), '신차 프로모션 및 할인율 문의', '구매 문의');
INSERT INTO Complain VALUES ('C039', TO_DATE('2023-12-30', 'YYYY-MM-DD'), '특정 색상 및 내부 옵션 변경 가능 여부', '구매 문의');
INSERT INTO Complain VALUES ('C040', TO_DATE('2023-12-25', 'YYYY-MM-DD'), '구매 절차 및 대출 신청 방법 문의', '구매 문의');


//Employee
INSERT INTO Employee VALUES ('E001', '박민수', 'employee1@hyundai.com', 'password1', '010-5555-1001', '부장', 'B01');
INSERT INTO Employee VALUES ('E002', '한지훈', 'employee2@hyundai.com', 'password2', '010-5555-1002', '차장', 'B01');
INSERT INTO Employee VALUES ('E003', '이수민', 'employee3@hyundai.com', 'password3', '010-5555-1003', '과장', 'B01');
INSERT INTO Employee VALUES ('E004', '김정우', 'employee4@hyundai.com', 'password4', '010-5555-1004', '과장', 'B01');
INSERT INTO Employee VALUES ('E005', '송현지', 'employee5@hyundai.com', 'password5', '010-5555-1005', '대리', 'B01');
INSERT INTO Employee VALUES ('E006', '최동훈', 'employee6@hyundai.com', 'password6', '010-5555-1006', '대리', 'B01');
INSERT INTO Employee VALUES ('E007', '서하연', 'employee7@hyundai.com', 'password7', '010-5555-1007', '주임', 'B01');
INSERT INTO Employee VALUES ('E008', '강민혁', 'employee8@hyundai.com', 'password8', '010-5555-1008', '주임', 'B01');
INSERT INTO Employee VALUES ('E009', '윤지수', 'employee9@hyundai.com', 'password9', '010-5555-1009', '사원', 'B01');

INSERT INTO Employee VALUES ('E010', '배진우', 'employee10@hyundai.com', 'password10', '010-5555-1010', '차장', 'B02');
INSERT INTO Employee VALUES ('E011', '이하준', 'employee11@hyundai.com', 'password11', '010-5555-1011', '과장', 'B02');
INSERT INTO Employee VALUES ('E012', '전수현', 'employee12@hyundai.com', 'password12', '010-5555-1012', '대리', 'B02');
INSERT INTO Employee VALUES ('E013', '임지호', 'employee13@hyundai.com', 'password13', '010-5555-1013', '주임', 'B02');
INSERT INTO Employee VALUES ('E014', '강주원', 'employee14@hyundai.com', 'password14', '010-5555-1014', '사원', 'B02');
INSERT INTO Employee VALUES ('E015', '문지현', 'employee15@hyundai.com', 'password15', '010-5555-1015', '사원', 'B02');

INSERT INTO Employee VALUES ('E016', '한서윤', 'employee16@hyundai.com', 'password16', '010-5555-1016', '부장', 'B03');
INSERT INTO Employee VALUES ('E017', '정우진', 'employee17@hyundai.com', 'password17', '010-5555-1017', '차장', 'B03');
INSERT INTO Employee VALUES ('E018', '최윤서', 'employee18@hyundai.com', 'password18', '010-5555-1018', '대리', 'B03');
INSERT INTO Employee VALUES ('E019', '이하영', 'employee19@hyundai.com', 'password19', '010-5555-1019', '대리', 'B03');
INSERT INTO Employee VALUES ('E020', '박성호', 'employee20@hyundai.com', 'password20', '010-5555-1020', '사원', 'B03');


