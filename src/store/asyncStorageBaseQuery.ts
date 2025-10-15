// store/asyncStorageBaseQuery.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

interface QueryArgs {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  params?: Record<string, any>;
}

const asyncStorageBaseQuery = () => {
  return async ({ url, method = "GET", body, params }: QueryArgs) => {
    try {
      const storageKey = url.split("/")[0];

      switch (method) {
        case "GET": {
          if (params?.id) {
            const data = await AsyncStorage.getItem(storageKey);
            const items = data ? JSON.parse(data) : [];
            const item = items.find((item: any) => item.id === params.id);
            return { data: item || null };
          } else if (params?.userId) {
            const data = await AsyncStorage.getItem(storageKey);
            const items = data ? JSON.parse(data) : [];
            const userItems = items.filter(
              (item: any) => item.userId === params.userId
            );
            return { data: userItems };
          } else {
            const data = await AsyncStorage.getItem(storageKey);
            return { data: data ? JSON.parse(data) : [] };
          }
        }

        case "POST": {
          const data = await AsyncStorage.getItem(storageKey);
          const items = data ? JSON.parse(data) : [];

          const newItem = {
            ...body,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          items.push(newItem);
          await AsyncStorage.setItem(storageKey, JSON.stringify(items));
          return { data: newItem };
        }

        case "PUT": {
          if (params?.id) {
            const data = await AsyncStorage.getItem(storageKey);
            const items = data ? JSON.parse(data) : [];
            const index = items.findIndex((item: any) => item.id === params.id);

            if (index !== -1) {
              items[index] = {
                ...items[index],
                ...body,
                updatedAt: new Date().toISOString(),
              };
              await AsyncStorage.setItem(storageKey, JSON.stringify(items));
              return { data: items[index] };
            } else {
              return { error: { status: 404, data: "Item not found" } };
            }
          } else {
            await AsyncStorage.setItem(storageKey, JSON.stringify(body));
            return { data: body };
          }
        }

        case "DELETE": {
          if (params?.id) {
            const data = await AsyncStorage.getItem(storageKey);
            const items = data ? JSON.parse(data) : [];
            const filteredItems = items.filter(
              (item: any) => item.id !== params.id
            );
            await AsyncStorage.setItem(
              storageKey,
              JSON.stringify(filteredItems)
            );
            return { data: { success: true, id: params.id } };
          } else {
            await AsyncStorage.removeItem(storageKey);
            return { data: { success: true } };
          }
        }

        default:
          return {
            error: {
              status: "METHOD_NOT_SUPPORTED",
              data: `Method ${method} not supported`,
            },
          };
      }
    } catch (error: any) {
      return {
        error: {
          status: "FETCH_ERROR",
          data: error?.message || "Unknown error occurred",
        },
      };
    }
  };
};

export default asyncStorageBaseQuery;