import axios from 'axios';
import { Customer, Address, CustomerUpdate } from '../types/customer.types';

const API_URL = "http://localhost:8081/bff";

const CustomerService = {
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  },

  getCustomerById: async (id: number): Promise<Customer> => {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customer: Customer): Promise<Customer> => {
    const response = await axios.post(`${API_URL}/customers`, customer);
    return response.data;
  },

  updateCustomer: async (id: number, customer: CustomerUpdate): Promise<Customer> => {
    const response = await axios.put(`${API_URL}/customers/${id}`, customer);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/customers/${id}`);
  },

  // Address related endpoints
  getCustomerAddressById: async (customerId: number, addressId: number): Promise<Address> => {
    const response = await axios.get(`${API_URL}/customers/${customerId}/addresses/${addressId}`);
    return response.data;
  },

  getCustomerAddresses: async (customerId: number): Promise<Address[]> => {
    const response = await axios.get(`${API_URL}/customers/${customerId}/addresses`);
    return response.data;
  },

  addCustomerAddress: async (customerId: number, address: Address): Promise<Address> => {
    const response = await axios.post(`${API_URL}/customers/${customerId}/addresses`, address);
    return response.data;
  },

  updateCustomerAddress: async (customerId: number, addressId: number, address: Address): Promise<Address> => {
    const response = await axios.put(`${API_URL}/customers/${customerId}/addresses/${addressId}`, address);
    return response.data;
  },

  deleteCustomerAddress: async (customerId: number, addressId: number): Promise<void> => {
    await axios.delete(`${API_URL}/customers/${customerId}/addresses/${addressId}`);
  }
};

export default CustomerService;
