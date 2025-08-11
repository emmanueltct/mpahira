// utils/uploadImage.ts

export async function uploadImage(file: File): Promise<string> {
  // simulate upload
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      resolve(fakeUrl); // Replace with real upload URL
    }, 1000);
  });
}
