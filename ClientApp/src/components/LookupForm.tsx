import { Button, Form, InputGroup } from "react-bootstrap";
import React, { useState } from "react";
import { faPlusCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IpAddressItem from "./IpAddressItem";
import { debounce } from "lodash";

const regexExp =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

type LookupFormProps = {
  busy?: boolean;
  onSubmit?: (ipAddresses: string[]) => void;
};

const LookupForm = ({ busy, onSubmit }: LookupFormProps) => {
  const [inputValue, setInputValue] = useState("");
  const [ipAddresses, setIpAddresses] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  /**
   * Adds IPs to the list
   * @param text
   */
  const handleAddIp = (text: string) => {
    // at this point the IPs should already be validated
    let newIps = ipAddresses;
    const ips = text.split(",");
    // parse the IPs and add them to the list (if new)
    ips?.forEach((ip) => {
      ip = ip.trim();

      if (!ip || ipAddresses.includes(ip)) return;
      newIps = [...newIps, ip];
    });

    setIpAddresses(newIps);
    setInputValue("");
    setIsValid(false);
  };

  /**
   * Removes IP from the list
   * @param text
   */
  const handleRemoveIp = (ip: string) => {
    // remove this IP from the list
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
   * Delayed validation, provides realtime feedback
   * @param text
   */
  const handleTextChangeWithDebounce = (text: string) => {
    let isValid = true;
    const ips = text.split(",");
    // make sure that every IP is valid as you type
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
    // trigger delayed validation
    debounceFunc(text);
  };

  /**
   * Removes all the ip addresses
   */
  const handleReset = () => {
    setIpAddresses([]);
    setIsValid(false);
    setInputValue("");
  };

  /**
   * Submits the form
   * @param e
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) onSubmit(ipAddresses);
  };

  return (
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
            placeholder="Enter valid IPv4 addresses"
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
  );
};

export default LookupForm;
