import { Card, CardContent } from "@mui/material";
import { useEffect } from "react";
import { useGetCityByName } from "../graphQL/wether";
import CitiesTable from "./CitiesTable";
import Header from "./Header";
import { useAppDispatch, useAppSelector } from "../store/hooks/storeHooks";
import {
  state,
  selectCity,
  addCity,
  removeCity,
  changeUnit,
} from "../store/slices/weatherSlice";
import CityInfo from "./CityInfo";

const Main = () => {
  const weatherState = useAppSelector(state);
  const dispatch = useAppDispatch();

  
  const [getCityWeather] = useGetCityByName("");

  useEffect(() => {
    console.log("here");

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
            if (
              !weatherState.cities.find((city) => city.name === payload.city)
            ) {
              getCityWeather({ variables: { name: payload.city } }).then(
                (res) => {
                  if (res && res.data && res.data?.getCityByName) {
                    dispatch(selectCity(res.data.getCityByName));
                    dispatch(addCity(res.data.getCityByName));
                  }
                }
              );
            }
          });
      },
      (err) => {
        console.log(err);

        getCityWeather({ variables: { name: "Tel Aviv" } }).then((res) => {
          if (res && res.data && res.data?.getCityByName) {
            dispatch(selectCity(res.data.getCityByName));
            dispatch(addCity(res.data.getCityByName));
          }
        });
      }
    );
  }, []);

  const removeCityFromList = (cityId: string) => {
    dispatch(removeCity(cityId));
  };

  const addCityToList = (cityToAdd: string) => {
    getCityWeather({ variables: { name: cityToAdd } }).then((res) => {
      if (res && res.data && res.data?.getCityByName) {
        dispatch(addCity(res.data.getCityByName));
      }
    });
  };

  return (
    <Card sx={{ maxWidth: 1500, marginTop: 5 }}>
      <CardContent>
        <Header
          cityList={weatherState.cities}
          unit={weatherState.unit}
          addCity={addCityToList}
          setUnit={() => dispatch(changeUnit())}
        />
        <br />

        <CitiesTable
          cities={weatherState.cities}
          removeCity={removeCityFromList}
        />
        <br />
        {weatherState.selectedCity && (
          <CityInfo city={weatherState.selectedCity} unit={weatherState.unit} />
        )}
      </CardContent>
    </Card>
  );
};
export default Main;
