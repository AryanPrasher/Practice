import java.util.Scanner;
public class stud {
    int sid;
    String sn, scl ;
    Scanner sc=new Scanner(System.in);
    void get(){
        System.out.println("enter SID:");
        sid=sc.nextInt();
        System.out.println("enter Student Name:");
        sn=sc.next();
        System.out.println("enter Student class:");
        scl=sc.next();
    }
    void disp(){
        System.out.println("student id:" +sid);
        System.out.println("student name :" +sn);
        System.out.println("student class:" +scl);
    }
    public static void main(String[] args){
        stud s1 = new stud();
        s1.get();
        s1.disp();
    }
}
