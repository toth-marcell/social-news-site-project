#import "@preview/dtree:0.1.0": dtree
#pdf.attach("social-news-site-project.typ", relationship: "source")
#pdf.attach("../web/openapi.yaml", relationship: "data")
#pdf.attach("../web/tests.json", relationship: "data")
#pdf.attach("../web/erd.svg", relationship: "data")
#pdf.attach("uml/view-app.pdf", relationship: "data")
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
  header: context {
    if (counter(page).get().first() != 1) [
      #set par(first-line-indent: 0pt)
      * #title * #h(1fr) _ #author _
      #v(-.5em)
      #line(length: 100%)
    ]
  },
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
Ez a projekt egy #link("https://en.wikipedia.org/wiki/Social_news_website")["social news site"], tehát egy olyan weboldal (és hozzátartozó asztali, illetve mobil alkalmazás) ahol a felhasználók bejegyzéseket hozhatnak létre, amik általában linkeket tartalmaznak cikkekre, vagy blogbejegyzésekre (de tartalmazhatnak szöveget is).
Más felhasználók pedig tudnak szavazni ezekre a bejegyzésekre, ezzel feljebb sorolva azokat a főoldalon.
Emellett tudnak megjegyzéseket tenni a bejegyzésekre, egy hierarchikus komment rendszerben.

== Technológiák
<technologies>
- Weboldal: Express (Node.js) alapú szerver, ami EJS szerveroldali renderelést használ, illetve HTML űrlapokat a bemenethez. Reszponzív és követi az eszköz világos/sötét témáját. Az SSR (szerver oldali renderelés) miatt használható böngészőoldali Javascript nélkül is, de pár kényelmi funkció csak azzal érhető el.
- API: Express (Node.js) alapú REST API szerver, OpenAPI-al dokumentálva
- Adatbázis: Sequelize ORM, sqlite-ra beállítva, de egyszerűen konfigurálható más relációs adatbázis használatára
- Asztali és mobil alkalmazás: Avalonia C\# többplatformú applikáció, működik asztali operációs rendszereken és Androidon is (emellett az Avalonia használata miatt lehet egy iOS és böngészős verzió is, de ezeket nem teszteltem, mivel nincs iOS eszközöm, a böngészős verzió pedig nem kell, van "natív" weboldal)

== Fejlesztési eszközök
<development-tools>
- Visual Studio Code IDE a legtöbb dologhoz, a következő bővítményekkel:
  - Prettier a kód automatikus formázásához (kivéve a HTML/EJS-hez, ehhez a VSCode beépített formázóját használtam)
  - Tinymist Typst ennek a dokumentációnak a készítéséhez
- Visual Studio IDE az Avalonia alapú asztali és mobil alkalmazáshoz az AXAML Viewer bővítménnyel

== Autentikáció
<authentication>
- JWT (json web token) alapú autentikáció, ami tartalmazza a belépett felhasználó azonosítóját
  - a weboldalon ez egy cookie-ban van tárolva
  - az API-nál ez az Authentication HTTP fejléc Bearer típusát használja
- Egy bejelentkezés 1 évig él, utána újra be kell lépni
- A jelszavaknak min 8 karakterből kell állniuk
- A jelszó hash-elés először sha256-al hasheli, majd bcrypt-el a jelszavakat, így nem probléma a bcrypt max bemenethossza, lehet hosszabb jelszót (passphrase) is használni.

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

== Futtatás fejlesztőként
=== Weboldal és API szerver
A szerver a `web` könyvtárban található. Telepíteni kell a (p)npm függőségeket, és átmásolni,illetve szerkeszteni a `.env.example` fájlt a `.env` névre.
Ezután el lehet indítani a szervert vagy a `pnpm start`-al, production futtatásra, vagy `pnpm dev`-el, ami egy fejlesztői szervert indít, ami figyeli a fájlváltozást, és újraindítja a szervert, ha módosult.

