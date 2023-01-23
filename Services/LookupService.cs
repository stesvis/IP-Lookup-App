using System.Text.RegularExpressions;
using ip_lookup_app.Resources;
using MaxMind.GeoIP2;
using Microsoft.Extensions.Hosting;

namespace ip_lookup_app.Services
{
    public class LookupService : ILookupService
    {
        private readonly string _ipRegex = @"^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";

        public IEnumerable<CityInfoResource> GetCityInfosByIPs(IEnumerable<string> ips)
        {
            var result = new List<CityInfoResource>();
            using var reader = new DatabaseReader("./Data/GeoLite2-City.mmdb");

            // loop thru the IPS
            foreach (var value in ips)
            {
                // sanitize
                var ip = value.Trim();
                var cityInfo = FetchCityInfoByIP(ip, reader);

                result.Add(cityInfo);
            }

            return result;
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
}