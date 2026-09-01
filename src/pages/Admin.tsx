import React, { useMemo, useState } from "react";
import { useCatalogue } from "../contexts/CatalogueContext";
import { BarChart3Icon, LayoutDashboardIcon, LibraryBigIcon, MicVocalIcon, PencilIcon, PlusIcon, SearchIcon, StarIcon, TagsIcon, Trash2Icon, UsersIcon, BoxIcon } from "lucide-react";
import { songs as seedSongs, allEras, allLanguages } from "../data/songs";
import { Era, Song } from "../types/song";
import { SongEditor } from "../components/admin/SongEditor";
import { formatPlays, formatTime } from "../utils/format";
type View = 'dashboard' | 'songs' | 'categories' | 'lyrics' | 'users' | 'analytics';
const nav: {
  id: View;
  label: string;
  icon: BoxIcon;
}[] = [{
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboardIcon
}, {
  id: 'songs',
  label: 'Songs',
  icon: LibraryBigIcon
}, {
  id: 'categories',
  label: 'Categories',
  icon: TagsIcon
}, {
  id: 'lyrics',
  label: 'Lyrics',
  icon: MicVocalIcon
}, {
  id: 'users',
  label: 'Users',
  icon: UsersIcon
}, {
  id: 'analytics',
  label: 'Analytics',
  icon: BarChart3Icon
}];
const users = [{
  name: 'Nadeesha Perera',
  email: 'nadeesha@lounge.lk',
  role: 'Admin',
  sings: 412
}, {
  name: 'Rajan Kumar',
  email: 'rajan@lounge.lk',
  role: 'Editor',
  sings: 268
}, {
  name: 'Chamodi Silva',
  email: 'chamodi@lounge.lk',
  role: 'Member',
  sings: 154
}, {
  name: 'Owen Blake',
  email: 'owen@lounge.lk',
  role: 'Member',
  sings: 96
}];
function StatCard({
  label,
  value,
  hint




}: {label: string;value: string;hint: string;}) {
  return <div className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
      <p className="mt-1 text-xs text-mist/70">{hint}</p>
    </div>;
}
function Bars({
  data





}: {data: {label: string;value: number;}[];}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return <ul className="space-y-3">
      {data.map((item) => <li key={item.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs text-mist">{item.label}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full rounded-full bg-magenta" style={{
          width: `${item.value / max * 100}%`
        }} />
          </span>
          <span className="w-14 shrink-0 text-right text-xs tabular-nums text-mist">
            {formatPlays(item.value)}
          </span>
        </li>)}
    </ul>;
}
export function Admin() {
  const [view, setView] = useState<View>('dashboard');
  const { catalogue, loading, saveSong, removeSong } = useCatalogue();
  const [editing, setEditing] = useState<Song | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [query, setQuery] = useState('');
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalogue;
    return catalogue.filter((song) => `${song.title} ${song.artist} ${song.era} ${song.language}`.toLowerCase().includes(q));
  }, [catalogue, query]);
  
  const stats = useMemo(() => {
    const lyricLines = catalogue.reduce((total, song) => total + Object.values(song.lyrics).reduce((sum, lines) => sum + (lines?.length ?? 0), 0), 0);
    return {
      total: catalogue.length,
      featured: catalogue.filter((song) => song.featured).length,
      lyricLines,
      plays: catalogue.reduce((total, song) => total + song.plays, 0)
    };
  }, [catalogue]);
  
  const eraData = useMemo(() => allEras.map((era) => ({
    label: era,
    value: catalogue.filter((song) => song.era === era).reduce((sum, s) => sum + s.plays, 0)
  })), [catalogue]);
  
  const languageData = useMemo(() => allLanguages.map((language) => ({
    label: language,
    value: catalogue.filter((song) => song.language === language).reduce((sum, s) => sum + s.plays, 0)
  })), [catalogue]);
  
  const save = async (song: Song) => {
    await saveSong(song);
    setEditorOpen(false);
    setEditing(null);
  };
  
  const remove = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      await removeSong(id);
    }
  };
  
  const openEditor = (song: Song | null) => {
    setEditing(song);
    setEditorOpen(true);
  };

  if (loading) {
    return <div className="p-20 text-center">Loading catalogue from Supabase...</div>;
  }
  return <div className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-10 sm:px-6 lg:px-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-magenta">Admin</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Content management</h1>
          <p className="mt-2 text-sm text-mist">
            Manage the karaoke catalogue, lyrics timing and community activity.
          </p>
        </div>
        <button type="button" onClick={() => openEditor(null)} className="inline-flex items-center gap-2 rounded-full bg-magenta px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth active:scale-95">
          <PlusIcon className="h-4 w-4" /> Add song
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Admin sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="scroll-row flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {nav.map(({
            id,
            label,
            icon: Icon
          }) => <li key={id} className="shrink-0">
                <button type="button" aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)} className={['flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm transition-colors duration-150 ease-smooth', view === id ? 'bg-white/10 text-white' : 'text-mist hover:bg-white/5 hover:text-white'].join(' ')}>
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              </li>)}
          </ul>
        </nav>

        <div className="min-w-0">
          {view === 'dashboard' && <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Songs" value={String(stats.total)} hint="in the catalogue" />
                <StatCard label="Featured" value={String(stats.featured)} hint="shown on the homepage" />
                <StatCard label="Lyric lines" value={String(stats.lyricLines)} hint="timestamped and synced" />
                <StatCard label="Total sings" value={formatPlays(stats.plays)} hint="all-time playbacks" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="glass rounded-2xl p-5">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-mist">
                    Most sung
                  </h2>
                  <ul className="space-y-3">
                    {[...catalogue].sort((a, b) => b.plays - a.plays).slice(0, 6).map((song, index) => <li key={song.id} className="flex items-center gap-3">
                          <span className="w-5 text-sm tabular-nums text-mist">{index + 1}</span>
                          <img src={song.thumbnail} alt="" loading="lazy" className="h-10 w-10 rounded-lg object-cover" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{song.title}</span>
                            <span className="block truncate text-xs text-mist">{song.artist}</span>
                          </span>
                          <span className="text-xs tabular-nums text-mist">
                            {formatPlays(song.plays)}
                          </span>
                        </li>)}
                  </ul>
                </section>

                <section className="glass rounded-2xl p-5">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-mist">
                    Sings by era
                  </h2>
                  <Bars data={eraData} />
                </section>
              </div>
            </div>}

          {view === 'songs' && <div className="space-y-4">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
                <label htmlFor="admin-search" className="sr-only">
                  Search catalogue
                </label>
                <input id="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the catalogue…" className="glass h-11 w-full rounded-full pl-11 pr-4 text-sm placeholder:text-mist/70 focus:border-magenta/60" />
              </div>

              <div className="glass overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="border-b border-line text-xs uppercase tracking-wider text-mist">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-medium">Song</th>
                        <th scope="col" className="px-3 py-3 font-medium">Era</th>
                        <th scope="col" className="px-3 py-3 font-medium">Language</th>
                        <th scope="col" className="px-3 py-3 font-medium">Genre</th>
                        <th scope="col" className="px-3 py-3 font-medium">Length</th>
                        <th scope="col" className="px-3 py-3 font-medium">Featured</th>
                        <th scope="col" className="px-5 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((song) => <tr key={song.id} className="border-b border-line/60 last:border-0">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img src={song.thumbnail} alt="" loading="lazy" className="h-9 w-9 rounded-md object-cover" />
                              <div className="min-w-0">
                                <p className="truncate font-medium">{song.title}</p>
                                <p className="truncate text-xs text-mist">
                                  {song.artist} • {song.year}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-mist">{song.era}</td>
                          <td className="px-3 py-3 text-mist">{song.language}</td>
                          <td className="px-3 py-3 text-mist">{song.genre}</td>
                          <td className="px-3 py-3 tabular-nums text-mist">
                            {formatTime(song.duration)}
                          </td>
                          <td className="px-3 py-3">
                            <button type="button" aria-pressed={song.featured} aria-label={`Toggle featured for ${song.title}`} onClick={() => setCatalogue((prev) => prev.map((item) => item.id === song.id ? {
                        ...item,
                        featured: !item.featured
                      } : item))} className={`rounded-full p-1.5 transition-colors duration-150 ease-smooth ${song.featured ? 'text-magenta' : 'text-mist hover:text-white'}`}>
                              <StarIcon className={`h-4 w-4 ${song.featured ? 'fill-current' : ''}`} />
                            </button>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button type="button" aria-label={`Edit ${song.title}`} onClick={() => openEditor(song)} className="rounded-lg p-2 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button type="button" aria-label={`Delete ${song.title}`} onClick={() => remove(song.id)} className="rounded-lg p-2 text-mist transition-colors duration-150 ease-smooth hover:bg-red-500/15 hover:text-red-400">
                                <Trash2Icon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && <p className="px-5 py-10 text-center text-sm text-mist">
                    No songs match “{query}”.
                  </p>}
              </div>
            </div>}

          {view === 'categories' && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {allEras.map((era: Era) => {
            const list = catalogue.filter((song) => song.era === era);
            return <div key={era} className="glass rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-wider text-magenta">{era}</p>
                    <p className="mt-2 font-display text-3xl">{list.length} songs</p>
                    <p className="mt-1 text-xs text-mist">
                      {list.filter((song) => song.featured).length} featured •{' '}
                      {formatPlays(list.reduce((sum, song) => sum + song.plays, 0))} sings
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {Array.from(new Set(list.map((song) => song.genre))).map((genre) => <span key={genre} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-mist">
                          {genre}
                        </span>)}
                    </div>
                  </div>;
          })}
            </div>}

          {view === 'lyrics' && <div className="glass overflow-hidden rounded-2xl">
              <ul className="divide-y divide-line/60">
                {catalogue.map((song) => {
              const languages = Object.keys(song.lyrics);
              const lineCount = Object.values(song.lyrics).reduce((sum, lines) => sum + (lines?.length ?? 0), 0);
              return <li key={song.id} className="flex flex-wrap items-center gap-4 px-5 py-4 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{song.title}</p>
                        <p className="truncate text-xs text-mist">{song.artist}</p>
                      </div>
                      <span className="text-xs text-mist">{lineCount} timed lines</span>
                      <div className="flex gap-1.5">
                        {languages.map((language) => <span key={language} className="rounded-full border border-magenta/40 bg-magenta/10 px-2.5 py-1 text-[11px] text-magenta">
                            {language}
                          </span>)}
                      </div>
                      <button type="button" onClick={() => openEditor(song)} className="rounded-full border border-line px-4 py-1.5 text-xs text-mist transition-colors duration-150 ease-smooth hover:text-white">
                        Edit timings
                      </button>
                    </li>;
            })}
              </ul>
            </div>}

          {view === 'users' && <div className="glass overflow-hidden rounded-2xl">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-line text-xs uppercase tracking-wider text-mist">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Member</th>
                    <th scope="col" className="px-3 py-3 font-medium">Role</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Sings</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => <tr key={user.email} className="border-b border-line/60 last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-mist">{user.email}</p>
                      </td>
                      <td className="px-3 py-3 text-mist">{user.role}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-mist">{user.sings}</td>
                    </tr>)}
                </tbody>
              </table>
            </div>}

          {view === 'analytics' && <div className="grid gap-6 lg:grid-cols-2">
              <section className="glass rounded-2xl p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-mist">
                  Sings by era
                </h2>
                <Bars data={eraData} />
              </section>
              <section className="glass rounded-2xl p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-mist">
                  Sings by language
                </h2>
                <Bars data={languageData} />
              </section>
            </div>}
        </div>
      </div>

      {editorOpen && <SongEditor song={editing} onClose={() => {
      setEditorOpen(false);
      setEditing(null);
    }} onSave={save} />}
    </div>;
}