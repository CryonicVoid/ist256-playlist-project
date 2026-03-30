import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  const file = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(file);

  const posts = data.posts.map((p, index) => ({
    id: p.id,
    title: `Image ${p.id}`,
    description: `Description for image ${p.id}`,
    dateTaken: "2024-01-01",
    thumbnail: p.image,
    full: p.image,
    author: {
      name: "CryonicVoid",
      image: `https://i.pravatar.cc/100?img=${index}`,
      since: "2023",
      channel: "IST256"
    }
  }));

  res.status(200).json(posts);
}