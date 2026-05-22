import type { Message } from "@/model/User"

export default interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Message[]
}