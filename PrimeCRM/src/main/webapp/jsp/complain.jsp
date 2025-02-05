<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.ComplainDAO"%>
<%@ page import="dao.TemplateDAO"%>

<%
	ComplainDAO cdao = new ComplainDAO();
	TemplateDAO tdao = new TemplateDAO();
	
	out.print(cdao.getComplain());
%>