const isRestrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "You don't have permission for this",
      });
    } else {
      next();
    }
  };
};

module.exports = isRestrictTo;
