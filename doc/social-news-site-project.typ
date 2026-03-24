#pdf.attach("social-news-site-project.typ", relationship: "source")
#pdf.attach("../web/openapi.yaml", relationship: "data")
#pdf.attach("../web/tests.json", relationship: "data")
#pdf.attach("../web/erd.svg", relationship: "data")
#pdf.attach("uml/model-viewmodel.pdf", relationship: "data")
#pdf.attach("uml/usecase.pdf", relationship: "data")
#let title = "Social news projekt"
#let author = "Tóth Marcell"
#set text(12pt, lang: "hu", font: "Times New Roman")
#set document(title: title, author: author)
#show heading.where(level: 1): it => [#pagebreak() #align(center, text(14pt, weight: "bold", it))]
#show heading.where(level: 2): it => text(14pt)[* #it *]
#show heading.where(level: 3): it => text(12pt)[*_ #it  _*]
#set heading(numbering: "1.")
#set page(
  margin: 2.5cm,
  footer: context {
    align(center)[
      #counter(page).get().first() / #counter(page).final().first()
    ]
  },
)
#set par(justify: true, leading: 1.5em, first-line-indent: (amount: 1cm, all: true))
#show table: set par(leading: .65em, justify: false)
#show table.cell: it => align(left, it)
#show link: it => text(blue, it)
#show raw: set text(font: "Hack")
#show figure: set block(breakable: true)
#show figure.where(
  kind: table,
): set figure.caption(position: top)

#v(30%)
#align(center)[
  #image("../web/public/logo.svg", width: 30%),
  #text(2.5em)[* #title *]

  #text(1.5em)[_ #author _]

  Forrásfájlok: https://github.com/toth-marcell/social-news-site-project

  Weboldal: https://social-news.toth-marcell.xyz/
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
- Weboldal: Express (Node.js) alapú szerver, ami EJS szerveroldali renderelést használ, illetve HTML űrlapokat a bemenethez. Reszponzív és követi az eszköz világos/sötét témáját. Az SSR (szerver oldali renderelés) miatt használható böngészőoldali Javascript nélkül is, de pár kényelmi funkció csak azzal érhető el.
- API: Express (Node.js) alapú REST API szerver, OpenAPI-al dokumentálva
- Adatbázis: Sequelize ORM, sqlite-ra beállítva, de egyszerűen konfigurálható más relációs adatbázis használatára
- Asztali és mobilalkalmazás: Avalonia C\# többplatformú applikáció, működik asztali operációs rendszereken és Androidon is (emellett az Avalonia használata miatt lehet egy iOS és böngészős verzió is, de ezeket nem teszteltem, mivel nincs iOS eszközöm, a böngészős verzió pedig nem kell, van "natív" weboldal)

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
  - listázhatja a felhasználókat
  - módosíthatja bármelyik felhasználó adatait, és adminisztrátorrá teheti őket, vagy elveheti admin státuszukat (viszont nem a sajátját)

= Adatbázis
<database>

Az adatbázis eléréséhez a Sequelize ORM-et használom. A `sqlite` adatbázisra van konfigurálva, mert így egyszerűbb a szerver futtatása, az adatbázis csak egy fájlban van tárolva, nem kell külön az adatbázis futtatásával foglalkozni. Viszont ha kellene, például a szoftver skálázása miatt, más adatbázist használni, a Sequelize használata miatt egyszerű átkonfigurálni.

== Adatbázis diagram
Ez az adatbázis-diagram automatikusan van elkészítve az Sequelize ORM adatbázis definícióból, a `sequelize-erd` NPM csomaggal.

Viszont mivel ez a csomag elég régen volt frissítve, nem 100%-ban korrekt a diagram, így ezt szerkesztenem kellett. Mivel a diagram csak egy svg, így Inkscape-ben ezt egyszerűen meg lehet tenni. A hiba azért van, mert a *Comment* tábla saját magára utal a _ParentId_ mezőjében, ezzel ábrázolja a kommentek alatti kommenteket. Ez a kapcsolat az automatikus diagram rosszul a *Comment*-<*CommentVote* kapcsolatra van rárajzolva, így: *Comment*>-<*CommentVote*. Tehát ez két külön nyíl lenne, ami lent a szerkesztett verzióban látható.
#pagebreak()
#figure(image("../web/erd.svg", height: 1fr), caption: "Adatbázis diagram")

