<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="dao.EmpDAO"%>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.JSONObject" %>

<%
	request.setCharacterEncoding("utf-8");

	String jsonstr = request.getParameter("jsonstr");
	String branch = request.getParameter("branch");
	
	JSONParser parser = new JSONParser();
	JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
	String email = (String) jsonObj.get("email");
	
	EmpDAO dao = new EmpDAO();
	if (dao.exists(email)) {
		out.print("EX");
	}

	if (dao.insert(jsonstr, branch)) {
		out.print("OK");
	} else {
		out.print("ER");
	}
%>