import { assertEquals } from "https://deno.land/std@0.117.0/testing/asserts.ts";
import tokenizer from "../src/tokenizer.js";

Deno.test("Tokenizer - Numbers", () => {
    const input = '123 5 7.5 3.45 1.';
    const expected = [
        { type: 'number', value: '123' },
        { type: 'number', value: '5' },
        { type: 'number', value: '7.5' },
        { type: 'number', value: '3.45' },
        { type: 'number', value: '1.00' }
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - Strings", () => {
    const input = '"hello" "world"';
    const expected = [
        { type: 'StringLiteral', value: 'hello' },
        { type: 'StringLiteral', value: 'world' }
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - Identifiers", () => {
    const input = 'x y xy x39023 __myWorld أعداد-جديدة س';
    const expected = [
        { type: 'Identifier', value: 'x' },
        { type: 'Identifier', value: 'y' },
        { type: 'Identifier', value: 'xy' },
        { type: 'Identifier', value: 'x39023' },
        { type: 'Identifier', value: '__myWorld' },
        { type: 'Identifier', value: 'أعداد-جديدة' },
        { type: 'Identifier', value: 'س' }
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - Variable Declaration", () => {
    const input = 'عرف x = 10;';
    const expected = [
        {type: 'variableDeclarator', value: 'var'},
        {type: 'Identifier', value: 'x'},
        {type: 'assignment_operator', value: '='},
        {type: 'number', value: '10'},
        {type: 'semicolon', value: ';'}
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - Conditionals", () => {
    const input = 'if (x > 10) { return true; } else { return false; }';
    const expected = [
        {type: 'Keyword', value: 'if'},
        {type: 'left_parenthesis', value: '('},
        {type: 'Identifier', value: 'x'},
        {type: 'boolean_operator', value: '>'},
        {type: 'number', value: '10'},
        {type: 'right_parenthesis', value: ')'},
        {type: 'open_brace', value: '{'},
        {type: 'Keyword', value: 'return'},
        {type: 'BooleanLiteral', value: true},
        {type: 'semicolon', value: ';'},
        {type: 'close_brace', value: '}'},
        {type: 'Keyword', value: 'else'},
        {type: 'open_brace', value: '{'},
        {type: 'Keyword', value: 'return'},
        {type: 'BooleanLiteral', value: false},
        {type: 'semicolon', value: ';'},
        {type: 'close_brace', value: '}'}
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - Function Declaration", () => {
    const input = 'دالة test() { return x * 10; }';
    const expected = [
        {type: 'Keyword', value: 'function'},
        {type: 'Identifier', value: 'test'},
        {type: 'left_parenthesis', value: '('},
        {type: 'right_parenthesis', value: ')'},
        {type: 'open_brace', value: '{'},
        {type: 'Keyword', value: 'return'},
        {type: 'Identifier', value: 'x'},
        {type: 'multiplicativeOperator', value: '*'},
        {type: 'number', value: '10'},
        {type: 'semicolon', value: ';'},
        {type: 'close_brace', value: '}'}
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - Assignment", () => {
    const input = 'x = 5 + 10;';
    const expected = [
        {type: 'Identifier', value: 'x'},
        {type: 'assignment_operator', value: '='},
        {type: 'number', value: '5'},
        {type: 'additiveOperator', value: '+'},
        {type: 'number', value: '10'},
        {type: 'semicolon', value: ';'}
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - For Loop", () => {
    const input = 'for (var i = 0; i < 3; i++) { callback() };';
    const expected = [
        {type: 'Keyword', value: 'for'},
        {type: 'left_parenthesis', value: '('},
        {type: 'variableDeclarator', value: 'var'},
        {type: 'Identifier', value: 'i'},
        {type: 'assignment_operator', value: '='},
        {type: 'number', value: '0'},
        {type: 'semicolon', value: ';'},
        {type: 'Identifier', value: 'i'},
        {type: 'boolean_operator', value: '<'},
        {type: 'number', value: '3'},
        {type: 'semicolon', value: ';'},
        {type: 'Identifier', value: 'i'},
        {type: 'increment_decrement_operator', value: '++'},
        {type: 'right_parenthesis', value: ')'},
        {type: 'open_brace', value: '{'},
        {type: 'Identifier', value: 'callback'},
        {type: 'left_parenthesis', value: '('},
        {type: 'right_parenthesis', value: ')'},
        {type: 'close_brace', value: '}'},
        {type: 'semicolon', value: ';'}
    ];
    assertEquals(tokenizer(input), expected);
});

Deno.test("Tokenizer - While Loop", () => {
    const input = 'while (x < 10) { x += 1; };';
    const expected = [
        {type: 'Keyword', value: 'while'},
        {type: 'left_parenthesis', value: '('},
        {type: 'Identifier', value: 'x'},
        {type: 'boolean_operator', value: '<'},
        {type: 'number', value: '10'},
        {type: 'right_parenthesis', value: ')'},
        {type: 'open_brace', value: '{'},
        {type: 'Identifier', value: 'x'},
        {type: 'assignment_operator', value: '+='},
        {type: 'number', value: '1'},
        {type: 'semicolon', value: ';'},
        {type: 'close_brace', value: '}'},
        {type: 'semicolon', value: ';'}
    ];
    assertEquals(tokenizer(input), expected);
});


