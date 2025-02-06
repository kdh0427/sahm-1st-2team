<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="dao.CustDAO" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="javax.naming.NamingException" %>
<%@ page import="java.sql.SQLException" %>

<%
    request.setCharacterEncoding("utf-8");

    String custId = request.getParameter("Cust_ID");
    System.out.println("Received Cust_ID: " + custId);

    if (custId == null || custId.trim().isEmpty()) {
        out.print("{\"status\": \"ER\", \"message\": \"고객 ID가 없습니다.\"}");
        return;
    }

    try {
        CustDAO dao = new CustDAO();
        String customerData = dao.getList(); 

        if (customerData != null && !customerData.equals("[]")) {
            JSONObject responseJson = new JSONObject();
            responseJson.put("status", "OK");
            responseJson.put("customer", customerData);
            out.print(responseJson.toJSONString());
        } else {
            out.print("{\"status\": \"NO_RESULT\", \"message\": \"해당 고객을 찾을 수 없습니다.\"}");
        }
    } catch (NamingException | SQLException e) {
        e.printStackTrace();
        out.print("{\"status\": \"DB_ERROR\", \"message\": \"데이터베이스 오류가 발생했습니다.\"}");
    }
%>
