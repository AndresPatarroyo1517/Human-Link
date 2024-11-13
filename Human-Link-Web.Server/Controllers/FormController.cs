using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Human_Link_Web.Server.Controllers
{
    [Route("HumanLink/[controller]")]
    [ApiController]
    public class FormController : ControllerBase
    {
        private readonly HumanLinkContext _context;
        private readonly HttpClient _httpClient;

        public FormController(HumanLinkContext context, HttpClient httpClient)
        {
            this._context = context;
            this._httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetRespuestas()
        {
            var url = "https://script.google.com/macros/s/AKfycbwFZDpEVlFt6EfRxF0z04JE6MlI1j0LUqLI1lVjK-2Y2PpLQRor5t-nmLrfUxRmKl76/exec";
            var response = await _httpClient.GetStringAsync(url);
            return Ok(response);
        }

    }
}
