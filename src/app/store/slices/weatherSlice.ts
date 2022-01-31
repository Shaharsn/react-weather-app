import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { City } from "../../types/types";
import { RootState } from "../store";

interface IWeatherState {
  cities: City[];
  selectedCity?: City;
  order: "asc" | "desc";
  unit: "F" | "C";
}

const initialWeatherSlice: IWeatherState = {
  cities: [],
  order: "asc",
  unit: "F",
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

const fahrenheitToCelsius = (fahrenheit: number) => {
  return +(((fahrenheit - 32) * 5) / 9).toFixed(2);
};
const celsiusToFahrenheit = (celsius: number) => {
  return +((celsius * 9) / 5 + 32).toFixed(2);
};

const WeatherSlice = createSlice({
  name: "Weather",
  initialState: initialWeatherSlice,
  reducers: {
    selectCity: (state, action: PayloadAction<City>) => {
      state.selectedCity = action.payload;
    },
    addCity: (state, action: PayloadAction<City>) => {
      if (!state.cities.find((city) => city.id === action.payload.id)) {
        state.cities.push(action.payload);
      }

      state.order === "asc"
        ? state.cities.sort(sortAsc)
        : state.cities.sort(sortDesc);

      if (state.cities.length === 1) {
        state.selectedCity = state.cities[0];
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter((city) => city.id !== action.payload);
      if (state.selectedCity?.id === action.payload)
        state.selectedCity = undefined;
    },
    sort: (state) => {
      if (state.order === "asc") {
        state.cities.sort(sortDesc);
        state.order = "desc";
      } else {
        state.cities.sort(sortAsc);
        state.order = "asc";
      }
    },
    changeUnit: (state) => {
      if (state.unit === "F") {
        state.cities = state.cities.map((city) => {
          let updatedCity = { ...city };
          if (updatedCity.weather) {
            updatedCity.weather.temperature.actual = fahrenheitToCelsius(
              city.weather?.temperature.actual || 0
            );
          }
          return updatedCity;
        });
        state.unit = "C";

        if (state && state.selectedCity) {
          state.selectedCity = state.cities.find(
            (city) => city.id === state?.selectedCity?.id
          );
        }
      } else {
        state.cities = state.cities.map((city) => {
          let updatedCity = { ...city };
          if (updatedCity.weather) {
            updatedCity.weather.temperature.actual = celsiusToFahrenheit(
              city.weather?.temperature.actual || 0
            );
          }
          return updatedCity;
        });
        state.unit = "F";

        if (state && state.selectedCity) {
          state.selectedCity = state.cities.find(
            (city) => city.id === state?.selectedCity?.id
          );
        }
      }
    },
  },
});

export const { selectCity, addCity, removeCity, sort, changeUnit } =
  WeatherSlice.actions;

export const state = (state: RootState) => state.weather;

export default WeatherSlice.reducer;
