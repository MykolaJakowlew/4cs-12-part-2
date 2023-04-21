const { createDish } = require('./create');

const DishesMock = {};

jest.mock('../../../models', () => {
 DishesMock.save = jest.fn();
 DishesMock.new = jest.fn();
 return {
  Dishes: DishesMock.new
   .mockImplementation(() => {
    return {
     save: DishesMock.save
    };
   })
 };
});

describe("createDish", () => {
 const res = {
  status: jest.fn().mockImplementation(() => res),
  send: jest.fn()
 };
 it("successful executed", async () => {
  const req = {
   body: { price: 45, isAvailable: true }
  };

  DishesMock.save.mockResolvedValueOnce(req.body);

  await createDish(req, res);

  expect(res.status).toBeCalledWith(200);
  expect(res.send).toBeCalledWith(req.body);
 });

 it('default value for isAvailable must be false', async () => {
  const req = {
   body: { price: 45 }
  };

  await createDish(req, res);

  expect(DishesMock.new).toBeCalledWith({
   price: 45,
   isAvailable: true
  });
 });
});