= REST API
<api>
Ez a rész az API OpenAPI specifikációjából van generálva, ami a `web/openapi.yaml` forrásfájlban van definiálva, és a szerveren elérhető a #link("https://social-news.toth-marcell.xyz/openapi.json")[/openapi.json] útvonalon.
Ennek egy interaktív verziója elérhető a szerveren a #link("https://social-news.toth-marcell.xyz/api-docs/")[/api-docs] útvonalon, ami ennél az oldalán sokkal hasznosabb az API megismerésére és #link(<manual-testing>)[manuális tesztelésére], főleg hogy sokkal több információt tartalmaz, ami ebbe az egyszerű táblázatba nem fért bele.
#let openapi = yaml("../web/openapi.yaml")
#figure(
  table(
    columns: 3,
    table.header([*Metódus*], [*Útvonal*], [*Leírás*]),
    ..openapi
      .paths
      .pairs()
      .map(((path, methods)) => {
        methods
          .pairs()
          .filter(x => x.at(0) != "parameters")
          .map(((method, details)) => {
            return (
              [
                *#upper(method)*
              ],
              [
                #path
              ],
              [
                #details.summary
              ],
            )
          })
      })
      .flatten(),
  ),
  caption: "API útvonalak",
)
#set page("a3", flipped: true)
= Avalonia asztali- és mobilalkalmazás osztálydiagram
== ViewModel és Model osztályok
#image("uml/model-viewmodel.pdf", height: 1fr)
#set page("a4", flipped: true)
= Használati eset diagram
#image("uml/usecase.pdf", height: 1fr))
#set page(flipped: false)
= Tesztelés
<testing>

== Manuális tesztelés
<manual-testing>

== API manuális tesztelése
Ugyan az API van automatikus tesztelve, lehetőség van manuálisan is tesztelni, illetve

== Felhasználói felületek tesztelése
A felhasználói felületeket (a weboldalt, asztali- és mobilalkalmazást) manuálisan teszteltem.
Egy teljes kézi tesztelést úgy lehet végrehajtani, hogy követjük a #link(<user-documentation>)[felhasználói dokumentációt] és kipróbálunk minden egyes listázott funkciót.
Minden gombnyomásnál pedig megnézzük, hogy az történt-e, amit vártunk.
Ezt a felhasználói dokumentáció írása közben is megcsináltam, tehát azt mondhatjuk, minden ott listázott funkció megfelelően működik.

A manuális tesztelés előtt, ha szeretnénk, hogy legyenek már felhasználók, bejegyzések és kommentek, ne üres legyen minden, futtassuk a `generateTestData` scriptet, pl. `pnpm run generateTestData`. Ez a script létrehoz sok adatot véletlenszerű nevekkel/szöveggel/stb.

== Automatikus tesztelés
<automatic-testing>

=== Web szerver egység és integrációs tesztelése
<web-automatic-testing>
A web szerver tesztelése a `jest` és `supertest` NPM csomaggal történt. A `jest`-et használtam a tesztek kezelése, ez találja meg és futtatja a tesztfájlokat, és készítési el a tesztelés eredményét és a code coverage adatokat. A `supertest` a szerver futtatására van, hogy ne kelljen elindítani/megállítani a szervert manuálisan.
A `web` könyvtárból futtatható a teszt a `pnpm test` paranccsal, vagy a `pnpm run testToJson` parancssal a JSON formátumú eredmények kiírásához.

=== Web szerver egység és integrációs teszteredmények

A következő táblázatok automatikus lettek generálva a `jest` JSON kimenetéből.

#let tests = json("../web/tests.json")
#for suite in tests.testResults [
  #let testFileName = suite.name.split(regex("/|\\\\")).last()
  #figure(
    table(
      columns: (auto, 1fr, 1.2fr, 4em),
      table.header([*Siker?*], [*Kategória*], [*Teszt neve*], [*Idő*]),
      ..suite
        .assertionResults
        .map(result => (
          [
            #if not result.failing { sym.checkmark }
          ],
          [
            #result.ancestorTitles.join(" - ")
          ],
          [
            #result.title
          ],
          [
            #result.duration ms
          ],
        ))
        .flatten(),
    ),
    caption: [#testFileName teszt fájl eredményei],
  )
]

= Felhasználói dokumentáció
<user-documentation>

