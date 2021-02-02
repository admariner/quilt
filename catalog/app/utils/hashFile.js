export default async function hashFile(file) {
  if (!window.crypto || !window.crypto.subtle || !window.crypto.subtle.digest) return
  try {
    const buf = await file.arrayBuffer()
    const hashBuf = await window.crypto.subtle.digest('SHA-256', buf)
    // eslint-disable-next-line consistent-return
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } catch (e) {
    // return undefined on error
  }
}
