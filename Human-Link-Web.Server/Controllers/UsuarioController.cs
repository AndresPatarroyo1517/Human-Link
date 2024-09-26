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

        //atributo de tipo GET que define la ruta de la api /GetAllUsers
        [HttpGet("GetAllUsers")]

        //Metodo asíncrono que devuelve una respuesta HTTP y una lista de tipo Usuario
        public async Task<ActionResult<List<Usuario>>> GetAllUsersAsync()
        {
            try
            {
                //variable que accede al contexto de la ORM de la base de datos con _db. (_db es una instancia de HumanLinkContext en Models)
                var users = await _db.Usuarios
                    //incluye los empleados relacionados a los usuarios
                    .Include(u => u.Empleados)
                    //selecciona a cada usuario en una nueva instancia de Usuario de Models
                    .Select(u => new Usuario
                    {
                        //atributos seleccionados de Usuario de Models
                        Idusuario = u.Idusuario,
                        Usuario1 = u.Usuario1,
                        Correo = u.Correo,
                        Isadmin = u.Isadmin,
                        //selecciona el nombre de cada empleado en una nueva instancia Empleado de Models
                        Empleados = u.Empleados.Select(e => new Empleado
                        {
                            Nombre = e.Nombre,
                            //Lleva los nombres de los empleados a una lista
                        }).ToList()
                    })
                    //Extension de la ORM (EntityFrameworkCore) que lleva el resultado de la función asíncrona a una lista 
                    .ToListAsync();

                //Devuelve la respuesta HTTP 200 OK, con la lista de usuarios, si el metodo se ejecuta sin errores
                return Ok(users);
            }
            //Devuelve la respuesta HTTP 500 con la excepción, si el metodo no se ejecuta de forma esperada
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


