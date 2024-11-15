namespace Human_Link_Web.Server.Models
{
    public class FormResponse
    {
        public string timestamp { get; set; }
        public string email { get; set; }
        public int score { get; set; }
        public List<Response> respuestas { get; set; }
    }
}
