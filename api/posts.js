import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'posts.json');
  const file = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(file);

  const posts = data.posts.map((p, index) => ({
    id: p.id,
    title: `Image ${p.id}`,
    description: p.description,
    dateTaken: p.dateTaken,
    thumbnail: p.full,
    full: p.full,
    author: p.author
  }));

  res.status(200).json(posts);
}