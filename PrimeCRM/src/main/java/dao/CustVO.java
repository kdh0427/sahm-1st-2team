package dao;

public class CustVO {
	private String id, name, date, email, status, update, address, phone, type;
	
	public CustVO(String id, String name, String date, String email, String status, String update, String address, String phone, String type) {
		this.id = id;
		this.name = name;
		this.date = date;
		this.email = email;
		this.status = status;
		this.update = update;
		this.address = address;
		this.phone = phone;
		this.type = type;
	}
	
	public String getCId() {return this.id;}
	public String getCName() {return this.name;}
	public String getCDate() {return this.date;}
	public String getCEmail() {return this.email;}
	public String getCStatus() {return this.status;}
	public String getCUpdate() {return this.update;}
	public String getCAddress() {return this.address;}
	public String getCPhone() {return this.phone;}
	public String getCType() {return this.type;}
}
