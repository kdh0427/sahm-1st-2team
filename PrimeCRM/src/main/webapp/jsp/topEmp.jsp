<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.EmpDAO"%>

<%
	EmpDAO dao = new EmpDAO();
	out.print(dao.getList());
%>