using Human_Link_Web.Server.Controllers;
using Human_Link_Web.Server.Custom;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Human_Link_Web.Server.Controllers.UsuarioController;

namespace HumanLink_UnitaryTest
{
    public class UsuarioControllerTests
    {
        private readonly HumanLinkContext _context;
        private readonly UsuarioController _controller;
        private readonly PasswordHasher _passwordHasher;

        public UsuarioControllerTests()
        {
            var options = new DbContextOptionsBuilder<HumanLinkContext>()
                  .UseInMemoryDatabase(databaseName: "HumanLinkUsuarios")
                  .Options;

            _context = new HumanLinkContext(options);
            _passwordHasher = new PasswordHasher();
            _controller = new UsuarioController(_context, _passwordHasher);
        }

        [Fact]
        public async Task GetUsuarios_ReturnsAllUsuarios()
        {
            _context.Usuarios.AddRange(
                 new Usuario { Idusuario = 1, Usuario1 = "user1", Correo = "user1@email.com", Isadmin = true, Isemailverified = true },
                 new Usuario { Idusuario = 2, Usuario1 = "user2", Correo = "user2@email.com", Isadmin = false, Isemailverified = false }
             );
            await _context.SaveChangesAsync();

            var result = await _controller.GetUsuarios();

            var actionResult = Assert.IsType<ActionResult<IEnumerable<UsuarioDto>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var usuarios = Assert.IsType<List<UsuarioDto>>(okResult.Value);
            Assert.Equal(3, usuarios.Count);
        }

        [Fact]
        public async Task GetUsuario_ReturnsNotFound_ForInvalidId()
        {
            var result = await _controller.GetUsuarioById(99);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutUsuario_ReturnsNoContent_WhenUpdated()
        {
            var existingUser = new Usuario { Idusuario = 3, Clave = "password" };
            await _controller.PostUsuario(existingUser);

            var updatedUser = new UsuarioUnique { IdUsuario = 3, Clave = "newPassword" };

            var result = await _controller.PutUsuario(3, updatedUser);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task PostUsuario_ReturnsCreatedAtAction_WhenUserIsCreated()
        {
            var newUser = new Usuario { Idusuario = 4, Clave = "newPassword" };

            var result = await _controller.PostUsuario(newUser);

            var actionResult = Assert.IsType<ActionResult<Usuario>>(result);
            var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            Assert.Equal("GetUsuario", createdResult.ActionName);
        }

        [Fact]
        public async Task DeleteUsuario_ReturnsNoContent_WhenDeleted()
        {
            var existingUser = new Usuario { Idusuario = 5, Clave = "password" };
            _context.Usuarios.Add(existingUser);
            await _context.SaveChangesAsync();

            var result = await _controller.DeleteUsuario(5);

            Assert.IsType<OkObjectResult>(result);
        }

    }
}
