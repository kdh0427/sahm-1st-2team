package dao;

public class ComplainVO {
	private String id, date, comment, type;
	
	public ComplainVO(String id, String date, String comment, String type) {
		this.id = id;
		this.date = date;
		this.comment = comment;
		this.type = type;
	}
	
	public String getPId() {return this.id;}
	public String getPDate() {return this.date;}
	public String getPComment() {return this.comment;}
	public String getPType() {return this.type;}
}
