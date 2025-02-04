package dao;

import java.sql.*;
import java.util.*;
import javax.naming.NamingException;
import util.*;

public class CustDAO {
	
	public boolean insert(String id, String name, String birthDate, String email, String status, String updateDate, String address, String phone, String type) throws NamingException, SQLException {
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "INSERT INTO Customer (Cust_id, Cust_Name, Cust_Birth_Date, Cust_Email, Cust_Status, Cust_Update_Date, Cust_Address, Cust_Phone, Cust_Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);
            stmt.setString(2, name);
            stmt.setString(3, birthDate);
            stmt.setString(4, email);
            stmt.setString(5, status);
            stmt.setString(6, updateDate);
            stmt.setString(7, address);
            stmt.setString(8, phone);
            stmt.setString(9, type);
			
			int count = stmt.executeUpdate();
			return (count == 1)? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean exists(String id) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Cust_Id FROM Customer where Cust_id = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);

			rs = stmt.executeQuery();
			return rs.next();
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean delete(String id) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "DELETE FROM Customer where Cust_id = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, id);
			
			int count = stmt.executeUpdate();
			return (count == 1)? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean update(String id, String name, String birthDate, String email, String status, 
			String updateDate, String address, String phone, String type) throws NamingException, SQLException {
		Connection conn = null;
		PreparedStatement stmt = null;

		try {
			// update_date를 SYSDATE로 자동 설정하고, birthDate를 TO_DATE() 변환
			String sql = "UPDATE Customer SET Cust_Name = ?, Cust_Birth_Date = TO_DATE(?, 'YYYY-MM-DD'), "
					+ "Cust_Email = ?, Cust_Status = ?, Cust_Update_Date = SYSDATE, "
					+ "Cust_Address = ?, Cust_Phone = ?, Cust_Type = ? WHERE Cust_id = ?";

			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, name);
			stmt.setString(2, birthDate);
			stmt.setString(3, email);
			stmt.setString(4, status);
			stmt.setString(5, address);
			stmt.setString(6, phone);
			stmt.setString(7, type);
			stmt.setString(8, id);

			int count = stmt.executeUpdate();
			return count == 1;

		} finally {
			if (stmt != null)
				stmt.close();
			if (conn != null)
				conn.close();
		}
	}
<<<<<<< HEAD

	public List<CustVO> getAllCustomers() throws NamingException, SQLException {
        List<CustVO> customers = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            String sql = "SELECT * FROM Customer order by Cust_Id";
            conn = ConnectionPool.get();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            while (rs.next()) {
                customers.add(new CustVO(
                    rs.getString("Cust_ID"),
                    rs.getString("Cust_Name"),
                    rs.getString("Cust_Birth_Date"),
                    rs.getString("Cust_Email"),
                    rs.getString("Cust_Status"),
                    rs.getString("Cust_Update_Date"),
                    rs.getString("Cust_Address"),
                    rs.getString("Cust_Phone"),
                    rs.getString("Cust_Type")
                ));
            }
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        return customers;
    }
}
=======
	
	public String getList() throws NamingException, SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        try {
            String sql = "SELECT * FROM Customer";

            conn = ConnectionPool.get();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();
                
            String str = "[";
            int cnt = 0;
            while(rs.next()) {
                if (cnt++ > 0) str += ", ";
                str += rs.getString("jsonstr");
            }
            return str + "]";
                
        } finally {
            if (rs != null) rs.close(); 
            if (stmt != null) stmt.close(); 
            if (conn != null) conn.close();
        }
    }
	
	public String getTotalC() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql = "SELECT COUNT(*) customer FROM EMPLOYEE ";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"customer\": \"");
	        
	        if (rs.next()) {
	            String customer = rs.getString("customer");
	            str.append(customer != null ? customer : "0").append("\"");
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
	

	public String getCTList() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql = "SELECT \r\n"
	                 + "    CASE \r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 20 AND 29 THEN '20대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 30 AND 39 THEN '30대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 40 AND 49 THEN '40대'\r\n"
	                 + "        ELSE '기타'\r\n"
	                 + "    END AS basis,\r\n"
	                 + "   COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer) AS percentage\r\n"
	                 + "FROM customer\r\n"
	                 + "WHERE (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 20 AND 49\r\n"
	                 + "GROUP BY \r\n"
	                 + "    CASE \r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 20 AND 29 THEN '20대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 30 AND 39 THEN '30대'\r\n"
	                 + "        WHEN (EXTRACT(YEAR FROM SYSDATE) - EXTRACT(YEAR FROM TO_DATE(JSON_VALUE(jsonstr, '$.CuBday'), 'YYYY-MM-DD'))) BETWEEN 40 AND 49 THEN '40대'\r\n"
	                 + "        ELSE '기타'\r\n"
	                 + "    END";
	        
	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("{\"culist\": [");
	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) str.append(", ");
	            String basis = rs.getString("basis");
	            String percentage = String.format("%.2f", rs.getDouble("percentage"));
	            str.append("{ \"basis\": \"")
	               .append(basis)
	               .append("\", \"percentage\": \"")
	               .append(percentage)
	               .append("\" }");
	        }

	        return str.append("],").toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
}
>>>>>>> branch 'master' of https://github.com/kdh0427/sahm-1st-2team.git
