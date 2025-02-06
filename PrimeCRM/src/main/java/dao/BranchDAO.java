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
	
	public String getBempSales() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	    	String sql = "SELECT B.BRANCH_NAME, COUNT(*) AS COUNT FROM EMPLOYEE E JOIN BRANCH B ON E.BRANCH_ID = B.BRANCH_ID\r\n"
	    			+ "GROUP BY B.BRANCH_NAME";
	    	
	    	conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			rs = stmt.executeQuery();
	       
	        StringBuilder branchNames = new StringBuilder("[");
	        StringBuilder counts = new StringBuilder("[");

	        boolean first = true;
	        while (rs.next()) {
	            String branchName = rs.getString("BRANCH_NAME");
	            String count = rs.getString("COUNT");

	            if (!first) {
	                branchNames.append(", ");
	                counts.append(", ");
	            }
	            first = false;

	            branchNames.append("\"").append(branchName).append("\"");
	            counts.append("\"").append(count).append("\"");
	        }

	        branchNames.append("]");
	        counts.append("]");

	        return "\"empPinY\": " + branchNames.toString() + ", \"empPinX\": " + counts.toString() + ",";
			
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
}
