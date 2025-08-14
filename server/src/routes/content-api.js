export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/import-orders',
    // name of the controller file & the method.
    handler: 'controller.importOrders',
    config: {
      policies: [],
      auth: false,
    },
  },
];
