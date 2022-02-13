import { City } from "../types/types";
import { IWeatherState } from "./WeatherContext";

export interface IWeatherAction {
  type: string;
  payload: any;
}

// PRIVATE METHODS

const fahrenheitToCelsius = (fahrenheit: number) => {
  return +(((fahrenheit - 32) * 5) / 9).toFixed(2);
};
const celsiusToFahrenheit = (celsius: number) => {
  return +((celsius * 9) / 5 + 32).toFixed(2);
};

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

// REDUCER METHODS
export const selectCity = (cityId: String) => ({
  type: "SELECT_CITY",
  payload: cityId,
});
export const addCity = (newCity: City) => ({
  type: "ADD_CITY",
  payload: newCity,
});
export const removeCity = (cityId: string) => ({
  type: "REMOVE_CITY",
  payload: cityId,
});
export const sort = () => ({ type: "SORT" });
export const changeUnit = () => ({ type: "CHANGE_UNIT" });

// THE REDUCER
export const WeatherReducer = (
  state: IWeatherState,
  action: IWeatherAction
) => {
  switch (action.type) {
    case "SELECT_CITY":
      return { ...state, selectedCity: action.payload };
    case "ADD_CITY": {
      let cities = [...state.cities];

      if (!state.cities.find((city) => city.id === action.payload.id)) {
        cities = [...cities, action.payload];
      }

      return { ...state, cities: [...cities] };
    }
    case "REMOVE_CITY": {
      const updatedCities = state.cities.filter(
        (city) => city.id !== action.payload
      );
      let selectedCity: string | undefined = state.selectedCity;

      if (state.selectedCity === action.payload) {
        selectedCity = undefined;
      }

      return {
        ...state,
        cities: [...updatedCities],
        selectedCity: selectedCity,
      };
    }
    case "SORT": {
      let sortedCities = [...state.cities];
      let order = state.order;

      if (state.order === "asc") {
        sortedCities.sort(sortDesc);
        order = "desc";
      } else {
        sortedCities.sort(sortAsc);
        order = "asc";
      }

      return { ...state, cities: [...sortedCities], order: order };
    }
    case "CHANGE_UNIT": {
      let unit: "F" | "C" = state.unit;
      let cities: City[] = [];
      let selectedCity: City | undefined = undefined;

      if (state.unit === "F") {
        unit = "C";

        cities = state.cities.map((city) => {
          let updatedCity = JSON.parse(JSON.stringify(city));

          if (updatedCity.weather) {
            updatedCity.weather.temperature.actual = fahrenheitToCelsius(
              city.weather?.temperature.actual || 0
            );
          }
          return updatedCity;
        });
      } else {
        unit = "F";
        
        cities = state.cities.map((city) => {
          let updatedCity = JSON.parse(JSON.stringify(city));

          if (updatedCity.weather) {
            updatedCity.weather.temperature.actual = celsiusToFahrenheit(
              city.weather?.temperature.actual || 0
            );
          }
          return updatedCity;
        });
      }

      if (state.selectedCity) {
        selectedCity = state.cities.find(
          (city) => city.id === state.selectedCity
        );
      }

      return {
        ...state,
        cities: [...cities],
        selectCity: selectedCity,
        unit: unit,
      };
    }
    default:
      return state;
  }
};
