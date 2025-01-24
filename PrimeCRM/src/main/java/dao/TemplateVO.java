package dao;

public class TemplateVO {
	private String status, detail;
	
	public TemplateVO(String status, String detail) {
		this.status = status;
		this.detail = detail;
	}
	
	public String getStatus() {return this.status;}
	public String getDetail() {return this.detail;}
}
