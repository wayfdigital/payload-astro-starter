# LinkedIn — 6 postów o naszym starterze

> Dokument roboczy do serii postów. Dla każdego tematu masz: **kąt** (o czym jest post, bez AI-slopu),
> **co jest nieoczywiste** (czym się chwalimy), **pliki** (klikalne linki do realnej implementacji),
> **fragmenty na screenshoty** (dokładne miejsca + numery linii) i **podpisy pod zrzuty**.
>
> Stack: **Payload CMS** (admin + API, port 3100) + **Astro SSR** (frontend, port 3000) + **@repo/ui** (design system).
> Monorepo `pnpm`. Wszystkie ścieżki niżej są prawdziwe.

---

## 1. PayloadCMS — testowanie maili lokalnie z Mailpit

**Kąt:** „Zero wysłanych prawdziwych maili w dev. Każdy mail (reset hasła, potwierdzenie formularza)
ląduje w lokalnej skrzynce, którą otwierasz w przeglądarce.” Pokazujesz, że dev środowisko jest
samowystarczalne — `docker compose up` i masz SMTP + web UI bez żadnego konta u zewnętrznego dostawcy.

**Co jest nieoczywiste / czym się chwalimy:**
- Adapter `nodemailer` z **defaultami celującymi w Mailpit** (`localhost:1025`) — działa out-of-the-box, bez konfiguracji.
- **Ten sam kod** działa lokalnie i na produkcji — różnica to tylko zmienne `SMTP_*`. Auth wysyłany tylko gdy podasz user+pass.
- Mailpit w `docker-compose` obok Postgresa — jeden `up` stawia całą infrastrukturę dev.
- Web UI maili pod **http://localhost:8025**.

