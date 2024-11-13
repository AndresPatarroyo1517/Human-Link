using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class NominaController : ControllerBase
    {
        private readonly HumanLinkContext _context;

        public NominaController(HumanLinkContext context)
        {
            _context = context;
        }

        //Endpoint para obtener la nomina de todos los empleados
        //Cambiar a uso restringido del JWT solamente del administrador
        // GET: HumanLink/Nomina
        [HttpGet]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<IEnumerable<Nomina>>> GetNominas()
        {
            return await _context.Nominas.ToListAsync();
        }

        //Endpoint para obtener la nomina de un empleado
        //Cambiar el id obtenido por el params, y obtenerlo del JWT que existe en la cookie, aunque debe buscarse la nomina en base al ID usuario y no por la ID del campo
        // GET: HumanLink/Nomina/5
        [HttpGet("Get")]
        [Authorize(Policy = "AllPolicy")] // solo permite el consumo del endpoint a usuarios logeados, ya sea administrador o empleado
        public async Task<ActionResult<Nomina>> GetNomina()
        {
            var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (id == null)
            {
                return Unauthorized(); // Si no se encuentra el ID del usuario en las claims, devolver 401 Unauthorized
            }

            var usuarioId = Convert.ToInt32(id);
            var nomina = await _context.Nominas.FindAsync(usuarioId);

            if (nomina == null)
            {
                return NotFound();
            }

            return Ok(nomina);
        }
        //Endpoint para modificar los campos de la nomina
        //Cambiar a uso restringido del JWT, usando el ID del usuario o a todos si es administrador, y opcional cambiar de PUT a PATCH
        // PUT: HumanLink/Nomina/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> PutNomina(int id, Nomina nomina)
        {
            if (id != nomina.Idnomina)
            {
                return BadRequest();
            }

            var existingNomina = await _context.Nominas.FindAsync(id);
            if (existingNomina == null)
            {
                return NotFound();
            }

            existingNomina.Bonificacion = nomina.Bonificacion;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NominaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Nómina actualizada.");
        }

        //Enpoint para añadir una nomina a la base de datos
        // POST: HumanLink/Nomina
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<Nomina>> PostNomina(Nomina nomina)
        {
            _context.Nominas.Add(nomina);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNomina", new { id = nomina.Idnomina }, nomina);
        }

        //Endpoint para eliminar una nomina de la base de datos
        // DELETE: HumanLink/Nomina/5
        /*[HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> DeleteNomina(int id)
        {
            var nomina = await _context.Nominas.FindAsync(id);
            if (nomina == null)
            {
                return NotFound();
            }

            _context.Nominas.Remove(nomina);
            await _context.SaveChangesAsync();

            return Ok("");
        }*/

        private bool NominaExists(int id)
        {
            return _context.Nominas.Any(e => e.Idnomina == id);
        }
    }
}
