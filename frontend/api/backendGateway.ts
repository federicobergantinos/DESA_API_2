import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAuthDTO, Credentials } from "./authDTO";
import { TransactionDTO } from "./TransactionDTO";
import { ContactDTO, ContactsDTO, ContactsSearchDTO } from "./ContactDTO";

// const api = axios.create({ baseURL: "https://wallet-elb.federicobergantinos.com:443" });
const api = axios.create({ baseURL: "http://192.168.1.108:8080" });
const transactionBaseUrl = "/v1/transactions";
const usersBaseUrl = "/v1/users";
const contactsBaseUrl = "/v1/contacts";

// Interceptores de solicitud y respuesta
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return getAuthHeader(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.response) {
        return Promise.resolve({ response: null, statusCode: error.response.status });
      }
      console.error(error)
      return Promise.reject(error);
    }
);

// Función para agregar el código de estado a la respuesta
const responseBodyWithStatusCode = (response: AxiosResponse): { response: any, statusCode: any } => ({
  response: response.data,
  statusCode: response.status,
});


// Definición de funciones de solicitud HTTP
const requests = {
  get: (url: string) => api.get(url).then(responseBodyWithStatusCode),
  post: (url: string, body?: any) => {
    console.log(`Making POST request to: ${api.defaults.baseURL}${url}`);
    return api.post(url, body).then(responseBodyWithStatusCode);
  },
  put: (url: string, body?: any) => {
    console.log(`Making PUT request to: ${api.defaults.baseURL}${url}`); 
    return api.put(url, body).then(responseBodyWithStatusCode);
  },
  delete: (url: string) => {
    console.log(`Making DELETE request to: ${api.defaults.baseURL}${url}`); 
    return api.delete(url).then(responseBodyWithStatusCode);
  },
};
const authUser = {
  authenticate: (auth: createAuthDTO): Promise<{ response: any; statusCode: number }> =>
    requests.post('/v1/auth', auth),
  refresh: (refreshToken: string): Promise<{ response: Credentials; statusCode: number }> =>
    requests.put('/v1/auth', { refreshToken: refreshToken }),
  deleteCredential: () => requests.delete('/v1/auth'),
};

// Objeto para funciones relacionadas con recetas
const transactionsGateway = {
  createTransaction: async (transactionData) => {
    try {
      const url = `${transactionBaseUrl}` + "/create"
      const response = await requests.post(url, transactionData);
      return response;
    } catch (error) {
      console.error('Error al crear la receta:', error);
      throw error;
    }
  },

  getTransactionById: ( id: number): Promise<{ response: TransactionDTO; statusCode: number }> => 
  {
    console.log(`Making GET request to: ${transactionBaseUrl + "/" + id }`); 
    return requests.get(transactionBaseUrl + "/" + id)},
  getAll: (page = 0, userId): Promise<{ response: TransactionDTO; statusCode: number }> => {

    let url = `${transactionBaseUrl}/?page=${page}&limit=10`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    
    return requests.get(url);
  },

};

const contactsGateway = {
  deleteContact: async (contactId: number) => requests.delete(contactsBaseUrl + "/" + contactId),
  createContact: async (contactData) => {
    try {
      const url = `${contactsBaseUrl}` + "/create"
      const response = await requests.post(url, contactData);
      return response;
    } catch (error) {
      console.error('Error al crear la receta:', error);
      throw error;
    }
  },

  getContactById: ( id: number, userId: number): Promise<{ response: ContactDTO; statusCode: number }> => requests.get(contactsBaseUrl + "/" + id + "?userId=" + userId),
  getAll: (page = 0, userId): Promise<{ response: ContactsDTO; statusCode: number }> => {

    let url = `${contactsBaseUrl}/?page=${page}&limit=10`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    
    return requests.get(url);
  },

  searchContacts: (searchTerm = "", page = 0, limit = 10): Promise<{ response: ContactsSearchDTO; statusCode: number }> => {
    const url = `${contactsBaseUrl}/search?page=${page}&limit=${limit}&searchTerm=${searchTerm}`;
    return requests.get(url);
  },
  updateContact: async (id: number, contactData: any): Promise<{ response: any; statusCode: number }> => {
    try {
      const url = `${contactsBaseUrl}/${id}`;
      const response = await requests.put(url, contactData);

      return response;
    } catch (error) {
      console.error('Error al actualizar la receta:', error);
      throw error;
    }
  },
};

// Objeto para funciones relacionadas con usuarios
const usersGateway = {
  getUser: (
    userId: number,
  ): Promise<{ response: any; statusCode: number }> =>
    requests.get(usersBaseUrl + "/" + userId),
  editProfile: (
      userId: number, userData: any,
    ): Promise<{ response: any; statusCode: number }> =>
      requests.put(usersBaseUrl + "/" + userId, userData), 
  uploadImage: async (image) => {
    try {
      const url = `${transactionBaseUrl}` + "/uploadImage"
      const response = await requests.post(url, image);

      return response;
    } catch (error) {
      console.error('Error al subir una imagen:', error);
      throw error;
    }
  }
  };



// Función para obtener el encabezado de autenticación
const getAuthHeader = async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
};

// Función para obtener el token de autenticación del almacenamiento local
const getToken = async (): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token || "";
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return "";
  }
};
export default { authUser, transactionsGateway, contactsGateway, usersGateway };
