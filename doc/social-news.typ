#let title = "Social news projekt"
#let author = "Tóth Marcell"
#set text(lang: "hu", font: "Inter", stylistic-set: (2, 7))
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

= Specifikáció
<specification>
== Projekt leírás
<project-description>
== Technológiák
<technologies>
== Fejlesztési eszközök
<development-tools>
== Autentikáció
<authentication>
=== Szerepkörök
<roles>
- Vendég (nincs bejelentkezve)
  - megnézhet bejegyzéseket, megjegyzéseket és felhasználói profilokat
- Felhasználó
  - létrehozhat bejegyzéseket, megjegyzéseket
  - szerkesztheti és törölheti saját bejegyzéseit, megjegyzéseit
  - szerkesztheti saját profilját
- Adminisztrátor
  - szerkeszthet és törölhet bármit
  - megnézheti a naplót
  - módosíthatja más felhasználók adminisztrátori státuszát
= Adatbázis
Ez az adatbázis-diagram automatikusan van elkészítve az adatbázis definícióból.
<database>
#align(center, image("../web/erd.svg", height: 76%))
= API
<api>
#let openapi = yaml("../web/openapi.yaml")
#for (path, methods) in openapi.paths [
  #for (method, details) in methods [
    #if (method == "parameters") { continue }

    #upper(method) #path
  ]
]
= Tesztelés
<testing>
== Manuális tesztelés
<manual-testing>
== Automatikus tesztelés
<automatic-testing>
