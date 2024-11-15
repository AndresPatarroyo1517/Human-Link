//Importa clases de Models
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
//ORM de C#:
using Microsoft.EntityFrameworkCore;
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
            var cursosUsuario = await _context.Cursousuarios
                .Join(_context.Cursos,
                    cu => cu.Idcurso,
                    c => c.Idcurso,
                    (cu, c) => new
                    {
                        idcurso = c.Idcurso,
                        nombrecurso = c.Nombrecurso,
                        categoria = c.Categoria,
                        descripcion = c.Descripcion,
                        duracion = c.Duracion,
                        idcuremp = cu.Idcuremp,
                        idusuario = cu.Idusuario,
                        cursoId = cu.Idcurso,
                        progreso = cu.Progreso,
                        fechaInicio = cu.Fechainicio
                    })
                .ToListAsync();

            if (cursosUsuario == null || !cursosUsuario.Any())
            {
                return NotFound("No se encontraron cursos y curso-usuario.");
            }

            return Ok(cursosUsuario);
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
                    (cu, c) => new{
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

        //tare el idcuremp
        [HttpGet("Idcuremp")]
        [Authorize(Policy = "AllPolicy")] // Verifica que el usuario esté autenticado, ya sea admin o empleado
        public async Task<ActionResult<IEnumerable<Cursousuario>>> GetCursousuariosIdcuremp()
        {
            try
            {
                var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (id == null)
                {
                    return Unauthorized("El usuario no está autenticado.");
                }

                var usuarioId = Convert.ToInt32(id); 

                var cursousuarios = await _context.Cursousuarios
                    .Where(cu => cu.Idusuario == usuarioId)  
                    .ToListAsync();

                if (cursousuarios == null || !cursousuarios.Any())
                {
                    return NotFound("No se encontraron registros para el usuario especificado.");
                }

                return Ok(cursousuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error al obtener los cursos de usuario: " + ex.Message);
            }
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

        [HttpPost("inscripcion")]
        [Authorize(Policy = "AllPolicy")]
        public async Task<ActionResult<Cursousuario>> PostCursousuarioEmpleado([FromBody] Cursousuario cursousuario)
        {
            Console.WriteLine($"Received data: Idcurso = {cursousuario.Idcurso}, Progreso = {cursousuario.Progreso}");
            var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (id == null)
            {
                return Unauthorized(); // Si no se encuentra el ID del usuario en las claims, devolver 401 Unauthorized
            }

            cursousuario.Idusuario = Convert.ToInt32(id);
            cursousuario.Fechainicio = DateOnly.FromDateTime(DateTime.Now);

            Console.WriteLine($"Received data: Idcurso = {cursousuario.Idcurso}, Progreso = {cursousuario.Progreso}, idusuario = {cursousuario.Idusuario}, fecha = {cursousuario.Fechainicio}");

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
        // DELETE: HumanLink/CursoUsuario/5
        [HttpDelete("empleado/{id}")]
        [Authorize(Policy = "AllPolicy")] // Permite el consumo del endpoint a todos los usuarios autenticados
        public async Task<IActionResult> DeleteCursoUsuarioEmpleado(int id)
        {
            var cursoUsuario = await _context.Cursousuarios.FindAsync(id);
            if (cursoUsuario == null)
            {
                return NotFound();
            }

            _context.Cursousuarios.Remove(cursoUsuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
