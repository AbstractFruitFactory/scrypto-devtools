import { WebviewView } from "vscode";
import { MessageToWebview } from "../messages";

export const postMessageToWebview = (message: MessageToWebview, webview: WebviewView) => webview.webview.postMessage(message)