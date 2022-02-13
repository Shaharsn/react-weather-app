import React, { ReactNode, useEffect } from "react";
import { City } from "../types/types";
import { WeatherReducer } from "./weatherReducer";

export interface IWeatherState {
  cities: City[];
  selectedCity: string | undefined;
  order: "asc" | "desc";
  unit: "F" | "C";
}

interface IWeatherContext {
  state: IWeatherState;
  dispatch: React.Dispatch<any>;
}

export const initialWeatherContextState: IWeatherState = {
  cities: [],
  selectedCity: undefined,
  order: "asc",
  unit: "F",
};

const WeatherContext = React.createContext<IWeatherContext>({
  state: initialWeatherContextState,
  dispatch: () => null,
});

interface IWeatherContextProvider {
  children: ReactNode;
}

export const WeatherContextProvider = (props: IWeatherContextProvider) => {
  const { children } = props;

  const [weatherState, dispatch] = React.useReducer(
    WeatherReducer,
    initialWeatherContextState
  );

/*

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(weatherState.cities));
  }, [weatherState.cities]);
*/
  return (
    <WeatherContext.Provider
      value={{ state: weatherState, dispatch: dispatch }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
