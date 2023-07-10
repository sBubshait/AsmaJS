import {nativeFunctions, nativeFunctionsArabic} from './nativeFunctions.js';

var parse = (tokens) => {
    let current = 0;

    function isEnd() {
        return current == tokens.length;
    }

    function getToken() {
        return tokens[current] || {
            type: 'null',
            value: null
        };
    }

    function nextToken() {
        return tokens[current + 1] || null;
    }

    function traverseStatement() {
        switch (getToken().type) {
            case 'variableDeclarator':
              return traverseVariableDeclaration();
            case 'Keyword':
                if (getToken() && getToken().value === 'return')
                    return traverseReturnStatement();
                else if (getToken() && getToken().value === 'if')
                    return traverseIfStatement();
                return traverse();
            default:
              return traverse();
          }
    }

    
    function traverseVariableDeclaration() {
        console.log(tokens[current])
        var declarator = validateToken('variableDeclarator');
        current++;
        var identifier = validateToken('Identifier');
        current++;
        if (getToken().type === 'semicolon') {
            current++;
            return {
                type: 'VariableDeclaration',
                declarator: declarator.value,
                identifier: identifier
            };
        }
        validateToken('assignment_operator');
        current++;
        var value = traverse();
        validateToken('semicolon');
        current++;
        return {
            type: 'VariableDeclaration',
            declarator: declarator.value,
            identifier: identifier,
            value: value
        };
    }

    function traverseReturnStatement() {
        current++;
        var argument = traverse();
        return {
            type: 'ReturnStatement',
            argument: argument
        };
    }

    function traverseIfStatement() {
        current++; // skip if
        validateToken('left_parenthesis');
        current++;
        var condition = traverse();
        validateToken('right_parenthesis');
        current++;
        validateToken('open_brace');
        current++;
        var consequent = traverseBlockStatement();
        let alternate = null;
        
        if (getToken().type === 'Keyword' && getToken().value === 'else') {
            current++;
            validateToken('open_brace');
            current++;
            alternate = traverseBlockStatement();
        }


        return {
            type: 'IfStatement',
            test: condition,
            consequent,
            alternate
        }

    }

    function traverseBlockStatement() {
        var body = [];
        while (getToken().type !== 'close_brace' && !isEnd()) {
            body.push(traverseStatement());
        }

        validateToken('close_brace');
        current++;

        return {
            type: 'BlockStatement',
            body: body
        }
    }

    // traverse expressions main function. Starts from the lowest precedence and works its way up.
    function traverse() {
        return traverseAssignment();
    }
    
    function traverseAssignment() {
        var left = traverseObject();
        if (getToken().type === 'assignment_operator' && left.type === 'Identifier') {
            current++;
            var right = traverseBooleanOperators();
            return {
                type: 'AssignmentExpression',
                identifier: left,
                value: right
            }
         }
        return left;
    }

    function traverseObject() {
        // {}
        if (getToken().type === 'open_brace') {
            current++;
            
            // Now iterate over the properties. 
            var properties = [];
            while (getToken().type !== 'close_brace' && !isEnd()) {
                // properties are in form: key: value, where key = Identifier, value = Expression
                var key = validateToken('Identifier');
                current++;
                validateToken('colon');
                current++;
                var value = traverse();
                properties.push({
                    type: 'Property',
                    key: key,
                    value: value
                });
                if (getToken().type === 'comma') {
                    current++;
                }
            }
            validateToken('close_brace');
            current++;
            return {
                type: 'ObjectExpression',
                properties: properties
            }
        }else return traverseBooleanOperators();
    }

    function traverseBooleanOperators() {
        var parsed = traverseAdditive();
        while (!isEnd() && getToken().type === 'boolean_operator') {
            var operator = getToken().value;
            current++;
            var right = traverseAdditive();
            parsed = {
                type: 'BinaryExpression',
                operator: operator,
                left: parsed,
                right: right,
            };
        }

        return parsed;
    }

    function traverseAdditive() {
        var parsed = traverseMultiplicative();
        while (getToken() && getToken().type === 'additiveOperator') {
            var operator = getToken().value;
            current++;
            var right = traverseMultiplicative();
            parsed = {
                type: 'BinaryExpression',
                operator: operator,
                left: parsed,
                right: right,
            };
        }

        return parsed;
    }

    function traverseMultiplicative() {
        var parsed = traverseUnaryExpressions(); 
        while (getToken() && getToken().type === 'multiplicativeOperator') {
            var operator = getToken().value;
            current++;
            var right = traverseUnaryExpressions();
            parsed = {
                type: 'BinaryExpression',
                operator: operator,
                left: parsed,
                right: right,
            };
        }

        return parsed;
    }

    function traverseCallee() {
        let member = traverseCalleeMember();
    
        if (getToken().type === 'left_parenthesis') {
          return parseCallExpr(member);
        }
    
        return member;
    }

    function parseCallExpr(callee) {
        
        let call_expr = {
          type: "CallExpr",
          callee,
          args: parseArgs(),
        };
        if (callee.type == "Identifier" && (nativeFunctions.includes(callee.value) || nativeFunctionsArabic.includes(callee.value))) {
            call_expr.type = "NativeCallExpr";
            call_expr.callee = nativeFunctions.includes(callee.value) ? callee : {type: callee.type, value: nativeFunctions[nativeFunctionsArabic.indexOf(callee.value)]};
        }
    
        if (getToken().type === 'left_parenthesis') {
          call_expr = parseCallExpr(call_expr);
        }
        current++;
        return call_expr;
    }

    function traverseCalleeMember() {
        let object = traversePrimary();
        
        while (
          getToken().type === 'dot' || getToken().type === 'open_bracket'
        ) {
          current++;
          let property;
          let computed;
    
          if (getToken().type === 'dot') {
            computed = false;
            property = traversePrimary();
            validateToken('Identifier', property);
          } else {
            computed = true;
            property = traverse();
            validateToken('close_bracket') // i.e., [...]
          }
    
          object = {
            kind: "MemberExpr",
            object,
            property,
            computed,
          };
        }
    
        return object;
    }
    function parseArgs() {
        validateToken('left_parenthesis');
        current++;
        const args = getToken().type === 'right_parenthesis'
          ? []
          : parseArgumentsList();

        validateToken('right_parenthesis');
        current++;
        return args;
    }
    
    function parseArgumentsList() {
        const args = [traverseAssignment()];
        while (getToken().type === 'comma' && !isEnd()) {
            current++;
            args.push(traverseAssignment());
        }
    
        return args;
    }

    function traverseUnaryExpressions() {
        if (getToken().type === 'not_operator') {
            current++;
            return {
                type: 'UnaryExpression',
                operator: '!',
                argument: traverseUnaryExpressions(),
                prefix: true
            };
        }
        if (getToken().type === 'additiveOperator' && getToken().value === '-') {
            current++;
            return {
                type: 'UnaryExpression',
                operator: '-',
                argument: traverseUnaryExpressions(),
                prefix: true
            };
        }

        return traverseCallee();
    }

    function traversePrimary() {
        var token = getToken();
        if (!token) return false;
        

        if (token.type === 'BooleanLiteral') {
            current++;
            return token;
        }
        
        if (token.type === 'Identifier') {
            current++;
            return token;
        }

        if (token.type === 'number') {
            current++;
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }
        if (token.type === 'left_parenthesis') {
            token = tokens[++current];
            const expression = {
              type: 'CallExpression',
              params: [traverse()]
            };
            validateToken('right_parenthesis');
            current++;
            return expression;
        }
        if (token.type === 'semicolon') {
            return;
        }
        throw new TypeError(`Unable to parse. Unknown Token: '${token.value}' of type '${token.type}'`);
    }

    function validateToken(expected, token = tokens[current]) {
        if (!token || token.type !== expected) {
            throw new TypeError(`Expected token '${expected}' but found ${token ? "'" + token.type + "'" : "nothing"}.`);
        }
        return token;
    }

    const AST = {
        type: 'Root',
        body: [traverseStatement()],
    };

    return AST;
}

export default parse;