import { Card, CardContent } from "@mui/material";
import { useContext, useEffect } from "react";
import { useGetCityByName } from "../graphQL/wether";
import CitiesTable from "./CitiesTable";
import Header from "./Header";
import CityInfo from "./CityInfo";
import WeatherContext from "../store/WeatherContext";

const Main = () => {
  const context = useContext(WeatherContext);
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
            if (!context.cities.find((city) => city.name === payload.city)) {
              getCityWeather({ variables: { name: payload.city } }).then(
                (res) => {
                  if (res && res.data && res.data?.getCityByName) {
                    context.selectCity(res.data.getCityByName);
                    context.addCity(res.data.getCityByName);
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
            context.selectCity(res.data.getCityByName);
            context.addCity(res.data.getCityByName);
          }
        });
      }
    );
  }, []);

  const removeCityFromList = (cityId: string) => {
    context.removeCity(cityId);
  };

  const addCityToList = (cityToAdd: string) => {
    getCityWeather({ variables: { name: cityToAdd } }).then((res) => {
      if (res && res.data && res.data?.getCityByName) {
        context.addCity(res.data.getCityByName);
      }
    });
  };

  return (
    <Card sx={{ maxWidth: 1500, marginTop: 5 }}>
      <CardContent>
        <Header
          cityList={context.cities}
          unit={context.unit}
          addCity={addCityToList}
          setUnit={() => context.changeUnit()}
        />
        <br />

        <CitiesTable cities={context.cities} removeCity={removeCityFromList} />
        <br />
        {context.selectedCity && (
          <CityInfo city={context.selectedCity} unit={context.unit} />
        )}
      </CardContent>
    </Card>
  );
};
export default Main;
