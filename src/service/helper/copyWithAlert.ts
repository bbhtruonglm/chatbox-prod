/**
 * Custom copy to clipboard
 */
import { toast } from "./alert";

export const copyToClipboard = (
    text: string,
    alert: string
):void => {
    navigator.clipboard.writeText(text)
    toast('success', alert)
}