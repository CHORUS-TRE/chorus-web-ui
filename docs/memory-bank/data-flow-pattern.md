# Data Flow Pattern: A "Create" Operation Example

This document outlines the canonical, end-to-end data flow for a "create" operation in the Chorus Web UI, using the `App` entity as a concrete example. This pattern should be replicated for all other entities and operations (update, delete, list, get).

```mermaid
graph TD
    subgraph Browser
        A[React Component (app-create-dialog.tsx)]
    end

    subgraph Server (Next.js)
        B[Server Action (app-view-model.ts)]
        C[Use Case (app-create.ts)]
        D[Repository (app-repository-impl.ts)]
        E[Data Source (app-data-source.ts)]
        F[Mapper (app-mapper.ts)]
        G[API Client (AppServiceApi.ts)]
    end

    A -- "form.action(formData)" --> B
    B -- ".execute(validatedData)" --> C
    C -- ".create(domainObject)" --> D
    D -- ".create(domainObject)" --> E
    E -- "toChorusApp(domainObject)" --> F
    F -- "apiObject" --> E
    E -- ".appServiceCreateApp(apiObject)" --> G
```

## Step-by-Step Breakdown

### 1. Presentation Layer (UI Component)
- **File:** `src/components/app-create-dialog.tsx`
- **Responsibility:** Captures user input via a form. Upon submission, it constructs a `FormData` object and passes it to the Server Action. It does **not** call the use case or repository directly.
- **Example:**
  ```tsx
  // ...
  import { appCreate } from './actions/app-view-model'

  // ...
  const result = await appCreate({} as IFormState, formData)
  // ...
  ```

### 2. View-Model (Server Action)
- **File:** `src/components/actions/app-view-model.ts`
- **Responsibility:** Acts as the bridge between the client and the server-side application logic. It is the **exclusive entry point** for the UI.
  1.  Extracts data from the `FormData` object.
  2.  Validates the data using the domain Zod schema (`AppCreateSchema.parse`).
  3.  Instantiates the appropriate Use Case (`AppCreate`).
  4.  Calls the use case's `execute` method with the validated domain object.
  5.  Returns a standardized `IFormState` object (`{ data?, error?, issues? }`) to the UI for feedback.

### 3. Application Layer (Use Case)
- **File:** `src/domain/use-cases/app/app-create.ts`
- **Responsibility:** Encapsulates a single business operation. It orchestrates the repository to fulfill the request. It should contain no knowledge of HTTP or the specific data source implementation.
- **Example:**
  ```typescript
  // ...
  export class AppCreate implements AppCreateUseCase {
    constructor(private repository: AppRepository) {}

    async execute(app: AppCreateType): Promise<Result<App>> {
      // Potentially add business logic here (e.g., checks, logging)
      return await this.repository.create(app)
    }
  }
  ```

### 4. Infrastructure Layer Part 1: Repository
- **File:** `src/data/repository/app-repository-impl.ts`
- **Responsibility:** Implements the `AppRepository` interface defined in the domain layer. Its primary jobs are:
  1.  To call the corresponding method on the Data Source.
  2.  To catch any errors from the data source.
  3.  To map the raw API response (from the data source) into the application's standard `Result<T>` object. It should return a full domain object, which may require calling `get()` after a `create` or `update`.
- **Example (`create`):**
  ```typescript
  // ...
  async create(app: AppCreateType): Promise<Result<App>> {
    try {
      const response = await this.dataSource.create(app);
      if (!response.result?.id) {
        return { error: 'Error creating app' };
      }
      return this.get(response.result.id); // Return the full, fresh domain object
    } catch (error) {
      // ... handle error and return { error: ... }
    }
  }
  ```

### 5. Infrastructure Layer Part 2: Mapper
- **File:** `src/data/data-source/chorus-api/app-mapper.ts`
- **Responsibility:** Provides pure functions to map domain models to API client models for "write" operations. This isolates and centralizes the transformation logic.
- **Example:**
  ```typescript
  export const toChorusApp = (app: AppCreateType): ChorusApp => {
    const { preset, ...rest } = app; // Filter out UI-specific fields
    return { ...rest };
  };
  ```

### 6. Infrastructure Layer Part 3: Data Source
- **File:** `src/data/data-source/chorus-api/app-data-source.ts`
- **Responsibility:** Implements the `AppDataSource` interface. It's the final adapter before the API.
  1.  For "write" operations, it uses the **Mapper** to convert domain models into API models.
  2.  It calls the generated API Client methods.
  3.  It returns the raw, unmodified response from the API client.
- **Example (`create`):**
  ```typescript
  // ...
  import { toChorusApp } from './app-mapper';

  create(app: AppCreateType): Promise<ChorusCreateAppReply> {
    const chorusApp = toChorusApp(app);
    return this.client.appServiceCreateApp({
      body: chorusApp,
    });
  }
  ```

## Addendum: Pattern for "Update" Operations

The pattern for "update" operations is very similar, with one key difference in the UI layer regarding data that is required for the update but not editable by the user (e.g., the entity's `id`).

### Handling Non-Editable Required Fields

To ensure client-side validation works correctly with a schema that requires an `id` (`AppUpdateSchema`), the `id` should be included as a hidden input within the form.

- **File:** `src/components/app-edit-dialog.tsx`
- **Responsibility:**
  1. Use the full Zod schema for the update operation (e.g., `AppUpdateSchema`) in the `zodResolver`.
  2. Render any non-editable but required fields as `<input type="hidden" />`.
  3. This ensures the `FormData` passed to the server action contains all required fields, satisfying the schema validation at the entry point of the action.

- **Example:**
  ```tsx
  // ...
  import { AppUpdateSchema } from '~/domain/model';
  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';

  // ...
  const form = useForm<FormData>({
    resolver: zodResolver(AppUpdateSchema),
    defaultValues: {
      id: app.id, // Set the id in default values
      name: app.name,
      //... other fields
    }
  })

  // ...
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input type="hidden" {...form.register('id')} />
        {/* ... other form fields ... */}
      </form>
    </Form>
  )
  ```
