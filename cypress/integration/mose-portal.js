/// <reference types="Cypress" />

describe('Test Login and check function working with portal', function() {
	context('Logging in', () => {
	  beforeEach(() => {
		cy.visit('/')
	  })
	  //Test login
	  it('.type() - type into a DOM element', () => {
		cy.get(".mb-3 > .form-control").type('user1')
		cy.get(".mb-4 > .form-control").type('user1{enter}')
	  })
	})
})


