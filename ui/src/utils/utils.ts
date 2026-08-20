const { VITE_BASE_URL, VITE_TMDB_AUTH } = import.meta.env;

type FetchOrigin = "local" | "terceros";

export async function fetchData(
  origen: FetchOrigin,
  param: string,
  method?: "GET" | "POST" | "PUT" | "DELETE",
  body?: object,
) {
  let host: Record<FetchOrigin, string> = {
    local: VITE_BASE_URL,
    terceros: "https://api.themoviedb.org/3",
  };
  try {
    let config: RequestInit = {
      method: method ? method : "GET",
      headers:
        origen == "local"
          ? { Accept: "application/json" }
          : {
              Accept: "application/json",
              Authorization: "Bearer " + VITE_TMDB_AUTH,
            },
    };
    if (body) config.body = JSON.stringify(body);
    const res = await fetch(`${host[origen]}${param}`, config);
    if (res.status === 204) return undefined;

    if (method?.toUpperCase() == "POST") {
      if (res.status !== 201 && param == "/movies")
        throw new Error("error al postear datos");
      else return await res.json();
    } else return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export default fetchData;
