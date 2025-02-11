package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class LoginDAO {
    public boolean insert(String id, String name, String email, String pwd) throws NamingException, SQLException {
        Connection conn = null;
	    PreparedStatement stmt = null;
	    
        try {
        	String sql = "INSERT INTO Customer_Login (CuID, CuName, CuEmail, CuPwd) VALUES(?, ?, ?, ?)";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, id);
	        stmt.setString(2, name);
	        stmt.setString(3, email);
            stmt.setString(4, pwd);

            int count = stmt.executeUpdate();
	        return (count == 1);
	        
        } finally {
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
    }

    public boolean exists(String email) throws NamingException, SQLException {
    	Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
        
        try {
        	String sql = "SELECT CuID FROM Customer_Login WHERE CuEmail = ?";

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

    public boolean login(String email, String pwd) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT CuId FROM Customer_Login WHERE CuEmail = ? AND CuPwd = ?";

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
    
    public String getPwd(String email) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT CuPwd FROM CUSTOMER_LOGIN WHERE CuEmail = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, email);
			rs = stmt.executeQuery();
			
			String pwd = "";
			if (rs.next()) {
				pwd = rs.getString("CuPwd");
			}
			 
			return pwd;
			
		}finally{
			if (rs != null) {rs.close();}
			if (stmt != null) stmt.close(); 
            if (conn != null) conn.close();
		}
	} 
}
