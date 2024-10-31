using Human_Link_Web.Server.Controllers;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HumanLink_UnitaryTest
{
    public class CursoControllerTests
    {
        private readonly CursoController _controller;
        private readonly HumanLinkContext _context;

        public CursoControllerTests()
        {
            var options = new DbContextOptionsBuilder<HumanLinkContext>()
                .UseInMemoryDatabase(databaseName: "HumanLinkCurso")
                .Options;

            _context = new HumanLinkContext(options);
            _controller = new CursoController(_context);
        }

        [Fact]
        public async Task GetCursos_ReturnsOkResult_WithListOfCursos()
        {
            var cursos = new List<Curso>
        {
            new Curso { Idcurso = 3, Nombrecurso = "Curso 3" },
            new Curso { Idcurso = 4, Nombrecurso = "Curso 4" }
        };

            _context.Cursos.AddRange(cursos);
            await _context.SaveChangesAsync();

            var result = await _controller.GetCursos();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedCursos = Assert.IsAssignableFrom<IEnumerable<Curso>>(okResult.Value);
            Assert.Equal(4, returnedCursos.Count());
        }

        [Fact]
        public async Task GetCurso_ReturnsNotFound_WhenCursoDoesNotExist()
        {
            var result = await _controller.GetCurso(999); // ID que no existe

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutCurso_ReturnsNoContent_WhenUpdateIsSuccessful()
        {
            var curso = new Curso { Idcurso = 2, Nombrecurso = "Curso 2" };
            _context.Cursos.Add(curso);
            await _context.SaveChangesAsync();

            curso.Nombrecurso = "Curso Actualizado";
            var result = await _controller.PutCurso(2, curso);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PostCurso_ReturnsCreatedAtAction_WhenCursoIsAdded()
        {
            var curso = new Curso { Idcurso = 1, Nombrecurso = "Curso 1" };

            var result = await _controller.PostCurso(curso);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetCurso", createdResult.ActionName);
        }

        [Fact]
        public async Task DeleteCurso_ReturnsNoContent_WhenCursoIsDeleted()
        {
            var curso = new Curso { Idcurso = 5, Nombrecurso = "Curso 5" };
            _context.Cursos.Add(curso);
            await _context.SaveChangesAsync();

            var result = await _controller.DeleteCurso(5);

            Assert.IsType<NoContentResult>(result);
        }
    }
}