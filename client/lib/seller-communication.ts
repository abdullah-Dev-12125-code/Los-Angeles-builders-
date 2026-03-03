export type SellerMessageType = "warning" | "notification" | "rent" | "tax";

export interface SellerCommunicationSettings {
  sellerId: string;
  allowRemoteConnection: boolean;
}

export interface SellerMessage {
  id: string;
  sellerId: string;
  type: SellerMessageType;
  title: string;
  message: string;
  amount?: number;
  createdAt: string;
}

const SETTINGS_KEY = "sellerCommunicationSettings";
const MESSAGES_KEY = "sellerCommunicationMessages";

const readSettings = (): Record<string, SellerCommunicationSettings> => {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, SellerCommunicationSettings>;
  } catch {
    return {};
  }
};

const writeSettings = (settings: Record<string, SellerCommunicationSettings>) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const readMessages = (): SellerMessage[] => {
  const raw = localStorage.getItem(MESSAGES_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SellerMessage[];
  } catch {
    return [];
  }
};

const writeMessages = (messages: SellerMessage[]) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const getSellerCommunicationSettings = (sellerId: string): SellerCommunicationSettings => {
  const settings = readSettings();
  return settings[sellerId] ?? { sellerId, allowRemoteConnection: true };
};

export const updateSellerCommunicationSettings = (
  sellerId: string,
  next: Partial<Omit<SellerCommunicationSettings, "sellerId">>,
): SellerCommunicationSettings => {
  const settings = readSettings();
  const updated: SellerCommunicationSettings = {
    ...getSellerCommunicationSettings(sellerId),
    ...next,
    sellerId,
  };
  settings[sellerId] = updated;
  writeSettings(settings);
  return updated;
};

export const addSellerMessage = (
  sellerId: string,
  payload: Omit<SellerMessage, "id" | "sellerId" | "createdAt">,
): SellerMessage => {
  const messages = readMessages();
  const entry: SellerMessage = {
    id: `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sellerId,
    createdAt: new Date().toISOString(),
    ...payload,
  };

  writeMessages([entry, ...messages]);
  return entry;
};

export const getMessagesForSeller = (sellerId: string): SellerMessage[] => {
  return readMessages().filter((message) => message.sellerId === sellerId);
};

export const isSellerAvailableOnline = (sellerId: string): boolean => {
  return getSellerCommunicationSettings(sellerId).allowRemoteConnection;
};
