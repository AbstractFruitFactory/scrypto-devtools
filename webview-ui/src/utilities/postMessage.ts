import { vscode } from "./vscode"
import type { MessageFromWebview} from '../../../src/messages'

export const postMessageToExtension = (message: MessageFromWebview) => vscode.postMessage(message)