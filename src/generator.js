// generate JS code from AST
import { generateNativeFunctions } from './nativeFunctions.js';

function generate(node) {

        switch (node.type) {
            case 'Root':
                return node.body.map(generate).join('\n');
            case 'VariableDeclaration':
                return `${node.declarator || 'var'} ${generate(node.identifier)}${node.value ? ' = ' + generate(node.value) : ''};`;
            case 'FunctionDeclaration':
                return `function ${generate(node.id)}(${node.params.map(generate).join(', ')}) {${node.body.body.map(generate).join('\n')}}`;
            case 'ReturnStatement':
                return `return ${generate(node.argument)};`;
            case 'IfStatement':
                return `if (${generate(node.test)}) {${node.consequent.body.map(generate).join('\n')}}${node.alternate ? ` else {${node.alternate.body.map(generate).join('\n')}}` : ''}`;
            case 'AssignmentExpression':
                return `${generate(node.identifier)} = ${generate(node.value)};`;
            case 'CallExpression':
                return `(${node.params.map(generate).join(', ')})`;
            case 'CallExpr':
                return `${generate(node.callee)}(${node.args.map(generate).join(', ')})`;
            case 'NativeCallExpr':
                return generateNativeFunctions(node);
            case 'UnaryExpression':
                return `${node.operator}${generate(node.argument)}`;
            case 'BinaryExpression':
                return `${generate(node.left)} ${node.operator} ${generate(node.right)}`;
            case 'ObjectExpression':
                return `{${node.properties.map(generate).join(', ')}}`;
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
            default:
                throw new TypeError("Unable to generate: " + node.type);
        }

}

export default generate;