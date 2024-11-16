using Human_Link_Web.Server.Custom;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        public LoginController(HumanLinkContext context, Utilidades utilidades, PasswordHasher passwordHasher)
        {
            _context = context;
            _utilidades = utilidades;
            _passwordHasher = passwordHasher;
        }

        // POST: HumanLink/Login/login
        [HttpPost("login")]
        public async Task<ActionResult> PostLogin(Login userLogin)
        {
            var user = await _context.Usuarios
                .AsNoTracking()
                .Where(u => u.Usuario1 == userLogin.Usuario)
                .Select(u => new { u.Idusuario, u.Usuario1, u.Clave, u.Isadmin })
                .FirstOrDefaultAsync();

            if (user == null || !_passwordHasher.Verify(user.Clave, userLogin.Clave))
            {
                return NotFound("Usuario y/o clave incorrectos");
            }

            // Generate JWT token
            var token = _utilidades.generarJWT(new Usuario
            {
                Idusuario = user.Idusuario,
                Usuario1 = user.Usuario1,
                Isadmin = user.Isadmin
            });

            // Set JWT token in cookies
            SetJwtCookie(token, userLogin.Recuerdame);

            return Ok(new { usuario = user.Usuario1, isAdmin = user.Isadmin });
        }

        // POST: HumanLink/Login/logout
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logout exitoso" });
        }
        private void SetJwtCookie(string token, bool remember)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Expires = remember ? DateTime.UtcNow.AddDays(7) : (DateTimeOffset?)null
            };
            Response.Cookies.Append("jwt", token, cookieOptions);
        }
    }
}