const ES_URL = process.env.NEXT_PUBLIC_ES_URL

type UpdateResponse = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  data: any
  error: null | string
}

class Update {
  constructor() {}

  async updateChatName(
    id: string,
    user: string,
    name: string
  ): Promise<UpdateResponse> {
    const response = await fetch(`${ES_URL}/api/change/chatname`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: id,
        user_id: user,
        chat_name: name,
      }),
    })
    if (!response.ok) {
      console.log(await response.text())
      return { data: null, error: "Failed to update chat name" }
    }

    const data = await response.json()
    return { data: data, error: null }
  }
}

const UpdateService = new Update()
export default UpdateService
