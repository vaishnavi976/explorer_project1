# Method & Function Specifications Map

This document lists and explains every function, utility, and state modifier implemented in the **Explorer** platform, showcasing strict segregation of visual styling (`.tsx`) and application logic (`.ts`).

---

## 🛠️ File Operations Logic (`src/logic/fileState.ts`)

### `createNewFolder(name: string, parentId: string | null): FolderItem`
- **Purpose**: Instantiates a new folder schema.
- **Arguments**:
  - `name`: Desired name.
  - `parentId`: Target parent folder ID.
- **Returns**: A standard `FolderItem` object equipped with a unique millisecond-based ID and timestamps.

### `createNewFile(name: string, type: FileType, size: number, parentId: string | null): FileItem`
- **Purpose**: Instantiates a new file schema.
- **Arguments**:
  - `name`: Filename.
  - `type`: File category classification.
  - `size`: Sizing in bytes.
  - `parentId`: Parent folder ID.
- **Returns**: A standard `FileItem` object containing initialized tags.

### `moveItem(files: FileItem[], folders: FolderItem[], itemId: string, isFolder: boolean, targetFolderId: string | null)`
- **Purpose**: Shifts the parentId of the targets, supporting the drag-and-drop organization feature.
- **Safety checks**: Incorporates preventive cycle loops ensuring you cannot relocate a folder into itself or its active nested children.
- **Returns**: Unfolded collections inside a state transition object `{ files, folders }`.

---

## 📊 Storage Calculations Logic (`src/logic/storage.ts`)

### `formatBytes(bytes: number, decimals: number): string`
- **Purpose**: Converts binary bytes into a human-readable metric string representation.
- **Supports**: Bytes, KB, MB, GB, TB.

### `calculateStorageStats(files: FileItem[]): FileTypeStat[]`
- **Purpose**: Computes accumulated totals and counts across each File type category to populate dashboard metrics.
- **Returns**: An array of `FileTypeStat` objects mapped to cohesive design colors.

### `saveStateToLocal(key: string, data: any): void`
- **Purpose**: Persists serialized state objects into standard localStorage blocks.

### `loadStateFromLocal<T>(key: string, fallback: T): T`
- **Purpose**: Retrieves browser localStorage states safely, returning fallback values if uninitialized.

---

## 🧩 Engine Core Logic (`src/logic/explorerEngine.ts`)

### `buildBreadcrumbs(folders: FolderItem[], currentFolderId: string | null): FolderItem[]`
- **Purpose**: Traverses parent elements recursively to build standard breadcrumb trees.

### `detectFileType(fileName: string): FileType`
- **Purpose**: Analyzes file string endings using an internal extension dictionary mapping PDF, images, sheets, documents, audios, and archives.

### `searchAndFilterItems(files, folders, searchQuery, view, currentFolderId)`
- **Purpose**: Centrally handles active tab filtering (trash, favorites, recent) combined with instant global search query filtering.
