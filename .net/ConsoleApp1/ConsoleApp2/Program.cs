using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;


namespace demosite
{
    class Program
    {
        static void Main(string[] args)
        {

            string str = @"Data Source=Susano;Initial catalog=ConsoleApp2;Integrated Security=True";

            SqlConnection con = new SqlConnection(str);
            SqlCommand cmd = new SqlCommand("SpSaveStudent", con);
            cmd.CommandType = CommandType.StoredProcedure;
            Console.WriteLine("Enter Student Name");
            string SName = model.SName;
            cmd.Parameters.AddWithValue("@SName", SName);

            int Marks = model.Marks;
            cmd.Parameters.AddWithValue("@Marks", Marks);
            con.Open();
            int res = cmd.ExecuteNonQuery();
            con.Close();

        }
    }
}