**Pliki:**
- Adapter / transport: [apps/payload/src/payload/config/mail.ts](apps/payload/src/payload/config/mail.ts)
- Rejestracja w configu: [apps/payload/src/payload.config.ts](apps/payload/src/payload.config.ts) (`email: mailOptions`)
- Mailpit w Dockerze: [docker-compose.yml](docker-compose.yml#L13-L24)
- Zmienne SMTP: [apps/payload/.env.example](apps/payload/.env.example#L73-L84)
- Maile z formularzy (klient): [apps/astro/src/lib/payload/forms.ts](apps/astro/src/lib/payload/forms.ts#L19-L35)
- Auth maile (kolekcje z `auth`): [apps/payload/src/payload/collections/Admins.ts](apps/payload/src/payload/collections/Admins.ts), [apps/payload/src/payload/collections/Users.ts](apps/payload/src/payload/collections/Users.ts)

**Fragmenty na screenshoty:**

1. **Adapter z defaultami na Mailpit** — [mail.ts](apps/payload/src/payload/config/mail.ts). Cały plik (~25 linii) idealny na jeden zrzut.
   Podpis: *„Domyślnie celuje w Mailpit. Na produkcji wystarczy ustawić SMTP_HOST/PORT/USER/PASS — kod się nie zmienia. Auth leci tylko, gdy poda się dane.”*

2. **Mailpit w docker-compose** — [docker-compose.yml:13-24](docker-compose.yml#L13-L24).
   Podpis: *„SMTP na 1025, web UI na 8025. Jeden `docker compose up` i masz lokalną skrzynkę pocztową.”*

3. **Web UI Mailpit** (http://localhost:8025) — zrób realny screenshot przeglądarki z przykładowym mailem (np. reset hasła z panelu).
   Podpis: *„Każdy mail z aplikacji widać tutaj — nic nie wychodzi na świat.”*

---

## 2. Astro Preview — podgląd wersji roboczych (draft) z Payload na froncie SSR

**Kąt:** „Edytor klika »Podgląd« w Payloadzie i widzi niezopublikowaną stronę dokładnie tak, jak
wyrenderuje ją Astro — z live reloadem po każdym zapisie. Bez deploya, bez zgadywania.” To jeden z
trudniejszych tematów technicznych: rozdzielony CMS i frontend, a mimo to działający live preview.

**Co jest nieoczywiste / czym się chwalimy:**
- **Bezpieczeństwo na pierwszym miejscu:** publiczny ruch widzi tylko `_status: published`. Drafty wyciekają wyłącznie przy autoryzacji kluczem API admina — wymuszone w `wrapRead` na poziomie access control, nie w UI.
- **Dwa tryby podglądu:** Live Preview (iframe w panelu, reload po `postMessage`) i Preview (nowa karta przez endpoint `/preview` z sekretem → httpOnly cookie).
- **Współdzielony sekret** `PREVIEW_SECRET` między oboma aplikacjami + osobny `PAYLOAD_API_SECRET` do uwierzytelnionych odczytów draftów server-side.
- Drafty nigdy nie trafiają do cache CDN (`Cache-Control: no-store` w middleware).
- Zachowanie pozycji scrolla przy reloadzie iframe — drobiazg, ale robi różnicę w UX edytora.

**Pliki:**
- Plugin podglądu (URL-e, access gate, drafts): [apps/payload/src/payload/config/plugins/preview.ts](apps/payload/src/payload/config/plugins/preview.ts)
- Rejestracja pluginu na kolekcji `pages`: [apps/payload/src/payload/config/plugins/index.ts](apps/payload/src/payload/config/plugins/index.ts#L43-L63)
- Endpoint wejścia w preview (sekret → cookie): [apps/astro/src/pages/preview.ts](apps/astro/src/pages/preview.ts)
- Middleware (wykrycie preview, CSP, no-store): [apps/astro/src/middleware.ts](apps/astro/src/middleware.ts#L13-L34)
- Klient draftów z kluczem API: [apps/astro/src/lib/payload/client.ts](apps/astro/src/lib/payload/client.ts#L33-L58)
- Pobranie strony z fallbackiem draft→published: [apps/astro/src/lib/payload/pages.ts](apps/astro/src/lib/payload/pages.ts#L26-L56)
- Listener live preview (reload po zapisie): [apps/astro/src/components/preview/live-preview-listener.tsx](apps/astro/src/components/preview/live-preview-listener.tsx#L20-L86)
- Zmienne / sekrety: [apps/astro/.env.example](apps/astro/.env.example#L11-L18), [apps/payload/.env.example](apps/payload/.env.example)

**Fragmenty na screenshoty:**

1. **Access gate `wrapRead`** — [preview.ts:80-92](apps/payload/src/payload/config/plugins/preview.ts#L80-L92).
   Podpis: *„Sedno bezpieczeństwa: admin (też przez klucz API) widzi drafty, reszta świata dostaje twardo `_status: published` — niezależnie od tego, co poda w query.”*

2. **Klient draftów z nagłówkiem API-Key** — [client.ts:33-58](apps/astro/src/lib/payload/client.ts#L33-L58).
   Podpis: *„Server-side odczyt draftu uwierzytelnia się kluczem API admina. Bez klucza — błąd, żeby draft nigdy nie wyciekł przypadkiem.”*

3. **Listener live preview** — [live-preview-listener.tsx:20-86](apps/astro/src/components/preview/live-preview-listener.tsx#L20-L86) (sam handler `onMessage`).
   Podpis: *„Panel Payload wysyła `postMessage` po każdym zapisie → Astro robi SSR re-fetch i reload, zachowując pozycję scrolla.”*

4. **Endpoint `/preview`** — [preview.ts:11-33](apps/astro/src/pages/preview.ts) (walidacja sekretu + httpOnly cookie).
   Podpis: *„Wejście w tryb podglądu: sprawdzamy współdzielony sekret, ustawiamy httpOnly cookie na godzinę, przekierowujemy na stronę.”*

5. (Opcjonalnie realny zrzut) panel Payload z przyciskiem **Live Preview** + iframe z renderem Astro obok edytora.

> 📎 Pełny opis tej architektury masz już w pamięci projektu: `preview-draft-mode-architecture.md`.

---

## 3. Layout builder — poprawny sposób budowania stron z bloków

**Kąt:** „Strony składamy z bloków w 3 czystych warstwach. Edytor układa sekcje w panelu, a kod
nigdzie się nie dubluje — schemat CMS, komponent UI i adapter to trzy osobne odpowiedzialności.” To
post o architekturze: dlaczego nie wrzucamy markupu do CMS-a ani do adaptera.

**Co jest nieoczywiste / czym się chwalimy:**
- **3 warstwy, jedno źródło prawdy dla markupu:**
  1. **Schemat bloku** w Payload (`Block`) — tylko pola.
  2. **Komponent prezentacyjny** w `@repo/ui` — czysty React, **zero zależności od Payload** (plain propsy).
  3. **Cienki adapter** w Astro — mapuje pola bloku na propsy komponentu, **bez własnego markupu**.
- **Dual registration:** blok rejestrowany jednocześnie w kolekcji `Pages` (gdzie edytor go układa) i w globalnej tablicy `blocks` w configu (rejestracja schematu). Nigdy tylko w jednym miejscu.
- **Dispatcher** (`layout-sections.astro`) mapuje `blockType` → komponent. Statyczne sekcje renderują się jako server-side React (zero JS na kliencie), a interaktywny `formBlock` jest hydratowany jako wyspa (`client:load`).
- Dzięki temu nowa sekcja = przewidywalny pipeline, a nie kopiowanie markupu w trzech miejscach.

**Pliki (na przykładzie hero + lista wszystkich bloków):**
- Schemat bloku (wzorzec): [apps/payload/src/payload/blocks/example-block.ts](apps/payload/src/payload/blocks/example-block.ts)
- Pole hero (grupa z wariantami): [apps/payload/src/payload/fields/hero.ts](apps/payload/src/payload/fields/hero.ts)
- Bloki page-content: [apps/payload/src/payload/blocks/page-content.ts](apps/payload/src/payload/blocks/page-content.ts)
- Rejestracja w kolekcji Pages (`layout`): [apps/payload/src/payload/collections/Pages.ts](apps/payload/src/payload/collections/Pages.ts)
- Dual registration w configu: [apps/payload/src/payload.config.ts](apps/payload/src/payload.config.ts#L21-L53)
- Komponent UI (czysty React): [packages/ui/src/components/sections/hero/hero.tsx](packages/ui/src/components/sections/hero/hero.tsx)
- Cienki adapter Astro: [apps/astro/src/components/sections/hero/variants/default-hero.tsx](apps/astro/src/components/sections/hero/variants/default-hero.tsx)
- Dispatcher (mapa blockType → komponent): [apps/astro/src/components/page-builder/layout-sections.astro](apps/astro/src/components/page-builder/layout-sections.astro)

**Fragmenty na screenshoty (pokaż jedną sekcję przez wszystkie 3 warstwy — najlepiej `exampleBlock`):**

1. **Warstwa 1 — schemat bloku** — [example-block.ts](apps/payload/src/payload/blocks/example-block.ts) (cały plik).
   Podpis: *„Warstwa 1: schemat CMS. Tylko pola — `slug`, `interfaceName`, `fields`. Żadnego markupu.”*

2. **Warstwa 2 — komponent UI** — [hero.tsx](packages/ui/src/components/sections/hero/hero.tsx) (interfejs `HeroProps` + funkcja).
   Podpis: *„Warstwa 2: czysty komponent React w design systemie. Zwykłe propsy, zero importów z Payload — da się go użyć wszędzie.”*

3. **Warstwa 3 — adapter** — [default-hero.tsx](apps/astro/src/components/sections/hero/variants/default-hero.tsx) (cały plik, ~26 linii).
   Podpis: *„Warstwa 3: cienki adapter. Mapuje pola bloku na propsy komponentu UI i tyle — ani linijki markupu.”*

4. **Dispatcher** — [layout-sections.astro](apps/astro/src/components/page-builder/layout-sections.astro) (switch po `section.blockType`).
   Podpis: *„Spinacz: `blockType` → komponent. Statyczne sekcje to server-side React (0 KB JS), formularz hydratuje się jako wyspa.”*

5. **Dual registration** — [payload.config.ts:21-53](apps/payload/src/payload.config.ts#L21-L53) + [Pages.ts](apps/payload/src/payload/collections/Pages.ts) obok siebie.
   Podpis: *„Blok rejestrujemy w dwóch miejscach: w kolekcji (gdzie edytor go układa) i globalnie (rejestracja schematu).”*

**Dostępne bloki dziś** (do wymienienia w poście): `exampleBlock`, `page-content-1`, `page-content-2`,
`page-content-3`, `formBlock` + pole `hero` z 4 typami (`default`, `exampleHero`, `category`, `categoriesGrid`).

> 📎 Skill `website-layout-sections` opisuje pełny pipeline dodawania nowej sekcji (schemat → rejestracja → adapter → mapa → typy → migracja).

---

## 4. PayloadCMS — strony widoczne w Google (SEO pro)

**Kąt:** „SEO nie jest doklejone na końcu — jest wbudowane. Meta tagi, Open Graph, Twitter Cards,
JSON-LD (structured data), hreflang, sitemap i robots generują się automatycznie z treści w CMS.
Edytor uzupełnia pola, a reszta dzieje się sama.” Post pokazuje dojrzałość: to nie jest „dorzuć
plugin”, tylko przemyślana warstwa.

**Co jest nieoczywiste / czym się chwalimy:**
- **Globalne ustawienia + per-strona:** `SiteSettings` (nazwa, szablon tytułu, domyślny OG image, organizacja, social profiles) + nadpisania `meta` na każdej stronie.
- **JSON-LD generowany z danych, nie na sztywno:** WebSite, Organization, WebPage, BreadcrumbList. Gotowe (zaślepione) buildery na Product/Article/FAQ — aktywują się, gdy pojawi się odpowiednia kolekcja.
- **i18n robione poprawnie:** hreflang z `x-default` przez wszystkie locale.
- **Sitemap świadomy CMS-a:** odpytuje Payload o wszystkie strony i emituje XML z alternatywami językowymi.
- **Custom code sloty** (GTM, analytics, weryfikacje) wstrzykiwane w 4 punkty: headStart/headEnd/bodyStart/bodyEnd — edytowalne tylko przez admina.
- **Bezpieczne:** drafty i 404 zawsze `noindex`. JSON-LD escapuje `<`, żeby nie wyjść ze `<script>`.

**Pliki:**
- Builder meta (`buildSeo`, tytuł, OG, hreflang): [apps/astro/src/lib/seo/meta.ts](apps/astro/src/lib/seo/meta.ts)
- Buildery JSON-LD: [apps/astro/src/lib/seo/jsonld.ts](apps/astro/src/lib/seo/jsonld.ts)
- Komponent `<head>` SEO: [apps/astro/src/components/seo/Seo.astro](apps/astro/src/components/seo/Seo.astro)
- Serializer JSON-LD: [apps/astro/src/components/seo/JsonLd.astro](apps/astro/src/components/seo/JsonLd.astro)
- Wstrzykiwanie custom code: [apps/astro/src/components/seo/CustomCode.astro](apps/astro/src/components/seo/CustomCode.astro)
- Global SiteSettings (4 zakładki): [apps/payload/src/payload/globals/SiteSettings.ts](apps/payload/src/payload/globals/SiteSettings.ts)
- Plugin SEO (pola meta na Pages): [apps/payload/src/payload/config/plugins/seo.ts](apps/payload/src/payload/config/plugins/seo.ts)
- Złożenie SEO na stronie: [apps/astro/src/pages/[...slug].astro](apps/astro/src/pages/%5B...slug%5D.astro#L36-L72)
- Sitemap (świadomy CMS): [apps/astro/src/pages/sitemap.xml.ts](apps/astro/src/pages/sitemap.xml.ts)
- Robots: [apps/astro/src/pages/robots.txt.ts](apps/astro/src/pages/robots.txt.ts)

**Fragmenty na screenshoty:**

1. **`buildSeo` w akcji na stronie** — [[...slug].astro:36-72](apps/astro/src/pages/%5B...slug%5D.astro#L36-L72).
   Podpis: *„Jedna funkcja łączy pola strony z globalnymi ustawieniami w komplet meta + buduje JSON-LD (WebPage + Breadcrumb). Draft i 404 → zawsze noindex.”*

2. **Buildery JSON-LD** — [jsonld.ts](apps/astro/src/lib/seo/jsonld.ts) (np. `breadcrumbSchema`, linie 74-91).
   Podpis: *„Structured data generowane z treści CMS, nie wpisywane ręcznie. Product/Article/FAQ czekają gotowe — włączą się, gdy dodamy ich kolekcje.”*

3. **Global SiteSettings — zakładka SEO Defaults** — [SiteSettings.ts:31-82](apps/payload/src/payload/globals/SiteSettings.ts).
   Podpis: *„Edytor ustawia nazwę, szablon tytułu (`%s · %siteName%`), domyślny OG image i social profiles — raz, dla całej strony.”*

4. **Komponent `Seo.astro`** — [Seo.astro:25-44](apps/astro/src/components/seo/Seo.astro).
   Podpis: *„Tu powstają realne tagi: title, description, canonical, Open Graph, Twitter Card, hreflang.”*

5. (Mocny dowód) realny zrzut **Google Rich Results Test** albo podgląd udostępnienia w social — pokazuje, że structured data działa.

> 📎 Skill `seo-structured-data` opisuje, które JSON-LD emitujemy dziś, a które są zaślepione do czasu pojawienia się kolekcji.

---

## 5. Payload JOBS — ciężkie operacje w kolejce

**Kąt:** „Ciężkie rzeczy (import/eksport tysięcy rekordów, wysyłki, przetwarzanie) nie blokują requestu
— lądują w kolejce zadań i lecą w tle.” Post o tym, że starter jest gotowy na skalę: infrastruktura
kolejki jest podpięta, a dodanie własnego zadania to czysty kod, nie zmiana infry.

**Co jest nieoczywiste / czym się chwalimy:**
- **Kolejka wpięta od zera, ale celowo pusta** — kolekcja `payload-jobs` i endpoint `POST /api/payload-jobs/run` są gotowe; dodanie pracy = dopisanie taska/workflow + `payload.jobs.queue(...)`, bez kolejnej zmiany infrastruktury.
- **Realny przykład już działa:** plugin import-export odpala ciężki CSV/JSON import i eksport stron **przez tę kolejkę** (taski `createCollectionExport`, `createCollectionImport`).
- **Access control na endpoincie uruchamiania** — tylko uwierzytelniony użytkownik może odpalić run.
- Wsparcie dla retry, schedulingu (`waitUntil`), wielu kolejek — wszystko z pudełka Payload.
- Tabele kolejki (`payload_jobs`, `payload_jobs_log`) są już w migracji init — włączenie jobs nie wymaga osobnej migracji.

**Pliki:**
- Konfiguracja jobs (pusta, z access): [apps/payload/src/payload/config/jobs.ts](apps/payload/src/payload/config/jobs.ts)
- Rejestracja w configu: [apps/payload/src/payload.config.ts](apps/payload/src/payload.config.ts) (`jobs: jobsConfig`)
- Realny konsument kolejki (import-export): [apps/payload/src/payload/config/plugins/import-export.ts](apps/payload/src/payload/config/plugins/import-export.ts)
- Tabele kolejki w migracji: [apps/payload/src/migrations/20260610_093439_init.ts](apps/payload/src/migrations/20260610_093439_init.ts#L791-L818)

**Fragmenty na screenshoty:**

1. **Cała konfiguracja jobs** — [jobs.ts](apps/payload/src/payload/config/jobs.ts) (cały plik, ~20 linii z komentarzem).
   Podpis: *„Kolejka wpięta, celowo pusta. Endpoint `/api/payload-jobs/run` i kolekcja `payload-jobs` gotowe. Dodanie pracy = task + `payload.jobs.queue(...)`, zero zmian w infrze. Run tylko dla zalogowanych.”*

2. **Realny konsument — import/export** — [import-export.ts](apps/payload/src/payload/config/plugins/import-export.ts).
   Podpis: *„Działający przykład: import i eksport stron (CSV/JSON) leci przez tę samą kolejkę — nie blokuje panelu.”*

3. **Przykład dodania własnego taska** (snippet do posta — wzorzec z dokumentacji Payload):
   ```ts
   // apps/payload/src/payload/config/jobs.ts
   export const jobsConfig: Config['jobs'] = {
     tasks: [
       {
         slug: 'sendWelcomeEmail',
         inputSchema: [{ name: 'userEmail', type: 'text', required: true }],
         retries: 2,
         handler: async ({ input, req }) => {
           await req.payload.sendEmail({ to: input.userEmail, subject: 'Welcome' })
           return { output: {} }
         },
       },
     ],
     workflows: [],
     access: { run: ({ req }) => Boolean(req.user) },
   }
   ```
   Podpis: *„Dodanie zadania to czysty kod: zdefiniuj task, kolejkuj przez `payload.jobs.queue({ task: 'sendWelcomeEmail', input })`.”*

> 📎 W pamięci: `jobs-queue-already-in-init.md` — włączenie jobs nie wymaga migracji, tabele już są.

---

## 6. RBAC — zarządzanie dostępem per rola / właściciel

**Kąt:** „Kontrola dostępu jest funkcją, nie checkboxem. Mamy reużywalne »guardy« access control, które
nakładasz na kolekcję jednym importem — admin-only, admin-lub-właściciel, pole tylko dla admina.”
Post o porządku w uprawnieniach: zamiast kopiować logikę po kolekcjach, mamy nazwane, testowalne strażniki.

**Co jest nieoczywiste / czym się chwalimy:**
- **Reużywalne access guardy** w jednym folderze — `AdminOnlyAccessGuard`, `AdminOrOwnerAccessGuard`, field-level `isAdmin`. Nakładasz je deklaratywnie, nie piszesz logiki od nowa w każdej kolekcji.
- **Dwie role wynikają z modelu, nie z osobnej tabeli:** kolekcja `admins` (pełny dostęp, panel, klucz API) i `users` (publiczna rejestracja, brak panelu). Rolę poznajemy po `req.user?.collection`.
- **Dostęp na poziomie dokumentu (ownership):** `AdminOrOwnerAccessGuard` dociąga dokument i sprawdza pole `owner` vs `req.user.id` — admin omija check.
- **Field-level access:** wrażliwe pola (np. custom code w SiteSettings) edytowalne tylko przez admina.
- **Klucz API admina** uwierzytelnia odczyty draftów z frontu (spina się z postem #2). Seed przypina klucz do `PAYLOAD_API_SECRET`, więc działa bez ręcznego kroku w UI.
- Panel `/admin` dostępny tylko dla kolekcji `admins`; CORS/origin whitelisting na `/api` i `/admin`.

**Pliki:**
- Guard admin-only: [apps/payload/src/payload/access-guards/admin-only.ts](apps/payload/src/payload/access-guards/admin-only.ts)
- Guard admin-lub-właściciel: [apps/payload/src/payload/access-guards/admin-or-owner.ts](apps/payload/src/payload/access-guards/admin-or-owner.ts)
- Field-level isAdmin: [apps/payload/src/payload/access-guards/is-admin.ts](apps/payload/src/payload/access-guards/is-admin.ts)
- Rola admin (auth + klucz API): [apps/payload/src/payload/collections/Admins.ts](apps/payload/src/payload/collections/Admins.ts)
- Rola user (publiczna rejestracja, brak panelu): [apps/payload/src/payload/collections/Users.ts](apps/payload/src/payload/collections/Users.ts)
- Użycie guarda na globalu: [apps/payload/src/payload/globals/SiteSettings.ts](apps/payload/src/payload/globals/SiteSettings.ts#L22-L25)
- Brama draftów (powiązanie z preview): [apps/payload/src/payload/config/plugins/preview.ts](apps/payload/src/payload/config/plugins/preview.ts#L75-L92)
- Seed klucza API: [apps/payload/src/scripts/seed/users.ts](apps/payload/src/scripts/seed/users.ts#L54-L63)
- Origin / CORS whitelisting: [apps/payload/src/middleware.ts](apps/payload/src/middleware.ts#L29-L41)

**Fragmenty na screenshoty:**

1. **`AdminOrOwnerAccessGuard`** — [admin-or-owner.ts](apps/payload/src/payload/access-guards/admin-or-owner.ts) (funkcja `adminOrOwner` + export).
   Podpis: *„Admin omija wszystko; reszta musi być właścicielem dokumentu (pole `owner` vs `req.user.id`). Jeden import nakłada to na całą kolekcję.”*

2. **`AdminOnlyAccessGuard` + field-level `isAdmin`** — [admin-only.ts](apps/payload/src/payload/access-guards/admin-only.ts) i [is-admin.ts](apps/payload/src/payload/access-guards/is-admin.ts) obok siebie.
   Podpis: *„Reużywalne strażniki: cała kolekcja tylko dla admina, albo pojedyncze pole tylko dla admina. Zero copy-paste logiki.”*

3. **Deklaratywne użycie na globalu** — [SiteSettings.ts:22-25](apps/payload/src/payload/globals/SiteSettings.ts#L22-L25).
   Podpis: *„Tak to wygląda w użyciu: `read` publiczny, `update: isAdmin`. Czytelne na pierwszy rzut oka.”*

4. **Dwie role z modelu** — [Admins.ts](apps/payload/src/payload/collections/Admins.ts) i [Users.ts](apps/payload/src/payload/collections/Users.ts) obok siebie.
   Podpis: *„Role wynikają z dwóch kolekcji: `admins` (panel + klucz API) i `users` (publiczna rejestracja, bez panelu). Rolę poznajemy po `req.user.collection`.”*

---

## Wspólny wątek całej serii (do bio / pierwszego posta)

> Budujemy starter Payload + Astro tak, żeby **niekodująca osoba** opisywała efekty, a system robił
> resztę: bezpieczne drafty z live preview, SEO z pudełka, kolejka na ciężkie operacje, czysty layout
> builder w 3 warstwach, reużywalny RBAC i lokalna skrzynka mailowa w dev. Każdy z tych elementów to
> świadoma decyzja architektoniczna — nie przypadkowy plugin.

### Sugerowana kolejność publikacji
1. **Layout builder** (#3) — fundament, pokazuje filozofię.
2. **SEO** (#4) — najbardziej „sprzedażowy”, każdy rozumie wartość.
3. **Preview/draft** (#2) — najmocniejszy technicznie, robi wrażenie.
4. **RBAC** (#6) — temat „pro”, dla technicznych odbiorców.
5. **Jobs** (#5) — skalowanie, gotowość na wzrost.
6. **Mailpit** (#1) — lekki, „developer experience”, dobry na piątek.
