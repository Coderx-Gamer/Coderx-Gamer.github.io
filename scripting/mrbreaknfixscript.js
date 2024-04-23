require.config({
    paths: {
        'vs': 'https://unpkg.com/monaco-editor@latest/min/vs'
    }
});

require(['vs/editor/editor.main'], function () {
    var editor = monaco.editor.create(document.getElementById('container'), {
        value: `// Write your mrbreaknfixscript code here\n\nfunction main() {\n\tvar x = 10;\n\tlet y = "Hello, ";\n\tconst z = true;\n\n\tif (z) {\n\t\tconsole.log(y + "world!");\n\t} else {\n\t\tconsole.error("Oops, something went wrong.");\n\t}\n\n\tfor (var i = 0; i < x; i++) {\n\t\tif (i % 2 === 0) {\n\t\t\tconsole.warn("Even number: " + i);\n\t\t} else {\n\t\t\tconsole.warn("Odd number: " + i);\n\t\t}\n\t}\n\n\tvar arr = [1, 2, 3];\n\tfor (let num of arr) {\n\t\tconsole.log("Number: " + num);\n\t}\n\n\t// Testing error highlighting\n\terrorFunction(); // This should trigger an error\n}\n\nmain();`,
        language: 'mrbreaknfixscript'
    });

    monaco.languages.register({
        id: 'mrbreaknfixscript'
    });

    monaco.languages.setMonarchTokensProvider('mrbreaknfixscript', {
        tokenizer: {
            root: [
                [/\[error.*/, "custom-error"],
                [/\/\/.*$/, "comment"],
                [/\b(if|else|while|for)\b/, "keyword"],
                [/\b(function)\b/, "keyword.function"],
                [/\b(var|let|const)\b/, "keyword.variable"],
                [/\b(true|false)\b/, "keyword.boolean"],
                [/\b(null|undefined)\b/, "keyword.null"],
                [/\b(console)\b/, "keyword.console"],
                [/\b(log|error|warn)\b/, "keyword.console"],
                [/\b(string|number|boolean|object|undefined|null)\b/, "keyword.type"],
                [/\b(function|var|let|const)\s+\w+/, "keyword.declaration"],
                [/\b\d+\b/, "number"],
                [/\b\w+\b/, "identifier"],
                [/\s+/, "white"],
                [/[{}()\[\]]/, "delimiter.bracket"],
                [/[<>](?!@)/, "delimiter.angle"],
                [/@\w+/, "annotation"],
                [/[+\-*/^=!]=?/, "operator"],
                [/[\/]/, "delimiter.slash"],
                [/[\.,;]/, "delimiter.dot"],
                [/"([^"\\]|\\.)*$/, "string.invalid"],
                [/"/, "string", "@string_double"],
            ],
            string_double: [
                [/[^\\"]+/, "string"],
                [/\\./, "string.escape.invalid"],
                [/"/, "string", "@pop"]
            ],
        },
    });

    // Implement basic error validation
    monaco.editor.onDidCreateModel(function (model) {
        function validate() {
            var textToValidate = model.getValue();
            var markers = [];

            // Example: Mark any occurrence of "error" as an error
            var errorRegex = /\berror\b/g;
            var match;
            while ((match = errorRegex.exec(textToValidate)) !== null) {
                markers.push({
                    severity: monaco.MarkerSeverity.Error,
                    startLineNumber: model.getPositionAt(match.index).lineNumber,
                    startColumn: model.getPositionAt(match.index).column,
                    endLineNumber: model.getPositionAt(match.index + match[0].length).lineNumber,
                    endColumn: model.getPositionAt(match.index + match[0].length).column,
                    message: 'Error keyword found'
                });
            }

            monaco.editor.setModelMarkers(model, 'mrbreaknfixscript', markers);

            // Log markers for debugging
            console.log('Markers:', markers);
        }

        var handle = null;
        model.onDidChangeContent(() => {
            clearTimeout(handle);
            handle = setTimeout(() => validate(), 500);
        });
        validate();
    });

    const completionItemProvider = {
        provideCompletionItems: function (model, position) {
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column
            });

            const keywords = ['if', 'else', 'while', 'for', 'function', 'var', 'let', 'const', 'true', 'false', 'null', 'undefined', 'console', 'log', 'error', 'warn', 'string', 'number', 'boolean', 'object'];

            const suggestions = keywords.filter(keyword => keyword.startsWith(textUntilPosition));

            const completionItems = suggestions.map(keyword => ({
                label: keyword,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: keyword
            }));

            return {
                suggestions: completionItems
            };
        }
    };

    // Register the completion item provider for your custom language
    monaco.languages.registerCompletionItemProvider('mrbreaknfixscript', completionItemProvider);
});