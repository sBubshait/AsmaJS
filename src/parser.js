import {nativeFunctions, nativeFunctionsArabic} from './nativeFunctions.js';

const NULL = {type: 'null', value: null};

var parse = (tokens) => {
    let current = 0;

    function isEnd() {
        return current >= tokens.length;
    }

    function getToken() {
        return tokens[current] || NULL;
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
                else if (getToken() && getToken().value === 'function')
                    return traverseFunctionDeclaration();
                else if (getToken() && getToken().value === 'for')
                    return traverseForStatement();
                else if (getToken() && getToken().value === 'while')
                    return traverseWhileStatement();
                return traverse();
            default:
              return traverse();
          }
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
        validateToken('assignment_operator');
        current++;
        var value = traverse();
        // validateToken('semicolon');
        // current++;
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
        if (getToken().type === 'semicolon') {
            current++;
        }
        return {
            type: 'ReturnStatement',
            argument: argument
        };
    }

    function traverseIfStatement() {
        current++; // skip 'if'
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
            if (getToken().type === 'Keyword' && getToken().value === 'if') { // else if	
                alternate = traverseIfStatement();  // recursive so allow nested	
            } else {	
                validateToken('open_brace');	
                current++;	
                alternate = traverseBlockStatement();	
            }
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
            let stmt = traverseStatement();
            if (stmt != NULL) {
                body.push(stmt);
            }
        }

        validateToken('close_brace');
        current++;

        return {
            type: 'BlockStatement',
            body: body
        }
    }

    function traverseFunctionDeclaration() {
        current++; // skip 'function'
        var identifier = validateToken('Identifier');
        current++;
        validateToken('left_parenthesis');
        current++;
        var params = [];
        while (!isEnd() && getToken().type !== 'right_parenthesis') {
            params.push(validateToken('Identifier'));
            current++;
            if (getToken().type === 'comma') {
                current++;
            }
        }
        validateToken('right_parenthesis');
        current++;
        validateToken('open_brace');
        current++;
        var body = traverseBlockStatement();

        return {
            type: 'FunctionDeclaration',
            id: identifier,
            params,
            body
        }

        
    }

    function traverseForStatement() {
        current++; // skip 'for'
        validateToken('left_parenthesis');
        current++;
        let init = traverseStatement(); // e.g., var i = 0
        validateToken('semicolon');
        current++;
        let test = traverse(); // e.g., i < 5
        validateToken('semicolon');
        current++;
        let update = traverse(); // e.g., i = i + 1 or i++;
        validateToken('right_parenthesis');
        current++;
        validateToken('open_brace');
        current++;
        let body = traverseBlockStatement();
        
        return {
            type: 'ForStatement',
            init,
            test,
            update,
            body
        };

    }

    function traverseWhileStatement() {
        current++; // skip 'while'
        validateToken('left_parenthesis');
        current++;
        let test = traverse(); // e.g., i < 5
        validateToken('right_parenthesis');
        current++;
        validateToken('open_brace');
        current++;
        let body = traverseBlockStatement();

        return {
            type: 'WhileStatement',
            test,
            body
        };
    }

    // traverse expressions main function. Starts from the lowest precedence and works its way up.
    function traverse() {
        return traverseAssignment();
    }
    
    function traverseAssignment() {
        var left = traverseLogicalOROperator();
        if (getToken().type === 'assignment_operator' && left.type === 'Identifier') {
            var operator = getToken().value;
            current++;
            var right = traverseAssignment();
            return {
                type: 'AssignmentExpression',
                operator,
                identifier: left,
                value: right
            }
         }
        return left;
    }

    function traverseLogicalOROperator() {
        var left = traverseLogicalANDOperator();
        while (!isEnd() && (getToken().type === 'logical_operator' && getToken().value === '||')) {
            var operator = getToken().value;
            current++;
            var right = traverseLogicalANDOperator();
            left = {
                type: 'LogicalExpression',
                operator: operator,
                left: left,
                right: right,
            };
        }

        return left;
    }

    function traverseLogicalANDOperator() {
        var left = traverseObject();
        while (!isEnd() && (getToken().type === 'logical_operator' && getToken().value === '&&')) {
            var operator = getToken().value;
            current++;
            var right = traverseObject();
            left = {
                type: 'LogicalExpression',
                operator: operator,
                left: left,
                right: right,
            };
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
          type: "CallExpression",
          callee,
          arguments: parseArgs(),
        };
        if (callee.type == "Identifier" && (nativeFunctions.includes(callee.value) || nativeFunctionsArabic.includes(callee.value))) {
            call_expr.type = "NativeCallExpression";
            call_expr.callee = nativeFunctions.includes(callee.value) ? callee : {type: callee.type, value: nativeFunctions[nativeFunctionsArabic.indexOf(callee.value)]};
        }
        
        if (getToken().type === 'left_parenthesis') {
          call_expr = parseCallExpr(call_expr);
        }
        // if (getToken().type === 'semicolon')
        //     current++;
        return call_expr;
    }

    function parseArgs() {
        validateToken('left_parenthesis');
        current++; 
        if (getToken().type === 'right_parenthesis') {
            current++;
            return [];
        }

        const args = [traverseAssignment()];
        while (getToken().type === 'comma' && !isEnd()) {
            current++;
            args.push(traverseAssignment());
        }
    
        validateToken('right_parenthesis');
        current++;

        return args;
    }
   
    function traverseCalleeMember() {
        let object = traversePrimary();
        
        while (getToken().type === 'dot' || getToken().type === 'open_bracket') {
          let property;
          let computed;
          current++;

          if (tokens[current - 1].type === 'dot') {
            computed = false;
            property = traversePrimary();
            validateToken('Identifier', property);
          } else {
            computed = true;
            property = traverse();
            validateToken('close_bracket') // i.e., [...]
          }
    
          object = {
            type: "MemberExpression",
            object,
            property,
            computed,
          };
        }
    
        return object;
    }
    

    function traverseUnaryExpressions() {
        // Prefix Increment/Decrement = UpdateExpression
        if (getToken().type === 'increment_decrement_operator') {
            const operator = getToken().value;
            current++;
            return {
                type: 'UpdateExpression',
                operator,
                argument: traversePostfixUnaryExpressions(),
                prefix: true
            };
        }

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

        return traversePostfixUnaryExpressions();
    }

    function traversePostfixUnaryExpressions() {
        var parsed = traverseCallee();
        if (getToken().type === 'increment_decrement_operator') {
            const operator = getToken().value;
            current++;
            return {
                type: 'UpdateExpression',
                operator,
                argument: parsed,
                prefix: false
            };
        }
        return parsed;
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

        if (token.type === 'StringLiteral') {
            current++;
            return token;
        }

        if (token.type === 'number') {
            current++;
            return {
                type: 'NumberLiteral',
                value: Number(token.value),
            };
        }
        if (token.type === 'left_parenthesis') {
            token = tokens[++current];
            const expression = {
              type: 'ParenthesizedExpression',
              params: [traverse()]
            };
            validateToken('right_parenthesis');
            current++;
            return expression;
        }
        if (token.type === 'semicolon') {
            current++;
            return NULL;
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
        body: [],
    };
    
    while(!isEnd()) {
        var stmt = traverseStatement();
        if (stmt != NULL && stmt) 
            AST.body.push(stmt);
    }

    return AST;
}

export default parse;