package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class LoginDAO {

    public boolean insert(String email, String pwd, String id) throws NamingException, SQLException {
        Connection conn = null;
	    PreparedStatement stmt = null;
	    
        try {
        	String sql = "INSERT INTO Customer_Login (CuEmail, Cust_pwd, Cust_ID) VALUES(?, ?, ?)";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
            stmt.setString(1, email);
            stmt.setString(2, pwd);
            stmt.setString(3, id);

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
        	String sql = "SELECT Cust_ID FROM Customer_Login WHERE CuEmail = ?";

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
			String sql = "SELECT Cust_Id FROM Customer_Login WHERE CuEmail = ? AND Cust_pwd = ?";

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
}
