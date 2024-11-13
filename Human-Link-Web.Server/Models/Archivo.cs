using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Human_Link_Web.Server.Models
{
    public class Archivo
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public required string ArchivoPath { get; set; }
        public required string Propietario { get; set; }
        public required string NombreArchivo { get; set; }
        public required string TipoDocumento { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
        public string Estado { get; set; } = "sin verificar";

    }
}
