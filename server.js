/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import axios from 'axios';
import { fileURLToPath } from 'node:url';
import adapter from 'axios/lib/adapters/http.js';

axios.defaults.adapter = adapter;
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const isProduction = process.env.NODE_ENV === 'production';
export async function createServer(root = process.cwd(), isProd = isProduction) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const resolve = (p) => path.resolve(__dirname, p);
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : '';
  const manifest = isProd ? JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')) : {};
  // @ts-ignore

  const app = express();

  let vite;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100
        }
      },
      appType: 'custom'
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import('compression')).default());
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false
      })
    );
  }

  app.use('/mock/getuserinfo', async (req, res) => {
    const sessionId = req.headers.sessionid || req.headers.sessionId;
    let user = null;
    if (sessionId){
      user = {
        name: 'Johnny ' + sessionId,
        userId: 'ID-' + sessionId,
        token: 'token-' + sessionId
      };
    }
    const data = {
      data: user,
      code: 0,
      msg: ''
    };
    setTimeout(() => {
      res.end(JSON.stringify(data));
    }, randomDelay());
  });

  app.use('/mock/getfavoritefruitlist', async (req, res) => {
    const names = ['Orange', 'Apricot', 'Apple', 'Plum', 'Pear', 'Pome', 'Banana', 'Cherry', 'Grapes', 'Peach'];
    const favFruit = {
      user: '',
      fruitList: []
    };
    const token = req.headers.token;

    if (token) {
      const random = names.sort(() => 0.5 - Math.random());
      favFruit.user = `Johnny (${token})`;
      favFruit.fruitList = random.slice(0, 5);
    }
    const data = {
      data: favFruit,
      code: 0,
      msg: ''
    };
    setTimeout(() => {
      res.end(JSON.stringify(data));
    }, randomDelay());

  });

  app.use('/mock/getfavoritecolor', async (req, res) => {
    const names = ['Orange', 'Green', 'White', 'Brown', 'Pink', 'Blue', 'Red'];
    const favColor = {
      user: '',
      color: ''
    };
    const token = req.headers.token;

    if (token) {
      const random = names.sort(() => 0.5 - Math.random());
      favColor.user = `Johnny (${token})`;
      favColor.color = random[0];
    }

    const data = {
      data: favColor,
      code: 0,
      msg: ''
    };
    setTimeout(() => {
      res.end(JSON.stringify(data));
    }, randomDelay());
  });

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      let sessionId = 'anonymous';
      if(req?.headers?.cookie) {
        sessionId = req.headers.cookie.split('; ')?.find(row => row.startsWith('sessionId='));
      }

      let template, render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server')).render;
      } else {
        template = indexProd;
        render = (await import('./dist/server/entry-server.js')).render;
      }

      const [appHtml, state, links, teleports] = await render(url, sessionId, manifest);

      const html = template
        .replace(`<!--preload-links-->`, links)
        .replace(`'<pinia-store>'`, state)
        .replace(`<!--app-html-->`, appHtml)
        .replace(/(\n|\r\n)\s*<!--app-teleports-->/, teleports);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(8085, () => {
      console.log('http://localhost:8085');
    })
  );
}

function randomDelay(base = 50, extra = 200) {
  return Math.floor(Math.random() * extra + base);
}