package dao;

import java.sql.*;
import java.util.*;
import javax.naming.NamingException;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import util.ConnectionPool;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;


public class CustDAO {

    /**
     * 고객 정보를 DB에 저장 (Cust_Status는 별도 컬럼으로 저장)
     */
    public boolean insert(String id, String jsonstr, String custStatus) throws NamingException, SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = ConnectionPool.get();
            conn.setAutoCommit(false); // 트랜잭션 시작

            // Cust_Status가 TEMPLATE 테이블에 없으면 자동 추가
            if (!isValidCustStatus(custStatus)) {
                addCustStatusToTemplate(custStatus);  // TEMPLATE 테이블에 자동 추가
            }

            String sql = "INSERT INTO Customer (Cust_id, jsonstr, Cust_Status) VALUES (?, ?, ?)";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, id);
            stmt.setString(2, jsonstr);
            stmt.setString(3, custStatus);

            int count = stmt.executeUpdate();
            conn.commit(); // 정상 실행되면 커밋
            System.out.println("✅ [DAO] 고객 저장 완료: " + id);
            return (count == 1);

        } catch (SQLException e) {
            if (conn != null) conn.rollback(); // 오류 발생 시 롤백
            System.out.println("❌ [DAO ERROR] SQL 오류 발생: " + e.getMessage());
            throw e;
        } finally {
            if (stmt != null) stmt.close();
            if (conn != null) {
                conn.setAutoCommit(true); // 원래 상태로 복구
                conn.close();
            }
        }
    }
    
    
    public boolean updateCustomer(String email, String updatedJson) throws NamingException, SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = ConnectionPool.get();
            String sql = "UPDATE \"C##CRM\".CUSTOMER " +
                         "SET jsonstr = JSON_MERGE_PRESERVE(jsonstr, ?), " + // ✅ `JSON_MERGE_PATCH` → `JSON_MERGE_PRESERVE` 변경
                         "CUST_UPDATE_DATE = SYSDATE " +                      // ✅ `updateDate` 파라미터 제거하고 `SYSDATE` 사용
                         "WHERE JSON_VALUE(jsonstr, '$.CuEmail' RETURNING VARCHAR2(100)) = ?"; // ✅ `RETURNING VARCHAR2(100)` 추가

            stmt = conn.prepareStatement(sql);
            stmt.setString(1, updatedJson);
            stmt.setString(2, email);

            int count = stmt.executeUpdate();
            return (count == 1);

        } finally {
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
    }





    /**
     * 이메일이 중복인지 확인
     */
    public boolean existsByEmail(String email) throws NamingException, SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            String sql = "SELECT Cust_Id FROM Customer WHERE JSON_VALUE(jsonstr, '$.CuEmail') = ?";
            conn = ConnectionPool.get();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, email);

            rs = stmt.executeQuery();
            boolean exists = rs.next();
            System.out.println("🔎 [DAO] 이메일 존재 확인 (" + email + "): " + exists);
            return exists;

        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
    }

    /**
     * Cust_Status가 TEMPLATE 테이블에 존재하는지 확인
     */
    public boolean isValidCustStatus(String custStatus) throws NamingException, SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            String sql = "SELECT COUNT(*) FROM TEMPLATE WHERE Cust_Status = ?";
            conn = ConnectionPool.get();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, custStatus);

            rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
            return false;

        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
    }

    /**
     * TEMPLATE 테이블에 새로운 Cust_Status 추가
     */
    public void addCustStatusToTemplate(String custStatus) throws NamingException, SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            String sql = "INSERT INTO TEMPLATE (Cust_Status, Template_Detail) VALUES (?, '자동 추가된 상태')";
            conn = ConnectionPool.get();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, custStatus);
            stmt.executeUpdate();

            System.out.println("✅ [DAO] TEMPLATE 테이블에 새 CUST_STATUS 추가: " + custStatus);

        } finally {
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
    }

    /**
     * 고객 목록을 가져오는 메서드 (수정 날짜 추가)
     */
    public List<Map<String, String>> getAllCustomers() throws NamingException, SQLException {
        List<Map<String, String>> customers = new ArrayList<>();
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            String sql = "SELECT Cust_ID, jsonstr, Cust_Status FROM Customer";
            conn = ConnectionPool.get();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            JSONParser parser = new JSONParser();

            while (rs.next()) {
                String jsonStr = rs.getString("jsonstr");
                String custStatus = rs.getString("Cust_Status");

                // JSON 데이터 파싱
                JSONObject json = (JSONObject) parser.parse(jsonStr);
                
                // 고객 정보 맵으로 저장
                Map<String, String> customer = new LinkedHashMap<>(); // 순서 유지
                customer.put("CuName", (String) json.get("CuName"));
                customer.put("CuBday", (String) json.get("CuBday"));
                customer.put("CuNum", (String) json.get("CuNum"));
                customer.put("CuEmail", (String) json.get("CuEmail"));
                customer.put("CusAdd", (String) json.get("CusAdd"));
                customer.put("CuType", (String) json.get("CuType"));
                customer.put("CuUpdate", (String) json.get("CuUpdate")); // 수정 날짜 추가
                customer.put("Cust_Status", custStatus); // Cust_Status 추가

                customers.add(customer);
            }

            System.out.println("✅ [DAO] 가져온 고객 목록: " + customers);

        } catch (ParseException e) {
            e.printStackTrace();
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            if (conn != null) conn.close();
        }
        return customers;
    }
}
