using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Human_Link_Web.Server.Models;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly HumanLinkContext _context;

        public EmpleadoController(HumanLinkContext context)
        {
            _context = context;
        }
        //Endpoint para obtener todos los empleados 
        //Cambiar a uso restringido del JWT solamente del administrador
        // GET: HumanLink/Empleado
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleados()
        {
            return await _context.Empleados.ToListAsync();
        }
        //Endpoint para obtener un empleado en base a su ID
        // GET: HumanLink/Empleado/:id
        [HttpGet("Get-{id}")]
        public async Task<ActionResult<Empleado>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            return empleado;
        }
        //Endpoint para modificar la información del empleado
        //Cambiar a uso restringido del JWT, además validar que el ID que esta empleando sea el mismo que existe en el JWT (Este proceso se realiza si no es admin)
        // PUT: HumanLink/Empleado/:id
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Put-{id}")]
        public async Task<IActionResult> PutEmpleado(int id, Empleado empleado)
        {
            if (id != empleado.Idempleado)
            {
                return BadRequest();
            }

            _context.Entry(empleado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmpleadoExists(id))
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
        //Endpoint para añadir un empleado a la base de datos
        //Cambiar a uso restringido del JWT solamente del administrador
        // POST: HumanLink/Empleado
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Post")]
        public async Task<ActionResult<Empleado>> PostEmpleado(Empleado empleado)
        {
            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmpleado", new { id = empleado.Idempleado }, empleado);
        }
        //Endpoint para eliminar a un empleado haciendo uso de su ID
        //Cambiar a uso restringido del JWT solamente del administrador
        // DELETE: HumanLink/Empleado/:id
        [HttpDelete("Delete-{id}")]
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmpleadoExists(int id)
        {
            return _context.Empleados.Any(e => e.Idempleado == id);
        }
    }
}
