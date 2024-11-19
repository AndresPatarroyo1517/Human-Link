using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class CursoController : ControllerBase
    {
        private readonly HumanLinkContext _context;

        public CursoController(HumanLinkContext context)
        {
            _context = context;
        }

        //Endpoint para obtener todos los cursos existentes en la base de datos
        // GET: HumanLink/Curso
        [HttpGet]
        [Authorize(Policy = "AllPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<IEnumerable<Curso>>> GetCursos()
        {
            var cursos = await _context.Cursos.ToListAsync();
            return Ok(cursos);
        }

        //Endpoint para obtener un curso en especifico usando el ID
        // GET: HumanLink/Curso/5
        [HttpGet("{id}")]
        [Authorize(Policy = "AllPolicy")] // solo permite el consumo del endpoint a usuarios logeados, ya sea adminnistrador o empleado
        public async Task<ActionResult<Curso>> GetCurso(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);

            if (curso == null)
            {
                return NotFound();
            }

            return Ok(curso);
        }

        //Endpoint para actualizar algún campo del curso 
        //Cambiar a uso restringido del JWT
        // PUT: HumanLink/Curso/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> PutCurso(int id, Curso curso)
        {
            if (id != curso.Idcurso)
            {
                return BadRequest();
            }

            _context.Entry(curso).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CursoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok("Curso actualizado.");
        }
        //Endpoint para crear un curso 
        //Cambiar a uso restringido del JWT
        // POST: HumanLink/Curso
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<Curso>> PostCurso(Curso curso)
        {
            _context.Cursos.Add(curso);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCurso", new { id = curso.Idcurso }, curso);
        }

        [HttpPost("inscripcion")]
        [Authorize(Policy = "AllPolicy")]
        public async Task<ActionResult<Cursousuario>> PostCursousuarioEmpleado([FromBody] Cursousuario cursousuario)
        {
            var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (id == null)
            {
                return Unauthorized(); // Si no se encuentra el ID del usuario en las claims, devolver 401 Unauthorized
            }

            cursousuario.Idusuario = Convert.ToInt32(id);
            cursousuario.Fechainicio = DateOnly.FromDateTime(DateTime.Now);
            _context.Cursousuarios.Add(cursousuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCursousuario", new { id = cursousuario.Idcuremp }, cursousuario);
        }

        //Endpoint para eliminar algú curso usando la ID
        // DELETE: HumanLink/Curso/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> DeleteCurso(int id)
        {
            var curso = await _context.Cursos.FindAsync(id);
            if (curso == null)
            {
                return NotFound();
            }

            _context.Cursos.Remove(curso);
            await _context.SaveChangesAsync();

            return Ok("Curso eliminado.");
        }

        private bool CursoExists(int id)
        {
            return _context.Cursos.Any(e => e.Idcurso == id);
        }
    }
}
