using ip_lookup_app.Resources;

namespace ip_lookup_app.Services
{
    public interface ILookupService
    {
        IEnumerable<CityInfoResource> GetCityInfosByIPs(IEnumerable<string> ips);
    }
}