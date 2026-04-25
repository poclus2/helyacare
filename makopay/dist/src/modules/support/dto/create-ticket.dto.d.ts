import { SupportCategory, SupportPriority } from '@prisma/client';
export declare class CreateTicketDto {
    subject: string;
    category: SupportCategory;
    priority?: SupportPriority;
    initialMessage: string;
}
