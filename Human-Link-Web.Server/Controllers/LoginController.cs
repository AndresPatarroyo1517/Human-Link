using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Human_Link_Web.Server.Models;

namespace Human_Link_Web.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly HumanLinkContext _context;

        public LoginController(HumanLinkContext context)
        {
            _context = context;
        }

        // GET: api/Login/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // POST: api/Login
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostLogin(Usuario usuario)
        {
            //var user = await _context.Usuarios.FindAsync(usuario.Idusuario);
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Usuario1 == usuario.Usuario1);
            Console.WriteLine(user);
            if (user == null)
            {
                return NotFound("Usuario y/o clave incorrectos");
            }

            // Cambiar comparacion cuando se implemente la encriptación
            var claveValida = user.Clave == usuario.Clave ? true : false;
            if (!claveValida)
            {
                //return Unauthorized("Clave incorrecta");
                return NotFound("Usuario y/o clave incorrectos");
            }

            // Antes de retornar OK, implementar la creacion de token de sesion, como JWT
            return Ok("Acceso concedido");
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Idusuario == id);
        }
    }
}
