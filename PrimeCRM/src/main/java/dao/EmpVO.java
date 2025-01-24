package dao;

public class EmpVO {
	private String id, name, address, pwd, phone, position, branch;
	
	public EmpVO(String id, String name, String address, String pwd, String phone, String position, String branch) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.pwd = pwd;
		this.phone = phone;
		this.position = position;
		this.branch = branch;
	}
	
	public String getEId() {return this.id;}
	public String getEName() {return this.name;}
	public String getEAddress() {return this.address;}
	public String getEPwd() {return this.pwd;}
	public String getEPhone() {return this.phone;}
	public String getEPosition() {return this.position;}
	public String getEBranch() {return this.branch;}
}
