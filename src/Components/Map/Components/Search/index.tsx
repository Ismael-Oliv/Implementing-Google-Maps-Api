import React, { useCallback } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import "@reach/combobox/styles.css";

interface IpanToData {
  lat: number;
  lng: number;
}

interface IProps {
  panTo: ({ lat, lng }: IpanToData) => void;
}

const Search: React.FC<IProps> = ({ panTo }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => -23.52102, lng: () => -46.37928 },
      radius: 200 * 1000,
    },
  });

  const onClick = useCallback(
    async (address) => {
      setValue(address, false);
      clearSuggestions();

      try {
        const results = await getGeocode({ address });

        const { lat, lng } = await getLatLng(results[0]);
        panTo({ lat, lng });
      } catch (error) {
        console.log("Vish, deu erro ao pegar latitude e longetude", error);
      }
    },
    [panTo, setValue, clearSuggestions]
  );

  return (
    <Combobox onSelect={onClick}>
      <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Enter an address"
      />

      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ id, description }) => (
              <ComboboxOption key={id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default Search;
