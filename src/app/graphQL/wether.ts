import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { City } from "../types/types";

export const GET_CITY_BY_NAME = gql`
  query GetCityByName($name: String!) {
    getCityByName(name: $name) {
      id
      name
      country
      coord {
        lon
        lat
      }
      weather {
        temperature {
          actual
          min
          max
        }
        wind {
          speed
          deg
        }
        clouds {
          all
        }
        timestamp
      }
    }
  }
`;

export const GET_CITY_BY_ID = gql`
  query GetCityById($id: [String!]) {
    getCityById(id: $id) {
      id
      name
      country
      coord {
        lon
        lat
      }
      weather {
        temperature {
          actual
          min
          max
        }
        wind {
          speed
          deg
        }
        clouds {
          all
        }
        timestamp
      }
    }
  }
`;

// QUERIES

interface ICityByNameInput {
  name: String;
  country?: String;
}

interface ICityByIdInput {
  id: String[];
}

interface ICityByNameResponse {
  getCityByName: City;
}

interface ICityByIdResponse {
  getCityById: City[];
}

export const useGetCityByName = (name: String) => {
  return useLazyQuery<ICityByNameResponse, ICityByNameInput>(GET_CITY_BY_NAME, {
    variables: { name },
  });
};

export const useGetCityById = (id: String[]) => {
  return useQuery<ICityByIdResponse, ICityByIdInput>(GET_CITY_BY_ID, {
    variables: { id },
  });
};
