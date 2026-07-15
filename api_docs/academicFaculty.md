## Academic Faculty Routes

### POST - `/api/v1/academic-faculties/create-academic-faculty`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "Faculty of Engineering"
}
```

#### Response
```ts

```
---

### GET - `/api/v1/academic-faculties`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

**Supports common filters and pagination.**

#### Response

```ts
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
    createdAt: string;
    updatedAt: string;
  }>;
};
```

---

### GET - `/api/v1/academic-faculties/:id`

Protected endpoint for `superAdmin`, `admin`, and `faculty`.

---

### PATCH - `/api/v1/academic-faculties/:id`

Protected endpoint for `superAdmin` and `admin`.

Body:

```json
{
  "name": "FSIT"
}
```
