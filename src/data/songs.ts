import type { Era, Genre, Language, LyricLine, Song } from '../types/song';

const ART: Record<Era, string> = {
  '70s': "/dce6cbee-9179-420c-9404-2c44a00171db.jpg",
  '80s': "/40ec3fae-1577-443c-b364-558f37d63005.jpg",
  '90s': "/40ec3fae-1577-443c-b364-558f37d63005.jpg",
  '2000s': "/4c0273fb-0a8a-40e5-b3f2-b3d591f40f21.jpg",
  '2010s': "/585edcdd-dee9-42e9-9f4d-4fd567251d8e.jpg",
  Latest: "/585edcdd-dee9-42e9-9f4d-4fd567251d8e.jpg"
};

export const HERO_IMAGE = "/9c6da37b-4b62-4c82-901e-8fdb5634a1e0.jpg";


const INTRO = 7;
const LINE = 5.2;
const OUTRO = 12;

function timed(lines: string[]): LyricLine[] {
  return lines.map((text, i) => ({
    start: +(INTRO + i * LINE).toFixed(2),
    end: +(INTRO + (i + 1) * LINE).toFixed(2),
    text
  }));
}

function slugify(value: string): string {
  return value.
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-|-$/g, '');
}

interface Draft {
  title: string;
  artist: string;
  album: string;
  year: number;
  era: Era;
  language: Language;
  genre: Genre;
  plays: number;
  featured?: boolean;
  broken?: boolean;
  lines: string[];
  translation?: Partial<Record<Language, string[]>>;
}

