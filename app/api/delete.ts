const ES_URL = process.env.NEXT_PUBLIC_ES_URL

type DeleteResponse = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any
  error: null | string
}

class Delete {
  constructor() {}

  async deleteChat(userId: string, chatId: string): Promise<DeleteResponse> {
    const response = await fetch(`${ES_URL}/api/delete/chat`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, chat_id: chatId }),
    })
    if (!response.ok) {
      return { data: null, error: "Failed to upload chat data" }
    }

    const data = await response.json()
    return { data: data, error: null }
  }
}

const DeleteService = new Delete()
export default DeleteService
