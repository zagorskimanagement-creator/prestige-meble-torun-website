const GITHUB_API = 'https://api.github.com';

async function githubRequest(path, options = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'prestige-meble-admin',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

async function getFileSha(repo, branch, filePath) {
  try {
    const data = await githubRequest(`/repos/${repo}/contents/${filePath}?ref=${branch}`);
    return data.sha;
  } catch (err) {
    return null;
  }
}

async function putFile(repo, branch, filePath, contentBase64, message) {
  const sha = await getFileSha(repo, branch, filePath);
  return githubRequest(`/repos/${repo}/contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { password, title, description, imageBase64, imageName } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Nieprawidłowe hasło' });
    return;
  }

  if (!title || !description) {
    res.status(400).json({ error: 'Tytuł i opis są wymagane' });
    return;
  }

  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'master';

  try {
    let imagePath = req.body.currentImage || 'assets/fameg-wyprzedaz.jpg';

    if (imageBase64 && imageName) {
      const safeName = imageName.replace(/[^a-zA-Z0-9._-]/g, '_');
      imagePath = `assets/sale/${Date.now()}-${safeName}`;
      const base64Content = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      await putFile(repo, branch, imagePath, base64Content, 'Aktualizacja zdjęcia wyprzedaży');
    }

    const saleData = {
      image: imagePath,
      title,
      description,
      updatedAt: new Date().toISOString(),
    };
    const saleJsonBase64 = Buffer.from(JSON.stringify(saleData, null, 2)).toString('base64');
    await putFile(repo, branch, 'sale.json', saleJsonBase64, 'Aktualizacja wyprzedaży');

    res.status(200).json({ ok: true, sale: saleData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