=== .env konfiguráció
- `PORT`: a port, amin a szerver fut
- `SECRET`: titok JWT aláíráshoz
- `SITENAME`: a weboldal neve, ami több helyen előfordul
- `DEFAULT_ADMIN_NAME` és `DEFAULT_ADMIN_PASSWORD`: a szerver indulás közben elkészít ezekkel az adatokkal egy felhasználót. Ha ezekből legalább egy üres vagy nincs beállítva, akkor ez nem történik meg. Akkor sem történik meg, ha a megadott felhasználónév már létezik.

=== Mobil és asztali alkalmazás
Az `app` mappában található az Avalonia solution.
A Visual Studio IDE vagy a `dotnet`-el lehet összerakni asztali operációs rendszerre és Androidra.
Egy böngészős és egy iOS verzió is támogatott elvileg a solution által, de ezek nincsenek tesztelve, csak esetleges jövőbeli fejlesztésként hagytam ott, mivel van natív weboldal, és nincs hozzáférésem iOS eszközhöz.

Ha szeretnénk, hogy más szervert használjon a program (pl. a lokális szervert, amit éppen fejlesztünk), azt a `app\SocialNewsApp\ViewModels\MainViewModel.cs` fájlban lehet átírni.
Az Android alkalmazásnál fontos megjegyezni, hogy alapértelmezetten biztonsági okokból titkosítás nélküli http-n keresztül nem tud kommunikálni.
Ha viszont fejlesztésnél valószínűleg nem akarjuk a https-t megcsinálni, akkor ezt ki lehet kapcsolni, lásd a kommentet a `app\SocialNewsApp.Android\Properties\AndroidManifest.xml` fájlban.

