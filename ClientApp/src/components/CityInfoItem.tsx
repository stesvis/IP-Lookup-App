import { Card } from "react-bootstrap";
import CityInfo from "../types/CityInfo";
import DetailsRow from "./DetailsRow";

type CityInfoItemProps = {
  className?: string;
  info: CityInfo;
};

const CityInfoItem = ({ className, info }: CityInfoItemProps) => {
  return (
    <Card className={`p-2 my-2 ${className}`}>
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
