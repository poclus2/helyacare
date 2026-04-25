import { User } from '@prisma/client';
export declare function renderTemplate(template: string, variables: Record<string, any>): string;
export declare function extractVariables(template: string): string[];
export declare function getSystemVariables(user: User | Partial<User>): Record<string, any>;
export declare function renderUserTemplate(template: string, user: User | Partial<User>, customVariables?: Record<string, any>): string;
