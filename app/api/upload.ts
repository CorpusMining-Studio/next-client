const ES_URL = process.env.NEXT_PUBLIC_ES_URL

type UploadResponse = {
  data: any
  error: null | string
}

class Upload {
  constructor() {}

  async uploadChat(body: string): Promise<UploadResponse> {
    const response = await fetch(`${ES_URL}/api/upload/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
    if (!response.ok) {
      return { data: null, error: "Failed to upload chat data" }
    }

    const data = await response.json()
    return { data: data, error: null }
  }
}

const UploadService = new Upload()
export default UploadService
