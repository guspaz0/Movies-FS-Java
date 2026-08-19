// Shared loose types for the Vue frontend.
export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  short_overview?: string
  image?: string
  poster_path?: string
  background_image?: string
  backdrop_path?: string
  overview?: string
  release_date?: string
  stars?: number
  vote_average?: number
  genres: Genre[]
  [key: string]: unknown
}

export interface MovieList {
  results: Movie[]
  page?: number
  total_pages?: number
  [key: string]: unknown
}

export interface Country {
  cca2: string
  name: {
    nativeName: Record<string, { common: string }>
    [key: string]: unknown
  }
  flags: { png: string; [key: string]: unknown }
  [key: string]: unknown
}

export interface User {
  id?: number
  name?: string
  [key: string]: unknown
}
