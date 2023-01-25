import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { Col, Row } from "reactstrap";

import CityInfo from "./types/CityInfo";
import CityInfoItem from "./components/CityInfoItem";
import LookupForm from "./components/LookupForm";
import { ToastContainer } from "react-toastify";
import httpService from "./services/httpService";
import { toast } from "react-toastify";
import { useState } from "react";

function App() {
  const [cityInfos, setCityInfos] = useState<CityInfo[]>([]);
  const [busy, setBusy] = useState(false);

  /**
   * Submits the form
   * @param e
   */
  const handleSubmit = async (ipAddresses: string[]) => {
    try {
      setBusy(true);
      // reset the results
      setCityInfos([]);
      // consume API
      const response = await httpService.post("lookup/city-info", ipAddresses);
      if (!response) return toast.error("Oops! Could not perform the lookup.");
      // set the results
      setCityInfos(response?.data);
    } catch (err) {
      toast.error("Oops! Could not perform the lookup.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-semibold h-full text-center bg-white border rounded-md mb-10 py-2">
        IP Lookup App
      </h1>

      <Row>
        <Col className="mb-5" md={6}>
          <LookupForm busy={busy} onSubmit={handleSubmit} />
        </Col>
        <Col className="mt-4" md={6} lg={6} xxl={4}>
          {cityInfos?.map((info, index) => (
            <CityInfoItem key={`city-info-${index}`} info={info} />
          ))}
        </Col>
      </Row>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
