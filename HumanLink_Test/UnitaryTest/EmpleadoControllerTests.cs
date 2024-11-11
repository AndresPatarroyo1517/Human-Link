using Human_Link_Web.Server.Controllers;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HumanLink_UnitaryTest
{
    public class EmpleadoControllerTests
    {
        private readonly HumanLinkContext _context;
        private readonly EmpleadoController _controller;

        public EmpleadoControllerTests()
        {
            var options = new DbContextOptionsBuilder<HumanLinkContext>()
                  .UseInMemoryDatabase(databaseName: "HumanLinkEmpleado")
                  .Options;

            _context = new HumanLinkContext(options);
            _controller = new EmpleadoController(_context);
        }

        [Fact]
        public async Task GetEmpleados_ReturnsAllEmpleados()
        {
            await _controller.PostEmpleado(new Empleado { Idempleado = 3, Nombre = "Empleado 3", Cargo = "Desarrollador", Salario = 50000, Departamento = "IT", Fechacontratacion = DateOnly.FromDateTime(DateTime.Now), Fechaterminacioncontrato = null, EmpleadoUsuario = 1 });
            await _controller.PostEmpleado(new Empleado { Idempleado = 4, Nombre = "Empleado 4", Cargo = "Desarrollador", Salario = 50000, Departamento = "IT", Fechacontratacion = DateOnly.FromDateTime(DateTime.Now), Fechaterminacioncontrato = null, EmpleadoUsuario = 1 });

            var result = await _controller.GetEmpleados();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var empleados = Assert.IsAssignableFrom<IEnumerable<Empleado>>(okResult.Value);
            Assert.Equal(3, empleados.Count());
        }


        [Fact]
        public async Task GetEmpleado_ValidId_ReturnsEmpleado()
        {
            var empleado = new Empleado { Idempleado = 1, Nombre = "Empleado 1", Cargo = "Desarrollador", Salario = 50000, Departamento = "IT", Fechacontratacion = DateOnly.FromDateTime(DateTime.Now), Fechaterminacioncontrato = null, EmpleadoUsuario = 1 };
            await _controller.PostEmpleado(empleado);

            var result = await _controller.GetEmpleado(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedEmpleado = Assert.IsType<Empleado>(okResult.Value);
            Assert.Equal(empleado.Nombre, returnedEmpleado.Nombre);
        }


        [Fact]
        public async Task GetEmpleado_InvalidId_ReturnsNotFound()
        {
            var result = await _controller.GetEmpleado(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PostEmpleado_CreatesEmpleado()
        {
            var empleado = new Empleado { Idempleado = 5, Nombre = "Empleado 5", Cargo = "Desarrollador", Salario = 50000, Departamento = "IT", Fechacontratacion = DateOnly.FromDateTime(DateTime.Now), Fechaterminacioncontrato = null, EmpleadoUsuario = 1 };

            var result = await _controller.PostEmpleado(empleado);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdEmpleado = Assert.IsType<Empleado>(createdAtActionResult.Value);
            Assert.Equal(empleado.Idempleado, createdEmpleado.Idempleado);
        }



        [Fact]
        public async Task PutEmpleado_ValidId_UpdatesEmpleado()
        {
            var empleado = new Empleado { Idempleado = 6, Nombre = "Empleado 6", Cargo = "Desarrollador", Salario = 50000, Departamento = "IT", Fechacontratacion = DateOnly.FromDateTime(DateTime.Now), Fechaterminacioncontrato = null, EmpleadoUsuario = 1 };
            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();

            empleado.Nombre = "Empleado Actualizado";
            var result = await _controller.PutEmpleado(6, empleado);

            Assert.IsType<OkObjectResult>(result);
            var updatedEmpleado = await _context.Empleados.FindAsync(6);
            Assert.Equal("Empleado Actualizado", updatedEmpleado.Nombre);
        }


        [Fact]
        public async Task DeleteEmpleado_ValidId_RemovesEmpleado()
        {
            var empleado = new Empleado { Idempleado = 2, Nombre = "Empleado 2", Cargo = "Desarrollador", Salario = 50000, Departamento = "IT", Fechacontratacion = DateOnly.FromDateTime(DateTime.Now), Fechaterminacioncontrato = null, EmpleadoUsuario = 1 };
            await _controller.PostEmpleado(empleado);

            var result = await _controller.DeleteEmpleado(2);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task DeleteEmpleado_InvalidId_ReturnsNotFound()
        {
            var result = await _controller.DeleteEmpleado(99);
            Assert.IsType<NotFoundResult>(result);
        }
    }
}