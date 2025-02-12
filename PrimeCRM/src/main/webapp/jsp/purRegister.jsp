<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.PurchaseDAO"%>

<%
	String empId = request.getParameter("EmpID");
	String email = request.getParameter("Email");
	String model = request.getParameter("Model");
	String type = request.getParameter("Type");
	String jsonstr = request.getParameter("jsonstr");
	
	PurchaseDAO dao = new PurchaseDAO();
	
	if (empId == null || empId.trim().isEmpty()) {
        if(dao.setStatus(email)){
        	out.print("SU");
		} else{
			out.print("FA");
		}
    } else {
		if(dao.insert(empId, email, model, type, jsonstr)){
			out.print("SU");
		} else{
			out.print("FA");
		}
    }
%>