A felhasználók dönthetnek két felület közül: az asztali- és mobilalkalmazás csak az egyszerű használatra van készítve, lehet regisztrálni vagy belépni, majd böngészni a bejegyzések között, létrehozni bejegyzést, szavazni, olvasni és írni kommenteket, illetve szerkeszteni a saját tartalmat.

Ezzel szemben a weboldal sokkal több funkciót tartalmaz: Meg lehet nézni felhasználók profilját, szűrni a bizonyos felhasználók bejegyzéseire és megjegyzéseire, szerkeszteni a saját profilt.
Illetve csak a weboldalon érhetők el az adminisztrátori funkciók: napló olvasása, felhasználók szerkesztése.

== Weboldal
#show image: it => block(stroke: black, it)
A weboldal elérhető itt: https://social-news.toth-marcell.xyz/

Az első látogatáskor a főoldalon láthatjuk a bejegyzéseket, legelöl a mai legtöbbet szavazott bejegyzéseket.
A jobb felső sarokban vannak linkek a regisztráció, illetve a bejelentkezés oldalakra, mivel nem vagyunk még bejelentkezve.
#figure(image("screenshots/web/frontpage-first.png"), caption: "Web: Főoldal, első látogatás")
#figure(image("screenshots/web/post-first.png"), caption: "Web: Egy bejegyzés")
Ha rákattintunk egy posztra, láthatjuk a részleteit, ha vannak, kommenteket. Viszont mivel nem vagyunk bejelentkezve, mi nem tudunk válaszolni rá.
Viszont ha be vagyunk jelentkezve, akkor látható egy megjegyzés mező és gomb, amivel a bejegyzésre tudunk kommentelve, illetve a kommenteken látható lesz egy válasz gomb.
#figure(image("screenshots/web/post.png"), caption: "Web: Egy bejegyzés, bejelentkezve")
A regisztrációhoz nyomjuk meg a jobb felső sarokban a regisztráció gombot, ami linkel a regisztrációs oldalra.
Itt meg kell adnunk a kívánt nevet és jelszót.
A jelszó alapból ki van csillagozva, a jobb oldalán van egy gomb, amivel meg lehet jeleníteni, vagy újból elrejteni.

A regisztráció gombra kattintva két kimenet lehet:
- ha sikeres a regisztráció, akkor átirányít a belépés oldalra, hogy be tudjunk lépni a frissen készített fiókunkba.
- ha nem sikeres a regisztráció, akkor maradunk ezen az oldalon és kapunk egy hibaüzenetet
#figure(image("screenshots/web/register.png"), caption: "Web: Regisztráció")
#figure(image("screenshots/web/register-nametaken.png"), caption: "Web: Sikertelen regisztráció")
A belépés oldalra eljutunk a sikeres regisztráció után, vagy meglátogathatjuk a jobb felső sarokban található gombbal. Itt is egy felhasználónevet és jelszót kell megadni, és a jelszó itt is megnézhető/elrejthető.
Az űrlap beküldése után két eredmény lehet:
- ha nem sikeres a bejelentkezés, akkor maradunk az oldalon és kapunk egy hibaüzenetet
- ha sikeres, a szerver beállítja az autentikációs tokent cookie-ként, és átirányít a főoldalra
#figure(image("screenshots/web/login-after-register.png"), caption: "Web: Belépés regisztráció után")
#figure(image("screenshots/web/frontpage-after-login.png"), caption: "Web: Főoldal, belépve")
Ha be vagyunk lépve, akkor a felső menü megváltozik: a bal oldalán megjelenik egy gomb új bejegyzés létrehozásához, a jobb oldalán pedig látjuk a felhasználónevünket, pontjainkat, és egy a registráció/bejelentkezés gombok helyett egy kilépés gombot.

Ha egy adminisztrátorként vagyunk belépve, akkor a felső navigációs menüben láthatunk még 2 gombot, a napló olvasására, és a felhasználók listázására.
#figure(image("screenshots/web/frontpage-admin.png"), caption: "Web: Főoldal, adminisztrátor")
== Asztali- és mobilalkalmazás
Az asztali és mobilalkalmazás ugyanabból a forráskódból készült, így ugyanazok a funkciók érhetők el.

A telepítőkészleteik elérhetők a weboldalon: // TODO
#outline(indent: 2em, target: figure.where(kind: table), title: "Táblázatok")
#outline(indent: 2em, target: figure.where(kind: image), title: "Ábrák")
