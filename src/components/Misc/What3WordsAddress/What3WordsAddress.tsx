type What3wordsAddressProps = {
  address: string;
};

const What3wordsAddress = ({ address }: What3wordsAddressProps) => (
  <h3 className="w3w-address">
    <b className="w3w-address-logo">{"///"}</b>
    <b className="w3w-address-value">{address}</b>
  </h3>
);

export default What3wordsAddress;
