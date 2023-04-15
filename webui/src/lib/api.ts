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

export const fetchPouleInfo = async () => {
  const resp = await fetch("/api/poules");
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

export const fetchPouleMatches = async (id: number) => {
  const resp = await fetch(`/api/poules/${id}/matches`);
  const data: API.Match = await resp.json();
  return resp.ok ? data : [];
};
