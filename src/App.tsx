/**
 * ============================================================================
 *  SPARKYS CODE-ABENTEUER
 *  Programmieren lernen für die ganze Familie – 5 Welten, Level 1 bis ∞
 *  Eine einzige Datei: React + TypeScript + Tailwind CSS + lucide-react
 *  Offline-fähig: Fortschritt im localStorage, Sound über die Web Audio API
 * ============================================================================
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUp, ArrowLeft, ArrowRight, RotateCcw, RotateCw, Repeat, Play, Pause, Settings, Star, Gem, ChevronLeft,
  Lock, Trophy, BookOpen, Shirt, Gift, Music, Volume2, VolumeX, Smartphone, Globe, MapPin, Sparkles, LifeBuoy,
  X, Check, Code2, Blocks, Trash2, Plus, Minus, Undo2, Zap, Crown, Map as MapIcon, Home, FastForward, HelpCircle,
  Infinity as InfinityIcon, Key, Flag, Rocket, Brain, GitBranch, Variable, Cpu, Atom, Moon, Sun, Snowflake, Leaf, Flower2,
  CalendarDays, RefreshCw, ChevronsUp, Footprints, Lightbulb, Medal, Target, Eye,
} from 'lucide-react';

/* ============================================================================
 * 1) SPRACHEN  (de, en, fr, ar, tr, es, it)
 * ========================================================================== */
export type Lang = 'de' | 'en' | 'fr' | 'ar' | 'tr' | 'es' | 'it';
const LANGS: { id: Lang; name: string; flag: string[] }[] = [
  { id: 'de', name: 'Deutsch', flag: ['#000000', '#dd0000', '#ffce00'] },
  { id: 'en', name: 'English', flag: ['#012169', '#ffffff', '#c8102e'] },
  { id: 'fr', name: 'Français', flag: ['#0055a4', '#ffffff', '#ef4135'] },
  { id: 'ar', name: 'العربية', flag: ['#007a3d', '#ffffff', '#000000'] },
  { id: 'tr', name: 'Türkçe', flag: ['#e30a17', '#ffffff', '#e30a17'] },
  { id: 'es', name: 'Español', flag: ['#aa151b', '#f1bf00', '#aa151b'] },
  { id: 'it', name: 'Italiano', flag: ['#009246', '#ffffff', '#ce2b37'] },
];
const LI: Record<Lang, number> = { de: 0, en: 1, fr: 2, ar: 3, tr: 4, es: 5, it: 6 };

// Jede Zeile: [de, en, fr, ar, tr, es, it]
const T = {
  title: ['Sparkys Code-Abenteuer', "Sparky's Code Adventure", 'L’aventure code de Sparky', 'مغامرة سباركي البرمجية', 'Sparky’nin Kod Macerası', 'La aventura de código de Sparky', 'L’avventura di codice di Sparky'],
  worldSelect: ['Welt-Auswahl', 'Choose a World', 'Choix du monde', 'اختر عالمك', 'Dünya Seçimi', 'Elige un mundo', 'Scegli il mondo'],
  worldSub: ['Wähle deine Welt und starte dein Abenteuer!', 'Pick your world and start your adventure!', 'Choisis ton monde et commence l’aventure !', 'اختر عالمك وابدأ مغامرتك!', 'Dünyanı seç ve maceraya başla!', '¡Elige tu mundo y empieza la aventura!', 'Scegli il tuo mondo e inizia l’avventura!'],
  play: ['SPIELEN', 'PLAY', 'JOUER', 'العب', 'OYNA', 'JUGAR', 'GIOCA'],
  go: ['Los!', 'Go!', 'Go !', 'انطلق!', 'Başla!', '¡Ya!', 'Via!'],
  slogan: ['Lernen. Spielen. Zukunft gestalten!', 'Learn. Play. Shape the future!', 'Apprendre. Jouer. Créer l’avenir !', 'تعلّم. العب. اصنع المستقبل!', 'Öğren. Oyna. Geleceği şekillendir!', '¡Aprende. Juega. Crea el futuro!', 'Impara. Gioca. Crea il futuro!'],
  years: ['Jahre', 'years', 'ans', 'سنوات', 'yaş', 'años', 'anni'],
  w0: ['Zauberwald', 'Enchanted Forest', 'Forêt enchantée', 'الغابة السحرية', 'Büyülü Orman', 'Bosque mágico', 'Bosco incantato'],
  w1: ['Kristall-Lagune', 'Crystal Lagoon', 'Lagon de cristal', 'البحيرة الكريستالية', 'Kristal Lagün', 'Laguna de cristal', 'Laguna di cristallo'],
  w2: ['Sternen-Akademie', 'Star Academy', 'Académie des étoiles', 'أكاديمية النجوم', 'Yıldız Akademisi', 'Academia estelar', 'Accademia delle stelle'],
  w3: ['Neon-Metropole', 'Neon Metropolis', 'Métropole néon', 'مدينة النيون', 'Neon Metropol', 'Metrópolis neón', 'Metropoli al neon'],
  w4: ['Quantum-Lab', 'Quantum Lab', 'Labo quantique', 'المختبر الكمّي', 'Kuantum Lab', 'Laboratorio cuántico', 'Laboratorio quantistico'],
  level: ['Level', 'Level', 'Niveau', 'المستوى', 'Seviye', 'Nivel', 'Livello'],
  fwd: ['Vorwärts', 'Forward', 'Avancer', 'للأمام', 'İleri', 'Avanzar', 'Avanti'],
  left: ['Links', 'Left', 'Gauche', 'يسار', 'Sol', 'Izquierda', 'Sinistra'],
  right: ['Rechts', 'Right', 'Droite', 'يمين', 'Sağ', 'Derecha', 'Destra'],
  jump: ['Springen', 'Jump', 'Sauter', 'اقفز', 'Zıpla', 'Saltar', 'Salta'],
  loop: ['Schleife', 'Loop', 'Boucle', 'حلقة', 'Döngü', 'Bucle', 'Ciclo'],
  ifb: ['Wenn', 'If', 'Si', 'إذا', 'Eğer', 'Si', 'Se'],
  whileb: ['Solange', 'While', 'Tant que', 'طالما', 'İken', 'Mientras', 'Finché'],
  blocks: ['Blöcke', 'Blocks', 'Blocs', 'كتل', 'Bloklar', 'Bloques', 'Blocchi'],
  livecode: ['Live-Code (Python)', 'Live Code (Python)', 'Code live (Python)', 'كود مباشر (Python)', 'Canlı Kod (Python)', 'Código en vivo (Python)', 'Codice live (Python)'],
  goalStars: ['Sammle alle Sterne und erreiche das Ziel!', 'Collect all stars and reach the goal!', 'Ramasse les étoiles et atteins le but !', 'اجمع كل النجوم وصل إلى الهدف!', 'Tüm yıldızları topla ve hedefe ulaş!', '¡Recoge las estrellas y llega a la meta!', 'Raccogli le stelle e raggiungi il traguardo!'],
  goalKey: ['Hol den Schlüssel, öffne das Tor!', 'Grab the key and open the gate!', 'Prends la clé et ouvre la porte !', 'خذ المفتاح وافتح البوابة!', 'Anahtarı al, kapıyı aç!', '¡Coge la llave y abre la puerta!', 'Prendi la chiave e apri il cancello!'],
  goalJump: ['Spring über Wasser und Hindernisse!', 'Jump over water and obstacles!', 'Saute par-dessus l’eau et les obstacles !', 'اقفز فوق الماء والعوائق!', 'Suyun ve engellerin üzerinden zıpla!', '¡Salta sobre el agua y obstáculos!', 'Salta sopra acqua e ostacoli!'],
  goalLoop: ['Nutze eine Schleife – weniger Code, mehr Sterne!', 'Use a loop – less code, more stars!', 'Utilise une boucle : moins de code, plus d’étoiles !', 'استخدم حلقة – كود أقل ونجوم أكثر!', 'Döngü kullan – az kod, çok yıldız!', 'Usa un bucle: menos código, más estrellas', 'Usa un ciclo: meno codice, più stelle!'],
  goalWhile: ['Nutze while & if – lass Sparky selbst denken!', 'Use while & if – let Sparky think!', 'Utilise while et if : Sparky réfléchit !', 'استخدم while و if – دع سباركي يفكر!', 'while ve if kullan – Sparky düşünsün!', 'Usa while e if: ¡que Sparky piense!', 'Usa while e if: fai pensare Sparky!'],
  goalRec: ['Profi-Tipp: eine Funktion, die sich selbst aufruft!', 'Pro tip: a function that calls itself!', 'Astuce : une fonction qui s’appelle elle-même !', 'نصيحة: دالة تستدعي نفسها!', 'İpucu: kendini çağıran bir fonksiyon!', 'Truco: ¡una función que se llama a sí misma!', 'Consiglio: una funzione che chiama se stessa!'],
  emptyProg: ['Füge zuerst Befehle hinzu!', 'Add some commands first!', 'Ajoute d’abord des commandes !', 'أضف أوامر أولاً!', 'Önce komut ekle!', '¡Primero añade comandos!', 'Aggiungi prima dei comandi!'],
  crash: ['Autsch! Da ist ein Hindernis.', 'Ouch! There is an obstacle.', 'Aïe ! Un obstacle.', 'أوه! هناك عائق.', 'Ah! Orada bir engel var.', '¡Ay! Hay un obstáculo.', 'Ahi! C’è un ostacolo.'],
  fall: ['Hoppla! Sparky ist ins Leere getreten.', 'Oops! Sparky stepped into nothing.', 'Oups ! Sparky est tombé dans le vide.', 'عفوًا! سقط سباركي في الفراغ.', 'Hoppala! Sparky boşluğa düştü.', '¡Ups! Sparky cayó al vacío.', 'Ops! Sparky è caduto nel vuoto.'],
  notGoal: ['Fast! Sparky ist noch nicht am Ziel.', 'Almost! Sparky has not reached the goal.', 'Presque ! Sparky n’est pas au but.', 'تقريبًا! لم يصل سباركي إلى الهدف.', 'Neredeyse! Sparky hedefte değil.', '¡Casi! Sparky no llegó a la meta.', 'Quasi! Sparky non è al traguardo.'],
  door: ['Das Tor ist zu – hol zuerst den Schlüssel!', 'The gate is locked – get the key first!', 'La porte est fermée : prends la clé !', 'البوابة مغلقة – خذ المفتاح أولاً!', 'Kapı kilitli – önce anahtarı al!', 'La puerta está cerrada: ¡coge la llave!', 'Il cancello è chiuso: prendi la chiave!'],
  tooLong: ['Zu viele Schritte – Endlosschleife?', 'Too many steps – infinite loop?', 'Trop d’étapes : boucle infinie ?', 'خطوات كثيرة – حلقة لا نهائية؟', 'Çok fazla adım – sonsuz döngü?', 'Demasiados pasos: ¿bucle infinito?', 'Troppi passi: ciclo infinito?'],
  syntax: ['Code-Fehler in Zeile', 'Code error in line', 'Erreur de code ligne', 'خطأ في السطر', 'Kod hatası, satır', 'Error de código en la línea', 'Errore di codice alla riga'],
  tryAgain: ['Nochmal', 'Try again', 'Réessayer', 'حاول مجددًا', 'Tekrar', 'Otra vez', 'Riprova'],
  levelDone: ['Level geschafft!', 'Level complete!', 'Niveau réussi !', 'أحسنت! اكتمل المستوى', 'Seviye tamam!', '¡Nivel superado!', 'Livello superato!'],
  next: ['Weiter', 'Next', 'Suivant', 'التالي', 'İleri', 'Siguiente', 'Avanti'],
  replay: ['Wiederholen', 'Replay', 'Rejouer', 'إعادة', 'Tekrarla', 'Repetir', 'Ripeti'],
  map: ['Karte', 'Map', 'Carte', 'الخريطة', 'Harita', 'Mapa', 'Mappa'],
  paused: ['Pause', 'Paused', 'Pause', 'إيقاف مؤقت', 'Duraklatıldı', 'Pausa', 'Pausa'],
  resume: ['Weiterspielen', 'Resume', 'Reprendre', 'متابعة', 'Devam et', 'Continuar', 'Riprendi'],
  restart: ['Neu starten', 'Restart', 'Recommencer', 'إعادة البدء', 'Yeniden başlat', 'Reiniciar', 'Ricomincia'],
  toMap: ['Zur Karte', 'To the map', 'Vers la carte', 'إلى الخريطة', 'Haritaya', 'Al mapa', 'Alla mappa'],
  settings: ['Einstellungen', 'Settings', 'Paramètres', 'الإعدادات', 'Ayarlar', 'Ajustes', 'Impostazioni'],
  music: ['Musik', 'Music', 'Musique', 'الموسيقى', 'Müzik', 'Música', 'Musica'],
  sound: ['Soundeffekte', 'Sound effects', 'Effets sonores', 'المؤثرات الصوتية', 'Ses efektleri', 'Efectos de sonido', 'Effetti sonori'],
  vibration: ['Vibration', 'Vibration', 'Vibration', 'الاهتزاز', 'Titreşim', 'Vibración', 'Vibrazione'],
  language: ['Sprache', 'Language', 'Langue', 'اللغة', 'Dil', 'Idioma', 'Lingua'],
  region: ['Region', 'Region', 'Région', 'المنطقة', 'Bölge', 'Región', 'Regione'],
  seasonPreview: ['Saison-Vorschau', 'Season preview', 'Aperçu des saisons', 'معاينة المواسم', 'Sezon önizleme', 'Vista de temporada', 'Anteprima stagione'],
  auto: ['Automatisch', 'Automatic', 'Automatique', 'تلقائي', 'Otomatik', 'Automático', 'Automatico'],
  support: ['Hilfe & Support', 'Help & Support', 'Aide & support', 'المساعدة والدعم', 'Yardım & Destek', 'Ayuda y soporte', 'Aiuto e supporto'],
  supportText: ['Tippe Befehle oder schreibe Python-Code. Sparky führt ihn Schritt für Schritt aus. Alles wird nur auf diesem Gerät gespeichert.', 'Tap commands or write Python code. Sparky runs it step by step. Everything is saved on this device only.', 'Touche les commandes ou écris du Python. Sparky l’exécute pas à pas. Tout reste sur cet appareil.', 'اضغط الأوامر أو اكتب كود بايثون. ينفذه سباركي خطوة بخطوة. كل شيء يُحفظ على هذا الجهاز فقط.', 'Komutlara dokun ya da Python yaz. Sparky adım adım çalıştırır. Her şey yalnızca bu cihazda saklanır.', 'Toca comandos o escribe Python. Sparky lo ejecuta paso a paso. Todo se guarda solo en este dispositivo.', 'Tocca i comandi o scrivi Python. Sparky lo esegue passo passo. Tutto resta su questo dispositivo.'],
  reset: ['Fortschritt löschen', 'Reset progress', 'Effacer la progression', 'مسح التقدم', 'İlerlemeyi sil', 'Borrar progreso', 'Cancella progressi'],
  confirmReset: ['Wirklich alles löschen?', 'Really delete everything?', 'Vraiment tout effacer ?', 'هل تريد حذف كل شيء؟', 'Her şey silinsin mi?', '¿Borrar todo de verdad?', 'Cancellare davvero tutto?'],
  yes: ['Ja', 'Yes', 'Oui', 'نعم', 'Evet', 'Sí', 'Sì'],
  no: ['Nein', 'No', 'Non', 'لا', 'Hayır', 'No', 'No'],
  knowledge: ['Code-Wissen', 'Code Knowledge', 'Savoir code', 'معرفة البرمجة', 'Kod Bilgisi', 'Saber de código', 'Sapere del codice'],
  knowledgeSub: ['Sammle alle Entdecker-Karten!', 'Collect all explorer cards!', 'Collectionne les cartes d’explorateur !', 'اجمع كل بطاقات المستكشف!', 'Tüm kaşif kartlarını topla!', '¡Colecciona las cartas de explorador!', 'Colleziona le carte esploratore!'],
  unlockAt: ['Freischalten in', 'Unlock in', 'Débloquer dans', 'يُفتح في', 'Kilidi açılır:', 'Se desbloquea en', 'Si sblocca in'],
  trophies: ['Erfolge', 'Trophies', 'Trophées', 'الإنجازات', 'Başarılar', 'Logros', 'Trofei'],
  costume: ['Kostüme', 'Outfits', 'Costumes', 'الأزياء', 'Kostümler', 'Disfraces', 'Costumi'],
  daily: ['Belohnung', 'Rewards', 'Cadeaux', 'المكافآت', 'Ödüller', 'Premios', 'Premi'],
  hats: ['Hüte', 'Hats', 'Chapeaux', 'قبعات', 'Şapkalar', 'Sombreros', 'Cappelli'],
  glasses: ['Brillen', 'Glasses', 'Lunettes', 'نظارات', 'Gözlükler', 'Gafas', 'Occhiali'],
  outfits: ['Outfits', 'Outfits', 'Tenues', 'ملابس', 'Kıyafetler', 'Atuendos', 'Vestiti'],
  buy: ['Kaufen', 'Buy', 'Acheter', 'شراء', 'Satın al', 'Comprar', 'Compra'],
  equip: ['Anziehen', 'Wear', 'Porter', 'ارتداء', 'Giy', 'Poner', 'Indossa'],
  equipped: ['Angezogen', 'Worn', 'Porté', 'مرتدى', 'Giyildi', 'Puesto', 'Indossato'],
  notEnough: ['Nicht genug Kristalle!', 'Not enough crystals!', 'Pas assez de cristaux !', 'كريستالات غير كافية!', 'Yeterli kristal yok!', '¡No hay cristales suficientes!', 'Cristalli insufficienti!'],
  dailyTitle: ['Tägliche Belohnung', 'Daily Reward', 'Cadeau du jour', 'المكافأة اليومية', 'Günlük Ödül', 'Premio diario', 'Premio giornaliero'],
  wheel: ['Glücksrad', 'Lucky Wheel', 'Roue de la chance', 'عجلة الحظ', 'Şans Çarkı', 'Ruleta de la suerte', 'Ruota della fortuna'],
  spin: ['DREHEN!', 'SPIN!', 'TOURNER !', 'أدِر!', 'ÇEVİR!', '¡GIRAR!', 'GIRA!'],
  tomorrow: ['Morgen wieder!', 'Come back tomorrow!', 'Reviens demain !', 'عُد غدًا!', 'Yarın tekrar!', '¡Vuelve mañana!', 'Torna domani!'],
  login7: ['7-Tage-Login', '7-Day Login', 'Connexion 7 jours', 'تسجيل 7 أيام', '7 Gün Girişi', 'Entrada 7 días', 'Accesso 7 giorni'],
  day: ['Tag', 'Day', 'Jour', 'يوم', 'Gün', 'Día', 'Giorno'],
  claim: ['ABHOLEN', 'CLAIM', 'RÉCUPÉRER', 'استلم', 'AL', 'RECOGER', 'RITIRA'],
  claimed: ['Abgeholt', 'Claimed', 'Récupéré', 'تم الاستلام', 'Alındı', 'Recogido', 'Ritirato'],
  youWon: ['Gewonnen!', 'You won!', 'Gagné !', 'لقد ربحت!', 'Kazandın!', '¡Ganaste!', 'Hai vinto!'],
  newItem: ['Neues Kostüm-Teil!', 'New outfit item!', 'Nouvel accessoire !', 'قطعة جديدة!', 'Yeni kostüm parçası!', '¡Nueva prenda!', 'Nuovo accessorio!'],
  stars: ['Sterne', 'Stars', 'Étoiles', 'نجوم', 'Yıldızlar', 'Estrellas', 'Stelle'],
  crystals: ['Kristalle', 'Crystals', 'Cristaux', 'كريستالات', 'Kristaller', 'Cristales', 'Cristalli'],
  close: ['Schließen', 'Close', 'Fermer', 'إغلاق', 'Kapat', 'Cerrar', 'Chiudi'],
  endless: ['Endlos-Modus', 'Endless mode', 'Mode infini', 'الوضع اللانهائي', 'Sonsuz mod', 'Modo infinito', 'Modalità infinita'],
  speech: ['Super! Lass uns das nächste Level spielen!', 'Great! Let’s play the next level!', 'Super ! Jouons au niveau suivant !', 'رائع! لنلعب المستوى التالي!', 'Süper! Sıradaki seviyeyi oynayalım!', '¡Genial! ¡Juguemos el siguiente nivel!', 'Grande! Giochiamo il prossimo livello!'],
  yourStars: ['Deine Sterne', 'Your stars', 'Tes étoiles', 'نجومك', 'Yıldızların', 'Tus estrellas', 'Le tue stelle'],
  chooseWorld: ['Welt wählen', 'Choose world', 'Choisir un monde', 'اختر العالم', 'Dünya seç', 'Elegir mundo', 'Scegli mondo'],
  blocksHint: ['Tippe unten auf Befehle, um sie hinzuzufügen.', 'Tap the commands below to add them.', 'Touche les commandes ci-dessous.', 'اضغط على الأوامر بالأسفل لإضافتها.', 'Eklemek için alttaki komutlara dokun.', 'Toca los comandos de abajo.', 'Tocca i comandi qui sotto.'],
  insideLoop: ['Neue Befehle landen in der Schleife', 'New commands go into the loop', 'Les commandes vont dans la boucle', 'الأوامر الجديدة تدخل الحلقة', 'Yeni komutlar döngüye eklenir', 'Los comandos van dentro del bucle', 'I comandi vanno nel ciclo'],
  tooComplex: ['Dieser Code ist zu komplex für Blöcke – bleib im Live-Code!', 'This code is too complex for blocks – stay in Live Code!', 'Code trop complexe pour les blocs !', 'هذا الكود معقد على الكتل – ابقَ في الكود المباشر!', 'Bu kod bloklar için fazla karmaşık!', '¡Código demasiado complejo para bloques!', 'Codice troppo complesso per i blocchi!'],
  par: ['Ziel-Codelänge', 'Target code size', 'Taille de code visée', 'طول الكود المستهدف', 'Hedef kod uzunluğu', 'Tamaño objetivo', 'Lunghezza obiettivo'],
  yourCode: ['Deine Codelänge', 'Your code size', 'Ta taille de code', 'طول كودك', 'Kod uzunluğun', 'Tu tamaño', 'La tua lunghezza'],
  speed: ['Tempo', 'Speed', 'Vitesse', 'السرعة', 'Hız', 'Velocidad', 'Velocità'],
  seasonNow: ['Aktuelles Event', 'Current event', 'Événement actuel', 'الحدث الحالي', 'Güncel etkinlik', 'Evento actual', 'Evento attuale'],
  reward: ['Belohnung', 'Reward', 'Récompense', 'مكافأة', 'Ödül', 'Recompensa', 'Ricompensa'],
  locked: ['Gesperrt', 'Locked', 'Verrouillé', 'مقفل', 'Kilitli', 'Bloqueado', 'Bloccato'],
  hint: ['Tipp', 'Hint', 'Astuce', 'تلميح', 'İpucu', 'Pista', 'Suggerimento'],
  clear: ['Leeren', 'Clear', 'Vider', 'مسح', 'Temizle', 'Borrar', 'Svuota'],
  // Saison-Themes
  s_none: ['Kein Event', 'No event', 'Aucun', 'بدون حدث', 'Etkinlik yok', 'Sin evento', 'Nessun evento'],
  s_ramadan: ['Ramadan Kareem', 'Ramadan Kareem', 'Ramadan Moubarak', 'رمضان كريم', 'Hayırlı Ramazanlar', 'Ramadán Kareem', 'Ramadan Kareem'],
  s_eidFitr: ['Eid Mubarak – Zuckerfest', 'Eid Mubarak – Eid al-Fitr', 'Aïd Moubarak – Aïd el-Fitr', 'عيد فطر مبارك', 'Ramazan Bayramınız mübarek', 'Eid Mubarak – Fiesta del fin del Ramadán', 'Eid Mubarak – Eid al-Fitr'],
  s_eidAdha: ['Eid Mubarak – Opferfest', 'Eid Mubarak – Eid al-Adha', 'Aïd Moubarak – Aïd el-Kébir', 'عيد أضحى مبارك', 'Kurban Bayramınız mübarek', 'Eid Mubarak – Fiesta del Cordero', 'Eid Mubarak – Eid al-Adha'],
  s_christmas: ['Frohe Weihnachten', 'Merry Christmas', 'Joyeux Noël', 'عيد ميلاد مجيد', 'Mutlu Noeller', 'Feliz Navidad', 'Buon Natale'],
  s_easter: ['Frohe Ostern', 'Happy Easter', 'Joyeuses Pâques', 'فصح سعيد', 'Mutlu Paskalyalar', 'Felices Pascuas', 'Buona Pasqua'],
  s_halloween: ['Happy Halloween', 'Happy Halloween', 'Joyeux Halloween', 'هالوين سعيد', 'Mutlu Cadılar Bayramı', 'Feliz Halloween', 'Buon Halloween'],
  s_spring: ['Frühling', 'Spring', 'Printemps', 'الربيع', 'İlkbahar', 'Primavera', 'Primavera'],
  s_summer: ['Sommer', 'Summer', 'Été', 'الصيف', 'Yaz', 'Verano', 'Estate'],
  s_autumn: ['Herbst', 'Autumn', 'Automne', 'الخريف', 'Sonbahar', 'Otoño', 'Autunno'],
  s_winter: ['Winter', 'Winter', 'Hiver', 'الشتاء', 'Kış', 'Invierno', 'Inverno'],
  // Regionen
  r_europe: ['Europa', 'Europe', 'Europe', 'أوروبا', 'Avrupa', 'Europa', 'Europa'],
  r_mena: ['Nahost & Nordafrika', 'Middle East & N. Africa', 'Moyen-Orient & Afrique du Nord', 'الشرق الأوسط وشمال أفريقيا', 'Orta Doğu & K. Afrika', 'Oriente Medio y N. de África', 'Medio Oriente e N. Africa'],
  r_turkey: ['Türkei', 'Türkiye', 'Turquie', 'تركيا', 'Türkiye', 'Turquía', 'Turchia'],
  r_namerica: ['Nordamerika', 'North America', 'Amérique du Nord', 'أمريكا الشمالية', 'Kuzey Amerika', 'Norteamérica', 'Nord America'],
  r_samerica: ['Südamerika', 'South America', 'Amérique du Sud', 'أمريكا الجنوبية', 'Güney Amerika', 'Sudamérica', 'Sud America'],
  r_asia: ['Asien', 'Asia', 'Asie', 'آسيا', 'Asya', 'Asia', 'Asia'],
  r_africa: ['Afrika (Süd)', 'Southern Africa', 'Afrique australe', 'جنوب أفريقيا', 'Güney Afrika', 'África austral', 'Africa australe'],
  r_oceania: ['Ozeanien', 'Oceania', 'Océanie', 'أوقيانوسيا', 'Okyanusya', 'Oceanía', 'Oceania'],
} as const;
export type TKey = keyof typeof T;
const tr = (lang: Lang, k: TKey) => (T[k] as readonly string[])[LI[lang]] ?? (T[k] as readonly string[])[0];

/** Mehrsprachige Texte für Karten/Erfolge: [de, en, fr, ar, tr, es, it] */
type ML = readonly [string, string, string, string, string, string, string];
const ml = (lang: Lang, m: ML) => m[LI[lang]] ?? m[0];

/* ============================================================================
 * 2) WELTEN
 * ========================================================================== */
