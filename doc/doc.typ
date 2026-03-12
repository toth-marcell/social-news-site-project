#let title = "Social news site project"
#let author = "Marcell Tóth"
#set text(font: "Inter", stylistic-set: (2, 7))
#set document(title: title, author: author)
#show heading.where(level: 1): it => [#pagebreak() #align(center, text(1.5em, it))]
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

= Specification
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
