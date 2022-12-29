const supertest = require('supertest');
const should = require('should');

// This agent refers to PORT where program is runninng.

const server = supertest.agent('http://localhost:3000');

// UNIT test begin

describe('Unit test Case for Client Admin Module', function () {
  // #1 Login as SuperAdmin
  let token = null;
  const superadminEmail = 'ugadmin@ultragenicglobal.com';
  const superAdminPass = 'admin@1234';
  const testKey = Math.floor(Date.now() / 1000);

  it('#1 Login as SuperAdmin', function (done) {
    // calling login API
    server
      .post('/api/v1/user/login')
      .send({ email: superadminEmail, password: superAdminPass })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Login API
        res?.body?.status.should.equal(true);
        res?.body?.code.should.equal(200);
        token = res?.body?.data?.token;

        done();
      });
  });

  // #2 Email field VALIDATION test for CLlent Admin
  const clientAdminInvalidEmail = {
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}_Test_Email`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `9568997878`,
  };
  let id = null;

  it('#2 Client Admin Add: Check for Invalid email', function (done) {
    // calling Add client admin API
    server
      .post('/api/v1/clientAdmin/add')
      .send(clientAdminInvalidEmail)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Login API
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(302);
        id = res?.body?.data?.id;

        done();
      });
  });

  // #3 Password field VALIDATION test for CLlent Admin
  const clientAdminInvalidPass = {
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `123456`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `9568997878`,
  };

  it('#3 Client Admin Add : Check for Invalid password', function (done) {
    // calling Add client admin API
    server
      .post('/api/v1/clientAdmin/add')
      .send(clientAdminInvalidPass)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Login API
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(309);
        done();
      });
  });

  // #4 mobile field VALIDATION test for CLlent Admin
  const clientAdminInvalidMobile = {
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `95689`,
  };

  it('#4 Client Admin Add : Check for Invalid mobile', function (done) {
    // calling Add client admin API
    server
      .post('/api/v1/clientAdmin/add')
      .send(clientAdminInvalidMobile)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Invalid password
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(303);
        done();
      });
  });

  // #5 status field VALIDATION test for CLlent Admin
  const clientAdminInvalidStatus = {
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 3,
    mobile: `95689997676`,
  };

  it('#5 Client Admin Add : Check for Invalid status', function (done) {
    // calling Add client admin API
    server
      .post('/api/v1/clientAdmin/add')
      .send(clientAdminInvalidStatus)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Invalid status
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(310);
        done();
      });
  });

  // #6 status field VALIDATION test for CLlent Admin
  const clientAdmin = {
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `9568997676`,
  };

  it('#6 Client Admin Add : Check for Adding Client Admin', function (done) {
    // calling Add client admin API
    server
      .post('/api/v1/clientAdmin/add')
      .send(clientAdmin)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for adding client admin
        res?.body?.status.should.equal(true);
        res?.body?.code.should.equal(200);
        id = res?.body?.data?.id;
        done();
      });
  });

  // #7 Email field VALIDATION test for CLlent Admin Update
  const clientAdminUpdateInvalidEmail = {
    id: id,
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}_Test_Email`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `9568997878`,
  };

  it('#7 Client Admin Update: Check for Invalid email', function (done) {
    clientAdminUpdateInvalidEmail.id = id;
    // calling Update client admin API
    server
      .patch('/api/v1/clientAdmin/update')
      .send(clientAdminUpdateInvalidEmail)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Login API
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(302);
        id = res?.body?.data?.id;

        done();
      });
  });

  // #8 Password field VALIDATION test for CLlent Admin Update
  const clientAdminUpdateInvalidPass = {
    id: id,
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `123456`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `9568997878`,
  };

  it('#8 Client Admin Update: Check for Invalid password', function (done) {
    console.log(
      '🚀 ~ file: clientAdmin.ts ~ line 273 ~ clientAdminUpdateInvalidPass',
      clientAdminUpdateInvalidPass
    );
    // calling Add client admin API
    server
      .patch('/api/v1/clientAdmin/update')
      .send(clientAdminUpdateInvalidPass)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Login API
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(309);
        done();
      });
  });

  // #9 mobile field VALIDATION test for CLlent Admin
  const clientAdminUpdateInvalidMobile = {
    id: id,
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `95689`,
  };

  it('#9 Client Admin Update: Check for Invalid mobile', function (done) {
    clientAdminUpdateInvalidMobile.id = id;
    // calling Add client admin API
    server
      .patch('/api/v1/clientAdmin/update')
      .send(clientAdminUpdateInvalidMobile)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Invalid password
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(303);
        done();
      });
  });

  // #10 status field VALIDATION test for CLlent Admin Update
  const clientAdminUpdateInvalidStatus = {
    id: id,
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 3,
    mobile: `95689997676`,
  };

  it('#10 Client Admin Update: Check for Invalid status', function (done) {
    clientAdminUpdateInvalidStatus.id = id;
    // calling Add client admin API
    server
      .patch('/api/v1/clientAdmin/update')
      .send(clientAdminUpdateInvalidStatus)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for Invalid status
        res?.body?.status.should.equal(false);
        res?.body?.code.should.equal(310);
        done();
      });
  });

  // #11 status field VALIDATION test for CLlent Admin
  const clientAdminUpdate = {
    id: id,
    firstName: `${testKey}_Test_First_Name`,
    lastName: `${testKey}_Test_Last_Name`,
    email: `${testKey}Test@Email.com`,
    password: `Pass@1234`,
    designation: `${testKey}_Test_Designation`,
    employeeId: `${testKey}_Test_EmployeeId`,
    status: 1,
    mobile: `9568997676`,
  };

  it('#11 Client Admin Update: Check for Updating Client Admin', function (done) {
    clientAdminUpdate.id = id;
    // calling Add client admin API
    server
      .patch('/api/v1/clientAdmin/update')
      .send(clientAdminUpdate)
      .set({ token: token })
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end(function (err, res) {
        if (err) {
          console.log(err);
          return false;
        }

        //Test case verification for adding client admin
        res?.body?.status.should.equal(true);
        res?.body?.code.should.equal(200);
        done();
      });
  });
});
