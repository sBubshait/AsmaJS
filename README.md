# AsmaJS 🌙💻

Welcome to AsmaJS, the Arabic-oriented compiled programming language that seamlessly translates into JavaScript. Our goal is to foster linguistic diversity in tech, making coding more accessible for Arabic speakers. 

## Prerequisites 📝

Before you can use AsmaJS, you will need to install the following software:

- [Deno](https://deno.land/#installation): Deno is a secure runtime for JavaScript and TypeScript, and it is used to execute AsmaJS code. Follow the instructions on the Deno website to install it.

- [Node.js](https://nodejs.org/en/download/): Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js is used by npm, the package manager for JavaScript, to install AsmaJS's dependencies. Follow the instructions on the Node.js website to install it.

## Getting Started 🏁
After you've installed the prerequisites, you can install AsmaJS by following these steps:

1. Clone the AsmaJS repository:

    ```bash
    git clone https://github.com/sBubshait/AsmaJS.git
    ```

2. Navigate to the cloned repository:

    ```bash
    cd AsmaJS
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Install the AsmaJS runner:

    ```bash
    deno install -n Arjs --allow-all --unstable runner.js -f
    ```

5. You're all set! You can now use the `Arjs` command to run, compile, and interact with AsmaJS code. Here's a quick rundown of the available commands:

    - `Arjs run [file]`: Compile and run the given file
    - `Arjs compile [file]`: Compile the given file, generating the compiled JavaScript file.
    - `Arjs repl`: Start the interactive read–eval–print loop
    - `Arjs rppl`: Start the interactive read-parse-print loop
    - `Arjs help`: Show the help message

## Features 🚀
### Current Features ✅
- **Basic Binary Expressions**: AsmaJS supports basic binary operations like addition, subtraction, multiplication, and division, as well as well as boolean operations like AND, OR, and NOT.
- **Simple Expressions**: The language can process and evaluate simple arithmetic and logical expressions.
- **Function Calls**: AsmaJS currently supports function calls, both built-in and user-defined functions.
- **Objects**: AsmaJS allows object creation and manipulation, extending the power of JavaScript's object-oriented programming to Arabic syntax.
- **Variable Declaration**: The language supports variable declaration and assignment, allowing users to store and manipulate data.


### To-Do List 📝
Here's what's on the horizon:

- [ ] **User-defined functions**: Allow users to define their own functions.
- [ ] **Native functions**: Add support for more native functions.
- [ ] **Conditional Statements**: Add support for if-else constructs and switch-case statements.
- [ ] **Loops**: Implement for, while, and do-while loops.
- [ ] **Advanced Expressions**: Extend support for more complex expressions and operations.
- [ ] **Array Handling**: Enable the creation, manipulation, and traversal of arrays.
- [ ] **Error Handling**: Develop a robust error handling system with useful feedback.
- [ ] **Asynchronous Programming**: Provide support for promises, async/await.
- [ ] **Modules**: Allow module creation and import/export functionality.
- [ ] **Standard Library**: Develop a comprehensive standard library with common functions.
- [ ] **Testing Framework**: Create a built-in testing framework for robust application development.
- [ ] **Tooling**: Build more tools and IDE support to make coding in AsmaJS as smooth as possible.

## License 📝
AsmaJS is licensed under the [MIT License](LICENSE). Please see the license file for more information.

Thank you for visiting AsmaJS! We hope you'll join us on this exciting journey as we work to make programming more inclusive and accessible for everyone. If you have any questions or suggestions, don't hesitate to open an issue. Happy coding! 🎉💻🚀