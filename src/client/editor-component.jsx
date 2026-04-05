import { useEffect, useRef } from "react";
import { createEditor } from "./editor-utils";

export default function editorComponent(defaultText, onChange) {
    const containerRef = useRef(null);

    useEffect(() => {
        // Only run if the element exists in the DOM
        if (!containerRef.current) return;

        // Call the external initialization function
        const view = createEditor(containerRef.current, defaultText, onChange);

        // Prevent the "2 editors" bug
        return () => view.destroy();
    }, []);

    return <div ref={containerRef} />;
}