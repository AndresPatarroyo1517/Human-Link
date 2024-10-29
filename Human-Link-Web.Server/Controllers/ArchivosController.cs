using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System.Security.Claims;

namespace Human_Link_Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivosController(HumanLink_Mongo context) : ControllerBase
    {
        private readonly HumanLink_Mongo _context = context;

        [Authorize(Policy = "AllPolicy")]
        [HttpPost]
        public async Task<IActionResult> SubirArchivo(IFormFile file)
        {
            var propietario = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (file == null || file.Length == 0)
                return BadRequest("No se ha subido ningún archivo.");

            using (var stream = file.OpenReadStream())
            {
                ObjectId fileId = await _context.GridFS.UploadFromStreamAsync(file.FileName, stream);
                Archivo nuevoArchivo = new()
                {
                    ArchivoPath = fileId.ToString(), 
                    Propietario = propietario,
                    NombreArchivo = (file.FileName).ToLower()
                };

                await _context.Archivos.InsertOneAsync(nuevoArchivo);
            }

            return Ok(new { mensaje = "Archivo subido exitosamente" });
        }

        [Authorize(Policy = "AllPolicy")]
        [HttpGet]
        public async Task<IActionResult> ObtenerArchivos()
        {
            var archivos = await _context.Archivos.Find(_ => true).ToListAsync();
            var resultados = archivos.Select(archivo => new
            {
                Id = archivo.ArchivoPath,
                Propietario = archivo.Propietario,
                NombreArchivo = archivo.NombreArchivo
            }).ToList();

            return Ok(resultados);
        }

        [Authorize(Policy = "AllPolicy")]
        [HttpGet("query/{nombreArchivo}")]
        public async Task<IActionResult> ObtenerArchivosByName(string nombreArchivo)
        {
            var filter = Builders<Archivo>.Filter.Regex(a => a.NombreArchivo, new BsonRegularExpression($"^{nombreArchivo.ToLower()}.*", "i"));

            var archivos = await _context.Archivos.Find(filter).ToListAsync();

            return Ok(archivos);
        }

        [Authorize(Policy = "AllPolicy")]
        [HttpGet("descargar/{id}")]
        public async Task<IActionResult> DescargarArchivo(string id)
        {
            var fileId = new MongoDB.Bson.ObjectId(id);

            var fileInfo = await _context.GridFS.Find(Builders<GridFSFileInfo<ObjectId>>.Filter.Eq(f => f.Id, fileId)).FirstOrDefaultAsync();

            if (fileInfo == null)
                return NotFound("Archivo no encontrado.");

            var stream = await _context.GridFS.OpenDownloadStreamAsync(fileId);
            var result = new MemoryStream();
            await stream.CopyToAsync(result);
            result.Position = 0;

            return File(result, "application/octet-stream", fileInfo.Filename);
        }


    }
}