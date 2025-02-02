// Represents a document in Paperless-ngx
export interface Document {
    id: number; // Read-only
    title: string;
    content: string;
    tags: number[]; // List of tag IDs
    document_type: number | null; // Document type ID or null
    correspondent: number | null; // Correspondent ID or null
    created: string; // ISO 8601 date-time string
    created_date?: string; // Optional; YYYY-MM-DD format; ignored if 'created' is provided
    modified: string; // Read-only; ISO 8601 date-time string
    added: string; // Read-only; ISO 8601 date-time string
    archive_serial_number?: string;
    original_file_name: string; // Read-only
    archived_file_name: string | null; // Read-only; null if no archived document is available
    notes: Note[];
    page_count: number;
    set_permissions?: Permissions; // Optional; write-only
    custom_fields: CustomFieldValue[];
}

// Represents a note associated with a document
export interface Note {
    id: number;
    content: string;
    created: string; // ISO 8601 date-time string
    modified: string; // ISO 8601 date-time string
}

// Represents permissions for a document
export interface Permissions {
    view?: {
        users?: number[]; // List of user IDs
        groups?: number[]; // List of group IDs
    };
    change?: {
        users?: number[]; // List of user IDs
        groups?: number[]; // List of group IDs
    };
}

// Represents a custom field value associated with a document
export interface CustomFieldValue {
    field: number; // Custom field ID
    value: string;
}

// Represents a tag in Paperless-ngx
export interface Tag {
    id: number; // Read-only
    name: string;
    slug: string; // Read-only
    colour: string;
    match: string;
    matching_algorithm: string;
}

// Represents a correspondent in Paperless-ngx
export interface Correspondent {
    id: number; // Read-only
    name: string;
    slug: string; // Read-only
    match: string;
    matching_algorithm: string;
}

// Represents a document type in Paperless-ngx
export interface DocumentType {
    id: number; // Read-only
    name: string;
    slug: string; // Read-only
    match: string;
    matching_algorithm: string;
}

// Represents a custom field in Paperless-ngx
export interface CustomField {
    id: number; // Read-only
    name: string;
    slug: string; // Read-only
    model: string;
    type: string;
    required: boolean;
    default: string;
    choices: string[];
}

// Represents a user in Paperless-ngx
export interface User {
    id: number; // Read-only
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    groups: number[]; // List of group IDs
    user_permissions: number[]; // List of permission IDs
}

// Represents a group in Paperless-ngx
export interface Group {
    id: number; // Read-only
    name: string;
    permissions: number[]; // List of permission IDs
}

// Represents a share link in Paperless-ngx
export interface ShareLink {
    id: number; // Read-only
    document: number; // Document ID
    slug: string; // Read-only
    created: string; // ISO 8601 date-time string
    expires: string | null; // ISO 8601 date-time string or null
    is_active: boolean;
}

// Represents a storage path in Paperless-ngx
export interface StoragePath {
    id: number; // Read-only
    path: string;
    description: string;
    is_default: boolean;
}

// Represents a workflow in Paperless-ngx
export interface Workflow {
    id: number; // Read-only
    name: string;
    description: string;
    enabled: boolean;
    trigger: string;
    conditions: WorkflowCondition[];
    actions: WorkflowAction[];
}

// Represents a condition in a workflow
export interface WorkflowCondition {
    id: number; // Read-only
    workflow: number; // Workflow ID
    field: string;
    operator: string;
    value: string;
}

// Represents an action in a workflow
export interface WorkflowAction {
    id: number; // Read-only
    workflow: number; // Workflow ID
    type: string;
    parameters: Record<string, any>;
}

export class PaperlessClient {
    private readonly baseUrl: string;
    private readonly token: string;

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    private async request<T>(method: string, path: string, body?: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                Authorization: `Token ${this.token}`,
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Document methods
    async getDocuments(): Promise<Document[]> {
        return this.request<Document[]>("GET", "/api/documents/");
    }

    async getDocument(id: number): Promise<Document> {
        return this.request<Document>("GET", `/api/documents/${id}/`);
    }

    async createDocument(document: Partial<Document>): Promise<Document> {
        return this.request<Document>("POST", "/api/documents/", document);
    }

    async updateDocument(id: number, document: Partial<Document>): Promise<Document> {
        return this.request<Document>("PATCH", `/api/documents/${id}/`, document);
    }

    async deleteDocument(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/documents/${id}/`);
    }

    // Tag methods
    async getTags(): Promise<Tag[]> {
        return this.request<Tag[]>("GET", "/api/tags/");
    }

    async getTag(id: number): Promise<Tag> {
        return this.request<Tag>("GET", `/api/tags/${id}/`);
    }

    async createTag(tag: Partial<Tag>): Promise<Tag> {
        return this.request<Tag>("POST", "/api/tags/", tag);
    }

    async updateTag(id: number, tag: Partial<Tag>): Promise<Tag> {
        return this.request<Tag>("PATCH", `/api/tags/${id}/`, tag);
    }

    async deleteTag(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/tags/${id}/`);
    }

    // Correspondent methods
    async getCorrespondents(): Promise<Correspondent[]> {
        return this.request<Correspondent[]>("GET", "/api/correspondents/");
    }