= Forráskód térkép
Itt látható a forráskód mappái és fájljai kommentelve. Az ábra nem egy konkrét mélységig ábrázolja a fájlokat, mert egyes fájlokhoz nem szükséges egyéni leírás (pl. a dokumentációban a képeknek, az EJS sablonoknak, stb.).
#{
  show figure: set align(left)
  figure(
    dtree(
      ```
      doc
       screenshots/ - Képernyőképek a felhasználói felületekről
         desktop/
         mobile/
         web/
       social-news-site-project.typ - Dokumentáció tartalma
       uml/ - UML diagramok
        model-viewmodel.drawio.svg - Avalonia projekt Model és ViewModel rétegek osztálydiagramja
        usecase.drawio.svg - Használati eset diagram
        view-app.drawio.svg - Avalonia projekt View és App rétegek osztálydiagramja
      ```,
      size: 13pt,
    ),
    caption: "Dokumentáció forráskód térkép",
    kind: "diagram",
    supplement: "Diagram",
  )
  figure(
    dtree(
      ```
      app
       Directory.Packages.props
       SocialNewsApp/ - platformfüggetlen fájlok
        App.axaml
        App.axaml.cs - belépőpont
        Assets/
         logo.png
        Models/
         API.cs
         Comment.cs
         Message.cs
         MessageWithToken.cs
         NamePassword.cs
         Post.cs
         PostPage.cs
         User.cs
        Persistence/
         SettingsStorage.cs
        SocialNewsApp.csproj
        ViewLocator.cs
        ViewModels/
         MainViewModel.cs
         PostEditorViewModel.cs
         ViewModelBase.cs
        Views/
         CommentControl.axaml
         MainView.axaml
         MainWindow.axaml
         PostControl.axaml
         PostDetailsControl.axaml
         PostEditorControl.axaml
         CommentControl.axaml.cs
         MainView.axaml.cs
         MainWindow.axaml.cs
         PostControl.axaml.cs
         PostDetailsControl.axaml.cs
         PostEditorControl.axaml.cs
       SocialNewsApp.Android/
        Icon.png
        MainActivity.cs - Android aktivitás konfigurációja
        Properties/
         AndroidManifest.xml - Android alkalmazás konfigurációja
        Resources/
         AboutResources.txt
         drawable/
          splash_screen.xml - betöltési képernyő definíció
         values/ - betöltési képernyő színek
         values-night/ - betöltési képernyő színek sötét módra
        SocialNewsApp.Android.csproj
       SocialNewsApp.Browser/ - böngészős nézet, nem használt, lehet jövőbeli fejlesztés
       SocialNewsApp.Desktop/ - asztali alkalmazás, nem szükséges szerkesztése
       SocialNewsApp.iOS/ - iOS applikáció, nem használt, lehet jövőbeli fejlesztés
       SocialNewsApp.sln
      ```,
      size: 13pt,
    ),
    caption: "Asztali és mobilalkalmazás forráskód térkép",
    kind: "diagram",
    supplement: "Diagram",
  )
  figure(
    dtree(
      ```
      web
       jest.config.mjs - teszt keretrendszer konfiguráció
       middleware/
        apiAuth.js - header alapú autentikáció az API-hoz
        log.js - naplózási middleware
        webAuth.js - cookie alapú autentikáció a weboldalhoz
       models/
        admin.js - adminisztrátori funkciókhoz függvények
        auth.js - függvények autentikáció és felhasználó kezeléshez
        models.js - adatbázis táblák definíciója
        posts.js - függvények bejegyzések és megjegyzések kezeléséhez
       openapi.yaml - API útvonalak dokumentációja
       package.json - npm függőségek, scriptek
       pnpm-lock.yaml - pnpm lockfájl
       public/ - weboldalon nyilvános fájlok (ide lehet tenni a dokumentáció PDF-et és telepítőkészleteket)
        logo.svg
        script.js
        style.css
       routes/
        api.js - API útvonalak
        web.js - weboldal útvonalak
       server.js - fő fájl, ezt futtatjuk a szerver indításához
       tests/ - automatikus teszt fájlok
        api.test.js
        auth.test.js
        defaultAdmin.test.js
        erd.test.js
        server.test.js
        setup.js - tesztelő környezet előkészítés
        teardown.js - tesztelő környezet szétszedés
       utils/
        defaultAdmin.js - automatikus admin készítése
        erd.js - automatikus adatbázis-diagram generálás
        generateTestData.js - véletlenszerű adatok generálása manuális teszteléshez
       views/ - EJS sablonok a weboldalhoz
      ```,
      size: 13pt,
    ),
    caption: "Web és API szerver forráskód térkép",
    kind: "diagram",
    supplement: "Diagram",
  )
}
= Adatbázis
<database>

Az adatbázis eléréséhez a Sequelize ORM-et használom. A `sqlite` adatbázisra van konfigurálva, mert így egyszerűbb a szerver futtatása, az adatbázis csak egy fájlban van tárolva, nem kell külön az adatbázis futtatásával foglalkozni. Viszont ha kellene, például a szoftver skálázása miatt, más adatbázist használni, a Sequelize használata miatt egyszerű átkonfigurálni.

== Adatbázis diagram
Ez az adatbázis-diagram automatikusan van elkészítve az Sequelize ORM adatbázis definícióból, a `sequelize-erd` NPM csomaggal.

Viszont mivel ez a csomag elég régen volt frissítve, nem 100%-ban korrekt a diagram, így ezt szerkesztenem kellett. Mivel a diagram csak egy svg, így Inkscape-ben ezt egyszerűen meg lehet tenni. A hiba azért van, mert a *Comment* tábla saját magára utal a _ParentId_ mezőjében, ezzel ábrázolja a kommentek alatti kommenteket. Ez a kapcsolat az automatikus diagram rosszul a *Comment*-<*CommentVote* kapcsolatra van rárajzolva, így: *Comment*>-<*CommentVote*. Tehát ez két külön nyíl lenne, ami lent a szerkesztett verzióban látható.
#pagebreak()
#figure(image("../web/erd.svg", height: 1fr), caption: "Adatbázis diagram", kind: "diagram", supplement: "Diagram")

