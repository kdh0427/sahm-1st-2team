package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class BranchDAO {

	public boolean exists(String name) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Branch_Id FROM Car where Car_name = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, name);
			
			rs = stmt.executeQuery();
			return rs.next();
			
		}finally {
			if(rs != null) {rs.close();}
			if(stmt != null) {stmt.close();}
			if(conn != null) {conn.close();}
		}
	}
}
