<%@ page language="java" contentType="application/json; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="dao.CustDAO"%>
<%@ page import="org.json.simple.JSONObject"%>
<%@ page import="javax.naming.NamingException"%>
<%@ page import="java.sql.SQLException"%>

<%
    request.setCharacterEncoding("utf-8");

	String jsonstr = request.getParameter("jsonstr");
	String email = request.getParameter("email");
	
    try {
        CustDAO dao = new CustDAO();

        if(email == null){
        	out.print(dao.getList());
        }
        else{
        	if(dao.update(email, jsonstr)) {
        		out.print("OK");
        	}
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
%>
