const backend = require('../lib/backend');

// API
const schemaItemsController = apiRouter => {
  apiRouter.get('/hubs', (req, res, next) => {
    getHubs(req, req.query).then(payload => res.status(200).json(payload)).catch(e => next(e));
  });

  apiRouter.get('/hubs/:hubId/sources', (req, res, next) => {
    getDataSources(req, req.params.hubId, req.query).then(payload => res.status(200).json(payload)).catch(e => next(e));
  });

  apiRouter.get('/hubs/:hubId/sources/:sourceId/schemas/variables', (req, res, next) => {
    getSchemaItems(req, req.params.hubId, req.params.sourceId, req.query)
      .then(payload => res.status(200).json(payload))
      .catch(e => next(e));
  });

};

// Functions
function getHubs(req, query) {
  const url = `${req.apis.smartHub}hubs`;
  return backend.get(req, url, query).then(r => r.json());
}

function getDataSources(req, hubId, query) {
  const url = `${req.apis.smartHub}hubs/${hubId}/variants/default/sources/recent`;
  return backend.get(req, url, query).then(r => r.json());
}

function getSchemaItems(req, hubId, sourceId, query) {
  const url = `${req.apis.reporting}hubs/${hubId}/sources/${sourceId}/schemas/variables`;
  return backend.get(req, url, query).then(r => r.json()).then(json => json.items);
}

function getSchemaItems2(req, hubId, sourceId, query) {
  const url = `${req.apis.reporting}hubs/${hubId}/sources/${sourceId}/schemas/variables`;
  return backend.get(req, url, query).then(r => r.json()).then(json => ({hubId, sourceId, items: json.items}));
}


// Export
module.exports = {
  default: schemaItemsController,
  getSchemaItems,
  getSchemaItems2,
};
