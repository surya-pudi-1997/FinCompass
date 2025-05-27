import axios from "axios";
import { PrismaClient } from "../../generated/prisma";
import { AccountTypeEnum } from "@fin-compass/types";
import { encrypt } from "@fin-compass/utils";
import * as jwt from "jsonwebtoken";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const API_URL = "http://localhost:3000"; // Base URL for the Express server

const prisma = new PrismaClient();

interface AccountData {
  name: string;
  type: AccountTypeEnum;
  balance: number;
  encrypted_data: string;
}

const accountsData: AccountData[] = [
  {
    name: "jupiter",
    type: AccountTypeEnum.Savings,
    balance: Math.floor(Math.random() * (100000 - 5000) + 5000), // Random balance between 5k and 100k
    encrypted_data: encrypt(
      JSON.stringify({
        accountNumber: "XXXX" + Math.floor(1000 + Math.random() * 9000),
        ifsc: "JUPI" + Math.floor(10000 + Math.random() * 90000),
        bank: "Jupiter",
      }),
      ENCRYPTION_KEY
    ),
  },
  {
    name: "hdfc cc",
    type: AccountTypeEnum.CreditCard,
    balance: -Math.floor(Math.random() * (50000 - 1000) + 1000), // Random negative balance between -1k and -50k
    encrypted_data: encrypt(
      JSON.stringify({
        cardNumber: "XXXX" + Math.floor(1000 + Math.random() * 9000),
        expiryDate: "05/27",
        bank: "HDFC Bank",
        creditLimit: 100000,
      }),
      ENCRYPTION_KEY
    ),
  },
  {
    name: "hdfc",
    type: AccountTypeEnum.Savings,
    balance: Math.floor(Math.random() * (200000 - 10000) + 10000), // Random balance between 10k and 200k
    encrypted_data: encrypt(
      JSON.stringify({
        accountNumber: "XXXX" + Math.floor(1000 + Math.random() * 9000),
        ifsc: "HDFC" + Math.floor(10000 + Math.random() * 90000),
        bank: "HDFC Bank",
      }),
      ENCRYPTION_KEY
    ),
  },
  {
    name: "axis cc",
    type: AccountTypeEnum.CreditCard,
    balance: -Math.floor(Math.random() * (75000 - 2000) + 2000), // Random negative balance between -2k and -75k
    encrypted_data: encrypt(
      JSON.stringify({
        cardNumber: "XXXX" + Math.floor(1000 + Math.random() * 9000),
        expiryDate: "07/26",
        bank: "Axis Bank",
        creditLimit: 150000,
      }),
      ENCRYPTION_KEY
    ),
  },
  {
    name: "pots",
    type: AccountTypeEnum.Investment,
    balance: Math.floor(Math.random() * (500000 - 50000) + 50000), // Random balance between 50k and 500k
    encrypted_data: encrypt(
      JSON.stringify({
        accountNumber: "XXXX" + Math.floor(1000 + Math.random() * 9000),
        type: "Mutual Funds",
        portfolioValue: "500000",
      }),
      ENCRYPTION_KEY
    ),
  },
];

async function getAuthToken(userId: string): Promise<string> {
  return jwt.sign({ userId }, JWT_SECRET);
}

async function seedAccounts() {
  try {
    // Get all users to create accounts for each user
    const users = await prisma.user.findMany();

    for (const user of users) {
      console.log(`Creating accounts for user: ${user.email}`);
      const token = await getAuthToken(user.id);

      // Create accounts for each user using the API
      for (const account of accountsData) {
        try {
          await axios.post(
            `${API_URL}/accounts/create`,
            {
              name: account.name,
              type: account.type,
              balance: account.balance,
              encryptedData: Buffer.from(account.encrypted_data).toString(
                "base64"
              ),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(
            `Created/Updated account: ${account.name} for user: ${user.email}`
          );
        } catch (error: any) {
          console.error(
            `Error creating account ${account.name}:`,
            error.response?.data || error.message
          );
        }
      }
    }

    console.log("Accounts seeding completed successfully");
  } catch (error) {
    console.error("Error seeding accounts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedAccounts().catch((error) => {
  console.error(error);
  process.exit(1);
});
