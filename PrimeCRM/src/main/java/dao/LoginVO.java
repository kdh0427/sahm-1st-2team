package dao;

public class LoginVO {
	private String name, email, pwd, id;
	
	public LoginVO(String name, String email, String pwd, String id) {
		this.name=name;
		this.email=email;
		this.pwd = pwd;
		this.id = id;
	}
	
	public String getCName() {return this.name;}
	public String getCEmail() {return this.email;}
	public String getCPwd() {return this.pwd;}
	public String getCId() {return this.id;}
}
	