export interface EmbSet {
    id: string;
    createdAt: Date;
    description: string;
    source: EmbSource;
    title: string;
    updatedAt: Date;
}

export enum EmbSource {
    PDF_FILE = "PDF_FILE",
    TEXT = "TEXT",
    WEB_LINK = "WEB_LINK",
}
