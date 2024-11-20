using Human_Link_Web.Server.Custom;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Transactions;
using static Human_Link_Web.Server.Controllers.UsuarioController;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly HumanLinkContext _context;
        private readonly PasswordHasher _passwordHasher;

        public UsuarioController(HumanLinkContext context, PasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public class UsuarioDto
        {
            public int Idusuario { get; set; }
            public string Usuario1 { get; set; }
            public string Correo { get; set; }
            public bool? Isadmin { get; set; }
            public bool? Isemailverified { get; set; }
            public ICollection<Cursousuario> Cursousuarios { get; set; }
            public ICollection<Empleado> Empleados { get; set; }
        }

        public class UsuarioUnique
        {
            public string Correo { get; set; }
            public int IdUsuario { get; set; }
            public string Clave { get; set; }
            public string Usuario1 { get; set; }
        }


        //Endpoint para obtener todos los usuarios y sus datos
        // GET: HumanLink/Usuario
        [HttpGet]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<IEnumerable<UsuarioDto>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new UsuarioDto
                {
                    Idusuario = u.Idusuario,
                    Usuario1 = u.Usuario1,
                    Correo = u.Correo,
                    Isadmin = u.Isadmin,
                    Isemailverified = u.Isemailverified,
                    Cursousuarios = u.Cursousuarios,
                    Empleados = u.Empleados
                })
                .ToListAsync();
            return Ok(usuarios);
        }


        //Endpoint para obtener el usuario
        //Cambiar a uso restringido del JWT solamente del administrador
        // GET: HumanLink/Usuario
        [HttpGet("usuario")]
        [Authorize(Policy = "AllPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<UsuarioUnique>> GetUsuario()
        {
            var id = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (id == null)
            {
                return Unauthorized();
            }

            var Idusuario = Convert.ToInt32(id);

            var usuario = await _context.Usuarios.FindAsync(Idusuario);

            if (usuario == null)
            {
                return NotFound();
            }

            // Mapeo del usuario a un DTO con las propiedades necesarias
            var usuarioDTO = new UsuarioUnique
            {
                Correo = usuario.Correo,
                IdUsuario = usuario.Idusuario,
                Clave = usuario.Clave,
                Usuario1 = usuario.Usuario1
            };

            return Ok(usuarioDTO);
        }

        // Endpoint para obtener el usuario mediante ID
        // Cambiar a uso restringido del JWT solamente del administrador
        // GET: HumanLink/Usuario/{id}
        [HttpGet("{id}")]
        [Authorize(Policy = "AllPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<UsuarioUnique>> GetUsuarioById(int id)
        {

            var user = await _context.Usuarios.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Mapeo del usuario a un DTO con las propiedades necesarias
            var usuarioDTO = new UsuarioUnique
            {
                Correo = user.Correo,
                IdUsuario = user.Idusuario,
                Clave = user.Clave,
                Usuario1 = user.Usuario1
            };

            return Ok(usuarioDTO);
        }



        //Endpoint para actualizar la información del Usuario
        //Aquí tambien se encripta la contraseña antes de ser añadida a la base de datos
        //Cambiar a uso restringido del JWT solamente del propio usuario y admin, recomendación cambiar a PATCH
        // PUT: HumanLink/Usuario/id
        [HttpPut("{id}")]
        [Authorize(Policy = "AllPolicy")]
        public async Task<IActionResult> PutUsuario(int id, [FromBody] UsuarioUnique usuario)
        {
            // Verifica si la clave está vacía
            if (string.IsNullOrWhiteSpace(usuario.Clave))
            {
                return BadRequest("La clave no puede estar vacía.");
            }

            // Verifica que el ID coincida entre la URL y el cuerpo del request
            if (id != usuario.IdUsuario)
            {
                return BadRequest("El ID del usuario en la URL no coincide con el ID proporcionado en el cuerpo.");
            }

            // Encuentra el usuario existente en la base de datos
            var usuarioExistente = await _context.Usuarios.FindAsync(id);
            if (usuarioExistente == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            usuarioExistente.Clave = _passwordHasher.Hash(usuario.Clave);

            // Actualizamos los campos que se pueden modificar
            usuarioExistente.Usuario1 = usuario.Usuario1;
            usuarioExistente.Isadmin = usuarioExistente.Isadmin;
            usuarioExistente.Isemailverified = usuarioExistente.Isemailverified;
            usuarioExistente.Correo = usuario.Correo;

            // Actualizamos el estado de la entidad para que se guarden los cambios
            _context.Entry(usuarioExistente).State = EntityState.Modified;

            try
            {
                // Guardamos los cambios en la base de datos
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound("El usuario ya no existe.");
                }
                else
                {
                    throw;
                }
            }

            return Ok("Usuario actualizado correctamente.");
        }


        //Endpoint para añadir usuarios a la base de datos
        //Aquí tambien se encripta la contraseña antes de ser añadida a la base de datos
        // POST: HumanLink/Usuario
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<Usuario>> PostUsuario([FromBody] Usuario usuario)
        {
            try
            {
                if (usuario == null)
                {
                    return BadRequest("El usuario no puede ser nulo.");
                }

                // Verificar si la contraseña está presente y no es vacía
                if (string.IsNullOrEmpty(usuario.Clave))
                {
                    return BadRequest("La contraseña no puede estar vacía.");
                }

                // Hash de la contraseña
                usuario.Clave = _passwordHasher.Hash(usuario.Clave);

                // Guardar el usuario
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                // Si hay empleados asociados, actualizar su referencia
                if (usuario.Empleados != null && usuario.Empleados.Any())
                {
                    foreach (var empleado in usuario.Empleados)
                    {
                        var empleadoExistente = await _context.Empleados.FindAsync(empleado.Idempleado);
                        if (empleadoExistente != null)
                        {
                            empleadoExistente.EmpleadoUsuario = usuario.Idusuario;
                            _context.Entry(empleadoExistente).State = EntityState.Modified;
                        }
                    }
                    await _context.SaveChangesAsync();
                }
                return CreatedAtAction("GetUsuario", new { id = usuario.Idusuario }, usuario);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno del servidor al procesar la solicitud: " + ex.Message);
            }
        }


        //EnvPoint para encriptar las claves de la base de datos --BORRAR CUANDO TERMINE EL PROCESO DE DESARROLLO, ES SÓLO PARA AHORRAR TRABAJO--
        private const int MAX_RETRY_ATTEMPTS = 3;
        private const int RETRY_DELAY_MS = 1000; // 1 segundo entre reintentos
        [HttpPost("encriptar-claves")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult> EncryptExistingPasswords()
        {
            int usuariosActualizados = 0;
            var errores = new List<string>();
            int intentosConexion = 0;

            while (intentosConexion < MAX_RETRY_ATTEMPTS)
            {
                try
                {
                    // Verificar la conexión
                    if (!await _context.Database.CanConnectAsync())
                    {
                        throw new Exception("No se puede establecer conexión con la base de datos");
                    }

                    // Obtener usuarios en bloques de 10 para evitar sobrecarga
                    var usuarios = await _context.Usuarios
                        .Where(u => !u.Clave.Contains(";") || u.Clave.Length < 20)
                        .ToListAsync();

                    // Procesar en bloques pequeños
                    foreach (var usuario in usuarios)
                    {
                        int intentosUsuario = 0;
                        bool procesoExitoso = false;

                        while (intentosUsuario < MAX_RETRY_ATTEMPTS && !procesoExitoso)
                        {
                            try
                            {
                                // Crear un nuevo contexto para cada operación
                                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                                {
                                    // Recargar el usuario
                                    var usuarioActual = await _context.Usuarios
                                        .FirstOrDefaultAsync(u => u.Idusuario == usuario.Idusuario);

                                    if (usuarioActual != null)
                                    {
                                        // Cifrar la clave
                                        var claveOriginal = usuarioActual.Clave;
                                        usuarioActual.Clave = _passwordHasher.Hash(claveOriginal);

                                        await _context.SaveChangesAsync();
                                        scope.Complete();
                                        usuariosActualizados++;
                                        procesoExitoso = true;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                intentosUsuario++;
                                if (intentosUsuario >= MAX_RETRY_ATTEMPTS)
                                {
                                    errores.Add($"Error al procesar usuario {usuario.Idusuario} después de {MAX_RETRY_ATTEMPTS} intentos: {ex.Message}");
                                }
                                await Task.Delay(RETRY_DELAY_MS);
                            }
                        }
                    }

                    // Si llegamos aquí, el proceso fue exitoso
                    return Ok(new
                    {
                        mensaje = $"Proceso completado. {usuariosActualizados} usuarios actualizados.",
                        totalUsuarios = usuarios.Count,
                        usuariosActualizados,
                        errores = errores.Any() ? errores : null
                    });
                }
                catch (Exception ex)
                {
                    intentosConexion++;
                    if (intentosConexion >= MAX_RETRY_ATTEMPTS)
                    {
                        return StatusCode(500, new
                        {
                            mensaje = "Error al procesar el cifrado masivo de claves",
                            error = ex.Message,
                            detalleError = ex.InnerException?.Message,
                            intentosRealizados = intentosConexion
                        });
                    }
                    await Task.Delay(RETRY_DELAY_MS);
                }
            }

            return StatusCode(500, new
            {
                mensaje = "No se pudo completar el proceso después de múltiples intentos",
                intentosRealizados = intentosConexion
            });
        }


        // Endpoint para eliminar un usuario de la base de datos
        // DELETE: HumanLink/Usuario/id
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            try
            {
                var usuario = await _context.Usuarios.FindAsync(id);

                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();

                return Ok("Usuario eliminado correctamente.");
            }
            catch (Exception ex)
            {
                var errorMessage = $"Error al eliminar el usuario con ID: {id}. Excepción: {ex.Message}";
                if (ex.InnerException != null)
                {
                    errorMessage += $" Detalles internos del error: {ex.InnerException.Message}";
                }

                return StatusCode(500, errorMessage);
            }
        }
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("usuario/{idUsuario}/cursos")]
        public async Task<ActionResult<IEnumerable<object>>> GetProgresoCursos(int idUsuario)
        {
            var cursosUsuario = await _context.Cursousuarios
                .Include(cu => cu.IdcursoNavigation)
                .Where(cu => cu.Idusuario == idUsuario)
                .Select(cu => new
                {
                    NombreCurso = cu.IdcursoNavigation.Nombrecurso,
                    Progreso = cu.Progreso,
                    Notas = cu.Notas,
                    FechaInicio = cu.Fechainicio
                })
                .ToListAsync();

            if (!cursosUsuario.Any())
            {
                return NotFound($"No se encontraron cursos para el usuario con ID {idUsuario}");
            }

            return Ok(cursosUsuario);
        }
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("usuario/{idUsuario}/salario")]
        public async Task<ActionResult<object>> GetSalarioCalculado(int idUsuario)
        {
            var empleado = await _context.Empleados
                .Include(e => e.Nominas)
                .FirstOrDefaultAsync(e => e.EmpleadoUsuario == idUsuario);

            if (empleado == null)
            {
                return NotFound($"No se encontró empleado para el usuario con ID {idUsuario}");
            }
            var ultimaNomina = await _context.Nominas
                .Where(n => n.Idempleado == empleado.Idempleado)
                .OrderByDescending(n => n.Idnomina)
                .FirstOrDefaultAsync();

            if (ultimaNomina == null)
            {
                return NotFound($"No se encontró nómina para el empleado con ID {empleado.Idempleado}");
            }

            decimal salarioBase = empleado.Salario ?? 0;
            decimal valorHoraExtra = (salarioBase / 30 / 8) * 1.25m;
            decimal totalHorasExtra = (ultimaNomina.Horasextra ?? 0) * valorHoraExtra;
            decimal bonificacion = ultimaNomina.Bonificacion ?? 0;

            var salarioCalculado = new
            {
                IdNomina = ultimaNomina.Idnomina,
                Empleado = empleado.Nombre,
                Cargo = empleado.Cargo,
                Departamento = empleado.Departamento,
                SalarioBase = salarioBase,
                HorasExtra = ultimaNomina.Horasextra,
                ValorHorasExtra = Math.Round(totalHorasExtra, 2),
                Bonificacion = bonificacion,
                SalarioTotal = Math.Round(salarioBase + totalHorasExtra + bonificacion, 2)
            };

            return Ok(salarioCalculado);
        }


        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Idusuario == id);
        }
    }
}