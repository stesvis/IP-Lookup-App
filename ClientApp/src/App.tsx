import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { Button, Form } from "react-bootstrap";
import { Col, InputGroup, Row } from "reactstrap";
import React, { useState } from "react";
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

import CityInfo from "./types/CityInfo";
import CityInfoItem from "./components/CityInfoItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IpAddressItem from "./components/IpAddressItem";
import { ToastContainer } from "react-toastify";
import { debounce } from "lodash";
import httpService from "./services/httpService";
import { toast } from "react-toastify";

const regexExp =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [ipAddresses, setIpAddresses] = useState<string[]>([]);
  const [cityInfos, setCityInfos] = useState<CityInfo[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [busy, setBusy] = useState(false);

  /**
   * Adds IPs to the list
   * @param text
   */
  const handleAddIp = (text: string) => {
    let newIps = ipAddresses;
    const ips = text.split(",");

    ips?.forEach((ip) => {
      ip = ip.trim();

      if (!ip || ipAddresses.includes(ip)) return;
      newIps = [...newIps, ip];
    });
    setIpAddresses(newIps);
    setInputValue("");
  };

  /**
   * Removes IP from the list
   * @param text
   */
  const handleRemoveIp = (ip: string) => {
    setIpAddresses(ipAddresses?.filter((x) => x !== ip));
  };

  /**
   * Adds IPs on ENTER
   * @param e
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid) {
      e.preventDefault();
      handleAddIp(inputValue);
    }
  };

  /**
   * Delayed validation
   * @param text
   */
  const handleTextChangeWithDebounce = (text: string) => {
    let isValid = true;
    const ips = text.split(",");

    ips?.forEach((ip) => {
      ip = ip.trim();
      if (!!ip) isValid = isValid && regexExp.test(ip);
    });

    setIsValid(isValid);
  };

  const debounceFunc = debounce(handleTextChangeWithDebounce, 500);

  const handleTextChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const text = target.value;
    setInputValue(text);
    debounceFunc(text);
  };

  /**
   * Submits the form
   * @param e
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // reset the results
      setCityInfos([]);

      setBusy(true);
      // consume API
      const response = await httpService.post("lookup/city-info", ipAddresses);
      if (!response) toast.error("Oops! Could not perform the lookup.");
      setCityInfos(response?.data);
    } catch (err) {
      alert(1);
      toast.error("Oops! Could not perform the lookup.");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setIpAddresses([]);
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-semibold h-full text-center mb-10">
        IP Lookup App
      </h1>

      <Row>
        <Col className="mb-5" md={4}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="font-medium" htmlFor="ipAddresses">
                IP Addresses
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  className={isValid ? undefined : "!text-red-600"}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  name="ipAddresses"
                  placeholder="Enter valid IP addresses"
                  value={inputValue}
                />
                <Button
                  disabled={!isValid || busy}
                  onClick={() => handleAddIp(inputValue)}
                  variant="secondary">
                  <FontAwesomeIcon icon={faPlusCircle} />
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Comma separated values. You can also press ENTER to add.
              </Form.Text>
            </Form.Group>

            {ipAddresses?.map((ipAddress, index) => (
              <IpAddressItem
                key={`ip-${index}`}
                ip={ipAddress}
                onRemove={handleRemoveIp}
              />
            ))}

            <div className="flex flex-row gap-1">
              <Button
                className="mt-3 w-20"
                disabled={ipAddresses?.length === 0 || busy}
                onClick={handleSubmit}
                variant="primary"
                type="submit">
                {(!busy && "Lookup") || <FontAwesomeIcon icon={faSpinner} />}
              </Button>
              <Button
                className="btn-link mt-3 w-20 text-decoration-none"
                disabled={busy}
                onClick={handleReset}
                variant="tertiary"
                type="reset">
                Reset
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={2} />
        <Col>
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
