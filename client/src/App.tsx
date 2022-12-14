import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";

import {
  ChatRoom,
  useChatRoomSubscription,
  useGetChatRoomListLazyQuery,
} from "./__generated__/operations-types";

function App() {
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>([]);

  // Query
  const [getChatRoomList] = useGetChatRoomListLazyQuery();
  // Subscription
  const { data: chatRoomSubData } = useChatRoomSubscription();

  useEffect(() => {
    getChatRoomList().then((response) =>
      setChatRoomList(response.data?.chatRoomList ?? [])
    );
  }, [getChatRoomList]);

  useEffect(() => {
    if (chatRoomSubData) {
      setChatRoomList((state) => [...state, chatRoomSubData?.chatRoomCreated]);
    }
  }, [chatRoomSubData]);

  return <Dashboard chatRoomList={chatRoomList} />;
}

export default App;
