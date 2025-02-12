<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.ParseException" %>

<%
	String jsonstr = request.getParameter("jsonstr");
	String status = request.getParameter("Cust_Status");
	
	CustDAO dao = new CustDAO();
	
	JSONParser parser = new JSONParser();
	JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
	String email = (String) jsonObj.get("CuEmail");
	
	if(dao.update(email, jsonstr, status)){
		out.print("SU");
	}else{
		out.print("FA");
	}
	
%>