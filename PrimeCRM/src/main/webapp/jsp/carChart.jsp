<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import='dao.PurchaseDAO' %>

<%
	String date = request.getParameter("date");

	PurchaseDAO pdao = new PurchaseDAO();
	
	if(date == null || date.trim().isEmpty() || date.equals("null")){
		String purpose = request.getParameter("PurposeSale");
		
		if(pdao.setPurpose(purpose)){
			out.print("SU");
		} else{
			out.print("FA");
		}
	}
	else{
		response.setContentType("application/json; charset=UTF-8");
		out.print(pdao.getTPur() + pdao.getPrate(date) + pdao.getTopthird(date) + pdao.getTcar(date) + pdao.getBsale(date) + pdao.getSales(date));	
	}
%>