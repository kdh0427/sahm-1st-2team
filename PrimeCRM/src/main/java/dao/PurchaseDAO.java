package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class PurchaseDAO {
	public boolean insert(String id, String jsonstr) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		try {
			String sql = "INSERT INTO Purchase(Sale_id, jsonstr) VALUES(?, ?)";
			
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
	
	public boolean exists(String id) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Sales_Id FROM Purchase where Sale_id = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);
			
			rs = stmt.executeQuery();
			
			return rs.next();
			
		}finally {
			if(rs != null) {rs.close();}
			if(stmt != null) {stmt.close();}
			if(conn != null) {conn.close();}
		}
	}
	
	public boolean delete(String id) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "DELETE FROM Purchase where Sale_id = ?"; 
					
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);
			
			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) stmt.close();
			if (conn != null) conn.close();
		}
	}
	
	public boolean update(String id, String jsonstr) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "UPDATE Purchase SET jsonstr = ? where Sale_id = ?";
				
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
}
