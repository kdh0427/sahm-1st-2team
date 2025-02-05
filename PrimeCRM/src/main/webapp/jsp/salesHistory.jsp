<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO"%>

<%
	String email = request.getParameter("Email");		

	CustDAO dao = new CustDAO();
	
	out.print(dao.getMyCust(email));
%>