type WorldId = 0 | 1 | 2 | 3 | 4;
type Cmd = 'fwd' | 'left' | 'right' | 'jump';
interface WorldDef {
  id: WorldId; key: TKey; ages: string;
  sky: string;           // Tailwind-Hintergrund der Spielszene
  card: string;          // Karten-Verlauf
  ribbon: string;        // Banner-Farbe
  frame: string;         // Rahmen-Glow
  tile: [string, string, string]; // Deckfläche, linke Seite, rechte Seite
  tileAlt: string;
  edge: string;
  blocks: ('fwd' | 'left' | 'right' | 'jump' | 'loop' | 'if' | 'while')[];
  quick: string[];       // Schnell-Tasten im Live-Code
  goal: TKey;
  icon: React.ComponentType<{ className?: string }>;
  base: number;          // Basis-Note für Musik
}
const WORLDS: WorldDef[] = [
  {
    id: 0, key: 'w0', ages: '4–5', sky: 'from-sky-400 via-emerald-300 to-lime-300', card: 'from-lime-400 via-emerald-500 to-green-700',
    ribbon: 'from-green-500 to-emerald-700', frame: 'ring-yellow-300', tile: ['#7ed957', '#8b5a2b', '#6b4220'], tileAlt: '#a3e635', edge: '#3f6212',
    blocks: ['fwd', 'left', 'right', 'jump'], quick: ['move_forward()', 'turn_left()', 'turn_right()', 'jump()'], goal: 'goalStars', icon: Leaf, base: 60,
  },
  {
    id: 1, key: 'w1', ages: '6–8', sky: 'from-sky-300 via-cyan-200 to-indigo-300', card: 'from-sky-300 via-blue-500 to-indigo-700',
    ribbon: 'from-sky-500 to-blue-700', frame: 'ring-sky-300', tile: ['#bfe9ff', '#3b82f6', '#1d4ed8'], tileAlt: '#e0f2fe', edge: '#1e3a8a',
    blocks: ['fwd', 'left', 'right', 'jump', 'loop'], quick: ['move_forward()', 'turn_left()', 'turn_right()', 'jump()', 'for i in range(3):'], goal: 'goalLoop', icon: Gem, base: 62,
  },
  {
    id: 2, key: 'w2', ages: '9–12', sky: 'from-indigo-900 via-violet-700 to-fuchsia-500', card: 'from-amber-300 via-violet-600 to-indigo-900',
    ribbon: 'from-amber-500 to-orange-700', frame: 'ring-amber-300', tile: ['#f5d38a', '#a16207', '#78350f'], tileAlt: '#fde68a', edge: '#713f12',
    blocks: ['fwd', 'left', 'right', 'jump', 'loop', 'if'], quick: ['move_forward()', 'turn_left()', 'turn_right()', 'jump()', 'for i in range(3):', 'if path_ahead():', 'def macro():', 'macro()'], goal: 'goalLoop', icon: Rocket, base: 64,
  },
  {
    id: 3, key: 'w3', ages: '13–17', sky: 'from-fuchsia-900 via-purple-800 to-indigo-950', card: 'from-fuchsia-500 via-purple-700 to-indigo-950',
    ribbon: 'from-fuchsia-500 to-purple-800', frame: 'ring-fuchsia-400', tile: ['#4c1d95', '#1e1b4b', '#0f0a2e'], tileAlt: '#5b21b6', edge: '#22d3ee',
    blocks: ['fwd', 'left', 'right', 'jump', 'loop', 'if', 'while'], quick: ['move_forward()', 'turn_left()', 'turn_right()', 'jump()', 'while not at_goal():', 'if path_ahead():', 'else:', 'n = 3', 'and', 'not'], goal: 'goalWhile', icon: Cpu, base: 57,
  },
  {
    id: 4, key: 'w4', ages: '18+', sky: 'from-slate-950 via-blue-950 to-cyan-900', card: 'from-cyan-400 via-blue-700 to-slate-950',
    ribbon: 'from-cyan-500 to-blue-800', frame: 'ring-cyan-300', tile: ['#1e3a5f', '#0b1a33', '#06101f'], tileAlt: '#24507f', edge: '#38bdf8',
    blocks: ['fwd', 'left', 'right', 'jump', 'loop', 'if', 'while'], quick: ['move_forward()', 'turn_left()', 'turn_right()', 'jump()', 'def solve():', 'solve()', 'if not at_goal():', 'while path_ahead():', 'r1 = 0', 'r1 += 1'], goal: 'goalRec', icon: Atom, base: 55,
  },
];

/* ============================================================================
 * 3) LEVEL  –  Legende:  > < ^ v Start (Blickrichtung) · . Boden · * Stern · G Ziel
 *              # Hindernis · ~ Wasser/Lücke · (Leerzeichen) Nichts · k Schlüssel · D Tor
 * ========================================================================== */
const HANDMADE: string[][][] = [
  // ---- Welt 1: Zauberwald (4–5) ----
  [
    ['>.G'],
    ['>..*G'],
    ['>.*..G'],
    ['>.*', '  .', '  G'],
    ['.*G', '.  ', '^  '],
    ['  G', '  *', '>..'],
    ['>*  ', ' .. ', '  *G'],
    ['>.#.G', ' .*. '],
    ['>.~*G'],
    ['>*#.G'],
    ['>.*~.*G'],
    ['>.~..', '    .', '    *', '    G'],
    ['v....', '.   .', '.   .', '..*.G'],
    ['>..#G', '.#...', '...#*'],
    ['>.~.*..', '      .', 'G.*#...'],
  ],
  // ---- Welt 2: Kristall-Lagune (6–8) ----
  [
    ['>..*...*.G'],
    ['>.   ', ' ..  ', '  *. ', '   .G'],
    ['>.k.D.G'],
    ['>...*', '.   .', '.   .', 'G...*'],
    ['>.~*~*~.G'],
    ['>..D.G', ' k    '],
    ['>.     ', ' *.    ', '  *.   ', '   *.  ', '    *G '],
    ['>.k.D.~.D.G'],
    ['>..*..', '#####.', 'G*....'],
    ['>.#*#*#.G'],
    ['>.....', '     .', '.*G  .', '.    .', '......'],
    ['>.k..', '    D', '    .', 'G.*..'],
    ['v.', '. ', '~ ', '. ', '* ', '~ ', '. ', 'G '],
    ['>.~.k', '#   .', 'G.D*.'],
    ['>.k.~.*..', '#######.#', 'G.*.D....'],
  ],
  // ---- Welt 3: Sternen-Akademie (9–12) ----
  [
    ['>...', '.  *', '.  .', '...G'],
    ['>.      ', ' *.     ', '  ..    ', '   *.   ', '    ..  ', '     *G '],
    ['>..~*.~*.~*G'],
    ['>.*..', '    .', '..*..', '.    ', '..*.G'],
    [' .k  ', ' .   ', '>.D.G'],
    ['>......', '      .', '*.... .', '.   . .', '. G.. .', '.     .', '......*'],
    ['>.k.#.D.~.G'],
    ['>.~.', '   .', '   *', '   ~', '   .', '   G'],
    ['>.....*', '######.', '*......', '.######', '......G'],
    ['>.k.D.*.D.G'],
    ['   *   ', '   .   ', '>.....G', '   .   ', '   *   '],
    ['>.~*~.~.', '       .', 'G.~*~.~.'],
    ['>..#..G', '##.#.##', '...*...'],
    ['k.*....', '.#####.', '^.....D', '      G'],
    ['>.*.~.k.#.*..', '            .', 'G.*.D.~.*....'],
  ],
  // ---- Welt 4: Neon-Metropole (13–17) ----
  [
    ['>..........G'],
    ['>.......  ', '       .  ', '       *.G'],
    ['>.~.*~.~.*.~.G'],
    ['>.      ', ' ..     ', '  *.    ', '   ..   ', '    *.  ', '     ..G'],
    ['>.#..~.#.~..G'],
    ['>.....#', '#####.#', '#..*..#', '#.#####', '#...*.G'],
    ['>.k#.D..~.G'],
    ['>.....', '     .', 'G    .', '.    .', '..*..*'],
    ['>.~.   ', '   .   ', '   ~   ', '   .   ', '   .~.G'],
    ['  k    ', ' ..*   ', '>.D.D.G'],
    ['>.......*', '########.', '.........', '.########', '*.......G'],
    ['v', '.', '~', '.', '~', '*', '~', '.', 'G'],
    ['>.#....G', '#.#.##.#', '#...#*.#'],
    ['>.~.k.#.D.~.*.G'],
    ['>.*~...#..k', '##########.', 'G..D.*.~...'],
  ],
  // ---- Welt 5: Quantum-Lab (18+) ----
  [
    ['>...........*G'],
    ['>......', '      .', '..... .', '.   . .', '. G*. .', '.     .', '*......'],
    ['>.~.~.~.~*~.~.G'],
    ['>...~...*', '########.', '..~......', '.########', '*...~...G'],
    ['>.....#', '#####.#', '#.*...#', '#.#####', '#..*..G'],
    ['v', '.', 'k', '.', 'D', '~', '*', 'G'],
    ['>.....', '     .', ' ..*..', ' .    ', ' ..*..', '     .', 'G.....'],
    ['>.#.#.#*#.#.G'],
    ['      k ', 'G.D.*..<'],
    ['   *   ', '   .   ', '*..>..G', '   .   ', '   *   '],
    ['>.~.     ', '   .     ', '   .~.   ', '     *   ', '     .~.G'],
    ['>..#.....', '##.#.###.', '#..#...#.', '#.####.#.', '#......#*', '########.', 'G........'],
    ['>.k.~.*..', '########.', 'G.*D.~...'],
    ['>..#..', '.#...#', '..#.#.', '#...*.', '.#.#..', '..*..G'],
    ['>.~.k.#.*..', '##########.', '..*.~.D....', '.##########', '.*.~.#....G'],
  ],
];

interface Level {
  w: number; h: number; grid: string[][]; // Zellen ohne Startzeichen
  sx: number; sy: number; sd: number;     // Start + Richtung (0=O,1=S,2=W,3=N)
  stars: [number, number][]; par: number; seed?: number;
}
const DX = [1, 0, -1, 0], DY = [0, 1, 0, -1];

function parseMap(rows: string[]): Level {
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const grid: string[][] = []; let sx = 0, sy = 0, sd = 0; const stars: [number, number][] = [];
  for (let y = 0; y < h; y++) {
    const row: string[] = [];
    for (let x = 0; x < w; x++) {
      let c = rows[y][x] ?? ' ';
      const di = '>v<^'.indexOf(c);
      if (di >= 0) { sx = x; sy = y; sd = di; c = '.'; }
      if (c === '*') stars.push([x, y]);
      row.push(c);
    }
    grid.push(row);
  }
  const lv: Level = { w, h, grid, sx, sy, sd, stars, par: 0 };
  lv.par = solveLevel(lv) ?? 99;
  return lv;
}

const cell = (lv: Level, x: number, y: number) => (x < 0 || y < 0 || x >= lv.w || y >= lv.h ? ' ' : lv.grid[y][x]);
const walkable = (c: string, key: boolean) => c === '.' || c === '*' || c === 'G' || c === 'k' || (c === 'D' && key);

/** Breitensuche: kürzeste Befehlsfolge, die alle Sterne sammelt und das Ziel erreicht. */
function solveLevel(lv: Level): number | null {
  const sIdx = new Map<string, number>(); lv.stars.forEach(([x, y], i) => sIdx.set(x + ',' + y, i));
  const all = (1 << lv.stars.length) - 1;
  const enc = (x: number, y: number, d: number, m: number, k: number) => `${x},${y},${d},${m},${k}`;
  const seen = new Set<string>();
  let q: [number, number, number, number, number][] = [[lv.sx, lv.sy, lv.sd, 0, 0]];
  seen.add(enc(lv.sx, lv.sy, lv.sd, 0, 0));
  for (let depth = 0; depth < 200 && q.length; depth++) {
    const nq: typeof q = [];
    for (const [x, y, d, m, k] of q) {
      if (cell(lv, x, y) === 'G' && m === all) return depth;
      const cands: [number, number, number][] = [[x, y, (d + 3) % 4], [x, y, (d + 1) % 4]];
      const fx = x + DX[d], fy = y + DY[d];
      if (walkable(cell(lv, fx, fy), !!k)) cands.push([fx, fy, d]);
      const jx = x + 2 * DX[d], jy = y + 2 * DY[d];
      if (walkable(cell(lv, jx, jy), !!k) && !walkable(cell(lv, fx, fy), !!k) && cell(lv, fx, fy) !== 'D') cands.push([jx, jy, d]); // Par: nur sinnvolle Sprünge
      for (const [nx, ny, nd] of cands) {
        let nm = m, nk = k; const c = cell(lv, nx, ny);
        const si = sIdx.get(nx + ',' + ny); if (si !== undefined) nm |= 1 << si;
        if (c === 'k') nk = 1;
        const e = enc(nx, ny, nd, nm, nk);
        if (!seen.has(e)) { seen.add(e); nq.push([nx, ny, nd, nm, nk]); }
      }
    }
    q = nq;
  }
  return null;
}

/* ---- Prozeduraler Level-Generator (ab Level 16, unendlich) ---- */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function generateLevel(world: number, level: number): Level {
  for (let attempt = 0; attempt < 40; attempt++) {
    const r = rng(world * 1000003 + level * 7919 + attempt * 31);
    const tier = Math.min(30, level - 15);
    const segs = 2 + Math.min(7, Math.floor(tier / 3) + world);
    const path: [number, number][] = [[0, 0]]; const used = new Set(['0,0']);
    let d = 0, ok = true;
    for (let s = 0; s < segs && ok; s++) {
      if (s > 0) d = (d + (r() < 0.5 ? 1 : 3)) % 4;
      const len = 2 + Math.floor(r() * (3 + Math.min(3, world)));
      for (let i = 0; i < len; i++) {
        const [px, py] = path[path.length - 1]; const nx = px + DX[d], ny = py + DY[d];
        // kein Kontakt zu älteren Pfadzellen (keine Abkürzungen)
        const touching = [0, 1, 2, 3].some(k => { const ax = nx + DX[k], ay = ny + DY[k]; return used.has(ax + ',' + ay) && !(ax === px && ay === py); });
        if (used.has(nx + ',' + ny) || touching) { if (i < 2) ok = false; break; }
        path.push([nx, ny]); used.add(nx + ',' + ny);
      }
    }
    if (!ok || path.length < 5) continue;
    const minX = Math.min(...path.map(p => p[0])), minY = Math.min(...path.map(p => p[1]));
    const P = path.map(([x, y]) => [x - minX, y - minY] as [number, number]);
    const w = Math.max(...P.map(p => p[0])) + 1, h = Math.max(...P.map(p => p[1])) + 1;
    if (w > 12 || h > 10) continue;
    const g: string[][] = Array.from({ length: h }, () => Array.from({ length: w }, () => ' '));
    P.forEach(([x, y]) => (g[y][x] = '.'));
    const n = P.length;
    // Sprung-Hindernisse auf geraden Stücken
    const straight = (i: number) => i > 1 && i < n - 2 && P[i - 1][0] + P[i + 1][0] === 2 * P[i][0] && P[i - 1][1] + P[i + 1][1] === 2 * P[i][1];
    let last = -3;
    for (let i = 2; i < n - 2; i++) {
      if (straight(i) && i - last > 2 && r() < 0.18 + world * 0.04) { g[P[i][1]][P[i][0]] = r() < 0.5 ? '~' : '#'; last = i; }
    }
    // Schlüssel & Tor (ab Welt 2)
    if (world >= 1 && n > 8 && r() < 0.55) {
      const ki = 2 + Math.floor(r() * (n / 2 - 2)); const di = Math.floor(n / 2) + 1 + Math.floor(r() * (n / 2 - 3));
      if (g[P[ki][1]][P[ki][0]] === '.' && di < n - 1 && g[P[di][1]][P[di][0]] === '.' && g[P[di - 1][1]][P[di - 1][0]] === '.') {
        g[P[ki][1]][P[ki][0]] = 'k'; g[P[di][1]][P[di][0]] = 'D';
      }
    }
    // Sterne
    const nStars = 2 + Math.floor(r() * 2);
    for (let s = 0, tries = 0; s < nStars && tries < 50; tries++) {
      const i = 1 + Math.floor(r() * (n - 2)); const [x, y] = P[i];
      if (g[y][x] === '.') { g[y][x] = '*'; s++; }
    }
    // Deko-Hindernisse neben dem Pfad
    for (let i = 0; i < n; i++) if (r() < 0.12) {
      const k = Math.floor(r() * 4), x = P[i][0] + DX[k], y = P[i][1] + DY[k];
      if (x >= 0 && y >= 0 && x < w && y < h && g[y][x] === ' ') g[y][x] = '#';
    }
    g[P[n - 1][1]][P[n - 1][0]] = 'G';
    const sd = P[1][0] > P[0][0] ? 0 : P[1][1] > P[0][1] ? 1 : P[1][0] < P[0][0] ? 2 : 3;
    const rows = g.map((row, y) => row.map((c, x) => (x === P[0][0] && y === P[0][1] ? '>v<^'[sd] : c)).join(''));
    const lv = parseMap(rows); lv.seed = attempt;
    if (lv.par < 99) return lv;
  }
  return parseMap(['>..*..G']);
}
const levelCache = new Map<string, Level>();
function getLevel(world: number, level: number): Level {
  const k = world + ':' + level;
  if (!levelCache.has(k)) levelCache.set(k, level <= 15 ? parseMap(HANDMADE[world][level - 1]) : generateLevel(world, level));
  return levelCache.get(k)!;
}

/* ============================================================================
 * 4) MINI-PYTHON: Parser + Interpreter
 * ========================================================================== */
type Expr =
  | { t: 'num'; v: number } | { t: 'bool'; v: boolean } | { t: 'var'; n: string }
  | { t: 'sense'; n: string } | { t: 'not'; e: Expr } | { t: 'bin'; op: string; a: Expr; b: Expr };
type Stmt =
  | { k: 'cmd'; c: Cmd; line: number }
  | { k: 'for'; v: string; n: Expr; body: Stmt[]; line: number }
  | { k: 'while'; cond: Expr; body: Stmt[]; line: number }
  | { k: 'if'; cond: Expr; body: Stmt[]; orelse: Stmt[]; line: number }
  | { k: 'def'; name: string; body: Stmt[]; line: number }
  | { k: 'call'; name: string; line: number }
  | { k: 'assign'; name: string; op: string; e: Expr; line: number }
  | { k: 'pass'; line: number };

class CodeError extends Error { constructor(public line: number, msg: string) { super(msg); } }
const CMD_NAMES: Record<string, Cmd> = { move_forward: 'fwd', forward: 'fwd', turn_left: 'left', turn_right: 'right', jump: 'jump' };
const SENSORS = ['path_ahead', 'at_goal', 'gap_ahead', 'wall_ahead', 'has_key', 'star_here'];

function parseExpr(src: string, line: number): Expr {
  const toks = src.match(/\d+|[A-Za-z_]\w*\(\)|[A-Za-z_]\w*|==|!=|<=|>=|[()+\-*/%<>]/g) || [];
  const rest = src.replace(/\d+|[A-Za-z_]\w*\(\)|[A-Za-z_]\w*|==|!=|<=|>=|[()+\-*/%<>]|\s+/g, '');
  if (rest.length) throw new CodeError(line, `"${rest}"?`);
  let i = 0;
  const peek = () => toks[i]; const eat = () => toks[i++];
  const prec: Record<string, number> = { or: 1, and: 2, '==': 4, '!=': 4, '<': 4, '>': 4, '<=': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6 };
  const primary = (): Expr => {
    const t = eat();
    if (t === undefined) throw new CodeError(line, '…?');
    if (t === 'not') return { t: 'not', e: binary(3) };
    if (t === '(') { const e = binary(0); if (eat() !== ')') throw new CodeError(line, '")" fehlt'); return e; }
    if (t === '-') return { t: 'bin', op: '-', a: { t: 'num', v: 0 }, b: primary() };
    if (/^\d+$/.test(t)) return { t: 'num', v: +t };
    if (t === 'True' || t === 'False') return { t: 'bool', v: t === 'True' };
    if (t.endsWith('()')) { const n = t.slice(0, -2); if (!SENSORS.includes(n)) throw new CodeError(line, `${n}()?`); return { t: 'sense', n }; }
    if (/^[A-Za-z_]/.test(t)) return { t: 'var', n: t };
    throw new CodeError(line, `"${t}"?`);
  };
  const binary = (minP: number): Expr => {
    let a = primary();
    for (;;) {
      const op = peek(); if (op === undefined || prec[op] === undefined || prec[op] <= minP - 1 || prec[op] < minP) break;
      eat(); const b = binary(prec[op] + 1); a = { t: 'bin', op, a, b };
    }
    return a;
  };
  const e = binary(0);
  if (i < toks.length) throw new CodeError(line, `"${toks[i]}"?`);
  return e;
}

function parsePython(code: string): Stmt[] {
  const lines = code.replace(/\t/g, '    ').split('\n').map((raw, i) => {
    const noComment = raw.replace(/#.*$/, '');
    return { n: i + 1, ind: noComment.length - noComment.trimStart().length, s: noComment.trim() };
  }).filter(l => l.s.length);
  let p = 0;
  const block = (ind: number): Stmt[] => {
    const out: Stmt[] = [];
    while (p < lines.length && lines[p].ind >= ind) {
      const L = lines[p];
      if (L.ind > ind) throw new CodeError(L.n, 'Einrückung?');
      p++;
      const s = L.s; let m: RegExpMatchArray | null;
      const sub = () => {
        if (p >= lines.length || lines[p].ind <= ind) throw new CodeError(L.n, 'Block fehlt (einrücken)');
        return block(lines[p].ind);
      };
      if ((m = s.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\s*\((.+)\)\s*:$/))) out.push({ k: 'for', v: m[1], n: parseExpr(m[2], L.n), body: sub(), line: L.n });
      else if ((m = s.match(/^while\s+(.+):$/))) out.push({ k: 'while', cond: parseExpr(m[1], L.n), body: sub(), line: L.n });
      else if ((m = s.match(/^if\s+(.+):$/))) {
        const st: Stmt = { k: 'if', cond: parseExpr(m[1], L.n), body: sub(), orelse: [], line: L.n };
        out.push(st);
        let cur = st as Extract<Stmt, { k: 'if' }>;
        while (p < lines.length && lines[p].ind === ind && /^(elif\s+.+|else\s*):$/.test(lines[p].s)) {
          const E = lines[p]; p++;
          const em = E.s.match(/^elif\s+(.+):$/);
          if (em) { const ns: Extract<Stmt, { k: 'if' }> = { k: 'if', cond: parseExpr(em[1], E.n), body: [], orelse: [], line: E.n }; if (p >= lines.length || lines[p].ind <= ind) throw new CodeError(E.n, 'Block fehlt'); ns.body = block(lines[p].ind); cur.orelse = [ns]; cur = ns; }
          else { if (p >= lines.length || lines[p].ind <= ind) throw new CodeError(E.n, 'Block fehlt'); cur.orelse = block(lines[p].ind); break; }
        }
      }
      else if ((m = s.match(/^def\s+([A-Za-z_]\w*)\s*\(\s*\)\s*:$/))) out.push({ k: 'def', name: m[1], body: sub(), line: L.n });
      else if ((m = s.match(/^([A-Za-z_]\w*)\s*\(\s*\)$/))) out.push(CMD_NAMES[m[1]] ? { k: 'cmd', c: CMD_NAMES[m[1]], line: L.n } : { k: 'call', name: m[1], line: L.n });
      else if ((m = s.match(/^([A-Za-z_]\w*)\s*(=|\+=|-=|\*=)\s*(.+)$/))) out.push({ k: 'assign', name: m[1], op: m[2], e: parseExpr(m[3], L.n), line: L.n });
      else if (s === 'pass') out.push({ k: 'pass', line: L.n });
      else if (/^(else|elif)/.test(s)) throw new CodeError(L.n, '"else" ohne "if"');
      else throw new CodeError(L.n, `"${s}"?`);
    }
    return out;
  };
  const prog = block(0);
  if (p < lines.length) throw new CodeError(lines[p].n, 'Einrückung?');
  return prog;
}

/** Codelänge (für den 3. Stern): jede Anweisung zählt 1 */
const progSize = (ss: Stmt[]): number => ss.reduce((a, s) => a + 1 + ('body' in s ? progSize(s.body) : 0) + (s.k === 'if' ? progSize(s.orelse) : 0), 0);
const progUses = (ss: Stmt[], f: (s: Stmt) => boolean): boolean => ss.some(s => f(s) || ('body' in s && progUses(s.body, f)) || (s.k === 'if' && progUses(s.orelse, f)));

type FailKind = 'crash' | 'fall' | 'door' | 'tooLong' | 'notGoal';
interface Frame { x: number; y: number; d: number; jump?: boolean; got?: string; line: number; fail?: FailKind; win?: boolean; bump?: boolean }
interface RunResult { frames: Frame[]; win: boolean; fail?: FailKind; starsGot: number; error?: { line: number; msg: string } }

function runProgram(lv: Level, prog: Stmt[]): RunResult {
  let x = lv.sx, y = lv.sy, d = lv.sd, key = false; const got = new Set<string>();
  const frames: Frame[] = []; const vars: Record<string, number | boolean> = {};
  const funcs: Record<string, Stmt[]> = {}; let ops = 0, depth = 0;
  class Stop { constructor(public win: boolean, public fail?: FailKind) {} }
  const ahead = () => cell(lv, x + DX[d], y + DY[d]);
  const sense = (n: string): boolean => {
    const c = ahead();
    switch (n) {
      case 'path_ahead': return walkable(c, key);
      case 'at_goal': return cell(lv, x, y) === 'G';
      case 'gap_ahead': return c === '~' || c === ' ';
      case 'wall_ahead': return c === '#' || (c === 'D' && !key);
      case 'has_key': return key;
      case 'star_here': return cell(lv, x, y) === '*' && !got.has(x + ',' + y);
    }
    return false;
  };
  const ev = (e: Expr, line: number): number | boolean => {
    if (++ops > 50000) throw new Stop(false, 'tooLong');
    switch (e.t) {
      case 'num': case 'bool': return e.v;
      case 'var': if (!(e.n in vars)) throw new CodeError(line, `${e.n}?`); return vars[e.n];
      case 'sense': return sense(e.n);
      case 'not': return !ev(e.e, line);
      case 'bin': {
        if (e.op === 'and') return !!ev(e.a, line) && !!ev(e.b, line);
        if (e.op === 'or') return !!ev(e.a, line) || !!ev(e.b, line);
        const a = Number(ev(e.a, line)), b = Number(ev(e.b, line));
        switch (e.op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return b ? Math.floor(a / b) : 0; case '%': return b ? a % b : 0; case '<': return a < b; case '>': return a > b; case '<=': return a <= b; case '>=': return a >= b; case '==': return a === b; case '!=': return a !== b; }
      }
    }
    return 0;
  };
  const arrive = (line: number, jump: boolean) => {
    const c = cell(lv, x, y); let g: string | undefined;
    if (c === '*' && !got.has(x + ',' + y)) { got.add(x + ',' + y); g = 'star'; }
    if (c === 'k' && !key) { key = true; g = 'key'; }
    if (c === 'D') g = 'door';
    frames.push({ x, y, d, jump, got: g, line });
    if (c === 'G') { frames[frames.length - 1].win = true; throw new Stop(true); }
  };
  const doCmd = (c: Cmd, line: number) => {
    if (frames.length > 400) throw new Stop(false, 'tooLong');
    if (c === 'left') { d = (d + 3) % 4; frames.push({ x, y, d, line }); return; }
    if (c === 'right') { d = (d + 1) % 4; frames.push({ x, y, d, line }); return; }
    const step = c === 'jump' ? 2 : 1; const nx = x + DX[d] * step, ny = y + DY[d] * step; const t = cell(lv, nx, ny);
    if (c === 'jump' && cell(lv, x + DX[d], y + DY[d]) === 'D' && !key) { frames.push({ x, y, d, line, bump: true, fail: 'door' }); throw new Stop(false, 'door'); } // über ein geschlossenes Tor kann man nicht springen
    if (t === '#' || (t === 'D' && !key)) {
      frames.push({ x, y, d, line, bump: true, fail: t === 'D' ? 'door' : 'crash' }); throw new Stop(false, t === 'D' ? 'door' : 'crash');
    }
    if (!walkable(t, key)) { x = nx; y = ny; frames.push({ x, y, d, jump: c === 'jump', line, fail: 'fall' }); throw new Stop(false, 'fall'); }
    x = nx; y = ny; arrive(line, c === 'jump');
  };
  const exec = (ss: Stmt[]) => {
    for (const s of ss) {
      if (++ops > 50000) throw new Stop(false, 'tooLong');
      switch (s.k) {
        case 'cmd': doCmd(s.c, s.line); break;
        case 'for': { const n = Number(ev(s.n, s.line)); for (let i = 0; i < Math.min(n, 1000); i++) { vars[s.v] = i; exec(s.body); } break; }
        case 'while': { let g = 0; while (ev(s.cond, s.line)) { if (++g > 2000) throw new Stop(false, 'tooLong'); exec(s.body); } break; }
        case 'if': if (ev(s.cond, s.line)) exec(s.body); else exec(s.orelse); break;
        case 'def': funcs[s.name] = s.body; break;
        case 'call': {
          if (!funcs[s.name]) throw new CodeError(s.line, `${s.name}()?`);
          if (++depth > 200) throw new Stop(false, 'tooLong');
          exec(funcs[s.name]); depth--; break;
        }
        case 'assign': {
          const v = ev(s.e, s.line); const old = Number(vars[s.name] ?? 0);
          vars[s.name] = s.op === '=' ? v : s.op === '+=' ? old + Number(v) : s.op === '-=' ? old - Number(v) : old * Number(v); break;
        }
        case 'pass': break;
      }
    }
  };
  try {
    exec(prog);
    return { frames, win: false, fail: 'notGoal', starsGot: got.size };
  } catch (e) {
    if (e instanceof Stop) return { frames, win: e.win, fail: e.fail, starsGot: got.size };
    if (e instanceof CodeError) return { frames, win: false, starsGot: got.size, error: { line: e.line, msg: e.message } };
    throw e;
  }
}

