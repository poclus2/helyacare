export interface CsvRow {
    phoneNumber?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
}
export interface CsvValidationResult {
    valid: boolean;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    duplicates: number;
    errors: string[];
    warnings: string[];
}
export interface Recipient {
    phoneNumber?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}
export declare function parseCsv(fileBuffer: Buffer): Promise<CsvRow[]>;
export declare function validateCsvFormat(rows: CsvRow[]): CsvValidationResult;
export declare function extractUniqueRecipients(rows: CsvRow[]): Recipient[];
