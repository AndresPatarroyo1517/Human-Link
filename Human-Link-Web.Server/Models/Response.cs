namespace Human_Link_Web.Server.Models
{
    public class Response
    {
        public string pregunta { get; set; }
        public string respuesta { get; set; }
        public int puntos { get; set; }
        public List<string> opciones { get; set; }
        public string respuestaCorrecta { get; set; }
    }
}
