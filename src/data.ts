/* =========================================================
   São Miguel — datová vrstva
   Zdroje: Průvodce po Azorech – Ostrov São Miguel (komplexní
   analytická zpráva), oficiální trasy trails.visitazores.com,
   oficiální web pocadadonabeija.com, parquesnaturaisazores.com.
   Souřadnice ověřeny z OpenStreetMap / Wikipedia.
   ========================================================= */

export const SM_DATA = (() => {

  const CATEGORIES = {
    viewpoint: { id: 'viewpoint', label: 'Vyhlídky', emoji: '🌄', color: '#2563eb' },
    lake:      { id: 'lake',      label: 'Jezera',   emoji: '💧', color: '#0891b2' },
    thermal:   { id: 'thermal',   label: 'Termální lázně', emoji: '♨️', color: '#b45309' },
    trail:     { id: 'trail',     label: 'Trasy',    emoji: '🥾', color: '#15803d' },
    beach:     { id: 'beach',     label: 'Pláže a moře', emoji: '🌊', color: '#0369a1' },
    gastro:    { id: 'gastro',    label: 'Gastronomie', emoji: '🍲', color: '#9a3412' },
    city:      { id: 'city',      label: 'Města a obce', emoji: '🏘️', color: '#6b7280' },
    nature:    { id: 'nature',    label: 'Příroda', emoji: '🌿', color: '#15803d' }
  };

  // ========= LOKACE (používají se v Mapě, Průzkumu, Detailu) =========
  const PLACES = [
    // -------- Vyhlídky --------
    {
      id: 'boca-do-inferno',
      name: 'Miradouro da Boca do Inferno',
      category: 'viewpoint',
      coords: [37.8574, -25.7806],
      short: 'Nejfotografovanější vyhlídka Azor na kalderu Sete Cidades.',
      description: 'Panoramatický pohled na celou západní kalderu včetně jezer Lagoa Azul, Lagoa Verde, Lagoa do Canário a Lagoa de Santiago. Cesta od brány parku Lagoa do Canário trvá zhruba 15 minut pěšky.',
      tips: [
        'Choďte za dobré viditelnosti — v mlze ztrácí smysl. Před cestou zkontrolujte webkamery.',
        'Nejlepší světlo je ráno nebo pozdní odpoledne.',
        'Parkování u brány parku Lagoa do Canário, dál pokračujte pěšky.'
      ],
      bestTime: 'Květen–říjen za stabilního počasí',
      difficulty: 'Snadné (15 min chůze)',
      free: true
    },
    {
      id: 'vista-do-rei',
      name: 'Miradouro da Vista do Rei',
      category: 'viewpoint',
      coords: [37.8579, -25.7900],
      short: 'Klasický pohled na dvojčata Lagoa Azul a Lagoa Verde z jižního okraje kaldery.',
      description: 'Pojmenována podle krále Carlose I. V těsné blízkosti stojí skelet opuštěného hotelu Monte Palace, který je sice oficiálně nepřístupný, ale tvoří výrazný urbanistický prvek krajiny.',
      tips: [
        'Parkování přímo u vyhlídky.',
        'Hotel Monte Palace nefotografujte zblízka — je nebezpečný a hlídaný.'
      ],
      free: true
    },
    {
      id: 'pico-da-barrosa',
      name: 'Pico da Barrosa',
      category: 'viewpoint',
      coords: [37.7754, -25.4833],
      short: 'Nejvyšší bod u Lagoa do Fogo, za jasna pohled na oba břehy ostrova.',
      description: 'Vzhledem k nadmořské výšce se počasí mění velmi rychle — slunce může přejít v mlhu během několika minut. Ideálně kombinujte s trasou Lagoa do Fogo.',
      tips: [
        'Vždy vrstvené oblečení a větrovka.',
        'Zkontrolujte webkamery před výjezdem nahoru.'
      ],
      free: true
    },
    {
      id: 'miradouro-santa-iria',
      name: 'Miradouro de Santa Iria',
      category: 'viewpoint',
      coords: [37.8281, -25.4272],
      short: 'Skalnatý pohled na severní pobřeží v oblasti Ribeira Grande.',
      description: 'Klasická zastávka při cestě z Ponta Delgady na sever. Dramatické útesy, na obzoru za jasna ostrov Terceira.',
      free: true
    },
    {
      id: 'miradouro-pico-ferro',
      name: 'Miradouro do Pico do Ferro',
      category: 'viewpoint',
      coords: [37.7767, -25.3319],
      short: 'Nejlepší pohled na jezero Lagoa das Furnas a celou kalderu Furnas.',
      description: 'Odsud lze za jasna vidět páru stoupající z geotermálního pole u jezera, kde se vaří Cozido.',
      free: true
    },

    // -------- Jezera --------
    {
      id: 'sete-cidades-lakes',
      name: 'Lagoa Azul a Lagoa Verde (Sete Cidades)',
      category: 'lake',
      coords: [37.8604, -25.7858],
      short: 'Propojená jezera v západní kaldeře — symbol Azor.',
      description: 'Dvě jezera oddělená úzkým průlivem s mostem. Barevný kontrast vzniká kombinací hloubky, odrazu světla a specifické fytoplanktonní flóry. V obci Sete Cidades na dně kaldery si lze půjčit kola, šlapadla nebo kajak.',
      tips: [
        'Z vody nebo z mostu vypadají jezera jinak než z vyhlídky — zkuste obojí.',
        'Obec Sete Cidades má restaurace a půjčovnu kol pro okruh kolem jezer.'
      ],
      free: true
    },
    {
      id: 'lagoa-do-fogo',
      name: 'Lagoa do Fogo',
      category: 'lake',
      coords: [37.7667, -25.4833],
      short: 'Divoké srdce ostrova — nejvýše položené jezero bez zástavby.',
      description: 'Součást chráněné rezervace. Sestup k břehům je po strmých stezkách a vyžaduje dobrou fyzičku a pevnou obuv. Atmosféra naprostého klidu — žádné obydlí v dohledu.',
      tips: [
        '⚠️ V létě (červen–září, 9–19 h) je vjezd soukromým vozům nerezidentů zakázán. Doprava jen shuttle busem (s poplatkem).',
        'Počasí se mění velmi rychle — noste větrovku, i když odjíždíte z Ponta Delgady za slunce.',
        'Sestup ke břehům cca 1 hod, výstup zpět 1,5 hod.'
      ],
      bestTime: 'Květen–říjen, brzy ráno',
      difficulty: 'Střední (strmý sestup)',
      free: true
    },
    {
      id: 'lagoa-das-furnas',
      name: 'Lagoa das Furnas',
      category: 'lake',
      coords: [37.7619, -25.3336],
      short: 'Jezero obklopené geotermálními fumarolami — vaří se tu Cozido.',
      description: 'Kolem jezera vede trasa PRC06SMI (9,4 km, snadná). Na severním břehu jsou geotermální jámy (Caldeiras), kde se několik hodin vaří tradiční pokrm Cozido.',
      free: true
    },
    {
      id: 'lagoa-do-canario',
      name: 'Lagoa do Canário',
      category: 'lake',
      coords: [37.8556, -25.7833],
      short: 'Menší jezero uvnitř parku, výchozí bod k Boca do Inferno.',
      description: 'Prochází zde lesopark s endemickou vegetací. Ideální zastávka před nebo po návštěvě hlavní vyhlídky.',
      free: true
    },

    // -------- Termální lázně --------
    {
      id: 'terra-nostra',
      name: 'Parque Terra Nostra',
      category: 'thermal',
      coords: [37.7711, -25.3125],
      short: 'Více než 200letá botanická zahrada s železitou termální vodou 35–40 °C.',
      description: 'Monumentální bazén s oranžovo-hnědou vodou bohatou na oxid železitý. Host hotelu Terra Nostra má 24h přístup — lze si užít noční koupání bez davů.',
      tips: [
        '⚠️ Voda trvale obarví světlé plavky. Použijte staré nebo tmavé.',
        'Pro minimalizaci davů choďte brzy ráno po otevření.',
        'Kombinujte se zahradou — více než 2000 rostlinných druhů.'
      ],
      temperature: '35–40 °C',
      openHours: 'Duben–září 10:00–19:00; říjen–březen 10:00–17:30',
      price: '10 € dospělý; 5 € dítě 6–12 let',
      website: 'https://parqueterranostra.com/',
      free: false
    },
    {
      id: 'poca-dona-beija',
      name: 'Poça da Dona Beija',
      category: 'thermal',
      coords: [37.7711, -25.3100],
      short: 'Pět moderních termálních bazénů až 39 °C v tropické vegetaci.',
      description: 'Otevřeno až do 23:00 — primární cíl pro noční relaxaci. Rezervace online je prakticky nutná, vstup na 1,5h bloky.',
      tips: [
        '⚠️ Rezervujte online předem přes bookings.pocadadonabeija.com.',
        'Voda je méně železitá než Terra Nostra, ale stejně doporučeny tmavé plavky.',
        'Noční koupání je nejoblíbenější — okolí osvětlené jen pochodněmi.'
      ],
      temperature: 'Až 39 °C',
      openHours: 'Denně, bloky 1,5 h; poslední vstup ~ 22:30',
      price: '10 € dospělý; 6 € dítě 6–12 let',
      website: 'https://bookings.pocadadonabeija.com/',
      free: false
    },
    {
      id: 'caldeira-velha',
      name: 'Caldeira Velha',
      category: 'thermal',
      coords: [37.7836, -25.4769],
      short: 'Přírodní rezervace s termálním vodopádem — „koupání v džungli".',
      description: 'Tři horké bazény a jeden studenější pod termálním vodopádem v hustém lese endemické flóry, na úbočí masivu Lagoa do Fogo.',
      tips: [
        '⚠️ Kapacita je přísně omezena kvótami — rezervujte online předem.',
        'Cesta k bazénům vede po dřevěných lávkách — vhodné sandály nebo pevná obuv.'
      ],
      temperature: 'Kolem 36–38 °C (vodopád chladnější)',
      openHours: 'Denně 10:00–18:00 (léto do 19:00)',
      price: '8 € dospělý',
      website: 'https://parquesnaturaisazores.com/',
      free: false
    },
    {
      id: 'ponta-da-ferraria',
      name: 'Ponta da Ferraria',
      category: 'thermal',
      coords: [37.8561, -25.8503],
      short: 'Termální pramen vyvěrající přímo do oceánské zátoky — zdarma.',
      description: 'Hydrotermální aktivita mísí horkou vodu se studenou mořskou. Kvalita zážitku kriticky závisí na přílivu a odlivu.',
      tips: [
        '⚠️ Naplánujte návštěvu na konec odlivu — pak je voda příjemně vlažná. Při plném přílivu je chladná, při plném odlivu může být až příliš horká.',
        'Čedičové skály jsou extrémně kluzké. Používejte lana a žebříky instalované pro bezpečný vstup.',
        'Oceánské proudy mohou být silné — držte se hlavní zátoky.'
      ],
      temperature: '~28–35 °C (silně závisí na přílivu)',
      openHours: 'Volně přístupné (sledujte tabulky přílivů)',
      price: 'Zdarma',
      free: true
    },
    {
      id: 'caldeiras-furnas',
      name: 'Caldeiras das Furnas',
      category: 'thermal',
      coords: [37.7744, -25.3114],
      short: 'Bublající bahenní sopky a fumaroly v centru obce Furnas.',
      description: 'Veřejně přístupná oblast přímo v obci. Pozorování geotermální aktivity, ochutnávka minerálních vod z pramenů (každý má jinou chuť a složení).',
      tips: [
        'Nepřelézejte zábrany — voda má přes 90 °C.',
        'Ochutnejte různé prameny — mají odlišné minerální složení.'
      ],
      free: true
    },

    // -------- Pláže a moře --------
    {
      id: 'santa-barbara',
      name: 'Praia de Santa Bárbara',
      category: 'beach',
      coords: [37.8267, -25.4875],
      short: 'Hlavní surfařská pláž ostrova v Ribeira Grande.',
      description: 'Černý vulkanický písek, stabilní atlantické vlny pro začátečníky i profesionály. Místní surfařské školy nabízejí vybavení a kurzy.',
      tips: [
        'Silné proudy — plavte pouze v označené zóně s plavčíkem.',
        'Pro začátečníky doporučena škola a lekce.'
      ],
      free: true
    },
    {
      id: 'ilheu-vila-franca',
      name: 'Ilhéu de Vila Franca',
      category: 'beach',
      coords: [37.7028, -25.4406],
      short: 'Sopečný kráter v moři — přírodní bazén ideální pro šnorchlování.',
      description: 'Asi 1 km od jižního pobřeží, přístup pravidelnou trajektou z přístavu Vila Franca do Campo. Křišťálová voda uvnitř kráteru.',
      tips: [
        'Počet návštěvníků je přísně limitován denní kvótou — rezervace trajektu předem je nutná.',
        'Vezměte si masku a ploutve.'
      ],
      free: false,
      price: 'Trajekt ~8 € / osoba'
    },
    {
      id: 'praia-dos-moinhos',
      name: 'Praia dos Moinhos',
      category: 'beach',
      coords: [37.8286, -25.3622],
      short: 'Půvabná pláž s čedičovým pískem v Porto Formoso.',
      description: 'Menší pláž s klidnější vodou, obklopená rybářskou vesnicí. Ideální po návštěvě čajovny Porto Formoso.',
      free: true
    },

    // -------- Gastronomie & nákupy --------
    {
      id: 'cha-gorreana',
      name: 'Čajová plantáž Gorreana',
      category: 'gastro',
      coords: [37.8219, -25.3858],
      short: 'Nejstarší čajová plantáž v Evropě, funguje od roku 1883.',
      description: 'Volný vstup do továrny i mezi čajové keře. Původní britské stroje jsou stále funkční. Ochutnávka černého a zeleného čaje zdarma.',
      tips: [
        'Kombinujte s trasou PRC28SMI (3,3 km, snadná).',
        'V obchodě je výběr limitovaných edic čajů, které se jinde neseženete.'
      ],
      free: true
    },
    {
      id: 'cha-porto-formoso',
      name: 'Čajová plantáž Porto Formoso',
      category: 'gastro',
      coords: [37.8267, -25.3692],
      short: 'Menší a intimnější čajovna v Porto Formoso.',
      description: 'Prohlídka s průvodcem, muzeum čajové kultury, posezení s výhledem.',
      free: false,
      price: '4 € / prohlídka'
    },
    {
      id: 'ananasova-plantaz-arruda',
      name: 'Ananasová plantáž A Arruda',
      category: 'gastro',
      coords: [37.7431, -25.6339],
      short: 'Jediné místo na světě, kde se ananas pěstuje v kamenných sklenících.',
      description: 'Cyklus od semenáčku po plod trvá téměř 2 roky. K synchronizaci kvetení se používá kouř. Vstup zdarma, prodej čerstvých plodů a ananasového likéru.',
      tips: [
        'Plody jsou menší, sladší a aromatičtější než tropické.',
        'V obchodě si můžete koupit domácí likér z ananasu.'
      ],
      free: true
    },

    // -------- Města --------
    {
      id: 'ponta-delgada',
      name: 'Ponta Delgada',
      category: 'city',
      coords: [37.7412, -25.6756],
      short: 'Hlavní město ostrova, brána k letišti João Paulo II.',
      description: 'Třípatrový portikus Portas da Cidade je ikonou. Historické centrum má dlážděné uličky, kostely s azulejos, marinu s restauracemi a řetězec Continente Modelo v Parque Atlântico.',
      free: true
    },
    {
      id: 'furnas',
      name: 'Obec Furnas',
      category: 'city',
      coords: [37.7744, -25.3139],
      short: 'Epicentrum geotermální aktivity, srdce východního São Miguelu.',
      description: 'V jedné obci: bublající Caldeiras, botanická Terra Nostra, Poça da Dona Beija, jezero Lagoa das Furnas s vařičkami Cozida. Ideální základna na 1–2 noci.',
      free: true
    },
    {
      id: 'ribeira-grande',
      name: 'Ribeira Grande',
      category: 'city',
      coords: [37.8225, -25.5178],
      short: 'Největší město severního pobřeží, centrum surfování.',
      description: 'Moderní obchodní infrastruktura, surfařská komunita, výchozí bod k čajovnám a Caldeira Velha.',
      free: true
    },
    {
      id: 'vila-franca-do-campo',
      name: 'Vila Franca do Campo',
      category: 'city',
      coords: [37.7183, -25.4342],
      short: 'První hlavní město ostrova, dnes přístav k Ilhéu.',
      description: 'Historické centrum, ermitáž Nossa Senhora da Paz na kopci (nad 220 schodů), přístav pro trajekty na přírodní bazén Ilhéu.',
      free: true
    },

    // -------- Příroda --------
    {
      id: 'salto-do-cabrito',
      name: 'Vodopád Salto do Cabrito',
      category: 'nature',
      coords: [37.7992, -25.4547],
      short: 'Působivý vodopád dostupný po trase PRC29SMI.',
      description: 'Vodopád s hydroelektrickou stanicí z 19. století. Kombinace lesa, inženýrských staveb a geotermálních prvků.',
      free: true
    },
    {
      id: 'salto-do-prego',
      name: 'Vodopád Salto do Prego',
      category: 'nature',
      coords: [37.7886, -25.2325],
      short: 'Vodopád v "džungli" blízko opuštěné vesnice Sanguinho.',
      description: 'Koncový bod okružní trasy PRC09SMI. Cestou míjíte opuštěnou vesnici Sanguinho a laurisilvu — endemický laurový les.',
      free: true
    }
  ];

  // ========= TRASY (oficiální značení PR/PRC) =========
  const TRAILS = [
    {
      id: 'PR04SMI',
      code: 'PR04SMI',
      name: 'Mata do Canário — Sete Cidades',
      type: 'linear', typeLabel: 'Lineární',
      difficulty: 'Střední',
      lengthKm: 11.7,
      timeHours: 3,
      highlights: ['Akvadukt Muro das Nove Janelas', 'Hřeben kaldery Sete Cidades', 'Panorama jezer'],
      start: [37.8647, -25.7672],
      end: [37.8600, -25.7950],
      description: 'Klasická hřebenová trasa po okraji kaldery. Úchvatné pohledy na obě hlavní jezera. Vyžaduje pevnou obuv, v místě žádný stín.',
      link: 'https://trails.visitazores.com/en/find-a-trail?field_island_term_tid=31'
    },
    {
      id: 'PR02SMI',
      code: 'PR02SMI',
      name: 'Lagoa do Fogo',
      type: 'linear', typeLabel: 'Lineární / zpět',
      difficulty: 'Střední',
      lengthKm: 10.6,
      timeHours: 4,
      highlights: ['Levády', 'Endemické keře', 'Pláže u jezera'],
      start: [37.7833, -25.4764],
      end: [37.7667, -25.4833],
      description: 'Sestup do srdce chráněné rezervace. Horní část po starých levádách, spodní po strmých pěšinách.',
    },
    {
      id: 'PRC29SMI',
      code: 'PRC29SMI',
      name: 'Salto do Cabrito',
      type: 'loop', typeLabel: 'Okružní',
      difficulty: 'Střední',
      lengthKm: 8.6,
      timeHours: 3,
      highlights: ['Vodopád', 'Hydroelektrárny', 'Kovové lávky nad roklemi'],
      start: [37.7992, -25.4547],
      end: [37.7992, -25.4547],
      description: 'Kombinace vodopádu, historických vodních staveb a laurisilvy. Místy exponované lávky nad roklí.'
    },
    {
      id: 'PRC06SMI',
      code: 'PRC06SMI',
      name: 'Lagoa das Furnas',
      type: 'loop', typeLabel: 'Okružní',
      difficulty: 'Snadná',
      lengthKm: 9.4,
      timeHours: 3,
      highlights: ['Geotermální pole', 'Novogotická kaple', 'Plochý terén'],
      start: [37.7619, -25.3336],
      end: [37.7619, -25.3336],
      description: 'Ideální pro rodiny — plochá okružní stezka kolem jezera Furnas. Na severním konci vidíte, jak se vaří Cozido.'
    },
    {
      id: 'PRC28SMI',
      code: 'PRC28SMI',
      name: 'Chá Gorreana',
      type: 'loop', typeLabel: 'Okružní',
      difficulty: 'Snadná',
      lengthKm: 3.3,
      timeHours: 1.5,
      highlights: ['Čajové plantáže', 'Výhledy na severní pobřeží'],
      start: [37.8219, -25.3858],
      end: [37.8219, -25.3858],
      description: 'Krátká procházka mezi čajovými keři. Ideální po prohlídce továrny.'
    },
    {
      id: 'PRC09SMI',
      code: 'PRC09SMI',
      name: 'Salto do Prego — Sanguinho',
      type: 'loop', typeLabel: 'Okružní',
      difficulty: 'Střední',
      lengthKm: 4.5,
      timeHours: 2,
      highlights: ['Hustá „džungle"', 'Vodopád', 'Opuštěná vesnice Sanguinho'],
      start: [37.7850, -25.2303],
      end: [37.7850, -25.2303],
      description: 'Mystická trasa laurisilvou k opuštěné vesnici, kterou obyvatelé po bouřích opustili. Pokračování k vodopádu Salto do Prego.'
    }
  ];

  // ========= PRAKTICKÉ INFO =========
  const PRACTICAL = {

    car: {
      title: 'Auto a půjčovna',
      emoji: '🚗',
      sections: [
        {
          title: 'Proč auto',
          body: 'Veřejná doprava je orientována na místní rezidenty — k hlavním přírodním památkám a vyhlídkám se většinou nedostanete. Pronájem vozu je pro průzkum ostrova kritický.'
        },
        {
          title: 'Převodovka a výběr vozu',
          body: 'Dominuje manuál. Automaty jsou k dispozici v omezeném počtu a za vyšší cenu — rezervujte s velkým předstihem. Na krátké strmé kopce v pobřežních obcích volte vůz s dobrou spojkou.'
        },
        {
          title: 'Pojištění',
          items: [
            { name: 'TPL (Third Party Liability)', detail: 'Povinné, vždy v ceně. Kryje škody třetím stranám.' },
            { name: 'CDW', detail: 'Částečné krytí škod na voze. Zahrnuje spoluúčast (excess).' },
            { name: 'SCDW (Super CDW)', detail: 'Doporučeno. Plné krytí včetně spojky a podvozku. Spoluúčast 0 €.' },
            { name: 'Kreditní karta', detail: 'Na depozit a jméno řidiče — většina půjčoven vyžaduje.' }
          ]
        },
        {
          title: 'Palivo',
          body: 'Volte politiku „plná–plná". Vrácení s prázdnou nádrží za poplatek je drahá šlamastyka kvůli manipulačním přirážkám.'
        },
        {
          title: 'Lagoa do Fogo — omezení',
          body: 'V létě (červen–září, 9:00–19:00) je vjezd soukromým vozidlům nerezidentů zakázán. Dopravu zajišťuje placený shuttle bus. Raději jeďte brzy ráno před 9:00 nebo mimo letní sezónu.',
          type: 'warn'
        }
      ]
    },

    money: {
      title: 'Peníze a platby',
      emoji: '💶',
      sections: [
        {
          title: 'Multibanco (portugalský systém)',
          body: 'Jeden z nejvyspělejších ATM systémů. Výběr je levný u domácích bank, ale draho u turistických terminálů.'
        },
        {
          title: 'Limit výběru',
          body: 'Jednotlivý výběr max. 200 €. Za den lze provést dva po sobě — denní limit 400 €.'
        },
        {
          title: 'Vyhněte se Euronetu',
          body: 'Bankomaty Euronet v turistických zónách mají vysoké poplatky a nevýhodné kurzy. Hledejte Multibanco loga u Millennium, BPI, Santander.',
          type: 'warn'
        },
        {
          title: 'Směna při platbě',
          body: 'Vždy volte transakci „bez konverze" (decline conversion) — kurz pak určí vaše banka, ne terminál.'
        },
        {
          title: 'Karty vs. hotovost',
          body: 'V Ponta Delgadě a Ribeira Grande všude karty. V malých obcích, tavernách a u drobných suvenýrů je hotovost občas nezbytná. Menší obchody mohou mít spodní limit platby kartou 10–20 €.'
        }
      ]
    },

    shopping: {
      title: 'Supermarkety a nákupy',
      emoji: '🛒',
      chains: [
        { name: 'Continente Modelo', detail: 'Největší hypermarkety, široký výběr. Ponta Delgada (Parque Atlântico), Ribeira Grande. Otevřeno 8:30–23:00.' },
        { name: 'Pingo Doce', detail: 'Kvalitní pulty s čerstvými potravinami. Ponta Delgada, Vila Franca. Otevřeno 8:30–22:00.' },
        { name: 'Sol Mar', detail: 'Tradiční místní řetězec, skoro v každé větší obci. Otevřeno 8:30–20:00/21:00.' },
        { name: 'Meu Super', detail: 'Menší formáty pro rychlý nákup, vesnice. Otevírací doba variabilní a kratší.' }
      ]
    },

    etiquette: {
      title: 'Společenské normy',
      emoji: '🤝',
      items: [
        { name: 'Spropitné', detail: 'Není povinné. V turistických oblastech je zvykem zaokrouhlit nahoru, případně 5–10 % při výjimečné spokojenosti.' },
        { name: 'Elektrická síť', detail: 'Standardní EU zásuvky typu F, 230 V. Stejné jako v ČR — adaptér není potřeba.' },
        { name: 'Jazyk', detail: 'Portugalština (s azorským dialektem). V turistickém sektoru a u mladší generace dobrá angličtina.' },
        { name: 'Církevní svátky', detail: 'V neděli a o svátcích jsou menší obchody a muzea zavřená. Supermarkety většinou otevřené.' }
      ]
    },

    weather: {
      title: 'Počasí a balení',
      emoji: '⛅',
      sections: [
        {
          title: '„Čtyři roční období v jednom dni"',
          body: 'Místní fenomén daný Azorskou tlakovou výší a členitým reliéfem. Na pobřeží slunce, na kaldeře mlha — běžný stav. Buďte flexibilní s denním plánem.'
        },
        {
          title: 'Optimální období',
          items: [
            { name: 'Květen–říjen', detail: 'Stabilní počasí, méně srážek, 18–25 °C. Nejvyšší návštěvnost červenec–srpen.' },
            { name: 'Duben–červen', detail: 'Jarní vrchol biodiverzity, migrace velryb, zelený ostrov v plné kráse.' },
            { name: 'Listopad–duben', detail: 'Více srážek, silnější vítr, častá mlha. Ale termální lázně a vnitrozemí jsou kouzelné a prázdné.' }
          ]
        },
        {
          title: 'Vrstvení oblečení (vždy)',
          body: 'Ranní mlha zmizí v poledne, odpoledne může přijít liják. Voděodolná svrchní vrstva s prodyšností je povinná. Na trasy pevná treková obuv.'
        },
        {
          title: 'Monitoring počasí',
          body: 'Před výjezdem do vyšších poloh (Sete Cidades, Lagoa do Fogo) sledujte aplikaci SpotAzores nebo webkamery na klíčových bodech.'
        }
      ]
    },

    thermalTips: {
      title: 'Termální lázně — důležité',
      emoji: '♨️',
      items: [
        { name: '⚠️ Železo obarví plavky', detail: 'Terra Nostra a Poça mají vysoký obsah oxidu železitého. Světlé plavky budou nadobro oranžové. Vezměte staré nebo tmavé, případně „obětní" kus.' },
        { name: 'Ponta da Ferraria — příliv', detail: 'Zážitek stojí a padá s přílivem. Za odlivu extrémně horké, za přílivu chladné. Tabulky přílivů si ověřte den předem.' },
        { name: 'Rezervace', detail: 'Poča da Dona Beija a Caldeira Velha vyžadují online rezervaci — limit na 1,5h bloky. V létě bývá plno i pár dní dopředu.' },
        { name: 'Šperky', detail: 'Ve železité vodě zčernají stříbrné a zlaté šperky. Sundejte před koupáním.' }
      ]
    },

    emergency: {
      title: 'Nouzová čísla',
      emoji: '🚨',
      items: [
        { name: '112', detail: 'Univerzální evropská tísňová linka (policie, hasiči, záchranka).' },
        { name: '+351 296 205 400', detail: 'Nemocnice Ponta Delgada (Hospital do Divino Espírito Santo).' },
        { name: '+351 296 304 350', detail: 'Letiště João Paulo II, Ponta Delgada.' },
        { name: '+351 213 950 690', detail: 'Velvyslanectví ČR v Lisabonu.' },
        { name: 'PSP', detail: 'Městská policie v Ponta Delgadě: +351 296 282 022.' }
      ]
    }
  };

  // ========= VELRYBY =========
  const WHALES = {
    title: 'Pozorování kytovců',
    intro: 'Vody kolem São Miguel patří k nejvýznamnějším migračním koridorům v severním Atlantiku. Tradiční metoda pozemních pozorovatelen (vigias) s dalekohledy navádí čluny přímo ke zvířatům — úspěšnost pozorování dosahuje téměř 99 %.',
    species: [
      { name: 'Vorvaň obrovský', latin: 'Physeter macrocephalus', type: 'Rezidentní', season: 'Celoročně' },
      { name: 'Delfín obecný', latin: 'Delphinus delphis', type: 'Rezidentní', season: 'Celoročně' },
      { name: 'Delfín skákavý', latin: 'Tursiops truncatus', type: 'Rezidentní', season: 'Celoročně' },
      { name: 'Delfín šedý (Rissoův)', latin: 'Grampus griseus', type: 'Rezidentní', season: 'Celoročně' },
      { name: 'Plejtvák obrovský', latin: 'Balaenoptera musculus', type: 'Migrující', season: 'Duben–květen' },
      { name: 'Plejtvák myšok', latin: 'Balaenoptera physalus', type: 'Migrující', season: 'Duben–červen' },
      { name: 'Plejtvák sejval', latin: 'Balaenoptera borealis', type: 'Migrující', season: 'Duben–červen' },
      { name: 'Kosatka dravá', latin: 'Orcinus orca', type: 'Příležitostná', season: 'Léto–podzim' }
    ],
    tips: [
      'Pro maximální diverzi druhů volte duben–květen — migrují tudy největší savci planety.',
      'Vyberte operátora s certifikací „Bio Azores" (udržitelný turismus).',
      'Seděte vepředu na lodi — nejméně kymácení při nevolnosti.',
      'Dramamine nebo elektronické zápěstní náramky 30 min předem.'
    ]
  };

  // ========= GASTRONOMIE =========
  const GASTRO = {
    title: 'Azorská kuchyně',
    specialities: [
      {
        id: 'cozido',
        name: 'Cozido das Furnas',
        emoji: '🍖',
        description: 'Směs hovězího, vepřového a kuřecího masa s klobásami a kořenovou zeleninou, vařená 5–6 hodin v zemi za pomoci geotermálního tepla. Výsledkem je extrémní křehkost a lehce sirnatá vůně.',
        where: 'Restaurace Tony\'s a Miroma v obci Furnas. Rezervace nutná, objednávka minimálně den předem.',
        price: '20–28 € / porce'
      },
      {
        id: 'bife',
        name: 'Bife à Regional',
        emoji: '🥩',
        description: 'Azorský steak z celoročně pastvinně chovaného skotu. Podává se s česnekem, místními pálivými papričkami pimenta da terra a často i sázeným vejcem.',
        where: 'Kvalitně v tavernách v Ponta Delgadě (např. A Tasca).',
        price: '15–22 €'
      },
      {
        id: 'ananas',
        name: 'Ananas azorský',
        emoji: '🍍',
        description: 'Jediné místo na světě, kde se pěstuje v kamenných sklenících — cyklus od semenáčku po plod trvá téměř 2 roky. Plody jsou menší, sladší a aromatičtější než tropické.',
        where: 'Plantáže Arruda a Santo António v Ponta Delgadě (vstup zdarma). Také v každém supermarketu.',
        price: 'Plod 8–15 €'
      },
      {
        id: 'caldeirada',
        name: 'Caldeirada de Peixe',
        emoji: '🐟',
        description: 'Vydatná rybí polévka z čerstvých atlantických úlovků. Bohatá na krevety, chobotnice a bílou rybu. Kořeněná místní paprikou.',
        where: 'Restaurace na marině v Ponta Delgadě a ve Vila Franca do Campo.',
        price: '12–18 €'
      },
      {
        id: 'queijadas',
        name: 'Queijadas da Vila',
        emoji: '🧁',
        description: 'Místní tvarohové košíčky z Vila Franca do Campo — malé pečivo ze sýrového těsta, skořice a vajec. Tradice starší než 100 let.',
        where: 'Cukrárny v historickém centru Vila Franca do Campo.',
        price: '1–1,5 € / kus'
      },
      {
        id: 'cha',
        name: 'Azorský čaj',
        emoji: '🍵',
        description: 'Jediná průmyslová čajová produkce v EU. Černý Orange Pekoe z Gorreany je jemný, mírně sladký, bez hořkosti. Zelený čaj Hysson je květinový a ovocný.',
        where: 'Plantáže Gorreana a Porto Formoso — ochutnávky zdarma.',
        price: 'Balíček 3–8 €'
      },
      {
        id: 'lapas',
        name: 'Lapas grelhadas',
        emoji: '🐚',
        description: 'Grilované přílipky (mořští plži) s česnekem, máslem a citronem. Místní specialita, lovena v přílivové zóně kolem celého ostrova.',
        where: 'Rybí restaurace v Ribeira Grande, Mosteiros, Rabo de Peixe.',
        price: '10–15 €'
      },
      {
        id: 'licor',
        name: 'Licor de Maracujá',
        emoji: '🍸',
        description: 'Likér z mučenky — aromatický, lehce kyselý. Často podáván jako digestiv po jídle. Ve verzi „Amora" z azorské ostružiny.',
        where: 'Suvenýry, supermarkety, lihovary.',
        price: 'Láhev 8–15 €'
      }
    ]
  };

  // ========= FRÁZE =========
  const PHRASES = [
    { cz: 'Ahoj / Dobrý den', pt: 'Olá', phon: 'o-lá' },
    { cz: 'Dobrý den (ráno)', pt: 'Bom dia', phon: 'bom díja' },
    { cz: 'Dobré odpoledne', pt: 'Boa tarde', phon: 'bóa tárda' },
    { cz: 'Dobrý večer', pt: 'Boa noite', phon: 'bóa nojta' },
    { cz: 'Na shledanou', pt: 'Adeus / Até logo', phon: 'adéuš / até lógu' },
    { cz: 'Děkuji', pt: 'Obrigado (muž) / Obrigada (žena)', phon: 'obrigádu / obrigáda' },
    { cz: 'Prosím', pt: 'Por favor', phon: 'por favór' },
    { cz: 'Ano / Ne', pt: 'Sim / Não', phon: 'sim / naun' },
    { cz: 'Promiňte', pt: 'Desculpe', phon: 'deškúlpa' },
    { cz: 'Nerozumím', pt: 'Não percebo', phon: 'náu persébu' },
    { cz: 'Kolik to stojí?', pt: 'Quanto custa?', phon: 'kvantu kušta?' },
    { cz: 'Účet, prosím', pt: 'A conta, por favor', phon: 'a konta por favór' },
    { cz: 'Nemluvím portugalsky', pt: 'Não falo português', phon: 'naun fálu portugéš' },
    { cz: 'Mluvíte anglicky?', pt: 'Fala inglês?', phon: 'fála ingléš?' },
    { cz: 'Kde je…?', pt: 'Onde fica…?', phon: 'onda fíka' },
    { cz: 'Kde je WC?', pt: 'Onde é a casa de banho?', phon: 'onda é a káza de baňu?' },
    { cz: 'Kde je pláž?', pt: 'Onde é a praia?', phon: 'onda é a praja?' },
    { cz: 'Jedno pivo / espresso', pt: 'Uma cerveja / um café', phon: 'uma servéža / un kafé' },
    { cz: 'Velkou vodu, prosím', pt: 'Uma água grande, por favor', phon: 'uma ágva granda' },
    { cz: 'Dobrou chuť', pt: 'Bom apetite', phon: 'bom apetít' },
    { cz: 'Na zdraví!', pt: 'Saúde!', phon: 'sa-údž' },
    { cz: 'Výborné (o jídle)', pt: 'Muito bom', phon: 'mujtu bom' },
    { cz: 'Pomoc!', pt: 'Socorro!', phon: 'sokórru' },
    { cz: 'Lékaře!', pt: 'Um médico!', phon: 'um médyku' }
  ];

  // ========= BALICÍ SEZNAM =========
  const PACKING_TEMPLATE = [
    { group: 'Oblečení', items: [
      'Voděodolná bunda s prodyšností (GoreTex)',
      'Trekové kalhoty nebo legíny',
      'Flísová mikina (mezivrstva)',
      'Tmavé nebo staré plavky (železo z pramenů!)',
      'Triko na převlečení po termálech',
      'Pláštěnka / pončo (kompaktní)',
      'Čepice proti slunci a kšiltovka',
      'Teplá čepice (pro vyšší polohy)'
    ]},
    { group: 'Obuv', items: [
      'Treková obuv s pevnou podrážkou (nejdůležitější)',
      'Sandály nebo „crocsy" do termálů',
      'Běžné tenisky do měst'
    ]},
    { group: 'Doplňky', items: [
      'Malý batoh 20–30 L na denní výlety',
      'Voděodolný obal na telefon',
      'Opalovací krém SPF 50+',
      'Sluneční brýle',
      'Trekové hole (volitelné, pro Lagoa do Fogo)',
      'Ručník z mikrovlákna (rychleschnoucí)',
      'Čelovka (pro ranní výjezdy za východem)',
      'Maska a šnorchl (Ilhéu de Vila Franca)'
    ]},
    { group: 'Doklady a finance', items: [
      'Občanský průkaz / pas',
      'Řidičský průkaz (pro půjčovnu)',
      'Kreditní karta na depozit',
      'Hotovost — 100–200 € na start',
      'Kopie dokladů na telefonu'
    ]},
    { group: 'Technika', items: [
      'Nabíječky + powerbanka',
      'Evropský adaptér není nutný (typ F)',
      'Fotoaparát / gimbal',
      'Offline mapy (Google / Maps.me / OsmAnd)',
      'Aplikace SpotAzores pro webkamery'
    ]},
    { group: 'Lékárnička', items: [
      'Osobní léky',
      'Analgetika (ibuprofen, paracetamol)',
      'Léky proti mořské nemoci (velryby)',
      'Náplasti na puchýře',
      'Repelent (v lese komáři ojediněle)'
    ]}
  ];

  // ========= TIPY DNE (rotují dle kategorií) =========
  const DAILY_TIPS = [
    { emoji: '☁️', text: 'Před cestou na Lagoa do Fogo nebo Sete Cidades zkontrolujte webkamery aplikace SpotAzores — v mlze ztrácí vyhlídky smysl.' },
    { emoji: '💳', text: 'Vyhněte se ATM Euronet v turistických zónách. Hledejte Multibanco u Millennium, BPI nebo Santander.' },
    { emoji: '🧣', text: 'Vrstvení je klíč. Ráno mlha, v poledne slunce, odpoledne liják — všechno během jednoho dne.' },
    { emoji: '♨️', text: 'Na termální prameny berte staré nebo tmavé plavky. Železo v Terra Nostra a Poça je natrvalo obarví oranžově.' },
    { emoji: '🚗', text: 'Při rezervaci auta si připlaťte SCDW pojištění. Chrání před drahými opravami spojky na strmých pobřežních cestách.' },
    { emoji: '🌊', text: 'Ponta da Ferraria stojí a padá s přílivem. Cíl: konec odlivu — pak je voda tak akorát vlažná.' },
    { emoji: '🥾', text: 'Vulkanické podloží je po dešti extrémně kluzké. Na trasy pevná obuv s hlubokým vzorkem, nikoli běžné tenisky.' },
    { emoji: '🐋', text: 'Duben–květen migrují obři — plejtvák obrovský, myšok a sejval. Ideální okno pro velrybářský výlet.' },
    { emoji: '🍲', text: 'Cozido das Furnas objednávejte den předem. Restaurace potřebují čas, pokrm se vaří 5–6 hodin v zemi.' },
    { emoji: '🏪', text: 'Na samozásobu rezervujte nákup v Continente Modelo (Parque Atlântico) — otevřeno 8:30–23:00, široký výběr.' },
    { emoji: '🚌', text: 'Lagoa do Fogo: v létě 9–19 h jen shuttle bus. Ranní přejezd před 9:00 vám ušetří frontu a poplatek.' },
    { emoji: '🍍', text: 'Azorský ananas má tmavší dužinu a voní intenzivněji. Plantáž Arruda v Ponta Delgadě má vstup zdarma.' },
    { emoji: '📱', text: 'Stáhněte si offline mapy Google nebo Maps.me — na trasách a ve vnitrozemí může být slabý signál.' },
    { emoji: '🌋', text: 'V Caldeiras das Furnas nepřelézejte zábrany — voda má přes 90 °C. Vážné popáleniny.' },
    { emoji: '🥥', text: 'Ochutnejte minerální vody z různých pramenů v centru Furnas — každý má odlišné složení a chuť.' }
  ];

  return { CATEGORIES, PLACES, TRAILS, PRACTICAL, WHALES, GASTRO, PHRASES, PACKING_TEMPLATE, DAILY_TIPS };
})();
