#pdf.attach("doc.typ", relationship: "source")
#let title = "Social news site project"
#let author = "Marcell Tóth"
#set text(font: "Inter", stylistic-set: (2, 7))
#set document(title: title, author: author)
#show heading.where(level: 1): it => [#pagebreak() #align(center, text(1.5em, it))]
#set heading(numbering: "1.")
#set page(footer: context {
  align(center)[
    #counter(page).get().first() / #counter(page).final().first()
  ]
})
#show link: it => text(blue, it)

#show raw: set text(font: "Hack")

#v(30%)
#align(center)[
  #text(2.5em, weight: "bold", title)

  #author
]
#outline(indent: 2em)
= Specification
== Project description
This project is a #link("https://en.wikipedia.org/wiki/Social_news_website")[social news site], that is, a website (and also accompanying desktop and mobile app) that lets user create posts, which usually contain links to news articles or blog posts (but can also contain text). Other users then can vote on these posts to make the rank higher on the front page and they can also comment on them in a hierarchical comment system.
== Technologies
- Website: Express (Node.js) based server which uses EJS server side rendering and HTML forms for input
- API: Express (Node.js) based server, documented with OpenAPI
- Database: Sequelize ORM, set up for sqlite, but can be easily reconfigured for other relational databases
- Desktop/Mobile app: Avalonia C\# cross platform application, works on desktop operating systems + Android (and theoretically also supports an iOS and a browser version as well, which I didn't test)
== Development tools
- Visual Studio Code (actually VSCodium on my personal machines) IDE for most things, with the extensions:
  - Prettier for formatting most code except the HTML/EJS, as I prefer VSCode's default formatter for that
  - Tinymist Typst for this documentation
- Visual Studio IDE for the Avalonia-based desktop/mobile app with the AXAML Viewer extension
- Git for version control with GitHub for remote storage
== Authentication
- JWT based authentication, which contains the logged in user's id. For the website, this is stored and sent to the server as a cookie, for the API it uses the Authentication HTTP header with the Bearer type.
=== Roles
- Guest (not logged in)
  - can view posts, comments, user profiles
- User
  - can create posts, comments, can edit/delete their own posts, comments and edit their own profile
- Admin
  - can edit/delete anything
  - use admin functions such as viewing logs
= Database
This diagram is automatically generated from the database definition in the Sequelize ORM, using the `sequelize-erd` NPM package.

However, probably due to the package having not been updated in a long time, it seems the generated diagram isn't 100% correct. The *Comment* table references itself as _ParentId_ to represent a comment hierarchy, and the arrow belonging to this is mistakenly drawn on the *Comment*-<*CommentVote* as *Comment*>-<*CommentVote*. Therefore I edited the diagram shown here in Inkscape (it is just an svg) and drew a new arrow.
#align(center, image("../web/erd.svg", height: 76%))
= API
This section is generated from the openapi specification, defined at `web/openapi.yaml`, served by the server at `/openapi.json`. An interactive version of this is also served by the server at `/api-docs`, which is very useful for #link(<manual-testing>, "manually testing") the API.
#let openapi = yaml("../web/openapi.yaml")
#for (path, methods) in openapi.paths [
  #for (method, details) in methods [
    #if (method == "parameters") { continue }

    #upper(method) #path
  ]
]
= Testing
<manual-testing>
== Manual testing
== Unit testing
