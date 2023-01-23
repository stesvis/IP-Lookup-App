using System.Text.RegularExpressions;
using ip_lookup_app.Resources;
using MaxMind.GeoIP2;
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
    private readonly string _ipRegex = @"^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";

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
    public ActionResult<IEnumerable<CityInfoResource>> LookupCityInfo([FromBody] IEnumerable<string> ips)
    {
        try
        {
            var response = new List<CityInfoResource>();

            using var reader = new DatabaseReader("./Data/GeoLite2-City.mmdb");
            //using var reader = new DatabaseReader(Path.Combine(_environment.ContentRootPath, "Data/GeoLite2-City.mmdb"));

            // loop thru the IPS
            foreach (var value in ips)
            {
                // sanitize
                var ip = value.Trim();
                var cityInfo = FetchCityInfoByIP(ip, reader);

                response.Add(cityInfo);
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);

            // return error status code
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
        }
    }

    private CityInfoResource FetchCityInfoByIP(string ip, DatabaseReader reader)
    {
        // server side IP validation
        if (Regex.Match(ip, _ipRegex).Success)
        {
            // valid IP
            var city = reader.City(ip);

            return new CityInfoResource
            {
                IPAddress = ip,

                AccuracyRadius = city.Location.AccuracyRadius,
                CityName = city.City.Name,
                CountryCode = city.Country.IsoCode,
                PostalCode = city.Postal.Code,
                TimeZone = city.Location.TimeZone
            };
        }

        // invalid IP decided to not fail the request butto return an error instead
        return new CityInfoResource
        {
            Error = "Invalid IP address",
            IPAddress = ip
        };
    }
}