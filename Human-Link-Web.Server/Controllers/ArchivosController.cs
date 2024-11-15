using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System.Security.Claims;
using System.IO;
using System.Threading.Tasks;

namespace Human_Link_Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArchivosController : ControllerBase
    {
        private readonly HumanLink_Mongo _context;

        // Constructor
        public ArchivosController(HumanLink_Mongo context)
        {
            _context = context;
        }

        [Authorize(Policy = "AllPolicy")]
        [HttpPost()]
        public async Task<IActionResult> SubirArchivo(IFormFile file, [FromForm] string tipoDocumento)
        {
            var propietario = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (propietario == null)
                return Unauthorized("Usuario no autenticado.");

            if (file == null || file.Length == 0)
                return BadRequest("No se ha subido ningún archivo.");

            if (string.IsNullOrWhiteSpace(tipoDocumento))
                return BadRequest("Tipo de documento no especificado.");

            // Verificar si ya existe un documento con el mismo tipo para el usuario
            var archivoExistente = await _context.Archivos
                .Find(a => a.Propietario == propietario && a.TipoDocumento == tipoDocumento)
                .FirstOrDefaultAsync();

            if (archivoExistente != null)
            {
                // Elimina el archivo existente en GridFS
                await _context.GridFS.DeleteAsync(new ObjectId(archivoExistente.ArchivoPath));

                // Elimina el documento de la base de datos
                await _context.Archivos.DeleteOneAsync(a => a.Id == archivoExistente.Id);
            }

            // Guardar el nuevo archivo en GridFS
            using (var stream = file.OpenReadStream())
            {
                ObjectId fileId = await _context.GridFS.UploadFromStreamAsync(file.FileName, stream);
                Archivo nuevoArchivo = new()
                {
                    ArchivoPath = fileId.ToString(),
                    Propietario = propietario,
                    NombreArchivo = file.FileName.ToLower(),
                    TipoDocumento = tipoDocumento
                };

                await _context.Archivos.InsertOneAsync(nuevoArchivo);
            }

            return Ok(new { mensaje = "Archivo subido exitosamente" });
        }

        [Authorize(Policy = "AllPolicy")]
        [HttpPost("varios")]
        public async Task<IActionResult> SubirArchivoVarios(IFormFile file, [FromForm] string tipoDocumento)
        {
            var propietario = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (propietario == null)
                return Unauthorized("Usuario no autenticado.");

            if (file == null || file.Length == 0)
                return BadRequest("No se ha subido ningún archivo.");

            if (string.IsNullOrWhiteSpace(tipoDocumento))
                return BadRequest("Tipo de documento no especificado.");

            using (var stream = file.OpenReadStream())
            {
                ObjectId fileId = await _context.GridFS.UploadFromStreamAsync(file.FileName, stream);
                Archivo nuevoArchivo = new()
                {
                    ArchivoPath = fileId.ToString(),
                    Propietario = propietario,
                    NombreArchivo = file.FileName.ToLower(),
                    TipoDocumento = tipoDocumento // Asigna el nuevo campo
                };

                await _context.Archivos.InsertOneAsync(nuevoArchivo);
            }

            return Ok(new { mensaje = "Archivo subido exitosamente" });
        }


        [Authorize(Policy = "AllPolicy")]
        [HttpGet("propietario")]
        public async Task<IActionResult> ObtenerArchivos()
        {
            var propietario = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (propietario == null)
                return Unauthorized("Usuario no autenticado.");

            var filter = Builders<Archivo>.Filter.Eq(a => a.Propietario, propietario);
            var archivos = await _context.Archivos.Find(filter).ToListAsync();

            var resultados = archivos.Select(archivo => new
            {
                Id = archivo.ArchivoPath,
                Propietario = archivo.Propietario,
                NombreArchivo = archivo.NombreArchivo,
                TipoDocumento = archivo.TipoDocumento // Incluye el nuevo campo
            }).ToList();

            return Ok(resultados);
        }

        [Authorize(Policy = "AllPolicy")]
        [HttpGet("query/{nombreArchivo}")]
        public async Task<IActionResult> ObtenerArchivosByName(string nombreArchivo)
        {
            var propietario = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (propietario == null)
                return Unauthorized("Usuario no autenticado.");

            var filter = Builders<Archivo>.Filter.And(
                Builders<Archivo>.Filter.Eq(a => a.Propietario, propietario),
                Builders<Archivo>.Filter.Regex(a => a.NombreArchivo, new BsonRegularExpression($"^{nombreArchivo.ToLower()}.*", "i"))
            );

            var archivos = await _context.Archivos.Find(filter).ToListAsync();

            var resultados = archivos.Select(archivo => new
            {
                Id = archivo.ArchivoPath,
                Propietario = archivo.Propietario,
                NombreArchivo = archivo.NombreArchivo,
                TipoDocumento = archivo.TipoDocumento // Incluye el nuevo campo
            }).ToList();

            return Ok(resultados);
        }

        [Authorize(Policy = "AllPolicy")]
        [HttpGet("descargar/{id}")]
        public async Task<IActionResult> DescargarArchivo(string id)
        {
            var fileId = new ObjectId(id);

            var fileInfo = await _context.GridFS.Find(Builders<GridFSFileInfo<ObjectId>>.Filter.Eq(f => f.Id, fileId)).FirstOrDefaultAsync();

            if (fileInfo == null)
                return NotFound("Archivo no encontrado.");

            var stream = await _context.GridFS.OpenDownloadStreamAsync(fileId);
            var result = new MemoryStream();
            await stream.CopyToAsync(result);
            result.Position = 0;

            return File(result, "application/octet-stream", fileInfo.Filename);
        }


        [Authorize(Policy = "AllPolicy")]
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> DeleteArchivo(string id)
        {
            var propietario = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            if (propietario == null)
                return Unauthorized("Usuario no autenticado.");

            var fileId = new ObjectId(id);

            // Buscar el archivo en la base de datos
            var archivo = await _context.Archivos
                .Find(a => a.Propietario == propietario && a.ArchivoPath == id)
                .FirstOrDefaultAsync();

            if (archivo == null)
                return NotFound("Archivo no encontrado.");

            // Eliminar el archivo en GridFS
            await _context.GridFS.DeleteAsync(fileId);

            // Eliminar el documento en la base de datos
            await _context.Archivos.DeleteOneAsync(a => a.Id == archivo.Id);

            return Ok(new { mensaje = "Archivo eliminado exitosamente" });
        }

    }
}