    async getCorrespondent(id: number): Promise<Correspondent> {
        return this.request<Correspondent>("GET", `/api/correspondents/${id}/`);
    }

    async createCorrespondent(correspondent: Partial<Correspondent>): Promise<Correspondent> {
        return this.request<Correspondent>("POST", "/api/correspondents/", correspondent);
    }

    async updateCorrespondent(id: number, correspondent: Partial<Correspondent>): Promise<Correspondent> {
        return this.request<Correspondent>("PATCH", `/api/correspondents/${id}/`, correspondent);
    }

    async deleteCorrespondent(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/correspondents/${id}/`);
    }

    // DocumentType methods
    async getDocumentTypes(): Promise<DocumentType[]> {
        return this.request<DocumentType[]>("GET", "/api/document_types/");
    }

    async getDocumentType(id: number): Promise<DocumentType> {
        return this.request<DocumentType>("GET", `/api/document_types/${id}/`);
    }

    async createDocumentType(documentType: Partial<DocumentType>): Promise<DocumentType> {
        return this.request<DocumentType>("POST", "/api/document_types/", documentType);
    }

    async updateDocumentType(id: number, documentType: Partial<DocumentType>): Promise<DocumentType> {
        return this.request<DocumentType>("PATCH", `/api/document_types/${id}/`, documentType);
    }

    async deleteDocumentType(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/document_types/${id}/`);
    }

    async getCustomFields(): Promise<CustomField[]> {
        return this.request<CustomField[]>("GET", "/api/custom_fields/");
    }

    async getCustomField(id: number): Promise<CustomField> {
        return this.request<CustomField>("GET", `/api/custom_fields/${id}/`);
    }

    async createCustomField(customField: Partial<CustomField>): Promise<CustomField> {
        return this.request<CustomField>("POST", "/api/custom_fields/", customField);
    }

    async updateCustomField(id: number, customField: Partial<CustomField>): Promise<CustomField> {
        return this.request<CustomField>("PATCH", `/api/custom_fields/${id}/`, customField);
    }

    async deleteCustomField(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/custom_fields/${id}/`);
    }

    // User methods
    async getUsers(): Promise<User[]> {
        return this.request<User[]>("GET", "/api/users/");
    }

    async getUser(id: number): Promise<User> {
        return this.request<User>("GET", `/api/users/${id}/`);
    }

    async createUser(user: Partial<User>): Promise<User> {
        return this.request<User>("POST", "/api/users/", user);
    }

    async updateUser(id: number, user: Partial<User>): Promise<User> {
        return this.request<User>("PATCH", `/api/users/${id}/`, user);
    }

    async deleteUser(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/users/${id}/`);
    }

    // Group methods
    async getGroups(): Promise<Group[]> {
        return this.request<Group[]>("GET", "/api/groups/");
    }

    async getGroup(id: number): Promise<Group> {
        return this.request<Group>("GET", `/api/groups/${id}/`);
    }

    async createGroup(group: Partial<Group>): Promise<Group> {
        return this.request<Group>("POST", "/api/groups/", group);
    }

    async updateGroup(id: number, group: Partial<Group>): Promise<Group> {
        return this.request<Group>("PATCH", `/api/groups/${id}/`, group);
    }

    async deleteGroup(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/groups/${id}/`);
    }

    // ShareLink methods
    async getShareLinks(): Promise<ShareLink[]> {
        return this.request<ShareLink[]>("GET", "/api/share_links/");
    }

    async getShareLink(id: number): Promise<ShareLink> {
        return this.request<ShareLink>("GET", `/api/share_links/${id}/`);
    }

    async createShareLink(shareLink: Partial<ShareLink>): Promise<ShareLink> {
        return this.request<ShareLink>("POST", "/api/share_links/", shareLink);
    }

    async deleteShareLink(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/share_links/${id}/`);
    }

    // StoragePath methods
    async getStoragePaths(): Promise<StoragePath[]> {
        return this.request<StoragePath[]>("GET", "/api/storage_paths/");
    }

    async getStoragePath(id: number): Promise<StoragePath> {
        return this.request<StoragePath>("GET", `/api/storage_paths/${id}/`);
    }

    async createStoragePath(storagePath: Partial<StoragePath>): Promise<StoragePath> {
        return this.request<StoragePath>("POST", "/api/storage_paths/", storagePath);
    }

    async updateStoragePath(id: number, storagePath: Partial<StoragePath>): Promise<StoragePath> {
        return this.request<StoragePath>("PATCH", `/api/storage_paths/${id}/`, storagePath);
    }

    async deleteStoragePath(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/storage_paths/${id}/`);
    }

    // Workflow methods
    async getWorkflows(): Promise<Workflow[]> {
        return this.request<Workflow[]>("GET", "/api/workflows/");
    }

    async getWorkflow(id: number): Promise<Workflow> {
        return this.request<Workflow>("GET", `/api/workflows/${id}/`);
    }

    async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
        return this.request<Workflow>("POST", "/api/workflows/", workflow);
    }

    async updateWorkflow(id: number, workflow: Partial<Workflow>): Promise<Workflow> {
        return this.request<Workflow>("PATCH", `/api/workflows/${id}/`, workflow);
    }

    async deleteWorkflow(id: number): Promise<void> {
        await this.request<void>("DELETE", `/api/workflows/${id}/`);
    }
}
