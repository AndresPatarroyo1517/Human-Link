using Human_Link_Web.Server.Controllers;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HumanLink_UnitaryTest
{
    public class NominaControllerTests
    {
        private readonly HumanLinkContext _context;
        private readonly NominaController _controller;

        public NominaControllerTests()
        {
            var options = new DbContextOptionsBuilder<HumanLinkContext>()
                .UseInMemoryDatabase(databaseName: "HumanLinkNomina")
                .Options;

            _context = new HumanLinkContext(options);
            _controller = new NominaController(_context);
        }

        [Fact]
        public async Task GetNominas_ReturnsAllNominas()
        {
            var nominas = new Nomina { Idnomina = 1 };
            await _controller.PostNomina(nominas);

            var result = await _controller.GetNominas();

            var actionResult = Assert.IsType<ActionResult<IEnumerable<Nomina>>>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<Nomina>>(actionResult.Value);
            Assert.Equal(3, returnValue.Count());
        }

        [Fact]
        public async Task GetNomina_ReturnsNotFound_WhenNominaDoesNotExist()
        {
            var result = await _controller.GetNomina(99);

            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetNomina_ReturnsNomina_WhenNominaExists()
        {
            var nomina = new Nomina { Idnomina = 2, Horasextra = 4564 };
            await _controller.PostNomina(nomina);

            var result = await _controller.GetNomina(2);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedNomina = Assert.IsType<Nomina>(okResult.Value);
            Assert.Equal(nomina.Idnomina, returnedNomina.Idnomina);
        }

        [Fact]
        public async Task PostNomina_CreatesNomina()
        {
            var newNomina = new Nomina { Idnomina = 3 };

            var result = await _controller.PostNomina(newNomina);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetNomina", actionResult.ActionName);
        }

        [Fact]
        public async Task PutNomina_UpdatesExistingNomina()
        {
            var existingNomina = new Nomina { Idnomina = 4, Bonificacion = 14 };
            await _controller.PostNomina(existingNomina);

            var updatedNomina = new Nomina { Idnomina = 4, Bonificacion = 16 };

            var result = await _controller.PutNomina(4, updatedNomina);

            Assert.IsType<OkObjectResult>(result);
        }
    }
}