/* ============================================================================
 * 5) BLÖCKE  ⇄  PYTHON
 * ========================================================================== */
type BCond = 'not_at_goal' | 'path_ahead' | 'gap_ahead' | 'wall_ahead';
type BNode =
  | { id: number; k: 'cmd'; c: Cmd }
  | { id: number; k: 'loop'; n: number; body: BNode[] }
  | { id: number; k: 'if'; cond: BCond; body: BNode[] }
  | { id: number; k: 'while'; cond: BCond; body: BNode[] };
let bid = 1; const nid = () => bid++;
const COND_PY: Record<BCond, string> = { not_at_goal: 'not at_goal()', path_ahead: 'path_ahead()', gap_ahead: 'gap_ahead()', wall_ahead: 'wall_ahead()' };
const CMD_PY: Record<Cmd, string> = { fwd: 'move_forward()', left: 'turn_left()', right: 'turn_right()', jump: 'jump()' };
function blocksToPy(bs: BNode[], ind = 0, depth = 0): string {
  const pad = '    '.repeat(ind); const vars = 'ijkmn';
  return bs.map(b => {
    if (b.k === 'cmd') return pad + CMD_PY[b.c];
    const head = b.k === 'loop' ? `for ${vars[depth % 5]} in range(${b.n}):` : b.k === 'if' ? `if ${COND_PY[b.cond]}:` : `while ${COND_PY[b.cond]}:`;
    return pad + head + '\n' + (b.body.length ? blocksToPy(b.body, ind + 1, depth + 1) : pad + '    pass');
  }).join('\n');
}
function pyToBlocks(ss: Stmt[]): BNode[] | null {
  const condOf = (e: Expr): BCond | null => {
    if (e.t === 'not' && e.e.t === 'sense' && e.e.n === 'at_goal') return 'not_at_goal';
    if (e.t === 'sense' && (e.n === 'path_ahead' || e.n === 'gap_ahead' || e.n === 'wall_ahead')) return e.n as BCond;
    return null;
  };
  const out: BNode[] = [];
  for (const s of ss) {
    if (s.k === 'cmd') out.push({ id: nid(), k: 'cmd', c: s.c });
    else if (s.k === 'pass') continue;
    else if (s.k === 'for' && s.n.t === 'num') { const b = pyToBlocks(s.body); if (!b) return null; out.push({ id: nid(), k: 'loop', n: s.n.v, body: b }); }
    else if ((s.k === 'while' || (s.k === 'if' && !s.orelse.length))) { const c = condOf(s.cond); const b = pyToBlocks(s.body); if (!c || !b) return null; out.push({ id: nid(), k: s.k, cond: c, body: b } as BNode); }
    else return null;
  }
  return out;
}

/* ============================================================================
 * 6) SPEICHERSTAND (localStorage)
 * ========================================================================== */
type SeasonId = 'none' | 'ramadan' | 'eidFitr' | 'eidAdha' | 'christmas' | 'easter' | 'halloween' | 'spring' | 'summer' | 'autumn' | 'winter';
type Region = 'europe' | 'mena' | 'turkey' | 'namerica' | 'samerica' | 'asia' | 'africa' | 'oceania';
const REGIONS: Region[] = ['europe', 'mena', 'turkey', 'namerica', 'samerica', 'asia', 'africa', 'oceania'];
interface Stats { levels: number; loops: number; whiles: number; python: number; defs: number; recursion: number; spins: number; bought: number; earned: number; threeStars: number; maxStreak: number }
interface Save {
  v: 1; lang: Lang; music: boolean; sound: boolean; vibe: boolean; region: Region; season: SeasonId | 'auto'; fast: boolean;
  crystals: number; stars: Record<string, number>[]; unlocked: number[];
  owned: string[]; hat: string; glasses: string; outfit: string;
  lastSpin: string; lastClaim: string; streak: number; achClaimed: string[]; stats: Stats; seenWorld: number;
}
const SAVE_KEY = 'sparky-code-abenteuer-v1';
const defaultLang = (): Lang => {
  try { const l = (navigator.language || 'de').slice(0, 2) as Lang; return LI[l] !== undefined ? l : 'de'; } catch { return 'de'; }
};
const freshSave = (): Save => ({
  v: 1, lang: defaultLang(), music: true, sound: true, vibe: true, region: 'europe', season: 'auto', fast: false,
  crystals: 50, stars: [{}, {}, {}, {}, {}], unlocked: [1, 1, 1, 1, 1],
  owned: ['hat_none', 'gl_goggles', 'out_scarf'], hat: 'hat_none', glasses: 'gl_goggles', outfit: 'out_scarf',
  lastSpin: '', lastClaim: '', streak: 0, achClaimed: [],
  stats: { levels: 0, loops: 0, whiles: 0, python: 0, defs: 0, recursion: 0, spins: 0, bought: 0, earned: 0, threeStars: 0, maxStreak: 0 }, seenWorld: 0,
});
function loadSave(): Save {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) { const s = JSON.parse(raw); const f = freshSave(); return { ...f, ...s, stats: { ...f.stats, ...(s.stats || {}) } }; }
  } catch { /* privat-Modus o. ä. */ }
  return freshSave();
}
function persist(s: Save) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch { /* ignorieren */ } }
const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dayDiff = (a: string, b: string) => Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / 86400000);
const worldStars = (s: Save, w: number) => Object.values(s.stars[w] || {}).reduce((a, b) => a + b, 0);
const totalStars = (s: Save) => [0, 1, 2, 3, 4].reduce((a, w) => a + worldStars(s, w), 0);

/* ============================================================================
 * 7) SAISON- & KULTUR-SYSTEM (offline, über Datum + Intl-Kalender)
 * ========================================================================== */
function hijriOf(date: Date): { m: number; d: number } {
  for (const cal of ['islamic-umalqura', 'islamic-civil', 'islamic']) {
    try {
      const f = new Intl.DateTimeFormat('en-u-ca-' + cal, { day: 'numeric', month: 'numeric', year: 'numeric' });
      if (!f.resolvedOptions().calendar.startsWith('islamic')) continue;
      const p = f.formatToParts(date); const m = +(p.find(x => x.type === 'month')?.value || 0), d = +(p.find(x => x.type === 'day')?.value || 0);
      if (m && d) return { m, d };
    } catch { /* nächster Kalender */ }
  }
  // Fallback: tabellarischer islamischer Kalender (Kuwait-Algorithmus)
  const jd = Math.floor(date.getTime() / 86400000) + 2440588; let l = jd - 1948440 + 10632; const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354; const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const m = Math.floor((24 * l) / 709); return { m, d: l - Math.floor((709 * m) / 24) };
}
function easterOf(y: number): Date {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1; return new Date(y, month - 1, day, 12);
}
function detectSeason(date: Date, region: Region): SeasonId {
  const h = hijriOf(date);
  if (h.m === 10 && h.d <= 3) return 'eidFitr';
  if (h.m === 12 && h.d >= 10 && h.d <= 13) return 'eidAdha';
  if (h.m === 9) return 'ramadan';
  const western = !['mena', 'turkey'].includes(region);
  const mo = date.getMonth(), dd = date.getDate();
  if (western) {
    if (mo === 11 && dd <= 26) return 'christmas';
    const e = easterOf(date.getFullYear()); const diff = (new Date(date.getFullYear(), mo, dd, 12).getTime() - e.getTime()) / 86400000;
    if (diff >= -7 && diff <= 1) return 'easter';
    if (mo === 9 && dd >= 20) return 'halloween';
  }
  const south = ['samerica', 'africa', 'oceania'].includes(region);
  const seasons: SeasonId[] = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];
  let s = seasons[mo];
  if (south) s = ({ winter: 'summer', summer: 'winter', spring: 'autumn', autumn: 'spring' } as Record<string, SeasonId>)[s];
  return s;
}
interface SeasonTheme { sky: string; particle: 'snow' | 'leaf' | 'blossom' | 'sun' | 'lantern' | 'confetti' | 'egg' | 'bat' | 'none'; accent: string; icon: React.ComponentType<{ className?: string }>; prop?: 'lantern' | 'santa' | 'pumpkin' | 'egg' }
const SEASONS: Record<SeasonId, SeasonTheme> = {
  none: { sky: 'from-sky-400 via-sky-300 to-indigo-300', particle: 'none', accent: 'from-violet-500 to-purple-700', icon: Sparkles },
  ramadan: { sky: 'from-indigo-950 via-violet-900 to-fuchsia-800', particle: 'lantern', accent: 'from-amber-400 to-orange-600', icon: Moon, prop: 'lantern' },
  eidFitr: { sky: 'from-violet-700 via-fuchsia-600 to-amber-400', particle: 'confetti', accent: 'from-amber-400 to-yellow-600', icon: Moon, prop: 'lantern' },
  eidAdha: { sky: 'from-emerald-700 via-teal-600 to-amber-300', particle: 'confetti', accent: 'from-emerald-400 to-teal-700', icon: Moon, prop: 'lantern' },
  christmas: { sky: 'from-blue-950 via-indigo-800 to-sky-500', particle: 'snow', accent: 'from-red-500 to-rose-700', icon: Snowflake, prop: 'santa' },
  easter: { sky: 'from-pink-300 via-sky-300 to-lime-200', particle: 'egg', accent: 'from-pink-400 to-fuchsia-600', icon: Flower2, prop: 'egg' },
  halloween: { sky: 'from-gray-950 via-purple-900 to-orange-600', particle: 'bat', accent: 'from-orange-500 to-amber-700', icon: Moon, prop: 'pumpkin' },
  spring: { sky: 'from-sky-400 via-cyan-200 to-pink-200', particle: 'blossom', accent: 'from-pink-400 to-rose-600', icon: Flower2 },
  summer: { sky: 'from-sky-500 via-sky-300 to-yellow-200', particle: 'sun', accent: 'from-yellow-400 to-orange-500', icon: Sun },
  autumn: { sky: 'from-sky-500 via-amber-200 to-orange-300', particle: 'leaf', accent: 'from-orange-400 to-red-600', icon: Leaf },
  winter: { sky: 'from-sky-600 via-sky-300 to-slate-100', particle: 'snow', accent: 'from-sky-400 to-blue-700', icon: Snowflake },
};
const SEASON_IDS = Object.keys(SEASONS) as SeasonId[];

/* ============================================================================
 * 8) AUDIO (Web Audio API – Arcade-Sound & Musik, keine Dateien nötig)
 * ========================================================================== */
type Sfx = 'tap' | 'move' | 'turn' | 'jump' | 'star' | 'key' | 'crash' | 'win' | 'fail' | 'coin' | 'tick' | 'unlock' | 'open';
class ArcadeAudio {
  ctx: AudioContext | null = null; master: GainNode | null = null; sfxOn = true; musicOn = true;
  private timer: number | null = null; private step = 0; private base = 60;
  ensure() {
    try {
      if (!this.ctx) {
        const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
        this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch { /* kein Audio */ }
  }
  private tone(f: number, dur: number, type: OscillatorType = 'square', vol = 0.12, at = 0, slide?: number) {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime + at; const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  }
  play(s: Sfx) {
    if (!this.sfxOn) return; this.ensure(); if (!this.ctx) return;
    switch (s) {
      case 'tap': this.tone(740, 0.06, 'square', 0.06); break;
      case 'move': this.tone(420, 0.09, 'triangle', 0.14, 0, 620); break;
      case 'turn': this.tone(520, 0.07, 'triangle', 0.1, 0, 380); break;
      case 'jump': this.tone(300, 0.22, 'square', 0.08, 0, 1000); break;
      case 'star': [988, 1319, 1760].forEach((f, i) => this.tone(f, 0.12, 'square', 0.07, i * 0.06)); break;
      case 'key': [660, 990, 1320].forEach((f, i) => this.tone(f, 0.1, 'triangle', 0.12, i * 0.05)); break;
      case 'open': this.tone(200, 0.25, 'sawtooth', 0.06, 0, 500); break;
      case 'crash': this.tone(180, 0.3, 'sawtooth', 0.12, 0, 60); break;
      case 'fail': [392, 330, 262].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.14, i * 0.14)); break;
      case 'win': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone(f, i === 5 ? 0.45 : 0.13, 'square', 0.08, i * 0.11)); break;
      case 'coin': this.tone(1320, 0.07, 'square', 0.07); this.tone(1760, 0.18, 'square', 0.07, 0.07); break;
      case 'tick': this.tone(1200, 0.03, 'square', 0.04); break;
      case 'unlock': [523, 784, 1047, 1568].forEach((f, i) => this.tone(f, 0.16, 'triangle', 0.12, i * 0.08)); break;
    }
  }
  setWorld(base: number) { this.base = base; }
  startMusic() {
    if (!this.musicOn || this.timer !== null) return; this.ensure(); if (!this.ctx) return;
    // fröhliche Pentatonik-Melodie im Arcade-Stil
    const scale = [0, 2, 4, 7, 9, 12, 14, 16];
    const mel = [0, 2, 4, 5, 4, 2, 3, 4, 5, 7, 5, 4, 2, 4, 1, 0, 2, 4, 5, 7, 6, 5, 4, 2, 3, 2, 1, 2, 4, 2, 0, -1];
    const bass = [0, 0, 7, 7, 5, 5, 7, 7];
    const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
    this.timer = window.setInterval(() => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const i = this.step++ % mel.length;
      if (mel[i] >= 0) this.tone(midi(this.base + 12 + scale[mel[i]]), 0.16, 'square', 0.025);
      if (i % 4 === 0) this.tone(midi(this.base - 12 + bass[(i / 4) % 8]), 0.3, 'triangle', 0.06);
      if (i % 2 === 1) this.tone(4000, 0.02, 'square', 0.006);
    }, 190);
  }
  stopMusic() { if (this.timer !== null) { clearInterval(this.timer); this.timer = null; } }
}
const audio = new ArcadeAudio();
let vibeOn = true;
const buzz = (ms: number | number[]) => { try { if (vibeOn && navigator.vibrate) navigator.vibrate(ms); } catch { /* */ } };

/* ============================================================================
 * 9) KOSTÜME, ERFOLGE, CODE-WISSEN
 * ========================================================================== */
interface Item { id: string; slot: 'hat' | 'glasses' | 'outfit'; name: ML; price: number }
const ITEMS: Item[] = [
  { id: 'hat_none', slot: 'hat', name: ['Ohne', 'None', 'Aucun', 'بدون', 'Yok', 'Ninguno', 'Nessuno'], price: 0 },
  { id: 'hat_crown', slot: 'hat', name: ['Krone', 'Crown', 'Couronne', 'تاج', 'Taç', 'Corona', 'Corona'], price: 120 },
  { id: 'hat_wizard', slot: 'hat', name: ['Zauberhut', 'Wizard hat', 'Chapeau de mage', 'قبعة ساحر', 'Büyücü şapkası', 'Sombrero de mago', 'Cappello da mago'], price: 90 },
  { id: 'hat_party', slot: 'hat', name: ['Partyhut', 'Party hat', 'Chapeau de fête', 'قبعة حفلة', 'Parti şapkası', 'Gorro de fiesta', 'Cappellino'], price: 40 },
  { id: 'hat_pirate', slot: 'hat', name: ['Piratenhut', 'Pirate hat', 'Chapeau pirate', 'قبعة قرصان', 'Korsan şapkası', 'Sombrero pirata', 'Cappello pirata'], price: 100 },
  { id: 'hat_cap', slot: 'hat', name: ['Basecap', 'Cap', 'Casquette', 'قبعة رياضية', 'Şapka', 'Gorra', 'Cappellino'], price: 50 },
  { id: 'hat_grad', slot: 'hat', name: ['Doktorhut', 'Grad cap', 'Toque', 'قبعة تخرج', 'Mezuniyet kepi', 'Birrete', 'Tocco'], price: 150 },
  { id: 'gl_goggles', slot: 'glasses', name: ['Fliegerbrille', 'Aviator goggles', 'Lunettes d’aviateur', 'نظارة طيار', 'Pilot gözlüğü', 'Gafas de piloto', 'Occhiali da pilota'], price: 0 },
  { id: 'gl_sun', slot: 'glasses', name: ['Sonnenbrille', 'Sunglasses', 'Lunettes de soleil', 'نظارة شمسية', 'Güneş gözlüğü', 'Gafas de sol', 'Occhiali da sole'], price: 60 },
  { id: 'gl_heart', slot: 'glasses', name: ['Herzbrille', 'Heart glasses', 'Lunettes cœur', 'نظارة قلوب', 'Kalp gözlük', 'Gafas corazón', 'Occhiali a cuore'], price: 80 },
  { id: 'gl_nerd', slot: 'glasses', name: ['Coder-Brille', 'Coder glasses', 'Lunettes de codeur', 'نظارة مبرمج', 'Kodcu gözlüğü', 'Gafas de coder', 'Occhiali da coder'], price: 70 },
  { id: 'gl_star', slot: 'glasses', name: ['Sternbrille', 'Star glasses', 'Lunettes étoile', 'نظارة نجوم', 'Yıldız gözlük', 'Gafas estrella', 'Occhiali stella'], price: 110 },
  { id: 'out_scarf', slot: 'outfit', name: ['Oranger Schal', 'Orange scarf', 'Écharpe orange', 'وشاح برتقالي', 'Turuncu atkı', 'Bufanda naranja', 'Sciarpa arancione'], price: 0 },
  { id: 'out_cape', slot: 'outfit', name: ['Helden-Umhang', 'Hero cape', 'Cape de héros', 'عباءة بطل', 'Kahraman pelerini', 'Capa de héroe', 'Mantello da eroe'], price: 130 },
  { id: 'out_lab', slot: 'outfit', name: ['Laborkittel', 'Lab coat', 'Blouse de labo', 'معطف مختبر', 'Laboratuvar önlüğü', 'Bata de laboratorio', 'Camice'], price: 140 },
  { id: 'out_space', slot: 'outfit', name: ['Raumanzug', 'Space suit', 'Combinaison spatiale', 'بدلة فضاء', 'Uzay giysisi', 'Traje espacial', 'Tuta spaziale'], price: 180 },
  { id: 'out_hoodie', slot: 'outfit', name: ['Neon-Hoodie', 'Neon hoodie', 'Sweat néon', 'هودي نيون', 'Neon kapüşonlu', 'Sudadera neón', 'Felpa neon'], price: 120 },
  { id: 'out_bow', slot: 'outfit', name: ['Fliege', 'Bow tie', 'Nœud papillon', 'ربطة فراشة', 'Papyon', 'Pajarita', 'Papillon'], price: 45 },
];

interface Ach { id: string; name: ML; desc: ML; goal: number; val: (s: Save) => number; reward: number; icon: React.ComponentType<{ className?: string }> }
const ACHS: Ach[] = [
  { id: 'first', icon: Flag, reward: 20, goal: 1, val: s => s.stats.levels, name: ['Erster Schritt', 'First step', 'Premier pas', 'الخطوة الأولى', 'İlk adım', 'Primer paso', 'Primo passo'], desc: ['Schaffe dein erstes Level', 'Finish your first level', 'Réussis ton premier niveau', 'أنهِ مستواك الأول', 'İlk seviyeni bitir', 'Supera tu primer nivel', 'Supera il primo livello'] },
  { id: 'ten', icon: Footprints, reward: 50, goal: 10, val: s => s.stats.levels, name: ['Weltenbummler', 'Explorer', 'Explorateur', 'مستكشف', 'Kaşif', 'Explorador', 'Esploratore'], desc: ['Schaffe 10 Level', 'Finish 10 levels', 'Réussis 10 niveaux', 'أنهِ 10 مستويات', '10 seviye bitir', 'Supera 10 niveles', 'Supera 10 livelli'] },
  { id: 'fifty', icon: Medal, reward: 150, goal: 50, val: s => s.stats.levels, name: ['Code-Held', 'Code hero', 'Héros du code', 'بطل البرمجة', 'Kod kahramanı', 'Héroe del código', 'Eroe del codice'], desc: ['Schaffe 50 Level', 'Finish 50 levels', 'Réussis 50 niveaux', 'أنهِ 50 مستوى', '50 seviye bitir', 'Supera 50 niveles', 'Supera 50 livelli'] },
  { id: 'stars100', icon: Star, reward: 100, goal: 100, val: totalStars, name: ['Sternensammler', 'Star collector', 'Collectionneur d’étoiles', 'جامع النجوم', 'Yıldız toplayıcı', 'Coleccionista', 'Collezionista'], desc: ['Sammle 100 Sterne', 'Collect 100 stars', 'Récolte 100 étoiles', 'اجمع 100 نجمة', '100 yıldız topla', 'Consigue 100 estrellas', 'Raccogli 100 stelle'] },
  { id: 'perfect', icon: Crown, reward: 80, goal: 10, val: s => s.stats.threeStars, name: ['Perfektionist', 'Perfectionist', 'Perfectionniste', 'المثالي', 'Mükemmeliyetçi', 'Perfeccionista', 'Perfezionista'], desc: ['10 Level mit 3 Sternen', '10 levels with 3 stars', '10 niveaux à 3 étoiles', '10 مستويات بـ3 نجوم', '3 yıldızlı 10 seviye', '10 niveles con 3 estrellas', '10 livelli a 3 stelle'] },
  { id: 'loop', icon: Repeat, reward: 30, goal: 1, val: s => s.stats.loops, name: ['Im Kreis', 'Round and round', 'En boucle', 'في دوائر', 'Döngü ustası', 'En bucle', 'In loop'], desc: ['Gewinne mit einer Schleife', 'Win using a loop', 'Gagne avec une boucle', 'افز باستخدام حلقة', 'Döngüyle kazan', 'Gana con un bucle', 'Vinci con un ciclo'] },
  { id: 'while', icon: RefreshCw, reward: 40, goal: 1, val: s => s.stats.whiles, name: ['Selbstdenker', 'Self-thinker', 'Penseur', 'المفكر', 'Düşünür', 'Pensador', 'Pensatore'], desc: ['Gewinne mit while', 'Win using while', 'Gagne avec while', 'افز باستخدام while', 'while ile kazan', 'Gana con while', 'Vinci con while'] },
  { id: 'python', icon: Code2, reward: 40, goal: 5, val: s => s.stats.python, name: ['Pythonista', 'Pythonista', 'Pythonista', 'خبير بايثون', 'Pythoncu', 'Pythonista', 'Pythonista'], desc: ['5 Siege mit Live-Code', '5 wins with Live Code', '5 victoires en code live', '5 انتصارات بالكود المباشر', 'Canlı kodla 5 zafer', '5 victorias con código', '5 vittorie col codice'] },
  { id: 'def', icon: GitBranch, reward: 50, goal: 1, val: s => s.stats.defs, name: ['Makro-Meister', 'Macro master', 'Maître des macros', 'سيد الدوال', 'Makro ustası', 'Maestro de macros', 'Maestro delle macro'], desc: ['Gewinne mit def', 'Win using def', 'Gagne avec def', 'افز باستخدام def', 'def ile kazan', 'Gana con def', 'Vinci con def'] },
  { id: 'rec', icon: Brain, reward: 120, goal: 1, val: s => s.stats.recursion, name: ['Rekursions-Guru', 'Recursion guru', 'Gourou récursif', 'معلم التكرار الذاتي', 'Özyineleme gurusu', 'Gurú recursivo', 'Guru ricorsivo'], desc: ['Gewinne mit Rekursion', 'Win using recursion', 'Gagne par récursion', 'افز بالاستدعاء الذاتي', 'Özyinelemeyle kazan', 'Gana con recursión', 'Vinci con la ricorsione'] },
  { id: 'endless', icon: InfinityIcon, reward: 100, goal: 16, val: s => Math.max(...s.unlocked), name: ['Ins Unendliche', 'To infinity', 'Vers l’infini', 'إلى ما لا نهاية', 'Sonsuza', 'Al infinito', 'All’infinito'], desc: ['Erreiche Level 16 (Endlos)', 'Reach level 16 (endless)', 'Atteins le niveau 16', 'صل إلى المستوى 16', 'Seviye 16’ya ulaş', 'Llega al nivel 16', 'Raggiungi il livello 16'] },
  { id: 'spin', icon: Gift, reward: 20, goal: 5, val: s => s.stats.spins, name: ['Glückspilz', 'Lucky one', 'Chanceux', 'المحظوظ', 'Şanslı', 'Afortunado', 'Fortunato'], desc: ['Drehe 5× am Glücksrad', 'Spin the wheel 5 times', 'Tourne la roue 5 fois', 'أدر العجلة 5 مرات', 'Çarkı 5 kez çevir', 'Gira la ruleta 5 veces', 'Gira la ruota 5 volte'] },
  { id: 'streak', icon: CalendarDays, reward: 100, goal: 7, val: s => s.stats.maxStreak, name: ['Treue Seele', 'Loyal friend', 'Fidèle', 'الصديق الوفي', 'Sadık dost', 'Amigo fiel', 'Amico fedele'], desc: ['7 Tage in Folge', '7 days in a row', '7 jours d’affilée', '7 أيام متتالية', 'Üst üste 7 gün', '7 días seguidos', '7 giorni di fila'] },
  { id: 'fashion', icon: Shirt, reward: 40, goal: 3, val: s => s.stats.bought, name: ['Modeprofi', 'Fashionista', 'Fashionista', 'خبير الموضة', 'Moda ikonu', 'Fashionista', 'Fashionista'], desc: ['Kaufe 3 Kostüm-Teile', 'Buy 3 outfit items', 'Achète 3 accessoires', 'اشترِ 3 قطع', '3 kostüm parçası al', 'Compra 3 prendas', 'Compra 3 accessori'] },
  { id: 'allworlds', icon: Globe, reward: 80, goal: 5, val: s => s.stars.filter(w => Object.keys(w).length > 0).length, name: ['Weltreisender', 'World traveller', 'Globe-trotteur', 'رحالة العوالم', 'Dünya gezgini', 'Trotamundos', 'Giramondo'], desc: ['Spiele in allen 5 Welten', 'Play all 5 worlds', 'Joue dans les 5 mondes', 'العب في العوالم الخمسة', '5 dünyanın hepsinde oyna', 'Juega los 5 mundos', 'Gioca in tutti i 5 mondi'] },
];