= REST API
<api>
Ez a rész az API OpenAPI specifikációjából van generálva, ami a `web/openapi.yaml` forrásfájlban van definiálva, és a szerveren elérhető a #link("https://social-news.toth-marcell.xyz/openapi.json")[/openapi.json] útvonalon.
Ennek egy interaktív verziója elérhető a szerveren a #link("https://social-news.toth-marcell.xyz/api-docs/")[/api-docs] útvonalon, ami ennél az oldalán sokkal hasznosabb az API megismerésére és #link(<manual-testing>)[manuális tesztelésére], főleg hogy sokkal több információt tartalmaz, ami ebbe az egyszerű táblázatba nem fért bele, mint például részletes leírás minden útvonalról, és a pontos bemeneti és kimeneti sémák.
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
= Asztali és mobil alkalmazás osztálydiagramok
Ezeket a diagrammokat a draw.io segítségével készítettem.
#figure(
  image("uml/view-app.pdf", height: 1fr),
  caption: "View és App réteg osztálydiagram",
  kind: "diagram",
  supplement: "Diagram",
)
#set page("a3", flipped: true)
#figure(
  image("uml/model-viewmodel.pdf", height: 1fr),
  caption: "ViewModel és Model réteg osztálydiagram",
  kind: "diagram",
  supplement: "Diagram",
)
#set page("a4", flipped: true)
= Használati eset diagram
#figure(
  image("uml/usecase.pdf", height: 1fr),
  caption: "Használati eset diagram",
  kind: "diagram",
  supplement: "Diagram",
)
#set page(flipped: false)
= Tesztelés
<testing>

== Manuális tesztelés
<manual-testing>

== API manuális tesztelése
Ugyan az API van automatikus is tesztelve, lehetőség van manuálisan is tesztelni.
Erre a legjobb az OpenAPI definíció alapján készült interaktív oldal: https://social-news.toth-marcell.xyz/api-docs

== Felhasználói felületek tesztelése
A felhasználói felületeket (a weboldalt, asztali  és mobil alkalmazást) manuálisan teszteltem.
Egy teljes kézi tesztelést úgy lehet végrehajtani, hogy követjük a #link(<user-documentation>)[felhasználói dokumentációt] és kipróbálunk minden egyes listázott funkciót.
Minden gombnyomásnál pedig megnézzük, hogy az történt-e, amit vártunk.
Ezt a felhasználói dokumentáció írása közben is megcsináltam, tehát azt mondhatjuk, minden ott listázott funkció megfelelően működik.

A manuális tesztelés előtt, ha szeretnénk, hogy legyenek már felhasználók, bejegyzések és kommentek, ne üres legyen minden, futtassuk a `generateTestData` script-et, pl. `pnpm run generateTestData`. Ez a script létrehoz sok adatot véletlenszerű nevekkel/szöveggel/stb.

== Automatikus tesztelés
<automatic-testing>

=== Web szerver egység és integrációs tesztelése
<web-automatic-testing>
A web szerver tesztelése a `jest` és `supertest` NPM csomaggal történt. A `jest`-et használtam a tesztek kezelésére, ez találja meg és futtatja a tesztfájlokat, és készítési el a tesztelés eredményét és a code coverage adatokat. A `supertest` a szerver futtatására van, hogy ne kelljen elindítani/megállítani a szervert manuálisan.
A `web` könyvtárból futtatható a teszt a `pnpm test` paranccsal, vagy a `pnpm run testToJson` parancssal, ha JSON formátumban szeretnénk az eredményeket.

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

A felhasználók dönthetnek két felület közül: az asztali és mobil alkalmazás csak az egyszerű használatra van készítve, lehet regisztrálni vagy belépni, majd böngészni a bejegyzések között, létrehozni bejegyzést, szavazni, olvasni és írni kommenteket, illetve szerkeszteni a saját tartalmat.

Ezzel szemben a weboldal sokkal több funkciót tartalmaz: Meg lehet nézni felhasználók profilját, szűrni a bizonyos felhasználók bejegyzéseire és megjegyzéseire, szerkeszteni a saját profilt.
Illetve csak a weboldalon érhetők el az adminisztrátori funkciók: napló olvasása, felhasználók szerkesztése.

