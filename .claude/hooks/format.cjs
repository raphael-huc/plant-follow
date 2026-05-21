// PostToolUse Write|Edit hook: auto-format the file Claude just touched with Prettier.
// Reads tool payload from stdin, extracts the file path, runs `npx prettier --write --ignore-unknown <path>`.
// Silently no-ops on parse errors or unknown payloads — never blocks Claude.
let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(data);
    const filePath =
      (payload.tool_response && payload.tool_response.filePath) ||
      (payload.tool_input && payload.tool_input.file_path);
    if (!filePath) return;
    require("child_process").spawnSync(
      "npx",
      ["prettier", "--write", "--ignore-unknown", filePath],
      { stdio: "inherit", shell: true }
    );
  } catch {
    // swallow — formatting failures should never block a tool
  }
});
