<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.EmpDAO" %>
<%@ page import="dao.BranchDAO" %>

<%

	String branch = request.getParameter("branch");
	EmpDAO edao = new EmpDAO();	
	BranchDAO bdao = new BranchDAO();
	
	out.print(edao.getEmpSList(branch) + edao.getEbyB(branch) + edao.getIncentive(branch) + bdao.getBempSales() + edao.getBempSales(branch) + edao.getTemp(branch));
%>
