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
            default:
              return traverse();
          }
    }

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
        var parsed = traverseCallee();
        while (getToken() && getToken().type === 'multiplicativeOperator') {
            var operator = getToken().value;
            current++;
            var right = traverseCallee();
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
          current++;
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
    
        return call_expr;
    }

    function traverseCalleeMember() {
        let object = traverseUnaryExpressions();
        
        while (
          getToken().type === 'dot' || getToken().type === 'open_bracket'
        ) {
          current++;
          let property;
          let computed;
    
          if (getToken().type === 'dot') {
            computed = false;
            property = traverseUnaryExpressions();
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
        const args = getToken().type === 'right_parenthesis'
          ? []
          : parseArgumentsList();
    
        validateToken('right_parenthesis');
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
                argument: traversePrimary(),
                prefix: true
            };
        }
        if (getToken().type === 'minus_operator') {
            current++;
            return {
                type: 'UnaryExpression',
                operator: '-',
                argument: traversePrimary(),
                prefix: true
            };
        }

        return traversePrimary();
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