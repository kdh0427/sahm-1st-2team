<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.LoginDAO"%>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.ParseException" %>

<%
	request.setCharacterEncoding("utf-8");

	String jsonstr = request.getParameter("jsonstr");
	
	try{
		JSONParser parser = new JSONParser();
		JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
		String email = (String) jsonObj.get("CuEmail");
		String pwd = (String) jsonObj.get("Cust_pwd");
		LoginDAO dao = new LoginDAO();
		
		if(dao.login(email, pwd)){
			session.setAttribute("email", email);
			out.print("SU");
		}
		else{
			if(dao.exists(email)){
				out.print("ER");
				return;
			}
			else{
				out.print("ER");
				return;
			}
		}
	}catch (Exception e) {
		out.print("ER");
		e.printStackTrace();
	}
%>