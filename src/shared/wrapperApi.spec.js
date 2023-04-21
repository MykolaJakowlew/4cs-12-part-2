const { wrapperApi } = require('./wrapperApi');

describe("wrapperApi", () => {
 describe("successful", () => {
  const mock = jest.fn();

  it("executed", async () => {
   const handler = wrapperApi(mock);
   await expect(handler).not.toThrow();
  });

  it("executed and call handler with parameters", async () => {
   const handler = wrapperApi(mock);
   const req = jest.fn();
   const res = jest.fn();
   await handler(req, res);
   expect(mock).toBeCalled();
   expect(mock).toBeCalledWith(req, res);
  });
 });

 describe("should throw error and ", () => {
  const req = jest.fn();
  const mock = jest.fn();
  const res = {
   status: jest.fn()
    .mockImplementation(() => res),
   send: jest.fn(),
  };
  it('return response 500', async () => {
   mock.mockImplementation(async () => { throw new Error("PLACEHOLDER MOCK ERROR"); });
   const handler = wrapperApi(mock);
   await handler(req, res);
   expect(res.status).toBeCalled();
   expect(res.status).toBeCalledWith(500);
  });

  it('return response with correct message', async () => {
   const err = new Error("PLACEHOLDER MOCK ERROR");
   mock.mockImplementation(async () => { throw err; });
   const handler = wrapperApi(mock);
   await handler(req, res);
   expect(res.send).toBeCalled();
   expect(res.send).toBeCalledWith({
    message: `Internal server error:${err.toString()}`
   });
  });
 });



});