define({ "api": [
  {
    "type": "get",
    "url": "/media/:media_identifier/comment",
    "title": "2. Get Comments",
    "name": "Get_Comments",
    "description": "<p>This API is used to get all comment for the requested media</p>",
    "group": "Comment",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n\t  {\n\t    \"comment_identifier\": \"c4ca4238a0b923820dcc509a6f75849b\",\n\t    \"comment_type\": \"text\",\n\t    \"user_identifier\": \"i24vbf8hc3p7rk1\",\n\t    \"user_name\": \"Test User 30\",\n\t    \"comment\": \"This media is awesome!!!\",\n\t    \"created_time\": \"2017-07-25 13:28:41\",\n\t    \"profile_image\": \"\"\n\t  },\n\t  {\n\t    \"comment_identifier\": \"c81e728d9d4c2f636f067f89cc14862c\",\n\t    \"comment_type\": \"text\",\n\t    \"user_identifier\": \"i24vbf8hc3p7rk1\",\n\t    \"user_name\": \"Test User 30\",\n\t    \"comment\": \"This media is awesome!!!\",\n\t    \"created_time\": \"2017-07-25 13:28:41\",\n\t    \"profile_image\": \"\"\n\t  },\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommentcontroller.php",
    "groupTitle": "Comment"
  },
  {
    "type": "get",
    "url": "/media/:media_identifier/comment/:comment_identifier/like",
    "title": "5. Get comment like details",
    "name": "Get_comment_like_details",
    "description": "<p>This API is used to get user details who all are liking this comment</p>",
    "group": "Comment",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n\t {\n\t \"user_identifier\": \"i24vbf8hc3p7rk1\",\n\t \"user_name\": \"John kanady\",\n\t \"profile_image\": \"\"\n\t }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommentcontroller.php",
    "groupTitle": "Comment"
  },
  {
    "type": "post",
    "url": "/media/:media_identifier/comment/:comment_identifier/like/",
    "title": "3. Like Comment",
    "name": "Like_Comment",
    "description": "<p>This API is used to like the comment by users</p>",
    "group": "Comment",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2300",
            "description": "<p>Comment not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t \"code\": 2200,\n\t \"message\": \"Media not found\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommentcontroller.php",
    "groupTitle": "Comment"
  },
  {
    "type": "post",
    "url": "/media/:media_identifier/comment",
    "title": "1. Post Comment",
    "name": "Post_Comment",
    "description": "<p>This API is used to post comment for media</p>",
    "group": "Comment",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "comment_identifier",
            "description": "<p>Unique identifier for the comment.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response",
          "content": " Request:\n \n {\n\t \"comment\": \"This media is nice. Love it..\",\n\t \"comment_type\": \"text\"\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n \"comment_identifier\": \"e4da3b7fbbce2345d7772b0674a318d5\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1051",
            "description": "<p>Validation errors</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1052",
            "description": "<p>Missing required parameter</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1053",
            "description": "<p>Invalid parameter value</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request1",
          "content": "\nRequest:\n\t {\n\t\t \"comment\": \"\",\n\t\t \"comment_type\": \"text_invalid\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1051,\n\t\t \"message\": \"Validation error\",\n\t\t \"errors\": [\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter.\",\n\t\t\t\t \"field\": \"comment\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1053,\n\t\t\t\t \"description\": \"Invalid parameter value.\",\n\t\t\t\t \"field\": \"comment_type\"\n\t\t\t }\n\t\t ]\n\t }",
          "type": "json"
        },
        {
          "title": "Error-Request2",
          "content": "\nRequest:\n\t \n\t {\n\t\t \"comment\": \"This media is nice. Love it..\",\n\t\t \"comment_type\": \"text\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2200,\n\t\t \"message\": \"Media not found\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommentcontroller.php",
    "groupTitle": "Comment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"text\"",
              "\"audio\"",
              "\"animation\"",
              "\"sticker\""
            ],
            "optional": false,
            "field": "comment_type",
            "description": "<p>Type of comment.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Actual comment by user. If it is animation or sticker, then this will be the sticker ID. If it is audio, then this will be media identifier after get response from S3 upload.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "/media/:media_identifier/read-comment",
    "title": "6. Read Comments",
    "name": "Read_Comments",
    "description": "<p>This API is used to mark the comments for the media is read by media share owner.</p>",
    "group": "Comment",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2200,\n\t\t \"message\": \"Media not found\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommentcontroller.php",
    "groupTitle": "Comment"
  },
  {
    "type": "post",
    "url": "/media/:media_identifier/comment/:comment_identifier/unlike/",
    "title": "4. Unlike Comment",
    "name": "Unlike_Comment",
    "description": "<p>This API is used to unlike the comment by users</p>",
    "group": "Comment",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2300",
            "description": "<p>Comment not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t\n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2200,\n\t\t \"message\": \"Media not found\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommentcontroller.php",
    "groupTitle": "Comment"
  },
  {
    "type": "get",
    "url": "/check-update/:latest_version_code",
    "title": "3. Check Updates",
    "name": "Check_Updates",
    "description": "<p>This API is used to check updates</p>",
    "group": "Common",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n {\n\t  \"force_update_available\": \"true\",\n\t  \"update_available\": \"true\",\n\t  \"latest_version_code\": 1,\n\t  \"latest_version\": \"1.0.1\"\n  }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "Common"
  },
  {
    "type": "get / post / put / delete",
    "url": "/<screen-name>/",
    "title": "4. Error",
    "name": "Error_response",
    "description": "<p>Any error in the application will return appropriate HTTP Response code on the header along with the actual error content in the following format.</p>",
    "group": "Common",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "code",
            "description": "<p>Operation Error code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Description of the error</p>"
          },
          {
            "group": "Parameter",
            "type": "Embedded",
            "optional": false,
            "field": "error",
            "description": "<p>Embedded - Field Error which contain code, description and field. It is applicable for all field level validation error.</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error Response1",
          "content": " HTTP/1.1 400 Bad request\n {\n\t  \"code\": 1070,\n\t  \"message\": \"Mobile number with requested device ID already registered\",\n }",
          "type": "json"
        },
        {
          "title": "Error Response2",
          "content": " HTTP/1.1 400 Bad request\n {\n\t  \"code\": 1051,\n\t  \"message\": \"Validation error\",\n\t  \"errors\": [\n\t\t    {\n\t\t      \"code\": 1052,\n\t\t      \"description\": \"Missing required parameter.\",\n\t\t      \"field\": \"error-field\"\n\t\t    },\n\t\t    {\n\t\t      \"code\": 1053,\n\t\t      \"description\": \"Invalid parameter value.\",\n\t\t      \"field\": \"error-field\"\n\t\t    }\n\t  ]\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommondocs.php",
    "groupTitle": "Common"
  },
  {
    "type": "get",
    "url": "/media/signed-url",
    "title": "5. Get signed URL for uploading media",
    "name": "Get_SignedURL",
    "description": "<p>This API is used to get the pre-signed parameter for uploading media to Amazon S3. Actually it contains form input parameter and actual uploaded file need to be included as part of form input. <b> Add a field called &quot;file&quot; and submit the form as multi-part. </b> This request will be valid within 30 minutes. All kind of media like profile-image, comment audio and shared media should use this API to S3</p>",
    "group": "Common",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"media\"",
              "\"profile_image\"",
              "\"audio\""
            ],
            "optional": false,
            "field": "media_type",
            "description": "<p>Type of the media to upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content_type",
            "description": "<p>File content-type to be uploaded. It should be urlencoded value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "file_extension",
            "description": "<p>File extension to be uploaded.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "width",
            "description": "<p>Width of the media to be uploaded.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "height",
            "description": "<p>Height of the media to be uploaded.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "media_identifier",
            "description": "<p>Unique identifier of the media.</p>"
          },
          {
            "group": "Success 200",
            "type": "Embedded_Array",
            "optional": false,
            "field": "media",
            "description": "<p>Embedded array for media to be uploaded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Embedded_Array",
            "optional": false,
            "field": "thumbnail",
            "description": "<p>Embedded array for media thumbnail to be uploaded.</p>"
          },
          {
            "group": "Success 200",
            "type": "Embedded_Array",
            "optional": false,
            "field": "form_attributes",
            "description": "<p>Form attributes for uploading file to S3.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "action",
            "description": "<p>Form action URL. Part of form_attributes array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "method",
            "description": "<p>Form menthod name. Part of form_attributes array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "enctype",
            "description": "<p>Form encryption menthod. Part of form_attributes array,</p>"
          },
          {
            "group": "Success 200",
            "type": "Embedded_Array",
            "optional": false,
            "field": "form_inputs",
            "description": "<p>This need to be send as part of form submission.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "acl",
            "description": "<p>Media permission. Part of form_inputs array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>S3 stored file path. Part of form_inputs array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "X-Amz-Credential",
            "description": "<p>Secret key to access S3. Part of form_inputs array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "X-Amz-Algorithm",
            "description": "<p>Encryption algorithm name. Part of form_inputs array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "X-Amz-Date",
            "description": "<p>Date whci S3 created. Part of form_inputs array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Policy",
            "description": "<p>Policy infomation for accessing S3. Part of form_inputs array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "X-Amz-Signature",
            "description": "<p>Calculated S3 signature for verification. Part of form_inputs array,</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>File content type to be uploaded. Part of form_inputs array,</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n {\n\t  \"media\": {\n\t\t    \"form_attributes\": {\n\t\t\t      \"action\": \"https://dubuqu-nxt.s3-ap-southeast-1.amazonaws.com\",\n\t\t\t      \"method\": \"POST\",\n\t\t\t      \"enctype\": \"multipart/form-data\"\n\t\t    },\n\t\t    \"form_inputs\": {\n\t\t\t      \"acl\": \"private\",\n\t\t\t      \"key\": \"media/45c48cce2e2d7fbdea1afc51c7c6ad26.png\",\n\t\t\t      \"X-Amz-Credential\": \"AKIAJXA2WQ6GNF7C4VAQ/20170529/ap-southeast-1/s3/aws4_request\",\n\t\t\t      \"X-Amz-Algorithm\": \"AWS4-HMAC-SHA256\",\n\t\t\t      \"X-Amz-Date\": \"20170529T102704Z\",\n\t\t\t      \"Policy\": \"eyJleHBpcmF0aW9uIjoiMjAxNy0wNS0yOVQxMDozNzowNFoiLCJjb25kaXRpb25zIjpbeyJhY2wiOiJwcml2YXRlIn0seyJidWNrZXQiOiJkdWJ1cXUtbnh0In0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJtZWRpYVwvNDVjNDhjY2UyZTJkN2ZiZGVhMWFmYzUxYzdjNmFkMjYucG5nIl0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCJpbWFnZVwvcG5nIl0seyJYLUFtei1EYXRlIjoiMjAxNzA1MjlUMTAyNzA0WiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUFKWEEyV1E2R05GN0M0VkFRXC8yMDE3MDUyOVwvYXAtc291dGhlYXN0LTFcL3MzXC9hd3M0X3JlcXVlc3QifSx7IlgtQW16LUFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifV19\",\n\t\t\t      \"X-Amz-Signature\": \"5855b6e906a8b4626ad5aa4c872cfc1c4ba133515a352378f871dd228ec1139f\",\n\t\t\t      \"content-type\": \"image/png\"\n\t\t    }\n\t  },\n\t  \"thumbnail\": {\n\t\t    \"form_attributes\": {\n\t\t\t      \"action\": \"https://dubuqu-nxt.s3-ap-southeast-1.amazonaws.com\",\n\t\t\t      \"method\": \"POST\",\n\t\t\t      \"enctype\": \"multipart/form-data\"\n\t\t    },\n\t\t    \"form_inputs\": {\n\t\t\t      \"acl\": \"private\",\n\t\t\t      \"key\": \"thumbnail/45c48cce2e2d7fbdea1afc51c7c6ad26.png\",\n\t\t\t      \"X-Amz-Credential\": \"AKIAJXA2WQ6GNF7C4VAQ/20170529/ap-southeast-1/s3/aws4_request\",\n\t\t\t      \"X-Amz-Algorithm\": \"AWS4-HMAC-SHA256\",\n\t\t\t      \"X-Amz-Date\": \"20170529T102704Z\",\n\t\t\t      \"Policy\": \"eyJleHBpcmF0aW9uIjoiMjAxNy0wNS0yOVQxMDozNzowNFoiLCJjb25kaXRpb25zIjpbeyJhY2wiOiJwcml2YXRlIn0seyJidWNrZXQiOiJkdWJ1cXUtbnh0In0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJ0aHVtYm5haWxcLzQ1YzQ4Y2NlMmUyZDdmYmRlYTFhZmM1MWM3YzZhZDI2LnBuZyJdLFsic3RhcnRzLXdpdGgiLCIkQ29udGVudC1UeXBlIiwiaW1hZ2VcL3BuZyJdLHsiWC1BbXotRGF0ZSI6IjIwMTcwNTI5VDEwMjcwNFoifSx7IlgtQW16LUNyZWRlbnRpYWwiOiJBS0lBSlhBMldRNkdORjdDNFZBUVwvMjAxNzA1MjlcL2FwLXNvdXRoZWFzdC0xXC9zM1wvYXdzNF9yZXF1ZXN0In0seyJYLUFtei1BbGdvcml0aG0iOiJBV1M0LUhNQUMtU0hBMjU2In1dfQ==\",\n\t\t\t      \"X-Amz-Signature\": \"18a77cc9fbb2e1d85070ff0adce98c6d0079a3a284da8d5e4b0fdfd250f74ee5\",\n\t\t\t      \"content-type\": \"image/png\"\n\t\t    }\n\t  },\n\t  \"media_identifier\": \"45c48cce2e2d7fbdea1afc51c7c6ad26\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Common"
  },
  {
    "type": "get / post / put / delete",
    "url": "/<screen-name>/",
    "title": "1. Header",
    "name": "Header",
    "description": "<p>This header should provide for all requested APIs except user registration, generate-verification-code and check-verification-code APIs.</p>",
    "group": "Common",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "X-User-ID",
            "description": "<p>Users unique identifier and you can get it from register API response. It indicates the user identifier for which API request will be processed.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "X-Device-ID",
            "description": "<p>Users device ID for identification. It might be MAC address or IMEI.</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "X-Hmac",
            "description": "<p>Hash based Message Authentication Code calculated by applying the hash algorithm (SHA-1) configured for the user to the message payload.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"X-User-ID\": \"Sy0Baa4woiWfdsA\",\n  \"X-Device-ID\": \"987897654654542312\",\n  \"X-Hmac\": \"642e8c05e694552ce8668015590a1a92e61b1361\",\n  \"Content-Type\": \"application/json\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommondocs.php",
    "groupTitle": "Common"
  },
  {
    "type": "get",
    "url": "/<screen-name>/",
    "title": "2. Pagination",
    "name": "Pagination",
    "description": "<p>This option will be available only for API calls (GET ALL) that return collection of records. For get /user/dubuqu-user/ API, pagination will be supported.</p>",
    "group": "Common",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "offset",
            "description": "<p>Integer value denotes the internal division of page number.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Integer value denotes the no of records the server should return and it should be less than Max-page-size supported for this resource type.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "X-Resource-Count",
            "description": "<p>This response header will be available only for API calls that return collection of records. The value indicates the number of resources/records for the query that was requested.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "X-Page-Info",
            "description": "<p>This response header will be available only for the API calls that return collection of records. It will be a common separated Key-value pair of values to indicate the current page offset and the maximum page size. The keys will be max-page-size and current-Offset. Max-page-size value indicate the max number of records this list all request can return and current-offset value indicate the current page offset of the record returned by the API call.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response",
          "content": " Request:\n \n {\n \"offset\":\"0\",\n \"limit\":\"2\"\n }\n \n Response:\n \n <b><i>HTTP Header: </b></i>\n X-Resource-Count → 100\n X-Page-Info → max-page-size=10,current-offset=0\n \n HTTP/1.1 200 OK\n [\n\t {\n\t \t\"key\": \"value\",\n\t },\n\t {\n\t \t\"key\": \"value\",\n\t }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apicommondocs.php",
    "groupTitle": "Common"
  },
  {
    "type": "get",
    "url": "/media/:media_identifier/like",
    "title": "3. Get like details",
    "name": "Get_like_details",
    "description": "<p>This API is used to get user details who all are liking this media</p>",
    "group": "Like",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n\t {\n\t\t \"user_identifier\": \"Sy0Baa4woiWfdsA\",\n\t\t \"user_name\": \"John kanady\",\n\t\t \"profile_image\": \"\"\n\t },\n\t {\n\t\t \"user_identifier\": \"Sy0Baa4woiWfdsB\",\n\t\t \"user_name\": \"Abraham\",\n\t\t \"profile_image\": \"\"\n\t }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apilikecontroller.php",
    "groupTitle": "Like"
  },
  {
    "type": "post",
    "url": "/media/:media_identifier/like",
    "title": "1. Like Media",
    "name": "Like_Media",
    "description": "<p>This API is used to like the media by users</p>",
    "group": "Like",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2200,\n\t\t \"message\": \"Media not found\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apilikecontroller.php",
    "groupTitle": "Like"
  },
  {
    "type": "post",
    "url": "/media/:media_identifier/unlike/",
    "title": "2. Unlike Media",
    "name": "Unlike_Media",
    "description": "<p>This API is used to unlike the media by users</p>",
    "group": "Like",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1062,\n\t\t \"message\": \"Media not found\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apilikecontroller.php",
    "groupTitle": "Like"
  },
  {
    "type": "delete",
    "url": "/media/:media_identifier",
    "title": "7. Delete shared media",
    "name": "Delete_Shared_Media",
    "description": "<p>This API is used for delete the shared media.</p>",
    "group": "Media",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "\nRequest:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Media"
  },
  {
    "type": "get",
    "url": "/media/:media_identifier",
    "title": "5. Get Media Details",
    "name": "Get_Media",
    "description": "<p>This API is used to get media information of requested media</p>",
    "group": "Media",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n {\n\t \"signed_url\": \"https://s3.ap-southeast-2.amazonaws.com/s3sign2-bucket-hchq3nwuo8ns/s3-sign-demo.json?X-Amz-Security-Token=FQ…&X-Amz-Credential=ASIAJF3BXG…&X-Amz-Date=20170125T044127Z&X-Amz-Expires=60&X-Amz-Signature=24db05…\",\n\t \"thumbnail_signed_url\": \"https://s3.ap-southeast-2.amazonaws.com/s3sign2-bucket-hchq3nwuo8ns/s3-sign-demo.json?X-Amz-Security-Token=FQ…&X-Amz-Credential=ASIAJF3BXG…&X-Amz-Date=20170125T044127Z&X-Amz-Expires=60&X-Amz-Signature=24db05…\",\n\t \"user_identifier\": \"i24vbf8hc3p7rk1\",\n\t \"content_type\": \"image/png\",\n\t \"like_count\": \"10\",\n\t \"comment_count\": \"10\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Media"
  },
  {
    "type": "get",
    "url": "/media/",
    "title": "2. Get all media",
    "name": "Get_all_media",
    "description": "<p>This API is used to fetch all media which is shared to requested user. Each contact has 10 media details by default.</p>",
    "group": "Media",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n    {\n        \"name\": \"Schooling ~ Test User 50\",\n        \"type\": \"social-group\",\n        \"group_identifier\": \"z27utc1z9bvx9h3\",\n        \"profile_image\": \"\",\n        \"shared_medias\": [\n            {\n                \"media_identifier\": \"70efdf2ec9b086079795c442636b55fb\",\n                \"content_type\": \"\",\n                \"comment_count\": 0,\n                \"created_time\": \"2017-05-26 11:35:32\",\n                \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/e4da3b7fbbce2345d7772b0674a318d5.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101345Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=959c82ef238c0ece9fa2b9e156de64d5acb59486d3d19e185164ed039fe3a475\"\n            }\n        ]\n    },\n    {\n        \"name\": \"Test User 40\",\n        \"type\": \"user\",\n        \"user_identifier\": \"cdlorzojb04s46q\",\n        \"profile_image\": \"\",\n        \"shared_medias\": [\n            {\n                \"media_identifier\": \"9bf31c7ff062936a96d3c8bd1f8f2ff3\",\n                \"content_type\": \"\",\n                \"comment_count\": 0,\n                \"created_time\": \"2017-05-26 11:09:28\",\n                \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/a87ff679a2f3e71d9181a67b7542122c.mp4?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101345Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=d5dc736be24856804379fc22072fc4f3bb1b48fd61c9e0da5864213c10c3d05a\"\n            },\n            {\n                \"media_identifier\": \"c51ce410c124a10e0db5e4b97fc2af39\",\n                \"content_type\": \"\",\n                \"comment_count\": 0,\n                \"created_time\": \"2017-05-25 20:40:12\",\n                \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/eccbc87e4b5ce2fe28308fd9f2a7baf3.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101345Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=a269722e3e27d9594e3ad116ef7c0003f13fc566b00b72cc29a2bb016fbef17d\"\n            }\n        ]\n    }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Media"
  },
  {
    "type": "get",
    "url": "/media/social-group/:group_identifier",
    "title": "4. Get all media shared by group",
    "name": "Get_all_media_shared_by_group",
    "description": "<p>This API is used to fetch all media which is shared to requested user.</p>",
    "group": "Media",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": "\n<b><i>HTTP Header: </b></i>\n \t\tX-Media-Count → image=1,video=1\n\n HTTP/1.1 200 OK\n\t [\n\t    {\n\t        \"media_identifier\": \"98f13708210194c475687be6106a3b84\",\n\t        \"content_type\": \"image/png\",\n\t        \"comment_count\": 6,\n\t        \"created_time\": \"2017-05-26 18:51:46\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/8f14e45fceea167a5a36dedd4bea2543.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101856Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=bab7c5864cc3ffeaf95c1f824e2b352653d2d1b87735ca155995e984ed39874e\"\n\t    },\n\t    {\n\t        \"media_identifier\": \"072b030ba126b2f4b2374f342be9ed44\",\n\t        \"content_type\": \"video/mp4\",\n\t        \"comment_count\": 0,\n\t        \"created_time\": \"2017-06-06 20:12:59\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/45c48cce2e2d7fbdea1afc51c7c6ad26.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101856Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=4b1c0a34e1168240cc37130698df3455c90a08125bff487ba26d013181968456\"\n\t    }\n\t ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Media"
  },
  {
    "type": "get",
    "url": "/media/user/:user_identifier",
    "title": "3. Get all media shared by user",
    "name": "Get_all_media_shared_by_user",
    "description": "<p>This API is used to fetch all media which is shared to requested user.</p>",
    "group": "Media",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": "\n<b><i>HTTP Header: </b></i>\n \t\tX-Media-Count → image=2,video=0\n\n HTTP/1.1 200 OK\n\t [\n\t    {\n\t        \"media_identifier\": \"6512bd43d9caa6e02c990b0a82652dca\",\n\t        \"content_type\": \"image/png\",\n\t        \"comment_count\": 0,\n\t        \"created_time\": \"2017-05-25 20:39:33\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/c81e728d9d4c2f636f067f89cc14862c.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101836Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=d4a841cf97e760c047cc35cf75635f88160ea0b4d4d58506e07b8cdbe2b6ab69\"\n\t    },\n\t    {\n\t        \"media_identifier\": \"45c48cce2e2d7fbdea1afc51c7c6ad26\",\n\t        \"content_type\": \"image/png\",\n\t        \"comment_count\": 0,\n\t        \"created_time\": \"2017-05-25 19:07:38\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/c4ca4238a0b923820dcc509a6f75849b.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101836Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=64d149ce347eb9eefd9de3e60a84f71821e3a1c8e33bede2147f93e74175f361\"\n\t    }\n\t]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Media"
  },
  {
    "type": "post",
    "url": "/media/reshare",
    "title": "6. Re-Share media",
    "name": "Reshare_Media",
    "description": "<p>This API is used for re-sharing media to people.</p>",
    "group": "Media",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "\nRequest:\n\n{\n\"media_identifiers\": [\"45c48cce2e2d7fbdea1afc51c7c6ad26\",\"1679091c5a880faf6fb5e6087eb1b2dc\"]\n\"recipient\": [\"9876543210\", \"987654123\", \"z27utc1z9bvx9h1\", \"z27utc1z9bvx9h2\"]\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1051",
            "description": "<p>Validation errors</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1052",
            "description": "<p>Missing required parameter</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1053",
            "description": "<p>Invalid parameter value</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2201",
            "description": "<p>Invalid recipient(s): <Comma separated invalid items></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request1",
          "content": "\nRequest:\n\t {\n\t \"media_identifier\": \"\",\n\t \"recipient\": \"test\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t \"code\": 1051,\n\t \"message\": \"Validation error\",\n\t \"errors\": [\n\t {\n\t \"code\": 1052,\n\t \"description\": \"Missing required parameter.\",\n\t \"field\": \"media_identifiers\"\n\t },\n\t {\n\t \"code\": 1053,\n\t \"description\": \"Invalid parameter value.\",\n\t \"field\": \"recipient\"\n\t }\n\t ]\n\t }",
          "type": "json"
        },
        {
          "title": "Error-Request2",
          "content": "\nRequest:\n\t \n\t {\n\t \"media_identifiers\": [\"987987xsdfd\"]\n\t \"recipient\": [\"9876543210\", \"987654123\", \"Familyinvalid\", \"Friendsinvalid\", \"4356455\"]\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t \"code\": 2201,\n\t \"message\": \"Invalid recipient(s): Familyinvalid, Friendsinvalid, 4356455\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Media",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON_Array",
            "optional": false,
            "field": "media_identifiers",
            "description": "<p>Array of unique identifiers of the media. The media identifier will be retrieved when hitting signed-url API.</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON_Array",
            "optional": false,
            "field": "recipient",
            "description": "<p>Actual audience to show the shared media. It might be mobile number and social group identifiers.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/media/share",
    "title": "1. Share media",
    "name": "Share_Media",
    "description": "<p>This API is used for sharing media to people. After uploading media to S3, then it needs to be called.</p>",
    "group": "Media",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "\n Request:\n \n {\n\t \"media_identifiers\": [\"45c48cce2e2d7fbdea1afc51c7c6ad26\",\"1679091c5a880faf6fb5e6087eb1b2dc\"]\n\t \"recipient\": [\"9876543210\", \"987654123\", \"z27utc1z9bvx9h1\", \"z27utc1z9bvx9h2\"]\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1051",
            "description": "<p>Validation errors</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1052",
            "description": "<p>Missing required parameter</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1053",
            "description": "<p>Invalid parameter value</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2200",
            "description": "<p>Media not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2201",
            "description": "<p>Invalid recipient(s): <Comma separated invalid items></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request1",
          "content": "\nRequest:\n\t {\n\t\t \"media_identifier\": \"\",\n\t\t \"recipient\": \"test\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1051,\n\t\t \"message\": \"Validation error\",\n\t\t \"errors\": [\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter.\",\n\t\t\t\t \"field\": \"media_identifiers\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1053,\n\t\t\t\t \"description\": \"Invalid parameter value.\",\n\t\t\t\t \"field\": \"recipient\"\n\t\t\t }\n\t\t ]\n\t }",
          "type": "json"
        },
        {
          "title": "Error-Request2",
          "content": "\nRequest:\n\t \n\t {\n\t\t \"media_identifiers\": [\"987987xsdfd\"]\n\t\t \"recipient\": [\"9876543210\", \"987654123\", \"Familyinvalid\", \"Friendsinvalid\", \"4356455\"]\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2201,\n\t\t \"message\": \"Invalid recipient(s): Familyinvalid, Friendsinvalid, 4356455\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "Media",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON_Array",
            "optional": false,
            "field": "media_identifiers",
            "description": "<p>Array of unique identifiers of the media. The media identifier will be retrieved when hitting signed-url API.</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON_Array",
            "optional": false,
            "field": "recipient",
            "description": "<p>Actual audience to show the shared media. It might be mobile number and social group identifiers.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/media/stories/social-group/:group_identifier",
    "title": "3. Get Stories by Social Group",
    "name": "Get_Stories_by_Social_Group",
    "description": "<p>This API is used to fetch all media which is shared by requested user to social group.</p>",
    "group": "MediaStories",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": "\n<b><i>HTTP Header: </b></i>\n \t\tX-Media-Count → image=2,video=0\n\n HTTP/1.1 200 OK\n\t [\n\t\t {\n\t        \"media_identifier\": \"98f13708210194c475687be6106a3b84\",\n\t        \"content_type\": \"image/png\",\n\t        \"comment_count\": 6,\n\t        \"created_time\": \"2017-05-26 18:51:46\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/8f14e45fceea167a5a36dedd4bea2543.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T102221Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=69f7b493f796a51d99558285875c7d3076f29032a4e44da87e57754adad88da1\"\n\t    },\n\t    {\n\t        \"media_identifier\": \"072b030ba126b2f4b2374f342be9ed44\",\n\t        \"content_type\": \"image/jpg\",\n\t        \"comment_count\": 0,\n\t        \"created_time\": \"2017-06-06 20:12:59\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/45c48cce2e2d7fbdea1afc51c7c6ad26.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T102221Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=22a0d1bbcfd523f611189accd68f1ae04b4c502f968e3c81471b0b3dec6716e9\"\n\t    }\n\t ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "MediaStories"
  },
  {
    "type": "get",
    "url": "/media/stories/user/:user_identifier",
    "title": "2. Get Stories by User",
    "name": "Get_Stories_by_User",
    "description": "<p>This API is used to fetch all media which is shared by requested user to dubuqu contact.</p>",
    "group": "MediaStories",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": "\n<b><i>HTTP Header: </b></i>\n \t\tX-Media-Count → image=2,video=0\n\n HTTP/1.1 200 OK\n\t [\n\t    {\n\t        \"media_identifier\": \"c20ad4d76fe97759aa27a0c99bff6710\",\n\t        \"content_type\": \"image/png\",\n\t        \"comment_count\": 0,\n\t        \"created_time\": \"2017-05-25 20:39:48\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/c81e728d9d4c2f636f067f89cc14862c.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T102153Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=cc85a9a273db68d9ff8676b30d5a1afe88bd8ecd046f212c2f1b0ce9d01637b1\"\n\t    },\n\t    {\n\t        \"media_identifier\": \"8f14e45fceea167a5a36dedd4bea2543\",\n\t        \"content_type\": \"image/png\",\n\t        \"comment_count\": 0,\n\t        \"created_time\": \"2017-05-25 19:07:38\",\n\t        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/c4ca4238a0b923820dcc509a6f75849b.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T102153Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=6011cc704352fbef575ace469fc08e19a45a02c3dbbf1da52991f4ba52a01695\"\n\t    }\n\t]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "MediaStories"
  },
  {
    "type": "get",
    "url": "/media/stories",
    "title": "1. Get all User Stories",
    "name": "Get_all_User_Stories",
    "description": "<p>This API is used to fetch all media which is shared by requested user. Each contact has 5 media details by default.</p>",
    "group": "MediaStories",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n   {\n        \"name\": \"Test User 40\",\n        \"type\": \"user\",\n        \"user_identifier\": \"cdlorzojb04s46q\",\n        \"profile_image\": \"\",\n        \"shared_medias\": [\n            {\n                \"media_identifier\": \"1c383cd30b7c298ab50293adfecb7b18\",\n                \"content_type\": \"video/mp4\",\n                \"comment_count\": 0,\n                \"created_time\": \"2017-06-05 13:37:02\",\n                \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/aab3238922bcc25a6f606eb525ffdc56.mp4?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101945Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=7be28647b22e427f0e48d276f9a8c59537edfe627abc87d9f38a30ca9639cee8\"\n            },\n            {\n                \"media_identifier\": \"c9f0f895fb98ab9159f51fd0297e236d\",\n                \"content_type\": \"image/png\",\n                \"comment_count\": 0,\n                \"created_time\": \"2017-05-25 19:07:38\",\n                \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/c4ca4238a0b923820dcc509a6f75849b.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101945Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=6c82b067d3ef6fea1983f99503cf8ac5377d29aab98438317b69392e186b6af9\"\n            }\n        ]\n    },\n    {\n        \"name\": \"Family\",\n        \"type\": \"social-group\",\n        \"group_identifier\": \"z27utc1z9bvx9h1\",\n        \"profile_image\": \"\",\n        \"shared_medias\": [\n            {\n                \"media_identifier\": \"98f13708210194c475687be6106a3b84\",\n                \"content_type\": \"image/png\",\n                \"comment_count\": 6,\n                \"created_time\": \"2017-05-26 18:51:46\",\n                \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/8f14e45fceea167a5a36dedd4bea2543.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101945Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=7bc86bfec896ad34707dfdb9de163148f616c106d33f0c2697ffb2713ffd70a6\"\n            },\n            {\n                \"media_identifier\": \"072b030ba126b2f4b2374f342be9ed44\",\n                \"content_type\": \"image/jpg\",\n                \"comment_count\": 0,\n                \"created_time\": \"2017-06-06 20:12:59\",\n                \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/45c48cce2e2d7fbdea1afc51c7c6ad26.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T101945Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=522f745af8d45641e2ea2c448524974ade0ec431c9219036e1e83dd7bcf36509\"\n            }\n        ]\n    }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "MediaStories"
  },
  {
    "type": "get",
    "url": "/media/stories/unread-media",
    "title": "4. Get stories unread media",
    "name": "Get_stories_unread_media",
    "description": "<p>This API is used to get all media which is in unread shared by requested user.</p>",
    "group": "MediaStories",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n\t {\n\t\t \"signed_url\": \"https://s3.ap-southeast-2.amazonaws.com/s3sign2-bucket-hchq3nwuo8ns/s3-sign-demo.json?X-Amz-Security-Token=FQ…&X-Amz-Credential=ASIAJF3BXG…&X-Amz-Date=20170125T044127Z&X-Amz-Expires=60&X-Amz-Signature=24db05…\",\n\t\t \"media_identifier\": \"c4ca4238a0b923820dcc509a6f75849b\",\n\t\t \"content_type\": \"image/png\",\n\t\t \"unread_comment\": \"30\"\n\t },\n\t {\n\t\t \"signed_url\": \"https://s3.ap-southeast-2.amazonaws.com/s3sign2-bucket-hchq3nwuo8ns/s3-sign-demo.json?X-Amz-Security-Token=FQ…&X-Amz-Credential=ASIAJF3BXG…&X-Amz-Date=20170125T044127Z&X-Amz-Expires=60&X-Amz-Signature=24db05…\",\n\t\t \"media_identifier\": \"c81e728d9d4c2f636f067f89cc14862c\",\n\t\t \"content_type\": \"image/png\",\n\t\t \"unread_comment\": \"10\"\n\t }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apimediacontroller.php",
    "groupTitle": "MediaStories"
  },
  {
    "type": "get",
    "url": "/public-media/",
    "title": "3. Get public media",
    "name": "Get_all_public_media",
    "description": "<p>This API is used to fetch all popular public medias. By default popular 10 media will be retrieved.</p>",
    "group": "PublicProfile",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n    {\n        \"media_identifier\": \"698d51a19d8a121ce581499d7b701668\",\n        \"user_identifier\": \"i24vbf8hc3p7rk1\",\n        \"content_type\": \"image/png\",\n        \"like_count\": 0,\n        \"comment_count\": 0,\n        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/3c59dc048e8850243be8079a5c74d079.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T093356Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=dd22183751388bf834293d21d09ee8f75cfb90a4bc4d6b10fe15020c97452c97\"\n    },\n    {\n        \"media_identifier\": \"3c59dc048e8850243be8079a5c74d079\",\n        \"user_identifier\": \"i24vbf8hc3p7rk1\",\n        \"content_type\": \"image/jpg\",\n        \"like_count\": 0,\n        \"comment_count\": 0,\n        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/45c48cce2e2d7fbdea1afc51c7c6ad26.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T093356Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=769c215b7175b23dc93fa2993e84bc9db415ac50410ee2f99746fd339e1d4196\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apipublicsharecontroller.php",
    "groupTitle": "PublicProfile"
  },
  {
    "type": "get",
    "url": "/public-media/user/:user_identifier",
    "title": "4. Get users public media",
    "name": "Get_user_s_public_media",
    "description": "<p>This API is used to fetch specific user's public shared medias.</p>",
    "group": "PublicProfile",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n    {\n        \"media_identifier\": \"698d51a19d8a121ce581499d7b701668\",\n        \"content_type\": \"image/png\",\n        \"like_count\": 0,\n        \"comment_count\": 0,\n        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/3c59dc048e8850243be8079a5c74d079.png?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T093304Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=8b2e663a42cd34c109200dd1c80d5614d9d4ef29d57a8cd6ba2a6bfbfe1f978b\"\n    },\n    {\n        \"media_identifier\": \"3c59dc048e8850243be8079a5c74d079\",\n        \"content_type\": \"image/jpg\",\n        \"like_count\": 0,\n        \"comment_count\": 0,\n        \"signed_url\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/media/thumbnail/45c48cce2e2d7fbdea1afc51c7c6ad26.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJXA2WQ6GNF7C4VAQ%2F20170718%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20170718T093304Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1200&X-Amz-Signature=bd3744677d0cd61044d8698242d7bbe6170a27ce0ad8115783bfe7b4a28972b8\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apipublicsharecontroller.php",
    "groupTitle": "PublicProfile"
  },
  {
    "type": "post",
    "url": "/public-media/:media_identifier/reshare",
    "title": "2. Reshare public media",
    "name": "Reshare_public_Media",
    "description": "<p>This API is used for re-sharing media to public.</p>",
    "group": "PublicProfile",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "\nRequest:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apipublicsharecontroller.php",
    "groupTitle": "PublicProfile"
  },
  {
    "type": "post",
    "url": "/public-media/:media_identifier/share",
    "title": "1. Share public media",
    "name": "Share_public_Media",
    "description": "<p>This API is used for sharing media to public. After uploading media to S3 (Using signed-url API), then it needs to be called.</p>",
    "group": "PublicProfile",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "\nRequest:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2200,\n\t\t \"message\": \"Media not found\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apipublicsharecontroller.php",
    "groupTitle": "PublicProfile"
  },
  {
    "type": "post",
    "url": "/social-group/",
    "title": "1. Create Social Group",
    "name": "Create_Social_Group",
    "description": "<p>This API is used to create a social group</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "group_identifier",
            "description": "<p>Unique identifier for the social group.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response",
          "content": " Request:\n \n {\n\t \"group_name\":\"Family\",\n\t \"group_type\":\"Open\",\n\t \"memory_retain\": \"true\",\n\t \"members\": [\"9876543211\", \"9876543212\", \"9876543213\"]\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n \t\"group_identifier\": \"757qhqkllxlqm7n\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1051",
            "description": "<p>Validation errors</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1052",
            "description": "<p>Missing required parameter</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1053",
            "description": "<p>Invalid parameter value</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1054",
            "description": "<p>Maximum characters length exceeded</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1055",
            "description": "<p>Minimum characters length exceeded</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2101",
            "description": "<p>Group name already exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request1",
          "content": "\nRequest:\n\t {\n\t\t \"group_name\":\"\",\n\t\t \"memory_retain\":\"enable\",\n\t\t \"members\":\"[]\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1051,\n\t\t \"message\": \"Validation error\",\n\t\t \"errors\": [\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter.\",\n\t\t\t\t \"field\": \"group_name\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1053,\n\t\t\t\t \"description\": \"Invalid parameter value.\",\n\t\t\t\t \"field\": \"memory_retain\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter\",\n\t\t\t\t \"field\": \"group_type\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1053,\n\t\t\t\t \"description\": \"Invalid parameter value.\",\n\t\t\t\t \"field\": \"members\"\n\t\t\t }\n\t\t ]\n\t }",
          "type": "json"
        },
        {
          "title": "Error-Request2",
          "content": "\nRequest:\n\t \n\t {\n\t\t \"group_name\":\"Family\",\n\t\t \"group_type\":\"closed\",\n\t\t \"members\":[\"9876543210, 9876543212\"]\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2101,\n\t\t \"message\": \"Group name already exist\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "50",
            "optional": false,
            "field": "group_name",
            "description": "<p>Name of the Group.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"open\"",
              "\"closed\""
            ],
            "optional": false,
            "field": "group_type",
            "description": "<p>Type of the Group. Once created cannot update this field.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"true\"",
              "\"false\""
            ],
            "optional": true,
            "field": "memory_retain",
            "defaultValue": "false",
            "description": "<p>Based on this flag server decide media shared this group will deleted autmatically. It is applicable only when group_type is open.</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON_Array",
            "optional": false,
            "field": "members",
            "description": "<p>Mobile numbers to be added to this group.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/social-group/:group_identifier",
    "title": "8. Delete social group",
    "name": "Delete_Social_Group",
    "description": "<p>This API is used to delete the social group</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group_identifier",
            "description": "<p>Unique group identifier for delete operation.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2100",
            "description": "<p>Social group not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response",
          "content": " Request:\n \n {\n }\n \n Response:\n \n HTTP/1.1 400 Bad request\n {\n\t \"code\": 2100,\n\t \"message\": \"Social group not exist\",\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup"
  },
  {
    "type": "get",
    "url": "/social-group/:group_identifier/profile-image",
    "title": "5. Get Social Group Profile Image",
    "name": "Get_Social_Group_Profile_Image",
    "description": "<p>This API is used to fetch actual social group  profile image (Full size image).</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profile_image",
            "description": "<p>It contains S3 public profile image URL</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response1",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n\t\"profile_image\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/profileimage/c51ce410c124a10e0db5e4b97fc2af39.png\"\n}",
          "type": "json"
        },
        {
          "title": "Request-Response2",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n\"profile_image\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup"
  },
  {
    "type": "get",
    "url": "/social-group/",
    "title": "2. Get all social groups",
    "name": "Get_all_social_groups",
    "description": "<p>This API is used to fetch all group details</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": "\t HTTP/1.1 200 OK\n\t [\n\t\t {\n\t\t\t \"group_name\": \"Family\",\n\t\t\t \"group_identifier\": \"x5mv5x5m6lcic00\",\n\t\t\t \"group_type\": \"open\",\n\t\t\t \"member_count\": \"3\",\n    \t\t \t \"profile_image\": \"\"\n\t\t },\n\t\t {\n\t\t\t \"group_name\": \"Friends\",\n\t\t\t \"group_identifier\": \"757qhqkllxlqm7n\",\n\t\t\t \"group_type\": \"closed\",\n\t\t\t \"member_count\": \"3\",\n    \t\t \t \"profile_image\": \"\"\n\t\t }\n\t ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup"
  },
  {
    "type": "get",
    "url": "/social-group/share-social-circle/",
    "title": "3. Get all social groups for quick share",
    "name": "Get_all_social_groups_for_quick_share",
    "description": "<p>This API is used to fetch all group details for quick share. It contain both own groups as wells members of opened circle group for requested user.</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n\t {\n\t\t \"group_name\": \"Family\",\n\t\t \"group_identifier\": \"x5mv5x5m6lcic00\",\n\t\t \"own_group\": \"true\",\n\t\t \"profile_image\": \"\"\n\t },\n\t {\n\t\t \"group_name\": \"Friends ~ Group-owner-name\",\n\t\t \"group_identifier\": \"757qhqkllxlqm7n\",\n\t\t \"own_group\": \"false\",\n\t\t \"profile_image\": \"\"\n\t }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup"
  },
  {
    "type": "get",
    "url": "/social-group/:group_identifier",
    "title": "4. Get social group details",
    "name": "Get_social_group",
    "description": "<p>This API is used to fetch social group details. If requested user and owner of social group are matched then all information will be retrieved. Otherwise basic details will be retrieved.</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group_identifier",
            "description": "<p>Unique group identifier for getting details.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response - 1",
          "content": "\t Request:\n\t \n\t {\n\t }\n\t \n\t Response:\n\t \n\t HTTP/1.1 200 OK\n\t {\n\t\t \"group_name\":\"Family\",\n\t\t \"group_identifier\": \"757qhqkllxlqm7n\",\n\t\t \"group_type\":\"Open\",\n\t\t \"memory_retain\": \"true\",\n   \t\t \"profile_image\": \"\",\n\t\t \"members\": [\"9876543211\", \"9876543212\", \"9876543213\"]\n\t }",
          "type": "json"
        },
        {
          "title": "Request-Response - 2",
          "content": "\t Request:\n\t \n\t {\n\t }\n\t \n\t Response:\n\t \n\t HTTP/1.1 200 OK\n\t {\n\t\t \"group_name\":\"Family\",\n\t\t \"group_identifier\": \"757qhqkllxlqm7n\",\n   \t\t \"profile_image\": \"\",\n\t }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2100",
            "description": "<p>Social group not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request2",
          "content": "\nRequest:\n\t \n\t {\n\t \n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2100,\n\t\t \"message\": \"Social group not exist\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup"
  },
  {
    "type": "put",
    "url": "/social-group/:group_identifier",
    "title": "6. Update social group",
    "name": "Update_Social_Group",
    "description": "<p>This API is used to update the social group information</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "group_identifier",
            "description": "<p>Unique group identifier for updates.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": " Request:\n \n {\n \t \"group_name\": \"Updated\",\n\t \"memory_retain\": \"true\",\n\t \"members\": [\"9876543211\", \"9876543212\", \"9876543213\"]\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n \n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2100",
            "description": "<p>Social group not exist</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1080",
            "description": "<p>Group name already exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response1",
          "content": " Request:\n \n {\n\t \"memory_retain\": \"true\",\n\t \"members\": [\"9876543211\", \"9876543212\", \"9876543213\"]\n }\n \n Response:\n \n HTTP/1.1 400 Bad request\n {\n\t \"code\": 2100,\n\t \"message\": \"Social group not exist\",\n }",
          "type": "json"
        },
        {
          "title": "Request-Response2",
          "content": " Request:\n \n {\n \t\"group_name\":\"Families\",\n }\n \n Response:\n \n HTTP/1.1 400 Bad request\n {\n\t \"code\": 1080,\n\t \"message\": \"Group name already exist\",\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup"
  },
  {
    "type": "put",
    "url": "/social-group/:group_identifier/profile-image",
    "title": "7. Update Social Group Profile Image",
    "name": "Update_Social_Group_Profile_Image",
    "description": "<p>This API is used to update the social group profile image. This API has to called after upload image to S3 using generate-signed-url and provide the media identifier for profile_image_identifier</p>",
    "group": "SocialGroup",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "profile_image_identifier",
            "description": "<p>Media identifier received from response of generate-signed-url. For removing profile image, provide empty string.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Update Image - Request and Response",
          "content": "Request:\n\n{\n\t\"profile_image_identifier\": \"c4ca4238a0b923820dcc509a6f75849b\"\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        },
        {
          "title": "Remove Image - Request and Response",
          "content": "Request:\n\n{\n\t\"profile_image_identifier\": \"\"\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apisocialgroupcontroller.php",
    "groupTitle": "SocialGroup"
  },
  {
    "type": "post",
    "url": "/user/:user_identifier/follow",
    "title": "1. Follow user",
    "name": "Follow_User",
    "description": "<p>This API is used to following the user</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user_identifier",
            "description": "<p>Users unique identifier for user who is being followed.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2000",
            "description": "<p>User not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2000,\n\t\t \"message\": \"User not exist\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/dubuqu-user",
    "title": "5. Get Dubuqu Users",
    "name": "Get_Dubuqu_Users",
    "description": "<p>This API is used to fetch dubuqu user information using mobile number. Pagination will be not supported for this API.</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "JSON_Array",
            "optional": false,
            "field": "mobile_numbers",
            "description": "<p>Embedded array of Mobile number which will requested. Dubuqu user alone will be retrieved in response.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n\t\"mobile_numbers\": [\"9876543210\", \"9876543211\", \"9876543212\"]\n}\n\n\t HTTP/1.1 200 OK\n\t [\n\t\t {\n\t\t\t \"user_name\": \"John kanady\",\n\t\t\t \"user_identifier\": \"Sy0Baa4woiWfdsA\",\n\t\t\t \"mobile_number\": \"9876543210\",\n\t\t\t \"profile_image\": \"\"\n\t\t },\n\t\t {\n\t\t\t \"user_name\": \"John Abraham\",\n\t\t\t \"user_identifier\": \"Sy0Baa4woiWfdsB\",\n\t\t\t \"mobile_number\": \"9876543211\",\n\t\t\t \"profile_image\": \"\"\n\t\t }\n\t ]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1051",
            "description": "<p>Validation errors</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1052",
            "description": "<p>Missing required parameter.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1053",
            "description": "<p>Invalid parameter value.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1051,\n\t\t \"message\": \"Validation error\",\n\t\t \"errors\": [\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter.\",\n\t\t\t\t \"field\": \"mobile_numbers\"\n\t\t\t }\n\t\t ]\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/profile-image",
    "title": "7. Get User Profile Image",
    "name": "Get_User_Profile_Image",
    "description": "<p>This API is used to fetch actual user profile image (Full size image).</p>",
    "group": "User",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profile_image",
            "description": "<p>It contains S3 public profile image URL</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response1",
          "content": " Request:\n \n {\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n\t \"profile_image\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/profileimage/c51ce410c124a10e0db5e4b97fc2af39.png\"\n }",
          "type": "json"
        },
        {
          "title": "Request-Response2",
          "content": " Request:\n \n {\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n\t \"profile_image\": \"\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:user_identifier/following-user",
    "title": "3. Get following user details",
    "name": "Get_following_user_details",
    "description": "<p>This API is used to get following details by user identifier</p>",
    "group": "User",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Response",
          "content": " HTTP/1.1 200 OK\n [\n\t {\n\t\t \"user_identifier\": \"Sy0Baa4woiWfdsA\",\n\t\t \"user_name\": \"John kanady\",\n\t\t \"profile_image\": \"\"\n\t },\n\t {\n\t\t \"user_identifier\": \"Sy0Baa4woiWfdsB\",\n\t\t \"user_name\": \"Abraham\",\n\t\t \"profile_image\": \"\"\n\t }\n ]",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/check-verification-code/",
    "title": "2. Check Verification Code",
    "name": "Check_Verification_Code",
    "description": "<p>This API is used for validate verfication code from user's mobile number</p>",
    "group": "UserRegistration",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n\t\"country_code\":\"91\",\n\t\"mobile_number\":\"9876543210\",\n\t\"verification_code\": \"9878\"\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1105",
            "description": "<p>Verfication code invalid</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1106",
            "description": "<p>Verfication code expired</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t\t\"country_code\":\"91\",\n\t \t\"mobile_number\":\"9876543210\",\n\t \t\"verification_code\": \"9877\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t  \"code\": 1105,\n\t\t  \"message\": \"Verfication code invalid\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "UserRegistration"
  },
  {
    "type": "post",
    "url": "/user/",
    "title": "3. Create User",
    "name": "CreateUser",
    "description": "<p>This API is used for registering user to Dubuqu application.</p>",
    "group": "UserRegistration",
    "version": "1.0.0",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user_identifier",
            "description": "<p>Unique identifier for the user. This needs to send for all APIs in header for which API request will be processed.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "secret_key",
            "description": "<p>This is the private key used to generate hash based message authentication code to authenticate the request payload.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Response",
          "content": "\n Request:\n \n {\n\t \"user_name\": \"John kanady\",\n\t \"country_code\": \"91\",\n\t \"mobile_number\": \"9876543210\",\n\t \"email_id\": \"jonh.kanady@test.com\",\n\t \"gender\": \"male\",\n\t \"device_notification_key\": \"xd123dedee97987\",\n\t \"device_id\": \"112232122245664\",\n\t \"device_type\": \"android\",\n\t \"verification_code\": \"1234\"\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n \t\"user_identifier\": \"Sy0Baa4woiWfdsA\",\n \t\"secret_key\": \"asdfsdfsaferter4564575745\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1051",
            "description": "<p>Validation errors</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1052",
            "description": "<p>Missing required parameter</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1053",
            "description": "<p>Invalid parameter value</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1054",
            "description": "<p>Maximum characters length exceeded</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1055",
            "description": "<p>Minimum characters length exceeded</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1103",
            "description": "<p>Mobile number already registered</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request1",
          "content": "\nRequest:\n\t \n\t {\n\t\t \"user_name\":\"John kanady\",\n\t\t \"country_code\":\"\",\n\t\t \"mobile_number\":\"\",\n\t\t \"email_id\":\".\",\n\t\t \"device_id\":\"\",\n\t\t \"device_type\":\"\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1051,\n\t\t \"message\": \"Validation error\",\n\t\t \"errors\": [\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter.\",\n\t\t\t\t \"field\": \"country_code\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1053,\n\t\t\t\t \"description\": \"Invalid parameter value.\",\n\t\t\t\t \"field\": \"email_id\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter\",\n\t\t\t\t \"field\": \"mobile_number\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter\",\n\t\t\t\t \"field\": \"device_notification_key\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter\",\n\t\t\t\t \"field\": \"device_id\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter\",\n\t\t\t\t \"field\": \"device_type\"\n\t\t\t },\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter\",\n\t\t\t\t \"field\": \"verification_code\"\n\t\t\t }\n\t\t ]\n\t }",
          "type": "json"
        },
        {
          "title": "Error-Request2",
          "content": "\nRequest:\n\t \n\t {\n\t\t \"user_name\":\"John kanady\",\n\t\t \"country_code\":\"91\",\n\t\t \"mobile_number\":\"9876543210\",\n\t\t \"email_id\":\"John.kanady@test.com\",\n\t\t \"profile_image\":\"\",\n\t\t \"device_id\":\"987987987987654654\",\n\t\t \"device_type\":\"ios\",\n\t\t \"verification_code\": \"1234\"\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1103,\n\t\t \"message\": \"Mobile number with requested device ID already registered\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "UserRegistration",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "45",
            "optional": false,
            "field": "user_name",
            "description": "<p>Name of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "3",
            "optional": false,
            "field": "country_code",
            "description": "<p>Country code of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "15",
            "optional": false,
            "field": "mobile_number",
            "description": "<p>Mobile number of the user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "100",
            "optional": false,
            "field": "email_id",
            "description": "<p>Email ID of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"male\"",
              "\"female\""
            ],
            "optional": false,
            "field": "gender",
            "description": "<p>Gender of the User.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "45",
            "optional": false,
            "field": "device_notification_key",
            "description": "<p>Notification key for the android or ios device to send the push notification.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "45",
            "optional": false,
            "field": "device_id",
            "description": "<p>IMEI/MAC number of the device for identification.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"android\"",
              "\"ios\""
            ],
            "optional": false,
            "field": "device_type",
            "description": "<p>Type of the device</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "size": "4",
            "optional": false,
            "field": "verification_code",
            "description": "<p>Verification code received from user mobile via SMS.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/generate-verification-code/",
    "title": "1. Generate Verification Code",
    "name": "Generate_Verification_Code",
    "description": "<p>This API is used for generate and send verfication code to user's mobile number</p>",
    "group": "UserRegistration",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": " Request:\n\n {\n\t\"country_code\":\"91\",\n\t\"mobile_number\":\"9876543210\",\n }\n\n Response:\n\n HTTP/1.1 200 OK\n {\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "UserRegistration"
  },
  {
    "type": "get",
    "url": "/user/",
    "title": "4. Search Users",
    "name": "Search_Users",
    "description": "<p>This API is used to fetch user's public information.</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "search_keyword",
            "description": "<p>The collection response will be filtered based on this String value.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n\t\"search_keyword\": \"john\"\n}\n\n\t   HTTP/1.1 200 OK\n\t   [\n\t\t   {\n\t\t\t \"user_name\": \"John kanady\",\n\t\t\t \"user_identifier\": \"Sy0Baa4woiWfdsA\",\n\t\t\t \"profile_image\": \"\"\n\t\t   },\n\t\t   {\n\t\t\t \"user_name\": \"John Abraham\",\n\t\t\t \"user_identifier\": \"Sy0Baa4woiWfdsB\",\n\t\t\t \"profile_image\": \"\"\n\t\t   }\n\t   ]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1051",
            "description": "<p>Validation errors</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "1052",
            "description": "<p>Missing required parameter</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 1051,\n\t\t \"message\": \"Validation error\",\n\t\t \"errors\": [\n\t\t\t {\n\t\t\t\t \"code\": 1052,\n\t\t\t\t \"description\": \"Missing required parameter.\",\n\t\t\t\t \"field\": \"search_word\"\n\t\t\t }\n\t\t ]\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/:user_identifier/unfollow",
    "title": "2. Unfollow user",
    "name": "Unfollow_User",
    "description": "<p>This API is used to unfollowing the user</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user_identifier",
            "description": "<p>Users unique identifier for user who follows.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": "Request:\n\n{\n}\n\nResponse:\n\nHTTP/1.1 200 OK\n{\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2000",
            "description": "<p>User not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2000,\n\t\t \"message\": \"User not exist\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user/",
    "title": "8. Update User Details",
    "name": "Update_User",
    "description": "<p>This API is used to update the user information</p>",
    "group": "User",
    "version": "1.0.0",
    "success": {
      "examples": [
        {
          "title": "Request-Response",
          "content": " Request:\n \n {\n\t \"user_name\": \"John kanady\",\n\t \"email_id\": \"jonh.kanady@test.com\",\n\t \"memory_retain\": \"true\",\n\t \"device_notification_key\": \"0c39999d6f9700c91e54c9\"\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user/:user_identifier/profile-image",
    "title": "9. Update User Profile Image",
    "name": "Update_User_Profile_Image",
    "description": "<p>This API is used to update the user profile image. This API has to called after upload image to S3 using generate-signed-url and provide the media identifier for profile_image_identifier</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "profile_image_identifier",
            "description": "<p>Media identifier received from response of generate-signed-url. For removing profile image, provide empty string.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Update Image - Request and Response",
          "content": " Request:\n \n {\n\t \"profile_image_identifier\": \"c4ca4238a0b923820dcc509a6f75849b\"\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n }",
          "type": "json"
        },
        {
          "title": "Remove Image - Request and Response",
          "content": " Request:\n \n {\n\t \"profile_image_identifier\": \"\"\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:user_identifier",
    "title": "6. Get User Details",
    "name": "User_Details",
    "description": "<p>This API is used to fetch user details. If requested user and logged in are matched then all information will be retrieved. Otherwise user_name and profile picture only will be retrieved.</p>",
    "group": "User",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "user_identifier",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Request-Response1",
          "content": "\t Request:\n\t \n\t {\n\t }\n\t \n\t Response:\n\t \n\t HTTP/1.1 200 OK\n\t {\n\t\t\"user_name\": \"John kanady\",\n\t\t\"country_code\": \"91\",\n   \t\t\"mobile_number\": \"9659310430\",\n    \t\t\"email_id\": \"test@tes.com\",\n     \t\t\"gender\": \"female\",\n   \t\t\"user_identifier\": \"i24vbf8hc3p7rk1\",\n   \t\t\"memory_retain\": \"false\",\n  \t\t\"following_count\": 1,\n    \t\t\"follower_count\": 6,\n    \t\t\"profile_image\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/profileimage/c51ce410c124a10e0db5e4b97fc2af39.png\"\n\t }",
          "type": "json"
        },
        {
          "title": "Request-Response2",
          "content": " Request:\n \n {\n }\n \n Response:\n \n HTTP/1.1 200 OK\n {\n\t\"user_name\": \"John Abraram\",\n\t\"user_identifier\": \"cdlorzojb04s46q\",\n        \"following_count\": 3,\n        \"follower_count\": 1,\n        \"profile_image\": \"https://s3-ap-southeast-1.amazonaws.com/dubuqu-nxt/profileimage/c51ce410c124a10e0db5e4b97fc2af39.png\",\n        \"is_following\": \"true\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "2000",
            "description": "<p>User not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Request2",
          "content": "\nRequest:\n\t \n\t {\n\t }\n\nResponse:\n\n\t HTTP/1.1 400 Bad request\n\t {\n\t\t \"code\": 2000,\n\t\t \"message\": \"User not exist\",\n\t }",
          "type": "json"
        }
      ]
    },
    "filename": "controller/api/apiusercontroller.php",
    "groupTitle": "User"
  }
] });
