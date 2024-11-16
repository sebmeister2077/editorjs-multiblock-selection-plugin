import { EditorVersions } from "../support/EditorVersions"


const versions: (EditorVersions["V26" | "V27" | "V28"])[] = ["2.26"]//, "2.26.0", '2.26.1', '2.26.2', '2.26.3', '2.26.4', '2.26.5', '2.27', '2.27.0', '2.27.1', '2.27.2', '2.28', '2.28.0', '2.28.1', '2.28.2']



describe("Versions 26-28", () => {

    beforeEach("Setup the editor page", () => {
        cy.visit("http://127.0.0.1:5500/local-testing.html")
    })
    for (let i = 0; i < versions.length; i++) {
        const version = versions[i];

        it(`Test version ${version}`, () => {

        })
    }
})