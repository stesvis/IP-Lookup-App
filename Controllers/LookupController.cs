using ip_lookup_app.Resources;
using ip_lookup_app.Services;
using Microsoft.AspNetCore.Mvc;

namespace ip_lookup_app.Controllers;

/// <summary>
/// Controller that handles the IP lookup
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class LookupController : ControllerBase
{
    private readonly ILogger<LookupController> _logger;
    private readonly ILookupService _lookupService;

    public LookupController(ILogger<LookupController> logger, ILookupService lookupService)
    {
        _logger = logger;
        _lookupService = lookupService;
    }

    /// <summary>
    /// Returns the city info for each IP provided
    /// </summary>
    /// <param name="ips">List of IP addresses to lookup</param>
    /// <returns>List of city info</returns>
    [HttpPost("city-info")]
    public ActionResult<IEnumerable<CityInfoResource>> LookupCityInfo([FromBody] IEnumerable<string>? ips)
    {
        try
        {
            if (ips == null)
            {
                return BadRequest("No IPs provided");
            }

            if (!ips.Any())
            {
                return Ok(new List<CityInfoResource>());
            }

            var response = _lookupService.GetCityInfosByIPs(ips);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);

            // return error status code
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
        }
    }
}