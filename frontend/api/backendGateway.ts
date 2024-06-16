import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateAuthDTO, Credentials } from './authDTO';
import { TransactionDTO } from './TransactionDTO';
import { ContactDTO, ContactsDTO } from './ContactDTO';
import { AccountDTO, AccountSummaryDTO } from './AccountDTO';

// const api = axios.create({ baseURL: "https://www.wallet-elb.federicobergantinos.com/" });
const api = axios.create({ baseURL: 'http://192.168.1.112:8080' });
// const api = axios.create({baseURL: 'https://277c-170-150-153-225.ngrok-free.app:8080'});

const transactionBaseUrl = '/v1/transactions';
const usersBaseUrl = '/v1/users';
const contactsBaseUrl = '/v1/contacts';
const accountBaseUrl = '/v1/accounts';
const exchangeRateBaseUrl = '/v1/rates';

// Interceptores de solicitud y respuesta
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      return error.response;
    }
    console.error(error);
    return Promise.reject(error);
  }
);

// Función para agregar el código de estado a la respuesta
const responseBodyWithStatusCode = (
  response: AxiosResponse
): { response: any; statusCode: any } => {
  const data = { response: response.data.data, statusCode: response.status };
  console.info('Response received:', data);
  return data;
};

// Definición de funciones de solicitud HTTP
const requests = {
  get: (url: string) => {
    console.info(`Making GET request to: ${api.defaults.baseURL}${url}`);
    return api.get(url).then(responseBodyWithStatusCode);
  },
  post: (url: string, body?: any) => {
    console.info(`Making POST request to: ${api.defaults.baseURL}${url}`);
    return api.post(url, body).then(responseBodyWithStatusCode);
  },
  put: (url: string, body?: any) => {
    console.info(`Making PUT request to: ${api.defaults.baseURL}${url}`);
    return api.put(url, body).then(responseBodyWithStatusCode);
  },
  delete: (url: string) => {
    console.info(`Making DELETE request to: ${api.defaults.baseURL}${url}`);
    return api.delete(url).then(responseBodyWithStatusCode);
  },
};

const authUser = {
  authenticate: (
    auth: CreateAuthDTO
  ): Promise<{ response: any; statusCode: number }> => {
    const requestBody = { ...auth }
    console.log('Request body:', requestBody)  // Verifica que el cuerpo de la solicitud contenga el email
    return requests.post('/v1/auth', requestBody)
  },
  refresh: (
    refreshToken: string
  ): Promise<{ response: Credentials; statusCode: number }> =>
    requests.put('/v1/auth', { refreshToken }),
  deleteCredential: () => requests.delete('/v1/auth'),
}



// Objeto para funciones relacionadas con transacciones
const transactionsGateway = {
  createTransaction: async (transactionData) => {
    try {
      const url = `${transactionBaseUrl}/create`;
      const response = await requests.post(url, transactionData);
      return response;
    } catch (error) {
      console.error('Error al crear la transacción:', error);
      throw error;
    }
  },

  getTransactionById: (
    id: number
  ): Promise<{ response: TransactionDTO; statusCode: number }> => {
    return requests.get(`${transactionBaseUrl}/${id}`);
  },
  getAll: (
    page = 0,
    accountNumber: string
  ): Promise<{ response: TransactionDTO; statusCode: number }> => {
    let url = `${transactionBaseUrl}/?page=${page}&limit=10`;
    if (accountNumber) {
      url += `&accountNumber=${accountNumber}`;
    }
    return requests.get(url);
  },

  balance: (
    accountNumber: string
  ): Promise<{ response: TransactionDTO; statusCode: number }> => {
    const url = `${transactionBaseUrl}/balance?accountNumber=${accountNumber}`;
    return requests.get(url);
  },
};

const contactsGateway = {
  deleteContact: async (contactId: number) =>
    requests.delete(`${contactsBaseUrl}/${contactId}`),
  createContact: async (contactData) => {
    try {
      const url = `${contactsBaseUrl}/create`;
      const response = await requests.post(url, contactData);
      return response;
    } catch (error) {
      console.error('Error al crear el contacto:', error);
      throw error;
    }
  },

  getContactById: (
    id: number,
    userId: number
  ): Promise<{ response: ContactDTO; statusCode: number }> =>
    requests.get(`${contactsBaseUrl}/${id}?userId=${userId}`),
  getAll: (
    page = 0,
    userId
  ): Promise<{ response: ContactsDTO; statusCode: number }> => {
    let url = `${contactsBaseUrl}/?page=${page}&limit=10`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    return requests.get(url);
  },

  searchContacts: (
    searchTerm = '',
    page = 0,
    limit = 10,
    userId: any
  ): Promise<{ response: ContactsDTO; statusCode: number }> => {
    const url = `${contactsBaseUrl}/search?page=${page}&limit=${limit}&userId=${userId}&searchTerm=${searchTerm}`;
    return requests.get(url);
  },
  updateContact: async (
    id: number,
    contactData: any
  ): Promise<{ response: any; statusCode: number }> => {
    try {
      const url = `${contactsBaseUrl}/${id}`;
      const response = await requests.put(url, contactData);
      return response;
    } catch (error) {
      console.error('Error al actualizar el contacto:', error);
      throw error;
    }
  },
};

const accountGateway = {
  createAccount: async (accountData) => {
    try {
      const url = `${accountBaseUrl}/create`;
      const response = await requests.post(url, accountData);
      return response;
    } catch (error) {
      console.error('Error al crear la cuenta:', error);
      throw error;
    }
  },

  getAccountByUserId: async (
    userId: number
  ): Promise<{ response: AccountSummaryDTO[]; statusCode: number }> => {
    const url = `${accountBaseUrl}/?userId=${userId}`;

    try {
      const { response, statusCode } = await requests.get(url);
      return { response, statusCode };
    } catch (error) {
      console.error('Error fetching accounts by userId:', error);
      throw error;
    }
  },

  getById: (
    accountId: number
  ): Promise<{ response: AccountDTO; statusCode: number }> => {
    const url = `${accountBaseUrl}/${accountId}`;
    return requests.get(url);
  },

};


// Objeto para funciones relacionadas con usuarios
const usersGateway = {
  getUser: (userId: number): Promise<{ response: any; statusCode: number }> =>
    requests.get(`${usersBaseUrl}/${userId}`),
  editProfile: (
    userId: number,
    userData: any
  ): Promise<{ response: any; statusCode: number }> =>
    requests.put(`${usersBaseUrl}/${userId}`, userData),
  uploadImage: async ({
    image,
    prefix,
    filename,
  }: {
    image: string,
    prefix: string,
    filename: string,
  }): Promise<{ response: string; statusCode: number }> => {
    return requests.post(`${usersBaseUrl}/uploadImage`, { image, prefix, filename })
  },
  deleteUser: (userId: number): Promise<{ response: any; statusCode: number }> =>
    requests.delete(`${usersBaseUrl}/${userId}`),
}

const exchangeRatesGateway = {
  getExchangeRate: async (currencyCode) => {
    try {
      const url = `${exchangeRateBaseUrl}/${currencyCode}`;
      const response = await requests.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw error;
    }
  },
};


// Función para obtener el token de autenticación del almacenamiento local
const getToken = async (): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token || '';
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return '';
  }
};

export default {
  authUser,
  transactionsGateway,
  contactsGateway,
  usersGateway,
  accountGateway,
  exchangeRatesGateway,
};
