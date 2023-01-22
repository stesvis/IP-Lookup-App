import "bootstrap/dist/css/bootstrap.min.css";

import { Button, Container, Form } from "react-bootstrap";
import { Col, InputGroup, Row } from "reactstrap";
import React, { useState } from "react";

import { FetchData } from "./components/FetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IpAddressItem from "./components/IpAddressItem";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const regexExp =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function App() {
  const [text, setText] = useState("");
  const [ipAddresses, setIpAddresses] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const handleAddIp = () => {
    setIpAddresses([...ipAddresses, text]);
  };

  const handleRemoveIp = (ip: string) => {
    setIpAddresses(ipAddresses?.filter((x) => x !== ip));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid) {
      handleAddIp();
    }
  };

  const handleTextChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const text = target.value;
    setText(text);

    console.log("isValid", regexExp.test(text.trim()));

    setIsValid(regexExp.test(text.trim()));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const lookup = async (ip: string) => {};

  return (
    <div className="App">
      <h1 className="text-3xl font-bold h-full text-center">IP Lookup App</h1>

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
                  placeholder="Enter a valid IP address"
                  value={text}
                />
                <Button disabled={!isValid} onClick={handleAddIp}>
                  <FontAwesomeIcon icon={faPlusCircle} />
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                You can also press ENTER to add.
              </Form.Text>
            </Form.Group>

            {ipAddresses?.map((ipAddress, index) => (
              <IpAddressItem
                key={`ip-${index}`}
                ip={ipAddress}
                onRemove={handleRemoveIp}
              />
            ))}

            <Button
              className="mt-3"
              disabled={ipAddresses?.length === 0}
              onClick={handleSubmit}
              variant="primary"
              type="submit">
              Lookup
            </Button>
          </Form>
        </Col>
        <Col md={2} />
        <Col>
          <h2>Results</h2>
          {ipAddresses?.map((ipAddress, index) => (
            <div key={`ip-${index}`}>
              <span>{ipAddress}</span>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default App;
