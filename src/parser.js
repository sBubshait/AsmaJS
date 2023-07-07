


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
        if (getToken().type === 'equal' && left.type === 'Identifier') {
            current++;
            var right = traverseAdditive();
            return {
                type: 'AssignmentExpression',
                identifier: left,
                value: right
            }
         }
        return left;
    }
    
    function traverseVariableDeclaration() {
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
        validateToken('equal');
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
        }else return traverseAdditive();
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

    function parseCallExpr(caller) {
        let call_expr = {
          type: "CallExpr",
          caller,
          args: parseArgs(),
        };
    
        if (getToken().type === 'left_parenthesis') {
          call_expr = parseCallExpr(call_expr);
        }
    
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
            property = parsePrimaryExpr();
            validateToken(property, 'Identifier');
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
        current++;
        while (getToken().type === 'comma' && !isEnd()) {
          args.push(traverseAssignment());
          current++;
        }
    
        return args;
    }

    function traversePrimary() {
        var token = getToken();
        if (!token) return false;
        

        if (token.type === 'text' && ['true', 'false', 'نعم', 'لا'].includes(token.value)) {
            current++;
            return {
                type: 'BooleanLiteral',
                value: true ? ['true', 'نعم'].includes(token.value) : false,
            }
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
        throw new TypeError(`Unable to parse. Unknown Token: '${token.value}'`);
    }

    

    function validateToken(expected) {
        if (!getToken() || getToken().type !== expected) {
            throw new TypeError(`Expected token '${expected}' but found ${getToken() ? "'" + getToken().type + "'" : "nothing"}.`);
        }
        return getToken();
    }

    function validateToken(token, expected) {
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