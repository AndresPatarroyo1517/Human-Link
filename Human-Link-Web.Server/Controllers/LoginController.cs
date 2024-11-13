using Human_Link_Web.Server.Custom;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly HumanLinkContext _context;
        private readonly Utilidades _utilidades;
        private readonly PasswordHasher _passwordHasher;

        public LoginController(HumanLinkContext context, Utilidades _utilidades, PasswordHasher _passwordHasher)
        {
            this._context = context;
            this._utilidades = _utilidades;
            this._passwordHasher = _passwordHasher;
        }

        // Endpoint para hacer inicio de sesión 
        // POST: HumanLink/Login/login
        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> PostLogin(Login userLogin)
        {
            Debug.WriteLine("Inicio de sesión iniciado.");

            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Usuario1 == userLogin.Usuario);

            if (user == null)
            {
                Debug.WriteLine("Usuario no encontrado.");
                return NotFound("Usuario y/o clave incorrectos");
            }

            Debug.WriteLine("Usuario encontrado, verificando clave...");

            // Verificar si la clave ingresada coincide con la encriptación usando PasswordHasher
            bool isPasswordValid = _passwordHasher.Verify(user.Clave, userLogin.Clave);
            if (!isPasswordValid)
            {
                Debug.WriteLine("La clave no coincide.");
                return NotFound("Usuario y/o clave incorrectos");
            }

            Debug.WriteLine("Clave verificada correctamente. Generando token JWT.");

            // Generar el token JWT
            var token = _utilidades.generarJWT(user);

            // Configurar cookie JWT según la opción de "recordar"
            var remember = userLogin.Recuerdame;
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = remember ? DateTime.UtcNow.AddDays(1) : (DateTimeOffset?)null
            };

            Response.Cookies.Append("jwt", token, cookieOptions);

            Debug.WriteLine("Token JWT configurado correctamente.");

            var sesion = new
            {
                usuario = user.Usuario1,
                isAdmin = user.Isadmin
            };

            Debug.WriteLine("Inicio de sesión exitoso.");
            return Ok(sesion);
        }


        //Endpoint para eliminar la cookie
        // POST: HumanLink/Login/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logout exitoso" });
        }


    }
}
