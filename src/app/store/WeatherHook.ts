import { useContext } from "react";
import WeatherContext from "./WeatherContext";

export const useStoreContext = () => useContext(WeatherContext);