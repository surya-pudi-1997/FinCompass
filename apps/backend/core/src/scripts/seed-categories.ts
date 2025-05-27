import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "personal-luxary", type: "expenditure" },
  { name: "rent-received", type: "income" },
  { name: "Cab", type: "expenditure" },
  { name: "Electricity", type: "expenditure" },
  { name: "junk food", type: "expenditure" },
  { name: "food", type: "expenditure" },
  { name: "studies", type: "expenditure" },
  { name: "electronics", type: "expenditure" },
  { name: "house investment", type: "expenditure" },
  { name: "office needs", type: "expenditure" },
  { name: "clothing", type: "expenditure" },
  { name: "house-luxary", type: "expenditure" },
  { name: "salary", type: "income" },
  { name: "rent-paid", type: "expenditure" },
  { name: "taxes", type: "expenditure" },
  { name: "house", type: "expenditure" },
  { name: "maid", type: "expenditure" },
  { name: "mom clothing", type: "expenditure" },
  { name: "my clothing", type: "expenditure" },
  { name: "mobile recharge", type: "expenditure" },
  { name: "gifting", type: "expenditure" },
  { name: "travel", type: "expenditure" },
  { name: "health", type: "expenditure" },
];

async function seedCategories() {
  try {
    // Get all users to create categories for each user
    const users = await prisma.user.findMany();

    for (const user of users) {
      console.log(`Creating categories for user: ${user.email}`);

      // Create categories for each user
      for (const category of defaultCategories) {
        try {
          await prisma.transactionCategory.create({
            data: {
              name: category.name,
              type: category.type,
              userId: user.id,
            },
          });
          console.log(
            `Created/Updated category: ${category.name} for user: ${user.email}`
          );
        } catch (error) {
          console.error(`Error creating category ${category.name}:`, error);
        }
      }
    }

    console.log("Categories seeding completed successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedCategories().catch((error) => {
  console.error(error);
  process.exit(1);
});
