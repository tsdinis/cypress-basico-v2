//<reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    
    beforeEach(()=> {
        cy.visit("./src/index.html")
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        const longText = 'text text text text text text text text text text text text text text text text text text text text text text text ext text text text text text text text text text text text text text text text text text text text text text text '

        cy.get('[name="firstName"]').type('Tania')
        cy.get('[name="lastName"]').type('Dinis')
        cy.get('[type="email"]').type('email@mail.com')
        cy.get('[name="open-text-area"]').type(longText, {delay : 0}) // esta propriedade faz com que o texto seja adicionado + rapido, logo, o texte executa + rapido também 
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('[name="firstName"]').type('Tania')
        cy.get('[name="lastName"]').type('Dinis')
        cy.get('[type="email"]').type('email@mail')
        cy.get('[name="open-text-area"]').type('qual o preço das mentorias?', {delay : 0}) // esta propriedade faz com que o texto seja adicionado + rapido, logo, o texte executa + rapido também 
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })
   
    it('campo numero nao aceita caracteres não numericos', () => {
        cy.get('[type="number"]').type('asdf')
        cy.get('[type="number"]').should('be.empty');
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('[name="firstName"]').type('Tania')
        cy.get('[name="lastName"]').type('Dinis')
        cy.get('[type="email"]').type('email@mail.com')
        cy.get('[id="phone-checkbox"]').check()
        cy.get('[name="open-text-area"]').type("texto")
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('[name="firstName"]').type('Tania').should('have.value', 'Tania').clear().should('have.value', '')
        cy.get('[name="lastName"]').type('Dinis').should('have.value', 'Dinis').clear().should('have.value', '')
        cy.get('[type="email"]').type('email@mail.com').should('have.value', 'email@mail.com').clear().should('have.value', '')
        cy.get('#phone').type(2347).should('have.value', '2347').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select([1])
            .should('have.value', 'blog')  
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })
       
    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio) {
                cy.wrap($radio).check()
                .should('be.checked')
        })  
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[id="file-upload"]')
            .selectFile('cypress/fixtures/example.json')
            .then(input => {
                console.log(input)
                expect(input[0].files[0].name).to.equal('example.json')
        })  
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[id="file-upload"]').should('not.have.value')
            .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(function($input) {
                console.log($input)
                expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[id="file-upload"]').should('not.have.value').selectFile('@sampleFile')
            .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Talking About Testing').should('be.visible')
    })
})

