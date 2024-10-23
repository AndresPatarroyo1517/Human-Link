using Microsoft.AspNetCore.Mvc;
//ORM de C#:
using Microsoft.EntityFrameworkCore;
//Importa clases de Models
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class CursoUsuarioController : ControllerBase
    {
        private readonly HumanLinkContext _context;

        public CursoUsuarioController(HumanLinkContext context)
        {
            _context = context;
        }

        // GET: HumanLink/CursoUsuario
        [HttpGet]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<IEnumerable<Cursousuario>>> GetCursousuarios()
        {
            return await _context.Cursousuarios.ToListAsync();
        }

        // GET: HumanLink/CursoUsuario/id
        [HttpGet("id")]
        [Authorize(Policy = "AllPolicy")] // solo permite el consumo del endpoint a usuarios logeados, ya sea adminnistrador o empleado
        public async Task<ActionResult<IEnumerable<Cursousuario>>> GetCursoUsuarioEmpleado()
        {
            var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var usuarioId = Convert.ToInt32(id);
            var cursosUsuarioId = await _context.Cursousuarios
                .Where(cu => cu.Idusuario == usuarioId)
                .Select(cu => cu.Idcurso)
                .ToListAsync();

            if (cursosUsuarioId == null || !cursosUsuarioId.Any())
            {
                return NotFound("No se encontraron cursos para el usuario especificado.");
            }

            var cursos = await _context.Cursos
                .Where(c => cursosUsuarioId.Contains(c.Idcurso))
                .ToListAsync();

            if (cursos == null || !cursos.Any())
            {
                return NotFound("No se encontraron cursos correspondientes en la tabla de cursos.");
            }

            return Ok(cursos);
        }

        // GET: HumanLink/CursoUsuario/progreso
        [HttpGet("progreso")]
        [Authorize(Policy = "AllPolicy")] // solo permite el consumo del endpoint a usuarios logeados, ya sea adminnistrador o empleado
        public async Task<ActionResult<IEnumerable<Cursousuario>>> GetCursoUsuarioProgreso()
        {
            var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var usuarioId = Convert.ToInt32(id);

            var cursosConProgreso = await _context.Cursousuarios
                .Where(cu => cu.Idusuario == usuarioId)
                .Join(_context.Cursos,
                    cu => cu.Idcurso,
                    c => c.Idcurso,
                    (cu, c) => new
                        {
                            Curso = c,
                            Progreso = cu.Progreso
                        })
                .ToListAsync();

            if (cursosConProgreso == null || !cursosConProgreso.Any())
            {
                return NotFound("No se encontraron cursos y progreso para el usuario especificado.");
            }

            return Ok(cursosConProgreso);
        }

        // GET: HumanLink/CursoUsuario/:id
        [HttpGet("{id}")]
        [Authorize(Policy = "AllPolicy")] // solo permite el consumo del endpoint a usuarios logeados, ya sea adminnistrador o empleado
        public async Task<ActionResult<Cursousuario>> GetCursousuario(int id)
        {
            var cursousuario = await _context.Cursousuarios.FindAsync(id);

            if (cursousuario == null)
            {
                return NotFound();
            }

            return cursousuario;
        }

        // PUT: HumanLink/CursoUsuario/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> PutCursousuario(int id, Cursousuario cursousuario)
        {
            if (id != cursousuario.Idcuremp)
            {
                return BadRequest();
            }

            _context.Entry(cursousuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CursousuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: HumanLink/CursoUsuario
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<Cursousuario>> PostCursousuario(Cursousuario cursousuario)
        {
            _context.Cursousuarios.Add(cursousuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCursousuario", new { id = cursousuario.Idcuremp }, cursousuario);
        }

        // DELETE: HumanLink/CursoUsuario/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> DeleteCursousuario(int id)
        {
            var cursousuario = await _context.Cursousuarios.FindAsync(id);
            if (cursousuario == null)
            {
                return NotFound();
            }

            _context.Cursousuarios.Remove(cursousuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CursousuarioExists(int id)
        {
            return _context.Cursousuarios.Any(e => e.Idcuremp == id);
        }
    }
}