interface KCard { id: string; w: number; l: number; icon: React.ComponentType<{ className?: string }>; color: string; name: ML; desc: ML; code: string }
const KCARDS: KCard[] = [
  { id: 'seq', w: 0, l: 1, icon: ArrowUp, color: 'from-lime-400 to-green-600', code: 'move_forward()\nmove_forward()', name: ['Sequenz', 'Sequence', 'Séquence', 'التسلسل', 'Sıralama', 'Secuencia', 'Sequenza'], desc: ['Befehle laufen der Reihe nach ab.', 'Commands run one after another.', 'Les commandes s’exécutent dans l’ordre.', 'تُنفَّذ الأوامر بالترتيب.', 'Komutlar sırayla çalışır.', 'Los comandos se ejecutan en orden.', 'I comandi si eseguono in ordine.'] },
  { id: 'turn', w: 0, l: 4, icon: RotateCw, color: 'from-emerald-400 to-teal-600', code: 'turn_right()\nmove_forward()', name: ['Richtung', 'Direction', 'Direction', 'الاتجاه', 'Yön', 'Dirección', 'Direzione'], desc: ['Drehen ändert, wohin Sparky schaut.', 'Turning changes where Sparky faces.', 'Tourner change la direction de Sparky.', 'الدوران يغيّر اتجاه سباركي.', 'Dönmek Sparky’nin yönünü değiştirir.', 'Girar cambia hacia dónde mira Sparky.', 'Girare cambia la direzione di Sparky.'] },
  { id: 'jump', w: 0, l: 9, icon: ChevronsUp, color: 'from-yellow-400 to-orange-600', code: 'jump()', name: ['Springen', 'Jumping', 'Sauter', 'القفز', 'Zıplama', 'Saltar', 'Saltare'], desc: ['Ein Sprung überquert genau ein Feld.', 'A jump crosses exactly one tile.', 'Un saut franchit une case.', 'القفزة تعبر مربعًا واحدًا.', 'Zıplama tam bir kareyi geçer.', 'Un salto cruza una casilla.', 'Un salto supera una casella.'] },
  { id: 'loop', w: 1, l: 1, icon: Repeat, color: 'from-sky-400 to-blue-700', code: 'for i in range(4):\n    move_forward()', name: ['Schleife', 'Loop', 'Boucle', 'الحلقة', 'Döngü', 'Bucle', 'Ciclo'], desc: ['Wiederholt Befehle – spart Code!', 'Repeats commands – saves code!', 'Répète des commandes !', 'تكرر الأوامر – توفر الكود!', 'Komutları tekrarlar!', '¡Repite comandos!', 'Ripete i comandi!'] },
  { id: 'state', w: 1, l: 3, icon: Key, color: 'from-amber-300 to-yellow-600', code: 'if has_key():\n    move_forward()', name: ['Zustand', 'State', 'État', 'الحالة', 'Durum', 'Estado', 'Stato'], desc: ['Der Schlüssel ändert, was möglich ist.', 'The key changes what is possible.', 'La clé change ce qui est possible.', 'المفتاح يغيّر ما هو ممكن.', 'Anahtar neyin mümkün olduğunu değiştirir.', 'La llave cambia lo posible.', 'La chiave cambia ciò che è possibile.'] },
  { id: 'nested', w: 2, l: 1, icon: Blocks, color: 'from-violet-400 to-indigo-700', code: 'for i in range(2):\n    for j in range(3):\n        move_forward()\n    turn_right()', name: ['Verschachtelt', 'Nested loops', 'Boucles imbriquées', 'حلقات متداخلة', 'İç içe döngü', 'Bucles anidados', 'Cicli annidati'], desc: ['Eine Schleife in einer Schleife.', 'A loop inside a loop.', 'Une boucle dans une boucle.', 'حلقة داخل حلقة.', 'Döngü içinde döngü.', 'Un bucle dentro de otro.', 'Un ciclo dentro un ciclo.'] },
  { id: 'if', w: 2, l: 3, icon: GitBranch, color: 'from-pink-400 to-rose-600', code: 'if path_ahead():\n    move_forward()\nelse:\n    jump()', name: ['Bedingung', 'Condition', 'Condition', 'الشرط', 'Koşul', 'Condición', 'Condizione'], desc: ['Wenn … dann … sonst.', 'If … then … else.', 'Si … alors … sinon.', 'إذا … وإلا …', 'Eğer … değilse …', 'Si … si no …', 'Se … altrimenti …'] },
  { id: 'def', w: 2, l: 6, icon: Zap, color: 'from-orange-400 to-red-600', code: 'def zickzack():\n    move_forward()\n    turn_left()\nzickzack()', name: ['Makro / Funktion', 'Macro / function', 'Macro / fonction', 'دالة', 'Makro / fonksiyon', 'Macro / función', 'Macro / funzione'], desc: ['Gib Befehlsgruppen einen Namen.', 'Give groups of commands a name.', 'Nomme un groupe de commandes.', 'أعطِ مجموعة أوامر اسمًا.', 'Komut grubuna isim ver.', 'Ponle nombre a varios comandos.', 'Dai un nome a un gruppo di comandi.'] },
  { id: 'var', w: 3, l: 1, icon: Variable, color: 'from-cyan-400 to-sky-700', code: 'n = 3\nfor i in range(n):\n    jump()', name: ['Variable', 'Variable', 'Variable', 'المتغيّر', 'Değişken', 'Variable', 'Variabile'], desc: ['Ein Name, der sich einen Wert merkt.', 'A name that stores a value.', 'Un nom qui retient une valeur.', 'اسم يحفظ قيمة.', 'Değer saklayan bir isim.', 'Un nombre que guarda un valor.', 'Un nome che ricorda un valore.'] },
  { id: 'while', w: 3, l: 1, icon: RefreshCw, color: 'from-fuchsia-400 to-purple-700', code: 'while not at_goal():\n    move_forward()', name: ['While-Schleife', 'While loop', 'Boucle while', 'حلقة while', 'While döngüsü', 'Bucle while', 'Ciclo while'], desc: ['Wiederholt, solange etwas gilt.', 'Repeats as long as something is true.', 'Répète tant que c’est vrai.', 'تكرر طالما الشرط صحيح.', 'Koşul doğruyken tekrarlar.', 'Repite mientras sea verdad.', 'Ripete finché è vero.'] },
  { id: 'logic', w: 3, l: 5, icon: Cpu, color: 'from-teal-400 to-emerald-700', code: 'if gap_ahead() or wall_ahead():\n    jump()', name: ['Logik-Gatter', 'Logic gates', 'Portes logiques', 'البوابات المنطقية', 'Mantık kapıları', 'Puertas lógicas', 'Porte logiche'], desc: ['and, or, not verknüpfen Bedingungen.', 'and, or, not combine conditions.', 'and, or, not combinent des conditions.', 'and و or و not تربط الشروط.', 'and, or, not koşulları birleştirir.', 'and, or, not combinan condiciones.', 'and, or, not combinano condizioni.'] },
  { id: 'reg', w: 4, l: 1, icon: Cpu, color: 'from-blue-400 to-indigo-800', code: 'r1 = 0\nwhile path_ahead():\n    move_forward()\n    r1 += 1', name: ['Register', 'Registers', 'Registres', 'السجلات', 'Yazmaçlar', 'Registros', 'Registri'], desc: ['Zähler im Speicher – wie in einer CPU.', 'Counters in memory – like a CPU.', 'Des compteurs en mémoire, comme un CPU.', 'عدّادات في الذاكرة مثل المعالج.', 'Bellekte sayaçlar – CPU gibi.', 'Contadores en memoria, como una CPU.', 'Contatori in memoria, come una CPU.'] },
  { id: 'rec', w: 4, l: 1, icon: Atom, color: 'from-cyan-300 to-blue-800', code: 'def go():\n    if not at_goal():\n        move_forward()\n        go()\ngo()', name: ['Rekursion', 'Recursion', 'Récursion', 'الاستدعاء الذاتي', 'Özyineleme', 'Recursión', 'Ricorsione'], desc: ['Eine Funktion ruft sich selbst auf.', 'A function calls itself.', 'Une fonction s’appelle elle-même.', 'دالة تستدعي نفسها.', 'Fonksiyon kendini çağırır.', 'Una función se llama a sí misma.', 'Una funzione chiama se stessa.'] },
];

/* ============================================================================
 * 10) DESIGN-SYSTEM: globale Styles, 3D-Buttons, Panels, Banner
 * ========================================================================== */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@700;900&display=swap');
.font-game{font-family:'Lilita One','Nunito',system-ui,sans-serif;letter-spacing:.02em}
.font-ui{font-family:'Nunito',system-ui,sans-serif}
.font-code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.txt-o{-webkit-text-stroke:5px #1e1240;paint-order:stroke fill}
.txt-o-sm{-webkit-text-stroke:3px #1e1240;paint-order:stroke fill}
.txt-o-xs{-webkit-text-stroke:2px rgba(20,10,50,.85);paint-order:stroke fill}
.gloss{position:relative;overflow:hidden}
.gloss:before{content:'';position:absolute;left:6%;right:6%;top:5%;height:42%;border-radius:999px;background:linear-gradient(to bottom,rgba(255,255,255,.55),rgba(255,255,255,.05));pointer-events:none}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes bob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.06)}}
@keyframes drift{from{transform:translateX(-30vw)}to{transform:translateX(130vw)}}
@keyframes fall{0%{transform:translateY(-10vh) rotate(0)}100%{transform:translateY(110vh) rotate(540deg)}}
@keyframes sway{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes fly{0%{transform:translate(-20vw,0)}50%{transform:translate(50vw,-6vh)}100%{transform:translate(120vw,4vh)}}
@keyframes spinslow{to{transform:rotate(360deg)}}
@keyframes pop{0%{transform:scale(.4);opacity:0}70%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-34px)}}
@keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes glow{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes shine{0%{transform:translateX(-120%) skewX(-20deg)}100%{transform:translateX(220%) skewX(-20deg)}}
.a-float{animation:floaty 3.2s ease-in-out infinite}
.a-bob{animation:bob 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.a-sway{animation:sway 3s ease-in-out infinite;transform-origin:top center}
.a-pop{animation:pop .45s cubic-bezier(.2,1.4,.4,1) both}
.a-shake{animation:shake .25s ease-in-out 2}
.a-hop{animation:hop .36s ease-out}
.a-twinkle{animation:twinkle 2s ease-in-out infinite}
.a-glow{animation:glow 1.8s ease-in-out infinite}
.a-spin{animation:spinslow 22s linear infinite}
.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}
.code-area{caret-color:#fde047;-webkit-text-fill-color:transparent}
.code-area::selection{background:rgba(250,204,21,.35)}
`;
function GlobalStyle() { return <style>{GLOBAL_CSS}</style>; }

type BtnColor = 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'pink' | 'gray' | 'yellow' | 'cyan';
const BTN: Record<BtnColor, string> = {
  green: 'from-lime-300 via-green-500 to-green-700',
  blue: 'from-sky-300 via-blue-500 to-blue-700',
  orange: 'from-amber-300 via-orange-500 to-orange-700',
  purple: 'from-fuchsia-400 via-violet-600 to-purple-800',
  red: 'from-rose-300 via-red-500 to-red-700',
  pink: 'from-pink-300 via-pink-500 to-fuchsia-700',
  gray: 'from-slate-300 via-slate-500 to-slate-700',
  yellow: 'from-yellow-200 via-yellow-400 to-amber-600',
  cyan: 'from-cyan-200 via-cyan-500 to-teal-700',
};
function Btn3D({ color = 'green', children, onClick, className = '', disabled, small, title }: { color?: BtnColor; children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean; small?: boolean; title?: string }) {
  return (
    <button title={title} disabled={disabled} onClick={() => { if (disabled) return; audio.play('tap'); buzz(8); onClick?.(); }}
      className={`gloss select-none font-game text-white txt-o-sm bg-gradient-to-b ${BTN[color]} border-4 border-slate-900/80 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.45)] active:translate-y-1 active:shadow-none transition-transform ${small ? 'px-4 py-1.5 text-lg' : 'px-6 py-2.5 text-2xl'} ${disabled ? 'opacity-50 grayscale' : 'hover:brightness-110'} ${className}`}>
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
function IconBtn({ children, onClick, color = 'blue', className = '', badge, title }: { children: React.ReactNode; onClick?: () => void; color?: BtnColor; className?: string; badge?: boolean; title?: string }) {
  return (
    <button title={title} aria-label={title} onClick={() => { audio.play('tap'); buzz(8); onClick?.(); }}
      className={`gloss relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-gradient-to-b ${BTN[color]} border-4 border-slate-900/80 shadow-[0_5px_0_rgba(0,0,0,0.45)] active:translate-y-1 active:shadow-none text-white flex items-center justify-center ${className}`}>
      <span className="relative drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">{children}</span>
      {badge && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 border-2 border-white animate-pulse" />}
    </button>
  );
}
function Panel({ children, className = '', tone = 'violet' }: { children: React.ReactNode; className?: string; tone?: 'violet' | 'blue' | 'dark' | 'gold' | 'green' }) {
  const tones = {
    violet: 'from-violet-500 via-purple-600 to-indigo-800', blue: 'from-sky-400 via-blue-600 to-indigo-800',
    dark: 'from-slate-800 via-slate-900 to-slate-950', gold: 'from-amber-300 via-orange-500 to-orange-700', green: 'from-lime-400 via-green-600 to-emerald-800',
  };
  return <div className={`rounded-3xl border-4 border-slate-900/80 bg-gradient-to-b ${tones[tone]} shadow-[0_8px_0_rgba(0,0,0,0.4)] ${className}`}>{children}</div>;
}
function Ribbon({ text, sub, color = 'from-violet-500 to-purple-800', small }: { text: string; sub?: string; color?: string; small?: boolean }) {
  return (
    <div className="relative flex flex-col items-center a-pop">
      <div className="relative">
        <div className={`absolute -left-5 top-3 bottom-1 w-10 bg-gradient-to-b from-amber-400 to-orange-600 border-4 border-slate-900/80 rounded-l-xl -z-0 skew-y-6`} />
        <div className={`absolute -right-5 top-3 bottom-1 w-10 bg-gradient-to-b from-amber-400 to-orange-600 border-4 border-slate-900/80 rounded-r-xl -z-0 -skew-y-6`} />
        <div className={`gloss relative z-10 bg-gradient-to-b ${color} border-4 border-amber-300 outline outline-4 outline-slate-900/80 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.4)] ${small ? 'px-5 py-1' : 'px-7 py-1.5'}`}>
          <h1 className={`relative font-game text-white txt-o text-center leading-tight ${small ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'}`}>{text}</h1>
        </div>
      </div>
      {sub && <div className="relative z-10 -mt-1 px-5 py-1 rounded-full bg-gradient-to-b from-violet-600 to-indigo-800 border-4 border-amber-300 outline outline-2 outline-slate-900/70 shadow-[0_4px_0_rgba(0,0,0,0.35)]"><p className="font-game text-amber-100 txt-o-xs text-sm sm:text-lg text-center">{sub}</p></div>}
    </div>
  );
}
function Counter({ icon, value, color = 'from-indigo-700 to-indigo-950' }: { icon: React.ReactNode; value: React.ReactNode; color?: string }) {
  return (
    <div dir="ltr" className={`flex items-center h-10 sm:h-12 pl-1 pr-3 rounded-full bg-gradient-to-b ${color} border-4 border-slate-900/80 shadow-[0_4px_0_rgba(0,0,0,0.35)]`}>
      <span className="-ml-3 drop-shadow-[0_3px_0_rgba(0,0,0,0.4)]">{icon}</span>
      <span className="ml-1 font-game text-white txt-o-xs text-lg sm:text-2xl tabular-nums">{value}</span>
    </div>
  );
}
const StarIcon = ({ className = 'w-10 h-10', on = true }: { className?: string; on?: boolean }) => (
  <svg viewBox="0 0 48 48" className={className}><path d="M24 3l6.2 13 14.3 1.8-10.5 9.9 2.7 14.1L24 34.8 11.3 41.8 14 27.7 3.5 17.8 17.8 16z" fill={on ? 'url(#gStar)' : '#64748b'} stroke="#1e1240" strokeWidth="3.5" strokeLinejoin="round" /><path d="M17 17l5-1 2-6" stroke="#fff" strokeOpacity={on ? 0.8 : 0.3} strokeWidth="3" fill="none" strokeLinecap="round" />
    <defs><linearGradient id="gStar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff59d" /><stop offset=".5" stopColor="#facc15" /><stop offset="1" stopColor="#f59e0b" /></linearGradient></defs></svg>
);
const GemIcon = ({ className = 'w-10 h-10' }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className}><path d="M12 6h24l9 12-21 25L3 18z" fill="url(#gGem)" stroke="#1e1240" strokeWidth="3.5" strokeLinejoin="round" /><path d="M3 18h42M17 6l-3 12 10 25 10-25-3-12" stroke="#1e1240" strokeOpacity=".35" strokeWidth="2" fill="none" /><path d="M14 10l-4 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    <defs><linearGradient id="gGem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a5f3fc" /><stop offset=".5" stopColor="#22d3ee" /><stop offset="1" stopColor="#7c3aed" /></linearGradient></defs></svg>
);
function Flag3({ colors, className = 'w-10 h-10' }: { colors: string[]; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className}><defs><clipPath id={'fc' + colors.join('')}><circle cx="20" cy="20" r="17" /></clipPath></defs>
      <g clipPath={`url(#fc${colors.join('')})`}>{colors.map((c, i) => <rect key={i} x="0" y={i * 13.4} width="40" height="13.6" fill={c} />)}</g>
      <circle cx="20" cy="20" r="17" fill="none" stroke="#1e1240" strokeWidth="3.5" /><ellipse cx="14" cy="11" rx="6" ry="3" fill="#fff" opacity=".5" /></svg>
  );
}
/** Runde Länderflagge je Sprache (Arabisch = Saudi-Arabien) */
function FlagIcon({ id, className = 'w-10 h-10' }: { id: Lang; className?: string }) {
  const cid = 'flag-' + id;
  const body: Record<Lang, React.ReactNode> = {
    de: <><rect width="40" height="13.4" fill="#000" /><rect y="13.3" width="40" height="13.4" fill="#dd0000" /><rect y="26.6" width="40" height="13.4" fill="#ffce00" /></>,
    en: <><rect width="40" height="40" fill="#012169" /><path d="M0 0L40 40M40 0L0 40" stroke="#fff" strokeWidth="8" /><path d="M0 0L40 40M40 0L0 40" stroke="#c8102e" strokeWidth="3" /><path d="M20 0V40M0 20H40" stroke="#fff" strokeWidth="11" /><path d="M20 0V40M0 20H40" stroke="#c8102e" strokeWidth="6.5" /></>,
    fr: <><rect width="13.4" height="40" fill="#0055a4" /><rect x="13.3" width="13.4" height="40" fill="#fff" /><rect x="26.6" width="13.4" height="40" fill="#ef4135" /></>,
    ar: <><rect width="40" height="40" fill="#006c35" />
      <text x="20" y="20" textAnchor="middle" fontSize="7.5" fill="#fff" fontFamily="'Noto Naskh Arabic','Amiri','Segoe UI',sans-serif" direction="rtl">لا إله إلا الله</text>
      <path d="M9 25.5 H29 l3 -1.2 l-3 -1 H11.5 v-1.6 h-2.5 v1.6 H8 v2.2 z" fill="#fff" /></>,
    tr: <><rect width="40" height="40" fill="#e30a17" /><circle cx="17" cy="20" r="8" fill="#fff" /><circle cx="19" cy="20" r="6.4" fill="#e30a17" /><path d="M24.5 20 l5.8 -1.9 -3.6 4.9 0 -6 3.6 4.9z" fill="#fff" /></>,
    es: <><rect width="40" height="40" fill="#aa151b" /><rect y="10" width="40" height="20" fill="#f1bf00" /></>,
    it: <><rect width="13.4" height="40" fill="#009246" /><rect x="13.3" width="13.4" height="40" fill="#fff" /><rect x="26.6" width="13.4" height="40" fill="#ce2b37" /></>,
  };
  return (
    <svg viewBox="0 0 40 40" className={className}><defs><clipPath id={cid}><circle cx="20" cy="20" r="17" /></clipPath></defs>
      <g clipPath={`url(#${cid})`}>{body[id]}</g>
      <circle cx="20" cy="20" r="17" fill="none" stroke="#1e1240" strokeWidth="3.5" /><ellipse cx="14" cy="11" rx="6" ry="3" fill="#fff" opacity=".35" /></svg>
  );
}

/* ============================================================================
 * 11) SPARKY – der violette Drache mit Fliegerbrille, Kopfhörern und Schal
 * ========================================================================== */
