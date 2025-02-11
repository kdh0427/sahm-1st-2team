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
			
			String id = "";
			if (rs.next()) {
				id = rs.getString("ID");
			}
			
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
}
