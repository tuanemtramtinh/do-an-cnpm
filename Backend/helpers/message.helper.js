module.exports.returnMessage = (message, payload = null, status = null) => {
  let returnMessage;
  if (payload) {
    returnMessage = {
      status: status,
      message: message,
      payload: payload,
    };
  } else {
    returnMessage = {
      status: status,
      message: message,
    };
  }

  return returnMessage;
};
