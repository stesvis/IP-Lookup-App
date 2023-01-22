using System.Net;
using ip_lookup_app.Resources;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Responses;
using Microsoft.AspNetCore.Mvc;

namespace ip_lookup_app.Controllers;

/// <summary>
/// Controller that handles the IP lookup
/// </summary>
[ApiController]
[Route("[controller]")]
public class LookupController : ControllerBase
{
    private readonly ILogger<LookupController> _logger;

    public LookupController(ILogger<LookupController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Returns the city info for each IP provided
    /// </summary>
    /// <param name="ips">List of IP addresses to lookup</param>
    /// <returns>List of city info</returns>
    [HttpPost("city-info")]
    public ActionResult<CityInfoResource> CityInfo([FromBody] IEnumerable<string> ips)
    {
        try
        {
            var response = new List<CityInfoResource>();

            using var reader = new DatabaseReader("./Data/GeoLite2-City.mmdb");

            // loop thru the IPS
            foreach (var value in ips)
            {
                // server side IP validation
                if (IPAddress.TryParse(value.Trim(), out IPAddress? validIP))
                {
                    // valid IP
                    var city = reader.City(validIP);

                    response.Add(new CityInfoResource
                    {
                        IPAddress = validIP.ToString(),

                        AccuracyRadius = city.Location.AccuracyRadius,
                        CityName = city.City.Name,
                        CountryCode = city.Country.IsoCode,
                        PostalCode = city.Postal.Code,
                        TimeZone = city.Location.TimeZone
                    });
                }
                else
                {
                    // invalid IP decided to not fail the request butto return an error instead
                    response.Add(new CityInfoResource
                    {
                        Error = "Invalid IP address",
                        IPAddress = value.Trim()
                    });
                }
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            // return error status code
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }
}