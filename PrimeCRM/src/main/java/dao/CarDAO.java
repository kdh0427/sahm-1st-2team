package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class CarDAO {
	
	public boolean exists(String id) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT jsonstr FROM Car where Car_id = ?";
			
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
	
	public String getImage() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT JSON_VALUE(C.JSONSTR, '$.Car_Name') AS Car_Name\r\n"
	        		+ "FROM CAR C\r\n"
	        		+ "JOIN (\r\n"
	        		+ "	 SELECT CAR_ID\r\n"
	        		+ "	 FROM PURCHASE\r\n"
	        		+ "	 GROUP BY CAR_ID\r\n"
	        		+ "	 ORDER BY COUNT(*) DESC\r\n"
	        		+ "	 FETCH FIRST 1 ROWS ONLY\r\n"
	        		+ "	 ) P ON C.CAR_ID = P.CAR_ID";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"imageUrl\": \"");
	        
	        str.append("/PrimeCRM/assets/img/photo/");
	        if (rs.next()) {
	        	String topCar = rs.getString("Car_Name");
	        	str.append(topCar != null ? topCar : "0").append(".png\"");
	        } else {
	            str.append("0\""); // 데이터가 없을 경우 기본값 설정
	        }
	        
	        return str.append("}").toString();
	    } finally {
	        if (rs != null) rs.close(); 
	        if (stmt != null) stmt.close(); 
	        if (conn != null) conn.close();
	    }
	}
	
	
}
