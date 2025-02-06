package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class TemplateDAO {
	
	public boolean update(String Template_detail, String type) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "UPDATE TEMPLATE SET TEMPLATE_DETAIL = ? WHERE CUST_STATUS = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, Template_detail);
			stmt.setString(2, type);
			
			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
}
