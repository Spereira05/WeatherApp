export function successResponse(data: any, status = 200) {
  return Response.json({ 
    success: true, 
    data 
  }, { 
    status 
  });
}

export function errorResponse(message: string, status = 500) {
  return Response.json({ 
    success: false, 
    error: message 
  }, { 
    status 
  });
}

export function validationErrorResponse(errors: Record<string, string>) {
  return Response.json({
    success: false,
    error: 'Validation failed',
    validationErrors: errors
  }, {
    status: 400
  });
}

export function notFoundResponse(resource = 'Resource') {
  return Response.json({
    success: false,
    error: `${resource} not found`
  }, {
    status: 404
  });
}

export function unauthorizedResponse() {
  return Response.json({
    success: false,
    error: 'Unauthorized'
  }, {
    status: 401
  });
}