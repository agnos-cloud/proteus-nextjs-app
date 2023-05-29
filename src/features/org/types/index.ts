export interface CreateOrgData {
    createOrg: {
        id: string;
        name: string;
        description?: string;
    }
}
export interface CreateOrgInput {
    name: string;
    description?: string;
}
export interface CreateOrgVars {
    input: CreateOrgInput;
}

export type Membership = {
    id: string;
    orgId: String;
    role: Role
    userId: String;
}

export enum Role {
    GUEST = "GUEST",
    MEMBER = "MEMBER",
    OWNER = "OWNER"
}

export type Org = {
    id: string;
    createdAt: Date
    name: string;
    description: string | null;
    image: string | null;
    members: Array<Membership>;
    updatedAt: Date
}
export interface OrgData {
    org: Org
}

export interface OrgVars {
    id: string;
}

export interface OrgsData {
    orgs: Array<Org>
}

export interface SaveApiKeyData {
    saveOpenaiAPIKey: boolean;
}

export interface SaveApiKeyVars {
    id: string;
    key: string;
}
