using Human_Link_Web.Server.Controllers;
using Human_Link_Web.Server.Custom;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace HumanLink_UnitaryTest
{
    public class LoginControllerTests
    {
        private readonly Mock<HumanLinkContext> _mockContext;
        private readonly Mock<HttpContext> _mockHttpContext;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly LoginController _controller;

        public LoginControllerTests()
        {
            _mockContext = new Mock<HumanLinkContext>();

            _mockHttpContext = new Mock<HttpContext>();
            var responseCookiesMock = new Mock<IResponseCookies>();
            _mockHttpContext.Setup(x => x.Response.Cookies).Returns(responseCookiesMock.Object);
            _mockHttpContext.Setup(x => x.Response).Returns(new DefaultHttpContext().Response);

            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration.Setup(c => c["Jwt:key"]).Returns("thi_is_a_very_secure_key_12345678"); //Tiene que ser una cadena de 32 bits, por el método de encriptación HS256

            var utilidades = new Utilidades(_mockConfiguration.Object);

            _controller = new LoginController(_mockContext.Object, utilidades, new PasswordHasher())
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = _mockHttpContext.Object
                }
            };

        }

        [Fact]
        public async Task PostLogin_UserNotFound_ReturnsNotFound()
        {
            var userLogin = new Login { Usuario = "jose456", Clave = "123" };
            _mockContext.Setup(c => c.Usuarios).ReturnsDbSet(new List<Usuario>());

            var result = await _controller.PostLogin(userLogin);

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Usuario y/o clave incorrectos", notFoundResult.Value);
            Assert.Equal((int)HttpStatusCode.NotFound, notFoundResult.StatusCode);
        }

        [Fact]
        public async Task PostLogin_InvalidPassword_ReturnsNotFound()
        {
            var userLogin = new Login { Usuario = "jose123", Clave = "456" };
            var user = new Usuario { Usuario1 = "jose123", Clave = "tksG25ZwVpihuAgtF4/sMg==$+plr9VCZTKRL3dpzIZRF9ssrH6GhBjwBFVeMWZtqf4A=" };
            _mockContext.Setup(c => c.Usuarios)
                .ReturnsDbSet(new List<Usuario> { user });

            var result = await _controller.PostLogin(userLogin);

            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Usuario y/o clave incorrectos", notFoundResult.Value);
            Assert.Equal((int)HttpStatusCode.NotFound, notFoundResult.StatusCode);
        }


        [Fact]
        public async Task PostLogin_ValidCredentials_ReturnsOk()
        {
            var userLogin = new Login { Usuario = "jose123", Clave = "123", Recuerdame = true };
            var user = new Usuario { Usuario1 = "jose123", Clave = "CJHzyzs7mOgBH4mCpxJW1w==$b3T6pBT11CvzpB/fyntnes9CUrVip9e/2gYXIPqJVeA=", Isadmin = true, Idusuario = 1 };
            _mockContext.Setup(c => c.Usuarios)
                .ReturnsDbSet(new List<Usuario> { user });

            var result = await _controller.PostLogin(userLogin);
            var okResult = Assert.IsType<OkObjectResult>(result);

            var response = JObject.FromObject(okResult.Value);
            Assert.Equal("jose123", response["usuario"].ToString());
        }


        [Fact]
        public void Logout_ReturnsOk()
        {
            var result = _controller.Logout();

            var okResult = Assert.IsType<OkObjectResult>(result);
        }
    }
}

