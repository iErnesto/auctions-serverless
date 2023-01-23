const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'number',
        },
      },
      required: ['amount'],
    },
  },
  required: ['body'],
};

export default schema;
