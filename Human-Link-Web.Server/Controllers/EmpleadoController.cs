using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        // GET: HumanLink/Empleado/GetAll
        [HttpGet("GetAll")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleados()
        {
            var empleados = await _context.Empleados.ToListAsync();
            return Ok(empleados);
        }

        //Endpoint para obtener un empleado en base a su ID
        // GET: HumanLink/Empleado/:id
        [HttpGet("Get-{id}")]
        [Authorize(Policy = "AllPolicy")] // solo permite el consumo del endpoint a usuarios logeados, ya sea adminnistrador o empleado
        public async Task<ActionResult<Empleado>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            return Ok(empleado);
        }

        //Endpoint para modificar la información del empleado
        //Cambiar a uso restringido del JWT, además validar que el ID que esta empleando sea el mismo que existe en el JWT (Este proceso se realiza si no es admin)
        // PUT: HumanLink/Empleado/:id
        [HttpPut("Put-{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
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

            return Ok("Empleado actualizado.");
        }

        //Endpoint para añadir un empleado a la base de datos
        //Cambiar a uso restringido del JWT solamente del administrador
        // POST: HumanLink/Empleado
        [HttpPost("Post")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<Empleado>> PostEmpleado(Empleado empleado)
        {
            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetEmpleado", new { id = empleado.Idempleado }, empleado);
        }


        //Endpoint para eliminar a un empleado haciendo uso de su ID
        // DELETE: HumanLink/Empleado/:id
        [HttpDelete("Delete-{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return Ok("Empleado eliminado.");
        }

        private bool EmpleadoExists(int id)
        {
            return _context.Empleados.Any(e => e.Idempleado == id);
        }
    }
}
