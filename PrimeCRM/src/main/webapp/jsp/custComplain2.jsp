<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="dao.ComplainDAO"%>
<%@ page import="org.json.simple.parser.JSONParser"%>
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="org.json.simple.parser.ParseException"%>

<%
	request.setCharacterEncoding("utf-8");

	String id = request.getParameter("Cust_ID");
	String jsonstr = request.getParameter("jsonstr");
	
	if (id == null || jsonstr == null) {
		out.print("ER");
		return;
	}
	
	try {
		JSONParser parser = new JSONParser();
		JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
	
		ComplainDAO dao = new ComplainDAO();
	
		if (dao.insert(id, jsonstr)) {
			out.print("OK");
		} else {
			out.print("ER");
		}
	
	} catch (ParseException e) {
		out.print("ER");
		e.printStackTrace();
	}
%>