== Weboldal
#show image: it => block(stroke: black, it)
A weboldal elérhető itt: https://social-news.toth-marcell.xyz/

Az első látogatáskor a főoldalon láthatjuk a bejegyzéseket, legelöl a mai legtöbbet szavazott bejegyzéseket. A felső navigációs rész bal oldalán lehet más rendezési típust is választani.
A jobb felső sarokban vannak linkek a regisztráció, illetve a bejelentkezés oldalakra, mivel nem vagyunk még bejelentkezve.
#figure(image("screenshots/web/frontpage-first.png"), caption: "Web: Főoldal, első látogatás")
#figure(image("screenshots/web/post-first.png"), caption: "Web: Egy bejegyzés")
Ha rákattintunk egy posztra, láthatjuk a részleteit, és ha vannak, a kommenteket, és azokon lévő kommenteket (ezt úgy látjuk, hogy a mélyebb megjegyzéseken bal oldali margó van). Viszont mivel nem vagyunk bejelentkezve, mi nem tudunk válaszolni rá.
Viszont ha be vagyunk jelentkezve, akkor látható egy megjegyzés mező és gomb, amivel a bejegyzésre tudunk kommentelve, illetve a kommenteken látható lesz egy válasz gomb.
<post-figure>
#figure(image("screenshots/web/post.png"), caption: "Web: Egy bejegyzés, bejelentkezve")
A regisztrációhoz nyomjuk meg a jobb felső sarokban a regisztráció gombot, ami linkel a regisztrációs oldalra.
Itt meg kell adnunk a kívánt nevet és jelszót.
A jelszó alapból ki van csillagozva, a jobb oldalán van egy gomb, amivel meg lehet jeleníteni, vagy újból elrejteni.
A biztonság miatt a jelszónak minimum 8 karakterből kell állnia.

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

Ha egy adminisztrátorként vagyunk belépve, akkor a felső navigációs menüben láthatunk még 2 gombot, a napló olvasására, és a felhasználók listázására. Erre még visszatérünk.
#figure(image("screenshots/web/frontpage-admin.png"), caption: "Web: Főoldal, adminisztrátor")
<post-constraints>
Az új bejegyzés oldalon megadhatjuk az új bejegyzésünk tartalmát, és közzétehetjük azt.
Egy bejegyzésnek meg kell felelnie a következő feltételeknek, amiket ha nem teljesítünk, megfelelő hibaüzenetet kapunk:
- A Title és Category mezőket mindenképpen ki kell tölteni
- Ha meg van adva Link akkor kell Link type, és fordítva is
- A Link/Linktype és a Textből legalább az egyiknek kell lennie, de lehet mindkettő is
Az új bejegyzés sikeres létrehozása után átirányít az oldalára, lásd #link(<post-figure>)[itt].
#figure(image("screenshots/web/newpost.png"), caption: "Web: Új bejegyzés oldal")
Az új bejegyzésünkre kommentelhetünk is.
Egy kommentre csak annyi követelmény van, hogy nem lehet üres.
Pontosan az is követelmény, hogy létezzen a bejegyzés vagy megjegyzés amire válaszol, de ilyen hibaüzenetet általában a felhasználó nem láthat (esetleg csak akkor, ha pont törölték a tartalmat amire kommentelni szeretett volna).

Emellett meg lehet figyelni, hogy a saját tartalmunkon (posztjainkon és megjegyzéseinkek) vannak törlésre és szerkesztésre gombok. Ezeket csak akkor láthatjuk, ha a saját tartalmunkat nézzünk, vagy ha adminisztrátor vagyunk, akik törölhetnek és szerkeszthetnek bármit, ezzel biztosítják, hogy a weboldal szabályai (amik elérhetők az oldal láblécén egy linken) be vannak tartva.

