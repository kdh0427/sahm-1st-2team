<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import='dao.PurchaseDAO' %>

<%
	String date = request.getParameter("date");

	PurchaseDAO pdao = new PurchaseDAO();
	
	response.setContentType("application/json; charset=UTF-8");
	out.print(pdao.getPrate(date) + pdao.getTopthird(date) + pdao.getTcar(date) + pdao.getBsale(date) + pdao.getSales(date));
%>