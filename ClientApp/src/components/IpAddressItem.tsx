import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

type IpAddressItemProps = {
  ip: string;
  onRemove: (ip: string) => void;
};

const IpAddressItem = ({ ip, onRemove }: IpAddressItemProps) => {
  return (
    <div className="flex flex-row items-center">
      <span className="w-32 italic font-semibold">{ip}</span>
      <FontAwesomeIcon
        className="cursor-pointer text-red-600"
        icon={faMinusCircle}
        onClick={() => onRemove(ip)}
      />
    </div>
  );
};

export default IpAddressItem;
