using Human_Link_Web.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace Human_Link_Web.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HumanLinkController : ControllerBase
    {
        protected readonly ILogger<HumanLinkController> _logger;
        protected readonly HumanLinkContext _db;

        public HumanLinkController(ILogger<HumanLinkController> logger, HumanLinkContext db)
        {
            _logger = logger;
            _db = db;
        }
    }
}



