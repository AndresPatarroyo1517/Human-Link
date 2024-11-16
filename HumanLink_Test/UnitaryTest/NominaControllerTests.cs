using Human_Link_Web.Server.Controllers;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static Human_Link_Web.Server.Controllers.NominaController;

namespace HumanLink_UnitaryTest
{
    public class NominaControllerTests
    {
        private readonly HumanLinkContext _context;
        private readonly NominaController _controller;
        private readonly DefaultHttpContext _httpContext;

        public NominaControllerTests()
        {
            var options = new DbContextOptionsBuilder<HumanLinkContext>()
                .UseInMemoryDatabase(databaseName: "HumanLinkNomina")
                .Options;

            _context = new HumanLinkContext(options);
            _httpContext = new DefaultHttpContext();
            var claims = new List<Claim>
            {
            new Claim(ClaimTypes.NameIdentifier, "2")
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _httpContext.User = principal;
            _controller = new NominaController(_context)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = _httpContext
                }
            };
        }

        [Fact]
        public async Task GetNominas_ReturnsAllNominas()
        {
            var nominas = new Nomina { Idnomina = 1 };
            await _controller.PostNomina(nominas);

            var result = await _controller.GetNominas();

            var actionResult = Assert.IsType<ActionResult<IEnumerable<Nomina>>>(result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<Nomina>>(actionResult.Value);
            Assert.Equal(6, returnValue.Count());
        }

        [Fact]
        public async Task GetNomina_ReturnsNotFound_WhenNominaDoesNotExist()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "99")
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var principal = new ClaimsPrincipal(identity);
            _httpContext.User = principal;
            var usuarioId = 99;
            var nomina = await _context.Nominas.FirstOrDefaultAsync(n => n.Idnomina == usuarioId);
            Assert.Null(nomina);
            var result = await _controller.GetNomina();


            var notFoundResult = Assert.IsType<NotFoundResult>(result.Result);
            Assert.Equal(404, notFoundResult.StatusCode);
        }


        [Fact]
        public async Task GetNomina_ReturnsNomina_WhenNominaExists()
        {
            var nomina = new Nomina { Idnomina = 2, Horasextra = 4564 };
            await _controller.PostNomina(nomina);

            var result = await _controller.GetNomina();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedNomina = Assert.IsType<Nomina>(okResult.Value);
            Assert.Equal(nomina.Idnomina, returnedNomina.Idnomina);
        }

        [Fact]
        public async Task PostNomina_CreatesNomina()
        {
            var newNomina = new Nomina { Idnomina = 9 };

            var result = await _controller.PostNomina(newNomina);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetNomina", actionResult.ActionName);
        }

        [Fact]
        public async Task PutNomina_UpdatesExistingNomina()
        {
            var existingNomina = new Nomina { Idnomina = 10, Bonificacion = 14 };
            await _controller.PostNomina(existingNomina);

            var updatedNomina = new Nomina { Idnomina = 10, Bonificacion = 16 };

            var result = await _controller.PutNomina(10, updatedNomina);

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetMetricasNomina_ReturnsCorrectMetrics()
        {
            _context.Nominas.Add(new Nomina
            {
                Totalnomina = 1000,
                Bonificacion = 200,
                Horasextra = 10
            });
            _context.Nominas.Add(new Nomina
            {
                Totalnomina = 1200,
                Bonificacion = 0,
                Horasextra = 5
            });
            _context.Nominas.Add(new Nomina
            {
                Totalnomina = 1500,
                Bonificacion = 500,
                Horasextra = 15
            });
            await _context.SaveChangesAsync();

            var result = await _controller.GetMetricasNomina();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<NominaMetricsResponse>(okResult.Value);

            Assert.Equal(3700, response.TotalNomina);
            Assert.Equal(700, response.TotalBonificacion);
            Assert.Equal(1148.5, (double)response.PromedioHorasExtras);
            Assert.Equal(25, (double)response.PorcentajeEmpleadosSinBonificacion, 2);
            Assert.Equal(50, (double)response.PorcentajeEmpleadosConBonificacion, 2);
            Assert.Equal(0, (double)response.PorcentajeEmpleadosSinHorasExtras, 2);
            Assert.Equal(100, (double)response.PorcentajeEmpleadosConHorasExtras, 2);
        }
    }
}
