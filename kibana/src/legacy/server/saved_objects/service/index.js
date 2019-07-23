'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _saved_objects_client = require('./saved_objects_client');

Object.defineProperty(exports, 'SavedObjectsClient', {
  enumerable: true,
  get: function () {
    return _saved_objects_client.SavedObjectsClient;
  }
});

var _lib = require('./lib');

Object.defineProperty(exports, 'SavedObjectsRepository', {
  enumerable: true,
  get: function () {
    return _lib.SavedObjectsRepository;
  }
});
Object.defineProperty(exports, 'ScopedSavedObjectsClientProvider', {
  enumerable: true,
  get: function () {
    return _lib.ScopedSavedObjectsClientProvider;
  }
});