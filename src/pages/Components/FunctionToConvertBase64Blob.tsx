export function base64ToBlob(
  base64: string | null,
  contentType: string = "",
  sliceSize: number = 512
): Blob | null {
  if (!base64) {
    console.error("base64 input is null or empty.");
    return null;
  }

  const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
