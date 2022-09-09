/* eslint-disable no-undef */
before(() => {
  cy.seedMediaData()
  cy.wait(3000)
})
after(() => {
  cy.restoreMediaData()
})
beforeEach(() => {
  cy.visit('http://localhost:8080')
})

describe('Media Selection view', () => {
  it('should see a ligtning canvas', () => {
    cy.get('canvas')
  })
  it('should not go left past the first element', () => {
    cy.wait(3000)
    cy.get('body').trigger('keydown', { keyCode: 37 }) // tap left arrow
    cy.wait(3000)
    cy.get('body').toMatchImageSnapshot()
  })
  it('should highlight 2nd media element', () => {
    cy.wait(3000)
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.wait(3000)
    cy.get('body').toMatchImageSnapshot()
  })
  it('should highlight 4th media element', () => {
    cy.wait(3000)
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.wait(3000)
    cy.get('body').toMatchImageSnapshot()
  })
  it('should highlight 5th media element', () => {
    cy.wait(3000)
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 37 }) // tap left arrow
    cy.wait(3000)
    cy.get('body').toMatchImageSnapshot()
  })
  it('should not go right past the last element', () => {
    cy.wait(3000)
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.get('body').trigger('keydown', { keyCode: 39 }) // tap right arrow
    cy.wait(3000)
    cy.get('body').toMatchImageSnapshot()
  })
  it('Dummy test to force after to trigger if a test fails', () => {
    cy.get('body')
  })
})
