import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { City } from "../types/types";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoIcon from "@mui/icons-material/Info";
import { useStoreContext } from "../store/WeatherHook";
import { selectCity, sort } from "../store/weatherReducer";

interface ICitiesTableProps {
  cities: City[];
  removeCity: (cityId: string) => void;
}

const CitiesTable = (props: ICitiesTableProps) => {
  const { cities, removeCity } = props;

  const { dispatch } = useStoreContext();

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel active={true} onClick={() => dispatch(sort())}>
                City
              </TableSortLabel>
            </TableCell>

            <TableCell>Country</TableCell>
            <TableCell>Temperature</TableCell>
            <TableCell>Wind</TableCell>
            <TableCell>clouds</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cities?.map((city) => (
            <TableRow
              key={city.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {city.name}
              </TableCell>
              <TableCell>{city.country}</TableCell>
              <TableCell>{city.weather?.temperature.actual}</TableCell>
              <TableCell>{city.weather?.wind.speed}</TableCell>
              <TableCell>{city.weather?.clouds.all}</TableCell>
              <TableCell>
                <IconButton onClick={() => removeCity(city.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
                <IconButton onClick={() => dispatch(selectCity(city.id))}>
                  <InfoIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default CitiesTable;
