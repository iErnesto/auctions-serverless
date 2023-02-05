const schema = {
  properties: {
    body: {
      type: 'string',
      minLength: 1,
      pattern:
        '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
    },
  },
  required: ['body'],
};

export default schema;
