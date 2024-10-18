using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly HumanLinkContext _context;

        public UsuarioController(HumanLinkContext context)
        {
            _context = context;
        }
        //Endpoint para obtener todos los usuarios y sus datos
        // GET: HumanLink/Usuario
        [HttpGet]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }
        //Endpoint para obtener el usuario mediante ID
        //Cambiar a uso restringido del JWT solamente del administrador
        // GET: HumanLink/Usuario/5
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        //Endpoint para actualizar la información del Usuario
        //Cambiar a uso restringido del JWT solamente del propio usuario y admin, recomendación cambiar a PATCH
        // PUT: HumanLink/Usuario/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Idusuario)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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

        //Endpoint para añadir usuarios a la base de datos
        // POST: HumanLink/Usuario
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsuario", new { id = usuario.Idusuario }, usuario);
        }

        //Endpoint para eliminar un usuario de la base de datos
        // DELETE: HumanLink/Usuario/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Idusuario == id);
        }
    }
}
