// The only browser storage this tool uses: the strictly necessary unlock flag.
const KEY = "esrs-unlocked";

export function readUnlocked() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function writeUnlocked() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* page works without storage */
  }
}
