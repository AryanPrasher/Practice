public Class Implicit {
    public static void main(String[] args) {
        int num = 10;
        double decimal = num;
        
        byte b = 5;
        int i = b;
        
        char c = 'A';
        int ascii = c;
        
        System.out.println(decimal);
        System.out.println(i);
        System.out.println(ascii);
    }
}