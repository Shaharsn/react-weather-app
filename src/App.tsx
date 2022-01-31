import { Container } from "@mui/material";
import "./App.css";
import Main from "./app/components/Main";
import { WeatherContextProvider } from "./app/store/WeatherContext";

const App = () => {
  return (
    <WeatherContextProvider>
      <Container maxWidth="lg">
        <Main />
      </Container>
    </WeatherContextProvider>
  );
};

export default App;
