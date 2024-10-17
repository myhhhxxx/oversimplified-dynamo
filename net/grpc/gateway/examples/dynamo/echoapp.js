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

const dynamoApp = {};

/**
 * @param {Object} dynamoService
 * @param {Object} ctors
 */
dynamoApp.DynamoApp = function(dynamoService, ctors) {
  this.dynamoService = dynamoService;
  this.ctors = ctors;
};

dynamoApp.DynamoApp.INTERVAL = 500; // ms
dynamoApp.DynamoApp.MAX_STREAM_MESSAGES = 50;

/**
 * @param {string} message
 * @param {string} cssClass
 */
dynamoApp.DynamoApp.addMessage = function(message, cssClass) {
  $("#first").after(
    $("<div/>").addClass("row").append(
      $("<h2/>").append(
        $("<span/>").addClass("label " + cssClass).text(message))));
};

/**
 * @param {string} message
 */
dynamoApp.DynamoApp.addLeftMessage = function(message) {
  this.addMessage(message, "label-primary pull-left");
};

/**
 * @param {string} message
 */
dynamoApp.DynamoApp.addRightMessage = function(message) {
  this.addMessage(message, "label-default pull-right");
};

dynamoApp.DynamoApp.prototype.updatePut = function () {
  this.key++;
  this.value = "value" + this.key;

  $("#key").text(this.key);
  $("#value").text(this.value);
}

/**
 * @param {Object} e event
 * @return {boolean} status
 */
dynamoApp.DynamoApp.prototype.put = function(e) {
  dynamoApp.DynamoApp.addLeftMessage("key:" + this.key + " value:" + this.value);
  var unaryRequest = new this.ctors.PutRequest();
  var storedValue = new this.ctors.StoredValue();
  var self = this;
  unaryRequest.setKey(self.key);
  storedValue.setValue(self.value);
  unaryRequest.setValue(storedValue);

  var call = this.dynamoService.put(unaryRequest,
                                   {"custom-header-1": "value1"},
                                   function(err, response) {
    if (err) {
      dynamoApp.DynamoApp.addRightMessage('Error code: '+err.code+' "'+
                                      err.message+'"');
    } else {
      dynamoApp.DynamoApp.addRightMessage(response.getCode());
      self.updatePut();
    }
  });
  call.on('status', function(status) {
    if (status.metadata) {
      console.log("Received metadata");
      console.log(status.metadata);
    }
  });
  return false;
};

/**
 * @param {Object} e event
 * @return {boolean} status
 */
dynamoApp.DynamoApp.prototype.get = function (e) {
  var msg = $("#get-msg").val().trim();
  $("#get-msg").val(''); // clear the text box
  if (!msg) return false;

  console.log('getting');
  return false;
};


/**
 * Load the app
 */
dynamoApp.DynamoApp.prototype.load = function() {
  var self = this;
  self.key = 0;

  self.updatePut();

  $(document).ready(function() {
    // event handlers
    $("#put").click(self.put.bind(self));
    $("#get").click(self.get.bind(self));
    $("#put").keyup(function (e) {
      if (e.keyCode == 13) self.put(); // enter key
      return false;
    });
    $("#get").keyup(function (e) {
      if (e.keyCode == 13) self.get(); // enter key
      return false;
    });
    $("#msg").focus();
  });
};

module.exports = dynamoApp;
