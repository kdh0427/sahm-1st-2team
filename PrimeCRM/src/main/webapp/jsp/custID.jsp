<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO"%>

<%
	String name = request.getParameter("Name");	

	CustDAO dao = new CustDAO();
	
	out.print(dao.getid(name));
%>