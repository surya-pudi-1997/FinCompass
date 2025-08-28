# FinCompass AI Coding Instructions

## Architecture Overview

FinCompass is a comprehensive finance management platform built as a **Turbo monorepo** with:

- **Frontend**: React + TypeScript + Vite (apps/frontend/base)
- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL (apps/backend/core)
- **AI Service**: Python + FastAPI + RAG/LLM chatbot (apps/backend/chat)
- **Shared Packages**: Types (`@fin-compass/types`), TSConfig, Utils

## Critical Patterns

### State Management - Zustand Store Pattern

All stores follow a strict pattern in `apps/frontend/base/src/shared/stores/`:

```typescript
// Store structure: state + actions + selectors
const useEntityStore = create<EntityStore>()(
  devtools(
    immer((set, get) => ({
      // State: entities, selectedEntity, loading states, error states
      entities: [],
      selectedEntity: null,
      fetchEntitiesLoading: false,
      createEntityLoading: false,
      // ... separate loading/error states per CRUD operation

      // Actions: CRUD operations + state setters
      setEntities: (entities) =>
        set((state) => {
          state.entities = entities;
        }),
      addEntity: (entity) =>
        set((state) => {
          state.entities.push(entity);
        }),
      // ... always update store directly, clear errors on success
    }))
  )
);

// Export performance-optimized selectors
export const useEntitySelectors = {
  entities: () => useEntityStore((state) => state.entities),
  selectedEntity: () => useEntityStore((state) => state.selectedEntity),
};
```

### Service Layer - API Integration Pattern

Services in `/pages/{entity}/services/` follow `useGetProfile.ts` pattern:

```typescript
// Import structure (strict order):
import { useApiRequest } from "@/shared/libs/api/useApiRequest";
import { API_ENDPOINTS, API_METHODS } from "@/shared/constants/api";
import { useEntityStore } from "@/shared/stores";
import { EntityType } from "@fin-compass/types";

const useEntityService = () => {
  const { addEntity, setCreateEntityError, setCreateEntityLoading } =
    useEntityStore();

  const { apiRequestController, cancelAPIRequest } = useApiRequest(
    { cancelAPIOnUnmount: true },
    { loaderAction: setCreateEntityLoading }
  );

  // Status handlers: 200/201 success, 400 validation, 404 not found
  const statusHandlers = [
    {
      status_code: 201,
      status_txt: "Entity created successfully",
      callback: (response) => {
        addEntity(response.data.entity);
        setCreateEntityError(null);
      },
    },
  ];

  // Return only action functions + cancelAPIRequest
  return { createEntity, cancelAPIRequest };
};
```

**Key Rules:**

- Services use store actions (not API state) - components consume from store selectors
- Each CRUD operation has separate loading/error states
- API endpoints defined in `shared/constants/api.ts` with naming: `GET_ENTITY`, `CREATE_ENTITY`, etc.

### Component Structure

- Use `/views` folder (not `/components`) in apps
- Import order: React, @fin-compass packages, lucide-react icons, then relative imports
- Types always from `@fin-compass/types`

### Form Handling - useFormGenerator Pattern

Use the custom form builder in `shared/libs/formBuilder/`:

```typescript
const FORM_FIELDS = [
  {
    name: "fieldName",
    type: "email" as const,
    label: "Field Label",
    validation: { required: true, email: true },
  },
];

const { formData, validateForm, getFieldProps } = useFormGenerator({
  formName: "entityForm",
  fields: FORM_FIELDS,
});

// Render with: <FormField {...getFieldProps("fieldName")!} />
```

## Development Workflows

### Build System (Turbo)

```bash
# Development
turbo dev              # Start all apps
turbo dev --filter=base  # Start specific app

# Production
turbo build            # Build all packages
turbo lint             # Lint all packages

# Backend specific
cd apps/backend/core && npm run dev  # Start backend server
```

### Database Operations

```bash
cd apps/backend/core
npx prisma migrate dev     # Run migrations
npx prisma generate        # Generate client
npx prisma studio          # Database GUI
```

### Key Directories

- `packages/types/` - All TypeScript interfaces and types
- `apps/frontend/base/src/shared/` - Shared utilities, stores, constants
- `apps/backend/core/src/apis/` - API routes, controllers, services, validations
- `project-docs/0-mvp/` - Technical and product requirements

## API Architecture

**Backend Structure**: `/apis/{routes,controllers,services,validations}/entity.{route,controller,service,validation}.ts`

- All routes prefixed with `/api` and protected via auth middleware
- Standard REST endpoints: GET /fetch, POST /create, PUT /edit/:id, DELETE /delete/:id

**Frontend API Integration**:

- `useApiRequest` hook handles auth tokens, status codes, unauthorized responses
- External status handlers for 200/201 (success), 400 (validation), 404 (not found)
- Auto-logout on 401 Unauthorized

## Types & Integration Points

- **All types** in `@fin-compass/types` package - never define types locally
- **Cross-app communication** via shared types and API contracts
- **Authentication** via JWT tokens stored in Zustand with sessionStorage persistence
- **Socket.IO** for real-time updates (finance data changes)

## Unique Conventions

- Use `lucide-react` for all icons
- Currency handling via `useCurrency` hook from shared utils
- Error boundaries and loading states managed per-entity in stores
- Form validation via `useFormGenerator` with custom validation functions
- API transformations in `shared/utils/apiTransforms.ts` for date/type conversions

When implementing new features, always check existing patterns in accounts, assets, transactions, or categories modules for consistency.
