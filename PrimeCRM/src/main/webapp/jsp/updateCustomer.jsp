<%@ page contentType="application/json;charset=UTF-8" %>
<%@ page import="java.sql.*, org.json.simple.JSONObject" %>

<%
    request.setCharacterEncoding("UTF-8");

    String email = request.getParameter("email");
    String updateDate = request.getParameter("updateDate");
    String updatedData = request.getParameter("updatedData");

    Connection conn = null;
    PreparedStatement pstmt = null;
    JSONObject responseJson = new JSONObject();

    try {
        Class.forName("com.mysql.jdbc.Driver");
        conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/yourDB", "user", "password");

        String sql = "UPDATE customers SET updateDate = ?, address = ?, phone = ?, type = ?, notes = ? WHERE email = ?";
        pstmt = conn.prepareStatement(sql);

        // JSON 데이터 파싱
        JSONObject jsonData = (JSONObject) new org.json.simple.parser.JSONParser().parse(updatedData);
        pstmt.setString(1, updateDate);
        pstmt.setString(2, (String) jsonData.get("4"));
        pstmt.setString(3, (String) jsonData.get("5"));
        pstmt.setString(4, (String) jsonData.get("6"));
        pstmt.setString(5, (String) jsonData.get("7"));
        pstmt.setString(6, email);

        int result = pstmt.executeUpdate();

        if (result > 0) {
            responseJson.put("status", "success");
        } else {
            responseJson.put("status", "error");
        }
    } catch (Exception e) {
        e.printStackTrace();
        responseJson.put("status", "error");
    } finally {
        if (pstmt != null) pstmt.close();
        if (conn != null) conn.close();
    }

    out.print(responseJson.toJSONString());
%>
