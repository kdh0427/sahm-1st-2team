<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO" %>

<%
	request.setCharacterEncoding("utf-8");
	CustDAO dao = new CustDAO();
	
	String email = request.getParameter("email");
	response.setContentType("application/json; charset=UTF-8");

    // 이메일이 없으면 오류 메시지 반환
    if (email == null || email.isEmpty()) {
        out.print("{\"error\":\"이메일 정보가 없습니다.\"}");
    } else {
        out.print(dao.getInpo(email));
    }
%>