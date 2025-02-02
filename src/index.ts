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

export class PaperlessClient {
    private readonly baseUrl: string;
    private readonly token: string;

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl;
        this.token = token;
    }

    private async request<T>(
        method: string,
        path: string,
        body?: any
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method,
            headers: {
                Authorization: `Token ${this.token}`,
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            throw new Error(
                `Request failed: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }

    async getDocuments(): Promise<Document[]> {
        return this.request<Document[]>("GET", "/api/documents/");
    }

    async getDocument(id: number): Promise<Document> {
        return this.request<Document>("GET", `/api/documents/${id}/`);
    }
}
