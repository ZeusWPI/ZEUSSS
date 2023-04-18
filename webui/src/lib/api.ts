import { notifications } from "@mantine/notifications";

export const deleteAPI = async (url: string, errMsg: string) => {
  const resp = await fetch(url, {
    method: "DELETE",
  });
  const data = await resp.json();
  if (!resp.ok) {
    notifications.show({
      title: "Failed to delete entry",
      message: `${errMsg} | error from api: ${data?.message ?? resp.statusText}`,
      color: "red",
    });
    return;
  }
  return data;
};

export const fetchTeams = async () => {
  const resp = await fetch("/api/teams");
  const data: Team[] = await resp.json();
  if (!resp.ok) {
    notifications.show({
      message: "Failed to fetch teams",
      color: "red",
    });
    return [];
  }
  return data;
};

export const fetchPouleInfo = async (league: string) => {
  const resp = await fetch(`/api/poules?${new URLSearchParams({ league })}`);
  const data: API.Poule[] = await resp.json();
  if (!resp.ok) {
    notifications.show({
      message: "Failed to get poule info",
      color: "red",
    });
    return [];
  }
  return data;
};

export const fetchPouleMatches = async (id: number): Promise<API.ParsedMatch[]> => {
  const resp = await fetch(`/api/poules/${id}/matches`);
  const data: API.Match[] = await resp.json();
  if (!resp.ok) return [];
  data.sort((m1, m2) => {
    if (!m1.date && !m2.date) {
      return 0;
    }
    if (!m1.date) {
      return 1;
    }
    if (!m2.date) {
      return -1;
    }
    return Date.parse(m2.date) - Date.parse(m1.date);
  });
  return data.map(m => {
    return { ...m, date: m.date ? new Date(m.date) : undefined };
  });
};

export const fetchRecentPouleMatches = async (league: string): Promise<API.Match[]> => {
  const resp = await fetch(`/api/poules/matches?${new URLSearchParams({ league, count: "10" })}`);
  const data = await resp.json();
  if (!resp.ok) {
    throw new Response(data?.message ?? resp.statusText, {
      status: resp.status,
    });
  }
  return data;
};

export const fetchBracket = async (league: string): Promise<Brackets.TreeNode[] | null> => {
  if (league === "") return null;
  const resp = await fetch(`/api/bracket/${league}/matches`);
  const data = await resp.json();
  if (!resp.ok) {
    if (resp.status === 404) {
      return null;
    }
    throw new Response(data?.message ?? resp.statusText, { status: resp.status });
  }
  return data;
};
