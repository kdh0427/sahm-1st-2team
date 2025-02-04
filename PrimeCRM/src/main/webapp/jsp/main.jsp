<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO"%>
<%@ page import="dao.EmpDAO" %>
<%@ page import="dao.CarDAO" %>
<%@ page import="dao.PurchaseDAO" %>

<%
	EmpDAO edao = new EmpDAO();
	CustDAO cudao = new CustDAO();
	CarDAO cardao = new CarDAO();
	PurchaseDAO pdao = new PurchaseDAO();
	
	response.setContentType("application/json; charset=UTF-8");
	out.print(cudao.getCTList() + edao.getList() + cudao.getTotalC() + edao.getTopEmp() + pdao.getTop() + cardao.getImage());
%>