interface SparkyLook { hat?: string; glasses?: string; outfit?: string; prop?: SeasonTheme['prop']; mood?: 'happy' | 'wow' | 'sad' }
function Sparky({ look = {}, className = 'w-40 h-40', flip, box }: { look?: SparkyLook; className?: string; flip?: boolean; box?: [number, number, number] }) {
  const { hat = 'hat_none', glasses = 'gl_goggles', outfit = 'out_scarf', prop, mood = 'happy' } = look;
  const O = '#2a0f5c'; const SW = 4;
  const showHat = hat !== 'hat_none' ? hat : prop === 'santa' ? 'hat_santa' : 'hat_none';
  return (
    <svg viewBox="0 0 200 200" overflow="visible" className={box ? undefined : className} {...(box ? { x: box[0], y: box[1], width: box[2], height: box[2] } : {})} style={flip && !box ? { transform: 'scaleX(-1)' } : undefined}>
      <g transform={flip && box ? 'translate(200 0) scale(-1 1)' : undefined}>
      <defs>
        <radialGradient id="spBody" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#c4b5fd" /><stop offset=".45" stopColor="#8b5cf6" /><stop offset="1" stopColor="#6d28d9" /></radialGradient>
        <linearGradient id="spBelly" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fef3c7" /><stop offset="1" stopColor="#fbbf24" /></linearGradient>
        <linearGradient id="spWing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f0abfc" /><stop offset="1" stopColor="#a21caf" /></linearGradient>
        <linearGradient id="spScarf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fdba74" /><stop offset="1" stopColor="#ea580c" /></linearGradient>
        <radialGradient id="spLens" cx=".35" cy=".35" r=".7"><stop offset="0" stopColor="#e0f2fe" /><stop offset=".5" stopColor="#38bdf8" /><stop offset="1" stopColor="#0369a1" /></radialGradient>
      </defs>
      {/* Umhang hinter dem Körper */}
      {outfit === 'out_cape' && <path d="M66 112 C40 150 46 186 62 192 L138 192 C154 186 160 150 134 112 Z" fill="#dc2626" stroke={O} strokeWidth={SW} strokeLinejoin="round" />}
      {/* Schwanz */}
      <path d="M128 150 C162 160 182 140 178 112 L170 120 C168 138 152 146 126 136 Z" fill="url(#spBody)" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M176 104 L186 116 L172 122 Z" fill="#fb923c" stroke={O} strokeWidth="3" strokeLinejoin="round" />
      {/* Flügel */}
      <path d="M70 116 C44 82 20 90 14 112 C26 108 32 116 28 126 C40 118 50 126 50 136 Z" fill="url(#spWing)" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M130 116 C156 82 180 90 186 112 C174 108 168 116 172 126 C160 118 150 126 150 136 Z" fill="url(#spWing)" stroke={O} strokeWidth={SW} strokeLinejoin="round" />
      {/* Füße */}
      <ellipse cx="78" cy="180" rx="16" ry="10" fill="url(#spBody)" stroke={O} strokeWidth={SW} />
      <ellipse cx="122" cy="180" rx="16" ry="10" fill="url(#spBody)" stroke={O} strokeWidth={SW} />
      <path d="M68 182h4M76 184h4M118 184h4M126 182h4" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {/* Körper + Bauch */}
      <ellipse cx="100" cy="144" rx="42" ry="38" fill="url(#spBody)" stroke={O} strokeWidth={SW} />
      <ellipse cx="100" cy="150" rx="26" ry="28" fill="url(#spBelly)" stroke={O} strokeWidth="3" />
      <path d="M80 140 Q100 146 120 140 M78 154 Q100 160 122 154 M82 167 Q100 172 118 167" stroke="#d97706" strokeWidth="2.5" fill="none" />
      {/* Outfits über dem Körper */}
      {outfit === 'out_lab' && <g stroke={O} strokeWidth="3" strokeLinejoin="round"><path d="M60 128 C58 160 64 178 78 182 L92 182 L92 118 L72 112 Z" fill="#f8fafc" /><path d="M140 128 C142 160 136 178 122 182 L108 182 L108 118 L128 112 Z" fill="#f8fafc" /><rect x="114" y="140" width="14" height="10" rx="2" fill="#e2e8f0" /><path d="M118 138 v-6" stroke="#2563eb" strokeWidth="3" /></g>}
      {outfit === 'out_space' && <g stroke={O} strokeWidth="3"><path d="M60 136 C60 112 140 112 140 136 L140 168 C140 184 60 184 60 168 Z" fill="#f1f5f9" /><rect x="84" y="136" width="32" height="22" rx="6" fill="#38bdf8" /><circle cx="92" cy="147" r="3" fill="#ef4444" /><circle cx="108" cy="147" r="3" fill="#facc15" /><path d="M64 160 h16 M120 160 h16" stroke="#f97316" strokeWidth="5" /></g>}
      {outfit === 'out_hoodie' && <g stroke={O} strokeWidth="3"><path d="M60 140 C60 112 140 112 140 140 L138 172 C130 184 70 184 62 172 Z" fill="#ec4899" /><path d="M86 150 h28 v14 h-28 z" fill="#db2777" /><path d="M92 120 v18 M108 120 v18" stroke="#22d3ee" strokeWidth="3" /></g>}
      {/* Arme */}
      <ellipse cx="62" cy="140" rx="10" ry="15" transform="rotate(25 62 140)" fill="url(#spBody)" stroke={O} strokeWidth={SW} />
      <ellipse cx="138" cy="140" rx="10" ry="15" transform="rotate(-25 138 140)" fill="url(#spBody)" stroke={O} strokeWidth={SW} />
      {/* Saison-Gegenstand in der Hand */}
      {prop === 'lantern' && <g transform="translate(140 118)"><path d="M10 0 v8" stroke={O} strokeWidth="3" /><path d="M2 10 h16 l3 6 v18 l-3 6 h-16 l-3 -6 v-18 z" fill="#fbbf24" stroke={O} strokeWidth="3" /><rect x="5" y="17" width="10" height="16" rx="3" fill="#fef08a" className="a-glow" /><path d="M10 10 l-6 -6 h12 z" fill="#f59e0b" stroke={O} strokeWidth="2" /></g>}
      {prop === 'pumpkin' && <g transform="translate(138 130)"><ellipse cx="12" cy="14" rx="15" ry="12" fill="#f97316" stroke={O} strokeWidth="3" /><path d="M12 2 v-6" stroke="#15803d" strokeWidth="4" /><path d="M4 12 l4 -3 l2 4 M16 12 l4 -3 l2 4 M6 18 q6 4 12 0" stroke={O} strokeWidth="2.5" fill="#fde047" /></g>}
      {prop === 'egg' && <g transform="translate(140 126)"><ellipse cx="10" cy="14" rx="11" ry="14" fill="#a78bfa" stroke={O} strokeWidth="3" /><path d="M0 12 q5 -4 10 0 t10 0" stroke="#fde047" strokeWidth="3" fill="none" /><circle cx="7" cy="20" r="2.5" fill="#f472b6" /><circle cx="14" cy="21" r="2.5" fill="#34d399" /></g>}
      {/* Schal / Fliege */}
      {(outfit === 'out_scarf' || outfit === 'out_cape') && <g stroke={O} strokeWidth="3.5" strokeLinejoin="round">
        <path d="M60 110 C80 124 120 124 140 110 L142 122 C120 136 80 136 58 122 Z" fill={outfit === 'out_cape' ? '#fbbf24' : 'url(#spScarf)'} />
        {outfit === 'out_scarf' && <path d="M116 124 L134 160 L120 162 L112 168 L104 128 Z" fill="url(#spScarf)" />}
      </g>}
      {outfit === 'out_bow' && <g stroke={O} strokeWidth="3" strokeLinejoin="round"><path d="M100 120 L80 110 L80 132 Z M100 120 L120 110 L120 132 Z" fill="#ef4444" /><circle cx="100" cy="121" r="6" fill="#b91c1c" /></g>}
      {outfit === 'out_lab' && <path d="M80 112 L100 128 L120 112" stroke={O} strokeWidth="3" fill="#f8fafc" />}
      {/* Kopfhörer-Bügel */}
      <path d="M46 80 C40 18 160 18 154 80" stroke="#1f2937" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M46 80 C40 18 160 18 154 80" stroke="#475569" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Hörner */}
      <path d="M70 44 L60 14 L84 36 Z" fill="#fb923c" stroke={O} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M130 44 L140 14 L116 36 Z" fill="#fb923c" stroke={O} strokeWidth="3.5" strokeLinejoin="round" />
      {/* Kopf */}
      <ellipse cx="100" cy="76" rx="54" ry="46" fill="url(#spBody)" stroke={O} strokeWidth={SW} />
      <path d="M92 32 l6 -10 l6 10 M80 38 l4 -8 l6 7" fill="#fb923c" stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="100" cy="98" rx="32" ry="20" fill="#a78bfa" stroke={O} strokeWidth="3" />
      <ellipse cx="90" cy="90" rx="3" ry="2" fill={O} /><ellipse cx="110" cy="90" rx="3" ry="2" fill={O} />
      {/* Augen */}
      {glasses === 'gl_sun' ? null : <g>
        <ellipse cx="78" cy="70" rx="15" ry="18" fill="#fff" stroke={O} strokeWidth="3.5" />
        <ellipse cx="122" cy="70" rx="15" ry="18" fill="#fff" stroke={O} strokeWidth="3.5" />
        <ellipse cx="81" cy="73" rx="9.5" ry="12" fill="#3b0764" /><ellipse cx="125" cy="73" rx="9.5" ry="12" fill="#3b0764" />
        <circle cx="84" cy="67" r="4.5" fill="#fff" /><circle cx="128" cy="67" r="4.5" fill="#fff" /><circle cx="78" cy="78" r="2" fill="#fff" /><circle cx="122" cy="78" r="2" fill="#fff" />
      </g>}
      <ellipse cx="60" cy="92" rx="8" ry="5" fill="#f472b6" opacity=".7" /><ellipse cx="140" cy="92" rx="8" ry="5" fill="#f472b6" opacity=".7" />
      {/* Mund */}
      {mood === 'sad'
        ? <path d="M88 110 Q100 102 112 110" stroke={O} strokeWidth="4" fill="none" strokeLinecap="round" />
        : <g><path d={mood === 'wow' ? 'M92 102 Q100 122 108 102 Z' : 'M84 101 Q100 124 116 101 Z'} fill="#7f1d1d" stroke={O} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M92 112 Q100 120 108 112 Q100 108 92 112" fill="#fb7185" /><path d="M88 102 l3 6 l3 -6 M106 102 l3 6 l3 -6" fill="#fff" stroke={O} strokeWidth="1.5" strokeLinejoin="round" /></g>}
      {/* Kopfhörer-Muscheln */}
      <rect x="36" y="64" width="18" height="32" rx="8" fill="#0ea5e9" stroke={O} strokeWidth="3.5" /><rect x="40" y="70" width="6" height="18" rx="3" fill="#7dd3fc" />
      <rect x="146" y="64" width="18" height="32" rx="8" fill="#0ea5e9" stroke={O} strokeWidth="3.5" /><rect x="154" y="70" width="6" height="18" rx="3" fill="#7dd3fc" />
      {/* Brillen */}
      {glasses === 'gl_goggles' && <g stroke={O} strokeWidth="3.5">
        <path d="M50 46 C70 36 130 36 150 46" stroke="#78350f" strokeWidth="8" fill="none" />
        <circle cx="84" cy="44" r="14" fill="#92400e" /><circle cx="116" cy="44" r="14" fill="#92400e" />
        <circle cx="84" cy="44" r="9" fill="url(#spLens)" strokeWidth="2.5" /><circle cx="116" cy="44" r="9" fill="url(#spLens)" strokeWidth="2.5" />
        <path d="M80 40 l4 -2 M112 40 l4 -2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </g>}
      {glasses === 'gl_sun' && <g stroke={O} strokeWidth="3.5"><rect x="58" y="58" width="38" height="26" rx="10" fill="#111827" /><rect x="104" y="58" width="38" height="26" rx="10" fill="#111827" /><path d="M96 66 h8" /><path d="M64 64 l10 0" stroke="#fff" strokeOpacity=".6" strokeWidth="3" /></g>}
      {glasses === 'gl_heart' && <g stroke={O} strokeWidth="3">{[78, 122].map(cx => <path key={cx} d={`M${cx} 86 L${cx - 16} 70 C${cx - 24} 58 ${cx - 6} 50 ${cx} 62 C${cx + 6} 50 ${cx + 24} 58 ${cx + 16} 70 Z`} fill="#ec4899" fillOpacity=".85" />)}<path d="M94 68 h12" /></g>}
      {glasses === 'gl_nerd' && <g stroke="#111827" strokeWidth="5" fill="#bae6fd" fillOpacity=".25"><circle cx="78" cy="70" r="17" /><circle cx="122" cy="70" r="17" /><path d="M95 68 h10" /></g>}
      {glasses === 'gl_star' && <g stroke={O} strokeWidth="3">{[78, 122].map(cx => <path key={cx} d={`M${cx} 50 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1z`} fill="#facc15" fillOpacity=".9" />)}</g>}
      {/* Hüte */}
      {showHat === 'hat_crown' && <path d="M66 34 L64 8 L82 22 L100 2 L118 22 L136 8 L134 34 Z" fill="#facc15" stroke={O} strokeWidth="3.5" strokeLinejoin="round" />}
      {showHat === 'hat_crown' && <g><circle cx="100" cy="24" r="5" fill="#ef4444" stroke={O} strokeWidth="2" /><circle cx="80" cy="28" r="3.5" fill="#22d3ee" /><circle cx="120" cy="28" r="3.5" fill="#22d3ee" /></g>}
      {showHat === 'hat_wizard' && <g stroke={O} strokeWidth="3.5" strokeLinejoin="round"><path d="M64 38 L104 -6 L136 38 Z" fill="#4338ca" /><ellipse cx="100" cy="38" rx="48" ry="9" fill="#3730a3" /><path d="M100 14 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z" fill="#facc15" strokeWidth="1.5" /></g>}
      {showHat === 'hat_party' && <g stroke={O} strokeWidth="3.5" strokeLinejoin="round"><path d="M82 36 L106 -4 L124 34 Z" fill="#f472b6" /><path d="M90 22 L116 18 M96 10 L111 8" stroke="#facc15" strokeWidth="5" /><circle cx="106" cy="-4" r="7" fill="#22d3ee" /></g>}
      {showHat === 'hat_pirate' && <g stroke={O} strokeWidth="3.5" strokeLinejoin="round"><path d="M48 38 C60 6 140 6 152 38 C130 30 70 30 48 38 Z" fill="#111827" /><circle cx="100" cy="22" r="7" fill="#f8fafc" strokeWidth="2" /><path d="M94 30 l12 -6 M94 24 l12 6" stroke="#f8fafc" strokeWidth="2.5" /></g>}
      {showHat === 'hat_cap' && <g stroke={O} strokeWidth="3.5" strokeLinejoin="round"><path d="M56 40 C56 4 144 4 144 40 Z" fill="#ef4444" /><path d="M130 38 C150 36 168 40 172 46 C158 48 140 46 128 42 Z" fill="#b91c1c" /><circle cx="100" cy="10" r="4" fill="#fff" /></g>}
      {showHat === 'hat_grad' && <g stroke={O} strokeWidth="3.5" strokeLinejoin="round"><path d="M72 30 h56 v12 h-56 z" fill="#1f2937" /><path d="M100 4 L152 20 L100 34 L48 20 Z" fill="#111827" /><path d="M140 22 v20" stroke="#facc15" strokeWidth="3" /><circle cx="140" cy="44" r="4" fill="#facc15" /></g>}
      {showHat === 'hat_santa' && <g stroke={O} strokeWidth="3.5" strokeLinejoin="round"><path d="M62 36 C70 0 120 -10 150 18 L136 36 Z" fill="#dc2626" /><ellipse cx="100" cy="38" rx="42" ry="9" fill="#f8fafc" /><circle cx="152" cy="20" r="9" fill="#f8fafc" /></g>}
      </g>
    </svg>
  );
}

/* ============================================================================
 * 12) HINTERGRÜNDE: Himmel, Wolken, schwebende Inseln, Saison-Partikel
 * ========================================================================== */
const Cloud = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 120 60" className={className} style={style}><path d="M20 50 C4 50 4 30 20 30 C20 14 44 10 52 24 C60 8 92 10 92 30 C112 28 116 50 98 50 Z" fill="#fff" opacity=".92" /><path d="M24 46 C40 50 80 50 96 46" stroke="#cbd5e1" strokeWidth="3" fill="none" opacity=".6" /></svg>
);
const FloatIsland = ({ className = '', style, color = '#4ade80' }: { className?: string; style?: React.CSSProperties; color?: string }) => (
  <svg viewBox="0 0 100 70" className={className} style={style}>
    <path d="M10 22 L90 22 L72 50 L56 68 L40 52 L22 44 Z" fill="#a16207" stroke="#422006" strokeWidth="3" strokeLinejoin="round" />
    <path d="M30 40 L44 58 M60 40 L58 60" stroke="#713f12" strokeWidth="3" />
    <ellipse cx="50" cy="22" rx="42" ry="10" fill={color} stroke="#14532d" strokeWidth="3" />
    <circle cx="34" cy="12" r="9" fill="#16a34a" stroke="#14532d" strokeWidth="2.5" /><rect x="32" y="16" width="4" height="8" fill="#713f12" />
    <circle cx="66" cy="14" r="6" fill="#22c55e" stroke="#14532d" strokeWidth="2.5" />
  </svg>
);
function Particles({ kind, count = 18 }: { kind: SeasonTheme['particle']; count?: number }) {
  const ps = useMemo(() => Array.from({ length: count }, (_, i) => ({ left: (i * 53) % 100, delay: -((i * 1.7) % 12), dur: 8 + ((i * 7) % 9), size: 10 + ((i * 5) % 16), hue: i % 5 })), [count]);
  if (kind === 'none') return null;
  if (kind === 'sun') return <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56"><svg viewBox="0 0 100 100" className="w-full h-full a-spin">{Array.from({ length: 12 }, (_, i) => <rect key={i} x="48" y="2" width="4" height="18" rx="2" fill="#fde047" transform={`rotate(${i * 30} 50 50)`} />)}<circle cx="50" cy="50" r="24" fill="#facc15" stroke="#f59e0b" strokeWidth="4" /></svg></div>;
  if (kind === 'lantern') return <div className="pointer-events-none absolute inset-x-0 top-0 h-40 flex justify-around">
    {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="a-sway" style={{ animationDelay: `${-i * 0.6}s`, marginTop: (i % 2) * 18 }}>
      <svg viewBox="0 0 30 80" className="w-7 h-20 sm:w-9 sm:h-24"><path d="M15 0 v28" stroke="#fbbf24" strokeWidth="2" /><path d="M6 32 h18 l4 8 v20 l-4 8 h-18 l-4 -8 v-20 z" fill="#f59e0b" stroke="#451a03" strokeWidth="2.5" /><rect x="9" y="40" width="12" height="20" rx="3" fill="#fef08a" className="a-glow" /><path d="M15 28 l-8 4 h16 z" fill="#d97706" stroke="#451a03" strokeWidth="2" /></svg></div>)}
    <svg viewBox="0 0 60 60" className="absolute right-6 top-24 w-16 h-16 a-float"><path d="M40 6 A26 26 0 1 0 54 44 A20 20 0 1 1 40 6Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="3" /></svg>
  </div>;
  const colors = ['#f472b6', '#facc15', '#22d3ee', '#a78bfa', '#4ade80'];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {ps.map((p, i) => {
        const style: React.CSSProperties = kind === 'bat'
          ? { position: 'absolute', top: `${10 + (i % 6) * 9}%`, left: 0, animation: `fly ${p.dur + 4}s linear ${p.delay}s infinite` }
          : { position: 'absolute', top: 0, left: `${p.left}%`, animation: `fall ${p.dur}s linear ${p.delay}s infinite` };
        if (kind === 'bat' && i > 6) return null;
        return <div key={i} style={style}>
          {kind === 'snow' && <div className="rounded-full bg-white shadow" style={{ width: p.size * 0.6, height: p.size * 0.6, opacity: 0.9 }} />}
          {kind === 'leaf' && <svg viewBox="0 0 20 20" style={{ width: p.size + 6 }}><path d="M2 18 C2 6 10 2 18 2 C18 10 14 18 2 18Z" fill={['#f97316', '#dc2626', '#facc15', '#ea580c', '#b45309'][p.hue]} stroke="#7c2d12" strokeWidth="1.5" /><path d="M2 18 L14 6" stroke="#7c2d12" strokeWidth="1.2" /></svg>}
          {kind === 'blossom' && <svg viewBox="0 0 20 20" style={{ width: p.size + 4 }}>{[0, 72, 144, 216, 288].map(r => <ellipse key={r} cx="10" cy="5" rx="3.5" ry="5" fill="#f9a8d4" transform={`rotate(${r} 10 10)`} />)}<circle cx="10" cy="10" r="2.5" fill="#fde047" /></svg>}
          {kind === 'confetti' && <div style={{ width: p.size * 0.5, height: p.size, background: colors[p.hue], borderRadius: 3 }} />}
          {kind === 'egg' && <svg viewBox="0 0 20 26" style={{ width: p.size + 6 }}><ellipse cx="10" cy="14" rx="9" ry="11" fill={colors[p.hue]} stroke="#1e1240" strokeWidth="2" /><path d="M2 13 q4 -3 8 0 t8 0" stroke="#fff" strokeWidth="2" fill="none" /></svg>}
          {kind === 'bat' && <svg viewBox="0 0 40 20" style={{ width: 40 + p.size }}><path d="M20 8 C16 2 8 0 0 6 C6 6 8 10 8 14 C12 10 16 12 20 16 C24 12 28 10 32 14 C32 10 34 6 40 6 C32 0 24 2 20 8Z" fill="#1e1b4b" /><circle cx="18" cy="9" r="1" fill="#facc15" /><circle cx="22" cy="9" r="1" fill="#facc15" /></svg>}
        </div>;
      })}
    </div>
  );
}
function SkyBackground({ sky, particle, night }: { sky: string; particle: SeasonTheme['particle']; night?: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-gradient-to-b ${sky}`}>
      {night && Array.from({ length: 40 }, (_, i) => <div key={i} className="absolute rounded-full bg-white a-twinkle" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 70}%`, width: 2 + (i % 3), height: 2 + (i % 3), animationDelay: `${-(i % 7) * 0.4}s` }} />)}
      {!night && <>
        <Cloud className="absolute w-40 opacity-90" style={{ top: '8%', animation: 'drift 70s linear -10s infinite' }} />
        <Cloud className="absolute w-56 opacity-80" style={{ top: '30%', animation: 'drift 95s linear -50s infinite' }} />
        <Cloud className="absolute w-32 opacity-90" style={{ top: '62%', animation: 'drift 80s linear -30s infinite' }} />
      </>}
      <FloatIsland className="absolute w-24 a-float opacity-80" style={{ left: '4%', top: '18%' }} color={night ? '#7c3aed' : '#4ade80'} />
      <FloatIsland className="absolute w-32 a-float opacity-80" style={{ right: '3%', top: '44%', animationDelay: '-1.2s' }} color={night ? '#0ea5e9' : '#4ade80'} />
      <FloatIsland className="absolute w-20 a-float opacity-70" style={{ left: '40%', bottom: '6%', animationDelay: '-2s' }} color={night ? '#db2777' : '#86efac'} />
      <Particles kind={particle} />
    </div>
  );
}

