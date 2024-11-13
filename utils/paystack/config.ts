// utils/paystack/config.ts
import axios from 'axios';

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('Missing required PAYSTACK_SECRET_KEY environment variable');
}

export const PAYSTACK_BASE_URL =
  process.env.NEXT_PUBLIC_PAYSTACK_API_URL || 'https://api.paystack.co';
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

// Create an axios instance with default config
const paystackApi = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
class PaystackError extends Error {
  statusCode?: number;
  data?: any;

  constructor(message: string, statusCode?: number, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

paystackApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Paystack API Error:', error.response?.data);
    const errorMessage =
      error.response?.data?.message || 'An error occurred with Paystack';
    const enhancedError = new PaystackError(
      errorMessage,
      error.response?.status,
      error.response?.data
    );
    throw enhancedError;
  }
);

export const paystack = {
  async initializeTransaction(data: {
    email: string;
    amount: number;
    callback_url?: string;
    plan?: string;
    metadata?: Record<string, any>;
  }) {
    console.log(
      'Initializing transaction with data:',
      JSON.stringify(data, null, 2)
    );
    try {
      const response = await paystackApi.post('/transaction/initialize', {
        ...data,
        amount: Math.round(data.amount) // Ensure amount is rounded to avoid decimal issues
      });
      console.log('Transaction initialization response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Transaction initialization error:', error);
      throw error;
    }
  },

  async verifyTransaction(reference: string) {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data;
  },

  async createPlan(data: {
    name: string;
    amount: number;
    interval: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annually';
    description?: string;
    currency?: string;
  }) {
    try {
      const response = await paystackApi.post('/plan', {
        ...data,
        currency: data.currency || 'KES'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  },

  async listPlans(params?: {
    perPage?: number;
    page?: number;
    status?: string;
  }) {
    try {
      const response = await paystackApi.get('/plan', { params });
      return response.data;
    } catch (error) {
      console.error('Error listing plans:', error);
      throw error;
    }
  },

  async fetchPlan(planId: string) {
    try {
      const response = await paystackApi.get(`/plan/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw error;
    }
  }
};
