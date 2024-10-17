/**
 *
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const {PutRequest, GetRequest, StoredValue} = require('./dynamo_pb.js');
const {DynamoServiceClient} = require('./dynamo_grpc_web_pb.js');
const {DynamoApp} = require('../echoapp.js');
const grpc = {};
grpc.web = require('grpc-web');

var dynamoService = new DynamoServiceClient('http://'+window.location.hostname+':8080', null,
                                        null);

var dyanmoApp = new DynamoApp(
  dynamoService,
  {
    PutRequest: PutRequest,
    GetRequest: GetRequest,
    StoredValue: StoredValue,
  }
);

dyanmoApp.load();
