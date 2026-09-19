import "dotenv/config";
import prisma from "../src/lib/prisma";

const files = [
  "IMG-20260918-WA0005.jpg.jpeg", "IMG-20260918-WA0008.jpg.jpeg",
  "IMG-20260918-WA0013.jpg.jpeg", "IMG-20260918-WA0019.jpg.jpeg",
  "IMG-20260918-WA0023.jpg.jpeg", "IMG-20260918-WA0028.jpg.jpeg",
  "IMG-20260918-WA0060.jpg.jpeg", "IMG-20260918-WA0061.jpg.jpeg",
];
const baseUrl = `http://localhost:${process.env.PORT || 5000}/images/product%20image`;

async function main() {
  const images = await prisma.artworkImage.findMany({ orderBy: { position: "asc" } });
  await Promise.all(images.map((image, index) => prisma.artworkImage.update({
    where: { id: image.id },
    data: { url: `${baseUrl}/${files[index % files.length]}` },
  })));
  console.log(`Updated ${images.length} artwork image records.`);
}

main().finally(() => prisma.$disconnect());
