import React, { ReactNode, useEffect, useState } from "react";
import { City } from "../types/types";

interface IWeatherContext {
  cities: City[];
  selectedCity: City | undefined;
  order: "asc" | "desc";
  unit: "F" | "C";
  selectCity: (city: City) => void;
  addCity: (city: City) => void;
  removeCity: (cityId: string) => void;
  sort: () => void;
  changeUnit: () => void;
}

const WeatherContext = React.createContext<IWeatherContext>({
  cities: [],
  selectedCity: undefined,
  order: "asc",
  unit: "F",
  selectCity: () => {},
  addCity: () => {},
  removeCity: () => {},
  sort: () => {},
  changeUnit: () => {},
});

const sortAsc = (a: City, b: City) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const sortDesc = (a: City, b: City) => {
  if (a.name > b.name) {
    return -1;
  }
  if (a.name < b.name) {
    return 1;
  }
  return 0;
};

const fahrenheitToCelsius = (fahrenheit: number) => {
  return +(((fahrenheit - 32) * 5) / 9).toFixed(2);
};
const celsiusToFahrenheit = (celsius: number) => {
  return +((celsius * 9) / 5 + 32).toFixed(2);
};

interface IWeatherContextProvider {
  children: ReactNode;
}

export const WeatherContextProvider = (props: IWeatherContextProvider) => {
  let storageCities: City[] = [];

  const storageCitiesJson = localStorage.getItem("cities") || "";
  if (storageCitiesJson !== "") {
    storageCities = JSON.parse(storageCitiesJson);
  }

  const [cities, setCities] = useState<City[]>(storageCities);
  const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [unit, setUnit] = useState<"F" | "C">("F");

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  const selectCity = (city: City) => {
    setSelectedCity(city);
  };

  const addCity = (newCity: City) => {
    if (!cities.find((city) => city.id === newCity.id)) {
      setCities([...cities, newCity]);
    }

    order === "asc" ? cities.sort(sortAsc) : cities.sort(sortDesc);

    if (cities.length === 1) setSelectedCity(cities[0]);
  };

  const removeCity = (cityId: string) => {
    setCities((currentCities) => {
      return currentCities.filter((city) => city.id !== cityId);
    });

    if (selectedCity?.id === cityId) setSelectedCity(undefined);
  };

  const sort = () => {
    if (order === "asc") {
      cities.sort(sortDesc);
      setOrder("desc");
    } else {
      cities.sort(sortAsc);
      setOrder("asc");
    }
  };

  const changeUnit = () => {
    if (unit === "F") {
      setCities((currentCities) => {
        return currentCities.map((city) => {
          let updatedCity = JSON.parse(JSON.stringify(city));

          if (updatedCity.weather) {
            updatedCity.weather.temperature.actual = fahrenheitToCelsius(
              city.weather?.temperature.actual || 0
            );
          }
          return updatedCity;
        });
      });

      setUnit("C");
    } else {
      setCities((currentCities) => {
        return currentCities.map((city) => {
          let updatedCity = JSON.parse(JSON.stringify(city));

          if (updatedCity.weather) {
            updatedCity.weather.temperature.actual = celsiusToFahrenheit(
              city.weather?.temperature.actual || 0
            );
          }
          return updatedCity;
        });
      });

      setUnit("F");
    }

    if (selectedCity) {
      setSelectedCity(cities.find((city) => city.id === selectedCity.id));
    }
  };

  const contextValue: IWeatherContext = {
    cities: cities,
    selectedCity: selectedCity,
    order: order,
    unit: unit,
    selectCity: selectCity,
    addCity: addCity,
    removeCity: removeCity,
    sort: sort,
    changeUnit: changeUnit,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {props.children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
