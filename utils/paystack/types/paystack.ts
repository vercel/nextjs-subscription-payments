// types/paystack.ts
export interface PaystackCustomer {
  id: number;
  customer_code: string;
  email: string;
  metadata: Record<string, any>;
}

export interface PaystackPlan {
  id: number;
  plan_code: string;
  name: string;
  description: string;
  amount: number;
  interval: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annually';
  currency: string;
  features: string[];
}

export interface PaystackSubscription {
  id: number;
  subscription_code: string;
  customer: PaystackCustomer;
  plan: PaystackPlan;
  status: 'active' | 'non-renewing' | 'attention' | 'completed';
  next_payment_date: string;
  createdAt: string;
  current_period_start: string;
  current_period_end: string;
}

export interface PaystackTransaction {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  customer: PaystackCustomer;
  plan?: PaystackPlan;
  subscription?: PaystackSubscription;
  status: 'success' | 'failed' | 'pending';
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    id: number;
    customer: PaystackCustomer;
    plan?: PaystackPlan;
    subscription_code?: string;
    status?: string;
    reference?: string;
  };
}
