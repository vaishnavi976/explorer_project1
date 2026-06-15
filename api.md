# Simulated REST API Endpoints Layout

Although built as a high-performance offline-first React SPA with localStorage durability, **Explorer** models data access through a simulated REST service layer. The routes below map the underlying data pipelines in the system.

## 📡 Base Endpoint Route: `/api/v1`

---

### 1. File Asset Management

#### `GET /api/v1/files`
- **Description**: Fetch all digital files in the active workspace.
- **Query Params**:
  - `parentId` *(string/null)*: Filter files inside a specific directory.
  - `favorite` *(boolean)*: Filter starred files.
  - `trash` *(boolean)*: Filter trashed files.
- **Success Response (200 OK)**: Array of `FileItem` objects.

#### `POST /api/v1/files/upload`
- **Description**: Add a new file to the active directory.
- **Payload Headers**: `multipart/form-data` or JSON simulation payload.
- **Body parameters**:
  - `name` *(string)*: Name of the uploaded file.
  - `size` *(number)*: Byte size.
  - `parentId` *(string/null)*: Target directory ID.
- **Success Response (201 Created)**: Newly instantiated `FileItem` object containing a unique ID and createdAt timestamp.

#### `PATCH /api/v1/files/:id`
- **Description**: Modify file parameters (e.g., star, trash/restore, move).
- **Body parameters**:
  - `isFavorite` *(boolean)*
  - `isTrash` *(boolean)*
  - `parentId` *(string/null)*
- **Success Response (200 OK)**: Updated `FileItem` object.

#### `DELETE /api/v1/files/:id`
- **Description**: Permanently delete a file from the workspace database.
- **Success Response (204 No Content)**.

---

### 2. Folder Directory Management

#### `GET /api/v1/folders`
- **Description**: Fetch all folder directories in the storage.
- **Success Response (200 OK)**: Array of `FolderItem` objects.

#### `POST /api/v1/folders`
- **Description**: Create a new folder directory.
- **Body parameters**:
  - `name` *(string)*: Folder name.
  - `parentId` *(string/null)*: Parent folder ID.
- **Success Response (201 Created)**: Newly created `FolderItem` object.

---

### 3. System Auditing & Activity Logs

#### `GET /api/v1/activities`
- **Description**: Fetch chronological logs of system operations.
- **Success Response (200 OK)**: Array of `ActivityLog` objects.
