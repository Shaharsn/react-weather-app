import { Autocomplete, Card, IconButton, TextField } from "@mui/material";
import { CITIES } from "../cities";
import { City } from "../types/types";

interface IHeaderProps {
  cityList: City[];
  unit: string;
  addCity: (cityToAdd: string) => void;
  setUnit: () => void;
}

const Header = (props: IHeaderProps) => {
  const { cityList, unit, addCity, setUnit } = props;

  const optionalCites = CITIES.filter((cityLabel) => {
    return !cityList.find((city) => city.name === cityLabel.label);
  });

  const addCityToList = (event: any, city: string | null) => {
    if ((event.type === "click" || event.type === "keydown") && city !== null) {
      addCity(city);
    }
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
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={optionalCites}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="City" />}
        onInputChange={(event: any, newValue: string | null) => {
          addCityToList(event, newValue);
        }}
      />
      <IconButton sx={{marginLeft: 3, paddingLeft: 3, paddingRight: 3}} onClick={() => setUnit()}>{unit}</IconButton>
    </Card>
  );
};
export default Header;
