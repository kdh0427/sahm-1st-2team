<%@ page contentType="application/json;charset=UTF-8" %>
<%@ page import="java.sql.*, org.json.simple.JSONObject" %>

<%
    request.setCharacterEncoding("UTF-8");

    String email = request.getParameter("email");
    Connection conn = null;
    PreparedStatement pstmt = null;
    JSONObject responseJson = new JSONObject();

    try {
        Class.forName("com.mysql.jdbc.Driver");
        conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/yourDB", "user", "password");

        String sql = "DELETE FROM customers WHERE email = ?";
        pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, email);

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
