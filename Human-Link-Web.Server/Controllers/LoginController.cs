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
            // Fetch only essential fields from the database
            var user = await _context.Usuarios
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Usuario1 == userLogin.Usuario);

            // Validate user existence and password
            if (user == null || !_passwordHasher.Verify(user.Clave, userLogin.Clave))
            {
                return NotFound("Usuario y/o clave incorrectos");
            }

            // Generate JWT and configure cookie
            var token = _utilidades.generarJWT(user);
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
                Expires = remember ? DateTime.UtcNow.AddDays(1) : (DateTimeOffset?)null
            };
            Response.Cookies.Append("jwt", token, cookieOptions);
        }
    }
}