A törlés gomb megnyomásra törli a tartalmat. Ugyan lehetséges, hogy hibaüzenetet ad vissza (nincs jogosultság), de ez nem fog előfordulni a felhasználói felületen, mert a gomb eleve nem lesz látható ilyen esetben.

A szerkesztés gomb mind a bejegyzéseknél és kommenteknél elirányít a megfelelő szerkesztési űrlaphoz. A szerkesztésénél ugyanazoknak a követelményeknek kell megfelelni, mint a létrehozásnál.
#figure(image("screenshots/web/editpost.png"), caption: "Web: Bejegyzés szerkesztése oldal")
#figure(image("screenshots/web/editcomment.png"), caption: "Web: Megjegyzés szerkesztése oldal")
Bárhol, ahol egy felhasználó neve van, láthatunk egy profilképet is, egy úgynevezett identicon-t, ami a felhasználó nevéből van automatikusan generálva. Ezek linkelnek a felhasználó profil oldalára. A saját profilt meg lehet nyitni a navigációs sávból is.

A profil oldalon láthatjuk az adott felhasználó nevét, identicon-ját, pontszámát (bejegyzéseinek és megjegyzéseinek szavazatai összegét), regisztrációja dátumát és a leírását.
Innen listázhatjuk a bejegyzésit vagy megjegyzéseit is, a választott rendezési típussal.
#figure(image("screenshots/web/profile.png"), caption: "Web: Egy felhasználói profil")
Ha a saját profilunkon vagyunk, akkor azt szerkeszthetjük, illetve az adminisztrátorok tudják az összes felhasználót szerkeszteni, és akár adminná tenni őket.

A profil szerkesztésénél lehet változtatni a jelszót is, ha nem adunk meg új jelszót, akkor nem változik. Viszont a többi mezőt ki kell tölteni, különben az az adat törlődik (kivéve a névnél, hiszen kötelező egy felhasználónak hogy neve legyen).
#figure(image("screenshots/web/profile-own.png"), caption: "Web: Saját profil")
#figure(image("screenshots/web/profile-admin.png"), caption: "Web: Egy felhasználói profil adminként")
== Asztali és mobil alkalmazás
Az asztali és mobil alkalmazás ugyanabból a forráskódból készült, így ugyanazok a funkciók érhetők el.

A telepítőkészleteik elérhetők a weboldalon:
- Android: https://social-news.toth-marcell.xyz/xyz.toth_marcell.social_news.apk
- Windows: https://social-news.toth-marcell.xyz/SocialNewsApp.Desktop.zip

A program követi az eszköz világos vagy sötét témáját. A különböző oldalakról visszalépéshez a bal felső sarokban van egy gomb, de mobilon használhatjuk a telefon vissza gombját, ha pedig egerünkön van vissza gomb, az is működik.

