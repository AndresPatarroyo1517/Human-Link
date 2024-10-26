using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System.IO;
using System.Threading.Tasks;

namespace Human_Link_Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivosController : ControllerBase
    {
        private readonly HumanLink_Mongo _context;

        public ArchivosController(HumanLink_Mongo context)
        {
            _context = context;
        }

        [HttpPost("subir")]
        public async Task<IActionResult> SubirArchivo(IFormFile file, string propietario)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se ha subido ningún archivo.");

            // Guardar el archivo en GridFS
            using (var stream = file.OpenReadStream())
            {
                var fileId = await _context.GridFS.UploadFromStreamAsync(file.FileName, stream);
                var nuevoArchivo = new Archivo
                {
                    ArchivoPath = fileId.ToString(), // Guardar el ID de GridFS
                    Propietario = propietario
                };

                await _context.Archivos.InsertOneAsync(nuevoArchivo);
            }

            return Ok(new { mensaje = "Archivo subido exitosamente" });
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerArchivos()
        {
            var archivos = await _context.Archivos.Find(_ => true).ToListAsync();
            return Ok(archivos);
        }

        [HttpGet("descargar/{id}")]
        public async Task<IActionResult> DescargarArchivo(string id)
        {
            var fileId = new MongoDB.Bson.ObjectId(id);

            // Obtener el archivo de GridFS
            var fileInfo = await _context.GridFS.Find(Builders<GridFSFileInfo<ObjectId>>.Filter.Eq(f => f.Id, fileId)).FirstOrDefaultAsync();

            if (fileInfo == null)
                return NotFound("Archivo no encontrado.");

            var stream = await _context.GridFS.OpenDownloadStreamAsync(fileId);
            var result = new MemoryStream();
            await stream.CopyToAsync(result);
            result.Position = 0;

            // Usar el nombre del archivo desde los metadatos
            return File(result, "application/octet-stream", fileInfo.Filename);
        }
    }
}