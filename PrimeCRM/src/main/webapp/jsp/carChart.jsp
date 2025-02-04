<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CarDAO"%>
<%@ page import='dao.PurchaseDAO' %>

<%
	String period = request.getParameter("month");

	CarDAO dao = new CarDAO();
	PurchaseDAO pdao = new PurchaseDAO();
	
	response.setContentType("application/json; charset=UTF-8");
	out.print(pdao.getSales(period));
%>
