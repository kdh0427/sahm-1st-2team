<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="dao.CustDAO" %>
<%@ page import="dao.CustVO" %>
<%@ page import="org.json.simple.JSONArray" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="org.json.simple.parser.ParseException" %>
<%@ page import="java.util.List" %>

<%
    request.setCharacterEncoding("utf-8");

    // action 파라미터 가져오기
    String action = request.getParameter("action");
    CustDAO dao = new CustDAO();  // `dao` 객체 선언 추가

    if ("update".equals(action)) {
        String jsonstr = request.getParameter("jsonstr");
        if (jsonstr == null) {
            out.print("ER: jsonstr is null");
            return;
        }

        try {
            JSONParser parser = new JSONParser();
            JSONArray jsonArray = (JSONArray) parser.parse(jsonstr);

            for (Object obj : jsonArray) {
                JSONObject jsonObj = (JSONObject) obj;

                String custId = (String) jsonObj.get("cust_id");
                String name = (String) jsonObj.get("name");
                String birthDate = (String) jsonObj.get("birth_date");
                String email = (String) jsonObj.get("email");
                String status = (String) jsonObj.get("status");
                String address = (String) jsonObj.get("address");
                String phone = (String) jsonObj.get("phone");
                String type = (String) jsonObj.get("type");

                // ✅ update_date는 프론트에서 제거하고, 서버에서 SYSDATE로 설정
                boolean success = dao.update(custId, name, birthDate, email, status, null, address, phone, type);

                if (!success) {
                    out.print("ER: Failed to update customer ID: " + custId);
                    return;
                }
            }
            out.print("OK");

        } catch (ParseException e) {
            e.printStackTrace();
            out.print("ER: JSON Parsing Error");
        } catch (Exception e) {
            e.printStackTrace();
            out.print("ER: " + e.getMessage());
        }
    } else if ("delete".equals(action)) {
        String custId = request.getParameter("cust_id");
        if (custId == null) {
            out.print("ER: cust_id is null");
            return;
        }

        boolean success = dao.delete(custId);
        if (success) {
            out.print("OK");
        } else {
            out.print("ER: Failed to delete customer ID: " + custId);
        }
    } else {  // 고객 조회 기능
        try {
            List<CustVO> customers = dao.getAllCustomers();
            JSONArray customerArray = new JSONArray();

            for (CustVO customer : customers) {
                JSONObject jsonObj = new JSONObject();
                jsonObj.put("cust_id", customer.getCId());
                jsonObj.put("name", customer.getCName());
                jsonObj.put("birth_date", customer.getCDate());
                jsonObj.put("email", customer.getCEmail());
                jsonObj.put("status", customer.getCStatus());
                jsonObj.put("update_date", customer.getCUpdate());
                jsonObj.put("address", customer.getCAddress());
                jsonObj.put("phone", customer.getCPhone());
                jsonObj.put("type", customer.getCType());

                customerArray.add(jsonObj);
            }

            out.print(customerArray.toJSONString());
        } catch (Exception e) {
            e.printStackTrace();
            out.print("ER: Failed to fetch customer list");
        }
    }
%>
