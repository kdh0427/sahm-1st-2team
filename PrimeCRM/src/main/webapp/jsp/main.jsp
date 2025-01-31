<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO"%>
<%@ page import="dao.EmpDAO" %>
<%@ page import="dao.CarDAO" %>
<%@ page import="dao.PurchaseDAO" %>

<%
	String employeeListJson = new EmpDAO().getList();  // getList()가 JSON 문자열을 반환한다고 가정
	response.setContentType("application/json");  // 응답의 콘텐츠 타입을 JSON으로 설정
	out.print(employeeListJson);
	System.out.println("여긴 도달");
%>