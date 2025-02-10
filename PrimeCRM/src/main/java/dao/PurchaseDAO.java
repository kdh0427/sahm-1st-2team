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
	
	public String getTop() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql = "SELECT MAX(JSON_VALUE(jsonstr, '$.Car_price')) AS Car_price\r\n"
	        		+ "FROM PURCHASE\r\n"
	        		+ "WHERE TO_CHAR(TO_DATE(JSON_VALUE(jsonstr, '$.Sale_date'), 'YYYY-MM-DD'), 'YYYY-MM') = (SELECT TO_CHAR(SYSDATE, 'YYYY-MM') FROM DUAL)";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"topPrice\": \"");
	        
	        if (rs.next()) {
	            String topPrice = rs.getString("Car_price");
	            str.append(topPrice != null ? topPrice : "0").append("\"");
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
	
	public String getSales(String date) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    String year = date.substring(0, 4);
	    try {
	        String sql = "SELECT COUNT(*) AS COUNT FROM PURCHASE \r\n"
	        		+ "WHERE TO_DATE(JSON_VALUE(jsonstr, '$.Sale_date'), 'YYYY-MM-DD') BETWEEN TO_DATE(?, 'YYYY-MM') AND LAST_DAY(TO_DATE(?, 'YYYY') + INTERVAL '10' MONTH)";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, date);
	        stmt.setString(2, year);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"totalSales\": \"");
	        
	        if (rs.next()) {
	            String totalslaes = rs.getString("COUNT");
	            str.append(totalslaes != null ? totalslaes : "0").append("\"");
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
	
	public String getBsale(String date) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT SUM(JSON_VALUE(P.jsonstr, '$.Car_price')) AS TOTAL_SALES, B.BRANCH_NAME FROM PURCHASE P \r\n"
	        		+ "JOIN EMPLOYEE E ON P.EMP_ID = E.EMP_ID \r\n"
	        		+ "JOIN BRANCH B ON E.BRANCH_ID = B.BRANCH_ID \r\n"
	        		+ "WHERE TO_DATE(JSON_VALUE(P.jsonstr, '$.Sale_date'), 'YYYY-MM-DD') BETWEEN TO_DATE(?, 'YYYY-MM') AND SYSDATE \r\n"
	        		+ "GROUP BY B.BRANCH_ID, B.BRANCH_NAME  \r\n"
	        		+ "ORDER BY B.BRANCH_ID";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, date);
	        rs = stmt.executeQuery();

	        StringBuilder salesByBranchY = new StringBuilder("\"salesByBranchY\": [");
	        StringBuilder salesByBranchX = new StringBuilder("\"salesByBranchX\": [");

	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) {
	                salesByBranchY.append(", ");
	                salesByBranchX.append(", ");
	            }
	            salesByBranchY.append("\"").append(rs.getString("TOTAL_SALES")).append("\"");
	            salesByBranchX.append("\"").append(rs.getString("BRANCH_NAME")).append("\"");
	        }

	        return salesByBranchY.append("], ").toString() + salesByBranchX.append("],").toString();
	    } finally {
	        if (rs != null) rs.close(); 
	        if (stmt != null) stmt.close(); 
	        if (conn != null) conn.close();
	    }
	}
	
	public String getTcar(String date) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT JSON_VALUE(C.jsonstr, '$.Car_Name') AS CAR_NAME, COUNT(JSON_VALUE(C.jsonstr, '$.Car_Name')) AS SALES\r\n"
	        		+ "FROM PURCHASE P JOIN CAR C ON P.CAR_ID = C.CAR_ID \r\n"
	        		+ "WHERE TO_DATE(JSON_VALUE(P.jsonstr, '$.Sale_date'), 'YYYY-MM-DD') BETWEEN TO_DATE(?, 'YYYY-MM') AND SYSDATE\r\n"
	        		+ "GROUP BY JSON_VALUE(C.jsonstr, '$.Car_Name')";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, date);
	        rs = stmt.executeQuery();

	        StringBuilder salesDistributionByTypeY = new StringBuilder("\"salesDistributionByTypeY\": [");
	        StringBuilder salesDistributionByTypeX = new StringBuilder("\"salesDistributionByTypeX\": [");

	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) {
	            	salesDistributionByTypeY.append(", ");
	            	salesDistributionByTypeX.append(", ");
	            }
	            salesDistributionByTypeY.append("\"").append(rs.getString("CAR_NAME")).append("\"");
	            salesDistributionByTypeX.append("\"").append(rs.getString("SALES")).append("\"");
	        }

	        return salesDistributionByTypeY.append("], ").toString() + salesDistributionByTypeX.append("],").toString();
	    } finally {
	        if (rs != null) rs.close(); 
	        if (stmt != null) stmt.close(); 
	        if (conn != null) conn.close();
	    }
	}
	
	public String getTopthird(String date) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT JSON_VALUE(C.jsonstr, '$.Car_Name') AS CAR_NAME, COUNT(JSON_VALUE(C.jsonstr, '$.Car_Name')) AS SALES\r\n"
	        		+ "FROM PURCHASE P JOIN CAR C ON P.CAR_ID = C.CAR_ID \r\n"
	        		+ "WHERE TO_DATE(JSON_VALUE(P.jsonstr, '$.Sale_date'), 'YYYY-MM-DD') BETWEEN TO_DATE(?, 'YYYY-MM') AND SYSDATE\r\n"
	        		+ "GROUP BY JSON_VALUE(C.jsonstr, '$.Car_Name')\r\n"
	        		+ "ORDER BY SALES DESC FETCH FIRST 3 ROWS ONLY";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, date);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"salesByType\": [");

	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) 
	                str.append(", "); // 콤마 추가
	            
	            // JSON 배열의 요소로 객체 형태 추가
	            str.append("{\"name\": \"").append(rs.getString("CAR_NAME"))
	               .append("\", \"sales\": ").append(rs.getInt("SALES")).append("}");
	        }
	        str.append("],"); // JSON 닫기

	        return str.toString();
	    } finally {
	        if (rs != null) rs.close(); 
	        if (stmt != null) stmt.close(); 
	        if (conn != null) conn.close();
	    }
	}
	
	public String getPrate(String date) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT TO_CHAR(TO_DATE(JSON_VALUE(jsonstr, '$.Sale_date'), 'YYYY-MM-DD'), 'YYYY-MM') AS SALE_MONTH, SUM(JSON_VALUE(jsonstr, '$.Car_price')) AS TOTAL_SALES\r\n"
	        		+ "FROM PURCHASE\r\n"
	        		+ "WHERE TO_DATE(JSON_VALUE(jsonstr, '$.Sale_date'), 'YYYY-MM-DD') BETWEEN TO_DATE(?, 'YYYY-MM') AND LAST_DAY(SYSDATE)\r\n"
	        		+ "GROUP BY TO_CHAR(TO_DATE(JSON_VALUE(jsonstr, '$.Sale_date'), 'YYYY-MM-DD'), 'YYYY-MM')\r\n"
	        		+ "ORDER BY SALE_MONTH";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, date);
	        rs = stmt.executeQuery();

	        StringBuilder revenueChartY = new StringBuilder("{\"revenueChartY\": [");
	        StringBuilder revenueChartX = new StringBuilder("\"revenueChartX\": [");

	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) {
	            	revenueChartY.append(", ");
	            	revenueChartX.append(", ");
	            }
	            revenueChartY.append("\"").append(rs.getString("SALE_MONTH")).append("\"");
	            revenueChartX.append("\"").append(rs.getString("TOTAL_SALES")).append("\"");
	        }

	        return revenueChartY.append("], ").toString() + revenueChartX.append("]").toString() + ", ";
	    } finally {
	        if (rs != null) rs.close(); 
	        if (stmt != null) stmt.close(); 
	        if (conn != null) conn.close();
	    }
	}
}
