<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.TemplateDAO"%>

<%
	String template = request.getParameter("template");
	String type = request.getParameter("type");	

	TemplateDAO dao = new TemplateDAO();

	if(dao.update(template, type)){
		out.print("SU");
	}
	else{
		out.print("FA");
	}
%>