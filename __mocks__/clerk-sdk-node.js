module.exports = {
  requireAuth: (handler) => (req, res) => {
    req.auth = { userId: "mockUserId" }; // Mock the authenticated user
    return handler(req, res);
  },
  clerkClient: {
    users: {
      getUser: jest.fn().mockResolvedValue({
        id: "mockUserId",
        email: "mock@example.com",
      }),
    },
  },
};