/* ---- Szenen-Illustrationen für die 5 Welten-Karten ---- */
function WorldArt({ w }: { w: number }) {
  const O = '#1e1240';
  if (w === 0) return (
    <svg viewBox="0 0 160 130" className="w-full h-full">
      <rect width="160" height="130" fill="url(#w0sky)" /><defs><linearGradient id="w0sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#67e8f9" /><stop offset="1" stopColor="#bbf7d0" /></linearGradient></defs>
      {[[18, 60, 30], [140, 56, 34], [60, 50, 22], [104, 48, 24]].map(([x, y, r], i) => <g key={i}><rect x={x - 4} y={y} width="8" height="50" fill="#78350f" stroke={O} strokeWidth="2" /><circle cx={x} cy={y} r={r} fill={i % 2 ? '#16a34a' : '#22c55e'} stroke={O} strokeWidth="3" /><circle cx={x - r / 3} cy={y - r / 3} r={r / 3} fill="#4ade80" /></g>)}
      <path d="M0 108 Q80 92 160 108 V130 H0Z" fill="#65a30d" stroke={O} strokeWidth="3" />
      <rect x="72" y="86" width="16" height="26" rx="5" fill="#fef3c7" stroke={O} strokeWidth="3" /><path d="M48 90 C48 60 112 60 112 90 Z" fill="#e879f9" stroke={O} strokeWidth="3.5" />
      {[[62, 78], [82, 70], [98, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#fff" />)}
      <path d="M126 112 C126 100 146 100 146 112 Z" fill="#f43f5e" stroke={O} strokeWidth="2.5" /><circle cx="134" cy="106" r="2" fill="#fff" />
      {[[30, 30], [120, 24], [80, 18]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#fef08a" className="a-twinkle" style={{ animationDelay: `${-i * 0.5}s` }} />)}
    </svg>
  );
  if (w === 1) return (
    <svg viewBox="0 0 160 130" className="w-full h-full">
      <rect width="160" height="130" fill="url(#w1sky)" /><defs><linearGradient id="w1sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bae6fd" /><stop offset="1" stopColor="#e0e7ff" /></linearGradient></defs>
      <g stroke={O} strokeWidth="2.5" strokeLinejoin="round"><path d="M96 70 V36 L104 26 L112 36 V70Z" fill="#c4b5fd" /><path d="M114 70 V44 L122 32 L130 44 V70Z" fill="#a5b4fc" /><path d="M80 70 V48 L88 38 L96 48 V70Z" fill="#ddd6fe" /></g>
      <path d="M0 84 Q80 70 160 84 V130 H0Z" fill="#7dd3fc" stroke={O} strokeWidth="3" />
      <path d="M0 98 Q80 88 160 98" stroke="#fff" strokeWidth="3" fill="none" opacity=".7" />
      {[[22, 112, 1.2, '#a78bfa'], [50, 118, 0.8, '#67e8f9'], [132, 112, 1.3, '#c084fc'], [108, 120, 0.7, '#22d3ee']].map(([x, y, s, c], i) =>
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round"><path d="M0 0 L-8 -26 L0 -40 L8 -26 Z" fill={c as string} /><path d="M-10 0 L-16 -16 L-8 -22 Z M10 0 L16 -16 L8 -22 Z" fill={c as string} /><path d="M-2 -32 L0 -36" stroke="#fff" strokeWidth="2" /></g>)}
    </svg>
  );
  if (w === 2) return (
    <svg viewBox="0 0 160 130" className="w-full h-full">
      <rect width="160" height="130" fill="url(#w2sky)" /><defs><linearGradient id="w2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#312e81" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={(i * 41) % 160} cy={(i * 17) % 60} r={1 + (i % 2)} fill="#fff" className="a-twinkle" style={{ animationDelay: `${-i * 0.3}s` }} />)}
      <circle cx="132" cy="24" r="12" fill="#f9a8d4" stroke={O} strokeWidth="2.5" /><ellipse cx="132" cy="24" rx="20" ry="4" fill="none" stroke="#fde68a" strokeWidth="2.5" />
      <g stroke={O} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="44" y="60" width="72" height="44" fill="#fde68a" /><rect x="74" y="78" width="14" height="26" rx="7" fill="#7c3aed" />
        <path d="M60 60 C60 36 100 36 100 60Z" fill="#3b82f6" /><path d="M80 34 V22" /><circle cx="80" cy="20" r="3" fill="#facc15" />
        <rect x="34" y="52" width="14" height="52" fill="#fcd34d" /><path d="M34 52 L41 36 L48 52Z" fill="#2563eb" />
        <rect x="112" y="52" width="14" height="52" fill="#fcd34d" /><path d="M112 52 L119 36 L126 52Z" fill="#2563eb" />
      </g>
      <path d="M0 104 Q80 94 160 104 V130 H0Z" fill="#16a34a" stroke={O} strokeWidth="3" />
    </svg>
  );
  if (w === 3) return (
    <svg viewBox="0 0 160 130" className="w-full h-full">
      <rect width="160" height="130" fill="url(#w3sky)" /><defs><linearGradient id="w3sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e1b4b" /><stop offset="1" stopColor="#86198f" /></linearGradient></defs>
      {[[8, 50, 20, 80], [30, 30, 22, 100], [56, 56, 18, 74], [76, 20, 24, 110], [102, 44, 20, 86], [124, 28, 26, 102]].map(([x, y, w2, h], i) =>
        <g key={i}><rect x={x} y={y} width={w2} height={h} fill={i % 2 ? '#312e81' : '#3b0764'} stroke="#0f0a2e" strokeWidth="2" />
          {Array.from({ length: Math.floor(h / 12) }, (_, r) => <rect key={r} x={x + 4} y={y + 6 + r * 12} width={w2 - 8} height="4" fill={['#22d3ee', '#f0abfc', '#facc15'][(r + i) % 3]} opacity=".85" className={r % 3 === 0 ? 'a-glow' : ''} />)}</g>)}
      <rect x="0" y="108" width="160" height="22" fill="#0f0a2e" /><path d="M0 110 H160" stroke="#22d3ee" strokeWidth="3" className="a-glow" />
      <path d="M20 120 H140" stroke="#e879f9" strokeWidth="2" strokeDasharray="8 6" />
    </svg>
  );
  return (
    <svg viewBox="0 0 160 130" className="w-full h-full">
      <rect width="160" height="130" fill="url(#w4sky)" /><defs><linearGradient id="w4sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c4a6e" /><stop offset="1" stopColor="#020617" /></linearGradient>
        <radialGradient id="orb" cx=".4" cy=".4" r=".6"><stop offset="0" stopColor="#e0f2fe" /><stop offset=".5" stopColor="#38bdf8" /><stop offset="1" stopColor="#1d4ed8" /></radialGradient></defs>
      {[[10, 20], [124, 18]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width="28" height="20" rx="3" fill="#0e7490" stroke="#22d3ee" strokeWidth="2" /><path d={`M${x + 4} ${y + 12} l5 -5 5 5 5 -8 5 4`} stroke="#a5f3fc" strokeWidth="1.5" fill="none" /></g>)}
      <ellipse cx="80" cy="108" rx="44" ry="10" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2.5" />
      <circle cx="80" cy="66" r="30" fill="url(#orb)" stroke="#7dd3fc" strokeWidth="3" className="a-glow" />
      <ellipse cx="80" cy="66" rx="40" ry="12" fill="none" stroke="#a5f3fc" strokeWidth="2" transform="rotate(-20 80 66)" />
      <ellipse cx="80" cy="66" rx="40" ry="12" fill="none" stroke="#a5f3fc" strokeWidth="2" transform="rotate(40 80 66)" />
      <path d="M66 58 C72 50 88 50 90 60 M70 74 C78 80 90 76 94 70" stroke="#e0f2fe" strokeWidth="2" fill="none" />
      <rect x="18" y="80" width="18" height="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" /><rect x="124" y="80" width="18" height="30" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="27" cy="88" r="3" fill="#facc15" className="a-glow" /><circle cx="133" cy="88" r="3" fill="#4ade80" className="a-glow" />
    </svg>
  );
}

/* ============================================================================
 * 13) ISOMETRISCHES 3D-SPIELFELD
 * ========================================================================== */
const TW = 64, TH = 32, DEP = 16;
const iso = (x: number, y: number) => ({ cx: (x - y) * (TW / 2), cy: (x + y) * (TH / 2) });
interface BoardState { x: number; y: number; d: number; got: Set<string>; key: boolean; anim: 'idle' | 'move' | 'jump' | 'bump' | 'fall' | 'win' }
function Obstacle({ w, cx, cy }: { w: number; cx: number; cy: number }) {
  const O = '#1e1240';
  if (w === 0) return <g transform={`translate(${cx} ${cy})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round">
    <path d="M-20 4 C-24 -14 -10 -26 2 -24 C16 -24 24 -12 20 4 C12 10 -12 10 -20 4Z" fill="#9ca3af" /><path d="M-14 -12 C-8 -20 4 -20 8 -16" stroke="#fff" strokeOpacity=".6" fill="none" />
    <path d="M-18 -6 C-10 -12 -2 -8 4 -14 C10 -10 16 -12 20 -6 L20 -2 C10 -6 -10 -2 -18 -2Z" fill="#4ade80" /></g>;
  if (w === 1) return <g transform={`translate(${cx} ${cy})`} stroke={O} strokeWidth="2.5" strokeLinejoin="round">
    <path d="M-4 6 L-12 -26 L-2 -40 L8 -26 L4 6Z" fill="#a78bfa" /><path d="M-14 6 L-22 -12 L-12 -18 L-6 4Z" fill="#67e8f9" /><path d="M8 6 L18 -16 L24 -6 L16 6Z" fill="#c4b5fd" /><path d="M-4 -30 L-2 -36" stroke="#fff" strokeWidth="2" /></g>;
  if (w === 2) return <g transform={`translate(${cx} ${cy})`} stroke={O} strokeWidth="2.5">
    <path d="M-20 -6 C-22 -22 -4 -30 8 -26 C22 -22 24 -6 18 2 C8 10 -14 8 -20 -6Z" fill="#7c3aed" /><circle cx="-6" cy="-14" r="5" fill="#5b21b6" /><circle cx="8" cy="-6" r="3.5" fill="#5b21b6" />
    <path d="M14 -24 C24 -34 34 -34 40 -40" stroke="#f97316" strokeWidth="4" fill="none" className="a-glow" /></g>;
  if (w === 3) return <g transform={`translate(${cx} ${cy})`}>
    <rect x="-18" y="-30" width="6" height="34" rx="2" fill="#1e1b4b" stroke="#e879f9" strokeWidth="2" /><rect x="12" y="-30" width="6" height="34" rx="2" fill="#1e1b4b" stroke="#e879f9" strokeWidth="2" />
    {[-24, -14, -4].map(y => <rect key={y} x="-12" y={y} width="24" height="3" fill="#f0abfc" className="a-glow" />)}
    <circle cx="-15" cy="-32" r="3" fill="#22d3ee" /><circle cx="15" cy="-32" r="3" fill="#22d3ee" /></g>;
  return <g transform={`translate(${cx} ${cy})`} stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round">
    <path d="M0 -36 L18 -26 L18 -4 L0 6 L-18 -4 L-18 -26Z" fill="#0c4a6e" /><path d="M0 -36 L18 -26 L0 -16 L-18 -26Z" fill="#0369a1" /><path d="M0 -16 V6" />
    <circle cx="0" cy="-26" r="4" fill="#a5f3fc" className="a-glow" /></g>;
}
function Board({ lv, world, st, look }: { lv: Level; world: WorldDef; st: BoardState; look: SparkyLook }) {
  const pad = 70;
  const minX = -(lv.h - 1) * TW / 2 - TW / 2 - 6, maxX = (lv.w - 1) * TW / 2 + TW / 2 + 6;
  const minY = -TH / 2 - pad, maxY = (lv.w + lv.h - 2) * TH / 2 + TH / 2 + DEP + 8;
  const tiles: React.ReactNode[] = []; const objs: { z: number; node: React.ReactNode }[] = [];
  const order: [number, number][] = [];
  for (let y = 0; y < lv.h; y++) for (let x = 0; x < lv.w; x++) order.push([x, y]);
  order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const [top, left, right] = world.tile;
  for (const [x, y] of order) {
    const c = lv.grid[y][x]; if (c === ' ') continue;
    const { cx, cy } = iso(x, y); const k = `${x},${y}`;
    if (c === '~') {
      tiles.push(<g key={'t' + k}><path d={`M${cx} ${cy - TH / 2 + 10} L${cx + TW / 2} ${cy + 10} L${cx} ${cy + TH / 2 + 10} L${cx - TW / 2} ${cy + 10}Z`} fill={world.id >= 3 ? '#0e7490' : '#38bdf8'} stroke="#0c4a6e" strokeWidth="1.5" opacity=".9" />
        <path d={`M${cx - 14} ${cy + 10} q7 -4 14 0 t14 0`} stroke="#e0f2fe" strokeWidth="2" fill="none" className="a-glow" /></g>);
      continue;
    }
    const alt = (x + y) % 2 === 0;
    tiles.push(<g key={'t' + k}>
      <path d={`M${cx - TW / 2} ${cy} L${cx} ${cy + TH / 2} L${cx} ${cy + TH / 2 + DEP} L${cx - TW / 2} ${cy + DEP}Z`} fill={left} stroke={world.edge} strokeWidth="1.5" />
      <path d={`M${cx} ${cy + TH / 2} L${cx + TW / 2} ${cy} L${cx + TW / 2} ${cy + DEP} L${cx} ${cy + TH / 2 + DEP}Z`} fill={right} stroke={world.edge} strokeWidth="1.5" />
      <path d={`M${cx} ${cy - TH / 2} L${cx + TW / 2} ${cy} L${cx} ${cy + TH / 2} L${cx - TW / 2} ${cy}Z`} fill={alt ? top : world.tileAlt} stroke={world.edge} strokeWidth="2" />
      <path d={`M${cx - TW / 2 + 8} ${cy} L${cx} ${cy - TH / 2 + 4}`} stroke="#fff" strokeOpacity=".45" strokeWidth="2" />
      {world.id >= 3 && <path d={`M${cx} ${cy - TH / 2} L${cx + TW / 2} ${cy} L${cx} ${cy + TH / 2} L${cx - TW / 2} ${cy}Z`} fill="none" stroke={world.edge} strokeOpacity=".8" strokeWidth="1" className="a-glow" />}
    </g>);
    const z = x + y;
    if (c === '#') objs.push({ z, node: <Obstacle key={'o' + k} w={world.id} cx={cx} cy={cy} /> });
    if (c === '*' && !st.got.has(k)) objs.push({ z, node: <g key={'s' + k} transform={`translate(${cx - 14} ${cy - 34})`}><g className="a-bob"><ellipse cx="14" cy="34" rx="10" ry="3" fill="#000" opacity=".2" /><path d="M14 2l4 8.5 9.3 1.2-6.8 6.4 1.8 9.2L14 22.7 5.7 27.3l1.8-9.2L.7 11.7 10 10.5z" fill="#facc15" stroke="#1e1240" strokeWidth="2.5" strokeLinejoin="round" /><path d="M9 11l3-1" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></g></g> });
    if (c === 'k' && !st.key) objs.push({ z, node: <g key={'k' + k} transform={`translate(${cx} ${cy - 22})`}><g className="a-bob"><circle cx="-6" cy="0" r="7" fill="none" stroke="#1e1240" strokeWidth="7" /><circle cx="-6" cy="0" r="7" fill="none" stroke="#facc15" strokeWidth="4" /><path d="M1 0 H16 M12 0 V6 M16 0 V5" stroke="#1e1240" strokeWidth="6" strokeLinecap="round" /><path d="M1 0 H16 M12 0 V6 M16 0 V5" stroke="#facc15" strokeWidth="3" strokeLinecap="round" /></g></g> });
    if (c === 'D') objs.push({ z, node: <g key={'d' + k} transform={`translate(${cx} ${cy})`} opacity={st.key ? 0.35 : 1}>
      <path d="M-22 4 V-30 C-22 -46 22 -46 22 -30 V4" fill={st.key ? 'none' : '#7c2d12'} stroke="#1e1240" strokeWidth="3" />
      {!st.key && [-12, -4, 4, 12].map(xx => <path key={xx} d={`M${xx} 2 V-36`} stroke="#fbbf24" strokeWidth="3" />)}
      {!st.key && <g><rect x="-6" y="-18" width="12" height="10" rx="2" fill="#facc15" stroke="#1e1240" strokeWidth="2" /><path d="M-3 -18 v-4 a3 3 0 0 1 6 0 v4" stroke="#1e1240" strokeWidth="2" fill="none" /></g>}
    </g> });
    if (c === 'G') objs.push({ z, node: <g key={'g' + k} transform={`translate(${cx} ${cy})`}>
      <ellipse cx="0" cy="2" rx="22" ry="8" fill="#fde047" opacity=".5" className="a-glow" />
      <path d="M-18 2 V-30 C-18 -50 18 -50 18 -30 V2" fill="url(#portal)" stroke="#1e1240" strokeWidth="3" />
      <path d="M-18 2 V-30 C-18 -50 18 -50 18 -30 V2" fill="none" stroke="#a78bfa" strokeWidth="2" transform="scale(.8) translate(0 -2)" />
      <g transform="translate(0 -58)"><g className="a-bob"><path d="M-9 -6 h18 v7 a9 9 0 0 1 -18 0z" fill="#facc15" stroke="#1e1240" strokeWidth="2.5" /><path d="M-9 -3 h-4 a4 4 0 0 0 4 6 M9 -3 h4 a4 4 0 0 1 -4 6" stroke="#1e1240" strokeWidth="2" fill="none" /><path d="M0 10 v4 M-5 15 h10" stroke="#1e1240" strokeWidth="3" /></g></g>
    </g> });
  }
  // Sparky
  const sp = iso(st.x, st.y); const flip = st.d === 1 || st.d === 2;
  const arrow = iso(DX[st.d], DY[st.d]);
  objs.push({ z: st.x + st.y + 0.5, node: <g key="sparky" style={{ transform: `translate(${sp.cx}px, ${sp.cy}px)`, transition: 'transform .3s ease-in-out' }}>
    <path d={`M${arrow.cx * 0.55} ${arrow.cy * 0.55} L${arrow.cx * 0.3 - arrow.cy * 0.5} ${arrow.cy * 0.3 + arrow.cx * 0.12} L${arrow.cx * 0.3 + arrow.cy * 0.5} ${arrow.cy * 0.3 - arrow.cx * 0.12}Z`} fill="#facc15" stroke="#1e1240" strokeWidth="2" opacity={st.anim === 'fall' ? 0 : 1} />
    <ellipse cx="0" cy="2" rx="16" ry="6" fill="#000" opacity={st.anim === 'fall' ? 0 : 0.25} />
    <g className={st.anim === 'jump' ? 'a-hop' : st.anim === 'bump' ? 'a-shake' : ''} key={st.anim + st.x + ',' + st.y + st.d}>
      <g style={{ transform: st.anim === 'fall' ? 'translateY(60px) scale(.4)' : st.anim === 'win' ? 'translateY(-10px) scale(1.1)' : 'none', opacity: st.anim === 'fall' ? 0 : 1, transition: 'all .6s ease-in' }}>
        <Sparky box={[-36, -68, 72]} flip={flip} look={{ ...look, mood: st.anim === 'bump' || st.anim === 'fall' ? 'sad' : st.anim === 'win' ? 'wow' : 'happy' }} />
      </g>
    </g>
  </g> });
  objs.sort((a, b) => a.z - b.z);
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="w-full h-full drop-shadow-[0_14px_10px_rgba(0,0,0,0.35)]" preserveAspectRatio="xMidYMid meet">
      <defs><radialGradient id="portal" cx=".5" cy=".6" r=".6"><stop offset="0" stopColor="#fef9c3" /><stop offset=".5" stopColor="#c084fc" /><stop offset="1" stopColor="#4c1d95" /></radialGradient></defs>
      {tiles}{objs.map(o => o.node)}
    </svg>
  );
}

/* ============================================================================
 * 14) CODE-TERMINAL: Syntax-Highlighting, Blöcke, Schnell-Tasten
 * ========================================================================== */
const KW = new Set(['for', 'in', 'range', 'while', 'if', 'elif', 'else', 'def', 'not', 'and', 'or', 'pass', 'True', 'False']);
function highlightPy(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = []; const re = /(#.*$)|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|(.)/g; let m: RegExpExecArray | null; let i = 0;
  while ((m = re.exec(line))) {
    const [t] = m;
    if (m[1]) out.push(<span key={i++} className="text-slate-400 italic">{t}</span>);
    else if (m[2]) out.push(<span key={i++} className="text-orange-300">{t}</span>);
    else if (m[3]) out.push(<span key={i++} className={KW.has(t) ? 'text-pink-400 font-bold' : CMD_NAMES[t] ? 'text-cyan-300' : SENSORS.includes(t) ? 'text-lime-300' : 'text-amber-100'}>{t}</span>);
    else out.push(<span key={i++} className={m[5] && /[():]/.test(t) ? 'text-yellow-300' : ''}>{t}</span>);
  }
  return out;
}
function CodeEditor({ code, setCode, activeLine, errLine, taRef, readOnly }: { code: string; setCode: (s: string) => void; activeLine: number; errLine: number; taRef: React.RefObject<HTMLTextAreaElement>; readOnly?: boolean }) {
  const lines = code.split('\n'); const preRef = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    if (e.key === 'Tab') { e.preventDefault(); const p = ta.selectionStart; setCode(code.slice(0, p) + '    ' + code.slice(ta.selectionEnd)); requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = p + 4; }); }
    if (e.key === 'Enter') {
      e.preventDefault(); const p = ta.selectionStart; const ls = code.lastIndexOf('\n', p - 1) + 1; const cur = code.slice(ls, p);
      const ind = (cur.match(/^\s*/)?.[0].length || 0) + (cur.trimEnd().endsWith(':') ? 4 : 0); const ins = '\n' + ' '.repeat(ind);
      setCode(code.slice(0, p) + ins + code.slice(ta.selectionEnd)); requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = p + ins.length; });
    }
  };
  return (
    <div className="relative flex font-code text-[13px] sm:text-sm leading-6 min-h-full" dir="ltr">
      <div className="select-none text-right pr-2 pl-1 text-slate-500 bg-slate-950/60 border-r-2 border-slate-700">
        {lines.map((_, i) => <div key={i} className={i + 1 === activeLine ? 'text-yellow-300 font-bold' : i + 1 === errLine ? 'text-red-400 font-bold' : ''}>{i + 1}</div>)}
      </div>
      <div className="relative flex-1 min-w-0">
        <div ref={preRef} aria-hidden className="absolute inset-0 pl-2 whitespace-pre pointer-events-none">
          {lines.map((l, i) => <div key={i} className={`${i + 1 === activeLine ? 'bg-yellow-400/20 rounded' : ''} ${i + 1 === errLine ? 'bg-red-500/25 rounded' : ''}`}>{l.length ? highlightPy(l) : '​'}</div>)}
        </div>
        <textarea ref={taRef} value={code} readOnly={readOnly} onChange={e => setCode(e.target.value)} onKeyDown={onKey} spellCheck={false} autoCapitalize="off" autoCorrect="off" autoComplete="off"
          className="code-area relative w-full h-full min-h-[8rem] pl-2 bg-transparent outline-none resize-none whitespace-pre overflow-hidden leading-6 text-transparent"
          style={{ height: `${Math.max(lines.length, 5) * 24 + 8}px` }} />
      </div>
    </div>
  );
}
const COND_LABEL: Record<BCond, string> = { not_at_goal: 'not at_goal()', path_ahead: 'path_ahead()', gap_ahead: 'gap_ahead()', wall_ahead: 'wall_ahead()' };
const CMD_STYLE: Record<Cmd, { c: string; i: React.ComponentType<{ className?: string }> }> = {
  fwd: { c: 'from-sky-400 to-blue-600', i: ArrowUp }, left: { c: 'from-violet-400 to-purple-600', i: RotateCcw },
  right: { c: 'from-violet-400 to-purple-600', i: RotateCw }, jump: { c: 'from-amber-300 to-orange-600', i: ChevronsUp },
};
function blockLineMap(bs: BNode[], acc: number[] = []): number[] { for (const b of bs) { acc.push(b.id); if (b.k !== 'cmd') { if (b.body.length) blockLineMap(b.body, acc); else acc.push(b.id); } } return acc; }
function BlockList({ bs, lang, active, setActive, onChange, runId, depth = 0 }: { bs: BNode[]; lang: Lang; active: number | null; setActive: (id: number | null) => void; onChange: (bs: BNode[]) => void; runId: number; depth?: number }) {
  const upd = (i: number, nb: BNode | null) => { const c = bs.slice(); if (nb) c[i] = nb; else c.splice(i, 1); onChange(c); };
  return (
    <div className="flex flex-col gap-1.5">
      {bs.map((b, i) => {
        const del = <button onClick={e => { e.stopPropagation(); audio.play('tap'); if (active === b.id) setActive(null); upd(i, null); }} className="ml-auto w-6 h-6 rounded-full bg-slate-900/60 flex items-center justify-center text-white/80 hover:text-white"><X className="w-4 h-4" /></button>;
        const isRun = runId === b.id;
        if (b.k === 'cmd') {
          const S = CMD_STYLE[b.c]; const I = S.i;
          return <div key={b.id} className={`flex items-center gap-2 px-2 py-1 rounded-xl bg-gradient-to-b ${S.c} border-[3px] border-slate-900/80 shadow-[0_3px_0_rgba(0,0,0,0.4)] ${isRun ? 'ring-4 ring-yellow-300 scale-[1.03]' : ''} transition`}>
            <I className="w-5 h-5 text-white drop-shadow" /><span className="font-game text-white txt-o-xs text-base">{tr(lang, b.c)}</span>{del}</div>;
        }
        const color = b.k === 'loop' ? 'from-emerald-400 to-green-700' : b.k === 'if' ? 'from-pink-400 to-rose-600' : 'from-fuchsia-400 to-purple-700';
        const isAct = active === b.id;
        return <div key={b.id} className={`rounded-2xl border-[3px] border-slate-900/80 bg-gradient-to-b ${color} shadow-[0_3px_0_rgba(0,0,0,0.4)] ${isAct ? 'ring-4 ring-yellow-300' : ''} ${isRun ? 'ring-4 ring-yellow-200' : ''}`} onClick={e => { e.stopPropagation(); audio.play('tap'); setActive(isAct ? null : b.id); }}>
          <div className="flex items-center gap-1.5 px-2 py-1">
            {b.k === 'loop' ? <Repeat className="w-5 h-5 text-white" /> : b.k === 'if' ? <GitBranch className="w-5 h-5 text-white" /> : <RefreshCw className="w-5 h-5 text-white" />}
            <span className="font-game text-white txt-o-xs text-base">{tr(lang, b.k === 'loop' ? 'loop' : b.k === 'if' ? 'ifb' : 'whileb')}</span>
            {b.k === 'loop' ? <span className="flex items-center gap-1 ml-1">
              <button className="w-6 h-6 rounded-full bg-white/90 text-slate-900 flex items-center justify-center border-2 border-slate-900" onClick={e => { e.stopPropagation(); audio.play('tap'); upd(i, { ...b, n: Math.max(1, b.n - 1) }); }}><Minus className="w-3 h-3" /></button>
              <span className="font-game text-yellow-200 txt-o-xs text-lg w-7 text-center">{b.n}×</span>
              <button className="w-6 h-6 rounded-full bg-white/90 text-slate-900 flex items-center justify-center border-2 border-slate-900" onClick={e => { e.stopPropagation(); audio.play('tap'); upd(i, { ...b, n: Math.min(20, b.n + 1) }); }}><Plus className="w-3 h-3" /></button>
            </span> : <button className="ml-1 px-2 rounded-lg bg-slate-950/70 text-lime-300 font-code text-xs border-2 border-slate-900" onClick={e => {
              e.stopPropagation(); audio.play('tap'); const cs: BCond[] = b.k === 'while' ? ['not_at_goal', 'path_ahead'] : ['path_ahead', 'gap_ahead', 'wall_ahead'];
              upd(i, { ...b, cond: cs[(cs.indexOf(b.cond) + 1) % cs.length] });
            }}>{COND_LABEL[b.cond]}</button>}
            {del}
          </div>
          <div className="ml-4 mr-1 mb-1.5 p-1.5 rounded-xl bg-slate-950/40 min-h-[34px] border-l-4 border-white/50">
            {b.body.length ? <BlockList bs={b.body} lang={lang} active={active} setActive={setActive} onChange={nb => upd(i, { ...b, body: nb })} runId={runId} depth={depth + 1} />
              : <div className="text-white/70 text-xs font-ui font-bold px-1 py-1">{isAct ? '⤷ ' + tr(lang, 'insideLoop') : '…'}</div>}
          </div>
        </div>;
      })}
    </div>
  );
}
function addToBlocks(bs: BNode[], target: number | null, nb: BNode): BNode[] {
  if (target === null) return [...bs, nb];
  return bs.map(b => b.k === 'cmd' ? b : b.id === target ? { ...b, body: [...b.body, nb] } : { ...b, body: addToBlocks(b.body, target, nb) });
}
function removeLast(bs: BNode[]): BNode[] {
  if (!bs.length) return bs; const last = bs[bs.length - 1];
  if (last.k !== 'cmd' && last.body.length) return [...bs.slice(0, -1), { ...last, body: removeLast(last.body) }];
  return bs.slice(0, -1);
}
const hasRecursion = (ss: Stmt[]): boolean => {
  const defs = ss.filter(s => s.k === 'def') as Extract<Stmt, { k: 'def' }>[];
  return defs.some(d => progUses(d.body, s => s.k === 'call' && s.name === d.name));
};

/* ============================================================================
 * 15) SPIEL-BILDSCHIRM
 * ========================================================================== */
interface WinInfo { stars: number; crystals: number; size: number; par: number; first: boolean }
function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[2px]" onClick={onClose}>
    <div className="a-pop w-full max-w-md max-h-[92dvh] overflow-y-auto no-scrollbar pt-8 pb-3" onClick={e => e.stopPropagation()}>{children}</div></div>;
}
function GameScreen({ save, update, world, level, onExit, onNext, seasonTheme }: { save: Save; update: (f: (s: Save) => Save) => void; world: WorldDef; level: number; onExit: () => void; onNext: () => void; seasonTheme: SeasonTheme }) {
  const lang = save.lang; const lv = useMemo(() => getLevel(world.id, level), [world.id, level]);
  const look: SparkyLook = { hat: save.hat, glasses: save.glasses, outfit: save.outfit, prop: seasonTheme.prop };
  const [tab, setTab] = useState<'blocks' | 'code'>(world.id >= 3 ? 'code' : 'blocks');
  const [blocks, setBlocks] = useState<BNode[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const starter = world.id >= 3 ? '# ' + tr(lang, world.goal) + '\n' : '';
  const [code, setCode] = useState(starter);
  const [st, setSt] = useState<BoardState>({ x: lv.sx, y: lv.sy, d: lv.sd, got: new Set(), key: false, anim: 'idle' });
  const [running, setRunning] = useState(false);
  const [line, setLine] = useState(0); const [errLine, setErrLine] = useState(0); const [runId, setRunId] = useState(-1);
  const [toast, setToast] = useState<string | null>(null);
  const [win, setWin] = useState<WinInfo | null>(null); const [fail, setFail] = useState<string | null>(null); const [paused, setPaused] = useState(false);
  const timers = useRef<number[]>([]); const taRef = useRef<HTMLTextAreaElement>(null);
  const best = save.stars[world.id][level] || 0;

  const reset = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; setRunning(false); setLine(0); setRunId(-1); setSt({ x: lv.sx, y: lv.sy, d: lv.sd, got: new Set(), key: false, anim: 'idle' }); }, [lv]);
  useEffect(() => { reset(); setBlocks([]); setActive(null); setCode(starter); setWin(null); setFail(null); setErrLine(0); /* eslint-disable-next-line */ }, [lv]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(null), 2600); };

  const insertCode = (snip: string) => {
    const ta = taRef.current; const p = ta ? ta.selectionStart : code.length;
    const ls = code.lastIndexOf('\n', p - 1) + 1; const curLine = code.slice(ls, code.indexOf('\n', p) === -1 ? code.length : code.indexOf('\n', p));
    let ind = curLine.match(/^\s*/)?.[0].length || 0; let txt: string; let pos = p;
    if (snip === 'and' || snip === 'or' || snip === 'not') { txt = ` ${snip} `; }
    else {
      if (snip === 'else:') ind = Math.max(0, ind - 4);
      const prevLine = code.slice(code.lastIndexOf('\n', ls - 2) + 1, Math.max(ls - 1, 0));
      if (!curLine.trim() && prevLine.trimEnd().endsWith(':') && ind === 0) ind = (prevLine.match(/^\s*/)?.[0].length || 0) + 4;
      if (curLine.trim()) { pos = ls + curLine.length; txt = '\n' + ' '.repeat(ind) + snip; }
      else { pos = ls; txt = ' '.repeat(ind) + snip; const end = ls + curLine.length; setCode(code.slice(0, pos) + txt + (snip.endsWith(':') ? '\n' + ' '.repeat(ind + 4) : '') + code.slice(end)); const np = pos + txt.length + (snip.endsWith(':') ? ind + 5 : 0); requestAnimationFrame(() => { if (ta) { ta.focus(); ta.selectionStart = ta.selectionEnd = np; } }); return; }
      if (snip.endsWith(':')) txt += '\n' + ' '.repeat(ind + 4);
    }
    const nc = code.slice(0, pos) + txt + code.slice(pos); setCode(nc);
    requestAnimationFrame(() => { if (ta) { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + txt.length; } });
  };
  const addCmd = (k: 'fwd' | 'left' | 'right' | 'jump' | 'loop' | 'if' | 'while') => {
    if (running) return; setErrLine(0);
    if (tab === 'code') {
      const map: Record<string, string> = { fwd: 'move_forward()', left: 'turn_left()', right: 'turn_right()', jump: 'jump()', loop: 'for i in range(3):', if: 'if path_ahead():', while: 'while not at_goal():' };
      insertCode(map[k]); return;
    }
    let nb: BNode;
    if (k === 'loop') nb = { id: nid(), k: 'loop', n: 3, body: [] };
    else if (k === 'if') nb = { id: nid(), k: 'if', cond: 'path_ahead', body: [] };
    else if (k === 'while') nb = { id: nid(), k: 'while', cond: 'not_at_goal', body: [] };
    else nb = { id: nid(), k: 'cmd', c: k };
    setBlocks(b => addToBlocks(b, active, nb));
    if (nb.k !== 'cmd') setActive(nb.id);
  };
  const switchTab = (t: 'blocks' | 'code') => {
    if (t === tab || running) return;
    if (t === 'code') { setCode(blocks.length ? blocksToPy(blocks) + '\n' : starter); setTab('code'); return; }
    try {
      const b = pyToBlocks(parsePython(code));
      if (!b) { flash(tr(lang, 'tooComplex')); return; }
      setBlocks(b); setActive(null); setTab('blocks');
    } catch (e) { if (e instanceof CodeError) { setErrLine(e.line); flash(`${tr(lang, 'syntax')} ${e.line}: ${e.message}`); } }
  };

  const run = () => {
    if (running) { reset(); return; }
    audio.ensure(); setErrLine(0);
    const src = tab === 'blocks' ? blocksToPy(blocks) : code;
    let prog: Stmt[];
    try { prog = parsePython(src); } catch (e) { if (e instanceof CodeError) { setErrLine(e.line); flash(`${tr(lang, 'syntax')} ${e.line}: ${e.message}`); audio.play('fail'); buzz([40, 40, 40]); } return; }
    if (!progUses(prog, s => s.k === 'cmd' || s.k === 'call')) { flash(tr(lang, 'emptyProg')); return; }
    const res = runProgram(lv, prog);
    if (res.error) { setErrLine(res.error.line); flash(`${tr(lang, 'syntax')} ${res.error.line}: ${res.error.msg}`); audio.play('fail'); return; }
    const lineMap = tab === 'blocks' ? blockLineMap(blocks) : [];
    reset(); setRunning(true);
    const speed = save.fast ? 210 : 420;
    let key = false; const got = new Set<string>();
    res.frames.forEach((f, i) => {
      timers.current.push(window.setTimeout(() => {
        if (f.got === 'star') { got.add(f.x + ',' + f.y); audio.play('star'); buzz(20); }
        else if (f.got === 'key') { key = true; audio.play('key'); buzz(20); }
        else if (f.got === 'door') audio.play('open');
        else if (f.fail) { /* Ton unten */ }
        else if (f.jump) audio.play('jump');
        else if (i > 0 && (f.x !== res.frames[i - 1].x || f.y !== res.frames[i - 1].y)) audio.play('move');
        else if (i === 0 && (f.x !== lv.sx || f.y !== lv.sy)) audio.play('move');
        else audio.play('turn');
        setSt({ x: f.x, y: f.y, d: f.d, got: new Set(got), key, anim: f.fail === 'fall' ? 'fall' : f.bump ? 'bump' : f.win ? 'win' : f.jump ? 'jump' : 'move' });
        setLine(f.line); setRunId(lineMap[f.line - 1] ?? -1);
        if (f.fail) { audio.play(f.fail === 'fall' ? 'fail' : 'crash'); buzz([60, 40, 60]); }
      }, i * speed + 150));
    });
    const endAt = res.frames.length * speed + 450;
    timers.current.push(window.setTimeout(() => {
      setRunning(false); setRunId(-1);
      if (res.win) {
        audio.play('win'); buzz([30, 30, 80]);
        const size = progSize(prog);
        const stars = 1 + (res.starsGot >= lv.stars.length ? 1 : 0) + (size <= lv.par ? 1 : 0);
        const first = !save.stars[world.id][level];
        const crystals = Math.max(0, stars - best) * 5 + (first ? 10 : 2);
        update(s => {
          const ws = s.stars.map((o, i) => (i === world.id ? { ...o, [level]: Math.max(o[level] || 0, stars) } : o));
          const un = s.unlocked.map((u, i) => (i === world.id ? Math.max(u, level + 1) : u));
          const usesFor = progUses(prog, x => x.k === 'for'), usesWhile = progUses(prog, x => x.k === 'while'), usesDef = progUses(prog, x => x.k === 'def');
          return { ...s, stars: ws, unlocked: un, crystals: s.crystals + crystals, stats: { ...s.stats, levels: s.stats.levels + (first ? 1 : 0), loops: s.stats.loops + (usesFor ? 1 : 0), whiles: s.stats.whiles + (usesWhile ? 1 : 0), defs: s.stats.defs + (usesDef ? 1 : 0), recursion: s.stats.recursion + (hasRecursion(prog) ? 1 : 0), python: s.stats.python + (tab === 'code' ? 1 : 0), earned: s.stats.earned + crystals, threeStars: s.stats.threeStars + (stars === 3 && best < 3 ? 1 : 0) } };
        });
        setWin({ stars, crystals, size, par: lv.par, first });
      } else {
        audio.play('fail');
        setFail(tr(lang, res.fail === 'crash' ? 'crash' : res.fail === 'fall' ? 'fall' : res.fail === 'door' ? 'door' : res.fail === 'tooLong' ? 'tooLong' : 'notGoal'));
      }
    }, endAt));
  };

  const hasKey = lv.grid.some(r => r.includes('k')); const hasJump = lv.grid.some(r => r.includes('~') || r.includes('#'));
  const goalKey: TKey = level <= 2 && world.id === 0 ? 'goalStars' : hasKey && world.id <= 2 ? 'goalKey' : hasJump && world.id === 0 ? 'goalJump' : world.goal;
  const ctrl: { k: 'fwd' | 'left' | 'right' | 'jump' | 'loop' | 'if' | 'while'; icon: React.ComponentType<{ className?: string }>; color: BtnColor }[] = [
    { k: 'fwd', icon: ArrowUp, color: 'blue' }, { k: 'left', icon: RotateCcw, color: 'purple' }, { k: 'right', icon: RotateCw, color: 'purple' }, { k: 'jump', icon: ChevronsUp, color: 'orange' },
    ...(world.blocks.includes('loop') ? [{ k: 'loop' as const, icon: Repeat, color: 'cyan' as BtnColor }] : []),
    ...(world.blocks.includes('if') ? [{ k: 'if' as const, icon: GitBranch, color: 'pink' as BtnColor }] : []),
    ...(world.blocks.includes('while') ? [{ k: 'while' as const, icon: RefreshCw, color: 'pink' as BtnColor }] : []),
  ];
  const tkey = (k: string): TKey => (k === 'if' ? 'ifb' : k === 'while' ? 'whileb' : k) as TKey;
  const night = world.id >= 2;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col">
      <SkyBackground sky={world.sky} particle={seasonTheme.particle} night={night} />
      {/* Kopfzeile */}
      <div className="relative z-10 flex items-center justify-between gap-2 px-3 pt-3">
        <IconBtn title={tr(lang, 'paused')} onClick={() => { reset(); setPaused(true); }}><Pause className="w-6 h-6" strokeWidth={3} /></IconBtn>
        <div className="flex-1 min-w-0 flex flex-col items-center">
          <div className={`gloss max-w-full px-4 py-0.5 rounded-2xl bg-gradient-to-b ${world.ribbon} border-4 border-amber-300 outline outline-[3px] outline-slate-900/80 shadow-[0_5px_0_rgba(0,0,0,0.4)]`}>
            <h1 className="relative font-game text-white txt-o-sm text-xl sm:text-3xl leading-tight truncate text-center">{tr(lang, world.key)}</h1>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3].map(i => <StarIcon key={i} on={i <= best} className="w-6 h-6 sm:w-8 sm:h-8" />)}
            <span className="ml-1 px-2 rounded-full bg-slate-900/70 border-2 border-white/30 font-game text-white text-xs sm:text-sm whitespace-nowrap">{tr(lang, 'level')} {level}{level > 15 ? ' ∞' : ''}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Counter icon={<GemIcon className="w-8 h-8" />} value={save.crystals} />
          <button onClick={() => { audio.play('tap'); update(s => ({ ...s, fast: !s.fast })); }} className={`flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-slate-900/70 font-game text-xs text-white ${save.fast ? 'bg-orange-500' : 'bg-slate-700/80'}`}><FastForward className="w-3.5 h-3.5" />{save.fast ? '2×' : '1×'}</button>
        </div>
      </div>
      {/* Spielfeld + Terminal */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col lg:flex-row gap-2 px-2 sm:px-3 pb-2">
        <div className="relative flex-1 min-h-[26vh] lg:min-h-0 flex items-center justify-center">
          <div className="w-full h-full max-w-3xl"><Board lv={lv} world={world} st={st} look={look} /></div>
          <div className="absolute left-1 bottom-1 max-w-[78%] flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl bg-gradient-to-b from-violet-600 to-indigo-900 border-4 border-slate-900/80 shadow-[0_4px_0_rgba(0,0,0,0.4)]">
            <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 border-[3px] border-slate-900 flex items-center justify-center"><Target className="w-5 h-5 text-slate-900" /></span>
            <span className="font-game text-white txt-o-xs text-sm sm:text-base leading-tight">{tr(lang, goalKey)}</span>
          </div>
        </div>
        <div className="lg:w-[46%] flex flex-col gap-2 min-h-0">
          <div className="flex-1 min-h-[22vh] max-h-[34vh] lg:max-h-none flex flex-col rounded-3xl border-4 border-slate-900/90 bg-gradient-to-b from-slate-800 to-slate-950 shadow-[0_8px_0_rgba(0,0,0,0.45)] overflow-hidden">
            <div className="flex items-center gap-1 p-1.5 bg-slate-900 border-b-4 border-slate-950">
              {(['blocks', 'code'] as const).map(t => <button key={t} onClick={() => { audio.play('tap'); switchTab(t); }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-[3px] font-game text-sm sm:text-base txt-o-xs ${tab === t ? 'bg-gradient-to-b from-yellow-300 to-amber-500 border-slate-950 text-white' : 'bg-slate-700 border-slate-600 text-slate-200'}`}>
                {t === 'blocks' ? <Blocks className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}{tr(lang, t === 'blocks' ? 'blocks' : 'livecode')}</button>)}
              <div className="ml-auto flex gap-1">
                <button title="Undo" onClick={() => { if (running) return; audio.play('tap'); tab === 'blocks' ? setBlocks(b => removeLast(b)) : setCode(c => c.replace(/\n?[^\n]*\n?$/, '\n').replace(/^\n$/, '')); }} className="w-8 h-8 rounded-lg bg-slate-700 border-2 border-slate-600 text-white flex items-center justify-center"><Undo2 className="w-4 h-4" /></button>
                <button title={tr(lang, 'clear')} onClick={() => { if (running) return; audio.play('tap'); setBlocks([]); setActive(null); setCode(starter); setErrLine(0); }} className="w-8 h-8 rounded-lg bg-red-600 border-2 border-red-800 text-white flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto p-2" onClick={() => tab === 'blocks' && setActive(null)}>
              {tab === 'blocks'
                ? (blocks.length ? <BlockList bs={blocks} lang={lang} active={active} setActive={setActive} onChange={setBlocks} runId={runId} />
                  : <div className="h-full flex flex-col items-center justify-center gap-1 text-center text-slate-300 font-ui font-bold text-sm"><Lightbulb className="w-7 h-7 text-yellow-300" />{tr(lang, 'blocksHint')}</div>)
                : <CodeEditor code={code} setCode={c => { setCode(c); setErrLine(0); }} activeLine={line} errLine={errLine} taRef={taRef} readOnly={running} />}
            </div>
            {tab === 'code' && <div className="flex gap-1.5 p-1.5 overflow-x-auto no-scrollbar bg-slate-900 border-t-4 border-slate-950" dir="ltr">
              {['⇥', '⇤', ...world.quick].map(q => <button key={q} onClick={() => {
                audio.play('tap');
                if (q === '⇥' || q === '⇤') {
                  const ta = taRef.current; const p = ta ? ta.selectionStart : code.length; const ls = code.lastIndexOf('\n', p - 1) + 1;
                  if (q === '⇥') { setCode(code.slice(0, ls) + '    ' + code.slice(ls)); requestAnimationFrame(() => { if (ta) { ta.focus(); ta.selectionStart = ta.selectionEnd = p + 4; } }); }
                  else { const n = (code.slice(ls).match(/^ {1,4}/)?.[0].length) || 0; setCode(code.slice(0, ls) + code.slice(ls + n)); requestAnimationFrame(() => { if (ta) { ta.focus(); ta.selectionStart = ta.selectionEnd = Math.max(ls, p - n); } }); }
                  return;
                }
                insertCode(q);
              }} className="shrink-0 px-2.5 py-1 rounded-lg bg-gradient-to-b from-slate-600 to-slate-800 border-2 border-slate-950 shadow-[0_3px_0_rgba(0,0,0,0.5)] active:translate-y-0.5 active:shadow-none font-code text-xs text-cyan-200 whitespace-nowrap">{q}</button>)}
            </div>}
          </div>
          {/* Daumen-Steuerung */}
          <div className="flex items-end gap-1.5 sm:gap-2">
            <div className="flex-1 grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${ctrl.length}, minmax(0,1fr))` }}>
              {ctrl.map(c => <button key={c.k} onClick={() => { audio.play('tap'); buzz(8); addCmd(c.k); }} disabled={running}
                className={`gloss flex flex-col items-center justify-center h-14 sm:h-16 rounded-2xl bg-gradient-to-b ${BTN[c.color]} border-4 border-slate-900/80 shadow-[0_5px_0_rgba(0,0,0,0.45)] active:translate-y-1 active:shadow-none disabled:opacity-60`}>
                <c.icon className="relative w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]" />
                <span className={`relative font-game text-white txt-o-xs text-[9px] sm:text-xs leading-none mt-0.5 max-w-full ${ctrl.length > 5 ? 'hidden sm:block' : ''}`}>{tr(lang, tkey(c.k))}</span>
              </button>)}
            </div>
            <Btn3D color={running ? 'red' : 'green'} onClick={run} className="h-14 sm:h-[72px] !px-3 sm:!px-6 !text-xl sm:!text-3xl shrink-0">
              {running ? <X className="w-7 h-7" strokeWidth={4} /> : <Play className="w-7 h-7 fill-white" />}{running ? '' : tr(lang, 'go')}
            </Btn3D>
          </div>
        </div>
      </div>
      {toast && <div className="fixed z-40 left-1/2 -translate-x-1/2 top-24 max-w-[90vw] a-pop px-4 py-2 rounded-2xl bg-gradient-to-b from-rose-500 to-red-700 border-4 border-slate-900/80 shadow-[0_6px_0_rgba(0,0,0,0.4)] font-game text-white txt-o-xs text-center">{toast}</div>}

      {win && <Modal>
        <Panel tone="violet" className="relative p-5 pt-8 text-center overflow-visible">
          <div className="absolute -top-6 left-0 right-0 flex justify-center"><Ribbon text={tr(lang, 'levelDone')} small color="from-lime-400 to-green-700" /></div>
          <div className="flex justify-center items-end gap-1 mt-6">
            {[1, 2, 3].map(i => <div key={i} className="a-pop" style={{ animationDelay: `${0.2 + i * 0.25}s` }}><StarIcon on={i <= win.stars} className={i === 2 ? 'w-24 h-24 -mb-1' : 'w-16 h-16'} /></div>)}
          </div>
          <div className="flex items-center justify-center gap-3 my-2">
            <Sparky look={{ ...look, mood: 'wow' }} className="w-28 h-28 a-float" />
            <div className="flex flex-col gap-2">
              <Counter icon={<GemIcon className="w-9 h-9" />} value={`+${win.crystals}`} />
              <div className="font-ui font-black text-xs text-white/90 bg-slate-900/50 rounded-xl px-2 py-1 text-left">{tr(lang, 'yourCode')}: <b className="text-yellow-300">{win.size}</b><br />{tr(lang, 'par')}: <b className="text-lime-300">≤ {win.par}</b></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Btn3D small color="blue" onClick={() => { setWin(null); reset(); }}><RotateCcw className="w-5 h-5" /></Btn3D>
            <Btn3D small color="purple" onClick={onExit}><MapIcon className="w-5 h-5" /></Btn3D>
            <Btn3D small color="green" onClick={() => { setWin(null); onNext(); }}>{tr(lang, 'next')}<ArrowRight className="w-5 h-5 rtl:rotate-180" /></Btn3D>
          </div>
        </Panel>
      </Modal>}
      {fail && <Modal onClose={() => { setFail(null); reset(); }}>
        <Panel tone="blue" className="p-5 text-center">
          <Sparky look={{ ...look, mood: 'sad' }} className="w-28 h-28 mx-auto a-float" />
          <p className="font-game text-white txt-o-sm text-2xl my-3">{fail}</p>
          <div className="grid grid-cols-2 gap-2">
            <Btn3D small color="purple" onClick={onExit}><MapIcon className="w-5 h-5" />{tr(lang, 'map')}</Btn3D>
            <Btn3D small color="green" onClick={() => { setFail(null); reset(); }}><RotateCcw className="w-5 h-5" />{tr(lang, 'tryAgain')}</Btn3D>
          </div>
        </Panel>
      </Modal>}
      {paused && <Modal onClose={() => setPaused(false)}>
        <Panel tone="violet" className="relative p-5 pt-10">
          <div className="absolute -top-6 left-0 right-0 flex justify-center"><Ribbon text={tr(lang, 'paused')} small /></div>
          <div className="flex flex-col gap-3 mt-2">
            <Btn3D color="green" onClick={() => setPaused(false)}><Play className="w-6 h-6 fill-white" />{tr(lang, 'resume')}</Btn3D>
            <Btn3D color="blue" onClick={() => { setPaused(false); reset(); }}><RotateCcw className="w-6 h-6" />{tr(lang, 'restart')}</Btn3D>
            <Btn3D color="purple" onClick={onExit}><MapIcon className="w-6 h-6" />{tr(lang, 'toMap')}</Btn3D>
            <div className="grid grid-cols-2 gap-3">
              <Btn3D small color={save.music ? 'cyan' : 'gray'} onClick={() => update(s => ({ ...s, music: !s.music }))}><Music className="w-5 h-5" />{save.music ? 'ON' : 'OFF'}</Btn3D>
              <Btn3D small color={save.sound ? 'cyan' : 'gray'} onClick={() => update(s => ({ ...s, sound: !s.sound }))}>{save.sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}{save.sound ? 'ON' : 'OFF'}</Btn3D>
            </div>
          </div>
        </Panel>
      </Modal>}
    </div>
  );
}

/* ============================================================================
 * 16) GEMEINSAME KOPFZEILE
 * ========================================================================== */
type Screen = 'home' | 'map' | 'game' | 'knowledge' | 'trophies' | 'costume' | 'settings' | 'language' | 'daily';
function TopBar({ save, onBack, onSettings, onLang }: { save: Save; onBack?: () => void; onSettings: () => void; onLang: () => void }) {
  const L = LANGS.find(l => l.id === save.lang)!;
  return (
    <div className="relative z-20 flex items-center gap-2 px-3 pt-3">
      {onBack ? <IconBtn title="Back" color="gray" className="!from-white !via-slate-100 !to-slate-300 !text-indigo-700" onClick={onBack}><ChevronLeft className="w-7 h-7 text-indigo-700 rtl:rotate-180" strokeWidth={4} /></IconBtn>
        : <IconBtn title="Home" color="gray" className="!from-white !via-slate-100 !to-slate-300" onClick={onLang}><Globe className="w-7 h-7 text-indigo-700" strokeWidth={3} /></IconBtn>}
      <button onClick={() => { audio.play('tap'); onLang(); }} className="shrink-0 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.35)] active:translate-y-0.5"><FlagIcon id={L.id} className="w-11 h-11 sm:w-12 sm:h-12" /></button>
      <div className="flex-1" />
      <Counter icon={<StarIcon className="w-9 h-9" />} value={totalStars(save)} />
      <Counter icon={<GemIcon className="w-9 h-9" />} value={save.crystals} color="from-cyan-800 to-indigo-950" />
      <IconBtn title={tr(save.lang, 'settings')} color="gray" className="!from-white !via-slate-100 !to-slate-300" onClick={onSettings}><Settings className="w-7 h-7 text-indigo-700" strokeWidth={3} /></IconBtn>
    </div>
  );
}
function ScreenShell({ children, save, theme, onBack, onSettings, onLang, title, sub, night }: { children: React.ReactNode; save: Save; theme: SeasonTheme; onBack?: () => void; onSettings: () => void; onLang: () => void; title?: string; sub?: string; night?: boolean }) {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden">
      <div className="fixed inset-0"><SkyBackground sky={theme.sky} particle={theme.particle} night={night} /></div>
      <TopBar save={save} onBack={onBack} onSettings={onSettings} onLang={onLang} />
      {title && <div className="relative z-10 mt-2 px-4"><Ribbon text={title} sub={sub} /></div>}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ============================================================================
 * 17) WELT-AUSWAHL (Hauptbildschirm)
 * ========================================================================== */
const WORLD_DECOR = [Leaf, Gem, Crown, Cpu, Atom];
function HomeScreen({ save, theme, season, go, openWorld }: { save: Save; theme: SeasonTheme; season: SeasonId; go: (s: Screen) => void; openWorld: (w: number) => void }) {
  const lang = save.lang; const look: SparkyLook = { hat: save.hat, glasses: save.glasses, outfit: save.outfit, prop: theme.prop };
  const dailyReady = save.lastSpin !== todayStr() || save.lastClaim !== todayStr();
  const night = ['ramadan', 'halloween', 'christmas'].includes(season);
  const SI = theme.icon;
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = scroller.current; if (el && save.seenWorld) { const c = el.children[save.seenWorld] as HTMLElement | undefined; c?.scrollIntoView({ inline: 'center', block: 'nearest' }); } }, [save.seenWorld]);
  return (
    <ScreenShell save={save} theme={theme} onSettings={() => go('settings')} onLang={() => go('language')} title={tr(lang, 'worldSelect')} sub={tr(lang, 'worldSub')} night={night}>
      {season !== 'none' && <div className="flex justify-center mt-3 px-4">
        <div className={`a-pop flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-b ${theme.accent} border-4 border-slate-900/80 shadow-[0_4px_0_rgba(0,0,0,0.35)]`}>
          <SI className="w-5 h-5 text-white" /><span className="font-game text-white txt-o-xs text-base sm:text-lg">{tr(lang, ('s_' + season) as TKey)}</span><Sparkles className="w-4 h-4 text-yellow-200" />
        </div></div>}
      <div ref={scroller} className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[8vw] sm:px-6 pt-8 pb-6 lg:justify-center" dir="ltr">
        {WORLDS.map((w, i) => {
          const stars = worldStars(save, i); const D = WORLD_DECOR[i];
          return (
            <div key={i} className="snap-center shrink-0 w-[72vw] max-w-[250px] sm:w-[220px] a-pop" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`relative rounded-[28px] p-1.5 bg-gradient-to-b ${w.card} border-4 border-slate-900/80 shadow-[0_10px_0_rgba(0,0,0,0.4)] ring-4 ${w.frame} ring-offset-0`}>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 w-14 h-14 rounded-2xl bg-gradient-to-b from-white to-slate-200 border-4 border-slate-900/80 shadow-[0_4px_0_rgba(0,0,0,0.35)] flex items-center justify-center rotate-45">
                  <D className="w-7 h-7 -rotate-45 text-indigo-700" />
                </div>
                <div className="relative rounded-[22px] overflow-hidden border-4 border-slate-900/70 aspect-[4/5] bg-slate-900">
                  <WorldArt w={i} />
                  {i === 1 && <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-24"><Sparky look={{ ...look, hat: 'hat_crown' }} className="w-24 h-24 a-float" /></div>}
                  <div className="absolute top-2 inset-x-2 flex flex-col items-center">
                    <div className={`px-3 py-0.5 rounded-xl bg-gradient-to-b ${w.ribbon} border-[3px] border-slate-900/80 shadow-[0_3px_0_rgba(0,0,0,0.4)]`}><span className="font-game text-white txt-o-sm text-xl whitespace-nowrap">{tr(lang, w.key)}</span></div>
                    <span className="mt-1 px-2 rounded-full bg-slate-900/60 font-game text-white text-sm">({w.ages} {tr(lang, 'years')})</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                    <div className="flex items-center gap-1 pl-0.5 pr-3 rounded-full bg-slate-900/75 border-2 border-white/20"><StarIcon className="w-8 h-8" /><span className="font-game text-white text-lg">{stars} / 45 <span className="text-cyan-300">+∞</span></span></div>
                  </div>
                </div>
                <Btn3D className="w-full mt-2" onClick={() => openWorld(i)}>{tr(lang, 'play')}</Btn3D>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative flex items-end justify-center gap-2 px-3 pb-28 lg:pb-2">
        <Sparky look={look} className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 a-float -mb-2" />
        <Panel className="flex items-center gap-2 px-4 py-2 mb-4"><Lightbulb className="w-8 h-8 text-yellow-300 shrink-0 drop-shadow" /><span className="font-game text-yellow-100 txt-o-xs text-lg sm:text-2xl">{tr(lang, 'slogan')}</span></Panel>
      </div>
      {/* Untere Navigation */}
      <div className="fixed lg:sticky bottom-0 inset-x-0 z-30 px-3 pb-3">
        <div className="mx-auto max-w-xl grid grid-cols-4 gap-2 p-2 rounded-3xl bg-gradient-to-b from-indigo-600 to-indigo-900 border-4 border-slate-900/80 shadow-[0_6px_0_rgba(0,0,0,0.4)]">
          {([['knowledge', BookOpen, 'from-sky-300 to-blue-600'], ['trophies', Trophy, 'from-yellow-300 to-amber-600'], ['costume', Shirt, 'from-pink-300 to-fuchsia-600'], ['daily', Gift, 'from-lime-300 to-green-600']] as const).map(([s, I, c]) =>
            <button key={s} onClick={() => { audio.play('tap'); go(s); }} className="relative flex flex-col items-center gap-0.5 active:translate-y-0.5">
              <span className={`gloss w-12 h-12 rounded-2xl bg-gradient-to-b ${c} border-[3px] border-slate-900/80 shadow-[0_4px_0_rgba(0,0,0,0.4)] flex items-center justify-center`}><I className="relative w-7 h-7 text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]" /></span>
              <span className="font-game text-white txt-o-xs text-xs sm:text-sm whitespace-nowrap">{tr(lang, s as TKey)}</span>
              {s === 'daily' && dailyReady && <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-red-500 border-2 border-white animate-bounce" />}
            </button>)}
        </div>
      </div>
    </ScreenShell>
  );
}

/* ============================================================================
 * 18) ABENTEUER-KARTE mit schwebendem Pfad und Level-Inseln
 * ========================================================================== */
function MapScreen({ save, world, theme, go, play }: { save: Save; world: WorldDef; theme: SeasonTheme; go: (s: Screen) => void; play: (l: number) => void }) {
  const lang = save.lang; const un = save.unlocked[world.id]; const count = Math.max(15, un + 6);
  const STEP = 118; const W = 340; const xs = (i: number) => W / 2 + Math.sin(i * 0.9) * 105;
  const H = count * STEP + 330; const cur = useRef<HTMLDivElement>(null);
  useEffect(() => { cur.current?.scrollIntoView({ block: 'center' }); }, []);
  const look: SparkyLook = { hat: save.hat, glasses: save.glasses, outfit: save.outfit, prop: theme.prop };
  const ws = worldStars(save, world.id);
  const pts = Array.from({ length: count }, (_, i) => [xs(i), H - 280 - i * STEP]); // Level 1 unten, nach oben weiter
  const pathD = pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `Q${(pts[i - 1][0] + p[0]) / 2 + (i % 2 ? 60 : -60)} ${p[1] + STEP / 2} ${p[0]} ${p[1]}`)).join(' ');
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden">
      <div className="fixed inset-0"><SkyBackground sky={world.sky} particle={theme.particle} night={world.id >= 2} /></div>
      <div className="sticky top-0 z-30 pb-2 bg-gradient-to-b from-slate-900/40 to-transparent">
        <TopBar save={save} onBack={() => go('home')} onSettings={() => go('settings')} onLang={() => go('language')} />
        <div className="flex justify-center -mt-1"><div className="flex flex-col items-center">
          <Ribbon text={tr(lang, world.key)} small color={world.ribbon} />
          <div className="-mt-1 z-10 flex items-center gap-1 pl-1 pr-3 rounded-full bg-gradient-to-b from-amber-700 to-amber-900 border-4 border-slate-900/80"><StarIcon className="w-7 h-7" /><span className="font-game text-white text-lg">{ws} / 45</span></div>
        </div></div>
      </div>
      <div className="relative z-10 mx-auto" style={{ width: W, height: H }}>
        <svg className="absolute inset-0" width={W} height={H}>
          <path d={pathD} stroke="#1e1240" strokeWidth="30" fill="none" strokeLinecap="round" opacity=".55" />
          <path d={pathD} stroke="#fde68a" strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d={pathD} stroke="#f59e0b" strokeWidth="4" fill="none" strokeDasharray="2 18" strokeLinecap="round" />
        </svg>
        {pts.map(([x, y], i) => {
          const l = i + 1; const locked = l > un; const s = save.stars[world.id][l] || 0; const isCur = l === un;
          return (
            <div key={l} ref={isCur ? cur : undefined} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
              <FloatIsland className="absolute -left-12 -top-2 w-36 opacity-95 -z-10" color={world.id >= 3 ? '#7c3aed' : world.id === 1 ? '#bae6fd' : '#4ade80'} />
              {isCur && <div className="absolute -top-14 left-1/2 -translate-x-1/2 a-float"><svg viewBox="0 0 40 40" className="w-10 h-10"><path d="M12 4h16v16h8L20 36 4 20h8z" fill="#facc15" stroke="#1e1240" strokeWidth="3" strokeLinejoin="round" /></svg></div>}
              <button disabled={locked} onClick={() => { audio.play('tap'); buzz(10); play(l); }}
                className={`gloss relative w-20 h-[72px] rounded-[50%] border-4 border-slate-900/80 shadow-[0_8px_0_rgba(0,0,0,0.45)] active:translate-y-1 active:shadow-none flex items-center justify-center bg-gradient-to-b ${locked ? 'from-slate-300 to-slate-500' : isCur ? 'from-yellow-200 via-yellow-400 to-amber-600 ring-4 ring-yellow-200/70' : l > 15 ? 'from-fuchsia-300 via-fuchsia-500 to-purple-700' : 'from-sky-300 via-blue-500 to-blue-700'}`}>
                {locked ? <Lock className="relative w-8 h-8 text-slate-700" strokeWidth={3} /> : <span className="relative font-game text-white txt-o text-3xl">{l}</span>}
              </button>
              {!locked && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex">{[1, 2, 3].map(k => <StarIcon key={k} on={k <= s} className={`w-7 h-7 ${k === 2 ? '-mt-1' : ''}`} />)}</div>}
              {l === 16 && <div className="absolute -left-28 top-0 px-2 py-1 rounded-xl bg-gradient-to-b from-fuchsia-500 to-purple-800 border-[3px] border-slate-900/80 font-game text-white txt-o-xs text-xs flex items-center gap-1"><InfinityIcon className="w-4 h-4" />{tr(lang, 'endless')}</div>}
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-3 left-2 z-30 flex items-end gap-1 pointer-events-none">
        <Sparky look={look} className="w-24 h-24 a-float" />
        <div className="mb-14 -ml-2 px-3 py-2 max-w-[11rem] rounded-2xl bg-white border-4 border-slate-900/80 shadow-[0_4px_0_rgba(0,0,0,0.35)] font-game text-indigo-900 text-sm leading-tight">{tr(lang, 'speech')}</div>
      </div>
      <div className="fixed bottom-3 right-3 z-30"><Btn3D color="green" onClick={() => play(un)}><Play className="w-6 h-6 fill-white" />{tr(lang, 'level')} {un}</Btn3D></div>
    </div>
  );
}

/* ============================================================================
 * 19) CODE-WISSEN (Sammelalbum)
 * ========================================================================== */
function KnowledgeScreen({ save, theme, go }: { save: Save; theme: SeasonTheme; go: (s: Screen) => void }) {
  const lang = save.lang; const [open, setOpen] = useState<KCard | null>(null);
  const got = (c: KCard) => !!save.stars[c.w][c.l];
  const n = KCARDS.filter(got).length;
  return (
    <ScreenShell save={save} theme={theme} onBack={() => go('home')} onSettings={() => go('settings')} onLang={() => go('language')} title={tr(lang, 'knowledge')} sub={`${tr(lang, 'knowledgeSub')} ${n}/${KCARDS.length}`}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pb-10 max-w-4xl mx-auto">
        {KCARDS.map((c, i) => {
          const ok = got(c); const I = c.icon;
          return (
            <button key={c.id} onClick={() => { audio.play('tap'); if (ok) setOpen(c); }} className="a-pop text-left active:translate-y-1" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={`relative rounded-3xl p-1.5 border-4 border-slate-900/80 shadow-[0_8px_0_rgba(0,0,0,0.4)] bg-gradient-to-b ${ok ? c.color : 'from-slate-400 to-slate-600'}`}>
                <div className="rounded-2xl bg-slate-950/30 border-[3px] border-white/40 p-3 flex flex-col items-center gap-2 aspect-[3/4] justify-center">
                  <span className="w-16 h-16 rounded-full bg-white/90 border-4 border-slate-900/80 flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.3)]">{ok ? <I className="w-9 h-9 text-indigo-700" /> : <Lock className="w-8 h-8 text-slate-500" />}</span>
                  <span className="font-game text-white txt-o-xs text-lg text-center leading-tight">{ok ? ml(lang, c.name) : '???'}</span>
                  {!ok && <span className="font-ui font-black text-[11px] text-white/90 text-center">{tr(lang, 'unlockAt')} {tr(lang, WORLDS[c.w].key)} · {tr(lang, 'level')} {c.l}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {open && <Modal onClose={() => setOpen(null)}>
        <div className={`rounded-3xl p-2 border-4 border-slate-900/80 shadow-[0_8px_0_rgba(0,0,0,0.4)] bg-gradient-to-b ${open.color}`}>
          <div className="rounded-2xl bg-slate-950/30 border-[3px] border-white/40 p-4 flex flex-col items-center gap-3">
            <span className="w-20 h-20 rounded-full bg-white border-4 border-slate-900/80 flex items-center justify-center"><open.icon className="w-11 h-11 text-indigo-700" /></span>
            <h2 className="font-game text-white txt-o text-3xl text-center">{ml(lang, open.name)}</h2>
            <p className="font-ui font-black text-white text-lg text-center drop-shadow">{ml(lang, open.desc)}</p>
            <pre dir="ltr" className="w-full font-code text-sm p-3 rounded-2xl bg-slate-950 border-4 border-slate-900 text-left overflow-x-auto">{open.code.split('\n').map((l, i) => <div key={i}>{highlightPy(l)}</div>)}</pre>
            <Btn3D small color="green" onClick={() => setOpen(null)}><Check className="w-5 h-5" />OK</Btn3D>
          </div>
        </div>
      </Modal>}
    </ScreenShell>
  );
}

/* ============================================================================
 * 20) ERFOLGE & TROPHÄEN
 * ========================================================================== */
function TrophyScreen({ save, update, theme, go }: { save: Save; update: (f: (s: Save) => Save) => void; theme: SeasonTheme; go: (s: Screen) => void }) {
  const lang = save.lang;
  return (
    <ScreenShell save={save} theme={theme} onBack={() => go('home')} onSettings={() => go('settings')} onLang={() => go('language')} title={tr(lang, 'trophies')} sub={`${ACHS.filter(a => a.val(save) >= a.goal).length} / ${ACHS.length}`}>
      <div className="flex flex-col gap-3 p-4 pb-10 max-w-2xl mx-auto">
        {ACHS.map((a, i) => {
          const v = Math.min(a.val(save), a.goal); const done = v >= a.goal; const claimed = save.achClaimed.includes(a.id); const I = a.icon;
          return (
            <Panel key={a.id} tone={done ? 'gold' : 'violet'} className="a-pop flex items-center gap-3 p-3" >
              <span className={`w-14 h-14 shrink-0 rounded-2xl border-4 border-slate-900/80 flex items-center justify-center ${done ? 'bg-gradient-to-b from-yellow-200 to-amber-500' : 'bg-slate-700'}`}><I className={`w-8 h-8 ${done ? 'text-amber-900' : 'text-slate-400'}`} /></span>
              <div className="flex-1 min-w-0">
                <div className="font-game text-white txt-o-xs text-lg leading-tight">{ml(lang, a.name)}</div>
                <div className="font-ui font-black text-white/90 text-xs">{ml(lang, a.desc)}</div>
                <div className="mt-1 h-4 rounded-full bg-slate-900/70 border-2 border-slate-900 overflow-hidden relative">
                  <div className="h-full bg-gradient-to-b from-lime-300 to-green-600" style={{ width: `${(v / a.goal) * 100}%` }} />
                  <span className="absolute inset-0 text-center font-game text-[11px] text-white leading-3">{v}/{a.goal}</span>
                </div>
              </div>
              {done && !claimed ? <Btn3D small color="green" onClick={() => { audio.play('coin'); update(s => ({ ...s, crystals: s.crystals + a.reward, achClaimed: [...s.achClaimed, a.id] })); }}><GemIcon className="w-5 h-5" />+{a.reward}</Btn3D>
                : <span className="flex items-center gap-1 font-game text-white txt-o-xs">{claimed ? <Check className="w-7 h-7 text-lime-300" strokeWidth={4} /> : <><GemIcon className="w-6 h-6" />{a.reward}</>}</span>}
            </Panel>
          );
        })}
      </div>
    </ScreenShell>
  );
}

/* ============================================================================
 * 21) KOSTÜM-EDITOR
 * ========================================================================== */
function CostumeScreen({ save, update, theme, go }: { save: Save; update: (f: (s: Save) => Save) => void; theme: SeasonTheme; go: (s: Screen) => void }) {
  const lang = save.lang; const [slot, setSlot] = useState<'hat' | 'glasses' | 'outfit'>('hat'); const [msg, setMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<Item | null>(null);
  const look: SparkyLook = { hat: save.hat, glasses: save.glasses, outfit: save.outfit, prop: theme.prop, ...(preview ? { [preview.slot]: preview.id } : {}) };
  const equipped = (it: Item) => save[it.slot] === it.id;
  const act = (it: Item) => {
    if (save.owned.includes(it.id)) { audio.play('tap'); update(s => ({ ...s, [it.slot]: it.id })); setPreview(null); return; }
    if (save.crystals < it.price) { audio.play('fail'); setMsg(tr(lang, 'notEnough')); setTimeout(() => setMsg(null), 1800); return; }
    audio.play('unlock'); buzz([20, 30, 20]);
    update(s => ({ ...s, crystals: s.crystals - it.price, owned: [...s.owned, it.id], [it.slot]: it.id, stats: { ...s.stats, bought: s.stats.bought + 1 } })); setPreview(null);
  };
  return (
    <ScreenShell save={save} theme={theme} onBack={() => go('home')} onSettings={() => go('settings')} onLang={() => go('language')} title={tr(lang, 'costume')}>
      <div className="max-w-3xl mx-auto p-4 pb-10 flex flex-col lg:flex-row gap-4">
        <Panel tone="blue" className="relative lg:w-72 shrink-0 flex flex-col items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-x-6 bottom-6 h-10 rounded-[50%] bg-slate-900/40" />
          <div className="absolute w-56 h-56 rounded-full bg-white/20 a-spin" style={{ background: 'conic-gradient(from 0deg, rgba(255,255,255,.25) 0 10deg, transparent 10deg 30deg)' }} />
          <Sparky look={look} className="relative w-52 h-52 a-float" />
        </Panel>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(['hat', 'glasses', 'outfit'] as const).map(s => <Btn3D key={s} small color={slot === s ? 'orange' : 'blue'} onClick={() => setSlot(s)}>{s === 'hat' ? <Crown className="w-5 h-5" /> : s === 'glasses' ? <Eye className="w-5 h-5" /> : <Shirt className="w-5 h-5" />}<span className="hidden sm:inline">{tr(lang, s === 'hat' ? 'hats' : s === 'glasses' ? 'glasses' : 'outfits')}</span></Btn3D>)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ITEMS.filter(i => i.slot === slot).map(it => {
              const own = save.owned.includes(it.id); const eq = equipped(it);
              return (
                <div key={it.id} onClick={() => { audio.play('tap'); setPreview(it); }} className={`a-pop cursor-pointer rounded-3xl p-1.5 border-4 border-slate-900/80 shadow-[0_6px_0_rgba(0,0,0,0.4)] bg-gradient-to-b ${eq ? 'from-lime-300 to-green-600' : preview?.id === it.id ? 'from-yellow-200 to-amber-500' : 'from-violet-400 to-indigo-700'}`}>
                  <div className="rounded-2xl bg-white/85 border-[3px] border-slate-900/60 h-24 flex items-center justify-center overflow-hidden">
                    <Sparky look={{ hat: it.slot === 'hat' ? it.id : 'hat_none', glasses: it.slot === 'glasses' ? it.id : 'gl_goggles', outfit: it.slot === 'outfit' ? it.id : 'out_scarf' }} className={`w-24 h-24 ${it.slot === 'outfit' ? 'mt-0' : it.slot === 'hat' ? 'mt-10 scale-125' : 'mt-14 scale-150'}`} />
                  </div>
                  <div className="font-game text-white txt-o-xs text-sm text-center mt-1 leading-tight min-h-[2.2em] flex items-center justify-center">{ml(lang, it.name)}</div>
                  <button onClick={e => { e.stopPropagation(); act(it); }} className={`gloss w-full mt-1 py-1 rounded-full border-[3px] border-slate-900/80 font-game text-white txt-o-xs text-sm flex items-center justify-center gap-1 shadow-[0_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 active:shadow-none bg-gradient-to-b ${eq ? 'from-slate-300 to-slate-500' : own ? 'from-sky-300 to-blue-600' : 'from-lime-300 to-green-600'}`}>
                    <span className="relative flex items-center gap-1">{eq ? <><Check className="w-4 h-4" />{tr(lang, 'equipped')}</> : own ? tr(lang, 'equip') : <><GemIcon className="w-5 h-5" />{it.price}</>}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {msg && <div className="fixed z-40 left-1/2 -translate-x-1/2 top-24 a-pop px-4 py-2 rounded-2xl bg-gradient-to-b from-rose-500 to-red-700 border-4 border-slate-900/80 font-game text-white txt-o-xs">{msg}</div>}
    </ScreenShell>
  );
}

/* ============================================================================
 * 22) TÄGLICHE BELOHNUNG: Glücksrad + 7-Tage-Login-Truhe
 * ========================================================================== */
const WHEEL: { v: number | 'item'; c: string }[] = [
  { v: 10, c: '#22c55e' }, { v: 25, c: '#3b82f6' }, { v: 15, c: '#f59e0b' }, { v: 50, c: '#ec4899' },
  { v: 20, c: '#8b5cf6' }, { v: 100, c: '#ef4444' }, { v: 30, c: '#06b6d4' }, { v: 'item', c: '#facc15' },
];
const LOGIN = [20, 30, 40, 50, 60, 80, 150];
function DailyScreen({ save, update, theme, go }: { save: Save; update: (f: (s: Save) => Save) => void; theme: SeasonTheme; go: (s: Screen) => void }) {
  const lang = save.lang; const today = todayStr(); const [rot, setRot] = useState(0); const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const canSpin = save.lastSpin !== today;
  // Streak berechnen: gestern abgeholt → weiter, sonst zurück auf Tag 1
  const streakNow = save.lastClaim && dayDiff(save.lastClaim, today) === 1 ? save.streak % 7 : save.lastClaim === today ? save.streak : 0;
  const canClaim = save.lastClaim !== today;
  const shownDay = canClaim ? streakNow : (save.streak - 1 + 7) % 7; // Index des (heutigen) Tages
  const giveItem = (s: Save): [Save, string] => {
    const left = ITEMS.filter(i => !s.owned.includes(i.id));
    if (!left.length) return [{ ...s, crystals: s.crystals + 80 }, '+80'];
    const it = left[Math.floor(Math.random() * left.length)];
    return [{ ...s, owned: [...s.owned, it.id] }, `${tr(lang, 'newItem')} ${ml(lang, it.name)}`];
  };
  const spin = () => {
    if (!canSpin || spinning) return; audio.ensure();
    const idx = Math.floor(Math.random() * WHEEL.length); const seg = 360 / WHEEL.length;
    const target = rot + 360 * 6 + (360 - (rot % 360)) - idx * seg - seg / 2; setRot(target); setSpinning(true);
    let t = 0; const tick = window.setInterval(() => { audio.play('tick'); if ((t += 1) > 26) clearInterval(tick); }, 140);
    window.setTimeout(() => {
      setSpinning(false); audio.play('win'); buzz([40, 30, 80]);
      const p = WHEEL[idx].v;
      update(s => {
        let ns: Save = { ...s, lastSpin: today, stats: { ...s.stats, spins: s.stats.spins + 1 } };
        if (p === 'item') { const [n2, txt] = giveItem(ns); ns = n2; setPrize(txt); } else { ns = { ...ns, crystals: ns.crystals + p, stats: { ...ns.stats, earned: ns.stats.earned + p } }; setPrize(`+${p}`); }
        return ns;
      });
    }, 4300);
  };
  const claim = () => {
    if (!canClaim) return; audio.play('unlock'); buzz([30, 30, 30]);
    const day = streakNow; const amount = LOGIN[day];
    update(s => {
      let ns: Save = { ...s, lastClaim: today, streak: day + 1, crystals: s.crystals + amount, stats: { ...s.stats, earned: s.stats.earned + amount, maxStreak: Math.max(s.stats.maxStreak, day + 1) } };
      let txt = `+${amount}`;
      if (day === 6) { const [n2, t2] = giveItem(ns); ns = n2; txt += ' · ' + t2; }
      setPrize(txt); return ns;
    });
  };
  const seg = 360 / WHEEL.length;
  return (
    <ScreenShell save={save} theme={theme} onBack={() => go('home')} onSettings={() => go('settings')} onLang={() => go('language')} title={tr(lang, 'dailyTitle')}>
      <div className="max-w-4xl mx-auto p-4 pb-10 grid lg:grid-cols-2 gap-6">
        <Panel tone="violet" className="p-4 flex flex-col items-center">
          <h2 className="font-game text-white txt-o-sm text-3xl mb-2">{tr(lang, 'wheel')}</h2>
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-b from-amber-300 to-orange-600 border-4 border-slate-900/80 shadow-[0_8px_0_rgba(0,0,0,0.4)]" />
            {Array.from({ length: 16 }, (_, i) => <span key={i} className="absolute w-3 h-3 rounded-full bg-yellow-100 border-2 border-amber-700 a-twinkle" style={{ left: `calc(50% + ${Math.cos((i / 16) * Math.PI * 2) * 52}% - 6px)`, top: `calc(50% + ${Math.sin((i / 16) * Math.PI * 2) * 52}% - 6px)`, animationDelay: `${-i * 0.15}s` }} />)}
            <svg viewBox="-100 -100 200 200" className="relative w-full h-full" style={{ transform: `rotate(${rot}deg)`, transition: spinning ? 'transform 4.2s cubic-bezier(.15,.85,.25,1)' : 'none' }}>
              {WHEEL.map((w, i) => {
                const a0 = (i * seg - 90) * Math.PI / 180, a1 = ((i + 1) * seg - 90) * Math.PI / 180; const am = (a0 + a1) / 2;
                return <g key={i}>
                  <path d={`M0 0 L${Math.cos(a0) * 96} ${Math.sin(a0) * 96} A96 96 0 0 1 ${Math.cos(a1) * 96} ${Math.sin(a1) * 96}Z`} fill={w.c} stroke="#1e1240" strokeWidth="3" />
                  <g transform={`translate(${Math.cos(am) * 62} ${Math.sin(am) * 62}) rotate(${(i + 0.5) * seg})`}>
                    {w.v === 'item' ? <g transform="translate(-12 -12)"><rect x="2" y="8" width="20" height="16" rx="2" fill="#ec4899" stroke="#1e1240" strokeWidth="2.5" /><rect x="0" y="4" width="24" height="6" rx="2" fill="#f472b6" stroke="#1e1240" strokeWidth="2.5" /><path d="M12 4 v20" stroke="#facc15" strokeWidth="4" /></g>
                      : <text textAnchor="middle" dominantBaseline="middle" className="font-game" fontSize="20" fill="#fff" stroke="#1e1240" strokeWidth="4" paintOrder="stroke">{w.v}</text>}
                  </g>
                </g>;
              })}
              <circle r="20" fill="url(#hub)" stroke="#1e1240" strokeWidth="4" />
              <defs><radialGradient id="hub" cx=".4" cy=".35"><stop offset="0" stopColor="#fef9c3" /><stop offset="1" stopColor="#f59e0b" /></radialGradient></defs>
            </svg>
            <svg viewBox="0 0 40 46" className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-12 drop-shadow-[0_3px_0_rgba(0,0,0,0.4)]"><path d="M4 4 H36 L20 42 Z" fill="#ef4444" stroke="#1e1240" strokeWidth="4" strokeLinejoin="round" /></svg>
          </div>
          <Btn3D className="mt-6 w-60" color={canSpin ? 'green' : 'gray'} disabled={!canSpin || spinning} onClick={spin}>{canSpin ? tr(lang, 'spin') : tr(lang, 'tomorrow')}</Btn3D>
        </Panel>
        <Panel tone="blue" className="p-4">
          <h2 className="font-game text-white txt-o-sm text-3xl mb-3 text-center">{tr(lang, 'login7')}</h2>
          <div className="grid grid-cols-4 gap-2">
            {LOGIN.map((amt, i) => {
              const done = canClaim ? i < streakNow : i < save.streak; const isToday = i === shownDay; const big = i === 6;
              return (
                <div key={i} className={`${big ? 'col-span-2' : ''} rounded-2xl p-1 border-4 border-slate-900/80 shadow-[0_5px_0_rgba(0,0,0,0.4)] bg-gradient-to-b ${done ? 'from-lime-300 to-green-600' : isToday ? 'from-yellow-200 to-amber-500 ring-4 ring-white/70' : 'from-indigo-400 to-indigo-700'}`}>
                  <div className="font-game text-white txt-o-xs text-sm text-center">{tr(lang, 'day')} {i + 1}</div>
                  <div className="flex flex-col items-center justify-center h-16">
                    {big ? <svg viewBox="0 0 64 48" className="w-16 h-12"><rect x="6" y="18" width="52" height="28" rx="4" fill="#b45309" stroke="#1e1240" strokeWidth="3.5" /><path d="M6 22 C6 4 58 4 58 22 Z" fill="#d97706" stroke="#1e1240" strokeWidth="3.5" /><rect x="26" y="16" width="12" height="14" rx="2" fill="#facc15" stroke="#1e1240" strokeWidth="3" /><path d="M6 32 H58" stroke="#facc15" strokeWidth="4" /></svg>
                      : done ? <Check className="w-10 h-10 text-white drop-shadow" strokeWidth={4} /> : <GemIcon className="w-10 h-10" />}
                    <span className="font-game text-white txt-o-xs">+{amt}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <Btn3D className="w-full mt-4" color={canClaim ? 'green' : 'gray'} disabled={!canClaim} onClick={claim}>{canClaim ? tr(lang, 'claim') : tr(lang, 'claimed')}</Btn3D>
        </Panel>
      </div>
      {prize && <Modal onClose={() => setPrize(null)}>
        <Panel tone="gold" className="p-6 text-center">
          <Ribbon text={tr(lang, 'youWon')} small color="from-pink-500 to-fuchsia-700" />
          <div className="flex items-center justify-center gap-3 my-4"><GemIcon className="w-16 h-16 a-bob" /><span className="font-game text-white txt-o text-3xl">{prize}</span></div>
          <Btn3D color="green" onClick={() => setPrize(null)}>OK</Btn3D>
        </Panel>
      </Modal>}
    </ScreenShell>
  );
}

/* ============================================================================
 * 23) EINSTELLUNGEN + SPRACHAUSWAHL
 * ========================================================================== */
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button onClick={() => { audio.play('tap'); onClick(); }} className={`relative w-20 h-10 rounded-full border-4 border-slate-900/80 shadow-[inset_0_3px_0_rgba(0,0,0,0.3)] transition-colors ${on ? 'bg-gradient-to-b from-lime-300 to-green-600' : 'bg-gradient-to-b from-slate-400 to-slate-600'}`}>
    <span className={`absolute top-0.5 w-7 h-7 rounded-full bg-white border-[3px] border-slate-900/80 shadow transition-all ${on ? 'left-[42px]' : 'left-1'}`} /></button>;
}
function SettingsScreen({ save, update, theme, go, autoSeason }: { save: Save; update: (f: (s: Save) => Save) => void; theme: SeasonTheme; go: (s: Screen) => void; autoSeason: SeasonId }) {
  const lang = save.lang; const [confirm, setConfirm] = useState(false);
  const row = (icon: React.ReactNode, label: string, right: React.ReactNode) => (
    <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-950/25 border-2 border-white/15">
      <span className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-b from-sky-300 to-blue-600 border-[3px] border-slate-900/80 flex items-center justify-center text-white">{icon}</span>
      <span className="flex-1 font-game text-white txt-o-xs text-lg">{label}</span>{right}
    </div>
  );
  const L = LANGS.find(l => l.id === lang)!;
  return (
    <ScreenShell save={save} theme={theme} onBack={() => go('home')} onSettings={() => { /* hier */ }} onLang={() => go('language')} title={tr(lang, 'settings')}>
      <div className="max-w-xl mx-auto p-4 pb-10 flex flex-col gap-4">
        <Panel className="p-3 flex flex-col gap-2">
          {row(<Music className="w-6 h-6" />, tr(lang, 'music'), <Toggle on={save.music} onClick={() => update(s => ({ ...s, music: !s.music }))} />)}
          {row(<Volume2 className="w-6 h-6" />, tr(lang, 'sound'), <Toggle on={save.sound} onClick={() => update(s => ({ ...s, sound: !s.sound }))} />)}
          {row(<Smartphone className="w-6 h-6" />, tr(lang, 'vibration'), <Toggle on={save.vibe} onClick={() => update(s => ({ ...s, vibe: !s.vibe }))} />)}
          {row(<Globe className="w-6 h-6" />, tr(lang, 'language'), <Btn3D small color="blue" onClick={() => go('language')}><FlagIcon id={L.id} className="w-6 h-6" />{L.name}</Btn3D>)}
        </Panel>
        <Panel tone="blue" className="p-3">
          <div className="flex items-center gap-2 mb-2"><MapPin className="w-6 h-6 text-white" /><span className="font-game text-white txt-o-xs text-xl">{tr(lang, 'region')}</span></div>
          <div className="flex flex-wrap gap-2">{REGIONS.map(r => <button key={r} onClick={() => { audio.play('tap'); update(s => ({ ...s, region: r })); }} className={`px-3 py-1 rounded-full border-[3px] border-slate-900/80 font-game text-sm txt-o-xs text-white shadow-[0_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 ${save.region === r ? 'bg-gradient-to-b from-yellow-300 to-amber-600' : 'bg-gradient-to-b from-indigo-400 to-indigo-700'}`}>{tr(lang, ('r_' + r) as TKey)}</button>)}</div>
        </Panel>
        <Panel tone="violet" className="p-3">
          <div className="flex items-center gap-2 mb-1"><CalendarDays className="w-6 h-6 text-white" /><span className="font-game text-white txt-o-xs text-xl">{tr(lang, 'seasonPreview')}</span></div>
          <p className="font-ui font-black text-white/85 text-xs mb-2">{tr(lang, 'seasonNow')}: {tr(lang, ('s_' + autoSeason) as TKey)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(['auto', ...SEASON_IDS] as const).map(sid => {
              const th = sid === 'auto' ? null : SEASONS[sid]; const I = th ? th.icon : RefreshCw; const sel = save.season === sid;
              return <button key={sid} onClick={() => { audio.play('tap'); update(s => ({ ...s, season: sid })); }}
                className={`relative h-16 rounded-2xl overflow-hidden border-4 ${sel ? 'border-yellow-300' : 'border-slate-900/80'} shadow-[0_4px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 bg-gradient-to-b ${th ? th.sky : 'from-slate-500 to-slate-700'}`}>
                <span className="relative flex flex-col items-center justify-center h-full"><I className="w-6 h-6 text-white drop-shadow" /><span className="font-game text-white txt-o-xs text-xs leading-tight px-1 text-center">{sid === 'auto' ? tr(lang, 'auto') : tr(lang, ('s_' + sid) as TKey)}</span></span>
                {sel && <Check className="absolute top-0.5 right-0.5 w-5 h-5 text-yellow-300" strokeWidth={4} />}
              </button>;
            })}
          </div>
        </Panel>
        <Panel tone="green" className="p-3">
          <div className="flex items-center gap-2 mb-1"><LifeBuoy className="w-6 h-6 text-white" /><span className="font-game text-white txt-o-xs text-xl">{tr(lang, 'support')}</span></div>
          <p className="font-ui font-black text-white text-sm">{tr(lang, 'supportText')}</p>
          <div className="mt-3 flex justify-end"><Btn3D small color="red" onClick={() => setConfirm(true)}><Trash2 className="w-5 h-5" />{tr(lang, 'reset')}</Btn3D></div>
        </Panel>
        <p className="text-center font-ui font-black text-white/70 text-xs">Sparkys Code-Abenteuer · v1.0 · offline</p>
      </div>
      {confirm && <Modal onClose={() => setConfirm(false)}>
        <Panel tone="blue" className="p-5 text-center">
          <Sparky look={{ mood: 'sad' }} className="w-24 h-24 mx-auto" />
          <p className="font-game text-white txt-o-sm text-2xl my-3">{tr(lang, 'confirmReset')}</p>
          <div className="grid grid-cols-2 gap-2">
            <Btn3D small color="gray" onClick={() => setConfirm(false)}>{tr(lang, 'no')}</Btn3D>
            <Btn3D small color="red" onClick={() => { const f = freshSave(); f.lang = lang; update(() => f); setConfirm(false); go('home'); }}>{tr(lang, 'yes')}</Btn3D>
          </div>
        </Panel>
      </Modal>}
    </ScreenShell>
  );
}
function LanguageScreen({ save, update, theme, go, back }: { save: Save; update: (f: (s: Save) => Save) => void; theme: SeasonTheme; go: (s: Screen) => void; back: Screen }) {
  return (
    <ScreenShell save={save} theme={theme} onBack={() => go(back)} onSettings={() => go('settings')} onLang={() => { /* hier */ }} title={tr(save.lang, 'language')}>
      <div className="max-w-md mx-auto p-4 pb-10 flex flex-col gap-3">
        {LANGS.map((l, i) => {
          const sel = save.lang === l.id;
          return <button key={l.id} onClick={() => { audio.play('tap'); update(s => ({ ...s, lang: l.id })); }} className="a-pop active:translate-y-1" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`flex items-center gap-4 px-4 py-3 rounded-3xl border-4 border-slate-900/80 shadow-[0_6px_0_rgba(0,0,0,0.4)] bg-gradient-to-b ${sel ? 'from-lime-300 via-green-500 to-green-700' : 'from-violet-400 via-purple-600 to-indigo-800'}`}>
              <FlagIcon id={l.id} className="w-12 h-12" />
              <span className="flex-1 text-start font-game text-white txt-o-sm text-2xl" dir={l.id === 'ar' ? 'rtl' : 'ltr'}>{l.name}</span>
              {sel && <span className="w-9 h-9 rounded-full bg-white border-[3px] border-slate-900/80 flex items-center justify-center"><Check className="w-6 h-6 text-green-600" strokeWidth={4} /></span>}
            </div>
          </button>;
        })}
      </div>
    </ScreenShell>
  );
}

/* ============================================================================
 * 24) APP
 * ========================================================================== */
export default function App() {
  const [save, setSave] = useState<Save>(loadSave);
  const [screen, setScreen] = useState<Screen>('home');
  const [prev, setPrev] = useState<Screen>('home');
  const [world, setWorld] = useState(0); const [level, setLevel] = useState(1);
  const update = useCallback((f: (s: Save) => Save) => setSave(s => { const n = f(s); persist(n); return n; }), []);
  const autoSeason = useMemo(() => detectSeason(new Date(), save.region), [save.region]);
  const season: SeasonId = save.season === 'auto' ? autoSeason : save.season;
  const theme = SEASONS[season];
  const go = (s: Screen) => { setPrev(screen); setScreen(s); window.scrollTo(0, 0); };

  // Audio-Einstellungen synchronisieren
  useEffect(() => { audio.sfxOn = save.sound; audio.musicOn = save.music; vibeOn = save.vibe; if (!save.music) audio.stopMusic(); }, [save.sound, save.music, save.vibe]);
  useEffect(() => { audio.setWorld(screen === 'game' || screen === 'map' ? WORLDS[world].base : 60); }, [screen, world]);
  useEffect(() => {
    const start = () => { audio.ensure(); if (audio.musicOn) audio.startMusic(); };
    window.addEventListener('pointerdown', start, { once: false });
    return () => window.removeEventListener('pointerdown', start);
  }, []);
  useEffect(() => { document.documentElement.lang = save.lang; document.documentElement.dir = save.lang === 'ar' ? 'rtl' : 'ltr'; document.title = tr(save.lang, 'title'); }, [save.lang]);

  const openWorld = (w: number) => { setWorld(w); update(s => ({ ...s, seenWorld: w })); go('map'); };
  const play = (l: number) => { setLevel(l); go('game'); };
  const W = WORLDS[world];
  return (
    <div className="font-ui min-h-[100dvh] bg-indigo-950 text-white select-none">
      <GlobalStyle />
      {screen === 'home' && <HomeScreen save={save} theme={theme} season={season} go={go} openWorld={openWorld} />}
      {screen === 'map' && <MapScreen save={save} world={W} theme={theme} go={go} play={play} />}
      {screen === 'game' && <GameScreen key={world + ':' + level} save={save} update={update} world={W} level={level} seasonTheme={theme}
        onExit={() => go('map')} onNext={() => setLevel(l => l + 1)} />}
      {screen === 'knowledge' && <KnowledgeScreen save={save} theme={theme} go={go} />}
      {screen === 'trophies' && <TrophyScreen save={save} update={update} theme={theme} go={go} />}
      {screen === 'costume' && <CostumeScreen save={save} update={update} theme={theme} go={go} />}
      {screen === 'daily' && <DailyScreen save={save} update={update} theme={theme} go={go} />}
      {screen === 'settings' && <SettingsScreen save={save} update={update} theme={theme} go={go} autoSeason={autoSeason} />}
      {screen === 'language' && <LanguageScreen save={save} update={update} theme={theme} go={go} back={prev === 'language' ? 'home' : prev} />}
    </div>
  );
}

// Für Tests: Spiel-Logik ohne UI
export { parsePython, runProgram, getLevel, detectSeason, blocksToPy, pyToBlocks, progSize, HANDMADE, WORLDS, LANGS, T };
