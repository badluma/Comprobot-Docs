import { App, TFile } from "obsidian";
import { RichPresenceVaultConfig } from "./types";

export interface VariableContext {
  app: App;
  file: TFile | null;
  vaultConfig: RichPresenceVaultConfig;
  sessionStart: number;
  fileOpenTime: number;
  isIdle: boolean;
}

/**
 * Built-in variables available in all display strings:
 * {file_name}       - Active file name without extension
 * {file_name_ext}   - Active file name with extension
 * {file_path}       - Full path from vault root
 * {file_ext}        - File extension (e.g. "md")
 * {vault_name}      - Vault name
 * {vault_path}      - Absolute path to vault
 * {file_count}      - Total number of files in vault
 * {note_count}      - Number of markdown files
 * {folder}          - Parent folder of active file
 * {time}            - Current time HH:MM
 * {date}            - Current date YYYY-MM-DD
 * {session_time}    - Time since session start (e.g. "2h 15m")
 * {custom.KEY}      - Custom variable from config variables block
 */
export function resolveVariables(
  template: string,
  ctx: VariableContext
): string {
  if (!template) return "";

  const { app, file, vaultConfig, sessionStart, fileOpenTime } = ctx;
  const vault = app.vault;
  const now = Date.now();

  // Gather all files
  const allFiles = vault.getFiles();
  const noteFiles = allFiles.filter((f) => f.extension === "md");

  // Time helpers
  const dateObj = new Date(now);
  const pad = (n: number) => String(n).padStart(2, "0");
  const timeStr = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
  const dateStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;

  function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hours > 0) return `${hours}h ${pad(mins)}m`;
    return `${mins}m`;
  }

  const builtins: Record<string, string> = {
    file_name: file ? file.basename : "No file open",
    file_name_ext: file ? file.name : "No file open",
    file_path: file ? file.path : "",
    file_ext: file ? file.extension : "",
    vault_name: vault.getName(),
    vault_path: (vault.adapter as any).getBasePath?.() ?? "",
    file_count: String(allFiles.length),
    note_count: String(noteFiles.length),
    folder: file ? (file.parent?.name ?? "/") : "",
    time: timeStr,
    date: dateStr,
    session_time: formatDuration(now - sessionStart),
    file_time: fileOpenTime ? formatDuration(now - fileOpenTime) : "0m",
  };

  // Custom variables
  const customVars = vaultConfig.variables ?? {};

  return template.replace(/\{([^}]+)\}/g, (match, key: string) => {
    key = key.trim();

    if (key.startsWith("custom.")) {
      const customKey = key.slice(7);
      return customVars[customKey] ?? match;
    }

    if (key in builtins) return builtins[key];

    return match;
  });
}

/**
 * Get the file-extension-based small icon key/URL from config
 */
export function getFileTypeIcon(
  file: TFile | null,
  vaultConfig: RichPresenceVaultConfig
): string | null {
  if (!file) return null;
  const ext = file.extension.toLowerCase();
  const map = vaultConfig.fileTypeIcons ?? {};
  return map[ext] ?? null;
}
