import AWS from 'aws-sdk';

const getBinary = (encodedFile) => {
  var base64Image = encodedFile.split("data:image/jpeg;base64,")[1];
  var binaryImg = atob(base64Image);
  var length = binaryImg.length;
  var ab = new ArrayBuffer(length);
  var ua = new Uint8Array(ab);
  for (var i = 0; i < length; i++) {
    ua[i] = binaryImg.charCodeAt(i);
  }
  var blob = new Blob([ab], {
    type: "image/jpeg"
  });

  return ab;
}

export const getImageUrl = (clientName, fileName) => {
  initAWS();
  var s3 = new AWS.S3();
  var params = {Bucket: 'tagglabs-processed', Key: clientName + '/' + fileName, Expires: 600};
  var url = s3.getSignedUrl('getObject', params);
  console.log("get URL is:", url);
  if (url.endsWith(".com/")) {
    url = url + 'tagglabs-processed/' + clientName + '/' + fileName;
  }
  return url;
}

export const checkInUser = (id) => {
  var ddb = new AWS.DynamoDB.DocumentClient();
  var dt = new Date();
  var utcDate = dt.toUTCString();
  var params = {
      TableName: "Users",
      Key: {
          "UserId": id
      },
      UpdateExpression: "set LoginTime=:t",
      ExpressionAttributeValues: {
          ":t": utcDate
      }
  };

  ddb.update(params, function(err, data) {
      if (err) {
          console.log("Error", err);
      } else {
          console.log("Timestamp updated....");
      }
  });
}

export const fetchLoggedInData = (client, updateState) => {
  if (client === '') {
    return [];
  }
  initAWS();
  var ddb = new AWS.DynamoDB();
  var params = {
    ProjectionExpression: "#nm, Email, ContactNumber, LoginTime, ImageFile, UserId",
    TableName: "Users",
    FilterExpression: "#clientCol = :clientName",
    ExpressionAttributeNames: {
        "#clientCol": "Client",
        "#nm": "Name",
    },
    ExpressionAttributeValues: {
        ":clientName": {'S': client}
    }
  };
  console.log(JSON.stringify(params));
  ddb.scan(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
        updateState(data);
      }
  });
}

export const fetchDistinctClients = (updateState) => {
  initAWS();
  var ddb = new AWS.DynamoDB();
  var params = {
    ProjectionExpression: "Client",
    TableName: "Users"
  };

  ddb.scan(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
        var distinctClients = new Set();
        data.Items.forEach(function(element, index, array) {
          distinctClients.add(element.Client.S);
        });
        updateState(distinctClients);
      }
  });
}

export const initAWS = () => {
  AWS.config.region = 'us-west-2'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-west-2:26f1c560-b330-4174-ab8c-da8b1b64a736',
  });
}

export const fetchUserDataByImage = (webcamImage, updateState, stopTimer) => {
  var rekognition = new AWS.Rekognition();
  var params = {
    CollectionId: 'tagglabs_aws_demo_user_register', /* required */
    Image: {
      Bytes: getBinary(webcamImage),
    },
    MaxFaces: 1,
  };
  rekognition.searchFacesByImage(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      var ddb = new AWS.DynamoDB();
      if (data.FaceMatches.length === 0) {
        return;
      }
      var externalId = data.FaceMatches[0].Face.ExternalImageId;
      console.log('externalImageId======>>>' + externalId);
      var params = {
        ExpressionAttributeValues: {
          ':userId': {S: externalId}
         },
       KeyConditionExpression: 'UserId = :userId',
       TableName: 'Users'
      };
      ddb.query(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          data.Items.forEach(function(element, index, array) {
            updateState(element, webcamImage, externalId);
          });
        }
      });
    }
  });
}
