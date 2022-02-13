import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { City } from "../types/types";

interface ICityInfoProps {
  city?: City;
  unit: string;
}

const CityInfo = (props: ICityInfoProps) => {
  const { city, unit } = props;

  if (city) {
    return (
      <Card>
        <CardHeader title={`${city.name}, ${city.country}`} />
        <CardContent>
          <Typography>
            Temp: {city.weather?.temperature.actual} {unit}, Wind Speed:{" "}
            {city.weather?.wind.speed}, Clouds: {city.weather?.clouds.all}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return <></>;
};
export default CityInfo;
