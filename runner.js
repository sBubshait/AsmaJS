import compile from "./index.js";
import { exists } from "https://deno.land/std/fs/mod.ts";
import tokenizer from "./src/tokenizer.js";
import parse from "./src/parser.js";
import { spawn } from 'node:child_process';


function help() {
    console.log(`
Usage: Arjs [command] [args]

Commands:
  run [file]        Compile and run the given file
  compile [file]    Compile the given file
  repl              Start the interactive read–eval–print loop
  rppl              Start the interactive read-parse-print loop
  help              Show this help message
    `);
}
var s = `const prompt = require('prompt-sync')();`;

const runJSCode = async (jsCode) => {
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();

    const tempFileName = await Deno.makeTempFile({ prefix: 'temp', suffix: '.js' });
    await Deno.writeFile(tempFileName, encoder.encode(jsCode));
    
    const child = spawn('node', ['-e', jsCode], { stdio: 'inherit' });

    child.on('error', error => console.error(`Error: ${error.message}`));

    await Deno.remove(tempFileName);
}

const runCode = async (code) => {
    const jsCode = `${s}\n${compile(code)}`;
    await runJSCode(jsCode);
};

async function runFile(filepath) {
    if (!(await exists(filepath))) {
        console.error('File does not exist');
        return false;
    }

    const code = await Deno.readTextFile(filepath);
    return await runCode(code);
}

async function compileFile(filepath) {
    if (!(await exists(filepath))) {
        console.error('File does not exist');
        return false;
    }

    const code = await Deno.readTextFile(filepath);
    const compiledCode = compile(code);
    
    const outputFilepath = filepath.replace(/(\.[^\.]*)$/, '.compiled.js');

    await Deno.writeTextFile(outputFilepath, compiledCode);
    
    console.log(`Compiled file has been saved to ${outputFilepath}`);
}

async function rppl() {
    console.log('Welcome to the Arabic Programming Language RPPL!');
    while (true) {
        var input = prompt('>>> ');
        if (input === 'exit') {
            break;
        }
        var tokens = tokenizer(input);
        var output = parse(tokens);
        console.log(JSON.stringify(output, null, 2));
    }
}

async function runJSCodeRepl(jsCode) {
        const decoder = new TextDecoder("utf-8");
        const encoder = new TextEncoder();
        const tempFileName = await Deno.makeTempFile({ prefix: 'temp', suffix: '.js' });
        await Deno.writeFile(tempFileName, encoder.encode(jsCode));
    
        try {
            const process = Deno.run({
                cmd: ["deno", "run", "--allow-read", "--unstable", "--allow-write", tempFileName],
                stdin: "piped",
                stdout: "piped",
                stderr: "piped",
            });
    
            await process.stdin.write(new TextEncoder().encode("your input here\n"));
            await process.stdin.close();
    
            let output = await process.output();
            process.close();
            console.log(decoder.decode(output));
    
            await Deno.remove(tempFileName);
        } catch (error) {
            console.error("Error while running code: ", error);
        }
    }

async function repl() {
    console.log('Welcome to the Arabic Programming Language REPL!');
    while (true) {
        const input = prompt('>>> ');
        if (input === 'exit') {
            break;
        }
        const compiledCode = compile(input);
        const jsCode = `console.log(eval('${compiledCode}'));`;
        await runJSCodeRepl(jsCode);
    }
}


if (Deno.args.length === 0) {
    help();
} else {
    switch (Deno.args[0]) {
        case 'run':
            if (Deno.args.length < 2) {
                console.error('No file specified');
                Deno.exit(1);
            }
            await runFile(Deno.args[1]);
            break;
        case 'compile':
            if (Deno.args.length < 2) {
                console.error('No file specified');
                Deno.exit(1);
            }
            await compileFile(Deno.args[1]);
            break;
        case 'repl':
            await repl();
            break;
        case 'rppl':
            await rppl();
            break;
        case 'help':
            help();
            break;
        default:
            console.error(`Unknown command: ${Deno.args[0]}`);
            help();
    }
}