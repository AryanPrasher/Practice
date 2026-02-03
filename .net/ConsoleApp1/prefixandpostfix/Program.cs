using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace prefixandpostfix
{
    class Program
    {
        static void Main(string[] args)
        {
            int pre = 0;
            int post = 0;

            ++pre;
            post++;

            Console.WriteLine("pre val: " + pre);
            Console.WriteLine("post val: " + post);

            Console.ReadLine(); // Keeps the console window open
        }
    }
}