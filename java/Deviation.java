class Deviation{
    public static void main(String args[]){
        int a=0, b=0, c=0;
        int num = 723;
        c+=num%10;

        num=num/10;
        b+=num%10;

        num=num/10;
        a+=num%10;

        System.out.print(a, b, c);

    }
}