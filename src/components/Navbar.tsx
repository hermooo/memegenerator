const Navbar = () => {
  return (
    <header className="bg-linear-to-r from-(--color-nav) to-(--color-nav-secondary)">
      <nav className="mx-auto flex max-w-screen flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-10">
        <a href="/" className="flex items-center gap-2 text-white">
          <img src="/logo.svg" alt="" className="h-9 w-9" aria-hidden />
          <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Meme Generator
          </span>
        </a>

        <span className="text-xs font-bold text-white">
          Made by{' '}
          <a
            href="https://www.hermooo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:underline"
          >
            hermooo
          </a>
        </span>
      </nav>
    </header>
  )
}

export default Navbar
