import express, { request, response } from 'express';
import ws from 'express-ws';
import { server } from './hocuspocus.js';
import cors from 'cors';
import { getPageContent } from './service/api.js';
import { fetch } from './db/sequelize.js';
import { TiptapTransformer } from '@hocuspocus/transformer';
import * as Y from 'yjs';
import { jsonFromYDoc, jsonToHTML } from './service/transformer.js';
import {delay} from './util/index.js'


const { app } = ws(express());
const port = 1234; // You can change this to any port number you prefer
// Setup cors
app.use(cors());
app.use(express.json());
// Define a route handler for the default home page
app.get('/', (req, res) => {
    res.send(Date.now().toString());
});

async function getDocHtml(docId, editor = 'tiptap') {
    try {
        const buffer = await fetch(docId);
        if (!buffer) return null;
        if (editor === 'block') {
            return new Promise(async (resolve, reject) => {
                const buffer = await fetch(docId);
                if (!buffer) return null;
                const editor = ServerBlockNoteEditor.create();
                const doc = new Y.Doc();
                Y.applyUpdate(doc, data.message);
                const blocks = editor.yXmlFragmentToBlocks(doc.getXmlFragment("default"));
                const html = await editor.blocksToFullHTML(blocks)
                return html;
            });
        } else {
            const doc = new Y.Doc();
            Y.applyUpdate(doc, buffer);
            const jsonDoc = jsonFromYDoc(doc);
            const htmlDoc = jsonToHTML(jsonDoc);
            return htmlDoc;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

app.get('/snapshot/:orgId/:pageId', async (req, res) => {
    try {
        const pageId = req.params.pageId;
        const orgId = req.params.orgId;
        const snapshots = await getRevisions(req.params.pageId, orgId);
        const result = {
            pageId,
            orgId,
            total: snapshots.length,
            revisions: snapshots.map((revision) => {
                return {
                    html: revision.value,
                    timestamp: revision.score,
                };
            })
        };
        res.send(result);
    } catch (error) {
        res.send([]);
    }
});

app.get('/content/:orgId/:pageId', async (req, res) => {
    await delay(1000);
    const editor = req.query.editor;
    const html = await getDocHtml(req.params.pageId, editor);
    if (!html) return res.status(404).json({ message: "Document not found" });
    res.json({ html, timestamp: Date.now() });
});

app.post('/content/:orgId', async (req, res) => {
    try {
        await delay(1000);
        const orgId = req.params.orgId;
        const pageIds = req.body.pageIds;

        if (!pageIds || pageIds.length === 0) {
            return res.status(400).json({ message: "Invalid pageIds" });
        }
        const docs = {};
        const editor = req.query.editor;
        for (const pageId of pageIds) {
            const html = await getDocHtml(pageId, editor);
            if (html) {
                docs[pageId] = { html, timestamp: Date.now() };
            }
        }
        res.json({ docs: docs, meta: { orgId: orgId, total: pageIds?.length, timestamp: Date.now() } });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.ws('/', (websocket, request) => {
    const context = {
        orgId: request.query.orgId
    };
    server.handleConnection(
        websocket,
        request,
        context
    );
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
