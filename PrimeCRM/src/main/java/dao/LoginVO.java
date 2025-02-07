package dao;

public class LoginVO {
	private String email, pwd, id;
	
	public LoginVO(String email, String pwd, String id) {
		this.email=email;
		this.pwd = pwd;
		this.id = id;
	}

	public String getCEmail() {return this.email;}
	public String getCPwd() {return this.pwd;}
	public String getCId() {return this.id;}
}
	