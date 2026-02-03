import java.io.*;
import java.net.*;

public class SimpleServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(12345)) {
            System.out.println("Server is listening on port 12345...");

            while (true) { // Keep the server running
                Socket socket = serverSocket.accept(); // Accept connection from client
                System.out.println("Client connected!");

                // Input and output streams for communication
                try (BufferedReader input = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                     PrintWriter output = new PrintWriter(socket.getOutputStream(), true)) {

                    String message = input.readLine(); // Read client message
                    System.out.println("Received from client: " + message);

                    output.println("Hello from server!"); // Send a response to client
                }

                socket.close(); // Close the connection
                System.out.println("Client disconnected.");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
