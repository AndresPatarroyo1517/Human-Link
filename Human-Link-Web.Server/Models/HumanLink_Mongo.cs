using MongoDB.Driver;
using MongoDB.Driver.GridFS;

namespace Human_Link_Web.Server.Models
{
    public partial class HumanLink_Mongo
    {
        private readonly IMongoDatabase _database;
        public IGridFSBucket GridFS { get; }

        public HumanLink_Mongo(string connectionString, string dbName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(dbName);
            GridFS = new GridFSBucket(_database);
        }

        public IMongoCollection<Archivo> Archivos => _database.GetCollection<Archivo>("Archivos");
    }
}
