import { createContext, useContext, useState } from 'react'

export interface ChatMsg {
  id: number
  role: 'user' | 'assistant'
  content: string
  isNew?: boolean
  isConfirmation?: boolean
}

interface ChatContextType {
  messages: ChatMsg[]
  isLoading: boolean
  addMessage: (msg: Omit<ChatMsg, 'id'>) => void
  markDone: (id: number) => void
  setIsLoading: (v: boolean) => void
}

export const ChatContext = createContext<ChatContextType>({
  messages: [],
  isLoading: false,
  addMessage: () => {},
  markDone: () => {},
  setIsLoading: () => {},
})

export function useChatContext() {
  return useContext(ChatContext)
}

let _msgId = 0
// Module-level setter so App.tsx can inject messages without being inside the tree
let _addMessageFn: ((msg: Omit<ChatMsg, 'id'>) => void) | null = null
export function addGlobalChatMessage(msg: Omit<ChatMsg, 'id'>) {
  _addMessageFn?.(msg)
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (msg: Omit<ChatMsg, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: ++_msgId }])
  }
  // Register globally for App.tsx booking confirmation
  _addMessageFn = addMessage

  const markDone = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isNew: false } : m))
  }

  return (
    <ChatContext.Provider value={{ messages, isLoading, addMessage, markDone, setIsLoading }}>
      {children}
    </ChatContext.Provider>
  )
}
