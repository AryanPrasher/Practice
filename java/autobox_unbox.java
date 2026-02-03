public class autobox_unbox {
    public static void main(String[] args){
        int primitive = 42;
        Integer wrapperint = primitive; //auto

        double primmitiveDouble = wrapperint.doubleValue();  //unboxing

        System.out.print(primmitiveDouble);
    }
}
