// generate JS code from AST
import { generateNativeFunctions } from './library/nativeFunctions.js';

function generate(node) {
        if (node.type === 'Root' && node.body == null) {
            throw new TypeError('Cannot run empty code.');
        }
        switch (node.type) {
            case 'Root':
                return node.body.map(generate).join('\n');
            case 'VariableDeclaration':
                return `${node.declarator || 'var'} ${generate(node.identifier)}${node.value ? ' = ' + generate(node.value) : ''}`;
            case 'FunctionDeclaration':
                return `function ${generate(node.id)}(${node.params.map(generate).join(', ')}) {${node.body.body.length > 0 ? '\n' + node.body.body.map(generate).join('\n') + '\n' : ''}}`;
            case 'ReturnStatement':
                return `return ${generate(node.argument)};`;
            case 'IfStatement':
                return generateIfStatement(node);
            case 'ForStatement':
                return `for (${generate(node.init)}; ${generate(node.test)}; ${generate(node.update)}) {${node.body.body.length > 0 ? '\n' + node.body.body.map(generate).join('\n') + '\n' : ''}}`;
            case 'WhileStatement':
                return `while (${generate(node.test)}) {${node.body.body.length > 0 ? '\n' + node.body.body.map(generate).join('\n') + '\n' : ''}}`;
            case 'AssignmentExpression':
                return `${generate(node.identifier)} ${node.operator} ${generate(node.value)};`;
            case 'ParenthesizedExpression':
                return `(${node.params.map(generate).join(', ')})`;
            case 'CallExpression':
                return `${generate(node.callee)}(${node.arguments.map(generate).join(', ')})`;
            case 'UpdateExpression':
                return node.prefix ? `${node.operator}${generate(node.argument)}` : `${generate(node.argument)}${node.operator}`;
            case 'MemberExpression':
                return `${generate(node.object)}.${generate(node.property)}`;
            case 'LogicalExpression':
                return `${generate(node.left)} ${node.operator} ${generate(node.right)}`;
            case 'NativeCallExpression':
                return generateNativeFunctions(node);
            case 'UnaryExpression':
                return `${node.operator}${generate(node.argument)}`;
            case 'BinaryExpression':
                return `${generate(node.left)} ${node.operator} ${generate(node.right)}`;
            case 'ObjectExpression':
                return `{${node.properties.map(generate).join(', ')}}`;
            case 'ArrayExpression':
                return `[${node.elements.map(generate).join(', ')}]`;
            case 'Property':
                return `${generate(node.key)}: ${generate(node.value)}`;
            case 'NumberLiteral':
                return node.value;
            case 'StringLiteral':
                return `"${node.value}"`;
            case 'BooleanLiteral':
                return node.value;
            case 'Identifier':
                return node.value;
            case 'null':
                return '';
            default:
                console.log(node);
                throw new TypeError("Unable to generate: " + node.type);
        }

}

function generateIfStatement(node) {
    let code = `if (${generate(node.test)}) {${node.consequent.body && node.consequent.body.length > 0 ? "\n" : ""}${node.consequent.body.map(generate).join('\n')}${node.consequent.body && node.consequent.body.length > 0 ? "\n" : ""}}`;
    if (node.alternate) {
        if (node.alternate.type === 'IfStatement') {
            code += ` else ${generateIfStatement(node.alternate)}`;
        } else {
            code += ` else {${node.alternate.body && node.alternate.body.length > 0 ? "\n" : ""}${node.alternate.body.map(generate).join('\n')}${node.alternate.body && node.alternate.body.length > 0 ? "\n" : ""}}`;
        }
    }
    return code;
}

export default generate;