#set grid(columns: (4fr, 1fr), column-gutter: .2cm)
Hasonlóan a weboldalhoz, az első megnyitáskor láthatjuk a bejegyzéseket, legelöl a mai legtöbbet szavazott bejegyzéseket. A felső navigációs rész bal oldalán lehet más rendezési típust is választani, illetve frissíteni a listát.
A navigációs sáv jobb oldalán lehet megnyitni a bejelentkezés és regisztráció oldalt.
#grid(
  figure(image("screenshots/desktop/first.png"), caption: "Windows: főoldal"),
  figure(image("screenshots/mobile/first.jpg"), caption: "Mobil: főoldal"),
)
A bejelentkezés és regisztráció oldalon be kell írnunk egy felhasználónevet és egy jelszót, majd megnyomni vagy a bejelentkezés, vagy a registráció gombot.
Az eredményről (siker vagy hibaüzenet) egy felugró ablak értesít.
Ha bejelentkezést csináltunk, és sikeres, akkor visszairányít a főoldalra.
#grid(
  figure(image("screenshots/desktop/login-or-register.png"), caption: "Windows: Bejelentkezés vagy regisztráció"),
  figure(image("screenshots/mobile/login-or-register.jpg"), caption: "Mobil: Bejelentkezés vagy regisztráció"),
)
Ha be vagyunk jelentkezve, a főoldal tetején írja a identicon-unkat, nevünket, pontjainkat.
A bejelentkezés gomb helyett egy kijelentkezés és egy új bejegyzés gomb jelenik meg.
Emelettett tudunk szavazni is bejegyzésekre.
#grid(
  figure(image("screenshots/desktop/first-loggedin.png"), caption: "Windows: főoldal, belépve"),
  figure(image("screenshots/mobile/first-loggedin.jpg"), caption: "Mobil: főoldal, belépve"),
)
Az új bejegyzés oldalon kitölthetjük az új bejegyzésünk tartalmát, és azt közzétehetjük. Itt is meg kell felelnie a posztnak a követelményeknek, #link(<post-constraints>)[részletezve itt].
#grid(
  figure(image("screenshots/desktop/newpost.png"), caption: "Windows: Új bejegyzés"),
  figure(image("screenshots/mobile/newpost.jpg"), caption: "Mobil: Új bejegyzés"),
)
Ha rákattintunk egy bejegyzésre a főoldalon, megnyílik annak oldala.
Ezeken a képeken egy adminisztrátorként vagyunk belépve, tehát az összes gomb látszódik, mindenre van jogunk.
A posztra lehet kommentelni (ha be vagyunk jelentkezve), erre van egy szövegmező és gomb.
#grid(
  figure(image("screenshots/desktop/post.png"), caption: "Windows: Egy bejegyzés"),
  figure(image("screenshots/mobile/post.jpg"), caption: "Mobil: Egy bejegyzés"),
)
A bejegyzést lehet törölni és szerkeszteni, ezeket csak a szerző vagy egy adminisztrátor tudja megtenni. A törlés a gomb megnyomása után azonnal megtörténik, felugró ablak értesít, hogy sikerült. A szerkesztéshez megnyílik egy új oldal, ahol a poszt tartalmát átírhatjuk.
#grid(
  figure(image("screenshots/desktop/post-edit.png"), caption: "Windows: Bejegyzés szerkesztése"),
  figure(image("screenshots/mobile/post-edit.jpg"), caption: "Mobil: Bejegyzés szerkesztése"),
)
A bejegyzésen lévő kommenteket is láthatjuk, és az azokon található kommenteket is. Mobilon, vagy egyéb nem elég széles kijelzőn, kell vízszintesen görgetni hogy lássuk a mélyebb kommenteket. Ezekre, ha be vagyunk jelentkezve, lehet szavazni, és válaszolni. A válasz gomb megnyomása utána megjelenik egy új szövegmező és gomb a válaszolásra (a válasz gomb újbóli megnyomásával el lehet azt tünteni, ha mégsem akarunk válaszolni).
#grid(
  figure(image("screenshots/desktop/comment-reply.png"), caption: "Windows: Válaszolás egy megjegyzésre"),
  figure(image("screenshots/mobile/comment-reply.jpg"), caption: "Mobil: Válaszolás egy megjegyzésre"),
)
Ha egy admin vagy a szerző vagyunk, lehet a megjegyzést törölni vagy szerkeszteni. Szerkesztés esetén a komment szövege egy szövegmezővé változik, és megjelenik egy gomb a mentésre. Ha mégsem akarjuk a változást elmenteni, újra meg lehet nyomni a szerkesztés gombot, ekkor visszaváltozik egyszerű szöveggé a megjegyzés.
#grid(
  figure(image("screenshots/desktop/comment-edit.png"), caption: "Windows: Megjegyzés szerkesztése"),
  figure(image("screenshots/mobile/comment-edit.jpg"), caption: "Mobil: Megjegyzés szerkesztése"),
)
#outline(indent: 2em, target: figure.where(kind: table), title: "Táblázatok")
#outline(indent: 2em, target: figure.where(kind: "diagram"), title: "Diagramok")
#outline(indent: 2em, target: figure.where(kind: image), title: "Ábrák")
