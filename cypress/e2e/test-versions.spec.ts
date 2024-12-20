import { EditorVersions } from '../support/EditorVersions'
import editorData from '../fixtures/editorData.json'

const versions: EditorVersions[keyof EditorVersions][] = [
    "2.18", "2.18.0", '2.19', '2.19.0', '2.19.1', '2.19.2', '2.19.3', '2.20', '2.20.0', '2.20.1', '2.20.2', '2.21', '2.21.0', '2.22', '2.22.0', '2.22.1', '2.22.2', '2.22.3', '2.23', '2.23.0', '2.23.1', '2.23.2', '2.24', '2.24.0', '2.24.1', '2.24.2', '2.24.3', '2.25', '2.25.0', '2.26', "2.26.0", '2.26.1', '2.26.2', '2.26.3', '2.26.4', '2.26.5', '2.27', '2.27.0', '2.27.1', '2.27.2', '2.28', '2.28.0', '2.28.1', '2.28.2',
]
// tests not working for 29-30 yet
//   '2.29', '2.29.0', '2.29.1', '2.29.2', '2.30', '2.30.1', '2.30.2', '2.30.3', '2.30.4', '2.30.5', '2.30.6', '2.30.7']

describe('Versions 20-28', () => {
    beforeEach('Setup the editor page', () => {
        cy.visit('http://127.0.0.1:5500/local-testing.html', {
            onBeforeLoad(win) {
                win.localStorage.setItem('editorjs-data-testing', JSON.stringify(editorData))
            },

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
            const data = {
                isResolved: false,
                resolveProm: () => { }
            }
            cy.window().then(win => {
                win.editorVersion = version;
                const script = document.createElement("script");
                script.onload = () => {
                    data.isResolved = true;
                    data.resolveProm();
                    win.dispatchEvent(new CustomEvent("loadded-editorjs-script"))
                }
                script.src = `https://cdn.jsdelivr.net/npm/@editorjs/editorjs@${version}`
                win.document.head.append(script)
            })

            cy.window().then(() => {
                return new Cypress.Promise(res => {
                    if (data.isResolved)
                        res();
                    else
                        data.resolveProm = res;
                })
            })
            cy.window().then((win) => {
                return new Cypress.Promise((resolve) => {
                    console.log(win.isEditorReady)
                    win.isEditorReady.then(resolve)
                })
            })
            // Apply selection to the last 3 blocks
            const startBlockIndex = 1
            const endBlockIndex = editorData.blocks.length - 1;
            const maxIndex = Math.max(startBlockIndex, endBlockIndex);
            const minIndex = Math.min(startBlockIndex, endBlockIndex);
            const amountOfExpectedBlocks = maxIndex - minIndex + 1;


            cy.applyEditorSelection(startBlockIndex, endBlockIndex, version);
            cy.get('.ce-inline-toolbar')
                .should('have.class', 'ce-inline-toolbar--showed')
                .find(underlineToolSelector)
                .should('exist');

            const getExpectedBlocks = () => cy.get(`.ce-block:nth-child(-n+${maxIndex + 1}):nth-child(n+${minIndex + 1})`)
            getExpectedBlocks()
                .should("have.length", amountOfExpectedBlocks)
                .should("have.class", "ce-block--selected")
                .should("have.class", 'ce-custom-block-selection')


            // Make selected blocks underlined
            cy.applyUnderline();
            getExpectedBlocks().find("u").should("have.length", amountOfExpectedBlocks);

            // Make no blocks underlined
            cy.applyUnderline();
            cy.get(".ce-block u").should("have.length", 0);


            // Verify toolbar closes when clicking outside
            cy.get('.codex-editor__redactor').click();
            getExpectedBlocks()
                .should("not.have.class", "ce-block--selected")
                .should("not.have.class", 'ce-custom-block-selection')

            cy.get('.ce-inline-toolbar')
                .should('not.have.class', 'ce-inline-toolbar--showed')
        })










        // it("Apply underline and ckeck all blocks are underlined", () => {

        //TODO test toolbar closes when clicking outside
    }

})
