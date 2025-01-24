package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class TemplateDAO {
	
	public boolean insert(String id, String jsonstr) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "INSERT INTO Template(Cust_status, Template_detail) VALUES (?, ?)";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			
			int count = stmt.executeUpdate();
			return (count == 1)? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean exists(String Cust_status) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Template_detail FROM Customer where Cust_status = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, Cust_status);

			rs = stmt.executeQuery();
			return rs.next();
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean delete(String Cust_status, String Template_detail) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "DELETE FROM Template where Cust_status = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			
			int count = stmt.executeUpdate();
			return (count == 1)? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean update(String Cust_status, String Template_detail) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "UPDATE Template SET jsonstr = ? where Cust_status = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, Template_detail);
			stmt.setString(2, Cust_status);
			
			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
}
