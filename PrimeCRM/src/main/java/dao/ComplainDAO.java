package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class ComplainDAO {

	public boolean insert(String id, String date, String cment, String complain, String status, String custstatus) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		try {
			String sql = "INSERT INTO Complain(Comp_id, Cust_id, Complain_Date, Cment, Complain, Complain_status, Cust_Status) VALUES(comp_seq.NEXTVAL, ?, ?, ?, ?, ?, ?)";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);
			stmt.setString(2, date);
		    stmt.setNull(3, Types.VARCHAR);  // NULL 값을 넣을 때 사용
			stmt.setString(4, complain);
			stmt.setString(5, status);
			stmt.setString(6, custstatus);
			
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
	        String sql = "SELECT P.COMP_ID, JSON_VALUE(S.jsonstr, '$.CuEmail') AS Email, JSON_VALUE(S.jsonstr, '$.CuName') AS NAME, P.CMENT, P.CUST_STATUS, P.COMPLAIN_DATE, P.COMPLAIN_STATUS, P.COMPLAIN\r\n"
	        		+ "FROM COMPLAIN P JOIN CUSTOMER S ON P.CUST_ID = S.CUST_ID ORDER BY COMP_ID";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();
	        
	        StringBuilder str = new StringBuilder("\"comList\": [");
	        boolean first = true;

	        while (rs.next()) {
	            if (!first) {
	                str.append(", ");
	            }
	            first = false;

	            str.append("{")
	               .append("\"id\": \"").append(rs.getString("COMP_ID")).append("\", ")
	               .append("\"email\": \"").append(rs.getString("Email")).append("\", ")
	               .append("\"name\": \"").append(rs.getString("NAME")).append("\", ")
	               .append("\"comment\": \"").append(rs.getString("CMENT")).append("\", ")
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
	
	public String getCommet() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql = "SELECT CUST_STATUS, TEMPLATE_DETAIL FROM TEMPLATE";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();
	        
	        StringBuilder str = new StringBuilder("{\"temList\": [");
	        boolean first = true;

	        while (rs.next()) {
	            if (!first) {
	                str.append(", ");
	            }
	            first = false;

	            str.append("{")
	               .append("\"type\": \"").append(rs.getString("CUST_STATUS")).append("\", ")
	               .append("\"content\": \"").append(rs.getString("TEMPLATE_DETAIL")).append("\"")
	               .append("}");
	        }

	        str.append("],"); // JSON 닫기
	        return str.toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
	
	public Boolean getRequest(String id, String detail) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;

	    try {
	        String sql = "UPDATE COMPLAIN SET CMENT = ? , COMPLAIN_STATUS = 'DONE' WHERE COMP_ID = ?";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, detail);
	        stmt.setString(2, id);
	        
	        int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
	    } finally {
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
}
