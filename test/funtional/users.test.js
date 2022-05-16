'use strict';

// requires for testing
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { expect } = Code;
const lab = (exports.lab = Lab.script());

// use some BDD verbage instead of lab default
const { describe, it, after } = lab;

// require hapi server
const server = require('../../app.js');

require('dotenv').config();

// tests
describe('functional tests - products', () => {
  it('should get users', async () => {
    // make API call to self to test functionality end-to-end
    const {
      statusCode,
      result: { users }
    } = await server.inject({
      method: 'GET',
      url: '/api/users'
    });

    expect(statusCode).to.equal(200);
    expect(users).to.have.length(1);
  });

  it('should get single user', async () => {
    const {
      statusCode,
      result: { userDetails }
    } = await server.inject({
      method: 'GET',
      url: '/api/users/1'
    });

    expect(statusCode).to.equal(200);
    expect(userDetails).to.equal({
      id: 1,
      name: 'Arpan Maji',
      email: 'arp@gmail.com',
      hashedPassword:
        '3cfb695f21edcff5870c923c5738290d:4cc5ec0e47c0057f5f34078e58e30cca7fc76c6daf7506c252de98ac12c56638892c42c2e0ac69eac3bf55b030bc417e4dc34c08fedcc33990917dd025dc01e6'
    });
  });

  after(async () => {
    // placeholder to do something post tests
  });
});
