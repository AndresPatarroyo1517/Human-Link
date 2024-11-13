using Human_Link_Web.Server.Custom;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

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
        //Endpoint para obtener todos los usuarios y sus datos
        // GET: HumanLink/Usuario
        [HttpGet]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        //Endpoint para obtener el usuario mediante ID
        //Cambiar a uso restringido del JWT solamente del administrador
        // GET: HumanLink/Usuario/5
        [HttpGet("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }


        //Endpoint para actualizar la información del Usuario
        //Aquí tambien se encripta la contraseña antes de ser añadida a la base de datos
        //Cambiar a uso restringido del JWT solamente del propio usuario y admin, recomendación cambiar a PATCH
        // PUT: HumanLink/Usuario/5
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            // Verifica si la clave está vacía
            if (string.IsNullOrWhiteSpace(usuario.Clave))
            {
                return BadRequest("La clave no puede estar vacía.");
            }

            // Verifica que el ID coincida
            if (id != usuario.Idusuario)
            {
                return BadRequest("El ID del usuario no coincide.");
            }

            // Encuentra el usuario existente en la base de datos
            var usuarioExistente = await _context.Usuarios.FindAsync(id);
            if (usuarioExistente == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            // Cifra la nueva clave
            usuarioExistente.Clave = _passwordHasher.Hash(usuario.Clave);

            // Actualiza el estado del usuario existente para que se guarden los cambios
            _context.Entry(usuarioExistente).State = EntityState.Modified;

            try
            {
                // Guarda los cambios en la base de datos
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
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

            // Retorna un estado 204 No Content si la operación fue exitosa
            return Ok("Usuario actualizado");
        }


        //Endpoint para añadir usuarios a la base de datos
        //Aquí tambien se encripta la contraseña antes de ser añadida a la base de datos
        // POST: HumanLink/Usuario
        [HttpPost]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            try
            {
                // Validar que el usuario no sea nulo
                if (usuario == null)
                {
                    return BadRequest("El usuario no puede ser nulo.");
                }

                // Validar que la contraseña no esté vacía
                if (string.IsNullOrEmpty(usuario.Clave))
                {
                    return BadRequest("La contraseña no puede estar vacía.");
                }

                // Hashear la contraseña
                try
                {
                    usuario.Clave = _passwordHasher.Hash(usuario.Clave);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Error al procesar la contraseña: " + ex);
                }

                // Guardar el usuario
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUsuario", new { id = usuario.Idusuario }, usuario);

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error interno del servidor al procesar la solicitud:" + ex);
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

        //Endpoint para eliminar un usuario de la base de datos
        // DELETE: HumanLink/Usuario/5
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminPolicy")] // Solo permite el consumo del endpoint a los usuarios logeados y con rol administrador
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario eliminado");
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.Idusuario == id);
        }
    }
}
