import {EditorState} from "@codemirror/state"
import { python } from "@codemirror/lang-python"
import {
    EditorView, keymap, highlightSpecialChars, drawSelection,
    highlightActiveLine, dropCursor, rectangularSelection,
    crosshairCursor, lineNumbers, highlightActiveLineGutter
} from "@codemirror/view"
import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput,
    bracketMatching, foldGutter, foldKeymap
} from "@codemirror/language"
import {
    defaultKeymap, history, historyKeymap, indentWithTab
} from "@codemirror/commands"
import {
    searchKeymap, highlightSelectionMatches
} from "@codemirror/search"
import {
    acceptCompletion,autocompletion, completionKeymap, closeBrackets,
    closeBracketsKeymap
} from "@codemirror/autocomplete"
import {lintKeymap} from "@codemirror/lint"


export function createEditor(target, initialDoc = "", onChange) {
    // Optional: Safety check to avoid duplicates
    if (target.innerHTML !== "") target.innerHTML = "";

    let myTheme = EditorView.theme({
        "&": {
            minWidth: "400px",
            width: "fit-content",
            margin: "0 auto"

        },
        ".cm-scroller": { overflow: "auto" },
        ".cm-content, .cm-gutter": { minHeight: "150px" }

    }, {dark: false})

    return new EditorView({
        doc: initialDoc,
        extensions: [
            python(),
            myTheme,
            EditorView.updateListener.of((update) => {
                if (update.docChanged && onChange) {
                    //Call onChange function from App.jsx
                    onChange(update.state.doc.toString());
                }
            }),
            // A line number gutter
            lineNumbers(),
            // A gutter with code folding markers
            foldGutter(),
            // Replace non-printable characters with placeholders
            highlightSpecialChars(),
            // The undo history
            history(),
            // Replace native cursor/selection with our own
            drawSelection(),
            // Show a drop cursor when dragging over the editor
            dropCursor(),
            // Allow multiple cursors/selections
            EditorState.allowMultipleSelections.of(true),
            // Re-indent lines when typing specific input
            indentOnInput(),
            // Highlight syntax with a default style
            syntaxHighlighting(defaultHighlightStyle),
            // Highlight matching brackets near cursor
            bracketMatching(),
            // Automatically close brackets
            closeBrackets(),
            // Load the autocompletion system
            autocompletion(),
            // Allow alt-drag to select rectangular regions
            rectangularSelection(),
            // Change the cursor to a crosshair when holding alt
            crosshairCursor(),
            // Style the current line specially
            highlightActiveLine(),
            // Style the gutter for current line specially
            highlightActiveLineGutter(),
            // Highlight text that matches the selected text
            highlightSelectionMatches(),
            keymap.of([
                { key: "Tab", run: acceptCompletion },
                indentWithTab,
                // Closed-brackets aware backspace
                ...closeBracketsKeymap,
                // A large set of basic bindings
                ...defaultKeymap,
                // Search-related keys
                ...searchKeymap,
                // Redo/undo keys
                ...historyKeymap,
                // Code folding bindings
                ...foldKeymap,
                // Autocompletion keys
                ...completionKeymap,
                // Keys related to the linter system
                ...lintKeymap
            ])],
        parent: target
    });
}