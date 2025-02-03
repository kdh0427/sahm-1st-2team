<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="dao.EmpDAO"%>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.ParseException" %>  <%-- 예외 처리를 위해 추가 --%>

<%
	request.setCharacterEncoding("utf-8");

	String jsonstr = request.getParameter("jsonstr");
	String branch = request.getParameter("branch_Id");

	//System.out.println("Received jsonstr: " + jsonstr);
	//System.out.println("Received branch: " + branch);
	
	if (jsonstr == null || branch == null) {
		out.print("ER");
		return;
	}
	   
	try {
		JSONParser parser = new JSONParser();
		JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
		String email = (String) jsonObj.get("E_email");

		EmpDAO dao = new EmpDAO();

		if (dao.exists(email)) {
			out.print("EX");
			return;
		}
		
		if (dao.insert(jsonstr, branch)) {
			out.print("OK");
		} else {
			out.print("ER");
		}

	} catch (ParseException e) {
		out.print("ER");
		e.printStackTrace();
	}
%>
