//importa las clases de Models:
using Human_Link_Web.Server.Models;
//se usa para peticiones HTTP:
using Microsoft.AspNetCore.Mvc;
//El ORM de C#:
using Microsoft.EntityFrameworkCore;

namespace Human_Link_Web.Server.Controllers
{
    //la siguiente clase hereda de HumanLinkController:
    public class UsuarioController : HumanLinkController
    {
        //constructor de la clase:
        public UsuarioController(ILogger<UsuarioController> logger, HumanLinkContext db): base(logger, db)
        {
        }

        //Metodo GET
        [HttpGet("GetAllUsers")]
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

        //Metodo POST
        //Metodo PUT
        //Metodo DELETE
    }
}


