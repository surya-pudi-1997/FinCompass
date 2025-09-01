# FinCompass Services Documentation

## Overview

This document details the service layer implementations for the FinCompass application. Each service handles specific business logic for different entities while maintaining data consistency and transactional integrity.

## Table of Contents

1. [Users Service](#users-service)
2. [Accounts Service](#accounts-service)
3. [Categories Service](#categories-service)
4. [Transactions Service](#transactions-service)
5. [Assets Service](#assets-service)

## Users Service

`users.service.ts` - Handles user management and authentication.

### Key Features

- User creation with default account and categories
- Authentication with JWT
- Password hashing with bcrypt
- Networth tracking
- Soft delete functionality

### Core Functions

1. **createUser**

   ```typescript
   async createUser(userData: CreateUserInput): Promise<UserWithoutPassword>
   ```

   - Creates new user
   - Sets up default account ("Liquid")
   - Creates default transaction categories
   - Handles password hashing
   - Validates email uniqueness

2. **login**

   ```typescript
   async login(email: string, password: string): Promise<LoginResponse>
   ```

   - Validates credentials
   - Updates last login timestamp
   - Generates JWT token (24h validity)

3. **updateUser & deleteUser**
   - Soft delete implementation (isActive flag)
   - Password update handling
   - Profile information updates

### Data Transformations

- Uses `userSelect` constant for safe user data retrieval
- Transforms Decimal networth to number type
- Excludes password hash from responses

## Accounts Service

`accounts.service.ts` - Manages financial accounts and balance tracking.

### Key Features

- Atomic balance updates
- Networth synchronization
- Transaction-safe operations

### Core Functions

1. **create**

   ```typescript
   async create(userId: string, data: CreateAccountDto)
   ```

   - Creates account with initial balance
   - Updates user's networth
   - Uses transaction for atomicity

2. **update**

   ```typescript
   async update(id: string, userId: string, data: UpdateAccountDto)
   ```

   - Handles balance changes
   - Automatically updates networth
   - Calculates balance differences

3. **delete**
   ```typescript
   async delete(id: string, userId: string)
   ```

   - Decrements networth by account balance
   - Removes account safely

### Balance Management

- Atomic operations for balance updates
- Handles positive/negative balance changes
- Maintains networth consistency

## Categories Service

`categories.service.ts` - Manages transaction categories.

### Key Features

- System and custom categories
- Type-based categorization
- CRUD operations

### Core Functions

1. **findByNameAndType**

   ```typescript
   async findByNameAndType(name: string, type: string, userId: string)
   ```

   - Used for system category lookups
   - Supports asset type categorization

2. **CRUD Operations**
   - Basic create/read/update/delete
   - User-scoped operations
   - Type safety with DTOs

## Transactions Service

`transactions.service.ts` - Handles financial transactions.

### Key Features

- Multi-type transaction support (Income/Expense/Investment)
- Balance and networth synchronization
- Asset transaction handling

### Core Functions

1. **create**

   ```typescript
   async create(userId: string, data: CreateTransactionDto)
   ```

   - Updates account balance
   - Adjusts networth based on type
   - Handles asset-related transactions

2. **update**

   ```typescript
   async update(id: string, userId: string, data: UpdateTransactionDto)
   ```

   - Reverses old transaction effects
   - Applies new transaction changes
   - Maintains balance consistency

3. **delete**
   ```typescript
   async delete(id: string, userId: string)
   ```

   - Reverses transaction effects
   - Updates account balance
   - Adjusts networth accordingly

### Transaction Types

1. **Income**
   - Increases account balance
   - Increases networth
2. **Expense**
   - Decreases account balance
   - Decreases networth
3. **Investment**
   - Decreases source account
   - Asset-linked transactions

## Assets Service

`assets.service.ts` - Manages investment assets.

### Key Features

- Complex state management (Active/Sold)
- Transaction integration
- Value tracking and networth updates

### Core Functions

1. **create**

   ```typescript
   async create(userId: string, data: CreateAssetDto)
   ```

   - Handles bought_from account
   - Creates investment transaction
   - Updates networth

2. **update**

   ```typescript
   async update(id: string, userId: string, data: UpdateAssetDto)
   ```

   Complex state transitions:
   - Asset with transaction → Asset with new transaction
   - Asset with transaction → Asset without transaction
   - Asset without transaction → Asset with transaction
   - Asset without transaction → Update value
   - Active → Sold state
   - Sold → Active state

3. **delete**
   ```typescript
   async delete(id: string, userId: string)
   ```

   - Handles associated transactions
   - Updates account balances
   - Adjusts networth

### Asset States

1. **Active Asset**
   - Tracked in networth
   - May have associated transaction
2. **Sold Asset**
   - Generates sale transaction
   - Updates account balances
   - Adjusts networth

### Transaction Handling

1. **Buy Transaction**
   - Decrements bought_from account
   - Creates investment transaction
   - Updates networth

2. **Sell Transaction**
   - Creates income transaction
   - Updates sold_to account
   - Adjusts networth

## Common Patterns

### Transaction Safety

- All complex operations use `prisma.$transaction`
- Atomic updates for related entities
- Rollback on errors

### Decimal Handling

```typescript
new Prisma.Decimal(value);
```

- Used for all financial calculations
- Prevents floating-point errors
- Consistent money handling

### Error Handling

- Entity existence validation
- Type validation
- Proper error messages
- Transaction rollbacks

### Networth Calculations

- Automatic updates on all operations
- Considers asset values
- Tracks account balances
- Handles transaction effects

### Data Consistency

- Atomic operations
- State validation
- Balance verification
- Reference integrity

## Best Practices

1. Always use transactions for multi-entity updates
2. Validate entity existence before operations
3. Handle all edge cases explicitly
4. Use Prisma.Decimal for financial values
5. Maintain networth consistency
6. Document complex state transitions
7. Implement proper error handling
8. Use DTOs for type safety
