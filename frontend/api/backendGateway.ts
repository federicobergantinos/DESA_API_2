import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAuthDTO, Credentials } from "./authDTO";
import { TransactionDTO } from "./TransactionDTO";
import { TransactionsDTO } from "./TransactionsDTO";
import { TransactionsSearchDTO } from "./TransactionsSearchDTO";

// const api = axios.create({ baseURL: "https://wallet-elb.federicobergantinos.com:443" });
const api = axios.create({ baseURL: "http://192.168.1.116:8080" });
const transactionBaseUrl = "/v1/transactions";
const usersBaseUrl = "/v1/users";

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
    console.log(`Making POST request to: ${api.defaults.baseURL}${url}`); // Esta línea imprime la URL
    return api.post(url, body).then(responseBodyWithStatusCode);
  },
  put: (url: string, body?: any) => {
    console.log(`Making PUT request to: ${api.defaults.baseURL}${url}`); // Imprimir para solicitudes PUT
    return api.put(url, body).then(responseBodyWithStatusCode);
  },
  delete: (url: string) => {
    console.log(`Making DELETE request to: ${api.defaults.baseURL}${url}`); // Imprimir para solicitudes DELETE
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

const rating = {
  rate: (userId: number, transactionId: number, value: number): Promise<{ response: any; statusCode: number }>  => requests.put('/v1/transactions/'+transactionId+'/ratings', { userId: userId, value: value}),
};

// Objeto para funciones relacionadas con recetas
const transactionsGateway = {
  deleteTransaction: async (transactionId: number) => requests.delete(transactionBaseUrl + "/" + transactionId),
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

  getTransactionById: ( id: number, userId: number): Promise<{ response: TransactionDTO; statusCode: number }> => requests.get(transactionBaseUrl + "/" + id + "?userId=" + userId),
  getAll: (page = 0, userId): Promise<{ response: TransactionsDTO; statusCode: number }> => {

    let url = `${transactionBaseUrl}/?page=${page}&limit=10`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    
    return requests.get(url);
  },

  searchTransactions: (searchTerm = "", page = 0, limit = 10): Promise<{ response: TransactionsSearchDTO; statusCode: number }> => {
    const url = `${transactionBaseUrl}/search?page=${page}&limit=${limit}&searchTerm=${searchTerm}`;
    return requests.get(url);
  },
  updateTransaction: async (id: number, transactionData: any): Promise<{ response: any; statusCode: number }> => {
    try {
      const url = `${transactionBaseUrl}/${id}`;
      const response = await requests.put(url, transactionData);

      return response;
    } catch (error) {
      console.error('Error al actualizar la receta:', error);
      throw error;
    }
  },
  uploadImage: async (image) => {
    try {
      const url = `${transactionBaseUrl}` + "/uploadImage"
      const response = await requests.post(url, image);

      return response;
    } catch (error) {
      console.error('Error al crear la receta:', error);
      throw error;
    }
  },
};

// Objeto para funciones relacionadas con usuarios
const users = {
  like: ( userId: number, transactionId: number,): Promise<{ response: any; statusCode: number }> =>
    requests.post(usersBaseUrl + "/" + userId + "/favorites",
        {transactionId: transactionId,}
    ),
  dislike: ( userId: number, transactionId: number,): Promise<{ response: any; statusCode: number }> =>
    requests.delete(usersBaseUrl + "/" + userId + "/favorites/" + transactionId),
  favorites: (userId: number): Promise<{ response: any; statusCode: number  }> =>
    requests.get(usersBaseUrl + "/" + userId + "/favorites"),
  getUser: (
    userId: number,
  ): Promise<{ response: any; statusCode: number }> =>
    requests.get(usersBaseUrl + "/" + userId),
  editProfile: (
      userId: number, userData: any,
    ): Promise<{ response: any; statusCode: number }> =>
      requests.put(usersBaseUrl + "/" + userId, userData),
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
export default { authUser, transactionsGateway, users, rating };
