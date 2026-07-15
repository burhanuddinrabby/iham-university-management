## Academic Semester Routes

### POST - `/api/v1/academic-semesters/create-semester`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Fall",
  "year": "2024"
}
```

#### Response

```ts
type Response = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    year: string;
    createdAt: string;
    updatedAt: string;
    code: string;
    startMonth: string;
    endMonth: string;
    __v: number;
  };
};
```

---

### GET - `/api/v1/academic-semesters`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

**Supports common filters and pagination.**

#### Response

```typescript
type Response = {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    totalEntries: number;
    totalPage: number;
  };
  data: Array<{
    _id: string;
    name: string;
    year: string;
    createdAt: string;
    updatedAt: string;
    code: string;
    startMonth: string;
    endMonth: string;
  }>;
};
```

---

### GET - `/api/v1/academic-semesters/:id`

Protected endpoint for `superAdmin`, `admin`, `faculty`, and `student`.

---

### PATCH - `/api/v1/academic-semesters/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Spring",
  "year": "2024"
}
```
