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
            var jsonResponse = await _httpClient.GetStringAsync("https://script.google.com/macros/s/AKfycbxhMit92deD1WgbKHMIjdYO0FCnl1CojNyW-GbKmBZSIk9SAxyZ79fT8fST16cTHXw/exec");

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
            var respuestaFecha = filteredResponse.LastOrDefault()?.timestamp;

            var objCursoUsuario = new Cursousuario
            {
                Idcurso = cursousuario.Idcurso,
                Notas = null
            };

            if (ultimaNota == null || respuestaFecha == null || !ValidarFechaYHora(respuestaFecha))
            {
                return Ok(objCursoUsuario);
                //return NotFound("No se encontró ninguna nota para el usuario especificado.");
            }


            var bdCursoUsuario = await _context.Cursousuarios
                .FirstOrDefaultAsync(c => c.Idcurso == cursousuario.Idcurso && c.Idusuario == idUsuario);

            if (bdCursoUsuario == null)
            {
                return NotFound("No se encontró el curso-usuario especificado con los IDs proporcionados.");
            }

            bdCursoUsuario.Notas ??= new List<int>();
            cursousuario.Progreso ??= 0;

            var progreso = (int)(100 / cursousuario.Progreso);

            bdCursoUsuario.Notas.Add(ultimaNota.Value);

            if (bdCursoUsuario.Progreso < 100)
            {
                bdCursoUsuario.Progreso += progreso;
            }

            if (bdCursoUsuario.Notas.Count > cursousuario.Progreso)
            {
                return Ok(objCursoUsuario);
            }

            if (bdCursoUsuario.Notas.Count == cursousuario.Progreso && bdCursoUsuario.Progreso < 100)
            {
                bdCursoUsuario.Progreso += (100 - bdCursoUsuario.Progreso);
            }

            _context.Entry(bdCursoUsuario).Property(c => c.Notas).IsModified = true;
            _context.Entry(bdCursoUsuario).Property(c => c.Progreso).IsModified = true;

            await _context.SaveChangesAsync();

            return Ok(bdCursoUsuario);
        }

        // True: fecha y hora valida
        // False: fecha u hora fuera del rango
        private static bool ValidarFechaYHora(String fecha)
        {
            DateTime fechaRecibida = DateTime.Parse(fecha, null, System.Globalization.DateTimeStyles.RoundtripKind);

            DateTime fechaRecibidaLocal = fechaRecibida.ToLocalTime();

            DateTime fechaActualLocal = DateTime.Now;

            if (fechaRecibidaLocal.Date == fechaActualLocal.Date)
            {
                // Calcular el rango de 5 minutos hacia atrás
                DateTime rangoInicio = fechaActualLocal.AddMinutes(-5);

                // Verificar si la hora recibida está dentro del rango
                if (fechaRecibidaLocal >= rangoInicio && fechaRecibidaLocal <= fechaActualLocal)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }


    }
}
