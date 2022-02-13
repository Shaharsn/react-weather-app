import { Card, CardContent } from "@mui/material";
import { useEffect } from "react";
import { useGetCityByName } from "../graphQL/wether";
import CitiesTable from "./CitiesTable";
import Header from "./Header";
import CityInfo from "./CityInfo";
import { useStoreContext } from "../store/WeatherHook";
import {
  addCity,
  changeUnit,
  removeCity,
  selectCity,
} from "../store/weatherReducer";

const Main = () => {
  const { state, dispatch } = useStoreContext();
  const [getCityWeather] = useGetCityByName("");

  console.log(state);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?${lat}&${lon}&localityLanguage=en`
        )
          .then((response) => {
            return response.json();
          })
          .then((payload) => {
            if (!state.cities.find((city) => city.name === payload.city)) {
              addCityToList(payload.city, true);
            }
          });
      },
      (err) => {
        addCityToList("Tel Aviv", true);
      }
    );
  }, []);

  const removeCityFromList = (cityId: string) => {
    dispatch(removeCity(cityId));
  };

  const addCityToList = (cityToAdd: string, selectTheCity: boolean) => {
    getCityWeather({ variables: { name: cityToAdd } }).then((res) => {
      if (res && res.data && res.data?.getCityByName) {
        dispatch(addCity(res.data.getCityByName));

        if(selectTheCity) {
          dispatch(selectCity(res.data.getCityByName.id));
        }
      }
    });
  };

  return (
    <Card sx={{ maxWidth: 1500, marginTop: 5 }}>
      <CardContent>
        <Header
          cityList={state.cities}
          unit={state.unit}
          addCity={addCityToList}
          setUnit={() => dispatch(changeUnit())}
        />
        <br />

        <CitiesTable cities={state.cities} removeCity={removeCityFromList} />
        <br />
        {state.selectedCity && (
          <CityInfo
            city={state.cities.find((city) => city.id === state.selectedCity)}
            unit={state.unit}
          />
        )}
      </CardContent>
    </Card>
  );
};
export default Main;
