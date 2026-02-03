using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using 

namespace demoproject
{
    class Program
    {
        static void Main(string[] args)
        {
            string str = @"Data Source=AALIM;Initial catalog=NewArtsERPProject;Integrated Security=True";


            SqlConnection con = new SqlConnection(str);



            SqlCommand cmd = new SqlCommand("SpGetBtSId", con);


            cmd.CommandType = CommandType.StoredProcedure;

            Console.WriteLine("Enter Student Id");
            //int Sid = Convert.ToInt32(Console.ReadLine());
            cmd.Parameters.AddWithValue("@Sid", id);

            SqlDataAdapter da = new SqlDataAdapter(cmd);


            DataSet ds = new DataSet();  // collecctoin of database


            da.Fill(ds);  // fill the data to dataset..

            DataTable dt = new DataTable();  // collectoin of rows and columns..

            dt = ds.Tables[0];

            StudentModel st = new StudentModel();

            st.Sid = Convert.ToInt32(dt.Rows[0]["Sid"]);
            st.SName = dt.Rows[0]["SName"].ToString();
            st.Marks = Convert.ToInt32(dt.Rows[0]["Marks"]);

            return View(st);
        }
    }
}
