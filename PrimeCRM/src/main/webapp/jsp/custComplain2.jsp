<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="dao.ComplainDAO"%>

<%
request.setCharacterEncoding("utf-8");

String id = request.getParameter("Cust_ID");
String date = request.getParameter("Complain_Date");
String cment = request.getParameter("Cment");
String complain = request.getParameter("Complain");
String status = request.getParameter("Complain_status");
String custstatus = request.getParameter("Cust_status");

if (id == null || date == null || complain == null || status == null || custstatus == null) {
	out.print("ER");
	return;
}

try {

	ComplainDAO dao = new ComplainDAO();

	if (dao.insert(id, date, cment, complain, status, custstatus)) {
		out.print("SU");
		
	} else {
		out.print("ER");
	}

} catch (Exception e) {
	out.print("ER");
	e.printStackTrace();
}
%>
