<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="dao.ComplainDAO"%>

<%
	request.setCharacterEncoding("utf-8");

	String id = request.getParameter("inquiryId");
	String res = request.getParameter("response");
	
	if (id == null || id.equals("null")) id = "";
	if (res == null || res.equals("null")) res = "";
	
	ComplainDAO cdao = new ComplainDAO();
	
	if(id.isEmpty() && res.isEmpty()){
		out.print(cdao.getCommet() + cdao.getComplain());
	}
	else{
		if(cdao.getRequest(id, res)){
			out.print("SU");
		}
		else{
			out.print("FA");
		}
	}
%>