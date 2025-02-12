<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.JSONParser" %>

<%
    response.setContentType("application/json; charset=UTF-8");

    try {
        JSONParser parser = new JSONParser();
        JSONObject requestData = (JSONObject) parser.parse(request.getReader());

        String email = (String) requestData.get("email");

        CustDAO dao = new CustDAO();
        boolean success = dao.deleteCustomer(email); // ✅ DAO 메서드 호출

        if (success) {
            out.print("{\"status\":\"success\"}");
        } else {
            out.print("{\"status\":\"error\"}");
        }
    } catch (Exception e) {
        e.printStackTrace();
        out.print("{\"status\":\"error\", \"msg\":\"서버 오류 발생\"}");
    }
%>
