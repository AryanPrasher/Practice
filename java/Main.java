import java.net.*;

public class Main {
    public static void main(String args[]) {
        try {
            URL url = new URL("https://www.javatpoint.com/java-tutorial");

            System.out.println("Protocol : " + url.getProtocol());
            System.out.println("Host name : " + url.getHost());
            System.out.println("Port Number : " + url.getPort());
            System.out.println("File name : " + url.getFile());
        } 
        catch (Exception e) {
            System.out.println("Invalid URL: " + e.getMessage());
        }
    }
} 

