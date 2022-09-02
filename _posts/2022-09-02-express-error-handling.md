---
layout: post
title: Express Error Handling
excerpt_separator: <!--more-->
---

In developing web applications, it is good practice to catch errors and deliver useful information to the end user if something goes awry. Express provides a conventional approach to capturing application errors using its middleware pipeline.

 <!--more-->

## Express Middleware

The Express library comes with a convention for handling application errors -- Express' middleware framework. The middleware framework is a pipeline of functions that have access to the `request` and `response` objects. A given middleware can execute any code and make changes to the `request` and `response` objects. When the middleware is done with its computation, it must end the request/response cycle *or* call the `next` middleware function in the pipeline.

In this way, every route that is defined on the app -- e.g. `GET /hey-pop` -- is part of the middleware pipeline. A route which responds with a webpage ends the request/response cycle by not calling a `next` middleware. An Express route handler has the following signature:

<div class="filename">pseudocode</div>

```javascript
const routeHandler = function(request, response, next) { ... };
app.get('/path', routeHandler);
```

A middleware handler has the similar signature:

<div class="filename">pseudocode</div>

```javascript
const middleware = function(request, response, next) { ... };
app.use(middlewareHandler);
```

Error handling middleware has a slightly differing signature; the first parameter is a JavaScript error object.

<div class="filename">pseudocode</div>

```javascript
const errorHandlingMiddleware = function(error, request, response, next) { ... };
app.use(errorHandlingMiddleware);
```

The application automatically enters the error handling middleware if `next` is invoked with an error object.

## An Error Handling Middleware
As with all middleware, Express will invoke the functions in the order they are applied to the application with `app.use()`, top to bottom. Generally, apply error handling middleware below the more trafficked route and middleware definitions.

Here is an example error handler:

```javascript
app.use(function (error, request, response, next) {
  if (!error.apiError) {
    return next(error, request, response, next);
  }
  response.status(error.statusCode);
  response.json({ message: error.message });
});
```

Note that the only *Express* convention is the signature of the route handler.

The additional logic of checking `error.apiError` is application logic specific to this use case. The error object is developer-defined, and useful for carrying information from the spot where the error occured to the error handling function. The pattern of checking for a property on the `error` object is convention, and allows for passing the request/response to the next middleware if it's not applicable to the current one.

This code checks for the existance of the a property `apiError` on the `error`. If it is not present, the function passes the error to the next error handling middleware. If the property is present, the status of the response is set to the `statusCode` of the error and a JSON response is returned with the error's message. Note: `error.statusCode` is a non-standard property that is application specific and developer-set.

An important aspect of this code is that it returns a JSON response. Express' default error handler returns an HTML response. In this application-specific case, `apiError` indicates that the initial route requested was an API route. These routes are expected to return JSON, so the error handler is programmed to return JSON.

## Invoking the Error Handler
The error handling middleware pipeline begins by a route or middleware invoking its `next` parameter with an Error object. Here is an example API route that passes any error to the middleware pipeline. The error object is modified so that it will be captured in the error handling middleware defined above.

```javascript
app.post('/api/pop', async function(request, response, next) {
  try {
    await Pop.create();
    response.json({ popped: true });
  } catch (e) {
    e.apiError = true;
    e.statusCode = 422;
    next(e);
  }
});
```

With the last line -- `next(e)` -- the request/response cycle is moved to the error handling middleware pipeline. The `apiError: true` property will cause the previously defined handler to process the response, `res.json` the error message.

## Further

An full-featured application will have multiple error handling middlewares. Each one will likely begin with a guard clause -- e.g. `if(!error.apiError)` -- which defermines if the error should be processed by the specific middleware.

The middleware may or may not return the response to the user as shown in the examples here. A valid use case for error handing middleware is to produce side-effects such as error-logging to performance monitoring tools and/or triggering background workers. These types of middleware should continue the middleware pipeline by invoking `next(e)` with the error object.

Remember the middleware pipeline applies the functions in order of their declaration on the app via `app.use`. As such, `use` side-effect middlewares before any that return a response.

### Resources
Express Error Handling: [http://expressjs.com/en/guide/error-handling.html](http://expressjs.com/en/guide/error-handling.html)