const drafts: Draft[] = [
{
  title: 'Sanda Eliya Yata',
  artist: 'Nimal Ranaweera',
  album: 'Gama Sihinaya',
  year: 1974,
  era: '70s',
  language: 'Sinhala',
  genre: 'Classic',
  plays: 184320,
  featured: true,
  lines: [
  'Sanda eliya yata, api dedena',
  'Wanaye sulanga geethayak wage',
  'Kaale gilihuna, mathakaya nathi wei',
  'Namuth me raethriya, apagemai',
  'Ho ho... sanda eliya yata',
  'Gamane dura kiyanne kawuda',
  'Athata atha thabaa enna',
  'Aadaraya nowei nawathinne',
  'Sanda eliya yata, api dedena',
  'Kaale gilihuna, apagemai'],

  translation: {
    English: [
    'Under the moonlight, the two of us',
    'The forest wind sings like a melody',
    'Time slipped away, memory may fade',
    'But this night belongs to us alone',
    'Oh oh... under the moonlight',
    'Who can say how long the road runs',
    'Come with your hand held in mine',
    'Love is not a thing that stops',
    'Under the moonlight, the two of us',
    'Time slipped away, it is ours alone']

  }
},
{
  title: 'Velvet Highway',
  artist: 'The Amber Doors',
  album: 'Long Player One',
  year: 1972,
  era: '70s',
  language: 'English',
  genre: 'Rock',
  plays: 231004,
  featured: true,
  lines: [
  'Got the engine running low on gasoline',
  'Radio is playing something in between',
  'Velvet highway rolling under wheels of gold',
  'Nobody out here ever getting old',
  'Drive, drive, drive till the morning comes',
  'Drive till the sky forgets the sun',
  'And if the road runs out I will build my own',
  'Velvet highway carry me home']

},
{
  title: 'Paadum Nilaa',
  artist: 'R. Chandran',
  album: 'Thendral Vandhu',
  year: 1976,
  era: '70s',
  language: 'Tamil',
  genre: 'Movie Songs',
  plays: 98240,
  lines: [
  'Paadum nilaa, en jannal vazhi',
  'Kaatril mithakkum ninaivugal',
  'Oru vaarthai sollu, en manam ketkum',
  'Ithu kadhal alla, ithu kavithai',
  'Paadum nilaa, thoongaathe nee',
  'Vidiyum varai naan paadinen',
  'Un kaigal pidithu naan nadanthen',
  'Ippozhuthu ennai marakkaathe']

},
{
  title: 'Handa Payana Rathriye',
  artist: 'Sunila Weerasinghe',
  album: 'Nelum Wila',
  year: 1978,
  era: '70s',
  language: 'Sinhala',
  genre: 'Folk',
  plays: 76510,
  lines: [
  'Handa payana rathriye, wel yaye',
  'Kumburu wathe pipuna mal',
  'Amma kiyana kavi pelak',
  'Sithe hangala thiyaganne',
  'Gam medda nisala wei',
  'Rae kurullo nidi wari',
  'Handa payana rathriye',
  'Mama gedara enawa']

},
{
  title: 'Long Way From Georgia',
  artist: 'Marla Dean',
  album: 'Slow Country Sun',
  year: 1979,
  era: '70s',
  language: 'English',
  genre: 'Oldies',
  plays: 64180,
  lines: [
  'I am a long way from Georgia tonight',
  'Counting the towns by the porch light',
  'Mama said travel will teach you to sing',
  'Never said travel takes everything',
  'So play me something slow and low',
  'Something the jukebox used to know',
  'A long way from Georgia, still I hum',
  'The old road always brings me home']

},
{
  title: 'Neon Rain',
  artist: 'Cassette Boys',
  album: 'Static Youth',
  year: 1986,
  era: '80s',
  language: 'English',
  genre: 'Pop',
  plays: 412900,
  featured: true,
  lines: [
  'City lights are bleeding on the window pane',
  'You said meet me under neon rain',
  'Every heartbeat sounds just like a drum machine',
  'Loudest silence I have ever seen',
  'Neon rain, neon rain',
  'Falling on the boulevard again',
  'Hold me like a photograph that never fades',
  'Dancing through the electric haze']

},
{
  title: 'Midnight Arcade',
  artist: 'Steel Avenue',
  album: 'Chrome Nights',
  year: 1988,
  era: '80s',
  language: 'English',
  genre: 'Rock',
  plays: 187430,
  lines: [
  'Quarter in the slot and the screen turns blue',
  'Everybody here is chasing something new',
  'Midnight arcade never sleeps at all',
  'Shadows playing pinball down the hall',
  'Run, runner, run, the level never ends',
  'High score written by my oldest friends',
  'Midnight arcade, keep the lights on low',
  'One more game before we go']

},
{
  title: 'Sihina Lowak',
  artist: 'Amara Silva',
  album: 'Sanda Kirana',
  year: 1991,
  era: '90s',
  language: 'Sinhala',
  genre: 'Romantic',
  plays: 356700,
  featured: true,
  lines: [
  'Sihina lowak thaniwela',
  'Oba nathi hinda mage lowa',
  'Kandulu wagurana rae mediyame',
  'Obe hadha mata ahenawa',
  'Enna, enna, ath dennako',
  'Mata oba nathuwa bae kiyanna',
  'Sihina lowak thaniwela',
  'Oba enna mage lowata'],

  translation: {
    English: [
    'A world of dreams left all alone',
    'Without you my whole world is gone',
    'In the middle of a night of falling tears',
    'I can still hear your heart',
    'Come, come, give me your hand',
    'I cannot say I live without you',
    'A world of dreams left all alone',
    'Come back into my world']

  }
},
{
  title: 'Kaatru Veesum Neram',
  artist: 'Vaani Priya',
  album: 'Mazhai Nilavu',
  year: 1994,
  era: '90s',
  language: 'Tamil',
  genre: 'Movie Songs',
  plays: 143220,
  lines: [
  'Kaatru veesum neram naan ninaithen',
  'Un peyar solli mella sirithen',
  'Vaanam mazhaiyai thanthathu',
  'En kannil neerum vanthathu',
  'Kaatru veesum neram',
  'Nee varuvai endru nambinen',
  'Ovvoru raathiri thoongaamal',
  'Un kanavil naan vaazhginren']

},
{
  title: 'Pem Sanahasa',
  artist: 'Roshan Perera',
  album: 'Sanda Reyak',
  year: 1997,
  era: '90s',
  language: 'Sinhala',
  genre: 'Romantic',
  plays: 219880,
  lines: [
  'Pem sanahasa mata denna',
  'Mage hitha oba wetha yanawa',
  'Kalu wala athare hiru wagei',
  'Oba mage jeewithe',
  'Nokiya giya wachana tikak',
  'Ada mata mathakayi',
  'Pem sanahasa mata denna',
  'Aayemath enna']

},
{
  title: 'Dil Ki Baatein',
  artist: 'Aarti Menon',
  album: 'Filmi Nights',
  year: 1999,
  era: '90s',
  language: 'Tamil',
  genre: 'Bollywood',
  plays: 132400,
  lines: [
  'Dil ki baatein aaj kaho',
  'Chup rehna ab chhod do',
  'Sapno mein tum aaye ho',
  'Palkon pe tum chhaye ho',
  'Dil ki baatein, dil ki baatein',
  'Raat bhar chalti hain',
  'Tum jo paas ho to lagta hai',
  'Duniya rukti hai']

},
{
  title: 'Sudu Renu',
  artist: 'Kavindi Fernando',
  album: 'Kalpanawa',
  year: 2004,
  era: '2000s',
  language: 'Sinhala',
  genre: 'Pop',
  plays: 298310,
  featured: true,
  lines: [
  'Sudu renu wage hawasa',
  'Oba mata enawa dan',
  'Mage lowe ekama tharuwa',
  'Oba witharai dan',
  'Kiyanna epa yanna kiyala',
  'Mata dan hitha nathuwa',
  'Sudu renu wage hawasa',
  'Api dedena withrai']

},
{
  title: 'Paper Aeroplanes',
  artist: 'Hollow Coast',
  album: 'Small Skies',
  year: 2006,
  era: '2000s',
  language: 'English',
  genre: 'Pop',
  plays: 176540,
  lines: [
  'We were folding paper aeroplanes',
  'Throwing every worry off the roof',
  'Summer had a hole in both its hands',
  'We were seventeen and bulletproof',
  'Fly, little paper, do not land',
  'Take the whole of me across the sand',
  'Paper aeroplanes never come back down',
  'They just circle round this town']

},
{
  title: 'Mazhai Thuli',
  artist: 'Surya Kumar',
  album: 'Oru Kadhal Kadhai',
  year: 2003,
  era: '2000s',
  language: 'Tamil',
  genre: 'Romantic',
  plays: 121770,
  lines: [
  'Mazhai thuli en meethu vizhunthathu',
  'Un ninaivum udan vanthathu',
  'Nanaintha theru vilakkinil',
  'Un mugam theriyuthadi',
  'Mazhai thuli, mazhai thuli',
  'Nillaathe indru iravu',
  'Un kural ketkum varai',
  'Naan nanaigiren']

},
{
  title: 'Ahasa Yata',
  artist: 'Dilan Jayaweera',
  album: 'Sada Ras',
  year: 2008,
  era: '2000s',
  language: 'Sinhala',
  genre: 'Rock',
  plays: 154210,
  broken: true,
  lines: [
  'Ahasa yata gini pupura',
  'Api gaayanaa karamu',
  'Kalabala nagare hade',
  'Api nidahase duwamu',
  'Nawathinne nae, nawathinne nae',
  'Me geethaya nimawenne nae',
  'Ahasa yata gini pupura',
  'Api gaayanaa karamu']

},
{
  title: 'Golden Hour Radio',
  artist: 'Elise Moray',
  album: 'Late Bloom',
  year: 2014,
  era: '2010s',
  language: 'English',
  genre: 'Pop',
  plays: 342190,
  featured: true,
  lines: [
  'Tuning in to golden hour radio',
  'Every station playing songs we used to know',
  'Windows down and August on my skin',
  'Turn it up and let the summer in',
  'Golden hour, golden hour',
  'Hold the light before it goes',
  'Sing it like the whole street knows the words',
  'Golden hour radio']

},
{
  title: 'Mal Pipena Kale',
  artist: 'Tharu Nimesha',
  album: 'Wasanthaya',
  year: 2016,
  era: '2010s',
  language: 'Sinhala',
  genre: 'Romantic',
  plays: 267430,
  lines: [
  'Mal pipena kale oba awa',
  'Mage lowa wenas una',
  'Sulanga wage oba giya',
  'Namuth suwanda thiyenawa',
  'Mal pipena kale',
  'Aayemath enawada',
  'Mage hitha thawamath',
  'Oba wenuwen thiyenawa']

},
{
  title: 'Nila Kaatru',
  artist: 'Aadhi & Meera',
  album: 'Iravu Paadal',
  year: 2012,
  era: '2010s',
  language: 'Tamil',
  genre: 'Movie Songs',
  plays: 188060,
  lines: [
  'Nila kaatru veesuthu',
  'Un ninaivai theduthu',
  'Iravu muzhuthum naan',
  'Un paatai paaduven',
  'Nila kaatru, nila kaatru',
  'Ennai thottu selluthu',
  'Neeyum naanum indru',
  'Ore paadal aanathu']

},
{
  title: 'Sandalu Ahasa',
  artist: 'Nethmi Rangana',
  album: 'Alu Paata Ahasa',
  year: 2024,
  era: 'Latest',
  language: 'Sinhala',
  genre: 'Pop',
  plays: 88420,
  featured: true,
  lines: [
  'Sandalu ahasa yata',
  'Mata oba mathakai',
  'Nagare eliya athare',
  'Mama thaniyen yanawa',
  'Sandalu ahasa yata',
  'Geethayak wagei jeewithe',
  'Kohomada nawathinne',
  'Mage sinduwa oba nam']

},
{
  title: 'Static Hearts',
  artist: 'VIOLETTE',
  album: 'Night Signal',
  year: 2025,
  era: 'Latest',
  language: 'English',
  genre: 'Pop',
  plays: 121980,
  lines: [
  'We are two static hearts on a broken frequency',
  'Talking over noise, saying nothing honestly',
  'Tune me in before the signal goes',
  'Say the only line that nobody knows',
  'Static hearts, static hearts',
  'Beating out of time in the dark',
  'If you find the wave then hold it steady',
  'I have been here the whole time, ready']

},
{
  title: 'Kanavu Meedhu',
  artist: 'Ilakiya',
  album: 'Puthiya Ragam',
  year: 2023,
  era: 'Latest',
  language: 'Tamil',
  genre: 'Pop',
  plays: 74310,
  lines: [
  'Kanavu meedhu nadakiren',
  'Vizhunthaalum sirikiren',
  'Ulagam sollum vaarthaigal',
  'Enakku ippo theriyathu',
  'Kanavu meedhu, kanavu meedhu',
  'Naan parakka karkiren',
  'Uyaram konjam thooramthaan',
  'Naan nirka poavathillai']

}];


