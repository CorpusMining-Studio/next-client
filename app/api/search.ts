const ES_URL = process.env.NEXT_PUBLIC_ES_URL

type SearchResponse = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any
  error: null | string
}

class Search {
  constructor() {}

  async searchChat(userId: string, chatId: string): Promise<SearchResponse> {
    const response = await fetch(`${ES_URL}/api/search/chatroom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    })

    if (!response.ok) {
      return { data: null, error: "Failed to fetch chat data" }
    }

    const history = await response.json()
    return { data: history, error: null }
  }

  async searchUserChat(userId: string): Promise<SearchResponse> {
    const response = await fetch(ES_URL + "/api/search/userchat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    })
    if (!response.ok) {
      return { data: null, error: "Failed to fetch user chat data" }
    }
    const data = await response.json()
    return { data: data, error: null }
  }
}

const SearchService = new Search()
export default SearchService
