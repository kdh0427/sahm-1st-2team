package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class ComplainDAO {

	public boolean insert(String id, String jsonstr) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		try {
			String sql = "INSERT INTO Complain(Cust_id, jsonstr) VALUES(?, ?)";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);
			stmt.setString(2, jsonstr);
			
			int count = stmt.executeUpdate();
			return (count == 1)? true : false; 
			
		}finally{
			if (stmt != null) stmt.close(); 
            if (conn != null) conn.close();
		}
	}
	
	public boolean delete(String id, String jsonstr) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "DELETE FROM Complain where Cust_id = ? AND jsonstr = ?"; 
					
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);
			stmt.setString(2, jsonstr);
			
			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) stmt.close();
			if (conn != null) conn.close();
		}
	}
	
	public String getComplain() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql = "SELECT P.CUST_ID, JSON_VALUE(S.jsonstr, '$.CuEmail') AS Email, JSON_VALUE(S.jsonstr, '$.CuName') AS NAME, P.CUST_STATUS, P.COMPLAIN_DATE, P.COMPLAIN_STATUS, P.COMPLAIN\r\n"
	        		+ "FROM COMPLAIN P JOIN CUSTOMER S ON P.CUST_ID = S.CUST_ID";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();
	        
	        StringBuilder str = new StringBuilder("{\"comList\": [");
	        boolean first = true;

	        while (rs.next()) {
	            if (!first) {
	                str.append(", ");
	            }
	            first = false;

	            str.append("{")
	               .append("\"id\": \"").append(rs.getString("CUST_ID")).append("\", ")
	               .append("\"email\": \"").append(rs.getString("Email")).append("\", ")
	               .append("\"name\": \"").append(rs.getString("NAME")).append("\", ")
	               .append("\"type\": \"").append(rs.getString("CUST_STATUS")).append("\", ")
	               .append("\"date\": \"").append(rs.getString("COMPLAIN_DATE")).append("\", ")
	               .append("\"status\": \"").append(rs.getString("COMPLAIN_STATUS")).append("\", ")
	               .append("\"content\": \"").append(rs.getString("COMPLAIN")).append("\"")
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
