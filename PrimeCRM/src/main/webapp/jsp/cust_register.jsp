<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="dao.CustDAO" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.ParseException" %>
<%@ page import="java.util.UUID" %>
<%@ page import="java.sql.SQLException" %>
<%@ page import="javax.naming.NamingException" %>


<%
    request.setCharacterEncoding("utf-8");
    
    String jsonstr = request.getParameter("jsonstr");
    System.out.println("Received jsonstr: " + jsonstr);
    
    if (jsonstr == null) {
        out.print("ER");
        return;
    }
    
    try {

        JSONParser parser = new JSONParser();
        JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
        
        String custId = "CUST_" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
        System.out.println("Generated Cust_ID: " + custId);
        
        CustDAO dao = new CustDAO();
        

        if (dao.exists(custId)) {
            out.print("EX");
            return;
        }
        
 
        boolean insertSuccess = dao.insert(custId, jsonstr);
        System.out.println("Insert result: " + insertSuccess);
        
        if (insertSuccess) {
            out.print("OK");
        } else {
            out.print("ER");
        }
        
    } catch (ParseException e) {
        out.print("ER");
        e.printStackTrace();
    } catch (SQLException | NamingException e) {
        out.print("DB_ERROR");
        e.printStackTrace();
    }
%>
