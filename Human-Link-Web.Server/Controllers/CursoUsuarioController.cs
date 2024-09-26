//importa las clases de Models:
using Human_Link_Web.Server.Models;
//se usa para peticiones HTTP:
using Microsoft.AspNetCore.Mvc;
//El ORM de C#:
using Microsoft.EntityFrameworkCore;
namespace Human_Link_Web.Server.Controllers
{
    //Clase que hereda de HumanLinkController
    public class CursoUsuarioController : HumanLinkController
    {
        //Contructor
        public CursoUsuarioController(ILogger<HumanLinkController> logger, HumanLinkContext db) : base(logger, db)
        {
        }
        //Metodos GET, POST, PUT, DELETE:

    }
}
