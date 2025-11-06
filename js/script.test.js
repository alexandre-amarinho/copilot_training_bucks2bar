const {
    validateUsername,
    checkUsernameLength,
    checkHasCapital,
    checkHasNumber,
    checkHasSpecial
} = require('./script.js');

describe('Username Validation', () => {
    describe('validateUsername - Complete validation', () => {
        test('should return true for valid username with all requirements', () => {
            expect(validateUsername('Password1!')).toBe(true);
            expect(validateUsername('MyP@ssw0rd')).toBe(true);
            expect(validateUsername('Secure123#')).toBe(true);
        });

        test('should return false for username without capital letter', () => {
            expect(validateUsername('password1!')).toBe(false);
            expect(validateUsername('myp@ssw0rd')).toBe(false);
        });

        test('should return false for username without number', () => {
            expect(validateUsername('Password!')).toBe(false);
            expect(validateUsername('MyP@ssword')).toBe(false);
        });

        test('should return false for username without special character', () => {
            expect(validateUsername('Password1')).toBe(false);
            expect(validateUsername('MyPassword0')).toBe(false);
        });

        test('should return false for username less than 8 characters', () => {
            expect(validateUsername('Pass1!')).toBe(false);
            expect(validateUsername('MyP@1')).toBe(false);
        });

        test('should return false for empty string', () => {
            expect(validateUsername('')).toBe(false);
        });
    });

    describe('checkUsernameLength - Length validation', () => {
        test('should return true for username with 8 or more characters', () => {
            expect(checkUsernameLength('12345678')).toBe(true);
            expect(checkUsernameLength('verylongusername')).toBe(true);
        });

        test('should return false for username less than 8 characters', () => {
            expect(checkUsernameLength('1234567')).toBe(false);
            expect(checkUsernameLength('abc')).toBe(false);
            expect(checkUsernameLength('')).toBe(false);
        });
    });

    describe('checkHasCapital - Capital letter validation', () => {
        test('should return true for username with at least one capital letter', () => {
            expect(checkHasCapital('Password')).toBe(true);
            expect(checkHasCapital('myPassword')).toBe(true);
            expect(checkHasCapital('ALLCAPS')).toBe(true);
        });

        test('should return false for username without capital letters', () => {
            expect(checkHasCapital('password')).toBe(false);
            expect(checkHasCapital('lowercase123')).toBe(false);
            expect(checkHasCapital('12345')).toBe(false);
        });
    });

    describe('checkHasNumber - Number validation', () => {
        test('should return true for username with at least one number', () => {
            expect(checkHasNumber('password1')).toBe(true);
            expect(checkHasNumber('123abc')).toBe(true);
            expect(checkHasNumber('test0')).toBe(true);
        });

        test('should return false for username without numbers', () => {
            expect(checkHasNumber('password')).toBe(false);
            expect(checkHasNumber('abcdefgh')).toBe(false);
            expect(checkHasNumber('NoNumbers!')).toBe(false);
        });
    });

    describe('checkHasSpecial - Special character validation', () => {
        test('should return true for username with special characters', () => {
            expect(checkHasSpecial('password!')).toBe(true);
            expect(checkHasSpecial('user@name')).toBe(true);
            expect(checkHasSpecial('test#123')).toBe(true);
            expect(checkHasSpecial('pass$word')).toBe(true);
            expect(checkHasSpecial('my%pass')).toBe(true);
        });

        test('should return false for username without special characters', () => {
            expect(checkHasSpecial('password')).toBe(false);
            expect(checkHasSpecial('username123')).toBe(false);
            expect(checkHasSpecial('Password1')).toBe(false);
        });

        test('should validate all allowed special characters', () => {
            const specialChars = '!@#$%^&*(),.?":{}|<>';
            for (const char of specialChars) {
                expect(checkHasSpecial(`test${char}`)).toBe(true);
            }
        });
    });

    describe('Edge cases and combinations', () => {
        test('should handle usernames with multiple special characters', () => {
            expect(validateUsername('P@ssw0rd!')).toBe(true);
            expect(validateUsername('My#P@ss1')).toBe(true);
        });

        test('should handle usernames with spaces (should fail)', () => {
            expect(validateUsername('Pass word1!')).toBe(false);
        });

        test('should handle very long usernames', () => {
            expect(validateUsername('VeryLongPassword123!WithManyCharacters')).toBe(true);
        });

        test('should handle usernames with multiple numbers', () => {
            expect(validateUsername('Password123!')).toBe(true);
        });

        test('should handle usernames with multiple capitals', () => {
            expect(validateUsername('MyPassword1!')).toBe(true);
        });
    });
});