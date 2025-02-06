<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="dao.LoginDAO"%>

<%
	request.setCharacterEncoding("utf-8");

	String id = request.getParameter("CuID");
	String name = request.getParameter("CuName");
	String email = request.getParameter("CuEmail");
	String pwd = request.getParameter("CuPwd");
	

	if (id == null || name == null || email == null || pwd == null) {
		out.print("ER");
		return;
	}
	   
	try {
		LoginDAO dao = new LoginDAO();

		if (dao.exists(id)) {
			out.print("EX");
			return;
		}
		
		if (dao.insert(id, name, email, pwd)) {
			out.print("OK");
		} else {
			out.print("ER");
		}

	} catch (Exception e) {
		out.print("ER");
		e.printStackTrace();
	}
%>
