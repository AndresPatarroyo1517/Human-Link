using Human_Link_Web.Server;
using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;
using System.Text.Json;

public class IntegrationControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public IntegrationControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }


    [Fact]
    public async Task PostLogin_ValidUser_ReturnsOk()
    {
        var userLogin = new Login
        {
            Usuario = "jose123",
            Clave = "123",
            Recuerdame = false
        };

        var response = await _client.PostAsJsonAsync("/HumanLink/Login/login", userLogin);

        // Assert
        response.EnsureSuccessStatusCode();
        var jsonResponse = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.NotNull(jsonResponse);
        Assert.True(jsonResponse.TryGetProperty("usuario", out var usuario));
        Assert.Equal("jose123", usuario.GetString());
    }

    [Fact]
    public async Task PostLogin_InvalidUser_ReturnsNotFound()
    {
        var userLogin = new Login
        {
            Usuario = "jose456", // Usuario que no existe
            Clave = "456", // Clave incorrecta
            Recuerdame = false
        };

        var response = await _client.PostAsJsonAsync("/HumanLink/Login/login", userLogin);

        Assert.Equal(System.Net.HttpStatusCode.NotFound, response.StatusCode);
        var errorMessage = await response.Content.ReadAsStringAsync();
        Assert.Contains("Usuario y/o clave incorrectos", errorMessage);
    }

    [Fact]
    public async Task PostLogout_ReturnsOk()
    {

        var response = await _client.PostAsync("/HumanLink/Login/logout", null);

        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadAsStringAsync();
        Assert.Contains("Logout exitoso", result);
    }
}
