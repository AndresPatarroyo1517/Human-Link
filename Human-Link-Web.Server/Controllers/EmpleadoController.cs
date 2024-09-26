//importa las clases de Models:
using Human_Link_Web.Server.Models;
//se usa para peticiones HTTP:
using Microsoft.AspNetCore.Mvc;
//El ORM de C#:
using Microsoft.EntityFrameworkCore;

namespace Human_Link_Web.Server.Controllers
{
    //Clase que hereda de HumanLinkController
    public class EmpleadoController : HumanLinkController
    {
        //Contructor
        public EmpleadoController(ILogger<HumanLinkController> logger, HumanLinkContext db) : base(logger, db)
        {
        }
        //Metodos GET, POST, PUT, DELETE:
        // GET: api/<ValuesController1>
        [HttpGet("GetEmployee")]
        public async Task<ActionResult<List<Empleado>>> GetAllEmpAsync()
        {
            try
            {
                var employ = await _db.Empleados
                    .Include(e => e.Nominas)
                    .Select(e => new Empleado
                    {
                        Idempleado = e.Idempleado,
                        Nombre = e.Nombre,
                        Cargo = e.Cargo,
                        Salario = e.Salario,
                        Departamento = e.Departamento,
                        Fechacontratacion = e.Fechacontratacion,
                        Fechaterminacioncontrato = e.Fechaterminacioncontrato,
                        Nominas = e.Nominas.Select(n => new Nomina
                        {
                            Totalnomina = n.Totalnomina,
                            Horasextra = n.Horasextra,
                            Bonificacion = n.Bonificacion
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(employ);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener empleados");
                return StatusCode(500, "Error interno: " + ex.Message);
            }
        }

        // GET api/<ValuesController1>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ValuesController1>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ValuesController1>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ValuesController1>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

    }
}
