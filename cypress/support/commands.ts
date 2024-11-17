import editorData from '../fixtures/editorData.json'


Cypress.Commands.add("applyEditorSelection", (startIndex: number, endIndex: number) => {
    const selectedBlockClass = "ce-block--selected"


    function getBlockElementById(index: number) {
        return cy.get(`.codex-editor__redactor .ce-block:nth-child(${index + 1})`)
    }

    cy.get(`.codex-editor__redactor .ce-block:nth-child(${startIndex + 1}) [contenteditable]`)
        .trigger('mousedown')
        .then(($el) => {
            const el = $el[0]
            const document = el.ownerDocument
            const range = document.createRange()
            range.selectNodeContents(el)
            document.getSelection().removeAllRanges()
            document.getSelection().addRange(range)
        })
        .trigger('mouseup')
    cy.document().then(doc => {
        doc.getSelection().removeAllRanges();
    })


    for (let i = startIndex; i < endIndex + 1; i++) {
        getBlockElementById(i).then($block => {
            $block.addClass(selectedBlockClass)
        })
    }
    cy.get(".codex-editor__redactor").trigger("click").trigger("mouseup")
})

Cypress.Commands.add("applyUnderline", () => {
    cy.get(".ce-inline-tool[data-tool=underline]")
        .click()
})

declare global {
    namespace Cypress {
        interface Chainable {
            applyEditorSelection(startIndex: number, endIndex: number): Cypress.Chainable<void>
            applyUnderline(): Cypress.Chainable<void>
        }
    }
    interface Window {
        isEditorReady: Promise<void>;
        editorVersion: string;
    }
}



export { }