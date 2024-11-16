using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class FormController : ControllerBase
    {
        private readonly HumanLinkContext _context;
        private readonly HttpClient _httpClient;

        public FormController(HumanLinkContext context, HttpClient httpClient)
        {
            this._context = context;
            this._httpClient = httpClient;
        }

        // GET: HumanLink/Form/all-responses
        [HttpGet("all-responses")]
        public async Task<IActionResult> GetRespuestasForm()
        {
            var url = "https://script.google.com/macros/s/AKfycbwFZDpEVlFt6EfRxF0z04JE6MlI1j0LUqLI1lVjK-2Y2PpLQRor5t-nmLrfUxRmKl76/exec";
            var response = await _httpClient.GetStringAsync(url);

            return Ok(response);
        }

        [HttpPut("cargar-nota")]
        [Authorize(Policy = "AllPolicy")]
        public async Task<IActionResult> PutCargarNota(Cursousuario cursousuario)
        {
            var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var idUsuario = id != null ? Convert.ToInt32(id) : 0;
            var usuario = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var jsonResponse = await _httpClient.GetStringAsync("https://script.google.com/macros/s/AKfycbwFZDpEVlFt6EfRxF0z04JE6MlI1j0LUqLI1lVjK-2Y2PpLQRor5t-nmLrfUxRmKl76/exec");

            var responseList = JsonSerializer.Deserialize<List<FormResponse>>(jsonResponse);

            if (responseList == null)
            {
                return NotFound("Respuestas de cuestionario no encontradas.");
            }
            Console.WriteLine(responseList);
            var filteredResponse = responseList
                .Where(r => r.respuestas != null && r.respuestas.Any(respuesta =>
                respuesta.pregunta == "Nombre de usuario" && respuesta.respuesta == usuario))
                .ToList();

            var ultimaNota = filteredResponse.LastOrDefault()?.score;

            if (ultimaNota == null)
            {
                return NotFound("No se encontró ninguna nota para el usuario especificado.");
            }

            var cursoUsuario = await _context.Cursousuarios
                .FirstOrDefaultAsync(c => c.Idcurso == cursousuario.Idcurso && c.Idusuario == idUsuario);

            if (cursoUsuario == null)
            {
                return NotFound("No se encontró el curso-usuario especificado con los IDs proporcionados.");
            }

            if (cursoUsuario.Notas == null)
            {
                cursoUsuario.Notas = new List<int>();
            }
            cursoUsuario.Notas.Add(ultimaNota.Value);

            _context.Entry(cursoUsuario).Property(c => c.Notas).IsModified = true;

            await _context.SaveChangesAsync();

            return Ok(cursoUsuario);
        }

    }
}