export const songs: Song[] = drafts.map((draft, index) => {
  const lyrics: Partial<Record<Language, LyricLine[]>> = {
    [draft.language]: timed(draft.lines)
  };
  if (draft.translation) {
    for (const [lang, lines] of Object.entries(draft.translation)) {
      lyrics[lang as Language] = timed(lines as string[]);
    }
  }
  const duration = Math.round(INTRO + draft.lines.length * LINE + OUTRO);
  return {
    id: `sng-${String(index + 1).padStart(3, '0')}`,
    slug: slugify(draft.title),
    title: draft.title,
    artist: draft.artist,
    album: draft.album,
    year: draft.year,
    era: draft.era,
    language: draft.language,
    genre: draft.genre,
    thumbnail: ART[draft.era],
    videoUrl: draft.broken ? '' : `https://stream.karaokelounge.app/v/${slugify(draft.title)}.m3u8`,
    duration,
    plays: draft.plays,
    featured: Boolean(draft.featured),
    lyrics
  };
});

export const eras: {
  era: Era;
  label: string;
  blurb: string;
  image: string;
  query: string;
}[] = [
{
  era: '70s',
  label: '70s Classics',
  blurb: 'Golden-era songs and timeless classics.',
  image: ART['70s'],
  query: '70s'
},
{
  era: '80s',
  label: '80s & 90s Hits',
  blurb: 'Iconic songs from the most memorable decades.',
  image: ART['80s'],
  query: '80s,90s'
},
{
  era: '2000s',
  label: '2000s Hits',
  blurb: 'Popular songs from the early 2000s.',
  image: ART['2000s'],
  query: '2000s'
},
{
  era: '2010s',
  label: '2010s Hits',
  blurb: 'Modern classics and radio favourites.',
  image: ART['2010s'],
  query: '2010s'
},
{
  era: 'Latest',
  label: 'Latest Songs',
  blurb: 'Recently added karaoke tracks.',
  image: ART.Latest,
  query: 'Latest'
}];


export const allEras: Era[] = ['70s', '80s', '90s', '2000s', '2010s', 'Latest'];
export const allLanguages: Language[] = ['Sinhala', 'English', 'Tamil'];
export const allGenres: Genre[] = [
'Pop',
'Rock',
'Classic',
'Romantic',
'Oldies',
'Bollywood',
'Folk',
'Movie Songs'];


export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug);
}

export function countByEra(era: Era): number {
  if (era === '80s') return songs.filter((s) => s.era === '80s' || s.era === '90s').length;
  return songs.filter((s) => s.era === era).length;
}