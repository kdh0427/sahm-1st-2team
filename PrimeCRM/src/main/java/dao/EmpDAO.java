package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class EmpDAO {
	
	public boolean insert(String jsonstr, String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    try {
	        // INSERT문에서 Emp_Id는 자동으로 생성됩니다.
	    	String sql = "INSERT INTO Employee (Emp_Id, jsonstr, Branch_Id) VALUES (emp_seq.NEXTVAL, ?, ?)";

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
			String sql = "SELECT Emp_Id FROM Employee where  JSON_VALUE(jsonstr, '$.Emp_Email') = ?";
			
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
}
