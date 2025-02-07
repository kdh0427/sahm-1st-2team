<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.LoginDAO"%>

<%
	String email = request.getParameter("Email");	

	LoginDAO dao = new LoginDAO();
	
	out.print(dao.getPwd(email));
%>