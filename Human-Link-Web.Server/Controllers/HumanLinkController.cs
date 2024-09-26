using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Human_Link_Web.Server.Controllers
{
    [ApiController]
    // Se deja sin especificar la autenticación (AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)
    // porque solo se tiene un tipo de autenticación
    [Authorize]
    [Route("[controller]")]
    public class HumanLinkController : ControllerBase
    {

        private readonly ILogger<HumanLinkController> _logger;
        private readonly HumanLinkContext _db;

        public HumanLinkController(ILogger<HumanLinkController> logger, HumanLinkContext db)
        {
            this._logger = logger;
            this._db = db;
        }

        [HttpGet("GetUsers")]
        //Get Usuarios, y en la relación con empleado solo se trae el nombre del empleado asociado
        public async Task<ActionResult<List<Usuario>>> GetAllUsersAsync()
        {

            try
            {
                var users = await _db.Usuarios
                    .Include(u => u.Empleados)
                    .Select(u => new Usuario
                    {
                        Idusuario = u.Idusuario,
                        Usuario1 = u.Usuario1,
                        Correo = u.Correo,
                        Isadmin = u.Isadmin,
                        Empleados = u.Empleados.Select(e => new Empleado
                        {
                            Nombre = e.Nombre,
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
