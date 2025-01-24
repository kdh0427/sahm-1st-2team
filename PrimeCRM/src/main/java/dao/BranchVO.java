package dao;


public class BranchVO {
	private String id, name;
	
	public BranchVO(String id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public String getBId() {return this.id;}
	public String getBName() {return this.name;}
}
