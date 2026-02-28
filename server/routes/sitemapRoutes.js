// server/routes/sitemapRoutes.js
import express from 'express';
import Product from '../models/productModel.js';
import Mixology from '../models/mixologyModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const baseUrl = 'https://palmaritobacanora.com'; // 👈 Tu dominio real

    // 1. Obtener datos de la DB
    const [products, recipes] = await Promise.all([
      Product.find({ isActive: true }).select('slug updatedAt'),
      Mixology.find({ isActive: true }).select('slug updatedAt')
    ]);

    // 2. Construir el XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Rutas Estáticas
    const staticPages = ['', '/shop', '/mixologia', '/nosotros', '/contacto'];
    staticPages.forEach(page => {
      xml += `
        <url>
          <loc>${baseUrl}${page}</loc>
          <changefreq>weekly</changefreq>
          <priority>${page === '' ? '1.0' : '0.8'}</priority>
        </url>`;
    });

    // Rutas Dinámicas: Productos
    products.forEach(p => {
      xml += `
        <url>
          <loc>${baseUrl}/productos/${p.slug}</loc>
          <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>`;
    });

    // Rutas Dinámicas: Mixología
    recipes.forEach(r => {
      xml += `
        <url>
          <loc>${baseUrl}/mixologia/${r.slug}</loc>
          <lastmod>${r.updatedAt.toISOString().split('T')[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>`;
    });

    xml += `</urlset>`;

    // 3. Enviar con el Header correcto
    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch (error) {
    res.status(500).send("Error generando sitemap");
  }
});

export default router;