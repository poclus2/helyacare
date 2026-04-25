export declare enum CameroonOperator {
    ORANGE = "ORANGE",
    MTN = "MTN",
    UNKNOWN = "UNKNOWN"
}
export declare function normalizePhoneNumber(phoneNumber: string): string;
export declare function detectCameroonOperator(phoneNumber: string): CameroonOperator;
export declare function isCameroonNumber(phoneNumber: string): boolean;
export declare const NEXAH_SENDER_IDS: {
    ORANGE: string;
    MTN: string;
    UNKNOWN: string;
};
export declare function getNexahSenderId(phoneNumber: string): string;
