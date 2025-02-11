<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="dao.CustDAO" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="javax.naming.NamingException" %>
<%@ page import="java.sql.SQLException" %>

<%
    request.setCharacterEncoding("utf-8");

    String email = request.getParameter("Email");

    try {
        CustDAO dao = new CustDAO();

        if(email.equals("null")){
        	out.print(dao.getList());
        }
        else{
        	out.print(dao.delete(email));
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
%>
