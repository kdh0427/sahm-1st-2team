package dao;

import java.sql.*;
import javax.naming.NamingException;
import util.*;

public class EmpDAO {
	
	public boolean insert(String jsonstr, String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    try {
	    	String sql = "INSERT INTO Employee (Emp_Id, jsonstr, Branch_Id) VALUES(emp_seq.NEXTVAL, ?, ?)";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, jsonstr);
	        stmt.setString(2, branch);

	        int count = stmt.executeUpdate();
	        return (count == 1);

	    } finally {
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
	
	public boolean exists(String email) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Emp_Id FROM Employee where JSON_VALUE(jsonstr, '$.E_email') = ?";
			
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
	
	public boolean delete(String name) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "DELETE FROM Employee where Emp_Name = ?"; 
					
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, name);

			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) stmt.close();
			if (conn != null) conn.close();
		}
	}
	
	public boolean update(String email, String password, String phone) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		
		try {
			String sql = "UPDATE EMPLOYEE\r\n"
					+ "SET jsonstr = JSON_OBJECT(\r\n"
					+ "    'E_name' VALUE JSON_VALUE(jsonstr, '$.E_name'),\r\n"
					+ "    'E_email' VALUE JSON_VALUE(jsonstr, '$.E_email'),\r\n"
					+ "    'E_phone' VALUE ?,\r\n"
					+ "    'E_pwd' VALUE ?,\r\n"
					+ "    'E_position' VALUE JSON_VALUE(jsonstr, '$.E_position')\r\n"
					+ ")\r\n"
					+ "WHERE JSON_VALUE(jsonstr, '$.E_email') = ?";
			
			conn = ConnectionPool.get();
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, phone);
			stmt.setString(2, password);
			stmt.setString(3,  email);
			
			int count = stmt.executeUpdate();
			return (count == 1) ? true : false;
			
		}finally {
			if (stmt != null) {stmt.close();}
			if (conn != null) {conn.close();}
		}
	}
	
	public boolean login(String email, String pwd) throws NamingException, SQLException{
		Connection conn = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			String sql = "SELECT Emp_Id FROM Employee where JSON_VALUE(jsonstr, '$.E_email') = ? AND JSON_VALUE(jsonstr, '$.E_pwd') = ?";
			
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
	
	public String getList() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT E_name, E_position FROM ("
	                + "    SELECT JSON_VALUE(E.jsonstr, '$.E_name') AS E_name, "
	                + "           JSON_VALUE(E.jsonstr, '$.E_position') AS E_position, "
	                + "           COUNT(*) AS purchase_count "
	                + "    FROM PURCHASE P "
	                + "    JOIN EMPLOYEE E ON P.EMP_ID = E.EMP_ID "
	                + "    GROUP BY P.EMP_ID, "
	                + "             JSON_VALUE(E.jsonstr, '$.E_name'), "
	                + "             JSON_VALUE(E.jsonstr, '$.E_position') "
	                + "    ORDER BY purchase_count DESC"
	                + ") "
	                + "WHERE ROWNUM <= 10 "
	                + "ORDER BY purchase_count DESC";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"emplist\": [");
	        int cnt = 0;
	        while (rs.next()) {
	            if (cnt++ > 0) str.append(", ");
	            str.append("{ \"empName\": \"")
	               .append(rs.getString("E_name"))
	               .append("\", \"position\": \"")
	               .append(rs.getString("E_position"))
	               .append("\" }");
	        }
	        return str.append("],").toString();
	    } finally {
	        if (rs != null) rs.close(); 
	        if (stmt != null) stmt.close(); 
	        if (conn != null) conn.close();
	    }
	}

	public String getTopEmp() throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    try {
	        String sql = "SELECT JSON_VALUE(E.JSONSTR, '$.E_name') topEmp\r\n"
	        		+ "FROM EMPLOYEE E\r\n"
	        		+ "JOIN (\r\n"
	        		+ "    SELECT P.EMP_ID, COUNT(*) AS purchase_count\r\n"
	        		+ "    FROM PURCHASE P\r\n"
	        		+ "    WHERE TO_CHAR(TO_DATE(JSON_VALUE(P.jsonstr, '$.Sale_date'), 'YYYY-MM-DD'), 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')\r\n"
	        		+ "    GROUP BY P.EMP_ID\r\n"
	        		+ ") employee_sales\r\n"
	        		+ "ON E.EMP_ID = employee_sales.EMP_ID\r\n"
	        		+ "WHERE employee_sales.purchase_count = (\r\n"
	        		+ "    SELECT MAX(purchase_count)\r\n"
	        		+ "    FROM (\r\n"
	        		+ "        SELECT COUNT(*) AS purchase_count\r\n"
	        		+ "        FROM PURCHASE P\r\n"
	        		+ "        WHERE TO_CHAR(TO_DATE(JSON_VALUE(P.jsonstr, '$.Sale_date'), 'YYYY-MM-DD'), 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')\r\n"
	        		+ "        GROUP BY P.EMP_ID\r\n"
	        		+ "    )\r\n"
	        		+ ")";

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"topEmp\": \"");
	        
	        if (rs.next()) {
	        	String topEmp = rs.getString("topEmp");
	        	str.append(topEmp != null ? topEmp : "0").append("\"");
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

	public String getInpo(String email) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;
	    String json = "{}"; // 기본적으로 빈 JSON 반환

	    try {
	        String sql = "SELECT " +
	                "JSON_VALUE(jsonstr, '$.E_name') AS Name, " +
	                "JSON_VALUE(jsonstr, '$.E_email') AS Email, " +
	                "JSON_VALUE(jsonstr, '$.E_position') AS Position, " +
	                "(SELECT BRANCH_NAME FROM BRANCH B WHERE B.BRANCH_ID = E.BRANCH_ID) AS Branch_Id " +
	                "FROM EMPLOYEE E WHERE JSON_VALUE(jsonstr, '$.E_email') = ?";


	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);
	        stmt.setString(1, email);
	        rs = stmt.executeQuery();

	        if (rs.next()) {
	            String name = rs.getString("Name");
	            String eemail = rs.getString("Email");
	            String position = rs.getString("Position");
	            String branch = rs.getString("Branch_Id");

	            // JSON 문자열 직접 생성
	            json = String.format("{\"Name\":\"%s\", \"Email\":\"%s\", \"Position\": \"%s\", \"Branch\": \"%s\"}",
	                    name != null ? name : "",
	                    eemail != null ? eemail : "",
	                    position != null ? position : "",
	                    branch != null ? branch : "");
	        }
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	    return json;
	}
	
	public String getTemp(String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql;
	        if ("null".equals(branch)) {
	            sql = "SELECT COUNT(*) AS EMP_COUNT FROM EMPLOYEE"; // 전체 직원 수
	        } else {
	            sql = "SELECT COUNT(*) AS EMP_COUNT FROM EMPLOYEE WHERE BRANCH_ID = ?"; // 특정 지점 직원 수
	        }

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);

	        if (!"null".equals(branch)) {
	            stmt.setString(1, branch);
	        }
	        rs = stmt.executeQuery();

	        StringBuilder str = new StringBuilder("\"totalEmp\": \"");

	        if (rs.next()) { // 첫 번째 행으로 이동 후 값 가져오기
	            String empCount = rs.getString("EMP_COUNT");
	            str.append(empCount != null ? empCount : "0").append("\"");
	        } else {
	            str.append("0\""); // 결과가 없을 경우 기본값 0
	        }

	        str.append("}");
	        return str.toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}

	public String getBempSales(String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql;
	        if ("null".equals(branch)) {
	            sql = "SELECT JSON_VALUE(E.jsonstr, '$.E_name') AS EMP_NAME, COUNT(P.SALE_ID) AS SALES_COUNT\r\n"
	            		+ "FROM EMPLOYEE E JOIN PURCHASE P ON E.EMP_ID = P.EMP_ID\r\n"
	            		+ "GROUP BY JSON_VALUE(E.jsonstr, '$.E_name')";
	        } else {
	            sql = "SELECT JSON_VALUE(E.jsonstr, '$.E_name') AS EMP_NAME, COUNT(P.SALE_ID) AS SALES_COUNT\r\n"
	            		+ "FROM EMPLOYEE E JOIN PURCHASE P ON E.EMP_ID = P.EMP_ID\r\n"
	            		+ "WHERE E.BRANCH_ID = ?\r\n"
	            		+ "GROUP BY JSON_VALUE(E.jsonstr, '$.E_name')";
	        }

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);

	        if (!"null".equals(branch)) {
	            stmt.setString(1, branch);
	        }
	        rs = stmt.executeQuery();


	        StringBuilder branchNames = new StringBuilder("[");
	        StringBuilder salesCounts = new StringBuilder("[");

	        boolean first = true;
	        while (rs.next()) {
	            String empName = rs.getString("EMP_NAME");
	            String salesCount = rs.getString("SALES_COUNT");

	            if (!first) {
	                branchNames.append(", ");
	                salesCounts.append(", ");
	            }
	            first = false;

	            branchNames.append("\"").append(empName).append("\"");
	            salesCounts.append("\"").append(salesCount).append("\"");
	        }

	        branchNames.append("]");
	        salesCounts.append("]");

	        return "\"branches\": " + branchNames.toString() + ", \"empsalesByBranch\": " + salesCounts.toString() + ",";
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
	
	public String getIncentive(String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql;
	        if ("null".equals(branch)) {
	            sql = "SELECT RANK() OVER (ORDER BY COUNT(*) DESC) AS RANKING, JSON_VALUE(E.jsonstr, '$.E_name') AS EMP_NAME, COUNT(*) * 1000000 AS SALES_COUNT\r\n"
	            		+ "FROM EMPLOYEE E JOIN PURCHASE P ON E.EMP_ID = P.EMP_ID\r\n"
	            		+ "GROUP BY E.EMP_ID, JSON_VALUE(E.jsonstr, '$.E_name') ORDER BY RANKING FETCH FIRST 5 ROWS ONLY";
	        } else {
	            sql = "SELECT RANK() OVER (ORDER BY COUNT(*) DESC) AS RANKING, JSON_VALUE(E.jsonstr, '$.E_name') AS EMP_NAME, COUNT(*) * 1000000 AS SALES_COUNT\r\n"
	            		+ "FROM EMPLOYEE E JOIN PURCHASE P ON E.EMP_ID = P.EMP_ID\r\n"
	            		+ "WHERE E.BRANCH_ID= ?\r\n"
	            		+ "GROUP BY E.EMP_ID, JSON_VALUE(E.jsonstr, '$.E_name') ORDER BY RANKING FETCH FIRST 5 ROWS ONLY";
	        }

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);

	        if (!"null".equals(branch)) {
	            stmt.setString(1, branch);
	        }
	        rs = stmt.executeQuery();

	        StringBuilder jsonResult = new StringBuilder("\"incentiveByBranch\": [");
	        
	        boolean first = true;
	        while (rs.next()) {
	            if (!first) {
	                jsonResult.append(", ");
	            }
	            first = false;

	            String rank = rs.getString("RANKING");
	            String empName = rs.getString("EMP_NAME");
	            String incentive = rs.getString("SALES_COUNT"); 

	            jsonResult.append("{")
	                      .append("\"rank\": \"").append(rank).append("\", ")
	                      .append("\"emp_name\": \"").append(empName).append("\", ")
	                      .append("\"incentive\": \"").append(incentive).append("\"")
	                      .append("}");
	        }

	        jsonResult.append("], "); // 닫는 JSON 괄호 수정

	        return jsonResult.toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}

	public String getEbyB(String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql;
	        if ("null".equals(branch)) {
	            sql = "SELECT JSON_VALUE(jsonstr, '$.E_position') AS POSITION, COUNT(*) AS COUNT FROM EMPLOYEE\r\n"
	            		+ "GROUP BY JSON_VALUE(jsonstr, '$.E_position')";
	        } else {
	            sql = "SELECT JSON_VALUE(jsonstr, '$.E_position') AS POSITION, COUNT(*) AS COUNT FROM EMPLOYEE\r\n"
	            		+ "WHERE BRANCH_ID = ? GROUP BY JSON_VALUE(jsonstr, '$.E_position')";
	        }

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);

	        if (!"null".equals(branch)) {
	            stmt.setString(1, branch);
	        }
	        rs = stmt.executeQuery();

	        StringBuilder jsonResult = new StringBuilder("\"empByBranch\": [");
	        
	        boolean first = true;
	        while (rs.next()) {
	            if (!first) {
	                jsonResult.append(", ");
	            }
	            first = false;

	            String position = rs.getString("POSITION");
	            String count = rs.getString("COUNT");

	            jsonResult.append("{")
	                      .append("\"position\": \"").append(position).append("\", ")
	                      .append("\"count\": \"").append(count)
	                      .append("\"}");
	        }

	        jsonResult.append("], "); // 닫는 JSON 괄호 수정

	        return jsonResult.toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
	
	public String getEmpSList(String branch) throws NamingException, SQLException {
	    Connection conn = null;
	    PreparedStatement stmt = null;
	    ResultSet rs = null;

	    try {
	        String sql;
	        if ("null".equals(branch)) {
	            sql = "SELECT JSON_VALUE(E.jsonstr, '$.E_name') AS EMP_NAME, JSON_VALUE(E.jsonstr, '$.E_position') AS EMP_POSITION, (COUNT(*) * 1000000 + 3000000) AS TOTAL_INCENTIVE\r\n"
	            		+ "FROM EMPLOYEE E JOIN PURCHASE P ON E.EMP_ID = P.EMP_ID\r\n"
	            		+ "GROUP BY E.EMP_ID, JSON_VALUE(E.jsonstr, '$.E_name'), JSON_VALUE(E.jsonstr, '$.E_position')";
	        } else {
	            sql = "SELECT JSON_VALUE(E.jsonstr, '$.E_name') AS EMP_NAME, JSON_VALUE(E.jsonstr, '$.E_position') AS EMP_POSITION, (COUNT(*) * 1000000 + 3000000) AS TOTAL_INCENTIVE\r\n"
	            		+ "FROM EMPLOYEE E JOIN PURCHASE P ON E.EMP_ID = P.EMP_ID\r\n"
	            		+ "WHERE E.BRANCH_ID = ?\r\n"
	            		+ "GROUP BY E.EMP_ID, JSON_VALUE(E.jsonstr, '$.E_name'), JSON_VALUE(E.jsonstr, '$.E_position')";
	        }

	        conn = ConnectionPool.get();
	        stmt = conn.prepareStatement(sql);

	        if (!"null".equals(branch)) {
	            stmt.setString(1, branch);
	        }
	        rs = stmt.executeQuery();

	        StringBuilder jsonResult = new StringBuilder("{\"empListByBranch\": [");
	        
	        boolean first = true;
	        while (rs.next()) {
	            if (!first) {
	                jsonResult.append(", ");
	            }
	            first = false;

	            String empName = rs.getString("EMP_NAME");
	            String empPosition = rs.getString("EMP_POSITION"); 
	            String tincentive = rs.getString("TOTAL_INCENTIVE"); 
	            
	            jsonResult.append("{")
	                      .append("\"empName\": \"").append(empName).append("\", ")
	                      .append("\"empPosition\": \"").append(empPosition).append("\", ")
	                      .append("\"tincentive\": \"").append(tincentive).append("\"")
	                      .append("}");
	        }

	        jsonResult.append("], "); // 닫는 JSON 괄호 수정

	        return jsonResult.toString();
	    } finally {
	        if (rs != null) rs.close();
	        if (stmt != null) stmt.close();
	        if (conn != null) conn.close();
	    }
	}
}