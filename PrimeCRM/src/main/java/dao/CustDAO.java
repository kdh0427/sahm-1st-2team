package dao;

import java.sql.*;
import java.util.*;
import javax.naming.NamingException;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import util.ConnectionPool;


public class CustDAO {
	
	public boolean insert(String jsonstr, String status) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "INSERT INTO Customer(jsonstr, CUST_STATUS) VALUES (?, ?)";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, jsonstr);
			stmt.setString(2, status);
			
			int count = stmt.executeUpdate();
			return (count == 1)? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean exists(String email) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT JSON_VALUE(jsonstr, '$.CuName') as email FROM CUSTOMER WHERE JSON_VALUE(jsonstr, '$.CuEmail') = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, email);
			rs = stmt.executeQuery();
			
			int count = stmt.executeUpdate();
			return (count == 1)? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean update(String id, String jsonstr) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "UPDATE Customer SET jsonstr = ? where Cust_id = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, jsonstr);
			stmt.setString(2, id);
			
			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public String getTotalC() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT COUNT(*) customer FROM CUSTOMER ";
	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();
	        StringBuilder str = new StringBuilder("\"customer\": \"");
	        
	        if (rs.next()) {
	            String customer = rs.getString("customer");
	            str.append(customer != null ? customer : "0").append("\"");
	        } else {
	            str.append("0\""); // 데이터가 없을 경우 기본값 설정
	        }
	        return str.append(",").toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
	
	public String getList() throws NamingException, SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            String sql = "SELECT Cust_ID, JSON_VALUE(jsonstr, '$.CuName') AS NAME , \r\n"
            		+ "JSON_VALUE(jsonstr, '$.CuBday') AS BDAY,  JSON_VALUE(jsonstr, '$.CuEmail') AS EMAIL, \r\n"
            		+ "JSON_VALUE(jsonstr, '$.CuUpdate') AS UDATE, JSON_VALUE(jsonstr, '$.CusAdd') AS ADDRESS, \r\n"
            		+ "JSON_VALUE(jsonstr, '$.CuNum') AS NUM, JSON_VALUE(jsonstr, '$.CuType') AS TYPE, Cust_status\r\n"
            		+ "FROM Customer";

            conn = ConnectionPool.get();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            StringBuilder str = new StringBuilder("{\"cuList\": [");
            
            boolean first = true;

	        while (rs.next()) {
	            if (!first) {
	                str.append(", ");
	            }
	            first = false;
            	str.append("{")
	               .append("\"id\": \"").append(rs.getString("Cust_ID")).append("\", ")
	               .append("\"name\": \"").append(rs.getString("NAME")).append("\", ")
	               .append("\"bday\": \"").append(rs.getString("BDAY")).append("\", ")
	               .append("\"email\": \"").append(rs.getString("EMAIL")).append("\", ")
	               .append("\"udate\": \"").append(rs.getString("UDATE")).append("\", ")
	               .append("\"address\": \"").append(rs.getString("ADDRESS")).append("\", ")
	               .append("\"phone\": \"").append(rs.getString("NUM")).append("\", ")
	               .append("\"type\": \"").append(rs.getString("TYPE")).append("\", ")
	               .append("\"status\": \"").append(rs.getString("Cust_status")).append("\" ")
	               .append("}");
            }
            return str.append("]}").toString();
                
        } finally {
            if (rs != null) rs.close(); 
            if (stmt != null) stmt.close(); 
            if (conn != null) conn.close();
		}
	}
	
	public String getCTList() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT \r\n"
	                 + "    CASE \r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 20 AND 29 THEN '20대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 30 AND 39 THEN '30대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 40 AND 49 THEN '40대'\r\n"
	                 + "        ELSE '기타'\r\n"
	                 + "    END AS basis,\r\n"
	                 + "   COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer) AS percentage\r\n"
	                 + "FROM customer\r\n"
	                 + "WHERE (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 20 AND 49\r\n"
	                 + "GROUP BY \r\n"
	                 + "    CASE \r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 20 AND 29 THEN '20대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 30 AND 39 THEN '30대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 40 AND 49 THEN '40대'\r\n"
	                 + "        ELSE '기타'\r\n"
	                 + "    END";
	        
	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();
	        StringBuilder str = new StringBuilder("{\"culist\": [");
	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) str.append(", ");
	            String basis = rs.getString("basis");
	            String percentage = String.format("%.2f", rs.getDouble("percentage"));
	            str.append("{ \"basis\": \"")
	               .append(basis)
	               .append("\", \"percentage\": \"")
	               .append(percentage)
	               .append("\" }");
	        }
	        return str.append("],").toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
	public String getMyCust(String email) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT JSON_VALUE(C.jsonstr, '$.CuName') AS NAME,\r\n"
	        		+ "JSON_VALUE(C.jsonstr, '$.CuBday') AS BirthDay, \r\n"
	        		+ "JSON_VALUE(C.jsonstr, '$.CuEmail') AS Email, \r\n"
	        		+ "JSON_VALUE(C.jsonstr, '$.CuNum') AS  phone_number,\r\n"
	        		+ "JSON_VALUE(A.jsonstr, '$.Car_Name') AS CarName,\r\n"
	        		+ "JSON_VALUE(P.jsonstr, '$.Car_price') AS Car_price, \r\n"
	        		+ "JSON_VALUE(P.jsonstr, '$.Sale_date') AS Sales_date, \r\n"
	        		+ "C.CUST_STATUS FROM CUSTOMER C JOIN PURCHASE P ON C.CUST_ID = P.CUST_ID JOIN CAR A ON P.CAR_ID = A.CAR_ID JOIN EMPLOYEE E ON E.EMP_ID = P.EMP_ID \r\n"
	        		+ "WHERE JSON_VALUE(E.jsonstr, '$.E_email') = ?";
	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, email);
	        rs = stmt.executeQuery();
	        
	        StringBuilder str = new StringBuilder("{\"list\": [");
	        boolean first = true;
	        while (rs.next()) {
	            if (!first) {
	                str.append(", ");
	            }
	            first = false;
	            str.append("{")
	               .append("\"name\": \"").append(rs.getString("NAME")).append("\", ")
	               .append("\"birthDay\": \"").append(rs.getString("BirthDay")).append("\", ")
	               .append("\"email\": \"").append(rs.getString("Email")).append("\", ")
	               .append("\"phone_number\": \"").append(rs.getString("phone_number")).append("\", ")
	               .append("\"carName\": \"").append(rs.getString("CarName")).append("\", ")
	               .append("\"car_price\": \"").append(rs.getString("Car_price")).append("\", ")
	               .append("\"sales_date\": \"").append(rs.getString("Sales_date")).append("\", ")
	               .append("\"cust_status\": \"").append(rs.getString("CUST_STATUS")).append("\"")
	               .append("}");
	        }
	        str.append("]}"); // JSON 닫기
	        return str.toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
}
