using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        // Endpoint para obtener un empleado por su ID (proporcionado en la ruta)
        // GET: HumanLink/Empleado/:id
        [HttpGet("{id:int}")]
        [Authorize(Policy = "AllPolicy")]
        public async Task<ActionResult<Empleado>> GetEmpleadoById(int id)
        {
            // Obtener el ID del usuario autenticado desde los claims
            var authenticatedUserIdClaim = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (authenticatedUserIdClaim == null)
            {
                return Unauthorized(); // Si no se encuentra el ID en las claims, devolver 401 Unauthorized
            }

            if (!int.TryParse(authenticatedUserIdClaim, out int authenticatedUserId))
            {
                return BadRequest("El ID del usuario autenticado no es válido.");
            }

            // Validar si el usuario autenticado tiene permiso para acceder al recurso solicitado
            if (authenticatedUserId != id)
            {
                // Verifica si el usuario tiene permisos adicionales (puedes ajustar esta lógica según tus necesidades)
                var isAdmin = HttpContext.User.IsInRole("Admin"); // Ejemplo: validar si el usuario es administrador
                if (!isAdmin)
                {
                    return Forbid("No tienes permisos para acceder a este recurso.");
                }
            }

            // Buscar el empleado en la base de datos por su ID
            var empleado = await _context.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound(); // Si no se encuentra el empleado, devolver 404 Not Found
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
