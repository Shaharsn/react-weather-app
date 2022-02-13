import { Autocomplete, Card, IconButton, TextField } from "@mui/material";
import { City } from "../types/types";
import { useRef, useState } from "react";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

interface IHeaderProps {
  cityList: City[];
  unit: string;
  addCity: (cityToAdd: string, selectCity: boolean) => void;
  setUnit: () => void;
}

const Header = (props: IHeaderProps) => {
  const { cityList, unit, addCity, setUnit } = props;

  const [optionalCities, setOptionalCities] = useState<string[]>([]);
  const country = useRef<HTMLInputElement | null>(null);

  const addCityToList = (event: any, city: string | null) => {
    if ((event.type === "click" || event.type === "keydown") && city !== null) {
      addCity(city, false);
    }
  };

  const getCitiesByCountryName = () => {
    const countryName = country.current?.value;

    fetch(
      "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          limit: 50,
          order: "asc",
          orderBy: "name",
          country: countryName,
        }),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((payload) => {
        const cities: string[] = [];
        payload.data.forEach((element: any) => {
          cities.push(element.city);
        });

        setOptionalCities(
          cities.filter((cityLabel) => {
            return !cityList.find((city) => city.name === cityLabel);
          })
        );
      });
  };

  return (
    <Card
      sx={{
        paddingTop: 2,
        paddingBottom: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <TextField
        id="country"
        label="Country"
        type="text"
        size="medium"
        inputRef={country}
        onKeyDown={(event) => {
          if (event.code === "NumpadEnter" || event.code === "Enter")
            getCitiesByCountryName();
        }}
      />
      <IconButton
        onClick={() => getCitiesByCountryName()}
        sx={{ paddingLeft: 3, paddingRight: 3 }}
      >
        <TravelExploreIcon />
      </IconButton>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={optionalCities}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="City" />}
        onInputChange={(event: any, newValue: string | null) => {
          addCityToList(event, newValue);
        }}
      />
      <IconButton
        sx={{ marginLeft: 3, paddingLeft: 3, paddingRight: 3 }}
        onClick={() => setUnit()}
      >
        {unit}
      </IconButton>
    </Card>
  );
};
export default Header;
