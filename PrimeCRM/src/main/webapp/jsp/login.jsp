<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.EmpDAO"%>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.ParseException" %>

<%
	request.setCharacterEncoding("utf-8");

	String jsonstr = request.getParameter("jsonstr");
	
	try{
		JSONParser parser = new JSONParser();
		JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
		String email = (String) jsonObj.get("E_email");
		String pwd = (String) jsonObj.get("E_pwd");
		
		EmpDAO dao = new EmpDAO();
		
		if(dao.login(email, pwd)){
			out.print("SU");
		}
		else{
			if(dao.exists(email)){
				out.print("PFA");
				return;
			}
			else{
				out.print("FA");
				return;
			}
		}
	}catch (ParseException e) {
		out.print("ER");
		e.printStackTrace();
	}
%>