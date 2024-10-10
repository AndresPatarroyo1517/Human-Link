using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Human_Link_Web.Server.Models;

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
        public async Task<ActionResult<IEnumerable<Nomina>>> GetNominas()
        {
            return await _context.Nominas.ToListAsync();
        }
        //Endpoint para obtener la nomina de un empleado
        //Cambiar el id obtenido por el params, y obtenerlo del JWT que existe en la cookie, aunque debe buscarse la nomina en base al ID usuario y no por la ID del campo
        // GET: HumanLink/Nomina/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Nomina>> GetNomina(int id)
        {
            var nomina = await _context.Nominas.FindAsync(id);

            if (nomina == null)
            {
                return NotFound();
            }

            return nomina;
        }
        //Endpoint para modificar los campos de la nomina
        //Cambiar a uso restringido del JWT, usando el ID del usuario o a todos si es administrador, y opcional cambiar de PUT a PATCH
        // PUT: HumanLink/Nomina/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNomina(int id, Nomina nomina)
        {
            if (id != nomina.Idnomina)
            {
                return BadRequest();
            }

            _context.Entry(nomina).State = EntityState.Modified;

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

            return NoContent();
        }
        //Enpoint para añadir una nomina a la base de datos
        //Cambiar a uso restringido del JWT solamente del administrador
        // POST: HumanLink/Nomina
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Nomina>> PostNomina(Nomina nomina)
        {
            _context.Nominas.Add(nomina);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNomina", new { id = nomina.Idnomina }, nomina);
        }
        //Endpoint para eliminar una nomina de la base de datos
        //Cambiar a uso restringido del JWT solamente del administrador
        // DELETE: HumanLink/Nomina/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNomina(int id)
        {
            var nomina = await _context.Nominas.FindAsync(id);
            if (nomina == null)
            {
                return NotFound();
            }

            _context.Nominas.Remove(nomina);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NominaExists(int id)
        {
            return _context.Nominas.Any(e => e.Idnomina == id);
        }
    }
}
