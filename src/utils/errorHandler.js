export class ApiError extends Error {

  constructor(
    statusCode,
    message
  ) {

    super(message);

    this.statusCode =
      statusCode;
  }
}

export function asyncHandler(fn) {

  return (req, res, next) => {

    Promise.resolve(
      fn(req, res, next)
    ).catch(next);
  };
}

export function globalErrorHandler(
  err,
  req,
  res,
  next
) {

  console.error(
    'BACKEND ERROR:',
    err
  );

  res.status(
    err.statusCode || 500
  ).json({

    message:
      err.message ||
      'Internal Server Error'
  });
}