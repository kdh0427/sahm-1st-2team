package dao;

public class CarVO {
	private String id, name, type, option;
	
	public CarVO(String id, String name, String type, String option) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.option = option;
	}
	
	public String getCarId() {return this.id;}
	public String getCarName() {return this.name;}
	public String getCarType() {return this.type;}
	public String getCarOption() {return this.option;}
}
