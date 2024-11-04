using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Human_Link_Web.Server.Custom;

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

        //Endpoint para hacer inicio de sesión 
        // POST: HumanLink/Login/login
        [HttpPost("login")]
        public async Task<ActionResult<Usuario>> PostLogin(Login userLogin)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Usuario1 == userLogin.Usuario);

            if (user == null)
            {
                return NotFound("Usuario y/o clave incorrectos Usuario");
            }

            // Verificar si la clave ingresada coincide con la encriptación
            if (user.Clave == userLogin.Clave)
            { return NotFound("Usuario y/o clave incorrectos Clave"); }
            /*var result = _passwordHasher.Verify(user.Clave, userLogin.Clave);
            if (!result)
            {
                //return Unauthorized("Clave incorrecta");
                return NotFound("Usuario y/o clave incorrectos Clave");
            }*/

            var token = _utilidades.generarJWT(user);
            var remember = userLogin.Recuerdame;
            if (!remember)
            {
                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true
                });
            }
            else {
                Response.Cookies.Append("jwt", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    Expires = DateTime.UtcNow.AddDays(1)
                });
            }
            var sesion = new
            {
                usuario = user.Usuario1,
                isAdmin = user.Isadmin
            };
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
