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
    //Ensures target is empty
    if (target.innerHTML !== "") target.innerHTML = "";

    //CSS theme for editor
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
        //Extension list provides functionality for editor
        extensions: [
            python(),
            myTheme,
            EditorView.updateListener.of((update) => {
                if (update.docChanged && onChange) {
                    //Call onChange function from App.jsx
                    onChange(update.state.doc.toString());
                }
            }),
            //Many QOL editor features
            lineNumbers(),
            foldGutter(),
            highlightSpecialChars(),
            history(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            syntaxHighlighting(defaultHighlightStyle),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLineGutter(),
            highlightSelectionMatches(),
            //Keymap changes key functionality when editor is selected
            keymap.of([
                { key: "Tab", run: acceptCompletion },
                indentWithTab,
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
                ...lintKeymap
            ])],
        parent: target
    });
}