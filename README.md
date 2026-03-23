<!-- PROJECT SHIELDS -->

[![Issues][issues-shield]][issues-url]
![MIT License][license-shield]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/henrylin03/top-pressure-blog--BE">
    <img src="./public/logo.png" alt="Logo" width="100" height="100">
  </a>

<h3 align="center">Top Pressure Blog (Backend)</h3>

  <p align="center">
RESTful APIs and other server-side code for the "Top Pressure" blog.
  </p>
</div>

## About

This repository holds the server-side code for the full-stack, "Top Pressure" blog website, implementing the "Jamstack" architecture by separating front and back-end code.

This project is part of [The Odin Project's](https://www.theodinproject.com/) "Full Stack JavaScript" course, specifically on implementing full-stack, Jamstack web app with REST APIs.

## Architecture

![ExpressJS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma ORM](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

APIs attempt to follow REST conventions, implemented in Express.js. Database is PostgreSQL, with Prisma ORM to perform CRUD operations. Authentication is implemented using `passportjs`, with both its LocalStrategy to authenticate log-ins using username/email + password, and JWTStrategy to authenticate access to protected routes via JSON Web Token (JWT).

## API reference

### Base URL

Semantic versioning is used in the URI, like so:

```curl
/api/v1/...
```

### Authentication method

JSON web tokens (JWTs) are used to authenticate protected routes. You can either validate JWT en route to a protected route by adding JWT into your request header and attempt to hit the protected route endpoint, or call the

```bash
GET     /api/{version}/validate-jwt
```
endpoint with the following header:

```json
{
    "Authorization": "Bearer <JWT>"
}
```

### Some endpoints
#### Auth
For validation of JWT, see "Authentication method" section above. 

Logging in uses `passportjs`' LocalStrategy and requires a request to
```
POST    /api/{version}/login
```
with the following shape in your body:
```json
{
    "usernameOrEmail": "me@gmail.com",
    "password": "thisDoesntNeedToBeHashedBtw"
}
```
If successful, a `200 OK` response is sent back, otherwise it's a `401`.

A new user can sign up by calling:
```
POST    /api/{version}/users
```
A new user needs:
- "email"
- "username"
- "password"

and can optionally have:
- "firstName"
- "lastName"
- "website"

A `400` error will be sent back if server-side validation fails. Turn into a JSON to see the errors in the `.errors` array. This is handled by `express-validator` package.

#### Posts
Getting all published posts can be done by calling:
```
GET     /api/{version}/posts
```

Only authors are authorised to get posts they themselves have written (either published or not) by calling:
```
GET     /api/{version}/me/posts
```
See "Auth" above to see how to authenticate. `403` error is returned if user is not an author, or `401` if user isn't even authenticated yet.

To create a new post:
```
POST    /api/{version}/posts
```
and you will have a generated UUID for the newly-created draft post in the response. Note that only authors can create new posts.

To edit a post (as an author):
```
PUT     /api/{version}/posts/{postId}
```
for example:
```
PUT     /api/v1/posts/some-uuid-that-is-the-post-id
```

To delete a post (as the post's author):
```
DELETE  /api/{version}/posts/{postId}
```

#### Comments
Comments work in a similar way to posts, but each comment is attached to a post. Commenters are authorised to edit/delete their own comments, but the author of the post that comment is on can also delete the comment. 

### Error format and common error codes
Some common error codes include:
- `404`: resource doesn't exist or you can't actually access it
- `401`: you need to sign in (authentication)
- `403`: you've signed in (authenticated), but you don't have enough permissions. Usually, this is something that requires you to be an "author".
- `400`: if when you're trying to `POST` or `PUT` and you get this back, it's because there's something wrong with the things you've added into the form.
- `500`: something happened in the server. You might want to try again or [raise a GitHub issue](https://github.com/henrylin03/top-pressure-blog--BE/issues/new).

## Licence

Distributed under MIT Licence.

<!-- MARKDOWN LINKS & IMAGES -->

[issues-shield]: https://img.shields.io/github/issues/henrylin03/top-pressure-blog--BE.svg?style=for-the-badge
[issues-url]: https://github.com/henrylin03/top-pressure-blog--BE/issues
[license-shield]: https://img.shields.io/github/license/henrylin03/top-pressure-blog--BE.svg?style=for-the-badge
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/henrylin03/
