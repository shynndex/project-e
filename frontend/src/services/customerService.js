import { customerApi } from "./api";

export const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      ("Fetching all customers...");
      const response = await customerApi.get("/api/customers");

      ("Customer response:", response.data);

      // Đảm bảo trả về một mảng
      if (response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else {
          console.error("Unexpected response format:", response.data);
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching customers:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch customers"
      );
    }
  },
  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await customerApi.get(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch customer"
      );
    }
  },

  // Get customer by email
  getCustomerByEmail: async (email) => {
    try {
      const response = await customerApi.get(`/api/customers/email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch customer"
      );
    }
  },

  // Create customer
  createCustomer: async (customerData) => {
    try {
      const response = await customerApi.post("/api/customers", customerData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create customer"
      );
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await customerApi.put(
        `/api/customers/${id}`,
        customerData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update customer"
      );
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await customerApi.delete(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete customer"
      );
    }
  },
};
