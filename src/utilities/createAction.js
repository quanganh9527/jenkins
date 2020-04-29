const createAction = (type, payload = {}, error = false, meta = null) => {
  return {
    type,
    payload,
    error,
    meta
  };
};

export default createAction;
