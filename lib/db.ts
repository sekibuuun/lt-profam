import { v4 as uuidv4 } from "uuid"

export interface FileData {
  id: string
  name: string
  content: string // Base64 encoded PDF content
}

export interface Invite {
  id: string
  files: FileData[]
}

// Mock database using localStorage
const STORAGE_KEY = "lt-slide-share"

export function createInvite(): string {
  const inviteId = uuidv4()
  const invite: Invite = { id: inviteId, files: [] }
  const storage = getStorage()
  storage[inviteId] = invite
  saveStorage(storage)
  return inviteId
}

export function saveInvite(inviteId: string, files: FileData[]): boolean {
  const storage = getStorage()
  if (storage[inviteId]) {
    storage[inviteId].files = files
    saveStorage(storage)
    return true
  }
  return false
}

export function getInvite(inviteId: string): Invite | null {
  const storage = getStorage()
  return storage[inviteId] || null
}

export function updateFileName(inviteId: string, fileId: string, newName: string): boolean {
  const storage = getStorage()
  const invite = storage[inviteId]
  if (invite) {
    const file = invite.files.find((f) => f.id === fileId)
    if (file) {
      file.name = newName
      saveStorage(storage)
      return true
    }
  }
  return false
}

export function deleteFile(inviteId: string, fileId: string): boolean {
  const storage = getStorage()
  const invite = storage[inviteId]
  if (invite) {
    invite.files = invite.files.filter((f) => f.id !== fileId)
    saveStorage(storage)
    return true
  }
  return false
}

function getStorage(): Record<string, Invite> {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : {}
}

function saveStorage(storage: Record<string, Invite>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
}

