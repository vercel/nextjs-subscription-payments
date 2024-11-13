// scripts/create-plans.ts
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load all possible .env files
function loadEnvFiles() {
  const envFiles = [
    '.env',
    '.env.local',
    '.env.development',
    '.env.development.local'
  ];

  console.log('Looking for environment files...');

  envFiles.forEach((file) => {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      console.log(`Found ${file}`);
      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      console.log(`Variables in ${file}:`, Object.keys(envConfig));

      // Load the variables
      Object.assign(process.env, envConfig);
    } else {
      console.log(`${file} not found`);
    }
  });
}

// Load environment variables
loadEnvFiles();

// List all environment variables starting with PAYSTACK
console.log('\nAvailable Paystack environment variables:');
Object.keys(process.env)
  .filter((key) => key.startsWith('PAYSTACK'))
  .forEach((key) => {
    console.log(
      `${key}: ${key.includes('SECRET') ? '****' : process.env[key]}`
    );
  });

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
  console.error('\nError: PAYSTACK_SECRET_KEY environment variable is missing');
  console.error('Available environment variables:', Object.keys(process.env));
  console.error(
    '\nPlease ensure you have created a .env file in the root directory with your Paystack secret key'
  );
  console.error('Example .env file content:');
  console.error('PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx');
  process.exit(1);
}

interface PaystackPlan {
  name: string;
  amount: number;
  interval: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'annually';
  currency?: string;
  description?: string;
}

const paystack = {
  async createPlan(plan: PaystackPlan) {
    try {
      console.log(`Making request to ${PAYSTACK_BASE_URL}/plan`);
      console.log(
        'Using auth:',
        `Bearer ${PAYSTACK_SECRET_KEY.substring(0, 10)}...`
      );

      const response = await fetch(`${PAYSTACK_BASE_URL}/plan`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(plan)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Response error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      throw error;
    }
  },

  async listPlans() {
    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/plan`, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error('Error listing plans:', error);
      throw error;
    }
  }
};

const plans: PaystackPlan[] = [
  {
    name: 'Basic Monthly',
    amount: 1000,
    interval: 'monthly',
    currency: 'KES',
    description: 'Basic plan features\nFeature 1\nFeature 2'
  },
  {
    name: 'Pro Monthly',
    amount: 2000,
    interval: 'monthly',
    currency: 'KES',
    description: 'Pro plan features\nFeature 1\nFeature 2\nFeature 3'
  },
  {
    name: 'Basic Annual',
    amount: 10000,
    interval: 'annually',
    currency: 'KES',
    description: 'Basic plan features (yearly)\nFeature 1\nFeature 2'
  }
];

async function main() {
  try {
    console.log('\nStarting plan creation process...');
    console.log('Current working directory:', process.cwd());

    for (const plan of plans) {
      try {
        console.log(`\nCreating plan: ${plan.name}`);
        console.log('Plan details:', JSON.stringify(plan, null, 2));

        const result = await paystack.createPlan(plan);
        console.log(
          'Plan created successfully:',
          JSON.stringify(result.data, null, 2)
        );
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          console.log(`Plan ${plan.name} already exists, skipping...`);
        } else {
          console.error(`Error creating plan ${plan.name}:`, error.message);
        }
      }
    }

    console.log('\nListing all plans:');
    const { data: allPlans } = await paystack.listPlans();
    console.log(JSON.stringify(allPlans, null, 2));
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
