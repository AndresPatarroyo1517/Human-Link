using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
//importa herramientas para hacer las peticiones HTTP
using Microsoft.AspNetCore.Mvc;
//ORM de C#:
using Microsoft.EntityFrameworkCore;
//Importa clases de Models
using Human_Link_Web.Server.Models;

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
        public async Task<ActionResult<IEnumerable<Cursousuario>>> GetCursousuarios()
        {
            return await _context.Cursousuarios.ToListAsync();
        }

        // GET: HumanLink/CursoUsuario/5
        [HttpGet("{id}")]
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cursousuario>> PostCursousuario(Cursousuario cursousuario)
        {
            _context.Cursousuarios.Add(cursousuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCursousuario", new { id = cursousuario.Idcuremp }, cursousuario);
        }

        // DELETE: HumanLink/CursoUsuario/5
        [HttpDelete("{id}")]
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
