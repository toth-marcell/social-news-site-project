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
Ez a projekt egy #link("https://en.wikipedia.org/wiki/Social_news_website")["social news site"], tehát egy olyan weboldal (és hozzátartozó asztali, illetve mobilalkalmazás) ahol a felhasználók bejegyzéseket hozhatnak létre, amik általában linkeket tartalmaznak cikkekre, vagy blogbejegyzésekre (de tartalmazhatnak szöveget is).
Más felhasználók pedig tudnak szavazni ezekre a bejegyzésekre, ezzel feljebb sorolva azokat a főoldalon.
Emellett tudnak megjegyzéseket tenni a bejegyzésekre, egy hierarchikus komment rendszerben.
== Technológiák
<technologies>
- Weboldal: Express (Node.js) alapú szerver, ami EJS szerveroldali renderelést használ, illetve HTML űrlapokat a bemenethez. Reszponzív és követi az eszköz világos/sötét témáját.
- API: Express (Node.js) alapú REST API szerver, OpenAPI-al dokumentálva
- Adatbázis: Sequelize ORM, sqlite-ra beállítva, de egyszerűen konfigurálható más relációs adatbázis használatára
- Asztali és mobilalkalmazás: Avalonia C\# többplatformú applikáció, működik asztali operációs rendszereken és Androidon is (emellett az Avalonia használata miatt lehet egy iOS ás böngészős verzió is, de ezeket nem teszteltem, mivel nincs iOS eszközöm, a böngészős verzió pedig nem kell, van "natív" weboldal)
== Fejlesztési eszközök
<development-tools>
- Visual Studio Code IDE a legtöbb dologhoz, a következő bővítményekkel:
  - Prettier a kód automatikus formázásához (kivéve a HTML/EJS-hez, ehhez a VSCode beépített formázóját használtam)
  - Tinymist Typst ennek a dokumentációnak a készítéséhez
- Visual Studio IDE az Avalonia alapú asztali és mobilalkalmazáshoz az AXAML Viewer bővítménnyel
== Autentikáció
<authentication>
- JWT (json web token) alapú autentikáció, ami tartalmazza a belépett felhasználó azonosítóját
  - a weboldalon ez egy cookieban van tárolva
  - az API-nál ez az Authentication HTTP fejléc Bearer típusát használja
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
<database>
Ez az adatbázis-diagram automatikusan van elkészítve az Sequelize ORM adatbázis definícióból, a `sequelize-erd` NPM csomaggal.

Viszont mivel ez a csomag elég régen volt frissítve, nem 100%-ban korrekt a diagram, így ezt szerkesztenem kellett. Mivel a diagram csak egy svg, így Inkscape-ben ezt egyszerűen meg lehet tenni. A hiba azért van, mert a *Comment* tábla saját magára utal a _ParentId_ mezőjében, ezzel ábrázolja a kommentek alatti kommenteket. Ez a kapcsolat az automatikus diagram rosszul a *Comment*-<*CommentVote* kapcsolatra van rárajzolva, így: *Comment*>-<*CommentVote*. Tehát ez két külön nyíl lenne, ami lent a szerkesztett verzióban látható.
#align(center, image("../web/erd.svg", height: 76%))
= API
<api>
Ez a rész az API OpenAPI specifikációjából van generálva, ami a `web/openapi.yaml` forrásfájlban van definiálva, és a szerveren elérhető az `/openapi.json` útvonalon. Ennek egy interaktív verzió elérhető a szerveren a `/api-docs` útvonalon, ami ennél a statikus oldalán sokkal hasznosabb az API megismerésére és #link(<manual-testing>)[manuális tesztelésére].
#let openapi = yaml("../web/openapi.yaml")
#for (path, methods) in openapi.paths [
  #for (method, details) in methods [
    #if (method == "parameters") { continue }

    *#upper(method)* #path
  ]
]
= Tesztelés
<testing>
== Manuális tesztelés
<manual-testing>
== Automatikus tesztelés
<automatic-testing>
