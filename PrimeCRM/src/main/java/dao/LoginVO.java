package dao;

public class LoginVO {
	private String email, pwd, id;
	
	public LoginVO(String id, String email, String pwd) {
		this.id = id;
		this.email=email;
		this.pwd = pwd;
	}

	public String getCId() {return this.id;}
	public String getCEmail() {return this.email;}
	public String getCPwd() {return this.pwd;}
}
	