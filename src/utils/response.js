export const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500
};

const response = (result, res) => {
  if (
    result?.statusCode === StatusCode.OK ||
    result?.statusCode === StatusCode.CREATED
  ) {
    return res.status(result.statusCode).json({
      statusCode: result.statusCode,
      message: result.message,
      data: result.data
    });
  }
};

export default response;
