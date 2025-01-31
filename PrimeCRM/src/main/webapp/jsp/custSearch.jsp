<%@ page language="java" contentType="text/html; charset=UTF-8"pageEncoding="UTF-8"%>
<%@ page import="dao.EmpDAO"%>

<% 
	out.print((new EmpDAO()).getList());
%>
