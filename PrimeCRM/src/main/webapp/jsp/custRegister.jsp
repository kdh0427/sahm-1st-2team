<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="dao.CustDAO" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.JSONValue" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.parser.ParseException" %>
<%@ page import="java.util.UUID" %>
<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="java.sql.SQLException" %>
<%@ page import="javax.naming.NamingException" %>

<%
    request.setCharacterEncoding("utf-8");

    String jsonstr = request.getParameter("jsonstr");
    String custStatus = request.getParameter("Cust_Status");

    if (jsonstr == null || jsonstr.trim().isEmpty()) {
        System.out.println("ERROR: jsonstr가 null 또는 비어 있음.");
        out.print("ER");
        return;
    }

    try {
        JSONParser parser = new JSONParser();
        JSONObject parsedJson = (JSONObject) parser.parse(jsonstr);

        // LinkedHashMap을 사용하여 순서를 유지하는 JSON 객체 생성
        LinkedHashMap<String, Object> orderedJson = new LinkedHashMap<>();
        orderedJson.put("CuName", parsedJson.get("CuName"));
        orderedJson.put("CuBday", parsedJson.get("CuBday"));
        orderedJson.put("CuNum", parsedJson.get("CuNum"));
        orderedJson.put("CuEmail", parsedJson.get("CuEmail"));
        orderedJson.put("CusAdd", parsedJson.get("CusAdd"));
        orderedJson.put("CuType", parsedJson.get("CuType"));

        // 이메일 중복 확인
        String email = (String) parsedJson.get("CuEmail");

        CustDAO dao = new CustDAO();

        if (dao.existsByEmail(email)) {
            System.out.println("[ERROR] 중복 이메일 존재: " + email);
            out.print("EX");
            return;
        }

        // 고객 ID 생성
        String custId = "CUST_" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);

        System.out.println("변환된 JSON 데이터 (Cust_ID 제거 후): " + orderedJson.toString());

        // INSERT 실행
        boolean insertSuccess = dao.insert(custId, JSONValue.toJSONString(orderedJson), custStatus);

        if (insertSuccess) {
            System.out.println("고객 등록 완료: " + custId);
            out.print("OK");
        } else {
            System.out.println("고객 등록 실패");
            out.print("ER");
        }

    } catch (ParseException e) {
        System.out.println("JSON 파싱 오류 발생");
        out.print("ER");
        e.printStackTrace();
    } catch (SQLException | NamingException e) {
        System.out.println("DB 오류 발생");
        out.print("DB_ERROR");
        e.printStackTrace();
    }
%>
