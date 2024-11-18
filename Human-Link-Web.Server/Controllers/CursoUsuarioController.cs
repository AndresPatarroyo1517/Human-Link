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

        public class CursoUsuariosResponse
        {
            public string NombreCurso { get; set; }
            public int CantidadUsuarios { get; set; }
            public DateOnly? FechaInicioMasReciente { get; set; }

            public double PromedioProgreso { get; set; }

            public double PromedioNotas { get; set; }

            public string CategoriaCurso { get; set; }
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
                        notas = cu.Notas,
                        fechaInicio = cu.Fechainicio
                    })
                .ToListAsync();

            if (cursosUsuario == null || !cursosUsuario.Any())
            {
                return NotFound("No se encontraron cursos y curso-usuario.");
            }

            return Ok(cursosUsuario);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("usuarios-en-curso")]
        public async Task<ActionResult<IEnumerable<CursoUsuariosResponse>>> GetUsuariosPorCurso()
        {
            var resultado = await _context.Cursousuarios
                .GroupBy(cu => cu.Idcurso)
                .Select(grupo => new CursoUsuariosResponse
                {
                    NombreCurso = grupo.FirstOrDefault().IdcursoNavigation.Nombrecurso,
                    CantidadUsuarios = grupo.Count(),
                    FechaInicioMasReciente = grupo.Max(cu => cu.Fechainicio),
                    PromedioProgreso = grupo.Average(cu => cu.Progreso ?? 0),
                    PromedioNotas = grupo
                        .Average(cu => cu.Notas != null && cu.Notas.Any()
                            ? cu.Notas.Average(n => n)
                            : 0),
                    CategoriaCurso = grupo.FirstOrDefault().IdcursoNavigation.Categoria
                })
                .ToListAsync();

            return Ok(resultado);
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
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<Cursousuario>> PostCursousuario(Cursousuario cursousuario)
        {
            // Validar si el usuario ya está inscrito en este curso
            var existeInscripcion = await _context.Cursousuarios
                .AnyAsync(c => c.Idusuario == cursousuario.Idusuario && c.Idcurso == cursousuario.Idcurso);

            if (existeInscripcion)
            {
                return Conflict(new { message = "El usuario ya está inscrito en este curso." });
            }
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

            // Asignar Idusuario basado en el claim
            cursousuario.Idusuario = Convert.ToInt32(id);
            cursousuario.Fechainicio = DateOnly.FromDateTime(DateTime.Now);

            Console.WriteLine($"Received data: Idcurso = {cursousuario.Idcurso}, Progreso = {cursousuario.Progreso}, idusuario = {cursousuario.Idusuario}, fecha = {cursousuario.Fechainicio}");

            // Guardar en la base de datos
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
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("dashboard")]
        public async Task<ActionResult> GetDashboardStats()
        {
            try
            {
                var salaryStats = await _context.Empleados
                    .GroupBy(e => e.Departamento)
                    .Select(g => new
                    {
                        Departamento = g.Key,
                        SalarioPromedio = g.Average(e => e.Salario),
                        SalarioTotal = g.Sum(e => e.Salario)
                    })
                    .ToListAsync();

                var courseStats = await _context.Cursos
                    .Join(_context.Cursousuarios,
                        c => c.Idcurso,
                        cu => cu.Idcurso,
                        (c, cu) => new { c, cu })
                    .GroupBy(x => x.c.Nombrecurso)
                    .Select(g => new
                    {
                        NombreCurso = g.Key,
                        ProgresoPromedio = g.Average(x => x.cu.Progreso),
                        TotalParticipantes = g.Count()
                    })
                    .ToListAsync();

                var employeeCount = await _context.Empleados
                    .GroupBy(e => new { e.Departamento, e.Cargo })
                    .Select(g => new
                    {
                        Departamento = g.Key.Departamento,
                        Cargo = g.Key.Cargo,
                        TotalEmpleados = g.Count()
                    })
                    .ToListAsync();

                var bonusStats = await _context.Empleados
                    .Join(_context.Nominas,
                        e => e.Idempleado,
                        n => n.Idempleado,
                        (e, n) => new { e, n })
                    .GroupBy(x => x.e.Departamento)
                    .Select(g => new
                    {
                        Departamento = g.Key,
                        TotalBonificaciones = g.Sum(x => x.n.Bonificacion),
                        EmpleadosConBono = g.Count()
                    })
                    .ToListAsync();

                var popularCourses = await _context.Cursos
                    .Join(_context.Cursousuarios,
                        c => c.Idcurso,
                        cu => cu.Idcurso,
                        (c, cu) => new { c, cu })
                    .GroupBy(x => x.c.Nombrecurso)
                    .Select(g => new 
                    {
                        NombreCurso = g.Key,
                        TotalInscritos = g.Count()
                    })
                    .OrderByDescending(x => x.TotalInscritos)
                    .ToListAsync();


                var response = new
                {
                    SalaryStats = salaryStats,
                    CourseStats = courseStats,
                    EmployeeCount = employeeCount,
                    BonusStats = bonusStats,
                    PopularCourses = popularCourses
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener las estadísticas", error = ex.Message });
            }
        }


    }
}
