// This is the lexr part of the compiler. It takes the character stream and converts it into tokens.

const arabicLettersRegex = /^[\u0621-\u064A]$/
const arabicNumeralsRegex = /^[\u0660-\u0669]$/
const variableDeclarators = ['var', 'const'];
const variableDeclaratorsArabic = ['عرف', 'ثبت'];
const keywords = []; //['print'];
const ArabicKeywords = []; // ['اطبع'];

function tokenizer (input) {
    const tokens = [];
    let current = 0;
    while (current < input.length) {
        var char = input[current];
        
        if (char === '(') {
            tokens.push({
                type: 'left_parenthesis',
                value: '(',
            });
            current++;
            continue;
        }
        else if (char === ')') {
            tokens.push({
                type: 'right_parenthesis',
                value: ')',
            });
            current++;
            continue;
        }

        if (char === '{') {
            tokens.push({
                type: 'open_brace',
                value: '{',
            });
            current++;
            continue;
        }

        else if (char === '}') {
            tokens.push({
                type: 'close_brace',
                value: '}',
            });
            current++;
            continue;
        }

        if (char === '[') {
            tokens.push({
                type: 'open_bracket',
                value: '[',
            });
            current++;
            continue;
        }

        if (char === ']') {
            tokens.push({
                type: 'close_bracket',
                value: ']',
            });
            current++;
            continue;
        }

        if (char === '.') {
            tokens.push({
                type: 'dot',
                value: '.',
            });
            current++;
            continue;
        }

        if (char === '>') {
            tokens.push({
                type: 'boolean_operator',
                value: '>',
            });
            current++;
            continue;
        }
        if (char === '<') {
            tokens.push({
                type: 'boolean_operator',
                value: '<',
            });
            current++;
            continue;
        }

        if (char === '!') {
            if (current < input.length - 1 && input[current + 1] === '=') {
                tokens.push({
                    type: 'boolean_operator',
                    value: '!=',
                });
                current += 2;
                continue;
            }
            // currently only supports !=
            throw new TypeError('Illegal Not Equal');
        }



         if (/\s/.test(char)) {
            current++;
            continue;
        }
         if (/[0-9]/.test(char)  || arabicNumeralsRegex.test(char)) {
            let value = '';
            while (/[0-9]/.test(char) || arabicNumeralsRegex.test(char)) {
                value += convertArabicNumeralsToEnglish(char);
                char = input[++current];
            }
            tokens.push({
                type: 'number',
                value,
            });
            continue;
        }
        
        if (char === ":") {
            tokens.push({
                type: 'colon',
                value: ':',
            });
            current++;
            continue;
        }

        if (char === ";" || char === "؛") {
            tokens.push({
                type: 'semicolon',
                value: ';',
            });
            current++;
            continue;
        }

        if (char === "," || char === "،") {
            tokens.push({
                type: 'comma',
                value: ',',
            });
            current++;
            continue;
        }

        if (char === '=') {
            // check if it's a comparison operator
            if (current < input.length - 1 && input[current + 1] === '=') {
                if (current < input.length - 2 && input[current + 2] === '=') {
                    throw new TypeError('Illegal Equal after two ==');
                }
                tokens.push({
                    type: 'boolean_operator',
                    value: '==',
                });
                current += 2;
                continue;
            }
            tokens.push({
                type: 'assignment_operator',
                value: '=',
            });
            current++;
            continue;
        }


        if (/[a-z]/i.test(char) || arabicLettersRegex.test(char)) {
            let value = '';
            while (char && (/[a-z]/i.test(char) || arabicLettersRegex.test(char))) {
                value += char;
                char = input[++current];
            }
            if (variableDeclarators.includes(value) || variableDeclaratorsArabic.includes(value)) {
                current++;
                var variableDec = variableDeclarators.includes(value) ? value : variableDeclarators[variableDeclaratorsArabic.indexOf(value)];
                tokens.push({
                    type: 'variableDeclarator',
                    value: variableDec,
                });
                continue;
            }

            if (keywords.includes(value) || ArabicKeywords.includes(value)) {
                current++;
                tokens.push({
                    type: 'Keyword',
                    value: value
                });
                continue;
            }
            tokens.push({
                type: 'Identifier',
                value,
            });
            continue;
        }

        if (["+", "-"].includes(char)) {
            tokens.push({
                type: 'additiveOperator',
                value: char,
            });
            current++;
            continue;
        }
        if (["*", "/", "%"].includes(char)) {
            tokens.push({
                type: 'multiplicativeOperator',
                value: char,
            });
            current++;
            continue;
        }

        throw new TypeError('Unknown character: ' + char);
    }

    return tokens;
}

function convertArabicNumeralsToEnglish (input) {
    return input.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return d.charCodeAt(0) - 1632;
    }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
        return d.charCodeAt(0) - 1776;
    });
}

export default tokenizer;