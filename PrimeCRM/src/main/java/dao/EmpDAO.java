package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class EmpDAO {
	
	public boolean insert(String jsonstr, String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    try {
	    	String sql = "INSERT INTO Employee (Emp_Id, jsonstr, Branch_Id) VALUES(emp_seq.NEXTVAL, ?, ?)";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, jsonstr);
	        stmt.setString(2, branch);

	        int count = stmt.executeUpdate();
	        return (count == 1);

	    } finally {
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
	
	public boolean exists(String email) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Emp_Id FROM Employee where JSON_VALUE(jsonstr, '$.E_email') = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, email);
			
			rs = stmt.executeQuery();
			
			return rs.next();
			
		}finally {
			if(rs != null) {rs.close();}
			if(stmt != null) {stmt.close();}
			if(conn != null) {conn.close();}
		}
	}
	
	public boolean delete(String name) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "DELETE FROM Employee where Emp_Name = ?"; 
					
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, name);

			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) stmt.close();
			if (conn != null) conn.close();
		}
	}
	
	public boolean update(String Name, String jsonstr, String branch) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "UPDATE Employee SET jsonstr = ? where Emp_Name = ? AND Branch_Id = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, jsonstr);
			stmt.setString(2, Name);
			stmt.setString(3, branch);
			
			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean login(String email, String pwd) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Emp_Id FROM Employee where JSON_VALUE(jsonstr, '$.E_email') = ? AND JSON_VALUE(jsonstr, '$.E_pwd') = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, email);
			stmt.setString(2, pwd);
			
			rs = stmt.executeQuery();
			
			return rs.next();
			
		}finally {
			if(rs != null) {rs.close();}
			if(stmt != null) {stmt.close();}
			if(conn != null) {conn.close();}
		}
	}
	
	public String getList() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT E_name, E_position FROM ("
	                + "    SELECT JSON_VALUE(E.jsonstr, '$.E_name') AS E_name, "
	                + "           JSON_VALUE(E.jsonstr, '$.E_position') AS E_position, "
	                + "           COUNT(*) AS purchase_count "
	                + "    FROM PURCHASE P "
	                + "    JOIN EMPLOYEE E ON P.EMP_ID = E.EMP_ID "
	                + "    GROUP BY P.EMP_ID, "
	                + "             JSON_VALUE(E.jsonstr, '$.E_name'), "
	                + "             JSON_VALUE(E.jsonstr, '$.E_position') "
	                + "    ORDER BY purchase_count DESC"
	                + ") "
	                + "WHERE ROWNUM <= 10 "
	                + "ORDER BY purchase_count DESC";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"emplist\": [");
	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) str.append(", ");
	            str.append("{ \"empName\": \"")
	               .append(rs.getString("E_name"))
	               .append("\", \"position\": \"")
	               .append(rs.getString("E_position"))
	               .append("\" }");
	        }
	        return str.append("],").toString();
	    } finally {
	        if (rs != null) rs.close(); 
	        if (stmt != null) stmt.close(); 
	        if (conn != null) conn.close();
	    }
	}

	public String getTopEmp() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT JSON_VALUE(E.JSONSTR, '$.E_name') topEmp\r\n"
	        		+ "FROM EMPLOYEE E\r\n"
	        		+ "JOIN (\r\n"
	        		+ "    SELECT P.EMP_ID, COUNT(*) AS purchase_count\r\n"
	        		+ "    FROM PURCHASE P\r\n"
	        		+ "    WHERE TO_CHAR(TO_DATE(JSON_VALUE(P.jsonstr, '$.Sale_date'), 'YYYY-MM-DD'), 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')\r\n"
	        		+ "    GROUP BY P.EMP_ID\r\n"
	        		+ ") employee_sales\r\n"
	        		+ "ON E.EMP_ID = employee_sales.EMP_ID\r\n"
	        		+ "WHERE employee_sales.purchase_count = (\r\n"
	        		+ "    SELECT MAX(purchase_count)\r\n"
	        		+ "    FROM (\r\n"
	        		+ "        SELECT COUNT(*) AS purchase_count\r\n"
	        		+ "        FROM PURCHASE P\r\n"
	        		+ "        WHERE TO_CHAR(TO_DATE(JSON_VALUE(P.jsonstr, '$.Sale_date'), 'YYYY-MM-DD'), 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')\r\n"
	        		+ "        GROUP BY P.EMP_ID\r\n"
	        		+ "    )\r\n"
	        		+ ")";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"topEmp\": \"");
	        
	        if (rs.next()) {
	        	String topEmp = rs.getString("topEmp");
	        	str.append(topEmp != null ? topEmp : "0").append("\"");
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

}

