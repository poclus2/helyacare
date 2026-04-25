"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsv = parseCsv;
exports.validateCsvFormat = validateCsvFormat;
exports.extractUniqueRecipients = extractUniqueRecipients;
const stream_1 = require("stream");
const csvParser = require('csv-parser');
const MAX_ROWS = 10000;
async function parseCsv(fileBuffer) {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = stream_1.Readable.from(fileBuffer);
        stream
            .pipe(csvParser())
            .on('data', (data) => {
            results.push(data);
            if (results.length > MAX_ROWS) {
                stream.destroy();
            }
        })
            .on('end', () => {
            resolve(results);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
}
function validateCsvFormat(rows) {
    const result = {
        valid: true,
        totalRows: rows.length,
        validRows: 0,
        invalidRows: 0,
        duplicates: 0,
        errors: [],
        warnings: [],
    };
    if (rows.length > MAX_ROWS) {
        result.valid = false;
        result.errors.push(`CSV file exceeds maximum ${MAX_ROWS} rows`);
        return result;
    }
    if (rows.length === 0) {
        result.valid = false;
        result.errors.push('CSV file is empty');
        return result;
    }
    const firstRow = rows[0];
    const hasPhoneNumber = 'phoneNumber' in firstRow;
    const hasEmail = 'email' in firstRow;
    if (!hasPhoneNumber && !hasEmail) {
        result.valid = false;
        result.errors.push('CSV must contain at least phoneNumber or email column');
        return result;
    }
    const seenPhones = new Set();
    const seenEmails = new Set();
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        let isValid = true;
        if (row.phoneNumber) {
            const phone = row.phoneNumber.trim();
            if (!isValidPhoneNumber(phone)) {
                result.warnings.push(`Row ${i + 1}: Invalid phone number format: ${phone}`);
                isValid = false;
            }
            else if (seenPhones.has(phone)) {
                result.duplicates++;
            }
            else {
                seenPhones.add(phone);
            }
        }
        if (row.email) {
            const email = row.email.trim().toLowerCase();
            if (!isValidEmail(email)) {
                result.warnings.push(`Row ${i + 1}: Invalid email format: ${email}`);
                isValid = false;
            }
            else if (seenEmails.has(email)) {
                result.duplicates++;
            }
            else {
                seenEmails.add(email);
            }
        }
        if (!row.phoneNumber && !row.email) {
            result.warnings.push(`Row ${i + 1}: Missing both phoneNumber and email`);
            isValid = false;
        }
        if (isValid) {
            result.validRows++;
        }
        else {
            result.invalidRows++;
        }
    }
    if (result.duplicates > 0) {
        result.warnings.push(`Found ${result.duplicates} duplicate entries`);
    }
    return result;
}
function extractUniqueRecipients(rows) {
    const seen = new Set();
    const recipients = [];
    for (const row of rows) {
        const phone = row.phoneNumber?.trim();
        const email = row.email?.trim().toLowerCase();
        if (!phone && !email)
            continue;
        const key = `${phone || ''}_${email || ''}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        const isValidPhone = phone && isValidPhoneNumber(phone);
        const isValidEmailAddr = email && isValidEmail(email);
        if (!isValidPhone && !isValidEmailAddr)
            continue;
        recipients.push({
            phoneNumber: isValidPhone ? phone : undefined,
            email: isValidEmailAddr ? email : undefined,
            firstName: row.firstName?.trim() || undefined,
            lastName: row.lastName?.trim() || undefined,
        });
    }
    return recipients;
}
function isValidPhoneNumber(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const regex = /^\+[1-9]\d{9,14}$/;
    return regex.test(cleaned);
}
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
//# sourceMappingURL=csv-parser.util.js.map