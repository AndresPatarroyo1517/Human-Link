using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace Human_Link_Web.Server.Models
{
    public partial class HumanLink_Mongo
    {
        private readonly IMongoDatabase _database;
        public IGridFSBucket GridFS { get; }

        public HumanLink_Mongo(IConfiguration _configuration)
        {
            var client = new MongoClient(_configuration.GetConnectionString("MongoContext"));
            _database = client.GetDatabase(_configuration.GetConnectionString("DatabaseName"));
            GridFS = new GridFSBucket(_database);
        }

        public IMongoCollection<Archivo> Archivos => _database.GetCollection<Archivo>("Archivos");
    }
}
