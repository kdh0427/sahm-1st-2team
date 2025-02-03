<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.EmpDAO" %>

<%
	request.setCharacterEncoding("utf-8");

	String email = request.getParameter("E_email");
	String pwd = request.getParameter("E_pwd");
	String phone = request.getParameter("E_phone");
	
	EmpDAO dao = new EmpDAO();
	
	if(dao.update(email, pwd, phone)){
		out.print("SU");
	}
	else out.print("ER");
%>