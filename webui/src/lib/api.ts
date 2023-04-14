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
