	<%@ page language="java" contentType="text/html; charset=UTF-8"
		pageEncoding="UTF-8"%>
	<%@ page import="dao.CustDAO"%>
	<%@ page import="org.json.simple.parser.JSONParser"%>
	<%@ page import="org.json.simple.JSONObject"%>
	<%@ page import="org.json.simple.parser.ParseException"%>
	
	<%
	    request.setCharacterEncoding("utf-8");
	    
	    String jsonstr = request.getParameter("jsonstr");
	    String status = request.getParameter("Cust_Status");
	    
	    if (jsonstr == null || status == null) {
	        out.print("ER");
	        return;
	    }
	    
	    try {
	        JSONParser parser = new JSONParser();
	        JSONObject jsonObj = (JSONObject) parser.parse(jsonstr);
	        String email = (String) jsonObj.get("CuEmail");
	        
	        CustDAO dao = new CustDAO();
	
	        if (dao.exists(email)) {
	            out.print("EX");
	            return;
	        }
	        
	        if (dao.insert(jsonstr, status)) {
				out.print("OK");
			} else {
				out.print("ER");
			}
	
		} catch (ParseException e) {
			out.print("ER");
			e.printStackTrace();
		}
	%>
