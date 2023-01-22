import { Card } from "react-bootstrap";
import CityInfo from "../types/CityInfo";
import DetailsRow from "./DetailsRow";
import React from "react";

type CityInfoItemProps = {
  info: CityInfo;
};

const CityInfoItem = ({ info }: CityInfoItemProps) => {
  return (
    <Card className="p-2 w-1/2 m-2">
      <h4 className="text-center mb-3">{info.ipAddress}</h4>
      {(!info.error && (
        <>
          <DetailsRow
            className="bg-slate-100"
            label="Country Code"
            value={info.countryCode}
          />
          <DetailsRow label="Postal Code" value={info.postalCode} />
          <DetailsRow
            className="bg-slate-100"
            label="City Name"
            value={info.cityName}
          />
          <DetailsRow label="Time Zone" value={info.timeZone} />
          <DetailsRow
            className="bg-slate-100"
            label="Accuracy Radius"
            value={info.accuracyRadius}
          />
        </>
      )) || <span className="text-center text-red-600">{info.error}</span>}
    </Card>
  );
};

export default CityInfoItem;
