import { EditorVersions } from '../support/EditorVersions'
import editorData from '../fixtures/editorData.json'

const versions: EditorVersions['V26' | 'V27' | 'V28'][] = ['2.26'] //, "2.26.0", '2.26.1', '2.26.2', '2.26.3', '2.26.4', '2.26.5', '2.27', '2.27.0', '2.27.1', '2.27.2', '2.28', '2.28.0', '2.28.1', '2.28.2']

describe('Versions 26-28', () => {
    beforeEach('Setup the editor page', () => {
        cy.visit('http://127.0.0.1:5500/local-testing.html', {
            onBeforeLoad(win) {
                win.localStorage.setItem('editorjs-data-testing', JSON.stringify(editorData))
            },
        })

        cy.window().then((win) => {
            return new Cypress.Promise((resolve) => {
                win.isEditorReady.then(resolve)
            })
        })

        cy.get("head").then(head => {
            head[0].insertAdjacentHTML("beforeend", `<style>*{
                font-size:1.5rem !important;
            }</style>`)
        })
    })


    for (let i = 0; i < versions.length; i++) {
        const version = versions[i]


        const underlineToolSelector = '.ce-inline-tool[data-tool=underline]'
        it(`Test version ${version}`, () => {
            // Apply selection to the last 3 blocks
            const startBlockIndex = 1
            const endBlockIndex = editorData.blocks.length - 1;
            const maxIndex = Math.max(startBlockIndex, endBlockIndex);
            const minIndex = Math.min(startBlockIndex, endBlockIndex);
            const amountOfExpectedBlocks = maxIndex - minIndex + 1;


            cy.applyEditorSelection(startBlockIndex, endBlockIndex);
            cy.get('.ce-inline-toolbar')
                .should('have.class', 'ce-inline-toolbar--showed')
                .find(underlineToolSelector)
                .should('exist');

            const expectedBlocks = cy.get(`.ce-block:nth-child(-n+${maxIndex + 1}):nth-child(n+${minIndex + 1})`)
            expectedBlocks
                .should("have.length", amountOfExpectedBlocks)
                .should("have.class", "ce-block--selected")
                .should("have.class", 'ce-custom-block-selection')


            // Make selected blocks underlined
            cy.applyUnderline();
            expectedBlocks.find("u").should("have.length", amountOfExpectedBlocks);



            // Make no blocks underlined
            cy.applyUnderline();
            cy.get(".ce-block u").should("have.length", 0);


            // Verify toolbar closes when clicking outside
            cy.get('.codex-editor__redactor').click();
            expectedBlocks
                .should("not.have.class", "ce-block--selected")
                .should("not.have.class", 'ce-custom-block-selection')

            cy.get('.ce-inline-toolbar')
                .should('not.have.class', 'ce-inline-toolbar--showed')
        })










        // it("Apply underline and ckeck all blocks are underlined", () => {

        //TODO test toolbar closes when clicking outside
    }

})
