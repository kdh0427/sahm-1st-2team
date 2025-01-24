package dao;

public class PurchaseVO {
	private String sid, carid, custid, sdate, empid;
	private int price;
	
	public PurchaseVO(String sid, String carid, String custid, String sdate, int price, String empid) {
		this.sid = sid;
		this.carid = carid;
		this.custid = custid;
		this.sdate = sdate;
		this.price = price;
		this.empid = empid;
	}
	
	public String getSid() {return this.sid;};
	public String getCarid() {return this.carid;};
	public String getCustid() {return this.custid;};
	public String getSdate() {return this.sdate;};
	public int getPrice() {return this.price;};
	public String getEmpid() {return this.empid;};
}
