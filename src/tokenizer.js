// This is the lexr part of the compiler. It takes the character stream and converts it into tokens.

const arabicLettersRegex = /^[\u0621-\u064A]$/
const arabicNumeralsRegex = /^[\u0660-\u0669]$/
const variableDeclarators = ['var', 'const'];
const variableDeclaratorsArabic = ['عرف', 'ثبت'];
const keywords = ['if', 'else', 'return', 'function', 'for', 'while'];
const ArabicKeywords = ['اذا', 'والا', 'ارجع', 'دالة', 'لكل', 'طالما'];

function tokenizer (input) {
    const tokens = [];
    let current = 0;

    // ignore comments:
    input = stripComments(input);
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

        if (char === '>' || char === '<') {
            if (current < input.length - 1 && input[current + 1] === '=') {
                if (current < input.length - 2 && input[current + 2] === '=') {
                    throw new TypeError('Illegal Equal after two ==');
                }
                tokens.push({
                    type: 'boolean_operator',
                    value: `${char}=`,
                });
                current += 2;
                continue;
            }
            tokens.push({
                type: 'boolean_operator',
                value: `${char}`,
            });
            current++;
            continue;
        }

        if (char === '!') {
            if (current < input.length - 1 && input[current + 1] === '=') {
                if (current < input.length - 2 && input[current + 2] === '=') {
                    throw new TypeError('Illegal Equal after two ==');
                }

                tokens.push({
                    type: 'boolean_operator',
                    value: '!=',
                });
                current += 2;
                continue;

            }
                tokens.push({
                    type: 'not_operator',
                    value: '!',
                });
                current++;
                continue;
        }

         if (/[0-9]/.test(char)  || arabicNumeralsRegex.test(char)) {
            let value = '';
            let decimalPoints = 0;

            while (/[0-9.]/.test(char) || arabicNumeralsRegex.test(char)) {
                if (char === '.') {
                    decimalPoints++;
                    if (decimalPoints > 1) {
                        throw new TypeError('Illegal decimal point. A number cannot contain more than one decimal point.');
                    }
                }

                value += convertArabicNumeralsToEnglish(char);
                char = input[++current];
            }

            // Allow trailing decimal point
            if (value[value.length - 1] === '.') {
                value += '00';
            }

            tokens.push({
                type: 'number',
                value: value.toString(),
            });
            continue;
        }

        if (char === '"' || char === '“' || char === '”') {
            let value = '';
            char = input[++current];
            while (char !== '"' && char !== '“' && char !== '”') {
                value += char;
                char = input[++current];
            }
            current++;
            tokens.push({
                type: 'StringLiteral',
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

        if (char === '&' || char === '|') {
            if (current < input.length - 1 && (input[current + 1] === '&' || input[current + 1] === '|')) {
                if (current < input.length - 2 && (input[current + 2] === '&' || input[current + 2] === '|')) {
                    throw new TypeError(`Illegal ${char} after ${char}${char}`);
                }
                tokens.push({
                    type: 'logical_operator',
                    value: `${char}${char}`
                });
                current += 2;
                continue;
            }
            throw new TypeError('Illegal character: ' + char);
        }


        if (/[a-z]/i.test(char) || arabicLettersRegex.test(char) || (char === '$') || (char === '_')) {
            let value = '';
            while (char && ((/[a-z0-9]/i.test(char) || arabicNumeralsRegex.test(char)) || (char === '$') || (char === '_') || arabicLettersRegex.test(char)) || (char === '-')) {
                value += convertArabicNumeralsToEnglish(char);
                char = input[++current];
            }
            if (variableDeclarators.includes(value) || variableDeclaratorsArabic.includes(value)) {
                var variableDec = variableDeclarators.includes(value) ? value : variableDeclarators[variableDeclaratorsArabic.indexOf(value)];
                tokens.push({
                    type: 'variableDeclarator',
                    value: variableDec,
                });
                continue;
            }

            if (['true', 'false', 'نعم', 'لا'].includes(value)) {
                tokens.push({
                    type: 'BooleanLiteral',
                    value: ['true', 'نعم'].includes(value) ? true : false
                });
                continue;
            }

            if (keywords.includes(value) || ArabicKeywords.includes(value)) {
                tokens.push({
                    type: 'Keyword',
                    value: keywords.includes(value) ? value : keywords[ArabicKeywords.indexOf(value)],
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
            if (current < input.length - 1 && input[current + 1] === char) {
                tokens.push({
                    type: 'increment_decrement_operator',
                    value: `${char}${char}`,
                });
                current += 2;
                continue;
            }
            if (current < input.length - 1 && input[current + 1] === '=') {
                tokens.push({
                    type: 'assignment_operator',
                    value: `${char}=`,
                });
                current += 2;
                continue;
            }
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

        if (/\s/.test(char)) {
            current++;
            continue;
        }

        throw new TypeError('Unknown character: ' + char);
    }

    return tokens;
}

// Helper methods:

function convertArabicNumeralsToEnglish (input) {
    return input.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return d.charCodeAt(0) - 1632;
    }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
        return d.charCodeAt(0) - 1776;
    });
}

function stripComments(input) {
    let lines = input.split('\n');
    let inMultilineComment = false;
    let output = '';

    for (let line of lines) {
        let trimmed = line.trim();

        if (!inMultilineComment && trimmed.startsWith('/*')) {
            inMultilineComment = true;
        }

        if (inMultilineComment && trimmed.endsWith('*/')) {
            inMultilineComment = false;
            continue;
        }

        if (inMultilineComment) {
            continue;
        }

        if (trimmed.startsWith('//')) {
            continue;
        }

        // not a comment. Well, this line is but not the line in the code (:
        output += line + '\n';
    }

    return output;
}

export default tokenizer;