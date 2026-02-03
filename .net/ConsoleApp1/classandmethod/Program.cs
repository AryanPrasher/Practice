using System;

namespace classandmethod
{
    public class Firstclass
    {
        private int classval = 1; 

        public void PrintMethod()
        {
            Console.WriteLine(classval);
            Console.WriteLine("This is print method");
            Console.ReadLine(); 
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Firstclass f1 = new Firstclass();
            f1.PrintMethod();
        }
    }
}
