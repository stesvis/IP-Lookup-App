using ip_lookup_app.Controllers;
using ip_lookup_app.Resources;
using ip_lookup_app.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace ip_lookup_app.tests
{
    [TestFixture]
    public class LookupControllerTests
    {
        private readonly Mock<ILogger<LookupController>> _logger;
        private readonly ILookupService _lookupService;

        public LookupControllerTests()
        {
            _logger = new Mock<ILogger<LookupController>>();
            _lookupService = new LookupService();
        }

        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public void Test_CityLookup_With_Valid_IPs()
        {
            // Arrange
            var ips = new List<string>
            {
                "16.16.246.7",
                "203.118.180.21",
                "116.216.249.14",
                "179.118.61.203",
                "145.195.139.45",
                "72.90.45.45",
                "44.150.98.223",
                "91.111.133.196",
                "5.47.103.249",
                "33.137.198.58",
            };

            var controller = new LookupController(_logger.Object, _lookupService);
            var response = controller.LookupCityInfo(ips);
            var okObjectResult = response.Result as ObjectResult;

            // Assert
            Assert.IsNotNull(response);
            Assert.IsInstanceOf<OkObjectResult>(okObjectResult);
            Assert.IsInstanceOf<ActionResult<IEnumerable<CityInfoResource>>>(response);

            var items = okObjectResult?.Value as IEnumerable<CityInfoResource>;

            Assert.That(items?.Count(), Is.EqualTo(10)); // check that 10 items are returned
            Assert.IsFalse(items?.Any(x => x.Error != null)); // check that there are no errors returned
        }

        [Test]
        public void Test_CityLookup_With_Invalid_IPs()
        {
            var ips = new List<string>
            {
                "16.16.246.7",
                "203.118.180.21.200", // invalid
                "116.216.249.14",
                "179.118.61.203",
                "145.195.139.45",
                "72.90.45.450", // invalid
                "44.150.98.223",
                "91.111.133.196",
                "5.47.b.249", // invalid
                "33.137.198.58",
            };

            var controller = new LookupController(_logger.Object, _lookupService);
            var response = controller.LookupCityInfo(ips);
            var okObjectResult = response.Result as ObjectResult;

            // Assert
            Assert.IsNotNull(response);
            Assert.IsInstanceOf<OkObjectResult>(okObjectResult);
            Assert.IsInstanceOf<ActionResult<IEnumerable<CityInfoResource>>>(response);

            var items = okObjectResult?.Value as IEnumerable<CityInfoResource>;

            Assert.That(items?.Count(), Is.EqualTo(10)); // check that 10 items are returned
            Assert.IsTrue(items?.Where(x => x.Error != null).Count() == 3); // check that there are 3 errors returned
        }

        [Test]
        public void Test_CityLookup_With_Empty_Payload()
        {
            var controller = new LookupController(_logger.Object, _lookupService);
            var response = controller.LookupCityInfo(new List<string>());
            var okObjectResult = response.Result as ObjectResult;

            // Assert
            Assert.IsNotNull(response);
            Assert.IsInstanceOf<OkObjectResult>(okObjectResult);
            Assert.IsInstanceOf<ActionResult<IEnumerable<CityInfoResource>>>(response);

            var items = okObjectResult?.Value as IEnumerable<CityInfoResource>;

            Assert.That(items?.Count(), Is.EqualTo(0)); // check that 0 items are returned
        }

        [Test]
        public void Test_CityLookup_With_No_Payload()
        {
            var controller = new LookupController(_logger.Object, _lookupService);
            var response = controller.LookupCityInfo(null);
            var errorObjectResult = response.Result as ObjectResult;

            // Assert
            Assert.IsNotNull(response);
            Assert.IsInstanceOf<BadRequestObjectResult>(errorObjectResult);
            Assert.That(errorObjectResult?.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
        }
    }
}